// =============================================================
// Configuração do Express — middlewares e registro de rotas.
//
// Este arquivo monta a aplicação mas não a inicia.
// Quem inicia é o server.ts — separar os dois facilita testes.
// =============================================================

import express from 'express';
import cors from 'cors';

// Importa os routers de cada módulo
import playerRouter from './modules/player/player.routes';
import sceneRouter  from './modules/scene/scene.routes';
import choiceRouter from './modules/choice/choice.routes';
import powerRouter  from './modules/power/power.routes';

// Cria a aplicação Express
const app = express();

// -------------------------------------------------------------
// MIDDLEWARES
// Executam em toda requisição, na ordem em que são registrados.
// -------------------------------------------------------------

// Permite que o Angular (localhost:4200) acesse a API
// Sem isso o navegador bloqueia as requisições por segurança (CORS)
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Permite que o Express leia o body das requisições em JSON
// Sem isso o req.body chega undefined
app.use(express.json());

// -------------------------------------------------------------
// ROTAS
// Cada router cuida de um grupo de endpoints.
// -------------------------------------------------------------

// /players -> criar, buscar, atualizar, deletar jogador
app.use('/player', playerRouter);

// /scenes -> buscar cena com choices filtradas
app.use('/scenes', sceneRouter);

// /players/:id/choose  -> processar escolha do jogador
app.use('/players/:id', choiceRouter);

// /players/:id/powers  -> listar poderes desbloqueados
app.use('/players/:id', powerRouter);

// -------------------------------------------------------------
// ROTA DE HEALTH CHECK
// Útil para verificar se o servidor está rodando.
// -------------------------------------------------------------

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Servidor rodando'})
});

export default app;