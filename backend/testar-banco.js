// ============================================================
// testar-banco.js
// Teste de conexao com o Supabase + busca de player cadastrado
//
// Como executar:
//   1. Abra o terminal na pasta backend/
//   2. Certifique-se que o pg esta instalado: npm install pg
//   3. Rode: node testar-banco.js
// ============================================================

const { Pool } = require('pg');

// String de conexao direta (so para teste — em producao use .env)
const DATABASE_URL = "";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // obrigatorio para o Supabase
});

async function testar() {
  console.log('\n Conectando ao Supabase...\n');
  try {
    // --- 1. Ping: verifica se a conexao esta viva ---
    const ping = await pool.query('SELECT NOW() AS agora');
    console.log('Conexao OK:', ping.rows[0].agora);

    // --- 2. Busca o player mais recente cadastrado ---
    // Retorna: id, nome, classe, raca, cena atual, flags e final
    const players = await pool.query(`
      SELECT *
      FROM players
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (players.rows.length === 0) {
      console.log('\n Nenhum player encontrado no banco ainda.\n');
    } else {
      console.log('\n Player mais recente encontrado:');
      console.log('------------------------------');
      console.log(players.rows[0]);
      console.log('------------------------------\n');
    }

  } catch (err) {
    console.error('Falhou:', err.message);
  } finally {
    await pool.end();
  }
}

testar();