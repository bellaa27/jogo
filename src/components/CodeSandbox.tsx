/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Lesson, UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion, AnimatePresence } from "motion/react";

interface CodeSandboxProps {
  activeChallenge: Lesson | null;
  trackId: string | null;
  stats: UserStats;
  onCompleteChallenge: (xpReward: number, coinsReward: number) => void;
  awardCoins: (amount: number) => void;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  activeChallenge,
  trackId,
  stats,
  onCompleteChallenge,
  awardCoins
}) => {
  // Current challenge code state
  const [code, setCode] = useState<string>("function main() {\n  return 'Aperte executar para testar seu código!';\n}");
  const [outputLog, setOutputLog] = useState<Array<{ text: string; type: "info" | "success" | "error" }>>([
    { text: "Console iniciado. Aguardando execução...", type: "info" }
  ]);
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  // AI custom challenge parameters
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [customTrack, setCustomTrack] = useState<string>("javascript");
  const [customDifficulty, setCustomDifficulty] = useState<"Iniciante" | "Intermediário" | "Avançado">("Iniciante");
  const [currentChallengeData, setCurrentChallengeData] = useState<{
    title: string;
    description: string;
    starterCode: string;
    testCases: Array<{ input: string; expected: string; description?: string }>;
    hint?: string;
  } | null>(null);

  // Review helper states
  const [isAiReviewing, setIsAiReviewing] = useState<boolean>(false);

  // Sync editor with active track challenge
  useEffect(() => {
    if (activeChallenge) {
      setCode(activeChallenge.codeStarter || "");
      setOutputLog([
        { text: `Desafio Carregado: ${activeChallenge.title}`, type: "info" },
        { text: "Pressione 'Validar Código' para realizar os testes de asserção.", type: "info" }
      ]);
      setCustomFeedback(null);
      setCurrentChallengeData(null);
    }
  }, [activeChallenge]);

  // Handle local code execution
  const executeCode = () => {
    setOutputLog((prev) => [...prev, { text: "Executando código no Sandbox...", type: "info" }]);
    try {
      // Evaluate function contents: We capture console.log or standard returns
      if (code.includes("alert(")) {
        setOutputLog((prev) => [...prev, { text: "Por favor, evite o uso de alert() no sandbox iframe.", type: "error" }]);
        return;
      }
      
      // Let's create an evaluation environment
      const cleanCode = code.replace(/console\.log/g, "logCapture");
      let logs: string[] = [];
      const logCapture = (...args: any[]) => {
        logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : a).join(" "));
      };

      const evalFn = new Function("logCapture", `
        try {
          ${cleanCode}
          // Encontra a primeira função declarada na string e executa como teste padrão se existir
          const match = "${cleanCode}".match(/function\\s+([a-zA-Z0-9_]+)/);
          if (match && match[1] && typeof eval(match[1]) === "function") {
             const result = eval(match[1])();
             if (result !== undefined) {
               logCapture("Retorno: " + result);
             }
          }
        } catch(e) {
          logCapture("ERRO: " + e.message);
        }
      `);

      evalFn(logCapture);
      
      if (logs.length > 0) {
        setOutputLog((prev) => [
          ...prev,
          ...logs.map(l => ({
            text: l,
            type: l.startsWith("ERRO:") ? "error" : "success" as any
          }))
        ]);
      } else {
        setOutputLog((prev) => [...prev, { text: "Sem saída de console.", type: "info" }]);
      }
    } catch (err: any) {
      setOutputLog((prev) => [...prev, { text: `Falha crítica de compilação: ${err.message}`, type: "error" }]);
    }
  };

  // Trigger test case validations
  const validateChallenge = () => {
    const isCustom = !!currentChallengeData;
    const title = isCustom ? currentChallengeData?.title : activeChallenge?.title;
    const testCases = isCustom ? currentChallengeData?.testCases : activeChallenge?.testCases;

    if (!title || !testCases) {
      setOutputLog((prev) => [...prev, { text: "Abra um Desafio primeiro ou gere um Desafio de IA!", type: "error" }]);
      return;
    }

    setOutputLog((prev) => [...prev, { text: "Iniciando bateria de validações...", type: "info" }]);

    try {
      let passedAll = true;
      const cleanCode = code;

      // Evaluation for testing basic JS functions
      // We run test case evaluations
      testCases.forEach((tc) => {
        let actual = "";
        try {
          // Verify code inclusions or simple executions
          if (tc.input.includes("contém")) {
            const requiredPart = tc.input.split("contém ")[1] || tc.expected;
            actual = cleanCode.toLowerCase().includes(requiredPart.toLowerCase()) ? "true" : "false";
          } else if (tc.input.includes("texto")) {
            actual = cleanCode.toLowerCase().includes(tc.expected.toLowerCase()) ? tc.expected : "";
          } else {
            // Function call test execution
            const callCode = `
              ${cleanCode}
              return ${tc.input};
            `;
            const tester = new Function(callCode);
            const res = tester();
            actual = res !== undefined ? String(res) : "";
          }
        } catch (e: any) {
          actual = "ERRO: " + e.message;
        }

        const passed = actual.trim() === tc.expected.trim() || actual.toLowerCase() === tc.expected.toLowerCase();
        if (passed) {
          setOutputLog((prev) => [...prev, { text: `✓ Teste Passed: Instrução (${tc.input}) retornou esperado [${tc.expected}]`, type: "success" }]);
        } else {
          passedAll = false;
          setOutputLog((prev) => [...prev, { text: `❌ Teste Failed: (${tc.input || tc.description}) esperado [${tc.expected}], mas obteve [${actual}]`, type: "error" }]);
        }
      });

      if (passedAll) {
        setOutputLog((prev) => [
          ...prev,
          { text: "🥳 Parabéns! Todos os testes passaram perfeitamente!", type: "success" }
        ]);
        onCompleteChallenge(150, 40);
        setCustomFeedback("Excelente! Desafio Validado com sucesso! +150 XP e +40 Moedas adicionados ao seu saldo.");
      } else {
        setOutputLog((prev) => [
          ...prev,
          { text: "Alguns testes falharam. Use o botão 'Ajuda da IA' para entender!", type: "error" }
        ]);
      }
    } catch (e: any) {
      setOutputLog((prev) => [...prev, { text: `Erro de asserção: ${e.message}`, type: "error" }]);
    }
  };

  // Web review call via server-side Gemini Proxy
  const handleAskAiReview = async () => {
    setIsAiReviewing(true);
    setCustomFeedback(null);
    try {
      const title = currentChallengeData ? currentChallengeData.title : (activeChallenge?.title || "Laboratório Livre");
      const desc = currentChallengeData ? currentChallengeData.description : (activeChallenge?.description || "Atividade livre para teste de lógica.");
      const language = currentChallengeData ? customTrack : "JavaScript";

      const res = await fetch("/api/review-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          exerciseTitle: title,
          exerciseDesc: desc,
          language
        })
      });

      if (!res.ok) {
        throw new Error("Erro na chamada de revisão da inteligência artificial.");
      }

      const data = await res.json();
      setCustomFeedback(data.feedback);
      setOutputLog((prev) => [...prev, { text: "Yuki analisou seu código com sucesso!", type: "success" }]);
    } catch (err: any) {
      setOutputLog((prev) => [...prev, { text: `Erro de IA: ${err.message}`, type: "error" }]);
    } finally {
      setIsAiReviewing(false);
    }
  };

  // Generate customized challenges via Gemini
  const handleGenerateCustomChallenge = async () => {
    if (stats.coins < 15 && !stats.isPremium) {
      alert("A geração de desafios de IA consome 15 Moedas. Ganhe mais resolvendo lições ou ative o Plano Premium para IA ilimitada!");
      return;
    }

    setIsAiGenerating(true);
    setCustomFeedback(null);
    try {
      const res = await fetch("/api/generate-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track: customTrack,
          difficulty: customDifficulty,
          language: customTrack === "html_css" ? "HTML" : customTrack
        })
      });

      if (!res.ok) {
        throw new Error("Falha no servidor de inteligência artificial.");
      }

      const data = await res.json();
      setCurrentChallengeData(data);
      setCode(data.starterCode || "");
      setOutputLog([
        { text: `Desafio IA Carregado: ${data.title}`, type: "info" },
        { text: "Use seu conhecimento. Quando terminar, valide seu código contra as asserções de IA.", type: "info" }
      ]);
      awardCoins(-15);
    } catch (err: any) {
      setOutputLog((prev) => [...prev, { text: `Não foi possível gerar: ${err.message}`, type: "error" }]);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleResetWorkspace = () => {
    setCode(activeChallenge ? (activeChallenge.codeStarter || "") : "function main() {\n  return 'Altere isso...';\n}");
    setOutputLog([{ text: "Workspace reiniciado.", type: "info" }]);
    setCustomFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      {/* 1. Header Option: Predefined Challenge vs AI Custom Challenge creator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active exercise instructions */}
        <div className="lg:col-span-2 p-5 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/25 flex items-center justify-center">
              <DynamicIcon name="Code2" size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black text-sky-400 tracking-wider uppercase font-mono">
                Editor de Código
              </span>
              <h3 className="font-extrabold text-lg text-slate-100">
                {currentChallengeData ? currentChallengeData.title : activeChallenge ? activeChallenge.title : "Laboratório Aberto de Testes"}
              </h3>
            </div>
          </div>

          <div className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-2">
            <p>
              {currentChallengeData ? currentChallengeData.description : activeChallenge ? activeChallenge.codeInstruction : "Escreva seus algoritmos em Javascript e verifique a saída diretamente no painel inferior."}
            </p>
          </div>

          {(activeChallenge?.testCases || currentChallengeData?.testCases) && (
            <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-850 text-xs font-mono">
              <span className="font-bold text-sky-400 tracking-wide uppercase text-[10px] block mb-1">
                Objetivos de Asserção:
              </span>
              <ul className="space-y-1 text-slate-400 font-bold">
                {(currentChallengeData?.testCases || activeChallenge?.testCases || []).map((tc, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>• {tc.input || (tc as any).description}</span>
                    <span className="text-sky-450 font-black">⇒ {tc.expected}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI custom challenge generator box */}
        <div className="p-5 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <DynamicIcon name="Sparkles" className="text-purple-400" size={16} />
            <h4 className="font-extrabold text-xs md:text-sm text-slate-100">Criador de Missão de IA</h4>
          </div>

          <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-bold">
            Gere um desafio prático de código aleatório, programado na linguagem e nível que desejar. Unidades de IA custam moedas ou são grátis para assinantes PRO.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-450 font-black tracking-wider uppercase font-mono block mb-1">Tecnologia</label>
              <select
                value={customTrack}
                onChange={(e) => setCustomTrack(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:border-purple-500 font-bold focus:outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html_css">HTML & CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-455 font-black tracking-wider uppercase font-mono block mb-1">Dificuldade</label>
              <select
                value={customDifficulty}
                onChange={(e) => setCustomDifficulty(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 focus:border-purple-500 font-bold focus:outline-none"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateCustomChallenge}
            disabled={isAiGenerating}
            className="w-full py-2.5 rounded-xl font-extrabold text-xs uppercase bg-purple-600 hover:bg-purple-550 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/10 cursor-pointer"
          >
            {isAiGenerating ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <DynamicIcon name="Sparkles" size={12} />
                <span>Gerar Desafio de IA {stats.isPremium ? "" : "(-15 🪙)"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Interactive IDE + Output panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-850 flex flex-col min-h-[420px] bg-slate-950 text-slate-100 font-mono shadow-xl">
          {/* Editor Header TAB */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" />
              main.js • Laboratório JavaScript
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleResetWorkspace}
                className="p-1 px-2.5 text-[10px] bg-slate-800 border border-slate-700/50 hover:bg-slate-750 text-slate-300 rounded-lg font-black transition-colors cursor-pointer"
                title="Limpar Editor"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Code Textarea Area */}
          <div className="flex-1 flex min-h-[300px]">
            {/* Simulated Line numbers */}
            <div className="w-12 bg-slate-900/60 text-right pr-3 select-none text-slate-650 text-xs py-4 space-y-[2px] font-bold border-r border-slate-900 font-mono">
              {Array.from({ length: 40 }).map((_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            {/* Editing Box */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent text-slate-200 text-xs p-4 focus:outline-none resize-none font-mono leading-relaxed"
              placeholder="// Escreva sua lógica aqui..."
              spellCheck="false"
            />
          </div>

          {/* Bottom Tools panel */}
          <div className="bg-slate-900/80 p-4 border-t border-slate-855 flex flex-wrap justify-between items-center gap-2.5">
            <div className="flex gap-2 font-mono">
              <button
                onClick={executeCode}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700/50 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <DynamicIcon name="Play" size={12} />
                <span>Executar código</span>
              </button>

              <button
                onClick={validateChallenge}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-sky-500 text-white hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-md shadow-sky-500/10 cursor-pointer"
              >
                <DynamicIcon name="CheckCircle2" size={12} />
                <span>Validar código</span>
              </button>
            </div>

            <button
              onClick={handleAskAiReview}
              disabled={isAiReviewing}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-purple-650 bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-purple-500/10 cursor-pointer"
            >
              {isAiReviewing ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <DynamicIcon name="Sparkles" size={12} />
                  <span>IA Corretor Yuki</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* IDE Terminal Console Log */}
        <div className="rounded-3xl border border-slate-850 bg-slate-900/40 glass flex flex-col min-h-[300px] overflow-hidden shadow-lg">
          <div className="bg-slate-950/40 px-4 py-3 border-b border-slate-850 select-none flex items-center justify-between">
            <span className="text-xs font-black font-mono tracking-wider uppercase text-slate-400">
              Terminal de Saída
            </span>
            <button
              onClick={() => setOutputLog([{ text: "Console reiniciado.", type: "info" }])}
              className="text-[10px] font-extrabold font-mono tracking-tight text-slate-455 hover:text-sky-400 cursor-pointer"
            >
              Limpar Logs
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-950 font-mono text-xs">
            {outputLog.map((log, idx) => (
              <div
                key={idx}
                className={`${
                  log.type === "success"
                    ? "text-emerald-400"
                    : log.type === "error"
                      ? "text-rose-455 text-rose-400"
                      : "text-slate-450 text-slate-400 font-bold"
                }`}
              >
                <span className="text-slate-600 select-none mr-2">&gt;</span>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Detailed Feedback Modal / Slider */}
      <AnimatePresence>
        {customFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl border border-purple-500/20 bg-purple-950/20 text-slate-200 mt-2 space-y-3 relative overflow-hidden shadow-xl ai-glow"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 text-purple-400">
              <DynamicIcon name="Sparkles" size={80} />
            </div>

            <div className="flex justify-between items-center mb-1">
              <h4 className="font-extrabold text-sm md:text-md uppercase tracking-wider text-purple-455 text-purple-400 flex items-center gap-1.5">
                <DynamicIcon name="Sparkles" size={16} />
                Parecer Técnico do Yuki IA
              </h4>
              <button
                onClick={() => setCustomFeedback(null)}
                className="text-xs text-slate-400 hover:text-slate-250 cursor-pointer font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans font-bold text-slate-300">
              {customFeedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
