// =============================================================
// Lógica de negócio relacionada aos poderes do jogador.
//
// Responsabilidade: retornar os poderes já desbloqueados
// pelo jogador para exibir no painel lateral do jogo.
// =============================================================

import {pool} from '../../lib/db';

// -------------------------------------------------------------
// Tipos TypeScript
// -------------------------------------------------------------

// Um poder desbloqueado pelo jogador
export interface Power {
    id: string;
    name: string;
    description: string;
    class: string;
    unlocked_at_act: number;
}

// -------------------------------------------------------------
// getPlayerPowers
// Retorna todos os poderes já desbloqueados por um jogador.
// O frontend exibe esses poderes no painel lateral da cena.
// -------------------------------------------------------------
export async function getPlayerPowers(playerId: string): Promise<Power[]> {

    // Busca os poderes do jogador fazendo JOIN enter
    // player_powers (relação) e powers (catálogo)
    const result = await pool.query(
        `SELECT p.id, p.name, p.description, p.class, p.unlocked_at_act
         FROM powers p
                  INNER JOIN player_powers pp ON pp.power_id = p.id
         WHERE pp.player_id = $1
         ORDER BY p.unlocked_at_act ASC`,
        [playerId]
    );

    // Retorna array vazio se o jogador não tiver poderes
    return result.rows;
}