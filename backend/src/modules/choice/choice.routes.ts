// =============================================================
// Define as rotas HTTP do módulo choice.
// =============================================================

import { Router } from 'express';
import { processChoiceController } from './choice.controller';

const router = Router({ mergeParams: true });
// mergeParams: true → permite acessar o :id do router pai (players)
// sem isso o req.params.id ficaria undefined

// POST /players/:id/choose → processa escolha do jogador
router.post('/choose', processChoiceController);

export default router;