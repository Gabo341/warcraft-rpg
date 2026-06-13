// =============================================================
// Comunicação HTTP com os endpoints de jogador da API.
//
// Responsabilidade: fazer as requisições para o backend e
// retornar os dados para quem chamou (componentes).
//
// Este service NÃO guarda estado — só faz HTTP.
// Quem guarda o jogador em memória é o game.service.ts.
//
// Endpoints consumidos:
//   POST /players              → criar nova partida
//   GET  /players/:id          → buscar estado do jogador
//   GET  /players/:id/powers   → buscar poderes desbloqueados
// =============================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Observable }         from 'rxjs';

// Importa os tipos do game.service para manter consistência
// em toda a aplicação — um único lugar define os contratos.
import { Player, Power } from './game.service';

// -------------------------------------------------------------
// Tipos de entrada
// Definem o que precisamos enviar para a API ao criar jogador.
// Espelham o body esperado pelo POST /players do backend.
// -------------------------------------------------------------

export interface CreatePlayerInput {
    name:  string;
    class: 'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer';
    race:  'human' | 'dwarf' | 'night_elf';
}

// -------------------------------------------------------------
// PlayerService
// -------------------------------------------------------------
@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    // inject() é a forma moderna do Angular 14+ de injetar
    // dependências — equivalente a receber no constructor,
    // mas sem precisar declarar o constructor explicitamente.
    private http = inject(HttpClient);

    // URL base da API do backend.
    // Em desenvolvimento aponta para o Express rodando localmente.
    // Em produção, trocaria para a URL do servidor real.
    private readonly API_URL = 'http://localhost:3000';

    // -----------------------------------------------------------
    // createPlayer
    // Chama POST /players para criar uma nova partida no banco.
    //
    // Retorna um Observable<Player>:
    //   - Observable é como uma "promessa que pode emitir valores"
    //   - O componente se "inscreve" (.subscribe) e recebe o
    //     Player quando a requisição terminar
    //
    // Body enviado:
    //   { name: "Aragorn", class: "paladin", race: "human" }
    //
    // Resposta esperada (201 Created):
    //   { id, name, class, race, current_scene_slug, flags, ... }
    // -----------------------------------------------------------
    createPlayer(input: CreatePlayerInput): Observable<Player> {
        return this.http.post<Player>(`${this.API_URL}/players`, input);
    }

    // -----------------------------------------------------------
    // getPlayerById
    // Chama GET /players/:id para buscar o estado atual do jogador.
    //
    // Usado ao recarregar a página: recuperamos o ID do
    // localStorage e buscamos o jogador completo na API.
    //
    // Resposta esperada (200 OK):
    //   { id, name, class, race, current_scene_slug, flags, ... }
    // -----------------------------------------------------------
    getPlayerById(playerId: string): Observable<Player> {
        return this.http.get<Player>(`${this.API_URL}/players/${playerId}`);
    }

    // -----------------------------------------------------------
    // getPlayerPowers
    // Chama GET /players/:id/powers para buscar os poderes
    // já desbloqueados pelo jogador.
    //
    // O painel lateral da tela de cena exibe esses poderes.
    //
    // Resposta esperada (200 OK):
    //   [ { id, name, description, class, unlocked_at_act }, ... ]
    // -----------------------------------------------------------
    getPlayerPowers(playerId: string): Observable<Power[]> {
        return this.http.get<Power[]>(`${this.API_URL}/players/${playerId}/powers`);
    }
}