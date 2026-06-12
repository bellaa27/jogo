/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion, AnimatePresence } from "motion/react";

interface InterviewSimProps {
  stats: UserStats;
  unlockAchievementInParent: (id: string) => void;
  awardXp: (amount: number) => void;
}

export const InterviewSim: React.FC<InterviewSimProps> = ({
  stats,
  unlockAchievementInParent,
  awardXp
}) => {
  const careers = [
    {
      id: "frontend",
      title: "Recrutamento Frontend Pro",
      desc: "Perguntas de JavaScript assíncrono, CSS layouts, renderizadores SPA, React hooks e cookies corporativos.",
      firstQuestion: "Qual é a diferença funcional entre os métodos 'map' e 'forEach' em JavaScript, e qual deles você usaria para projetar transformações imutáveis no React?"
    },
    {
      id: "backend",
      title: "Arquiteto Backend Node.js/Java",
      desc: "Foco total em microsserviços, REST API vs GraphQL, modelagem SQL, balanceamento de carga, concorrência e processos assíncronos.",
      firstQuestion: "No Node.js, como você manipula chamadas intensivas de I/O em banco de dados sem sobrecarregar a Thread principal do Event Loop? Explique o conceito de pool de conexões."
    },
    {
      id: "ai_eng",
      title: "Engenheiro de IA & LLMs",
      desc: "Avalie engenharia de prompts, chamada de ferramentas, busca de similaridades, Embeddings, IA generativa e pipelines analíticos.",
      firstQuestion: "O que é 'Hallucination' (Alucinação) em Modelos de Linguagem de Grande Porte e quais estratégias arquiteturais você aplicaria na sua API para minimizar essa falha?"
    }
  ];

  const [activeCareer, setActiveCareer] = useState<typeof careers[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Stats accumulated
  const [scoreList, setScoreList] = useState<number[]>([]);
  const [historyLogs, setHistoryLogs] = useState<Array<{ q: string; a: string; score: number; text: string }>>([]);

  const startInterview = (career: typeof careers[0]) => {
    if (!stats.isPremium) {
      alert("O Simulador de Entrevistas de IA avançado faz parte do Plano Premium! Cadastre-se na aba Premium ou ative o Plano na barra de ações.");
      return;
    }
    setActiveCareer(career);
    setCurrentQuestion(career.firstQuestion);
    setUserAnswer("");
    setStep(1);
    setScoreList([]);
    setHistoryLogs([]);
    setIsPlaying(true);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Escreva uma resposta explicativa para passar pelo crivo do entrevistador!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        career: activeCareer?.title,
        question: currentQuestion,
        answer: userAnswer,
        history: historyLogs.map(h => ({ q: h.q, a: h.a }))
      };

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Erro de conexão com o painel de aprovações da IA.");
      }

      const data = await res.json();
      
      const newScore = data.score || 0;
      const evaluationText = data.feedback || "Resposta processada.";
      const nextQ = data.nextQuestion || "Fim da sabatina.";

      setScoreList((prev) => [...prev, newScore]);
      setHistoryLogs((prev) => [
        ...prev,
        {
          q: currentQuestion,
          a: userAnswer,
          score: newScore,
          text: evaluationText
        }
      ]);

      if (step >= 3) {
        // Evaluate completion
        const avg = Math.round((scoreList.reduce((a, b) => a + b, 0) + newScore) / 3);
        awardXp(avg * 2);
        if (avg >= 80) {
          unlockAchievementInParent("interview_star");
        }
        setStep(4); // Display summary screen
      } else {
        setCurrentQuestion(nextQ);
        setUserAnswer("");
        setStep((s) => s + 1);
      }
    } catch (e: any) {
      alert("Erro ao avaliar: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishEarly = () => {
    setIsPlaying(false);
    setActiveCareer(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 opacity-95">
      {/* 1. If NOT playing, display selection guide */}
      {!isPlaying ? (
        <div className="space-y-6">
          <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-500/25 glass text-white overflow-hidden shadow-xl shadow-sky-500/5">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-sky-400">
              <DynamicIcon name="Award" size={150} />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 backdrop-blur-md border border-sky-500/25 text-[10px] font-black tracking-widest uppercase text-sky-400">
                EXCLUSIVO PREMIUM
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-100">Simulador de Entrevista de Emprego 🚀</h2>
              <p className="max-w-xl text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                A melhor maneira de perder o medo das entrevistas de código. Teste conceitos avançados do mercado real, receba feedback com nota imediata e seja corrigido pela nossa IA.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careers.map((career) => (
              <div
                key={career.id}
                className="p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass flex flex-col justify-between gap-5 transition-all hover:border-sky-500/30 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                    <DynamicIcon name="Award" size={20} />
                  </div>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-100">{career.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-bold">{career.desc}</p>
                </div>

                <button
                  onClick={() => startInterview(career)}
                  className="w-full py-2.5 rounded-xl font-extrabold text-xs uppercase bg-sky-500 hover:bg-sky-450 hover:scale-[1.01] text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/10 cursor-pointer animate-none"
                >
                  <DynamicIcon name="Play" size={12} />
                  <span>Iniciar Simulação</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. Interactive dialogue panel */
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-6">
          {/* Header step tracking */}
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <div>
              <span className="text-[10px] font-black tracking-widest text-sky-400 uppercase font-mono block">
                {activeCareer?.title}
              </span>
              <h3 className="font-extrabold text-lg mt-0.5 text-slate-100">Sabatina Técnica de Emprego</h3>
            </div>
            <div className="text-right font-mono">
              {step <= 3 ? (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-455 text-sky-400 border border-sky-500/15">
                  Questão {step} de 3
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-455">
                  Finalizado!
                </span>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait font-sans">
            {step <= 3 ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Board question */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-2">
                  <span className="text-[9px] font-black tracking-widest uppercase text-sky-400 font-mono block">
                    Pergunta do Recrutador IA:
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-slate-200 leading-relaxed">
                    {currentQuestion}
                  </p>
                </div>

                {/* Answer area */}
                <div className="space-y-1">
                  <label className="text-[10px] text-sky-400 uppercase tracking-widest font-black block mb-1 font-mono">
                    Sua explicação técnica para o examinador:
                  </label>
                  <textarea
                    value={userAnswer}
                    disabled={isSubmitting}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={5}
                    placeholder="Dica: Formule termos como buffers, render path, classes, hooks para aumentar sua pontuação técnica!"
                    className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-850 text-slate-100 focus:outline-none focus:border-sky-500 text-xs md:text-sm font-sans leading-relaxed"
                  />
                </div>

                {/* Submit action */}
                <div className="flex gap-3">
                  <button
                    disabled={isSubmitting}
                    onClick={submitAnswer}
                    className="px-6 py-3 rounded-xl font-extrabold text-xs uppercase bg-sky-500 hover:bg-sky-450 text-white flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span>Avaliando...</span>
                      </>
                    ) : (
                      <>
                        <DynamicIcon name="Sparkles" size={12} />
                        <span>Enviar resposta para avaliação</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={handleFinishEarly}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase bg-slate-800 border border-slate-700/50 hover:bg-slate-755 text-slate-300 transition-colors cursor-pointer"
                  >
                    Encerrar
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Summary performance view screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center py-6 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black border border-emerald-500/20 shadow-md">
                    🎉
                  </div>
                  <h4 className="font-extrabold text-xl text-slate-100">Sabatinado Concluído com Sucesso!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-bold">
                    Sua pontuação final combinada foi gerada pelos servidores do DevQuest IA.
                  </p>
                </div>

                {/* Score badge indicator */}
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850 max-w-md mx-auto flex items-center justify-around text-center shadow-lg">
                  <div>
                    <span className="text-[10px] text-slate-450 block font-black uppercase tracking-wider font-mono">Média Geral</span>
                    <span className="text-3xl font-black text-emerald-400">
                      {Math.round(scoreList.reduce((a, b) => a + b, 0) / 3)} / 100
                    </span>
                  </div>
                  <div className="w-px h-10 bg-slate-850" />
                  <div>
                    <span className="text-[10px] text-slate-450 block font-black uppercase tracking-wider font-mono">Status do Screen</span>
                    <span className={`text-xs font-black ${
                      Math.round(scoreList.reduce((a, b) => a + b, 0) / 3) >= 75 ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {Math.round(scoreList.reduce((a, b) => a + b, 0) / 3) >= 75 ? "APROVADO NO SIZING!" : "RECOMENDADO REVISÃO"}
                    </span>
                  </div>
                </div>

                {/* Historical answers drilldown breakdown */}
                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-450 font-mono">
                    Detalhamento conceito a conceito:
                  </h4>

                  {historyLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-850 bg-slate-950/40 space-y-3 shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-sky-400 font-mono uppercase tracking-wider">Pergunta {idx + 1}</span>
                        <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Nota: {log.score}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic font-bold">&quot;{log.q}&quot;</p>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/60 text-xs text-slate-300 leading-relaxed font-sans font-bold">
                        {log.text}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleFinishEarly}
                  className="w-full py-3 rounded-xl font-extrabold text-xs uppercase bg-slate-800 border border-slate-700/50 hover:bg-slate-750 text-slate-200 transition-colors cursor-pointer"
                >
                  Voltar para Área de Recrutamento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
