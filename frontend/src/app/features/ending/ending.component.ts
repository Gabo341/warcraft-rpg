// =============================================================
// src/app/features/ending/ending.component.ts
// Tela de final do jogo — exibe o Final A ou o Final B.
//
// Responsabilidade:
//   1. Receber o parâmetro :type da URL via @Input()
//      'light' → Final A — "A Chama Resiste"
//      'dark'  → Final B — "O Reino Cai"
//   2. Buscar o jogador na API para exibir o nome e a classe
//   3. Exibir o texto narrativo do final correspondente
//   4. Oferecer opção de recomeçar uma nova partida
//
// Esta tela é o destino final após ending_light ou ending_dark.
// O SceneComponent navega para cá quando o backend retorna
// nextSceneSlug === 'ending_light' ou 'ending_dark'.
//
// Rota: /ending/:type (protegida pelo GameActiveGuard)
// =============================================================

import { Component, Input, OnInit, inject } from '@angular/core';
import { Router }                            from '@angular/router';
import { CommonModule }                      from '@angular/common';

import { GameService }   from '../../core/services/game.service';
import { PlayerService } from '../../core/services/player.service';
import { Player }        from '../../core/services/game.service';

@Component({
    selector:    'app-ending',
    standalone:  true,
    imports:     [CommonModule],
    templateUrl: './ending.component.html',
    styleUrls:   ['./ending.component.css'],
})
export class EndingComponent implements OnInit {

    // ---------------------------------------------------------
    // @Input() type
    // Recebe o parâmetro :type da URL automaticamente graças ao
    // withComponentInputBinding() configurado no app.config.ts.
    //
    // Valores possíveis:
    //   'light' → Final A — jogador foi com Jaina
    //   'dark'  → Final B — jogador ficou com Arthas
    // ---------------------------------------------------------
    @Input() type!: string;

    // ---------------------------------------------------------
    // Injeção de dependências
    // ---------------------------------------------------------
    private router        = inject(Router);
    private gameService   = inject(GameService);
    private playerService = inject(PlayerService);

    // ---------------------------------------------------------
    // Estado local do componente
    // ---------------------------------------------------------

    // Jogador da partida encerrada — usado para exibir nome e classe
    jogador: Player | null = null;

    // Controla o spinner enquanto busca o jogador na API
    carregando = true;

    // ---------------------------------------------------------
    // ngOnInit — carrega o jogador assim que a tela abre.
    //
    // Tenta primeiro o GameService (memória).
    // Se não encontrar (F5), busca pelo ID do localStorage.
    // ---------------------------------------------------------
    ngOnInit(): void {

        // Tenta pegar o jogador já carregado em memória
        const jogadorEmMemoria = this.gameService.getPlayer();

        if (jogadorEmMemoria) {
            this.jogador   = jogadorEmMemoria;
            this.carregando = false;
            return;
        }

        // Sem jogador em memória — tenta recuperar do localStorage
        const idSalvo = this.gameService.loadPlayerIdFromStorage();

        if (!idSalvo) {
            // Sem partida alguma — volta para home
            this.router.navigate(['/']);
            return;
        }

        // Busca o jogador na API pelo ID salvo
        this.playerService.getPlayerById(idSalvo).subscribe({
            next: (player) => {
                this.gameService.setPlayer(player);
                this.jogador    = player;
                this.carregando = false;
            },
            error: () => {
                // API fora ou ID inválido — volta para home
                this.carregando = false;
                this.router.navigate(['/']);
            },
        });
    }

    // ---------------------------------------------------------
    // ehFinalDaLuz
    // Getter que retorna true se o tipo do final é 'light'.
    // Usado no template para alternar entre os textos e estilos
    // do Final A e do Final B sem duplicar HTML.
    // ---------------------------------------------------------
    get ehFinalDaLuz(): boolean {
        return this.type === 'light';
    }

    // ---------------------------------------------------------
    // novaPartida
    // Limpa o estado da partida atual e navega para /create.
    // Chamado pelo botão "Jogar novamente".
    //
    // clearGame() limpa a memória.
    // clearStorage() remove o ID do localStorage.
    // Após isso o guard não bloqueia /create (rota sem guard).
    // ---------------------------------------------------------
    novaPartida(): void {
        this.gameService.clearGame();
        this.gameService.clearStorage();
        this.router.navigate(['/create']);
    }

    // ---------------------------------------------------------
    // voltarInicio
    // Limpa o estado e volta para a tela inicial.
    // Chamado pelo link "Voltar ao início".
    // ---------------------------------------------------------
    voltarInicio(): void {
        this.gameService.clearGame();
        this.gameService.clearStorage();
        this.router.navigate(['/']);
    }

}