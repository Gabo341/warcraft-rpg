// =============================================================
// src/modules/scene/scene.routes.ts
// Define as rotas HTTP do módulo scene.
// =============================================================

import { Router } from 'express';
import { getSceneController } from './scene.controller';

const router = Router();

// GET /scenes/:slug -> retorna cena com choices filtradas
router.get('/slug', getSceneController);

export default router;