// =============================================================
// Estado global da partida ativa.
//
// Este service funciona como a "memória" do frontend:
// guarda o ID do jogador e a cena atual para que qualquer
// componente possa acessar essas informações sem precisar
// ficar passando dados via @Input de pai para filho.
//
// Ele NÃO faz requisições HTTP — só armazena estado.
// Quem faz HTTP são o player.service e o scene.service.
//
// Como é providedIn: 'root', o Angular cria uma única
// instância dele para toda a aplicação (singleton).
// =============================================================

import { Injectable } from '@angular/core';

// -------------------------------------------------------------
// Tipos TypeScript
// Espelham exatamente o que a API do backend retorna,
// garantindo que o TypeScript nos avise se algo mudar.
// -------------------------------------------------------------

// Espelha a interface Player do backend (player.service.ts)
export interface Player {
    id: string;
    name: string;
    class: 'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer';
    race: 'human' | 'dwarf' | 'night_elf';
    current_scene_slug: string;
    flags: Record<string, boolean>; // ex: { "warned_villagers": true }
    ending: string | null;          // 'A', 'B' ou null se não terminou
    created_at: string;
}

// Espelha a interface Choice do backend (scene.service.ts)
export interface Choice {
    id: string;
    label: string;
    description: string;
    next_scene_slug: string;
}

// Espelha a interface Scene do backend (scene.service.ts)
export interface Scene {
    id: string;
    slug: string;
    act: number;
    title: string;
    narrative_text: string;
    background_image: string;
    sprite_image: string;
    choices: Choice[];
}

// Espelha a interface Power do backend (power.service.ts)
export interface Power {
    id: string;
    name: string;
    description: string;
    class: string;
    unlocked_at_act: number;
}

// -------------------------------------------------------------
// GameService
// -------------------------------------------------------------
@Injectable({
    // 'root' = Angular cria uma única instância para toda a app.
    // Qualquer componente que injetar GameService vai receber
    // o mesmo objeto, com os mesmos dados.
    providedIn: 'root'
})
export class GameService {

    // -----------------------------------------------------------
    // Estado privado da partida
    //
    // Privado para forçar o uso dos métodos abaixo — evita que
    // outros arquivos sobrescrevam os dados diretamente, o que
    // dificultaria rastrear onde o estado muda.
    // -----------------------------------------------------------

    // Jogador ativo. null = nenhuma partida em andamento.
    private currentPlayer: Player | null = null;

    // Cena atual que está sendo exibida na tela.
    private currentScene: Scene | null = null;

    // -----------------------------------------------------------
    // LEITURA DO ESTADO
    // Getters — permitem ler os dados sem poder alterá-los.
    // -----------------------------------------------------------

    // Retorna o jogador atual (ou null se não há partida ativa)
    getPlayer(): Player | null {
        return this.currentPlayer;
    }

    // Retorna a cena atual (ou null se nenhuma cena carregada)
    getScene(): Scene | null {
        return this.currentScene;
    }

    // Atalho: retorna o ID do jogador sem expor o objeto inteiro.
    // Muito usado nos services HTTP para montar as URLs da API.
    // Ex: /players/${gameService.getPlayerId()}/powers
    getPlayerId(): string | null {
        return this.currentPlayer?.id ?? null;
    }

    // Verifica se há uma partida ativa.
    // Usado pelo GameActiveGuard para proteger rotas.
    isGameActive(): boolean {
        return this.currentPlayer !== null;
    }

    // -----------------------------------------------------------
    // ESCRITA DO ESTADO
    // Métodos que atualizam os dados — chamados pelos componentes
    // após receberem respostas da API.
    // -----------------------------------------------------------

    // Salva o jogador quando a partida é criada (POST /players)
    // ou quando o estado é recarregado (GET /players/:id).
    setPlayer(player: Player): void {
        this.currentPlayer = player;
    }

    // Salva a cena atual quando o componente de cena a carrega
    // (GET /scenes/:slug).
    setScene(scene: Scene): void {
        this.currentScene = scene;
    }

    // Atualiza apenas a cena atual do jogador após uma escolha.
    // O choice.service do backend retorna nextSceneSlug —
    // salvamos aqui para o componente de cena saber para onde ir.
    updateCurrentSceneSlug(slug: string): void {
        if (this.currentPlayer) {
            this.currentPlayer.current_scene_slug = slug;
        }
    }

    // Adiciona uma flag ao jogador local após uma escolha.
    // Mantém o estado do frontend sincronizado com o banco,
    // sem precisar buscar o jogador inteiro novamente.
    // Ex: setFlag('warned_villagers') → flags = { warned_villagers: true }
    setFlag(flagName: string): void {
        if (this.currentPlayer) {
            this.currentPlayer.flags[flagName] = true;
        }
    }

    // Limpa toda a partida — chamado ao reiniciar o jogo.
    // Após isso, isGameActive() retorna false e o guard
    // redireciona o jogador para a tela inicial.
    clearGame(): void {
        this.currentPlayer = null;
        this.currentScene  = null;
    }

    // -----------------------------------------------------------
    // PERSISTÊNCIA ENTRE RECARREGAMENTOS (localStorage)
    //
    // O Angular perde o estado da memória se o usuário recarregar
    // a página (F5). Para evitar isso, salvamos o ID do jogador
    // no localStorage do navegador — um armazenamento simples
    // de chave/valor que persiste entre sessões.
    //
    // Guardamos SÓ o ID, não o objeto inteiro. Na próxima visita,
    // o componente usa o ID para buscar o jogador na API.
    // -----------------------------------------------------------

    // Salva o ID do jogador no localStorage.
    // Chamado logo após criar a partida (POST /players).
    savePlayerIdToStorage(playerId: string): void {
        localStorage.setItem('warcraft_player_id', playerId);
    }

    // Recupera o ID salvo no localStorage.
    // Retorna null se não há nada salvo (primeira visita).
    loadPlayerIdFromStorage(): string | null {
        return localStorage.getItem('warcraft_player_id');
    }

    // Remove o ID do localStorage.
    // Chamado junto com clearGame() ao reiniciar o jogo.
    clearStorage(): void {
        localStorage.removeItem('warcraft_player_id');
    }
}