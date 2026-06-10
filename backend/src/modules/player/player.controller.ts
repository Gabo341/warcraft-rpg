// =============================================================
// Camada HTTP do módulo player.
//
// O controller é responsável APENAS por:
//   1. Receber a requisição HTTP (req)
//   2. Validar os dados que chegaram
//   3. Chamar o service com esses dados
//   4. Devolver a resposta HTTP (res)
//
// Nenhuma lógica de banco de dados fica aqui — isso é
// responsabilidade do service.
// =============================================================

import { Request, Response } from 'express';
import { createPlayer, getPlayerById, updatePlayer, deletePlayer } from './player.service';

// -------------------------------------------------------------
// POST /players
// Cria uma nova partida.
//
// Body esperado:
// {
//   "name": "Aragorn",
//   "class": "paladin",
//   "race": "human"
// }
// -------------------------------------------------------------
export async function createPlayerController(req: Request, res: Response) {
    try {
        const { name, class: playerClass, race } = req.body;

        // Valida se os campos obrigatórios foram enviados
        if (!name || !playerClass || !race) {
            return res.status(400).json({
                error: 'Os campos name, class e race são obrigatórios.'
            });
        }

        // Valida se a classe é válida
        const classesValidas = ['warrior', 'paladin', 'rogue', 'mage', 'archer'];
        if (!classesValidas.includes(playerClass)) {
            return res.status(400).json({
                error: `Classe inválida. Use: ${classesValidas.join(', ')}`
            });
        }

        // Valida se a raça é válida
        const racasValidas = ['human', 'dwarf', 'night_elf'];
        if (!racasValidas.includes(race)) {
            return res.status(400).json({
                error: `Raça inválida. Use: ${racasValidas.join(', ')}`
            });
        }

        // Chama o service para criar o jogador no banco
        const player = await createPlayer({ name, class: playerClass, race });

        // Retorna 201 Created com os dados do jogador criado
        return res.status(201).json(player);

    } catch (error) {
        console.error('Erro ao criar jogador:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// -------------------------------------------------------------
// GET /players/:id
// Retorna o estado atual de um jogador.
//
// Params:
//   id -> UUID do jogador
// -------------------------------------------------------------
export async function getPlayerController(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        // Chama o service para buscar o jogador no banco
        const player = await getPlayerById(id);

        // Se não encontrou, retorna 404
        if (!player) {
            return res.status(404).json({ error: 'Jogador não encontrado.' });
        }

        return res.status(200).json(player);

    } catch (error) {
        console.error('Erro ao buscar jogador:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// -------------------------------------------------------------
// PUT /players/:id
// Atualiza o nome do jogador.
//
// Params:
//   id → UUID do jogador
//
// Body esperado:
// {
//   "name": "Novo Nome"
// }
// -------------------------------------------------------------
export async function updatePlayerController(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const { name } = req.body;

        // Valida se o nome foi enviado
        if (!name) {
            return res.status(400).json({ error: 'O campo name é obrigatório.' });
        }

        // Chama o service para atualizar o jogador no banco
        const player = await updatePlayer(id, { name });

        // Se não encontrou o jogador, retorna 404
        if (!player) {
            return res.status(404).json({ error: 'Jogador não encontrado.' });
        }

        return res.status(200).json(player);

    } catch (error) {
        console.error('Erro ao atualizar jogador:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}

// -------------------------------------------------------------
// DELETE /players/:id
// Remove uma partida do banco.
//
// Params:
//   id → UUID do jogador
// -------------------------------------------------------------
export async function deletePlayerController(req: Request, res: Response) {
    try {
        const id = req.params.id as string;

        // Chama o service para deletar o jogador no banco
        const deletado = await deletePlayer(id);

        // Se não encontrou o jogador, retorna 404
        if (!deletado) {
            return res.status(404).json({ error: 'Jogador não encontrado.' });
        }

        // 204 No Content — sucesso sem corpo de resposta
        return res.status(204).send();

    } catch (error) {
        console.error('Erro ao deletar jogador:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}