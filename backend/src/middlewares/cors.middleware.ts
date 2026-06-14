// =============================================================
// Configuração do CORS (Cross-Origin Resource Sharing).
//
// CORS é uma política de segurança do navegador que bloqueia
// requisições de origens diferentes por padrão.
//
// Sem isso, quando o Angular (localhost:4200) tentar chamar
// a API (localhost:3000), o navegador vai bloquear.
//
// Este middleware libera o acesso apenas para o Angular.
// =============================================================
import cors from 'cors';

export const corsMiddleware = cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Cache-Control']
});