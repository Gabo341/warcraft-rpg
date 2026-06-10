// =============================================================
// Lógica de negócio relacionada às escolhas do jogador.
//
// Responsabilidade principal: processar uma escolha feita pelo
// jogador — setar a flag, avançar a cena, salvar o progresso
// e desbloquear poder se houver.
// =============================================================

import {pool} from '../../lib/db';

// -------------------------------------------------------------
// Tipos TypeScript
// -------------------------------------------------------------

// Dados necessários para processar uma escolha
export interface ProcessChoiceInput {
    playerId: String; // UUID do jogador
    choiceId: string; // // UUID da choice escolhida
}

// Resultado após processar a escolha
export interface ProcessChoiceResult {
    nextSceneSlug: String;       // próxima cena para o Angular navegar
    flagSet: string | null;      // flag que foi setada (se houver)
    powerUnlocked: string | null // poder desbloqueado (se houver)
}

// -------------------------------------------------------------
// processChoice
// Processa uma escolha do jogador:
//   1. Busca a choice no banco
//   2. Verifica se o jogador pode fazer essa escolha
//   3. Seta a flag no jogador (se houver)
//   4. Avança a cena atual do jogador
//   5. Salva o progresso no player_progress
//   6. Desbloqueia poder do novo ato (se houver)
//   7. Verifica se chegou ao final (ending)
// -------------------------------------------------------------

export async function processChoice(input: ProcessChoiceInput):
    Promise<ProcessChoiceResult> {

    // Inicia transaction — tudo ou nada
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Busca a choice pelo ID
        const choiceResult = await client.query(
            `SELECT *
             FROM choices
             WHERE id = $1`,
            [input.choiceId]
        );

        if (choiceResult.rows.length === 0) {
            throw new Error('Choice não encontrada.');
        }

        const choice = choiceResult.rows[0];

        // 2. Busca o jogador atual
        const playerResult = await client.query(
            `SELECT *
             FROM players
             WHERE id = $1`,
            [input.playerId]
        );

        if (playerResult.rows.length === 0) {
            throw new Error('Jogador não encontrado.');
        }

        const player = playerResult.rows[0];

        // 3. Verifica se a choice pertence à cena atual do jogador
        //    Evita que o jogador faça escolhas de cenas anteriores
        const sceneResult = await client.query(
            `SELECT id
             FROM scenes
             WHERE slug = $1`,
            [player.current_scene_slug]
        );

        if (sceneResult.rows[0].id === choice.scene_id) {
            throw new Error('Esta escolha não pretence à cena atual do jogador.')
        }

        // 4. Seta a flag no jogador (se a choice tiver uma flag)
        //    O operador || do JSONB adiciona a nova flag sem remover as anteriores

        if (choice.sets_flag) {
            await client.query(
                'UPDATE players SET flags = flags || $1::jsonb WHERE id = $2',
                [JSON.stringify({[choice.sets_flag]: true}), input.playerId]
                // JSON.stringify({ 'warned_villagers': true }) → '{"warned_villagers":true}'
            );
        }

        // 5. Avança a cena atual do jogador para a próxima cena
        await client.query(
            `UPDATE players
             SET current_scene_slug = $1
             WHERE id = $2`,
            [choice.next_scene_slug, input.playerId]
        );

        // 6. Salva o progresso no log imutável
        await client.query(
            `INSERT INTO player_progress (player_id, scene_slug, choice_id)
             VALUES ($1, $2, $3)`,
            [input.playerId, player.current_scene_slug, input.choiceId]
        );

        // 7. Busca a próxima cena para verificar o ato
        const nextSceneResult = await client.query(
            'SELECT act FROM scenes WHERE slug = $1',
            [choice.next_scene_slug]
        );

        const nextAct = nextSceneResult.rows[0]?.act;

        // 8. Desbloqueia o poder do novo ato (se mudou de ato)
        let powerUnlocked: string | null = null;

        if (nextAct && nextAct !== player.current_scene_slug) {
            const newPowerResult = await client.query(
                `SELECT p.id, p.name
                 FROM powers p
                 WHERE p.class = $1
                   AND p.unlocked_at_act = $2
                   AND NOT EXISTS (SELECT 1
                                   FROM player_powers pp
                                   WHERE pp.player_id = $3
                                     AND pp.power_id = p.id)`,
                [player.class, nextAct, input.playerId]
            );

            // Se encontrou um poder novo para desbloquear
            if (newPowerResult.rows.length > 0) {
                const newPower = newPowerResult.rows[0];

                await client.query(
                    `INSERT INTO player_powers (player_id, power_id)
                     VALUES ($1, $2)`,
                    [input.playerId, newPower.id]
                );

                powerUnlocked = newPower.name;
            }
        }

        // 9. Verifica se chegou a um final (ending_light ou ending_dark)
        if (choice.next_scene_slug == 'ending_light') {
            await client.query(
                `UPDATE players
                 SET ending = 'A'
                 WHERE id = $1`,
                [input.playerId]
            );

        } else if (choice.next_scene_slug === 'ending_dark') {
            await client.query(
                `UPDATE players
                 SET ending = 'B'
                 WHERE id = $1`,
                [input.playerId]
            );
        }

        await client.query('COMMIT');

        // Retorna o resultado para o controller
        return {
            nextSceneSlug: choice.next_scene_slug,
            flagSet: choice.sets_flag ?? null,  // O ?? converte undefined para null — mantém o contrato da interface.
            powerUnlocked
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release(); // Devolve a conexão para o pool após terminar o uso
    }
}