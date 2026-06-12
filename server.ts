import express from "express";
import path from "path";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Lazy-initialize Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing in secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints

  // 1. Virtual Tutor / IA Chat
  app.post("/api/tutor", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "As mensagens do chat são obrigatórias." });
        return;
      }

      const client = getGeminiClient();

      // Transform history format expected by gemini chat or generate content
      const promptParts = [
        "Você é o Yuki, o mascote e tutor virtual do DevQuest, uma plataforma de aprendizado gamificado de programação.",
        "Seu perfil: Entusiasta, amigável, didático e paciente. Gosta de dar exemplos do cotidiano (como fazer café, organizar caixas) para ilustrar lógica de programação.",
        "Regras fundamentais:",
        "1. Sempre responda em PORTUGUÊS de forma calorosa e animadora.",
        "2. Formate códigos usando blocos com a respectiva linguagem (ex: nível de markdown ```javascript ... ```).",
        "3. Insira mensagens motivadoras e curtas no final.",
        "4. Mantenha as respostas curtas e legíveis (máximo 3 parágrafos antes dos exemplos de código).",
        "\nHistórico de conversas:",
        ...messages.map((m: any) => `${m.role === "user" ? "Usuário" : "Yuki (Você)"}: ${m.content}`),
        "\nYuki (Você):"
      ].join("\n");

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptParts,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Erro no /api/tutor:", error);
      res.status(500).json({ error: error.message || "Erro interno ao processar IA do Tutor." });
    }
  });

  // 2. Automate Code review and error explanation
  app.post("/api/review-code", async (req, res) => {
    try {
      const { code, exerciseTitle, exerciseDesc, language } = req.body;
      const client = getGeminiClient();

      const prompt = `Analise o código abaixo escrito em "${language}" para o exercício "${exerciseTitle}".
Descrição do Exercício: "${exerciseDesc}"

Código enviado pelo Aluno:
\`\`\`${language}
${code}
\`\`\`

Por favor, faça uma análise amigável sobre:
1. Se o código parece funcional e correto em relação ao exercício.
2. Identifique erros de sintaxe ou de lógica caso existam e explique como consertá-los.
3. Forneça 1 ou 2 sugestões de melhoria ou boas práticas (como nomenclatura, eficiência ou legibilidade).
4. Termine com uma frase motivadora inspiradora para continuar estudando.

Responda em excelente Português estruturado com tópicos amigáveis e curtos.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ feedback: response.text });
    } catch (error: any) {
      console.error("Erro no /api/review-code:", error);
      res.status(500).json({ error: error.message || "Falha ao analisar o código." });
    }
  });

  // 3. Simulated Tech Career Interview Handler
  app.post("/api/interview", async (req, res) => {
    try {
      const { career, question, answer, history } = req.body;
      const client = getGeminiClient();

      const prompt = `Você é um Entrevistador Técnico Sênior especializado na carreira de "${career}".
Você está avaliando a resposta de um aluno iniciante/intermediário para a seguinte pergunta técnica:

Pergunta: "${question}"
Resposta do aluno: "${answer}"

Histórico de entrevista anterior:
${history ? JSON.stringify(history) : "Primeira pergunta"}

Forneça os seguintes itens exatamente em formato JSON com esses campos:
1. "score": Uma nota numérica de 0 a 100 baseada na qualidade e precisão do conceito.
2. "feedback": Feedback amigável porém profissional explicando o que foi correto, o que faltou, e a resposta conceitual ideal de forma didática.
3. "nextQuestion": A próxima pergunta técnica apropriada para esta carreira, continuando a progressão da entrevista (com nível ligeiramente ajustado de acordo com o desempenho).

Importante: Responda apenas com o objeto JSON estruturado. Não coloque marcações de Markdown além do JSON.
Exemplo de formato de resposta:
{
  "score": 85,
  "feedback": "...",
  "nextQuestion": "..."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Erro no /api/interview:", error);
      res.status(500).json({ error: error.message || "Falha ao avaliar resposta do simulador." });
    }
  });

  // 4. Custom challenge generation based on current track and level
  app.post("/api/generate-challenge", async (req, res) => {
    try {
      const { track, difficulty, language } = req.body;
      const client = getGeminiClient();

      const prompt = `Gere um desafio prático de código personalizado para a trilha "${track}", com nível de dificuldade "${difficulty}" e linguagem de programação preferida "${language}".

Gere a resposta EXCLUSIVAMENTE em formato JSON com as seguintes chaves correspondentes:
{
  "title": "Título criativo e gamificado do desafio",
  "description": "Uma história rápida de contexto (temática de aventura ou ficção científica) e o objetivo claro do desafio de programação do aluno. Detalhe os inputs e outputs esperados.",
  "starterCode": "O código inicial estruturado em texto plano para o aluno preencher (ex: declaração de função vazia ou esqueleto básico)",
  "testCases": [
    { "input": "Exemplo de entrada ou descrição de teste 1", "expected": "Resultado de saída esperada ou validação rápida" },
    { "input": "Exemplo de entrada ou descrição de teste 2", "expected": "Resultado de saída esperada ou validação rápida" }
  ],
  "hint": "Uma dica rápida e inteligente baseada em lógica para ajudar o usuário."
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const resultText = response.text || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Erro no /api/generate-challenge:", error);
      res.status(500).json({ error: error.message || "Falha ao gerar desafio personalizado." });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevQuest Backend] Running on port http://localhost:${PORT}`);
  });
}

startServer();
