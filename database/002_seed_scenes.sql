-- =============================================================
-- 002_seed_scenes.sql
-- Warcraft RPG — Cenas e choices de toda a narrativa
--
-- ORDEM DE EXECUÇÃO: rode DEPOIS de 001_schema.sql.
-- Execute no SQL Editor do Supabase (New Query → Cole → Run).
--
-- ESTRUTURA DA HISTÓRIA:
--   Ato 1: brill_arrival → brill_barn → plague_confirmed → andorhal_quarantine
--   Ato 2: stratholme_gates → stratholme_the_choice (→ stratholme_aftermath)
--   Ato 3A (Luz):   alliance_camp → uther_falls → lordaeron_last_stand
--   Ato 3B (Trevas): northrend_departure → frostmourne_cave → lordaeron_march
--   Ato 4: throne_room → final_choice → ending_light | ending_dark
-- =============================================================


-- ─────────────────────────────────────────────────────────────
-- SCENES
-- narrative_text contém narração + diálogos em texto puro.
-- O Angular exibe esse campo direto na tela — sem HTML.
-- Formato dos diálogos: "Personagem: \"fala\"" em nova linha.
-- ON CONFLICT DO NOTHING → script pode ser re-executado sem erro.
-- ─────────────────────────────────────────────────────────────

INSERT INTO scenes (slug, act, title, narrative_text, background_image, sprite_image)
VALUES

-- Ato 1 · brill_arrival
(
  'brill_arrival',
  1,
  'Chegada a Brill',
  'A estrada de terra que leva a Brill é larga e bem conservada — sinal de que esta cidade já foi próspera. Campos de trigo dourado se estendem dos dois lados, e o cheiro de pão vindo das padarias ainda alcança o ar da manhã. Cavalos, carroças e crianças fazendo barulho. Uma cidade viva.

Você cavalga atrás do Príncipe Arthas Menethil, terceiro na linha de sucessão ao trono de Lordaeron e paladino da Ordem da Mão de Prata. Ele tem vinte e três anos, ombros largos e um sorriso que convence qualquer pessoa de que tudo vai ficar bem. Ao lado dele, Jaina Proudmoore — maga de Dalaran, cabelos dourados e olhos que calculam tudo antes de falar.

O rei Terenas os enviou para investigar rumores. Aldeões desaparecendo. Animais mortos sem marca de predador. Colheitas apodrecendo do dia para a noite. "Provavelmente histeria," disse o conselheiro real. Arthas não pareceu convencido. Jaina tampouco.

Arthas: "Brill. Já estive aqui quando criança. O prefeito Aelthalyien fazia o melhor mel de todo o norte. ((pausa, olhando para a praça central)) Parece menor do que eu lembrava."

Jaina: "Os lugares sempre parecem menores quando a responsabilidade cresce. ((baixinho, para você)) Fique atento. Vim dois dias antes de vocês. Algo está errado aqui — não consigo precisar o quê."

Arthas: "Vamos falar com o prefeito primeiro. Depois fazemos uma ronda pelos arredores. ((para você)) Soldado — você vem comigo."

O prefeito Aelthalyien recebe vocês no salão da prefeitura com a expressão de um homem que não dormiu bem há dias. Ele serve vinho que ninguém toca e fala rápido demais — sobre o quanto a cidade está bem, sobre como os rumores são exagerados, sobre como tudo que Arthas precisa é de um bom descanso antes de voltar para a capital.

Durante a conversa, você nota uma coisa. Numa das janelas laterais, uma mulher velha passa — e para por um segundo, olhando para dentro com uma expressão que você não consegue classificar. Medo? Súplica? Antes que você possa reagir, ela desaparece na viela.',
  'brill_town_day.jpg',
  'arthas_standing.png'
),

-- Ato 1 · brill_barn
(
  'brill_barn',
  1,
  'O Celeiro Selado',
  'O celeiro fica no limite leste de Brill, longe da praça. A corrente na porta é nova — comprada recentemente, grossa demais para um celeiro comum. Do interior vêm sons abafados. Não de animais. De pessoas.

Arthas para na frente da porta. Jaina cruza os braços. Você conta pelo menos quatro vozes lá dentro — adultos, uma criança. A velha, se foi ela quem te trouxe aqui, está de joelhos alguns metros atrás, rezando em silêncio.

Arthas: "Quem colocou essas pessoas aqui? ((para você)) Você sabia disso antes de me trazer?"

Jaina: "Arthas. Espera. ((ela coloca a mão perto da porta, fecha os olhos por um momento)) Tem magia aqui. Não é feitiçaria — é corrupção. Biológica. Esse grão que eles comeram..."

Arthas: "((interrompendo)) Vamos abrir essa porta. Não vou deixar cidadãos de Lordaeron trancados como animais."

Quando a corrente cede e a porta abre, o cheiro vem primeiro — algo adocicado e podre ao mesmo tempo. Os quatro aldeões dentro estão vivos, mas mal. Olhos avermelhados, veias escurecidas nos pescoços, tremores intermitentes. Uma delas — a mais velha — tenta falar, mas o que sai é metade palavra, metade gemido.

Ela consegue dizer três coisas: "o grão," "Kel''Thuzad," e "fujam." Depois para de tremer. Depois para de respirar.',
  'brill_barn_night.jpg',
  'arthas_standing.png'
),

-- Ato 1 · plague_confirmed
(
  'plague_confirmed',
  1,
  'A Praga Confirmada',
  'Jaina passou a noite estudando amostras do grão. Quando o sol nasce, ela tem a resposta — e o rosto de quem preferia não ter encontrado. A praga não é acidente. Alguém preparou aquele grão para transformar quem o comesse. Não em doente. Em morto-vivo consciente por tempo suficiente para continuar comendo, distribuindo, infectando.

O nome que a aldeã murmurou antes de morrer — Kel''Thuzad — é conhecido. Um membro expulso do Kirin Tor de Dalaran por estudar necromancia proibida. Sumiu há anos. Agora reaparece como autor de uma praga que já se espalhou por pelo menos seis aldeias ao norte de Brill.

Jaina: "A transformação leva entre quarenta e oito e setenta e duas horas após o consumo. Depois disso, não há reversão. Qualquer pessoa que comeu desse grão nos últimos três dias está... condenada."

Arthas: "((em voz baixa, quase para si mesmo)) Quantas aldeias disseste? Seis?"

Jaina: "Que eu tenha confirmação. Podem ser mais. O grão foi distribuído por um mercador — rastreamos até Andorhal. É de lá que vem o suprimento para toda a região."

Arthas: "Então é para Andorhal que vamos. ((para você)) Você investigaria Kel''Thuzad se eu deixasse seguir adiante sozinho?"',
  'lordaeron_road.jpg',
  'jaina_standing.png'
),

-- Ato 1 · andorhal_quarantine
(
  'andorhal_quarantine',
  1,
  'Andorhal — A Quarentena',
  'Andorhal é maior do que Brill. Uma cidade de mercadores, com um celeiro central que abastece metade do norte de Lordaeron. Quando chegam, Uther Lightbringer já está lá — velho, enorme, com a armadura dourada da Mão de Prata amassada em lugares que contam histórias. Ele abraça Arthas com a força de um pai, depois recua e olha o jovem príncipe nos olhos por tempo suficiente para que o abraço signifique alguma coisa.

A situação em Andorhal é pior do que Brill. Ruas desertas no meio da tarde. Portas fechadas. Um cheiro que você aprendeu a reconhecer. No celeiro central, soldados de Uther mantêm um perímetro. Dentro, estima-se que há trezentas pessoas. Algumas ainda humanas. A maioria, não por muito mais tempo.

Uther: "Arthas. Não há solução bonita aqui. Selamos o celeiro. Ninguém entra, ninguém sai. Quem vier de fora, orientamos a não tocar em comida local e seguir para o sul."

Arthas: "E as trezentas pessoas dentro?"

Uther: "((uma pausa longa)) Rezamos por elas."

Arthas: "((girando para você)) Você concorda com isso?"

Arthas te olha com uma intensidade que não é de príncipe para soldado — é de um homem que precisa saber se tem alguém ao lado que pensa da mesma forma que ele. A quarentena de Uther é fria, calculada, e provavelmente correta do ponto de vista estratégico. Mas há trezentas pessoas dentro daquele celeiro que ainda têm nome, ainda têm família.',
  'andorhal_gate.jpg',
  'uther_standing.png'
),

-- Ato 2 · stratholme_gates
(
  'stratholme_gates',
  2,
  'Os Portões de Stratholme',
  'Stratholme é a maior cidade do norte de Lordaeron. Muralhas de pedra cinza, torres de vigia, um mercado que funciona há duzentos anos. Agora, à distância, você vê fumaça saindo de pelo menos três pontos dentro das muralhas — e isso é de manhã.

Arthas para o cavalo a quinhentos metros dos portões. Ele fica imóvel por um longo momento, olhando para a cidade, e quando fala, a voz está diferente — mais pesada, como se as palavras custassem alguma coisa física para serem ditas.

Arthas: "Stratholme recebeu o mesmo grão de Andorhal. O carregamento chegou três dias atrás. ((pausa)) Jaina. Quanto tempo?"

Jaina: "((com a voz embargada)) Se o grão chegou há três dias... a maioria da população já consumiu. A transformação começa em menos de doze horas agora. Arthas, não há como—"

Arthas: "Eu sei. ((ele desce do cavalo)) Então precisamos purgar a cidade antes que eles se levantem. Cada morto-vivo que sair daqui vai infectar outras cinco pessoas. Dez. Cem."

Uther: "Arthas. Você está falando de matar pessoas inocentes. Essas pessoas ainda estão vivas. Você é um paladino — isso viola tudo que—"

Arthas: "((cortando)) Elas estão mortas, Uther. Elas só ainda não sabem disso. Eu escolho salvar as que ainda podem ser salvas — todos os outros reinos ao sul dessas muralhas."

Uther arranca a capa e a joga no chão aos pés de Arthas. "Então faça sem mim." Ele monta e parte para o sul sem olhar para trás, levando metade dos cavaleiros com ele.

Jaina fica. Ela olha para Arthas por um tempo que parece longo demais — como se estivesse procurando dentro dele a pessoa que ela conhecia. Depois olha para você.',
  'stratholme_burning.jpg',
  'arthas_standing.png'
),

-- Ato 2 · stratholme_the_choice
(
  'stratholme_the_choice',
  2,
  'A Purga — A Escolha',
  'Jaina Proudmoore olha para você. Não para Arthas — para você. Como se a decisão fosse sua tanto quanto dela. Como se soubesse que onde você for, o peso vai junto.

Arthas já está de frente para os portões de Stratholme, a mão no cabo de Frostmourne — não, não ainda, ainda é a espada de paladino — e a voz da cidade chega até vocês: não gritos de pânico, não ainda. Sons de mercado, crianças, um ferreiro batendo em metal. Sons de pessoas que não sabem.

Jaina fala baixo, só para você ouvir.

Jaina: "Eu não consigo fazer isso. Não consigo ficar aqui e assistir. Mas também não consigo simplesmente ir embora e deixar você sozinho nessa decisão. ((ela te olha diretamente)) Você vai ficar?"

Arthas não ouve. Ele já está descendo a colina em direção aos portões, com a meia dúzia de soldados que restaram. O sol está alto. As chamas dentro de Stratholme estão crescendo — nem mesmo começaram a purga ainda e a cidade já está pegando fogo sozinha, como se o destino fosse impaciente.

Você precisa decidir agora.',
  'stratholme_burning.jpg',
  'arthas_combat.png'
),

-- Ato 2 · stratholme_aftermath
(
  'stratholme_aftermath',
  2,
  'Depois das Chamas',
  'A fumaça de Stratholme ainda é visível no horizonte quando a noite cai. Você — seja qual for o caminho que escolheu — está parado numa estrada vazia de Lordaeron, e o silêncio ao redor pesa de um jeito diferente do que pesava esta manhã.

Arthas não voltou para o acampamento principal. Os rumores que chegam pelos soldados falam de Northrend — que ele quer ir ao norte, encontrar Mal''Ganis, terminar o que a praga começou. Que ele queimou os navios de volta. Que ninguém consegue mais olhar nos olhos dele da mesma forma.

Jaina está sentada longe do fogo, escrevendo uma carta para o rei Terenas — você não lê o que está escrito, mas vê a mão dela parar várias vezes antes de continuar.

Uther não está. Ninguém sabe onde Uther está.

narrador: "O que aconteceu em Stratholme não pode ser desfeito. O que acontecer a seguir ainda está nas suas mãos. Por enquanto."',
  'lordaeron_road_dusk.jpg',
  'arthas_standing.png'
),

-- Ato 3 · alliance_camp
(
  'alliance_camp',
  3,
  'O Acampamento da Aliança',
  'O acampamento da Aliança ao sul de Lordaeron é maior do que você esperava — e mais silencioso. Há soldados por toda parte, mas o tipo de silêncio que eles carregam não é de descanso. É de pessoas esperando por más notícias que sabem que vêm.

Jaina chefia as reuniões estratégicas com uma precisão que não deixa espaço para dúvida, mas você a vê, entre uma reunião e outra, olhando para o norte. Procurando fumaça. Procurando notícias de Arthas.

Uther chega ao terceiro dia — sozinho, sem os cavaleiros, com a armadura amassada de um jeito que não acontece em batalha. Acontece em queda. Ele não explica. Senta ao lado do fogo e fica lá por um longo tempo. Quando levanta, procura você especificamente.

Uther: "Jaina me disse o que você fez em Stratholme. Que você escolheu partir com ela. ((pausa)) Isso foi difícil. Sei que foi. Um soldado que obedece ordens não é coisa rara. Um soldado que sabe quando não obedecer — esse é raro."

Você: "((a escolha do jogador aqui é o tom — responder com humildade ou com convicção))"

Uther: "O que vem aí vai ser pior do que Stratholme. Arthas vai voltar. Eu conheço esse garoto desde que ele tinha seis anos — e o que vai voltar vai usar o rosto dele, mas não vai ser ele. Precisamos de pessoas que saibam disso antes que aconteça."',
  'alliance_camp.jpg',
  'jaina_standing.png'
),

-- Ato 3 · uther_falls
(
  'uther_falls',
  3,
  'A Morte de Uther',
  'Arthas chega como uma tempestade que você viu se formando no horizonte por dias. Lordaeron não cai de uma vez — cai em pedaços, aldeia por aldeia, até que uma manhã os mortos-vivos estão nas muralhas da capital e o rei Terenas manda mensageiros pedindo ajuda à Aliança.

Uther vai com duzentos paladinos. Você vai junto. A batalha nas ruas de Lordaeron City é caótica, barulhenta, cheia de fumaça e mortos que deveriam estar deitados. E no meio de tudo isso, você vê Arthas.

Não o Arthas que você conheceu. Esse usa armadura negra, uma espada que parece sugar a luz ao redor, e os olhos — os olhos estão certos, mas algo dentro deles virou ao contrário. Ele está procurando Uther. E Uther, que passou a vida inteira defendendo este reino, vai ao encontro dele sem hesitar.

Arthas: "((com a voz do mesmo jeito, mas vazia)) Você me ensinou tudo que sei sobre honra, Uther. Pena que honra não seja suficiente para salvar um reino."

Uther: "Arthas. Ainda posso ver você lá dentro. Filho — volte."

Arthas: "((sem raiva, o que é pior)) Não há mais dentro."

Frostmourne sobe. Você está a dez metros. Há mortos-vivos entre você e Uther — não muitos, mas o suficiente para que qualquer escolha tenha um custo.',
  'lordaeron_ruins.jpg',
  'arthas_combat.png'
),

-- Ato 3 · lordaeron_last_stand
(
  'lordaeron_last_stand',
  3,
  'O Último Bastião',
  'O salão do trono de Lordaeron City ainda está de pé — por quanto tempo, ninguém sabe. Jaina organizou os sobreviventes aqui: soldados da Aliança, alguns magos de Dalaran, civis que não tiveram para onde ir. São menos do que deveriam ser. São mais do que você esperava encontrar.

A batalha vai chegar aqui. Arthas está vindo. Você sente isso antes de ouvir os gritos dos sentinelas nas torres.

Jaina pega sua mão por um segundo — não como gesto romântico, como gesto de alguém que sabe que os próximos minutos vão contar. "Qualquer coisa que aconteça aqui — você fez a escolha certa em Stratholme. Quero que você saiba disso."

Os portões do salão explodem. Arthas entra devagar — não tem pressa, os mortos-vivos não têm pressa. Ele para no centro do salão e olha ao redor como se estivesse avaliando um trabalho quase concluído. Depois te vê. Reconhece você. E pela primeira e única vez desde Stratholme, algo muda na expressão dele.

Não o suficiente. Mas algo.

Arthas: "Você. Eu me lembro de você. Você partiu com ela. ((uma pausa)) Isso foi uma escolha inteligente — na época."

Você: "((o jogador pode responder — qualquer resposta leva para o EP10))"',
  'lordaeron_throne.jpg',
  'jaina_standing.png'
),

-- Ato 3 · northrend_departure
(
  'northrend_departure',
  3,
  'A Partida para Northrend',
  'Os navios deixam Lordaeron antes do amanhecer. Arthas contratou mercenários, convocou soldados, prometeu glória e justiça a quem o seguisse até o fim do mundo. Você foi um dos primeiros a se apresentar — e ele lembrou disso. Quando os outros ainda esperavam na fila, ele te puxou para o lado e disse apenas: "Bem-vindo ao que vai importar de verdade."

A viagem dura semanas. Northrend aparece primeiro como um cheiro — gelo e sal e algo mais embaixo, como terra que nunca viu o sol. Depois aparece como uma linha branca no horizonte que cresce até engolir o céu. As geleiras de Northrend não são bonitas. São absolutas.

No terceiro dia de terra firme, os capitães convocam uma reunião. Os rumores chegaram até eles — rumores de Lordaeron em chamas, de traição, de ordens do rei para retorno imediato. Eles querem ir embora.

Arthas: "((olhando para o mar, de costas para todos)) Quantos estão de acordo com os capitães?"

narrador: "Metade das mãos se erguem. Arthas vira. Olha para cada rosto. Chega até você — e espera."

Você: "((sua mão não se ergue. Arthas assente, mínimo.))"

Arthas: "Então queimem os navios."

O fogo dos navios ilumina o horizonte por horas. Os capitães gritam. Alguns choram. Arthas fica olhando as chamas com uma expressão de alguém que acabou de fechar uma porta por dentro — deliberadamente, para que não haja volta.

Você percebe, nesse momento, que ele não fez isso para prender os outros. Fez para se prender a si mesmo.',
  'northrend_glacier.jpg',
  'arthas_combat.png'
),

-- Ato 3 · frostmourne_cave
(
  'frostmourne_cave',
  3,
  'A Caverna de Frostmourne',
  'A caverna de gelo não aparece nos mapas. Arthas a encontra seguindo algo que ele descreve como "um chamado" — não metafórico, um som real que só ele ouve. Você segue porque ele pediu, e porque a esta altura você escolheu confiar nele até onde isso for possível.

O interior da caverna é maior do que o exterior deveria permitir. O gelo nas paredes tem uma transparência estranha — você consegue ver formas dentro, escuras e paradas, como insetos presos em âmbar. O som que Arthas dizia ouvir, dentro da caverna, você também ouve. É grave, constante, como uma nota musical que nenhum instrumento humano pode fazer.

No centro da caverna, numa plataforma de gelo, está a espada.

Frostmourne é linda de um jeito que nada belo deveria ser. A lâmina é de um azul quase branco, as runas gravadas parecem se mover quando você tenta lê-las, e o frio que emana dela não é o frio do gelo — é o frio da ausência. Como se ela consumisse calor, luz, presença.

Arthas: "((parado na frente da espada, sem se mover)) Ela está me chamando desde Lordaeron. Desde antes de Stratholme. Talvez desde antes disso. ((pausa)) Eu sei o que ela é. Eu sei o que ela faz. E vou pegá-la de qualquer forma, porque não há outra saída que eu consiga enxergar."

Você: "((o jogador observa — a próxima escolha determina o Final))"

Arthas pega Frostmourne. O momento em que a mão dele fecha na empunhadura, a luz da caverna muda — fica azul, fria, e as formas nas paredes de gelo parecem se mover. Ele solta um som que não é grito nem palavra, e fica parado por trinta segundos que parecem muito mais.

Quando vira para você, os olhos estão diferentes. Não completamente. Mas o suficiente para que você perceba que algo passou para dentro dele — ou saiu.

Ele estende a mão livre em sua direção. A espada pulsa entre eles.',
  'northrend_glacier.jpg',
  'arthas_combat.png'
),

-- Ato 3 · lordaeron_march
(
  'lordaeron_march',
  3,
  'A Marcha de Volta',
  'A viagem de volta de Northrend para Lordaeron dura semanas que você mal consegue distinguir uma da outra. Arthas não fala muito. Frostmourne fica sempre na bainha, mas você nunca deixa de saber que ela está lá — há um zumbido baixo, constante, que só para quando você para de prestar atenção.

Quando chegam a Lordaeron, a capital ainda está de pé. Mas mal. Os mortos-vivos já estão nas muralhas externas. O rei Terenas mandou mensageiros para Arthas — pedindo explicações sobre Stratholme, sobre Northrend, sobre os navios queimados. Os mensageiros esperavam uma resposta. Arthas passou por eles como se fossem estátuas.

Arthas: "((parando na entrada da cidade, olhando para as torres)) Você sabe o que precisa ser feito aqui, não sabe?"

Você: "((o jogador não responde — a cena continua independente))"

Arthas: "O rei não vai ceder o trono voluntariamente. Ele nunca vai entender o que está acontecendo — nenhum deles vai. ((pausa, quase para si mesmo)) Às vezes a misericórdia mais cruel é a mais necessária."',
  'northrend_glacier.jpg',
  'arthas_combat.png'
),

-- Ato 4 · throne_room
(
  'throne_room',
  4,
  'O Salão do Trono',
  'O salão do trono de Lordaeron tem sessenta metros de comprimento e teto alto o suficiente para que a voz ecoe três vezes antes de morrer. Você sabe disso porque ouviu discursos reais aqui — cerimônias, proclamações, o tipo de coisa que acontece quando um reino ainda funciona.

Agora o salão está vazio exceto pelo rei Terenas Menethil II sentado no trono — um homem velho, com a coroa ainda na cabeça e as mãos firmes nos apoios de pedra, como se a posição pudesse protegê-lo — e por Arthas, que caminha pela nave central com Frostmourne na mão e passos que não fazem barulho.

Você está aqui. De que lado, depende do caminho que escolheu.

Se você veio pelo caminho da luz: você entrou pelos fundos com o que restou dos paladinos, tentando chegar ao rei antes de Arthas. Não chegou.

Se você veio pelo caminho sombrio: você entrou pela porta principal ao lado de Arthas, de armadura, e o rei te viu antes de ver o filho.

Rei Terenas: "Arthas. Meu filho... o que aconteceu com você?"

Arthas: "((parando a três metros do trono)) Eu mesmo me perguntei isso, pai. Por um tempo. ((Frostmourne sobe)) Agora não me pergunto mais."

narrador: "A coroa de Lordaeron cai no chão de pedra com um som que vai durar na sua memória por muito tempo. O rei Terenas Menethil II, segundo desse nome, morre de joelhos com as mãos estendidas para o filho."

Arthas: "((pegando a coroa do chão, virando-se para você)) Agora é a minha vez de governar."',
  'lordaeron_throne.jpg',
  'arthas_combat.png'
),

-- Ato 4 · final_choice
(
  'final_choice',
  4,
  'O Destino do Jogador',
  'Arthas olha para você por um longo momento. A coroa de Lordaeron ainda está na mão dele, o sangue do rei Terenas ainda úmido em Frostmourne. O salão ao redor está em silêncio — um silêncio que só existe quando algo muito grande acabou e algo muito maior ainda não começou.

Ele fala como se soubesse exatamente o que você vai responder. Como se já tivesse ensaiado as duas versões desta conversa.

Arthas: "Tudo que aconteceu desde Brill chegou até aqui. Cada escolha — sua e minha — foi uma pedra num caminho que sempre terminava neste salão. ((pausa)) A questão agora é o que você faz com o que sabe. Fica? Ou vai?"',
  'lordaeron_throne.jpg',
  'arthas_combat.png'
),

-- Ato 4 · ending_light
(
  'ending_light',
  4,
  'Final A — A Chama Resiste',
  'Você não venceu. Ninguém venceu hoje. Lordaeron caiu — isso é um fato que vai durar nos livros de história por gerações. O rei está morto. Arthas usa uma coroa e uma espada que não deveriam existir. Os mortos-vivos controlam o norte.

Mas você está vivo. Você saiu do salão do trono de Lordaeron com vida — algo que só é possível porque Arthas deixou, por razões que você nunca vai entender completamente. Talvez seja a memória de Brill. Talvez seja algo de Uther que sobrou nele. Talvez seja o simples fato de que ele precisava que alguém sobrevivesse para contar.

Você encontra Jaina três dias depois, num acampamento ao sul do Rio Thondroril. Ela não faz perguntas sobre como você sobreviveu — só abre espaço ao lado da fogueira e te passa um copo de algo quente. Você fica sentado lá por um tempo longo, olhando para o norte.

As estrelas estão todas no lugar. Isso é mais do que parecia possível esta manhã.

Lordaeron caiu. Mas a Aliança ainda respira. E enquanto houver pessoas ao redor desta fogueira que sabem o que Arthas era antes de Frostmourne — o que ele poderia ter sido — há algo para defender. Não um trono. Não um rei. A memória do que um reino pode ser quando escolhe fazer a coisa certa, mesmo quando a coisa certa custa tudo.

Você escolheu bem. Mesmo quando doeu. Especialmente quando doeu.

Jaina: "((sem olhar da fogueira)) Uther dizia que a Luz não promete vitória. Só promete que vale a pena lutar. ((pausa)) Eu costumava achar isso pouco. Agora acho que é suficiente."',
  'alliance_camp_dawn.jpg',
  'player_paladin.png'
),

-- Ato 4 · ending_dark
(
  'ending_dark',
  4,
  'Final B — O Reino Cai',
  'Lordaeron à noite, sem luzes nas janelas, parece um lugar que nunca teve pessoas. As ruas que você percorreu desde Brill — o mercado, a prefeitura, a estrada para Andorhal — estão vazias de um jeito que o abandono não explica completamente. Não é que as pessoas foram embora. É que o lugar que elas habitavam foi consumido por outra coisa.

Arthas governa de um trono que ainda tem o sangue do rei anterior. Ele não mandou limpar — ou não pensou nisso, ou não se importou, ou ambos. Você fica ao lado direito dele durante a primeira noite, de armadura, olhando para um salão onde não há mais súditos. Só soldados e mortos que andam.

Ele te olha eventualmente. Há algo nos olhos dele que você reconhece como gratidão — uma versão fria e distante dela, como gratidão vista através de gelo.

Arthas: "Você esteve lá desde o começo. Em Brill. Em Stratholme. Em Northrend. ((pausa)) A maioria das pessoas não consegue ver além do que estão perdendo. Você viu o que estava sendo construído. Isso é raro."

narrador: "O que foi construído é uma pira. Lordaeron queima lentamente — não em chamas, mas em esquecimento. O que você ajudou a construir vai durar séculos, mas não vai ter o nome que você esperava. Vai ter o nome dele. Sempre vai ter o nome dele."

narrador: "Você sobreviveu. Você ganhou, se ganhar é a palavra certa para isso. Mas nos anos que virão, haverá uma pergunta que vai te acompanhar pela Lordaeron que não existe mais: (se eu tivesse ficado com Jaina naquele dia em Stratholme — o que teria sido diferente?)"

narrador: "Você vai aprender a parar de fazer essa pergunta. Demora. Mas aprende."',
  'lordaeron_ruins_night.jpg',
  'arthas_combat.png'
)

ON CONFLICT (slug) DO NOTHING;



-- =============================================================
-- CHOICES
-- Inseridas após as cenas para garantir que os scene_id existam.
-- Usamos SELECT + subquery para não hardcodar UUIDs.
--
-- sets_flag     → flag gravada no jogador ao escolher esta opção
-- requires_flag → flag necessária para esta opção aparecer (NULL = sempre visível)
-- =============================================================

INSERT INTO choices (scene_id, label, description, next_scene_slug, sets_flag, requires_flag)

-- Choices de: brill_arrival
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('brill_arrival',
   'Seguir a velha discretamente',
   'Você pede licença e sai pela lateral. A velha está te esperando na viela — ela parece aliviada.',
   'brill_barn',
   NULL,
   NULL),
  ('brill_arrival',
   'Ficar e ouvir o prefeito',
   'Você permanece ao lado de Arthas. Quando saem, a velha sumiu — mas alguém rabiscou "CELEIRO" na parede.',
   'brill_barn',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: brill_barn
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('brill_barn',
   'Avisar os outros aldeões agora',
   'Você explica o que a velha disse. Os aldeões ficam em silêncio — depois vários correm para chamar familiares.',
   'plague_confirmed',
   'warned_villagers',
   NULL),
  ('brill_barn',
   'Reportar ao prefeito primeiro',
   'Você vai direto ao salão da prefeitura. O prefeito ordena que o celeiro seja selado oficialmente.',
   'plague_confirmed',
   'enforced_quarantine',
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: plague_confirmed
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('plague_confirmed',
   'Investigar Kel''''Thuzad antes de seguir para Andorhal',
   'Você sugere que alguém vá ao último endereço conhecido do mago renegado. Jaina concorda e divide a missão com você.',
   'andorhal_quarantine',
   'investigated_kelthuzad',
   NULL),
  ('plague_confirmed',
   'Seguir direto para Andorhal com Arthas',
   'A prioridade é a cidade. Investigar o mago pode esperar — você vai com Arthas.',
   'andorhal_quarantine',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: andorhal_quarantine
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('andorhal_quarantine',
   '"Precisamos tentar salvar quem ainda pode ser salvo"',
   'Você apoia a abertura de corredores humanitários. Uther franze o cenho, mas não descarta.',
   'stratholme_gates',
   NULL,
   NULL),
  ('andorhal_quarantine',
   '"Uther está certo. Conter a praga é o que salva mais vidas"',
   'Você apoia a quarentena total. Sacrifício doloroso agora para evitar colapso depois.',
   'stratholme_gates',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: stratholme_gates
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('stratholme_gates',
   'Questionar Arthas publicamente antes de decidir',
   'Você faz a pergunta que ninguém quer fazer: "E se ainda há tempo? E se alguns ainda podem ser salvos?"',
   'stratholme_the_choice',
   'questioned_arthas',
   NULL),
  ('stratholme_gates',
   'Ficar em silêncio e esperar a decisão de Jaina',
   'Você não tem a resposta certa. Jaina parece calcular algo — você fica ao lado dela e espera.',
   'stratholme_the_choice',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: stratholme_the_choice
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('stratholme_the_choice',
   'Ir com Jaina — recusar a purga',
   'Você segue Jaina. Stratholme vai arder de qualquer jeito, mas você não vai ser a mão que acende a tocha.',
   'alliance_camp',
   'light_path',
   NULL),
  ('stratholme_the_choice',
   'Ficar com Arthas — executar a purga',
   'Você fica. Por lealdade, por convicção, ou porque abandonar agora parece traição. Você não sabe. Mas fica.',
   'northrend_departure',
   'dark_path',
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: alliance_camp
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('alliance_camp',
   'Seguir o plano de Jaina sem reservas',
   'Você apoia a evacuação. Cada civil salvo é uma vitória. Você ajuda a organizar os grupos de fuga.',
   'uther_falls',
   'jaina_trusted',
   NULL),
  ('alliance_camp',
   'Sugerir ir ao norte encontrar Arthas antes que seja tarde',
   'Você acredita que ainda há algo de Arthas para salvar. Jaina te olha longamente. Mas não te impede.',
   'uther_falls',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: uther_falls
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('uther_falls',
   'Lutar para chegar até Uther — tentar interpor-se',
   'Você avança pelos corredores derrubando mortos-vivos. Chega perto o suficiente para Uther te ver.',
   'lordaeron_last_stand',
   'uther_defended',
   NULL),
  ('uther_falls',
   'Proteger os soldados ao redor e recuar',
   'Você não consegue chegar a Uther — mortos demais. Você leva os soldados que consegue para longe.',
   'lordaeron_last_stand',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: lordaeron_last_stand
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('lordaeron_last_stand',
   'Aceitar a mão de Jaina e partir',
   'Você pega a mão de Jaina. O portal se abre. O corredor desaparece.',
   'throne_room',
   NULL,
   NULL),
  ('lordaeron_last_stand',
   'Ficar para cobrir a retirada dos últimos soldados',
   'Você fica para segurar o corredor por mais trinta segundos. É o suficiente para os últimos saírem.',
   'throne_room',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: northrend_departure
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('northrend_departure',
   'Ficar perto de Arthas enquanto os navios queimam',
   'Você se mantém ao lado dele. As chamas refletem no gelo do fjordo.',
   'frostmourne_cave',
   'northrend_survived',
   NULL),
  ('northrend_departure',
   'Ajudar os soldados desesperados a se acalmarem',
   'Você vai até os homens que estão prestes a amotinar. Presença ajuda mais do que palavras.',
   'frostmourne_cave',
   'northrend_survived',
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: frostmourne_cave
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('frostmourne_cave',
   'Recuar — não tocar a espada',
   'Você dá um passo para trás. O frio sobrenatural é um aviso. Você não toca.',
   'lordaeron_march',
   NULL,
   NULL),
  ('frostmourne_cave',
   'Tocar a espada — sentir o frio',
   'Você estende a mão. O gelo queima. Algo passa por você como corrente elétrica.',
   'lordaeron_march',
   'frostmourne_touched',
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: lordaeron_march
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('lordaeron_march',
   'Marchar com Arthas sem questionar',
   'Você segue. O caminho para casa vai pelo trono de Lordaeron.',
   'throne_room',
   NULL,
   NULL),
  ('lordaeron_march',
   'Buscar uma forma de se separar do exército',
   'Você observa, espera, procura uma janela. Alguém tem que avisar o rei.',
   'throne_room',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: throne_room
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('throne_room',
   'Tentar alertar o rei — interromper Arthas',
   'Você grita um aviso. O rei se levanta. Arthas vira para você.',
   'final_choice',
   NULL,
   NULL),
  ('throne_room',
   'Não se mover — testemunhar sem intervir',
   'Você está paralisado. Não de medo — de incompreensão. Isso não pode estar acontecendo.',
   'final_choice',
   NULL,
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
UNION ALL
-- Choices de: final_choice
SELECT s.id, label, description, next_scene_slug, sets_flag, requires_flag
FROM scenes s,
(VALUES
  ('final_choice',
   'Resistir — recusar servir à escuridão',
   'Você nega. Qualquer que seja o custo, você nega. Arthas vai ter que te matar se quiser sua lealdade.',
   'ending_light',
   'chose_resistance',
   NULL),
  ('final_choice',
   'Ajoelhar-se — escolher as trevas',
   'Você ajoelha. Talvez pela sobrevivência. Você vai ter que viver com isso.',
   'ending_dark',
   'chose_darkness',
   NULL)
) AS c(scene_slug, label, description, next_scene_slug, sets_flag, requires_flag)
WHERE s.slug = c.scene_slug
;
