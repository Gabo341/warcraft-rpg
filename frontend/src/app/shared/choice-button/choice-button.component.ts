// =============================================================
// choice-button.component.ts — Botão de escolha individual.
//
// Responsabilidade:
//   Exibir uma única opção de escolha da cena atual.
//   Cada choice do banco vira um botão independente na tela.
//
// Este componente é BURRO por design: ele não chama a API,
// não conhece o jogador e não navega. Só exibe os dados
// que recebe via @Input() e emite um evento via @Output()
// quando o jogador clica.
//
// Quem processa a escolha é o SceneComponent (pai):
//   → recebe o evento (chosen)
//   → chama SceneService.processChoice()
//   → navega para a próxima cena
//
// Uso no SceneComponent:
//   <app-choice-button
//     *ngFor="let choice of scene.choices"
//     [choice]="choice"
//     [desabilitado]="processando"
//     (chosen)="onEscolha(choice)"
//   />
// =============================================================

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa o tipo Choice do game.service — fonte única de verdade
// para os contratos de dados de toda a aplicação.
import { Choice } from '../../core/services/game.service';

@Component({
    selector:    'app-choice-button',
    standalone:  true,
    imports:     [CommonModule],
    templateUrl: './choice-button.component.html',
    styleUrls:   ['./choice-button.component.css'],
})
export class ChoiceButtonComponent {

    // ---------------------------------------------------------
    // @Input() — dados recebidos do componente pai (SceneComponent)
    // ---------------------------------------------------------

    // A choice completa do banco: id, label, description,
    // next_scene_slug. O template usa choice.label e
    // choice.description para exibir o texto do botão.
    @Input() choice!: Choice;

    // Controla se o botão está desabilitado.
    // O SceneComponent passa true enquanto está processando
    // uma escolha — evita que o jogador clique duas vezes.
    @Input() desabilitado = false;

    // ---------------------------------------------------------
    // @Output() — evento emitido para o componente pai
    //
    // @Output() + EventEmitter é o mecanismo do Angular para
    // um componente filho comunicar algo ao pai.
    //
    // Quando o jogador clica, emitimos o objeto Choice completo.
    // O pai escuta com: (chosen)="onEscolha($event)"
    // O $event será o objeto Choice emitido aqui.
    // ---------------------------------------------------------
    @Output() chosen = new EventEmitter<Choice>();

    // ---------------------------------------------------------
    // escolher
    // Chamado pelo (click) no template.
    // Só emite o evento se o botão não estiver desabilitado —
    // dupla verificação além do [disabled] no HTML,
    // pois CSS pode ser sobrescrito pelo navegador.
    // ---------------------------------------------------------
    escolher(): void {
        if (this.desabilitado) return;
        this.chosen.emit(this.choice);
    }

}