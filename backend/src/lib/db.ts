// =============================================================
// src/lib/db.ts
// Conexão com o banco de dados PostgreSQL (Supabase)
//
// O "Pool" gerencia múltiplas conexões simultâneas com o banco.
// Em vez de abrir e fechar uma conexão a cada requisição,
// o Pool mantém conexões reutilizáveis — mais eficiente.
//
// Este arquivo exporta uma única instância do Pool (singleton).
// Todos os outros arquivos importam daqui — nunca criam
// sua própria conexão.
// =============================================================

import { Pool } from 'pg';

// Cria o pool de conexões usando a variável de ambiente DATABASE_URL
// que está no arquivo .env (nunca commitado no repositório).
//
// Formato da URL:
// postgresql://postgres:[SENHA]@db.[ID].supabase.co:5432/postgres
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // O Supabase exige SSL — sem este flag a conexão é recusada
    // mesmo com a URL correta.
    ssl: {
        rejectUnauthorized: false
    }
});

// Testa a conexão ao iniciar o servidor.
// Se a DATABASE_URL estiver errada ou o Supabase estiver fora,
// o erro aparece no terminal imediatamente.
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
        return;
    }
    console.log('Conexão com o Supabase estabelecida com sucesso.');
    release(); // devolve a conexão para o pool após o teste
});