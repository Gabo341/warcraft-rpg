// =============================================================
// Define as rotas HTTP do módulo player.
//
// Este arquivo conecta a URL da requisição ao controller
// correto. O app.ts importa este router e registra as rotas.
// =============================================================

import { Router } from 'express';
import {
    createPlayerController,
    getPlayerController,
    updatePlayerController,
    deletePlayerController
} from './player.controller';

// Cria um router isolado para o módulo player
const router = Router();

// POST   /players      → cria nova partida
router.post('/', createPlayerController);

// GET    /players/:id  → retorna estado do jogador
router.get('/:id', getPlayerController);

// PUT    /players/:id  → atualiza nome do jogador
router.put('/:id', updatePlayerController);

// DELETE /players/:id  → remove a partida
router.delete('/:id', deletePlayerController);

export default router;