// =============================================================
// app.config.ts — Configuração global da aplicação Angular.
//
// No Angular 17+ "standalone" não existe mais o AppModule.
// Toda a configuração que antes ficava no @NgModule fica aqui:
//   - Router (navegação entre telas)
//   - HttpClient (requisições HTTP para o backend)
//
// Este objeto é passado para o bootstrapApplication() no main.ts,
// que inicializa a aplicação com essas configurações.
// =============================================================

import { ApplicationConfig } from '@angular/core';

// provideRouter: registra o sistema de rotas da aplicação.
// withComponentInputBinding: permite que parâmetros de rota
// (ex: :slug em /scene/:slug) sejam recebidos como @Input()
// nos componentes, sem precisar injetar o ActivatedRoute.
import { provideRouter, withComponentInputBinding } from '@angular/router';

// provideHttpClient: registra o HttpClient para toda a aplicação.
// withFetch: usa a Fetch API moderna do navegador em vez do
// XMLHttpRequest — mais eficiente e suportado no Angular 17+.
import { provideHttpClient, withFetch } from '@angular/common/http';

// Rotas da aplicação — definidas no app.routes.ts
import { routes } from './app.routes';

// -------------------------------------------------------------
// appConfig
// Exportado e usado diretamente no main.ts:
//   bootstrapApplication(AppComponent, appConfig)
// -------------------------------------------------------------
export const appConfig: ApplicationConfig = {
    providers: [

        // Registra o Router com as rotas definidas no app.routes.ts.
        // withComponentInputBinding() permite fazer assim no componente:
        //   @Input() slug!: string;  ← recebe o :slug da URL automaticamente
        provideRouter(routes, withComponentInputBinding()),

        // Registra o HttpClient para toda a aplicação.
        // Sem isso, qualquer service que injete HttpClient vai dar erro.
        // withFetch() usa a Fetch API nativa — recomendado no Angular 17+.
        provideHttpClient(withFetch()),

    ],
};