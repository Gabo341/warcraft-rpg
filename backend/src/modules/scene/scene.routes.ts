// =============================================================
// Define as rotas HTTP do módulo scene.
// =============================================================

import { Router } from 'express';
import { getSceneController } from './scene.controller';

const router = Router();

// CORRIGIDO: era '/slug' (string fixa), deve ser '/:slug' (parâmetro dinâmico)
// GET /scenes/:slug?playerId=... → retorna cena com choices filtradas
router.get('/:slug', getSceneController);

export default router;