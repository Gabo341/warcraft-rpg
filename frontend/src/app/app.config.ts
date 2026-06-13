// =============================================================
// Configuração principal da aplicação Angular.
//
// No Angular 17+ (standalone), este arquivo substitui o
// antigo AppModule. Aqui registramos os "providers" globais —
// serviços e funcionalidades que precisam estar disponíveis
// em toda a aplicação.
//
// O bootstrapApplication() no main.ts usa este config.
// =============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter }     from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Importa as rotas definidas em app.routes.ts
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [

        // -------------------------------------------------------------
        // ROTEAMENTO
        // Registra o sistema de rotas com as rotas definidas em
        // app.routes.ts. O Angular vai usar essas rotas para decidir
        // qual componente exibir de acordo com a URL atual.
        // -------------------------------------------------------------
        provideRouter(routes),

        // -------------------------------------------------------------
        // HTTP CLIENT
        // Habilita o HttpClient para toda a aplicação.
        // Os services (player.service, scene.service) usam o
        // HttpClient para fazer requisições para a API do backend.
        // Sem isso, a injeção de HttpClient nos services falharia.
        // -------------------------------------------------------------
        provideHttpClient(),

    ]
}