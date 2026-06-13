// =============================================================
// HomeComponent — Tela inicial do jogo.
//
// Responsabilidade:
//   - Exibir a apresentação do jogo (título, lore, botão jogar)
//   - Verificar se já existe uma partida salva no localStorage
//   - Se sim: oferecer continuar OU começar nova partida
//   - Se não: navegar para /create ao clicar em "Jogar"
//
// Esta tela NÃO faz requisições HTTP — só lê o localStorage
// via GameService e usa o Router para navegar.
// =============================================================

import { Component, OnInit, inject } from '@angular/core';
import { Router }                    from '@angular/router';
import { CommonModule }              from '@angular/common';

// GameService: estado global da partida (localStorage, playerId)
import { GameService } from '../../core/services/game.service';

@Component({
    selector:    'app-home',
    standalone:  true,

    // CommonModule fornece diretivas básicas do Angular:
    // *ngIf, *ngFor, etc. — usadas no template HTML.
    imports:     [CommonModule],

    templateUrl: './home.component.html',
    styleUrls:   ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    // ---------------------------------------------------------
    // Injeção de dependências (forma moderna do Angular 14+)
    // inject() substitui o constructor(...) para injetar services.
    // ---------------------------------------------------------
    private router      = inject(Router);
    private gameService = inject(GameService);

    // ---------------------------------------------------------
    // Estado local do componente
    // Controla se exibe o botão "Continuar partida" ou não.
    // ---------------------------------------------------------

    // true se encontrar um playerId salvo no localStorage
    temPartidaSalva = false;

    // ---------------------------------------------------------
    // ngOnInit — executado pelo Angular ao criar o componente.
    // Verificamos se já existe uma partida salva para decidir
    // quais botões mostrar na tela.
    // ---------------------------------------------------------
    ngOnInit(): void {
        const idSalvo = this.gameService.loadPlayerIdFromStorage();
        this.temPartidaSalva = idSalvo !== null;
    }

    // ---------------------------------------------------------
    // novaPartida
    // Limpa qualquer partida anterior e vai para criação
    // de personagem. Chamado pelo botão "Começar aventura".
    // ---------------------------------------------------------
    novaPartida(): void {
        // Limpa memória e localStorage antes de criar nova partida
        this.gameService.clearGame();
        this.gameService.clearStorage();

        // Navega para a tela de criação de personagem
        this.router.navigate(['/create']);
    }

    // ---------------------------------------------------------
    // continuarPartida
    // Navega direto para a cena salva do jogador.
    // O SceneComponent vai carregar os dados da API no ngOnInit.
    // Chamado pelo botão "Continuar partida".
    // ---------------------------------------------------------
    continuarPartida(): void {
        // O guard (GameActiveGuard) vai verificar o localStorage
        // e deixar a rota /scene passar normalmente.
        // Usamos 'brill_arrival' como fallback seguro — o SceneComponent
        // vai buscar a cena correta do jogador via GET /players/:id.
        this.router.navigate(['/scene', 'brill_arrival']);
    }
}