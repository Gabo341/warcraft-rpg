// =============================================================
// Lógica de negócio relacionada às escolhas do jogador.
//
// Responsabilidade principal: processar uma escolha feita pelo
// jogador — setar a flag, avançar a cena, salvar o progresso
// e desbloquear poder se houver.
// =============================================================

import { pool } from '../../lib/db';

// -------------------------------------------------------------
// Tipos TypeScript
// -------------------------------------------------------------

export interface ProcessChoiceInput {
  playerId: string;
  choiceId: string;
}

export interface ProcessChoiceResult {
  nextSceneSlug: string;
  flagSet: string | null;
  achievement: { title: string; description: string } | null;
  powerUnlocked: string | null;
}

// -------------------------------------------------------------
// processChoice
// -------------------------------------------------------------

export async function processChoice(
  input: ProcessChoiceInput
): Promise<ProcessChoiceResult> {

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Busca a choice pelo ID
    const choiceResult = await client.query(
      'SELECT * FROM choices WHERE id = $1',
      [input.choiceId]
    );

    if (choiceResult.rows.length === 0) {
      throw new Error('Choice não encontrada.');
    }
    const choice = choiceResult.rows[0];

    // 2. Busca o jogador
    const playerResult = await client.query(
      'SELECT * FROM players WHERE id = $1',
      [input.playerId]
    );

    if (playerResult.rows.length === 0) {
      throw new Error('Jogador não encontrado.');
    }
    const player = playerResult.rows[0];

    // 3. Verifica se a choice pertence à cena atual do jogador
    const sceneResult = await client.query(
      'SELECT id, act FROM scenes WHERE slug = $1',
      [player.current_scene_slug]
    );

    // CORRIGIDO: era === (sempre lançava erro), deve ser !==
    if (sceneResult.rows[0]?.id !== choice.scene_id) {
      throw new Error('Esta escolha não pertence à cena atual do jogador.');
    }

    const currentAct = sceneResult.rows[0].act;

    // 4. Seta a flag no jogador (se a choice tiver uma flag)
    if (choice.sets_flag) {
      await client.query(
        'UPDATE players SET flags = flags || $1::jsonb WHERE id = $2',
        [JSON.stringify({ [choice.sets_flag]: true }), input.playerId]
      );
    }

    // 5. Avança a cena atual do jogador
    await client.query(
      'UPDATE players SET current_scene_slug = $1 WHERE id = $2',
      [choice.next_scene_slug, input.playerId]
    );

    // 6. Salva o progresso no log imutável
    await client.query(
      `INSERT INTO player_progress (player_id, scene_slug, choice_id, flag_unlocked)
       VALUES ($1, $2, $3, $4)`,
      [
        input.playerId,
        player.current_scene_slug,
        input.choiceId,
        choice.sets_flag ?? null,
      ]
    );

    // 7. Busca a próxima cena para saber o ato
    // CORRIGIDO: era "FROM scene", deve ser "FROM scenes"
    const nextSceneResult = await client.query(
      'SELECT act, is_ending FROM scenes WHERE slug = $1',
      [choice.next_scene_slug]
    );

    const nextAct = nextSceneResult.rows[0]?.act;
    const isEnding = nextSceneResult.rows[0]?.is_ending ?? false;

    // 8. Desbloqueia poder se mudou de ato
    let powerUnlocked: string | null = null;

    // CORRIGIDO: era "nextAct !== player.current_scene_slug" (comparava ato com slug)
    if (nextAct && nextAct !== currentAct) {
      const newPowerResult = await client.query(
        `SELECT p.id, p.name
         FROM powers p
         WHERE p.class = $1
           AND p.unlocked_at_act = $2
           AND NOT EXISTS (
             SELECT 1 FROM player_powers pp
             WHERE pp.player_id = $3 AND pp.power_id = p.id
           )`,
        [player.class, nextAct, input.playerId]
      );

      if (newPowerResult.rows.length > 0) {
        const newPower = newPowerResult.rows[0];
        await client.query(
          'INSERT INTO player_powers (player_id, power_id) VALUES ($1, $2)',
          [input.playerId, newPower.id]
        );
        powerUnlocked = newPower.name;
      }
    }

    // 9. Verifica se chegou a um final
  
    if (isEnding) {
      const endingValue =
        choice.next_scene_slug === 'ending_light' ? 'A' : 'B';

      await client.query(
        'UPDATE players SET ending = $1 WHERE id = $2',
        [endingValue, input.playerId]
      );
    }

    // 10. Busca o achievement desbloqueado (se houver) para o frontend exibir
    let achievement: { title: string; description: string } | null = null;

    if (choice.sets_flag) {
      const achResult = await client.query(
        'SELECT title, description FROM achievements WHERE flag_key = $1',
        [choice.sets_flag]
      );
      if (achResult.rows.length > 0) {
        achievement = achResult.rows[0];
      }
    }

    await client.query('COMMIT');

    return {
      nextSceneSlug: choice.next_scene_slug,
      flagSet: choice.sets_flag ?? null,
      achievement,
      powerUnlocked,
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}