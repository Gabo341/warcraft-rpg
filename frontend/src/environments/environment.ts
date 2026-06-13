// =============================================================
// Variáveis de ambiente — desenvolvimento local.
//
// O Angular usa este arquivo quando você roda: ng serve
// Em produção (ng build), ele é substituído automaticamente
// pelo environment.prod.ts — sem precisar mudar nada no código.
//
// Todos os services importam 'apiUrl' daqui em vez de
// escrever 'http://localhost:3000' espalhado pelo projeto.
// =============================================================

export const environment = {

    // Indica ao Angular que estamos em modo de desenvolvimento.
    // Ativa avisos extras no console do navegador.
    production: false,

    // URL base do backend Express.
    // O backend roda na porta 3000 por padrão (definido no .env do back).
    // Todos os services concatenam esta URL com o endpoint:
    // ex: `${environment.apiUrl}/players`
    apiUrl: 'http://localhost:3000'

};