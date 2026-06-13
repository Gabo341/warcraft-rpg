// =============================================================
// Variáveis de ambiente — produção.
//
// Este arquivo substitui o environment.ts automaticamente
// quando o projeto é buildado com:
//   ng build --configuration production
//
// O código dos services não muda — só este arquivo muda.
// Quando fizer deploy do backend, atualize o apiUrl aqui.
// =============================================================

export const environment = {

    // Indica ao Angular que estamos em modo de produção.
    // Desativa avisos de desenvolvimento no console.
    production: true,

    // Troque pela URL real do backend quando fizer deploy.
    // Enquanto o deploy não acontece, aponta para o local
    // para não quebrar o build.
    apiUrl: 'http://localhost:3000'

};