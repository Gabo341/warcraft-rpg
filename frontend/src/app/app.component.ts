// =============================================================
// app.component.ts — Componente raiz da aplicação.
//
// No Angular, todo componente precisa de um arquivo .ts que
// define a classe, e geralmente um .html e um .css associados.
//
// O AppComponent é especial: ele é o PRIMEIRO componente
// renderizado, e seu template contém o <router-outlet> —
// um marcador onde o Angular injeta o componente da rota ativa.
//
// Exemplo:
//   Usuário acessa /scene/brill_arrival
//   → Router detecta a rota 'scene/:slug'
//   → Renderiza SceneComponent DENTRO do <router-outlet>
//
// O AppComponent em si não tem lógica — só serve de casca.
// =============================================================

import { Component }      from '@angular/core';
import { RouterOutlet }   from '@angular/router';

@Component({
    // Seletor CSS que identifica este componente no index.html.
    // O index.html tem <app-root></app-root> — o Angular substitui
    // esse elemento pelo template abaixo.
    selector: 'app-root',

    // Componente standalone: não pertence a nenhum NgModule.
    // É o padrão do Angular 17+. Imports declarados aqui ficam
    // disponíveis apenas para o template DESTE componente.
    standalone: true,

    // RouterOutlet é o componente que "marca o lugar" onde
    // o conteúdo de cada rota será renderizado.
    // Precisa ser importado aqui porque é standalone.
    imports: [RouterOutlet],

    // Template inline — sem arquivo .html separado porque
    // o AppComponent não tem visual próprio, só o outlet.
    template: `<router-outlet />`,

    // Sem estilos próprios — cada componente de rota cuida do seu.
    styles: [],
})
export class AppComponent {
    // Título da aplicação — usado pelo Angular CLI internamente.
    // Não aparece na tela (não tem binding no template).
    title = 'warcraft-rpg';
}