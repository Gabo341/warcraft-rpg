// =============================================================
// src/app/features/scene/scene.component.ts
// Tela principal de jogo — exibe a cena e processa escolhas.
//
// Responsabilidade:
//   1. Receber o slug da URL via @Input() (ex: 'brill_arrival')
//   2. Buscar o jogador no GameService ou na API se vier de F5
//   3. Buscar a cena pelo slug via SceneService
//   4. Buscar os poderes do jogador via PlayerService
//   5. Exibir a cena, as choices e o painel de poderes
//   6. Processar a escolha do jogador via SceneService
//   7. Exibir popup de poder desbloqueado (se houver)
//   8. Navegar para a próxima cena ou para /ending/:type
//
// Fluxo completo de uma escolha:
//   Jogador clica em uma choice
//   → SceneService.processChoice(playerId, choiceId)
//   → POST /players/:id/choose
//   → backend seta flag, avança cena, desbloqueia poder
//   → retorna { nextSceneSlug, flagSet, powerUnlocked }
//   → se powerUnlocked: exibe popup por 3 segundos
//   → se nextSceneSlug é 'ending_light' ou 'ending_dark':
//       navega para /ending/light ou /ending/dark
//   → senão: navega para /scene/:nextSceneSlug
// =============================================================

import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { GameService }   from '../../core/services/game.service';
import { SceneService }  from '../../core/services/scene.service';
import { PlayerService } from '../../core/services/player.service';

// Tipos compartilhados
import { Scene, Power } from '../../core/services/game.service';

// Shared components usados no template desta tela
import { SceneDisplayComponent } from '../../shared/scene-display/scene-display.component';
import { ChoiceButtonComponent } from '../../shared/choice-button/choice-button.component';
import { PowersPanelComponent }  from '../../shared/powers-panel/powers-panel.component';


@Component({
  selector:    'app-scene',
  standalone:  true,
  imports:     [
    // Não importamos CommonModule no Angular 22 —
    // usamos a sintaxe @if e @for nativa no template
    SceneDisplayComponent,
    ChoiceButtonComponent,
    PowersPanelComponent,
  ],
  templateUrl: './scene.component.html',
  styleUrls:   ['./scene.component.css'],
})
export class SceneComponent implements OnInit, OnChanges {

  // ---------------------------------------------------------
  // @Input() slug
  //
  // Recebe o parâmetro :slug da URL automaticamente graças ao
  // withComponentInputBinding() configurado no app.config.ts.
  //
  // Exemplo: URL /scene/brill_arrival → slug = 'brill_arrival'
  // ---------------------------------------------------------
  @Input() slug!: string;

  // ---------------------------------------------------------
  // Injeção de dependências
  // ---------------------------------------------------------
  private router        = inject(Router);
  private gameService   = inject(GameService);
  private sceneService  = inject(SceneService);
  private playerService = inject(PlayerService);
  private cdr = inject(ChangeDetectorRef);

  // ---------------------------------------------------------
  // Estado local do componente
  // ---------------------------------------------------------

  // Cena atual carregada do backend
  cena: Scene | null = null;

  // Poderes desbloqueados do jogador — passados para o painel
  poderes: Power[] = [];

  // true enquanto aguarda a API responder
  carregando = false;

  // true enquanto processa uma escolha — desabilita os botões
  // para evitar duplo clique enquanto a API não responde
  processando = false;

  // Mensagem de erro para exibir ao usuário (ou null se não há)
  erro: string | null = null;

  // Nome do poder desbloqueado — exibe o popup quando não null.
  // Zerado após 3 segundos pelo método exibirPopupPoder().
  poderDesbloqueado: string | null = null;

  // ---------------------------------------------------------
  // Flag interna que controla se o ngOnInit já terminou.
  //
  // O Angular executa ngOnChanges ANTES de ngOnInit.
  // Sem este controle, o ngOnChanges tentaria carregar a cena
  // antes do jogador estar carregado — causando carregamento
  // infinito ou erro silencioso.
  // ---------------------------------------------------------
  private inicializado = false;

  // ---------------------------------------------------------
  // ngOnInit — executado UMA VEZ quando o componente é criado.
  //
  // Caso de uso principal: primeira vez que o jogador acessa
  // a cena, incluindo após F5 (recarregar a página).
  // ---------------------------------------------------------
  ngOnInit(): void {

    // Verifica se já há jogador em memória (navegação normal)
    if (!this.gameService.isGameActive()) {

      // Sem jogador em memória — tenta recuperar do localStorage
      const idSalvo = this.gameService.loadPlayerIdFromStorage();

      if (!idSalvo) {
        // Não há partida ativa nem salva — volta para home
        this.router.navigate(['/']);
        return;
      }

      // Recarrega o jogador da API usando o ID salvo.
      // Após carregar, marca como inicializado e carrega a cena.
      this.playerService.getPlayerById(idSalvo).subscribe({
        next: (player) => {
          this.gameService.setPlayer(player);
          this.inicializado = true;
          this.carregarCena();
          this.carregarPoderes();
        },
        error: () => {
          // ID salvo inválido ou API fora — volta para home
          this.gameService.clearStorage();
          this.router.navigate(['/']);
        },
      });

      return;
    }

    // Jogador já em memória — marca como inicializado e carrega
    this.inicializado = true;
    this.carregarCena();
    this.carregarPoderes();
  }

  // ---------------------------------------------------------
  // ngOnChanges — executado quando um @Input() muda.
  //
  // Caso de uso: navegação entre cenas.
  // O Angular reutiliza o mesmo componente e só muda o @Input()
  // slug — sem recriar o componente inteiro.
  //
  // SimpleChanges permite verificar se é a primeira mudança
  // (firstChange = true) ou uma mudança real de slug.
  // Na primeira execução deixamos o ngOnInit cuidar disso.
  // ---------------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {

    // Ignora a primeira execução — ngOnInit cuida disso.
    // Sem este check, a cena seria carregada duas vezes
    // na primeira navegação para /scene/:slug.
    if (changes['slug']?.firstChange) return;

    // Só recarrega se o componente já foi inicializado
    // e se realmente temos um slug válido
    if (this.inicializado && this.slug) {
      this.carregarCena();
      this.carregarPoderes();
    }
  }

  // ---------------------------------------------------------
  // carregarCena
  // Busca os dados da cena atual via GET /scenes/:slug.
  //
  // Passa o playerId como query param para que o backend
  // filtre as choices pelas flags do jogador.
  // Ex: GET /scenes/brill_arrival?playerId=7bc2...
  // ---------------------------------------------------------
  private carregarCena(): void {
    const playerId = this.gameService.getPlayerId();

    if (!playerId) return;

    this.carregando = true;
    this.erro       = null;
    this.cena       = null;

    this.sceneService.getSceneBySlug(this.slug, playerId).subscribe({
      next: (cena) => {
        console.log('cena:', cena);
        this.cena       = cena;
        this.carregando = false;
        this.gameService.setScene(cena);
        this.cdr.detectChanges(); // ADD
      },
      error: (err) => {
        console.log('erro:', err);
        this.carregando = false;
        this.erro = 'Não foi possível carregar a cena. Tente novamente.';
      },
    });
  }

  // ---------------------------------------------------------
  // carregarPoderes
  // Busca os poderes desbloqueados do jogador via
  // GET /players/:id/powers e atualiza o painel lateral.
  // ---------------------------------------------------------
  private carregarPoderes(): void {
    const playerId = this.gameService.getPlayerId();
    if (!playerId) return;

    this.playerService.getPlayerPowers(playerId).subscribe({
      next: (poderes) => {
        this.poderes = poderes;
      },
      // Erro silencioso — o painel fica vazio mas o jogo continua
      error: () => {
        this.poderes = [];
      },
    });
  }

  // ---------------------------------------------------------
  // onEscolha
  // Chamado pelo ChoiceButtonComponent via (chosen)="onEscolha($event)".
  // Processa a escolha do jogador e navega para a próxima cena.
  // ---------------------------------------------------------
  onEscolha(choice: { id: string }): void {

    // Evita processar duas escolhas ao mesmo tempo
    if (this.processando) return;

    const playerId = this.gameService.getPlayerId();
    if (!playerId) return;

    // Desabilita todos os botões de escolha enquanto processa
    this.processando = true;
    this.erro        = null;

    this.sceneService.processChoice(playerId, choice.id).subscribe({

      next: (resultado) => {
        this.gameService.updateCurrentSceneSlug(resultado.nextSceneSlug);

        if (resultado.flagSet) {
          this.gameService.setFlag(resultado.flagSet);
        }

        if (resultado.powerUnlocked) {
          this.exibirPopupPoder(resultado.powerUnlocked);
        }

        if (resultado.nextSceneSlug === 'ending_light') {
          this.router.navigate(['/ending', 'light']);
          return;
        }

        if (resultado.nextSceneSlug === 'ending_dark') {
          this.router.navigate(['/ending', 'dark']);
          return;
        }

        this.processando = false; // ADD
        this.router.navigate(['/scene', resultado.nextSceneSlug]);
      },

      error: (err) => {
        // Reabilita os botões em caso de erro
        this.processando = false;
        this.erro = err?.error?.error ?? 'Erro ao processar escolha. Tente novamente.';
      },
    });
  }

  // ---------------------------------------------------------
  // exibirPopupPoder
  // Exibe o nome do poder desbloqueado no popup por 3 segundos.
  // Após isso, fecha o popup e recarrega os poderes do painel.
  // ---------------------------------------------------------
  private exibirPopupPoder(nomePoder: string): void {
    this.poderDesbloqueado = nomePoder;

    setTimeout(() => {
      this.poderDesbloqueado = null;
      this.carregarPoderes();
    }, 3000);
  }

}
