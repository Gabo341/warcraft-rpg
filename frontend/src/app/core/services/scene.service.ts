// =============================================================
// src/app/core/services/scene.service.ts
// Comunicação HTTP com os endpoints de cena e escolha da API.
//
// Responsabilidade: buscar cenas do backend e processar
// as escolhas feitas pelo jogador na tela de cena.
//
// Este service NÃO guarda estado — só faz HTTP.
// Quem guarda a cena em memória é o game.service.ts.
//
// Endpoints consumidos:
//   GET  /scenes/:slug          → buscar cena com choices filtradas
//   POST /players/:id/choose    → processar escolha do jogador
// =============================================================

import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// Importa os tipos do game.service — fonte única de verdade
// para os contratos de dados de toda a aplicação.
import {Scene} from './game.service';

// -------------------------------------------------------------
// Tipo de retorno do POST /players/:id/choose
// Espelha exatamente a interface ProcessChoiceResult do backend
// (choice.service.ts), para garantir consistência entre as pontas.
// -------------------------------------------------------------
export interface ChoiceResult {
  nextSceneSlug: string;        // slug da próxima cena — usado para navegar
  flagSet: string | null; // flag setada no jogador (ou null se não havia)
  powerUnlocked: string | null; // nome do poder desbloqueado (ou null se não havia)
}

// -------------------------------------------------------------
// SceneService
// -------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class SceneService {

  private http = inject(HttpClient);

  // URL base da API — igual ao player.service.ts.
  // Se precisar mudar, muda aqui e só aqui.
  private readonly API_URL = 'http://localhost:3000';

  // -----------------------------------------------------------
  // getSceneBySlug
  // Chama GET /scenes/:slug para buscar os dados de uma cena.
  //
  // O playerId é enviado como query string (?playerId=...) para
  // que o backend filtre as choices pelas flags do jogador.
  // Sem o playerId, o backend retorna todas as choices sem filtro.
  //
  // Exemplo de URL gerada:
  //   GET http://localhost:3000/scenes/brill_arrival?playerId=7bc2...
  //
  // Resposta esperada (200 OK):
  //   {
  //     id, slug, act, title, narrative_text,
  //     background_image, sprite_image,
  //     choices: [ { id, label, description, next_scene_slug } ]
  //   }
  // -----------------------------------------------------------
  getSceneBySlug(slug: string, playerId: string): Observable<Scene> {

    // HttpClient aceita um objeto 'params' para montar query strings.
    // Isso é mais seguro do que concatenar strings manualmente,
    // pois o Angular cuida do encoding correto dos caracteres especiais.
    return this.http.get<Scene>(`${this.API_URL}/scenes/${slug}`, {
      params: {playerId},
      headers: {'Cache-Control': 'no-cache'}
    });
  }

  // -----------------------------------------------------------
  // processChoice
  // Chama POST /players/:id/choose para processar uma escolha.
  //
  // O backend executa tudo em uma única transaction:
  //   1. Seta a flag no jogador (se houver)
  //   2. Avança a cena atual do jogador
  //   3. Salva o progresso no log
  //   4. Desbloqueia poder se o jogador mudou de ato
  //   5. Registra o final se chegou a ending_light ou ending_dark
  //
  // Body enviado:
  //   { choiceId: "uuid-da-choice" }
  //
  // Resposta esperada (200 OK):
  //   { nextSceneSlug, flagSet, powerUnlocked }
  //
  // O componente de cena usa o nextSceneSlug para navegar
  // para a próxima tela usando o Angular Router.
  // -----------------------------------------------------------
  processChoice(playerId: string, choiceId: string): Observable<ChoiceResult> {

    // O body da requisição segue exatamente o que o
    // choice.controller.ts do backend espera receber.
    return this.http.post<ChoiceResult>(
      `${this.API_URL}/players/${playerId}/choose`,
      {choiceId}
    );


  }

}
