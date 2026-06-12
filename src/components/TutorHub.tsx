/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion, AnimatePresence } from "motion/react";

interface TutorHubProps {
  stats: UserStats;
  awardXp: (amount: number) => void;
  awardCoins: (amount: number) => void;
  markAchievementUnlocked: (id: string) => void;
}

export const TutorHub: React.FC<TutorHubProps> = ({
  stats,
  awardXp,
  awardCoins,
  markAchievementUnlocked
}) => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: "Olá! Eu sou o Yuki, seu tutor virtual de programação. 🌟 Estou aqui para te ajudar a programar com analogias divertidas e explicações simples. \n\nO que gostaria de dominar hoje? Selecione uma das opções rápidas abaixo ou escreva sua dúvida!"
    }
  ]);

  const [inputVal, setInputVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const customShortcuts = [
    { label: "💡 Analogia de Flexbox", prompt: "Explique como funciona o CSS Flexbox e Justify-Content usando a analogia de organizar brinquedos em caixas para mim." },
    { label: "🧬 Esqueleto de Variável", prompt: "Crie um trecho prático simples de JavaScript de escopo let e const ilustrando como declarar de forma limpa." },
    { label: "🧩 Sugira Projeto Simples", prompt: "Sugira um mini-projeto interativo em Javascript de portfólio para iniciante que chame a atenção de recrutadores." }
  ];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg = { role: "user" as const, content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg];
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("Falha no servidor de IA do Yuki.");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", content: data.text }]);
      
      // Award casual reward
      awardXp(15);
      awardCoins(5);
      markAchievementUnlocked("ai_tutor");
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: `Desculpe! Ocorreu um pequeno erro de internet: "${err.message}". Verifique se configurou seu token secreto.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left assistant profile panel */}
        <div className="md:col-span-1 p-5 rounded-3xl border border-slate-850 bg-slate-900/40 glass flex flex-col items-center justify-between text-center gap-4 shadow-lg">
          <div className="space-y-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-650 flex items-center justify-center text-4xl select-none mx-auto shadow-lg shadow-purple-500/20 ai-glow">
                🦊
              </div>
              <span className="absolute bottom-0 right-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-100 text-base">Yuki</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-purple-400">Tutor Conectado</p>
              <p className="text-[11px] text-slate-405 mt-2 px-2 leading-relaxed">
                Adoro elucidar sintaxes de escopo, estruturas condicionais complexas e bugs ocultos com metáforas do cotidiano!
              </p>
            </div>
          </div>

          <div className="w-full text-left p-3.5 rounded-2xl bg-slate-950/40 border border-slate-850 text-[10px] space-y-1.5 font-mono">
            <span className="font-bold text-purple-405 block">DIVERSÕES DO YUKI:</span>
            <div className="text-slate-400">• Conversar dá +15 XP e +5 Moedas</div>
            <div className="text-slate-400">• Desbloqueia Insígnia Especial de IA</div>
          </div>
        </div>

        {/* Right chat logs system */}
        <div className="md:col-span-3 rounded-3xl border border-slate-850 bg-slate-900/40 glass flex flex-col min-h-[480px] overflow-hidden shadow-lg">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2">
              <DynamicIcon name="Sparkles" className="text-purple-400 animate-pulse" size={16} />
              <span className="text-xs font-bold font-mono tracking-wider text-slate-400">Canal de Dúvidas de Yuki</span>
            </div>
          </div>

          {/* Messages list log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[380px] scrollbar-thin dark:scrollbar-thumb-slate-900">
            {messages.map((m, idx) => {
              const isYuki = m.role === "model";
              return (
                <div
                  key={idx}
                  className={`flex ${isYuki ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm font-sans leading-relaxed whitespace-pre-wrap font-bold ${
                      isYuki
                        ? "bg-slate-955/60 bg-slate-950/60 border border-slate-850 text-slate-200"
                        : "bg-sky-500 text-white shadow-md shadow-sky-500/10"
                    }`}
                  >
                    {isYuki && (
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1 font-mono font-bold">
                        YUKI:
                      </span>
                    )}
                    {m.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-550 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-purple-450 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-purple-355 bg-purple-300 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick shortcuts action */}
          <div className="px-6 py-2 border-t border-slate-850/80 flex flex-wrap gap-2 overflow-x-auto select-none bg-slate-950/20">
            {customShortcuts.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sc.prompt)}
                className="px-2.5 py-1.5 rounded-xl border border-purple-500/15 hover:border-purple-400 bg-purple-500/5 text-[10px] font-black text-purple-400 font-mono transition-colors cursor-pointer"
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Typing input form area */}
          <div className="p-4 bg-slate-950/45 border-t border-slate-850 flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(inputVal);
              }}
              placeholder="Escreva uma dúvida técnica sobre variáveis, CSS grid, SQL..."
              className="flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs md:text-sm focus:outline-none focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              className="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/10 cursor-pointer"
              title="Enviar Mensagem"
            >
              <DynamicIcon name="ArrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
