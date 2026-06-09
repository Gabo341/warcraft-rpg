// =============================================================
// Lógica de negócio relacionada ao jogador.
//
// Este arquivo não conhece req/res do Express — só fala com
// o banco de dados. Quem chama este arquivo é o controller.
// =============================================================

import {pool} from '../../lib/db';

// -------------------------------------------------------------
// Tipos TypeScript
// Definem a estrutura dos dados que trafegam neste serviço.
// -------------------------------------------------------------

// Dados necessários para criar uma nova partida
export interface CreatePlayerInput {
    name: string;
    class: 'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer';
    race: 'human' | 'dwarf' | 'night_elf';
}

// Dados retornados ao buscar um jogador
export interface Player {
    id: string;
    name: string;
    class: string;
    race: string;
    current_scene_slug: string;
    flags: Record<string, boolean>; // ex: { "warned_villagers": true }
    ending: string | null;
    created_at: string;
}

// -------------------------------------------------------------
// createPlayer
// Cria uma nova partida no banco e atribui os poderes iniciais
// da classe escolhida (poderes do Ato 1).
// -------------------------------------------------------------
export async function createPlayer(input: CreatePlayerInput): Promise<Player> {

    // Inicia uma transaction — se qualquer etapa falhar,
    // nenhuma alteração é salva no banco.
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insere o jogador com a primeira cena do jogo
        const playerResult = await client.query(
            `INSERT INTO players (name, class, race, current_scene_slug)
             VALUES ($1, $2, $3, 'brill_arrival') RETURNING *`,
            [input.name, input.class, input.race]
        );

        const player = playerResult.rows[0];

        // 2. Busca os poderes iniciais da classe (Ato 1)
        const powersResult = await client.query(
            `SELECT id
             FROM powers
             WHERE class = $1
               AND unlocked_at_act = 1`,
            [input.class]
        );

        // 3. Atribui os poderes iniciais ao jogador
        for (const power of powersResult.rows) {
            await client.query(
                `INSERT INTO player_powers (player_id, power_id)
                 VALUES ($1, $2)`,
                [player.id, power.id]
            );

        }
        await client.query('COMMIT');

        return player;


    } catch (error) {
        // Se algo deu errado, desfaz tudo
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Sempre devolve a conexão para o pool, com ou sem erro
        client.release();
    }
}

// -------------------------------------------------------------
// getPlayerById
// Retorna o estado atual de um jogador pelo ID.
// Usado pelo frontend para saber em qual cena o jogador está
// e quais flags já foram acumuladas.
// -------------------------------------------------------------

export async function getPlayerById(playerId: string): Promise<Player | null> {

    const result = await pool.query(
        `SELECT *
         FROM players
         WHERE id = $1`,
        [playerId]
    );

    // Se não encontrou nenhum jogador com esse ID, retorna null
    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

// -------------------------------------------------------------
// updatePlayer
// Atualiza o nome do jogador.
// Campos como flags e current_scene_slug são atualizados
// pelo choice.service — não por aqui.
// -------------------------------------------------------------

export interface UpdatePlayerInput {
    name: string;
}

export async function updatePlayer(
    playerId: string,
    input: UpdatePlayerInput): Promise<Player | null> {

    const result = await pool.query(
        `UPDATE players
         SET name = $1
         WHERE id = $2 RETURNING *`,
        [input.name, playerId]
    );

    // Se não encontrou o jogador, retorna null
    if(result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

// -------------------------------------------------------------
// deletePlayer
// Remove uma partida do banco junto com todo seu histórico.
// O CASCADE no schema garante que player_progress e
// player_powers também são deletados automaticamente.

export async function deletePlayer(playerId: string): Promise<boolean> {
    const result = await pool.query(
        'DELETE FROM players WHERE id = $1',
        [playerId]
    );

    // rowCount > 0 significa que encontrou e deletou o jogador
    return (result.rowCount ?? 0) > 0;
}

