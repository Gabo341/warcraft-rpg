// =============================================================
// Lógica de negócio relacionada às cenas do jogo.
//
// Responsabilidade principal: buscar uma cena pelo slug e
// retornar apenas as choices que o jogador pode ver,
// baseado nas flags que ele já acumulou.
// =============================================================

import {pool} from '../../lib/db'
import playerRoutes from "../player/player.routes";

// -------------------------------------------------------------
// Tipos TypeScript
// -------------------------------------------------------------

// Uma choice (opção de escolha) retornada para o frontend
export interface Choice {
    id: string;
    label: string;  // texto do botão
    description: string; // texto explicativo abaixo do botão
    next_scene_slug;
}

// Uma cena completa com suas choices filtradas
export interface Scene {
    id: string;
    slug: string;
    act: number;
    title: string;
    narrative_text: string;
    background_image: string;
    sprite_image: string;
    choices: Choice[]; // só as choices que o jogador pode ver
}

// -------------------------------------------------------------
// getSceneBySlug
// Busca uma cena pelo slug e filtra as choices pelas flags
// do jogador. Se playerId não for informado, retorna todas
// as choices sem filtro.
// -------------------------------------------------------------

export async function getSceneBySlug(
    slug: string,
    playerId?: String // o "?" torna o parâmetro opcional
): Promise<Scene | null> {

    // 1. Busca a cena pelo slug
    const sceneResult = await pool.query(
        'SELECT * FROM scenes WHERE slug = $1',
        [slug]
    );

    // Se a cena não existe, retorna null
    if (sceneResult.rows.length === 0) {
        return null;
    }

    const scene = await sceneResult.rows[0];

    // 2. Busca as flags do jogador (se playerId foi informado)
    let playerFlags: Record<string, boolean> = {}

    if (playerId) {
        const playerResult = await pool.query(
            'SELECT * FROM players WHERE id = $1',
            [playerId]
        );

        if (playerResult.rows.length > 0) {
            playerFlags = playerResult.rows[0].flags;
        }
    }

    // 3. Busca as choices da cena filtrando pelas flags do jogador
    //
    // Uma choice aparece se:
    //   - requires_flag é NULL (sempre visível), OU
    //   - requires_flag existe nas flags do jogador
    //
    // O operador ? do PostgreSQL verifica se uma chave existe no JSONB

    const choicesResult = await pool.query(
        `SELECT id, label, description, next_scene_slug
         FROM choices
         WHERE scene_id = $1
           AND (
             requires_flag IS NULL
                 OR requires_flag = ANY ($2::text[])
             )
         ORDER BY id`,

        // Object.keys pega só as chaves
        [scene.id, Object.keys(playerFlags)]
        // Object.keys(playerFlags) -> ['warned_villagers', 'light_path', ...]
    );

    // 4. Monta o objeto final com a cena e suas choices filtradas
    const sceneWithChoices: Scene = {
        ...scene, // spread — copia todos os campos da cena
        choices: choicesResult.rows // adiciona as choices filtradas
    };

    return sceneWithChoices;
}