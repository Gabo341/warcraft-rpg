-- =============================================================
-- 003_seed_powers.sql
-- Warcraft RPG — Catálogo de poderes por classe e ato
--
-- ORDEM DE EXECUÇÃO: rode DEPOIS de 001_schema.sql.
-- (002_seed_scenes.sql pode ser rodado em paralelo — sem dependência)
--
-- Cada classe tem 4 poderes:
--   Ato 1 → poder inicial (desbloqueado ao criar o personagem)
--   Ato 2 → desbloqueado ao avançar para o Ato 2
--   Ato 3 → desbloqueado ao avançar para o Ato 3
--   Ato 4 → poder final (desbloqueado ao chegar ao Ato 4)
--
-- O backend lê esta tabela para saber quais poderes atribuir
-- ao jogador via INSERT em player_powers.
-- =============================================================

INSERT INTO powers (name, description, class, unlocked_at_act)
VALUES

-- ══════════════════════════════════════════════════════════════
-- GUERREIRO
-- Combatente físico sem magia. Cresce em área de efeito.
-- ══════════════════════════════════════════════════════════════

(
  'Atacar',
  'Golpe direto com a arma. Base confiável do combate físico. Sem custo, sem restrição.',
  'warrior',
  1  -- disponível desde o início
),
(
  'Ataque Transversal',
  'Golpe diagonal que atinge dois alvos adjacentes ao mesmo tempo. Ideal para grupos pequenos.',
  'warrior',
  2
),
(
  'Derrubar + Atacar',
  'Empurra o inimigo ao chão e desfere um golpe enquanto ele está vulnerável. O alvo fica atordoado por 1 turno.',
  'warrior',
  3
),
(
  'Furacão de Lâminas',
  'Redemoinho selvagem que atinge todos os inimigos ao redor. Nat 20: sangramento contínuo por 2 rodadas.',
  'warrior',
  4
),

-- ══════════════════════════════════════════════════════════════
-- PALADINO
-- Balanceia dano, cura e suporte. Especialista contra mortos-vivos.
-- ══════════════════════════════════════════════════════════════

(
  'Golpe Sagrado',
  'Golpe imbuído de Luz. Causa dano extra contra mortos-vivos e criaturas das trevas.',
  'paladin',
  1
),
(
  'Curar',
  'Canaliza a Luz para restaurar pontos de vida de um aliado. A quantidade curada depende do rolar de d6.',
  'paladin',
  2
),
(
  'Destruição Divina',
  'Explosão de energia sagrada que atinge um alvo. Nat 20: o alvo fica cego por 1 rodada.',
  'paladin',
  3
),
(
  'Ressuscitar Aliado',
  'Traz um aliado caído de volta com 50% do HP máximo. Requer d20 ≥ 10. Fumble (1): o paladino perde 8 HP no processo.',
  'paladin',
  4
),

-- ══════════════════════════════════════════════════════════════
-- ARQUEIRO / CAÇADOR
-- Combate à distância e suporte animal. Penalidade em combate corpo-a-corpo.
-- ══════════════════════════════════════════════════════════════

(
  'Flecha Certeira',
  'Flecha simples de longo alcance. Nunca erra à queima-roupa. Dano reduzido em combate corpo-a-corpo.',
  'archer',
  1
),
(
  'Flecha Dupla',
  'Dispara duas flechas no mesmo turno em alvos diferentes. Cada flecha rola seu próprio d20.',
  'archer',
  2
),
(
  'Ataque Duplo',
  'Duas ações de ataque no mesmo turno. A segunda ação tem −2 no d20. Fumble na segunda: flecha desviada pode atingir aliado.',
  'archer',
  3
),
(
  'Companheiro Animal',
  'Invoca um lobo ou corvo que ataca junto. O companheiro rola seu próprio d20. Nat 20: imobiliza o alvo por 1 turno.',
  'archer',
  4
),

-- ══════════════════════════════════════════════════════════════
-- MAGO
-- Alto dano elemental, baixa resistência física. Fumble pode machucar aliados.
-- ══════════════════════════════════════════════════════════════

(
  'Raio de Fogo',
  'Projétil concentrado de chamas. Rápido e direto. Fumble: queima a própria mão (3 de dano ao mago).',
  'mage',
  1
),
(
  'Bola de Fogo',
  'Explosão em área que atinge todos os alvos num raio de 3 metros. Atenção: aliados dentro do raio também são atingidos.',
  'mage',
  2
),
(
  'Congelar',
  'Envolve o alvo em gelo arcano. O alvo fica imobilizado por 1 turno e vulnerável a ataques físicos.',
  'mage',
  3
),
(
  'Teletransporte',
  'Move o mago instantaneamente para qualquer ponto visível até 15 metros. Pode ser usado para escapar ou para reposicionar.',
  'mage',
  4
),

-- ══════════════════════════════════════════════════════════════
-- LADINO
-- Furtividade e veneno. Ataques mais fortes quando não detectado.
-- ══════════════════════════════════════════════════════════════

(
  'Golpe Furtivo',
  'Golpe rápido de adaga. Bônus de dano se o alvo não percebeu o ladino neste turno.',
  'rogue',
  1
),
(
  'Envenenar Adaga',
  'Aplica veneno na lâmina. O próximo golpe causa dano extra por 2 turnos. O veneno consome um cartucho — requer reabastecimento.',
  'rogue',
  2
),
(
  'Invisibilidade',
  'O ladino some da visão por até 3 turnos ou até atacar. Movimento silencioso permite reposicionamento sem custo de ação.',
  'rogue',
  3
),
(
  'Chuva de Lâminas',
  'Lança múltiplas adagas em leque. Atinge até 3 alvos adjacentes. Nat 20: cada alvo sangra por 1 turno extra.',
  'rogue',
  4
)

ON CONFLICT DO NOTHING;

-- =============================================================
-- VERIFICAÇÃO (opcional — rode para confirmar)
-- Deve retornar 20 linhas (4 poderes × 5 classes)
--
-- SELECT class, unlocked_at_act, name
-- FROM powers
-- ORDER BY class, unlocked_at_act;
-- =============================================================
