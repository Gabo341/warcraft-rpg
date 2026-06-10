// =============================================================
// Entry point da aplicação — inicia o servidor HTTP.
//
// Este arquivo apenas importa o app.ts e inicia na porta
// definida no .env. Separar do app.ts facilita testes.
// =============================================================

import 'dotenv/config'; // carrega as variáveis do .env antes de tudo
import app from './app';

// Porta definida no .env — se não existir usa 3000 como padrão
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});