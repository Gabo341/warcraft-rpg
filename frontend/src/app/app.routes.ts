// =============================================================
// Definição de todas as rotas da aplicação Angular.
//
// O Angular Router lê este array e decide qual componente
// renderizar de acordo com a URL que o usuário acessar.
//
// Rotas com loadComponent usam "lazy loading" — o Angular
// só baixa o código do componente quando o usuário navegar
// até aquela rota, tornando o carregamento inicial mais rápido.
// =============================================================

import { Routes } from '@angular/router';

// Guard que protege rotas que exigem partida ativa
// (será criado em core/guards/game-active.guard.ts)
import { gameActiveGuard } from './core/guards/game-active.guard';

// -------------------------------------------------------------
// ROTAS DA APLICAÇÃO
//
// Cada objeto do array define uma rota com:
//   path          → trecho da URL (sem a barra inicial)
//   loadComponent → componente carregado sob demanda (lazy)
//   canActivate   → guards executados antes de entrar na rota
// -------------------------------------------------------------
export const routes: Routes = [

    // -----------------------------------------------------------
    // ROTA: /
    // Tela inicial do jogo — apresentação e botão "Jogar".
    // Qualquer visitante pode acessar, sem guard.
    // -----------------------------------------------------------
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home.component')
                .then(m => m.HomeComponent),
    },

    // -----------------------------------------------------------
    // ROTA: /create
    // Tela de criação de personagem — escolha de nome, classe e raça.
    // Também pública: o jogador ainda não tem partida ativa aqui.
    // -----------------------------------------------------------
    {
        path: 'create',
        loadComponent: () =>
            import('./features/character-creation/character-creation.component')
                .then(m => m.CharacterCreationComponent),
    },

    // -----------------------------------------------------------
    // ROTA: /scene/:slug
    // Tela principal do jogo — exibe a cena e as escolhas.
    //
    // :slug é um parâmetro dinâmico. Exemplos de URLs válidas:
    //   /scene/brill_arrival
    //   /scene/stratholme_gates
    //
    // Protegida pelo GameActiveGuard: se o jogador tentar acessar
    // esta rota sem ter uma partida ativa (sem playerId salvo),
    // será redirecionado para a tela inicial.
    // -----------------------------------------------------------
    {
        path: 'scene/:slug',
        loadComponent: () =>
            import('./features/scene/scene.component')
                .then(m => m.SceneComponent),
        canActivate: [gameActiveGuard],
    },

    // -----------------------------------------------------------
    // ROTA: /ending/:type
    // Tela de final da história — exibe o Final A ou Final B.
    //
    // :type receberá 'light' ou 'dark', por exemplo:
    //   /ending/light → Final A (A Chama Resiste)
    //   /ending/dark  → Final B (O Reino Cai)
    //
    // Também protegida: só quem tem partida ativa chega aqui.
    // -----------------------------------------------------------
    {
        path: 'ending/:type',
        loadComponent: () =>
            import('./features/ending/ending.component')
                .then(m => m.EndingComponent),
        canActivate: [gameActiveGuard],
    },

    // -----------------------------------------------------------
    // ROTA CORINGA: **
    // Qualquer URL que não bater com nenhuma rota acima
    // redireciona para a tela inicial.
    //
    // Exemplo: o usuário digita /pagina-invalida → vai para /
    // -----------------------------------------------------------
    {
        path: '**',
        redirectTo: '',
    },

];