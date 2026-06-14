// =============================================================
// app.routes.ts — Definição das rotas da aplicação.
//
// Cada rota mapeia uma URL para um componente Angular.
// O Router lê este arquivo e decide qual componente renderizar
// dentro do <router-outlet> do AppComponent quando a URL muda.
//
// Rotas da aplicação (conforme 03_arquitetura_pastas.docx):
//   /              → HomeComponent          (sem guard)
//   /create        → CharacterCreationComponent (sem guard)
//   /scene/:slug   → SceneComponent         (com guard)
//   /ending/:type  → EndingComponent         (com guard)
//
// O gameActiveGuard protege /scene e /ending:
// se o jogador tentar acessar essas URLs diretamente sem ter
// uma partida ativa, é redirecionado para /.
// =============================================================

import { Routes } from '@angular/router';

// Guard que protege rotas que exigem partida ativa
import { gameActiveGuard } from './core/guards/game-active.guard';

// Componentes de cada tela
// Usamos lazy loading (loadComponent) em vez de importar direto:
// o Angular só baixa o código do componente quando o usuário
// navegar para aquela rota — melhora o tempo de carregamento inicial.
export const routes: Routes = [

    // ----------------------------------------------------------
    // / → Tela inicial
    // Sempre acessível — não exige partida ativa.
    // ----------------------------------------------------------
    {
        path: '',
        loadComponent: () =>
            import('./features/home/home.component')
                .then(m => m.HomeComponent),
    },

    // ----------------------------------------------------------
    // /create → Criação de personagem
    // Sempre acessível — o jogador ainda não tem partida aqui.
    // ----------------------------------------------------------
    {
        path: 'create',
        loadComponent: () =>
            import('./features/character-creation/character-creation.component')
                .then(m => m.CharacterCreationComponent),
    },

    // ----------------------------------------------------------
    // /scene/:slug → Tela principal de jogo
    //
    // :slug é um parâmetro dinâmico — ex: /scene/brill_arrival
    // O SceneComponent recebe o slug via @Input() graças ao
    // withComponentInputBinding() configurado no app.config.ts.
    //
    // canActivate: executa o gameActiveGuard antes de renderizar.
    // Se não há partida ativa, redireciona para /.
    // ----------------------------------------------------------
    {
        path: 'scene/:slug',
        loadComponent: () =>
            import('./features/scene/scene.component')
                .then(m => m.SceneComponent),
        canActivate: [gameActiveGuard],
    },

    // ----------------------------------------------------------
    // /ending/:type → Tela de final
    //
    // :type recebe 'light' ou 'dark' — define qual final exibir.
    // Também protegida pelo guard: o jogador só chega aqui
    // depois de completar o jogo, não diretamente pela URL.
    // ----------------------------------------------------------
    {
        path: 'ending/:type',
        loadComponent: () =>
            import('./features/ending/ending.component')
                .then(m => m.EndingComponent),
        canActivate: [gameActiveGuard],
    },

    // ----------------------------------------------------------
    // Rota coringa — qualquer URL não reconhecida vai para /
    // Evita tela em branco se o usuário digitar uma URL errada.
    // ----------------------------------------------------------
    {
        path: '**',
        redirectTo: '',
    },

];