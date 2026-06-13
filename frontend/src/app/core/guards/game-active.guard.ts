// =============================================================
// Proteção de rotas que exigem uma partida ativa.
//
// Um "guard" no Angular é uma função que o Router executa
// ANTES de renderizar um componente. Se retornar true,
// a navegação prossegue. Se retornar false ou um UrlTree,
// a navegação é bloqueada e o usuário é redirecionado.
//
// Este guard protege /scene/:slug e /ending/:type.
// Se o jogador tentar acessar essas rotas diretamente pela
// URL sem ter uma partida ativa, é enviado para a tela inicial.
//
// Fluxo de verificação:
//   1. Verifica se o GameService tem um jogador em memória
//   2. Se não, verifica se há um ID salvo no localStorage
//   3. Se não há nada, redireciona para /
// =============================================================

import { inject }       from '@angular/core';
import { Router }       from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { GameService }  from '../services/game.service';

// -------------------------------------------------------------
// gameActiveGuard
//
// Usamos a forma FUNCIONAL de guard (CanActivateFn), introduzida
// no Angular 14. É mais simples do que criar uma classe com
// implements CanActivate — menos código, mesmo resultado.
//
// O app.routes.ts usa assim:
//   canActivate: [gameActiveGuard]
// -------------------------------------------------------------
export const gameActiveGuard: CanActivateFn = () => {

    // Injeta os serviços necessários.
    // Dentro de uma função de guard, inject() funciona porque
    // o Angular a executa dentro de um contexto de injeção.
    const gameService = inject(GameService);
    const router      = inject(Router);

    // -------------------------------------------------------------
    // Verificação 1: jogador em memória
    //
    // Se o GameService já tem um jogador carregado (partida ativa
    // criada nesta sessão), libera a navegação imediatamente.
    // Esse é o caso mais comum — o jogador navega entre cenas.
    // -------------------------------------------------------------
    if (gameService.isGameActive()) {
        return true;
    }

    // -------------------------------------------------------------
    // Verificação 2: ID salvo no localStorage
    //
    // O usuário pode ter recarregado a página (F5), o que apaga
    // a memória do Angular mas não o localStorage.
    //
    // Se encontrarmos um ID salvo, significa que há uma partida
    // anterior. Liberamos a navegação — o componente de cena
    // vai usar esse ID para recarregar o jogador da API no ngOnInit.
    // -------------------------------------------------------------
    const savedId = gameService.loadPlayerIdFromStorage();

    if (savedId) {
        // Não buscamos o jogador aqui — isso é responsabilidade
        // do componente. O guard só verifica se existe um ID válido.
        return true;
    }

    // -------------------------------------------------------------
    // Sem partida ativa: redireciona para a tela inicial
    //
    // router.parseUrl('/') cria um UrlTree — a forma correta de
    // redirecionar dentro de um guard. Retornar um UrlTree é
    // equivalente a chamar router.navigate(['/']) mas mais limpo,
    // pois o Router gerencia a navegação internamente.
    // -------------------------------------------------------------
    return router.parseUrl('/');
};