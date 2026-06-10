// =============================================================
// src/modules/power/power.controller.ts
// Camada HTTP do módulo power.
// =============================================================

import { Request, Response } from 'express';
import { getPlayerPowers } from './power.service';

// -------------------------------------------------------------
// GET /players/:id/powers
// Retorna todos os poderes desbloqueados pelo jogador.
//
// Params:
//   id -> UUID do jogador
// -------------------------------------------------------------
export async function getPlayerPowersController(req: Request, res: Response) {
    try {
        // Pega o ID do jogador da URL
        const { id: playerId } = req.params;

        // Chama o service para buscar os poderes no banco
        const powers = await getPlayerPowers(playerId);

        return res.status(200).json(powers);

    } catch (error) {
        console.error('Erro ao buscar poderes:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}