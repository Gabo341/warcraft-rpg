// =============================================================
// Camada HTTP do módulo choice.
// =============================================================

import { Request, Response } from 'express';
import { processChoice } from './choice.service';

// -------------------------------------------------------------
// POST /players/:id/choose
// Processa a escolha do jogador.
//
// Params:
//   id -> UUID do jogador
//
// Body esperado:
// {
//   "choiceId": "uuid da choice escolhida"
// }
// -------------------------------------------------------------

export async function processChoiceController(req: Request, res: Response) {
    try {
        // Pega o ID do jogador da URL
        const { id: playerId } = req.params;

        // Pega o ID da choice do body
        const { choiceId } = req.body;

        // Valida se o choiceId foi enviado
        if(!choiceId){
            return res.status(400).json({ error: 'O campo choiceId é obrigatório.' });
        }

        // Chama o service para processar a escolha
        const result = await processChoice({ playerId, choiceId })

        return res.status(200).json(result);

    } catch (error : any) {
        // Erros de validação do service (choice não encontrada, etc)
        if(error.message){
            return res.status(400).json({ error: error.message });
        }

        console.error('Erro ao processar escolha:',error);

    }
}