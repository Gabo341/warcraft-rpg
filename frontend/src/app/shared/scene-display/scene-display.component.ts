// =============================================================
// scene-display.component.ts — Overlay de imagens da cena.
//
// Responsabilidade:
//   Exibir o fundo (background) e o sprite do personagem/NPC
//   sobrepostos via CSS — técnica definida no documento
//   03_arquitetura_pastas.docx (seção 5 "Técnica de Overlay").
//
// Este componente é BURRO por design: ele não conhece rotas,
// services nem lógica de jogo. Só recebe dois @Input() e
// renderiza as imagens. Quem decide qual imagem mostrar é
// o SceneComponent pai.
//
// Uso no SceneComponent:
//   <app-scene-display
//     [background]="scene.background_image"
//     [sprite]="scene.sprite_image"
//   />
//
// Arquivos de imagem esperados em:
//   assets/backgrounds/  → ex: brill_town_day.jpg
//   assets/sprites/      → ex: arthas_standing.png
// =============================================================

import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

@Component({
    selector:    'app-scene-display',
    standalone:  true,
    imports:     [CommonModule],
    templateUrl: './scene-display.component.html',
    styleUrls:   ['./scene-display.component.css'],
})
export class SceneDisplayComponent {

    // ---------------------------------------------------------
    // @Input() — dados recebidos do componente pai (SceneComponent)
    //
    // @Input() significa que o valor vem de FORA via binding:
    //   [background]="scene.background_image"
    //
    // O '!' (non-null assertion) diz ao TypeScript que o valor
    // sempre será fornecido pelo pai — sem precisar de valor padrão.
    // ---------------------------------------------------------

    // Nome do arquivo de fundo — ex: 'brill_town_day.jpg'
    // O template concatena com 'assets/backgrounds/' para montar o src.
    @Input() background!: string;

    // Nome do arquivo de sprite — ex: 'arthas_standing.png'
    // O template concatena com 'assets/sprites/' para montar o src.
    @Input() sprite!: string;

}