// =============================================================
// Define as rotas HTTP do módulo power.
// =============================================================

import { Router } from 'express';
import { getPlayerPowersController } from './power.controller';

const router = Router({ mergeParams: true });
// mergeParams: true → permite acessar o :id do router pai (players)

// GET /players/:id/powers → retorna poderes desbloqueados
router.get('/powers', getPlayerPowersController);

export default router;
