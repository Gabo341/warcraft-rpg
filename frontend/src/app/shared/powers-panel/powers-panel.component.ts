// =============================================================
// src/app/shared/powers-panel/powers-panel.component.ts
// Painel lateral de poderes desbloqueados do jogador.
//
// Responsabilidade:
//   Exibir a lista de poderes já desbloqueados pelo jogador
//   na coluna lateral da tela de cena, agrupados por ato.
//
// Este componente é BURRO por design: ele não chama a API,
// não conhece o jogador e não tem lógica de negócio.
// Só recebe os poderes via @Input() e os renderiza.
//
// Quem busca os poderes é o SceneComponent (pai):
//   → chama PlayerService.getPlayerPowers(playerId)
//   → passa o resultado via [powers]="poderes"
//
// Uso no SceneComponent:
//   <app-powers-panel [powers]="poderes" />
// =============================================================

import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';

import { Power } from '../../core/services/game.service';

// -------------------------------------------------------------
// Tipo local para representar um grupo de poderes por ato.
// Usado pelo getter poderесPorAto para estruturar os dados
// antes de passar para o template — evita lógica no HTML.
// -------------------------------------------------------------
interface GrupoAto {
    ato:     number;  // número do ato: 1, 2, 3 ou 4
    label:   string;  // texto exibido: 'Ato I', 'Ato II'...
    poderes: Power[]; // poderes deste ato
}

@Component({
    selector:    'app-powers-panel',
    standalone:  true,
    imports:     [CommonModule],
    templateUrl: './powers-panel.component.html',
    styleUrls:   ['./powers-panel.component.css'],
})
export class PowersPanelComponent {

    // ---------------------------------------------------------
    // @Input() — dados recebidos do SceneComponent (pai)
    //
    // Array de poderes já desbloqueados pelo jogador.
    // Começa como array vazio — o painel exibe uma mensagem
    // de "nenhum poder" enquanto a API não respondeu ainda.
    // O backend já retorna ordenado por unlocked_at_act ASC.
    // ---------------------------------------------------------
    @Input() powers: Power[] = [];

    // ---------------------------------------------------------
    // poderesAgrupados
    // Getter que agrupa os poderes por ato para o template.
    //
    // Getter = propriedade computada. O Angular re-avalia
    // automaticamente sempre que o template é verificado.
    //
    // Retorna apenas os atos que têm pelo menos um poder —
    // evita renderizar blocos vazios no painel.
    //
    // Exemplo de retorno:
    // [
    //   { ato: 1, label: 'Ato I',  poderes: [Atacar, Curar] },
    //   { ato: 2, label: 'Ato II', poderes: [Destruição Divina] }
    // ]
    // ---------------------------------------------------------
    get poderesAgrupados(): GrupoAto[] {

        // Mapa de número → label do ato
        const labels: Record<number, string> = {
            1: 'Ato I',
            2: 'Ato II',
            3: 'Ato III',
            4: 'Ato IV',
        };

        // Percorre os 4 atos possíveis e monta os grupos
        return [1, 2, 3, 4]

            .map(ato => ({
                ato,
                label:   labels[ato],
                // Filtra apenas os poderes deste ato
                poderes: this.powers.filter(p => p.unlocked_at_act === ato),
            }))

            // Remove atos sem nenhum poder desbloqueado
            .filter(grupo => grupo.poderes.length > 0);
    }

}