// =============================================================
// main.ts — Ponto de entrada da aplicação Angular.
//
// Este é o PRIMEIRO arquivo executado quando o navegador
// carrega a aplicação. Ele chama o bootstrapApplication(),
// que inicializa o Angular com:
//   - o componente raiz (AppComponent)
//   - as configurações globais (appConfig)
//
// No Angular 17+ "standalone", não existe mais AppModule.
// Toda a configuração fica no appConfig (app.config.ts).
// =============================================================

import { bootstrapApplication } from '@angular/platform-browser';

// Configuração global da aplicação:
// providers de roteamento, HttpClient, etc.
import { appConfig } from './app/app.config';

// Componente raiz — o Angular renderiza ele dentro do
// <app-root> que está no index.html
import { AppComponent } from './app/app.component';

// bootstrapApplication inicializa a aplicação.
// Se algo der errado (erro de configuração, etc.),
// o erro aparece no console do navegador.
bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));