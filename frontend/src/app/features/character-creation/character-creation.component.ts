// =============================================================
// CharacterCreationComponent — Tela de criação de personagem.
//
// Responsabilidade:
//   - Exibir os campos: nome, classe (5 opções), raça (3 opções)
//   - Validar que todos os campos foram preenchidos
//   - Chamar POST /players via PlayerService
//   - Salvar o jogador no GameService (estado global)
//   - Salvar o playerId no localStorage (persiste ao recarregar)
//   - Navegar para /scene/brill_arrival após sucesso
//
// Fluxo:
//   Usuário preenche o form → clica "Criar personagem"
//   → PlayerService.createPlayer() → POST /players
//   → backend cria jogador + atribui poderes do Ato 1
//   → retorna Player → GameService.setPlayer()
//   → router.navigate(['/scene', 'brill_arrival'])
// =============================================================

import { Component, inject }  from '@angular/core';
import { Router }              from '@angular/router';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

// PlayerService: faz as chamadas HTTP para o backend
import { PlayerService, CreatePlayerInput } from '../../core/services/player.service';

// GameService: armazena o estado global da partida em memória
import { GameService } from '../../core/services/game.service';

// -------------------------------------------------------------
// Tipos locais para as opções do formulário.
// Mantemos os dados das classes aqui no componente mesmo,
// pois são dados estáticos de UI (labels, cores, flavor text).
// -------------------------------------------------------------

// Representa uma classe jogável para exibição nos cards
interface ClasseOpcao {
    valor:  'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer';
    nome:   string;        // nome exibido em português
    flavor: string;        // descrição curta da classe
    racas:  string;        // raças compatíveis (exibição)
    cor:    string;        // cor accent da classe (para o CSS)
    corLt:  string;        // cor accent clara (para texto)
}

// Representa uma raça jogável para exibição nos cards
interface RacaOpcao {
    valor:       'human' | 'dwarf' | 'night_elf';
    nome:        string;
    descricao:   string;
    // Quais classes esta raça pode escolher (para filtrar)
    classesPermitidas: Array<'warrior' | 'paladin' | 'rogue' | 'mage' | 'archer'>;
}

@Component({
    selector:    'app-character-creation',
    standalone:  true,

    // FormsModule: habilita o [(ngModel)] para two-way data binding
    // nos campos de input (nome do personagem).
    // CommonModule: habilita *ngIf, *ngFor, [ngClass], etc.
    imports:     [CommonModule, FormsModule],

    templateUrl: './character-creation.component.html',
    styleUrls:   ['./character-creation.component.css'],
})
export class CharacterCreationComponent {

    // -----------------------------------------------------------
    // Injeção de dependências
    // -----------------------------------------------------------
    private router        = inject(Router);
    private playerService = inject(PlayerService);
    private gameService   = inject(GameService);

    // -----------------------------------------------------------
    // Estado do formulário
    // Estas propriedades são ligadas ao template via [(ngModel)]
    // e (click). Quando o usuário interage, o Angular atualiza
    // automaticamente o valor aqui no componente.
    // -----------------------------------------------------------

    // Campo de texto: nome do personagem
    nome = '';

    // Classe selecionada — começa null (nenhuma selecionada)
    classeSelecionada: ClasseOpcao['valor'] | null = null;

    // Raça selecionada — começa null
    racaSelecionada: RacaOpcao['valor'] | null = null;

    // Controle de loading: true enquanto aguarda a API responder
    carregando = false;

    // Mensagem de erro para exibir ao usuário (ou null se não há erro)
    erro: string | null = null;

    // -----------------------------------------------------------
    // Dados estáticos das classes
    // Usados pelo *ngFor no template para renderizar os cards.
    // Os valores de 'valor' batem exatamente com o que o backend
    // espera no campo 'class' do POST /players.
    // -----------------------------------------------------------
    readonly classes: ClasseOpcao[] = [
        {
            valor:  'warrior',
            nome:   'Guerreiro',
            flavor: 'Linha de frente implacável. Força bruta e domínio físico.',
            racas:  'Humano · Anão',
            cor:    '#B03A2E',
            corLt:  '#F1948A',
        },
        {
            valor:  'paladin',
            nome:   'Paladino',
            flavor: 'Campeão da Luz. Equilibra espada e fé — cura aliados e destrói o profano.',
            racas:  'Humano · Anão',
            cor:    '#D4AC0D',
            corLt:  '#F9E79F',
        },
        {
            valor:  'mage',
            nome:   'Mago',
            flavor: 'Domínio arcano de fogo e gelo. Alto dano, alto risco.',
            racas:  'Humano',
            cor:    '#1A5276',
            corLt:  '#85C1E9',
        },
        {
            valor:  'rogue',
            nome:   'Ladino',
            flavor: 'Sombra e veneno. Opera nas frestas da percepção alheia.',
            racas:  'Elfo Noturno',
            cor:    '#6C3483',
            corLt:  '#C39BD3',
        },
        {
            valor:  'archer',
            nome:   'Arqueiro',
            flavor: 'Precisão absoluta à distância. Evolui para mestre da caça.',
            racas:  'Elfo Noturno',
            cor:    '#1E8449',
            corLt:  '#82E0AA',
        },
    ];

    // -----------------------------------------------------------
    // Dados estáticos das raças
    // classesPermitidas define quais classes cada raça pode usar.
    // Usamos isso para desabilitar automaticamente classes
    // incompatíveis quando uma raça é selecionada.
    // -----------------------------------------------------------
    readonly racas: RacaOpcao[] = [
        {
            valor:             'human',
            nome:              'Humano',
            descricao:         'Versáteis — acesso à maioria das classes.',
            classesPermitidas: ['warrior', 'paladin', 'mage'],
        },
        {
            valor:             'dwarf',
            nome:              'Anão',
            descricao:         'Resistentes — especialistas em linha de frente.',
            classesPermitidas: ['warrior', 'paladin'],
        },
        {
            valor:             'night_elf',
            nome:              'Elfo Noturno',
            descricao:         'Furtivos — classes de sombra e precisão.',
            classesPermitidas: ['rogue', 'archer'],
        },
    ];

    // -----------------------------------------------------------
    // selecionarClasse
    // Chamado quando o jogador clica em um card de classe.
    // Se a raça já foi selecionada, valida se a combinação é
    // permitida antes de aceitar a seleção.
    // -----------------------------------------------------------
    selecionarClasse(classe: ClasseOpcao['valor']): void {
        // Se esta classe está bloqueada pela raça atual, ignora o clique
        if (this.classeEstaDesabilitada(classe)) return;

        this.classeSelecionada = classe;
        this.erro = null; // limpa erros anteriores
    }

    // -----------------------------------------------------------
    // selecionarRaca
    // Chamado quando o jogador clica em um card de raça.
    // Se a classe atual é incompatível com a nova raça,
    // deseleciona a classe para forçar nova escolha.
    // -----------------------------------------------------------
    selecionarRaca(raca: RacaOpcao['valor']): void {
        this.racaSelecionada = raca;
        this.erro = null;

        // Se já tinha uma classe selecionada, verifica se ainda é válida
        // com a nova raça. Se não for, limpa a seleção de classe.
        if (this.classeSelecionada) {
            const racaObj = this.racas.find(r => r.valor === raca);
            if (racaObj && !racaObj.classesPermitidas.includes(this.classeSelecionada)) {
                // Classe incompatível com a raça escolhida — reseta
                this.classeSelecionada = null;
            }
        }
    }

    // -----------------------------------------------------------
    // classeEstaDesabilitada
    // Retorna true se uma classe não pode ser escolhida com a
    // raça atualmente selecionada. Usado no template com [ngClass]
    // para adicionar a classe CSS 'desabilitada' ao card.
    // -----------------------------------------------------------
    classeEstaDesabilitada(classe: ClasseOpcao['valor']): boolean {
        // Se nenhuma raça foi selecionada ainda, nenhuma classe é bloqueada
        if (!this.racaSelecionada) return false;

        const racaObj = this.racas.find(r => r.valor === this.racaSelecionada);
        // Se a raça não existe no array (não deveria acontecer), libera tudo
        if (!racaObj) return false;

        // Retorna true se a classe NÃO está na lista de classes permitidas
        return !racaObj.classesPermitidas.includes(classe);
    }

    // -----------------------------------------------------------
    // formularioValido
    // Getter que verifica se todos os campos obrigatórios foram
    // preenchidos. Usado no template para desabilitar o botão
    // de submit enquanto o form está incompleto.
    //
    // Getter = propriedade computada. O Angular re-avalia
    // automaticamente sempre que o template é verificado.
    // -----------------------------------------------------------
    get formularioValido(): boolean {
        return (
            this.nome.trim().length >= 2 &&   // nome com pelo menos 2 caracteres
            this.classeSelecionada !== null &&
            this.racaSelecionada   !== null
        );
    }

    // -----------------------------------------------------------
    // criarPersonagem
    // Chamado ao clicar no botão "Começar aventura".
    // Valida o form, chama a API e navega para a primeira cena.
    // -----------------------------------------------------------
    criarPersonagem(): void {
        // Dupla verificação — o botão já fica desabilitado pelo
        // formularioValido, mas validamos aqui também por segurança.
        if (!this.formularioValido || this.carregando) return;

        // Ativa o estado de loading (desabilita o botão, mostra spinner)
        this.carregando = true;
        this.erro       = null;

        // Monta o objeto que o backend espera no body do POST /players
        const input: CreatePlayerInput = {
            name:  this.nome.trim(),
            class: this.classeSelecionada!,  // ! = garantimos que não é null acima
            race:  this.racaSelecionada!,
        };

        // Chama o PlayerService que faz o POST /players
        // .subscribe() é como o Angular "escuta" a resposta HTTP.
        // next  → chamado quando a API responde com sucesso (2xx)
        // error → chamado quando a API responde com erro (4xx, 5xx)
        this.playerService.createPlayer(input).subscribe({

            next: (player) => {
                // Sucesso: salva o jogador no estado global (memória)
                this.gameService.setPlayer(player);

                // Persiste o ID no localStorage para sobreviver a F5
                this.gameService.savePlayerIdToStorage(player.id);

                // Navega para a primeira cena do jogo
                this.router.navigate(['/scene', 'brill_arrival']);
            },

            error: (err) => {
                // Falha: desativa loading e exibe mensagem de erro
                this.carregando = false;
                this.erro = err?.error?.error ?? 'Erro ao criar personagem. Tente novamente.';
                console.error('Erro ao criar personagem:', err);
            },
        });
    }
}