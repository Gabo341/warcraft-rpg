// =============================================================
// Camada HTTP do módulo scene.
//
// Recebe a requisição, extrai os parâmetros e chama o service.
// =============================================================

import { Request, Response } from 'express';
import { getSceneBySlug } from './scene.service';

// -------------------------------------------------------------
// GET /scene/:slug?playerId=...
// Retorna uma cena com as choices filtradas pelas flags
// do jogador.
//
// Params:
//   slug -> identificador da cena (ex: brill_arrival)
//
// Query (opcional):
//   playerId -> UUID do jogador para filtrar as choices
//
// Exemplo de requisição:
//   GET /scene/brill_arrival?playerId=7bc2722b-81fd-...
// -------------------------------------------------------------

export async function getSceneController(req: Request, res: Response) {

    try {
        // Pega o slug da URL — ex: /scene/brill_arrival -> slug = 'brill_arrival'
        const slug = req.params.slug as string;

        // Pega o playerId da query string (opcional)
        // ex: /scene/brill_arrival?playerId=7bc2722b...

        const playerId = req.query.playerId as string | undefined;

        // Chama o service para buscar a cena com choices filtradas
        const scene = await getSceneBySlug(slug, playerId);

        // Se a cena não existe, retorna 404
        if(!scene) {
            return res.status(404).json({error: 'Cena não encotnrada.'});
        }

        return res.status(200).json(scene);

    }catch(error) {
        console.error('Erro na busca: ', error);
        return res.status(500).json({error: 'Erro interno do servidor.'});
    }
}