// =============================================================
// Serviço HTTP do módulo player.
//
// Responsabilidade: comunicar com a API do backend nos
// endpoints relacionados ao jogador.
//
// Endpoints consumidos:
//   POST /players          → cria nova partida
//   GET  /players/:id      → retorna estado do jogador
//   GET  /players/:id/powers → retorna poderes desbloqueados
//
// Este serviço não conhece componentes — só fala com a API.
// Quem chama este serviço são os componentes Angular.
// =============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// -------------------------------------------------------------
// Tipos TypeScript
// Espelham exatamente o que a API retorna — baseados no
// player.service.ts do backend e no 001_schema.sql.
// -------------------------------------------------------------

// Dados enviados para criar uma nova partida
// Espelho do CreatePlayerInput do backend
export interface CreatePlayerInput {
    name: string;
    class: 'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer';
    race: 'human' | 'dwarf' | 'night_elf';
}

// Dados retornados ao buscar um jogador
// Espelho da interface Player do backend
export interface Player {
    id: string;
    name: string;
    class: string;
    race: string;
    current_scene_slug: string;
    flags: Record<string, boolean>; // ex: { "warned_villagers": true }
    ending: string | null;          // 'A', 'B' ou null se ainda não terminou
    created_at: string;
}

// Um poder desbloqueado pelo jogador
// Espelho da interface Power do backend
export interface Power {
    id: string;
    name: string;
    description: string;
    class: string;
    unlocked_at_act: number;
}

// -------------------------------------------------------------
// PlayerService
// Injetável em qualquer componente Angular que precisar
// criar, buscar ou listar poderes de um jogador.
// -------------------------------------------------------------

@Injectable({
    // 'root' significa que o Angular cria uma única instância
    // deste serviço para toda a aplicação — padrão singleton.
    providedIn: 'root'
})
export class PlayerService {

    // URL base da API vinda do environment —
    // nunca hardcodar 'http://localhost:3000' diretamente aqui
    private apiUrl = environment.apiUrl;

    // HttpClient é injetado automaticamente pelo Angular.
    // É ele quem faz as requisições HTTP para o backend.
    constructor(private http: HttpClient) {}

    // -------------------------------------------------------------
    // createPlayer
    // Chama POST /players para iniciar uma nova partida.
    //
    // Recebe os dados do formulário de criação de personagem
    // e retorna o jogador criado com seu ID único.
    // -------------------------------------------------------------
    createPlayer(input: CreatePlayerInput): Observable<Player> {
        return this.http.post<Player>(
            `${this.apiUrl}/players`,
            input
        );
    }

    // -------------------------------------------------------------
    // getPlayer
    // Chama GET /players/:id para buscar o estado atual
    // do jogador — cena atual, flags acumuladas, etc.
    //
    // Usado pelo SceneComponent para saber em qual cena
    // o jogador está ao carregar a aplicação.
    // -------------------------------------------------------------
    getPlayer(playerId: string): Observable<Player> {
        return this.http.get<Player>(
            `${this.apiUrl}/players/${playerId}`
        );
    }

    // -------------------------------------------------------------
    // getPlayerPowers
    // Chama GET /players/:id/powers para buscar os poderes
    // já desbloqueados pelo jogador.
    //
    // Usado pelo PowersPanelComponent para exibir o painel
    // lateral de poderes na tela de cena.
    // -------------------------------------------------------------
    getPlayerPowers(playerId: string): Observable<Power[]> {
        return this.http.get<Power[]>(
            `${this.apiUrl}/players/${playerId}/powers`
        );
    }

}