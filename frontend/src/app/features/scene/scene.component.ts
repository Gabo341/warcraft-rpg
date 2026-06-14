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

import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { Router }                                       from '@angular/router';
import { CommonModule }                                 from '@angular/common';

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
        CommonModule,
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
    //
    // OnChanges é implementado para detectar quando o slug muda
    // (navegação entre cenas) e recarregar os dados da nova cena.
    // ---------------------------------------------------------
    @Input() slug!: string;

    // ---------------------------------------------------------
    // Injeção de dependências
    // ---------------------------------------------------------
    private router        = inject(Router);
    private gameService   = inject(GameService);
    private sceneService  = inject(SceneService);
    private playerService = inject(PlayerService);

    // ---------------------------------------------------------
    // Estado local do componente
    // ---------------------------------------------------------

    // Cena atual carregada do backend
    cena: Scene | null = null;

    // Poderes desbloqueados do jogador — passados para o painel
    poderes: Power[] = [];

    // true enquanto aguarda a API responder (cena ou escolha)
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
    // ngOnInit — executado UMA VEZ quando o componente é criado.
    //
    // Caso de uso: jogador recarregou a página (F5).
    // O GameService perdeu o estado em memória, mas o localStorage
    // ainda tem o playerId. Precisamos recarregar o jogador da API
    // antes de carregar a cena.
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

            // Recarrega o jogador da API usando o ID salvo
            // Após carregar, chama carregarCena() para continuar
            this.playerService.getPlayerById(idSalvo).subscribe({
                next: (player) => {
                    this.gameService.setPlayer(player);
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

        // Jogador já em memória — carrega cena e poderes direto
        this.carregarCena();
        this.carregarPoderes();
    }

    // ---------------------------------------------------------
    // ngOnChanges — executado quando um @Input() muda.
    //
    // Caso de uso: navegação entre cenas.
    // O Angular reutiliza o mesmo componente e só muda o @Input()
    // slug — sem recriar o componente inteiro. Por isso precisamos
    // do ngOnChanges para detectar a mudança e recarregar os dados.
    //
    // Não recarrega na primeira vez (ngOnInit já cuida disso).
    // ---------------------------------------------------------
    ngOnChanges(): void {
        // Se o jogador já está em memória e temos um slug,
        // recarrega a cena sempre que o slug mudar
        if (this.gameService.isGameActive() && this.slug) {
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

        // Sem jogador — não há como filtrar as choices por flags
        if (!playerId) return;

        this.carregando = true;
        this.erro       = null;

        this.sceneService.getSceneBySlug(this.slug, playerId).subscribe({
            next: (cena) => {
                this.cena      = cena;
                this.carregando = false;

                // Salva a cena no GameService para outros componentes
                // poderem acessar sem precisar buscar novamente
                this.gameService.setScene(cena);
            },
            error: () => {
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
    //
    // Recebe o objeto Choice completo emitido pelo botão.
    // Usa apenas o choice.id para enviar ao backend.
    // ---------------------------------------------------------
    onEscolha(choice: { id: string }): void {

        // Evita processar duas escolhas ao mesmo tempo
        if (this.processando) return;

        const playerId = this.gameService.getPlayerId();
        if (!playerId) return;

        // Desabilita todos os botões de escolha enquanto processa
        this.processando = true;
        this.erro        = null;

        // Chama POST /players/:id/choose via SceneService
        this.sceneService.processChoice(playerId, choice.id).subscribe({

            next: (resultado) => {
                // Atualiza a cena atual no GameService
                this.gameService.updateCurrentSceneSlug(resultado.nextSceneSlug);

                // Se o backend setou uma flag, atualiza o estado local
                if (resultado.flagSet) {
                    this.gameService.setFlag(resultado.flagSet);
                }

                // Se desbloqueou um poder, exibe o popup por 3 segundos
                // e recarrega os poderes após fechar
                if (resultado.powerUnlocked) {
                    this.exibirPopupPoder(resultado.powerUnlocked);
                }

                // Verifica se chegou a um final do jogo
                if (resultado.nextSceneSlug === 'ending_light') {
                    this.router.navigate(['/ending', 'light']);
                    return;
                }

                if (resultado.nextSceneSlug === 'ending_dark') {
                    this.router.navigate(['/ending', 'dark']);
                    return;
                }

                // Navega para a próxima cena normal
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

        // setTimeout: aguarda 3 segundos e fecha o popup
        setTimeout(() => {
            this.poderDesbloqueado = null;

            // Recarrega os poderes para o painel refletir o novo poder
            this.carregarPoderes();
        }, 3000);
    }

}