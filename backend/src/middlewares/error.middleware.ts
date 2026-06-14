// =============================================================
// Middleware global de tratamento de erros.
//
// Em Express, um middleware de erro tem 4 parâmetros:
// (err, req, res, next) — o "err" como primeiro parâmetro
// é o que faz o Express reconhecer como middleware de erro.
//
// Deve ser registrado POR ÚLTIMO no app.ts — após todas as rotas.
// Captura qualquer erro que não foi tratado nos controllers.
// =============================================================

import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

export const corsMiddleware = cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Cache-Control']
});

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Loga o erro no terminal para debug
    console.error('❌ Erro não tratado:', err.message);
    console.error(err.stack);

    // Retorna 500 para o cliente com a mensagem do erro
    res.status(500).json({
        error: 'Erro interno do servidor.',
        message: err.message
    });


}