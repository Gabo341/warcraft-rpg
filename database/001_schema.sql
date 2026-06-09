-- =============================================================
-- 001_schema.sql
-- Warcraft RPG — Criação de todas as tabelas do banco
--
-- Execute este script PRIMEIRO no SQL Editor do Supabase.
-- Nunca edite este arquivo após commitar — crie um novo script
-- numerado sequencialmente para qualquer alteração futura.
-- =============================================================


-- ─────────────────────────────────────────────────────────────
-- PLAYERS
-- Armazena cada partida iniciada. Uma partida = um jogador.
-- Reiniciar o jogo cria um novo registro aqui (novo UUID).
-- "flags" é um objeto JSON, ex: {"warned_villagers": true}
-- "ending" fica NULL até o jogador chegar ao final (A ou B).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE players (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name               VARCHAR(100) NOT NULL,
  class              VARCHAR(50)  NOT NULL
                       CHECK (class IN ('warrior','paladin','rogue','mage','archer')),
  race               VARCHAR(50)  NOT NULL
                       CHECK (race IN ('human','dwarf','night_elf')),
  current_scene_slug VARCHAR(100),          -- slug da cena onde o jogador está agora
  flags              JSONB        NOT NULL DEFAULT '{}',  -- flags acumuladas na partida
  ending             VARCHAR(10)            -- 'A' ou 'B' quando a história terminar
                       CHECK (ending IN ('A', 'B')),
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- SCENES
-- Cada cena da narrativa. Identificada pelo "slug" (ex: brill_arrival).
-- O frontend usa o slug para montar a URL: /scene/brill_arrival
-- "available_classes" NULL = cena visível para todas as classes.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE scenes (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               VARCHAR(100) UNIQUE NOT NULL,  -- identificador único usado nas rotas
  act                SMALLINT     NOT NULL
                       CHECK (act BETWEEN 1 AND 4),
  title              VARCHAR(200) NOT NULL,
  narrative_text     TEXT         NOT NULL,
  background_image   VARCHAR(200),  -- arquivo em assets/backgrounds/
  sprite_image       VARCHAR(200),  -- arquivo em assets/sprites/
  available_classes  TEXT[]         -- NULL = todas as classes podem ver esta cena
);

-- ─────────────────────────────────────────────────────────────
-- CHOICES
-- Cada opção de escolha dentro de uma cena.
-- Liga a cena atual (scene_id) à próxima cena (next_scene_slug).
-- "sets_flag"     → flag que é adicionada ao jogador ao escolher esta opção.
-- "requires_flag" → esta opção só aparece se o jogador já tiver esta flag.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE choices (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id        UUID         NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  label           VARCHAR(200) NOT NULL,   -- texto curto do botão de escolha
  description     TEXT,                    -- texto descritivo abaixo do botão
  next_scene_slug VARCHAR(100) NOT NULL,   -- para qual cena esta escolha leva
  sets_flag       VARCHAR(100),            -- flag setada ao escolher (pode ser NULL)
  requires_flag   VARCHAR(100)             -- flag necessária para aparecer (pode ser NULL)
);

-- ─────────────────────────────────────────────────────────────
-- PLAYER_PROGRESS
-- Log imutável de cada decisão do jogador, com timestamp.
-- Nunca é deletado nem alterado — só INSERTs.
-- Útil para auditoria e para reconstruir o histórico da partida.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE player_progress (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id  UUID        NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  scene_slug VARCHAR(100) NOT NULL,  -- cena onde a escolha foi feita
  choice_id  UUID        REFERENCES choices(id),  -- qual choice foi escolhida
  chosen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- POWERS
-- Catálogo de todos os poderes disponíveis no jogo.
-- Cada poder pertence a uma classe e é desbloqueado em um ato específico.
-- Este é o "template" — player_powers registra quem já desbloqueou o quê.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE powers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  description     TEXT,
  class           VARCHAR(50)  NOT NULL
                    CHECK (class IN ('warrior','paladin','rogue','mage','archer')),
  unlocked_at_act SMALLINT     NOT NULL
                    CHECK (unlocked_at_act BETWEEN 1 AND 4)
);

-- ─────────────────────────────────────────────────────────────
-- PLAYER_POWERS
-- Relação many-to-many entre jogadores e poderes já desbloqueados.
-- Quando o jogador avança de ato, o backend insere o poder do ato
-- correspondente à classe do jogador nesta tabela.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE player_powers (
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  power_id  UUID NOT NULL REFERENCES powers(id)  ON DELETE CASCADE,
  PRIMARY KEY (player_id, power_id)  -- evita duplicatas
);

-- =============================================================
-- ÍNDICES
-- Criados nas colunas consultadas com frequência pela API.
-- Sem índice, o Postgres faz full table scan em cada requisição.
-- =============================================================

-- A API busca cenas pelo slug o tempo todo (GET /scenes/:slug)
CREATE INDEX idx_scenes_slug ON scenes(slug);

-- A API busca choices pela cena corrente do jogador
CREATE INDEX idx_choices_scene_id ON choices(scene_id);

-- A API busca o progresso de um jogador específico
CREATE INDEX idx_player_progress_player_id ON player_progress(player_id);

-- A API lista poderes desbloqueados por jogador
CREATE INDEX idx_player_powers_player_id ON player_powers(player_id);
