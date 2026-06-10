// =============================================================
// Lógica de negócio relacionada às cenas do jogo.
//
// Responsabilidade principal: buscar uma cena pelo slug e
// retornar apenas as choices que o jogador pode ver,
// baseado nas flags que ele já acumulou.
// =============================================================

import { pool } from '../../lib/db';

// -------------------------------------------------------------
// Tipos TypeScript
// -------------------------------------------------------------

export interface Choice {
  id: string;
  label: string;
  description: string;
  next_scene_slug: string;
}

export interface Scene {
  id: string;
  slug: string;
  act: number;
  title: string;
  narrative_text: string;
  background_image: string;
  sprite_image: string;
  choices: Choice[];
}

// -------------------------------------------------------------
// getSceneBySlug
// Busca uma cena pelo slug e filtra as choices pelas flags
// do jogador. Se playerId não for informado, retorna todas
// as choices sem filtro.
// -------------------------------------------------------------

export async function getSceneBySlug(
  slug: string,
  playerId?: string
): Promise<Scene | null> {

  // 1. Busca a cena pelo slug
  // CORRIGIDO: era "FROM scene", deve ser "FROM scenes"
  const sceneResult = await pool.query(
    'SELECT * FROM scenes WHERE slug = $1',
    [slug]
  );

  if (sceneResult.rows.length === 0) return null;

  const scene = sceneResult.rows[0];

  // 2. Busca as flags do jogador (se playerId foi informado)
  let playerFlags: Record<string, boolean> = {};

  if (playerId) {
    const playerResult = await pool.query(
      'SELECT flags FROM players WHERE id = $1',
      [playerId]
    );
    if (playerResult.rows.length > 0) {
      playerFlags = playerResult.rows[0].flags;
    }
  }

  // 3. Busca as choices filtrando pelas flags do jogador
  //
  // Uma choice aparece se:
  //   - requires_flag é NULL (sempre visível), OU
  //   - requires_flag existe nas flags do jogador
  const choicesResult = await pool.query(
    `SELECT id, label, description, next_scene_slug
     FROM choices
     WHERE scene_id = $1
       AND (
         requires_flag IS NULL
         OR requires_flag = ANY ($2::text[])
       )
     ORDER BY sort_order`,
    [scene.id, Object.keys(playerFlags)]
  );

  return {
    ...scene,
    choices: choicesResult.rows,
  };
}