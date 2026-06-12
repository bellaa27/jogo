/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "teoria" | "quiz" | "codigo";
  duration: string; // e.g. "3-5 min"
  xpReward: number;
  completed: boolean;
  // Optional for theory / visuals
  theoryContent?: string;
  analogy?: string;
  // Optional for quizzes
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
  // Optional for code
  codeStarter?: string;
  codeInstruction?: string;
  testCases?: Array<{ input: string; expected: string; description: string }>;
  // visual graphic or helper
  visualType?: "flexbox" | "variable" | "loop" | "array" | "query" | "class";
}

export interface StudyTrack {
  id: string;
  title: string;
  description: string;
  iconName: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  lessons: Lesson[];
  color: string;
  accentColor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpReward: number;
}

export interface CareerMilestone {
  id: string;
  title: string;
  description: string;
  status: "unlocked" | "current" | "locked";
  requiredLessons: string[];
}

export interface CareerRoadmap {
  id: string;
  title: string;
  role: string;
  description: string;
  difficulty: string;
  milestones: CareerMilestone[];
}

export interface RankingUser {
  name: string;
  avatar: string;
  xpThisWeek: number;
  level: number;
  isCurrentUser?: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  desc: string;
  membersCount: number;
  category: string;
  joined: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  isPremium: boolean;
}

// Predefined learning content representing the requested study tracks
export const INITIAL_TRACKS: StudyTrack[] = [
  {
    id: "html_css",
    title: "HTML & CSS",
    description: "Crie a estrutura e o design visual de páginas web modernas de forma responsiva.",
    iconName: "Layout",
    difficulty: "Iniciante",
    color: "from-orange-500 to-red-600",
    accentColor: "text-orange-500",
    lessons: [
      {
        id: "html_1",
        title: "Estrutura Básica do HTML",
        description: "Aprenda sobre tags, o elemento root, body e cabeçalhos em documentos HTML.",
        type: "teoria",
        duration: "30-50 min",
        xpReward: 100,
        completed: false,
        theoryContent: "HTML (HyperText Markup Language) organiza o esqueleto da web. Tags envolvem o conteúdo para dizer ao navegador como renderizá-lo: ex: <h1> para títulos e <p> para parágrafos ordinários.",
        analogy: "Pense no HTML como os ossos e vigas de uma casa. Ela define onde ficam as paredes e portas, mas ainda sem acabamento ou pintura.",
        visualType: "variable"
      },
      {
        id: "html_2",
        title: "Tags de Organização",
        description: "Teste seus conhecimentos sobre as tags básicas.",
        type: "quiz",
        duration: "4 min",
        xpReward: 120,
        completed: false,
        quizQuestion: "Qual tag HTML é utilizada para criar uma quebra de linha de forma autogerida?",
        quizOptions: ["<lb>", "<break>", "<br>", "<line>"],
        quizCorrectIndex: 2
      },
      {
        id: "html_3",
        title: "Desafio: Título Principal",
        description: "Escreva um cabeçalho completo para validar a estrutura.",
        type: "codigo",
        duration: "8 min",
        xpReward: 150,
        completed: false,
        codeStarter: "<!-- Escreva um h1 dizendo 'Olá, Mundo!' abaixo -->\n",
        codeInstruction: "Insira uma tag <h1> com o exato texto 'Olá, Mundo!' e feche a tag de forma apropriada.",
        testCases: [
          { input: "contém h1", expected: "true", description: "Verifica se escreveu a tag h1 corretamente" },
          { input: "texto correto", expected: "Olá, Mundo!", description: "Verifica se o conteúdo é idêntico" }
        ],
        visualType: "flexbox"
      }
    ]
  },
  {
    id: "javascript",
    title: "JavaScript Avançado",
    description: "Domine programação assíncrona, escopos, fechamentos, APIs e automações robustas.",
    iconName: "FileCode",
    difficulty: "Iniciante",
    color: "from-yellow-400 to-amber-500",
    accentColor: "text-yellow-500",
    lessons: [
      {
        id: "js_1",
        title: "Variáveis & Tipagem Dinâmica",
        description: "Descubra como o motor do JS armazena variáveis usando let, const e var.",
        type: "teoria",
        duration: "5 min",
        xpReward: 100,
        completed: false,
        theoryContent: "JavaScript possui tipagem dinâmica: você não declara o tipo da variável de antemão. Use const para valores imutáveis e let para valores mutáveis.",
        analogy: "Variáveis são etiquetas em gavetas na memória virtual. Uma gaveta etiquetada 'idade' guarda números."
      },
      {
        id: "js_2",
        title: "Diferença entre let e const",
        description: "Teste sobre imutabilidade e boas práticas de ES6.",
        type: "quiz",
        duration: "3-5 min",
        xpReward: 110,
        completed: false,
        quizQuestion: "O que ocorre ao tentar reatribuir um valor novo a uma variável declarada com 'const'?",
        quizOptions: [
          "O valor é reatribuído normalmente sem avisos.",
          "O navegador reinicia a página.",
          "Um erro em tempo de execução (TypeError) é disparado.",
          "O JS ignora silenciosamente a mudança."
        ],
        quizCorrectIndex: 2
      },
      {
        id: "js_3",
        title: "Desafio: Calculadora de Dobro",
        description: "Crie uma função para retornar o dobro de um número fornecido.",
        type: "codigo",
        duration: "6 min",
        xpReward: 200,
        completed: false,
        codeStarter: "function calcularDobro(numero) {\n  // Escreva sua lógica aqui\n  \n}",
        codeInstruction: "Implemente um retorno que multiplique o 'numero' de entrada por 2.",
        testCases: [
          { input: "calcularDobro(4)", expected: "8", description: "Verifica o dobro de 4" },
          { input: "calcularDobro(12)", expected: "24", description: "Verifica o dobro de 12" }
        ],
        visualType: "loop"
      }
    ]
  },
  {
    id: "python",
    title: "Python e Automação",
    description: "Crie automações, scripts, manipulação de arquivos e lógicas avançadas de dados.",
    iconName: "Terminal",
    difficulty: "Iniciante",
    color: "from-blue-500 to-indigo-600",
    accentColor: "text-blue-500",
    lessons: [
      {
        id: "py_1",
        title: "Indentação e Estruturas condicionais",
        description: "Aprenda a sintaxe única do Python onde espaços em branco controlam blocos.",
        type: "teoria",
        duration: "5 min",
        xpReward: 100,
        completed: false,
        theoryContent: "Diferente de outras linguagens como JS ou C#, Python não usa chaves {}. A indentação usando espaços define onde blocos de funções e if/else iniciam e acabam.",
        analogy: "A indentação é como listas de tópicos recuados em um caderno de anotações. O que está recuado faz parte daquele grupo principal."
      },
      {
        id: "py_2",
        title: "Sintaxe do If-Else",
        description: "Selecione o exemplo de sintaxe correta.",
        type: "quiz",
        duration: "3-5 min",
        xpReward: 100,
        completed: false,
        quizQuestion: "Como escrevemos a condicional 'senão se' em Python?",
        quizOptions: ["else if", "elseif", "elif", "selse"],
        quizCorrectIndex: 2
      },
      {
        id: "py_3",
        title: "Desafio: FizzBuzz Simplificado",
        description: "Implemente uma decisão lógica para filtrar múltiplos.",
        type: "codigo",
        duration: "8 min",
        xpReward: 180,
        completed: false,
        codeStarter: "def checar_par(numero):\n    # Escreva sua resposta\n    pass",
        codeInstruction: "Complete a função 'checar_par' para retornar True se o número for par e False caso contrário.",
        testCases: [
          { input: "checar_par(6)", expected: "true", description: "Verifica se 6 é par" },
          { input: "checar_par(9)", expected: "false", description: "Verifica se 9 não é par" }
        ],
        visualType: "variable"
      }
    ]
  },
  {
    id: "sql",
    title: "Projetos em SQL",
    description: "Crie tabelas de forma relacional, execute SELECT com JOIN e modele bancos profissionais.",
    iconName: "Database",
    difficulty: "Intermediário",
    color: "from-cyan-500 to-sky-600",
    accentColor: "text-cyan-500",
    lessons: [
      {
        id: "sql_1",
        title: "Entidades e Tabelas de Dados",
        description: "A fundação teórica das tabelas SQL, colunas e linhas.",
        type: "teoria",
        duration: "4 min",
        xpReward: 100,
        completed: false,
        theoryContent: "No SQL, os dados estão dispostos em tabelas rígidas compostas por colunas (atributos) e linhas (registros). Cada linha é um elemento único estruturado.",
        analogy: "SQL funciona como planilhas de Excel conectadas que exigem que cada coluna preencha rigidamente o tipo de dado esperado (ex: somente números na coluna Preço)."
      },
      {
        id: "sql_2",
        title: "Ordenação de Resultados",
        description: "Estude o ORDER BY.",
        type: "quiz",
        duration: "3 min",
        xpReward: 100,
        completed: false,
        quizQuestion: "Qual comando SQL ordena os resultados selecionados em ordem decrescente?",
        quizOptions: ["SORT BY DESC", "ORDER BY DESC", "ARRANGE DOWN", "LIMIT DOWN"],
        quizCorrectIndex: 1
      },
      {
        id: "sql_3",
        title: "Desafio: SELECT Clássico",
        description: "Escreva uma consulta básica no simulador.",
        type: "codigo",
        duration: "7 min",
        xpReward: 150,
        completed: false,
        codeStarter: "-- Escreva a instrução SQL para selecionar tudo da tabela 'usuarios'\n",
        codeInstruction: "Escreva a declaração em letras maiúsculas: 'SELECT * FROM usuarios;'",
        testCases: [
          { input: "contem select", expected: "true", description: "Verifica se utilizou a palavra chave SELECT" },
          { input: "consulta completa", expected: "SELECT * FROM usuarios;", description: "Verifica o código da consulta completo" }
        ],
        visualType: "query"
      }
    ]
  },
  {
    id: "web_dev",
    title: "Desenvolvimento Web Fullstack",
    description: "Conecte frontends, backends, APIs REST e construa aplicações completas.",
    iconName: "Globe",
    difficulty: "Intermediário",
    color: "from-purple-500 to-pink-600",
    accentColor: "text-purple-500",
    lessons: [
      {
        id: "web_1",
        title: "Modelo de Requisição REST",
        description: "Como o Frontend conversa com o Backend usando verbos HTTP como GET, POST, PUT e DELETE.",
        type: "teoria",
        duration: "5 min",
        xpReward: 120,
        completed: false,
        theoryContent: "A arquitetura cliente-servidor se baseia em protocolos de comunicação claros. O cliente envia um GET para ler informações ou um POST para criar dados no servidor backend.",
        analogy: "O modelo é idêntico a fazer pedidos em um restaurante. O cliente é o Frontend, o atendente faz a requisição, e a cozinha é o servidor que processa seu prato."
      },
      {
        id: "web_2",
        title: "Verbos HTTP",
        description: "Perguntas e respostas sobre REST.",
        type: "quiz",
        duration: "3-5 min",
        xpReward: 110,
        completed: false,
        quizQuestion: "Qual verbo HTTP é semanticamente o mais adequado para realizar atualizações parciais em um recurso?",
        quizOptions: ["GET", "PATCH", "POST", "DELETE"],
        quizCorrectIndex: 1
      }
    ]
  },
  {
    id: "java",
    title: "Fundamentos do Java",
    description: "Domine Orientação a Objetos profissional, classes, métodos e tratamento de exceções robusto.",
    iconName: "Codepen",
    difficulty: "Intermediário",
    color: "from-red-500 to-amber-700",
    accentColor: "text-red-500",
    lessons: [
      {
        id: "java_1",
        title: "Princípio de Orientação a Objetos",
        description: "Esqueleto teórico de classes, métodos e atribuição de propriedades.",
        type: "teoria",
        duration: "6 min",
        xpReward: 120,
        completed: false,
        theoryContent: "Java é uma linguagem estritamente tipada centrada em Orientação a Objetos (POO). Nele, tudo começa em uma Class e seus métodos instanciados no motor virtual.",
        analogy: "Uma Classe funciona como o projeto original de engenharia de um carro. Os carros criados a partir dela na concessionária real são os Objetos reais."
      }
    ]
  },
  {
    id: "datastruct",
    title: "Estruturas de Dados",
    description: "Projete algoritmos otimizados usando arrays, pilhas, filas, árvores e busca binária.",
    iconName: "Network",
    difficulty: "Avançado",
    color: "from-emerald-500 to-teal-700",
    accentColor: "text-emerald-500",
    lessons: [
      {
        id: "ds_1",
        title: "A Complexidade O(1) vs O(n)",
        description: "Sinta a diferença matemática de processar algoritmos pesados.",
        type: "teoria",
        duration: "6-8 min",
        xpReward: 150,
        completed: false,
        theoryContent: "A notação Big O mede o tempo de execução de um algoritmo de forma abstrata conforme o tamanho da entrada cresce. O(1) representa velocidade instantânea constante.",
        analogy: "Achar uma página no livro abrindo ele baseado no número (índice direto: O(1)) versus olhar folha por folha desde o início (O(n))."
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    title: "Primeiros Passos",
    description: "Complete sua primeira lição teórica ou prática na plataforma.",
    icon: "Compass",
    unlocked: false,
    xpReward: 150
  },
  {
    id: "streak_3",
    title: "Foco Implacável",
    description: "Mantenha uma sequência diária (streak) de 3 dias ativos estudando.",
    icon: "Flame",
    unlocked: false,
    xpReward: 250
  },
  {
    id: "code_master",
    title: "Mestre da Sintaxe",
    description: "Resolva 5 exercícios práticos de código com sucesso e sem erros.",
    icon: "Cpu",
    unlocked: false,
    xpReward: 400
  },
  {
    id: "ai_tutor",
    title: "Conversa com Yuki",
    description: "Tire uma dúvida ou peça uma recomendação ao nosso tutor de IA.",
    icon: "Sparkles",
    unlocked: false,
    xpReward: 100
  },
  {
    id: "interview_star",
    title: "Aprovado no Screen",
    description: "Complete uma rodada de simulação de entrevista com avaliação acima de 80.",
    icon: "Award",
    unlocked: false,
    xpReward: 500
  }
];

export const CAREER_ROADMAPS: CareerRoadmap[] = [
  {
    id: "front_dev",
    title: "Frontend Developer Pro",
    role: "Desenvolvedor Frontend",
    description: "Domine a arte de construir experiências visuais fluidas, responsivas e de grande performance.",
    difficulty: "Iniciante até Pleno",
    milestones: [
      {
        id: "m_html",
        title: "Fundações da Web",
        description: "Entender Tags Semânticas HTML e construção estrutural indexada.",
        status: "current",
        requiredLessons: ["html_1", "html_2"]
      },
      {
        id: "m_css_flexbox",
        title: "Estilização & Flexbox",
        description: "Estilizar do zero, criar layouts flexíveis modernos e grades bento responsivas.",
        status: "locked",
        requiredLessons: ["html_3"]
      },
      {
        id: "m_js_control",
        title: "Programação e DOM em JS",
        description: "Manipular eventos do navegador em tempo real com lógica pura.",
        status: "locked",
        requiredLessons: ["js_1", "js_2"]
      },
      {
        id: "m_async",
        title: "APIs e Assincronismo",
        description: "Consumir endpoints dinâmicos usando fetch/async-await sem travar a interface.",
        status: "locked",
        requiredLessons: ["js_3"]
      }
    ]
  },
  {
    id: "data_sci",
    title: "AI & Cientista de Dados",
    role: "Engenheiro de IA",
    description: "Aprenda a analisar grandes massas de informações utilizando Python, SQL e modelos generativos.",
    difficulty: "Intermediário até Avançado",
    milestones: [
      {
        id: "m_py_basics",
        title: "Algoritmos e Python",
        description: "Entender estruturas de repetição, lógica e manipulação inicial.",
        status: "current",
        requiredLessons: ["py_1", "py_2"]
      },
      {
        id: "m_sql_rel",
        title: "Estruturas SQL Relacionais",
        description: "Consultar bases corporativas agregadas e fazer agrupamentos lógicos complexos.",
        status: "locked",
        requiredLessons: ["sql_1", "sql_2"]
      },
      {
        id: "m_ai_gen",
        title: "Integrando LLMs nas Aplicações",
        description: "Chamar APIs inteligentes e estruturar prompts otimizados para pipelines.",
        status: "locked",
        requiredLessons: []
      }
    ]
  }
];

export const WEEKLY_RANKING: RankingUser[] = [
  { name: "Gabriel S.", avatar: "👨‍💻", xpThisWeek: 2150, level: 12 },
  { name: "Vitória Lima", avatar: "👩‍🚀", xpThisWeek: 1850, level: 9 },
  { name: "Carlos Alberto", avatar: "🤖", xpThisWeek: 1400, level: 14 },
  { name: "Aline Santos", avatar: "🎨", xpThisWeek: 1290, level: 8 },
  { name: "Você", avatar: "🧙‍♀️", xpThisWeek: 450, level: 3, isCurrentUser: true },
  { name: "Murilo Tech", avatar: "🐱", xpThisWeek: 350, level: 5 },
  { name: "Letícia Dev", avatar: "🦄", xpThisWeek: 120, level: 4 }
];

export const MOCK_GROUPS: StudyGroup[] = [
  { id: "g_py", name: "Pythonistas de Elite", desc: "Grupo focado em resolver algoritmos semanais no LeetCode usando Python.", membersCount: 142, category: "Python", joined: false },
  { id: "g_react", name: "Domadores do React", desc: "Aprenda React 19, Server Components, Tailwind e gerência global de estados.", membersCount: 210, category: "Web Dev", joined: true },
  { id: "g_ai", name: "Prompt Engineers Hub", desc: "Discussões sobre agentes cognitivos, Gemini API e integrações fullstack de IA.", membersCount: 88, category: "Inteligência Artificial", joined: false }
];
