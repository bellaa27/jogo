/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";

interface MonetizationPageProps {
  stats: UserStats;
  activatePremium: () => void;
}

export const MonetizationPage: React.FC<MonetizationPageProps> = ({
  stats,
  activatePremium
}) => {
  const features = [
    { title: "Tutor Yuki IA Ilimitado", desc: "Tire dúvidas teóricas, peça analogias, corrija e comente códigos indefinidamente.", available: true },
    { title: "Simulador de Entrevista de Emprego", desc: "Acesse o painel completo de triagem avançada com recrutamento por IA e notas instantâneas.", available: true },
    { title: "Gerador de Desafios Personalizados", desc: "Crie problemas e desafios práticos no nível de dificuldade de preferência sem gastar moedas.", available: true },
    { title: "Certificação Oficial de Conclusão", desc: "Gere certificados digitais autorizados para impulsionar seu portfólio no LinkedIn.", available: true },
    { title: "Desafios entre Usuários Livres", desc: "Dispute duelos na arena sem filas de emparelhamento diários.", available: true }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2 opacity-95">
      {/* 1. Header Banner */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl border border-amber-500/15 shadow-lg shadow-amber-500/5">
          👑
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-100">Eleve seus Estudos ao Nível Pleno</h2>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-bold">
          Gere códigos limpos, passe em entrevistas técnicas reais e domine algoritmos com IA avançada ilimitada no plano DevQuest Premium Pro.
        </p>
      </div>

      {/* 2. Parallel Price Plans layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Free Plan basic card */}
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass flex flex-col justify-between gap-6 opacity-75 shadow-lg">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block font-mono">Plano Básico</span>
              <h3 className="text-xl font-extrabold mt-1 text-slate-100">Explorador Grátis</h3>
            </div>
            
            <div className="text-2xl font-black text-slate-150 font-mono">
              R$ 0 <span className="text-xs font-normal text-slate-400 uppercase">/ sempre</span>
            </div>

            <div className="w-full h-px bg-slate-850" />

            <div className="space-y-2.5 font-bold text-slate-400">
              <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest font-mono">BENEFÍCIOS COBERTOS:</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-sky-450 text-sky-400">✓</span> Lições interativas de 3 a 10 minutos
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-sky-450 text-sky-400">✓</span> Visualizador de trilha e milestones
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-sky-450 text-sky-400">✓</span> Sistema de moedas, energia e ligas
              </div>
              <div className="flex items-center gap-2 text-xs text-rose-455 text-rose-400/80 line-through">
                <span>✕</span> Inteligência artificial e feedback comentados
              </div>
            </div>
          </div>

          <div className="text-xs text-center text-slate-450 font-mono font-bold">
            Plano ativo por padrão
          </div>
        </div>

        {/* Premium Plan Pro card with highlighted border */}
        <div className="p-6 rounded-3xl border-2 border-purple-500 bg-gradient-to-b from-purple-500/10 to-indigo-950/20 glass flex flex-col justify-between gap-6 shadow-xl shadow-purple-500/10 relative overflow-hidden ai-glow">
          {/* Tag marker */}
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] uppercase tracking-widest font-black px-4 py-1.5 rounded-bl-xl shadow-md">
            Recomendado
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block font-mono">Completo de IA</span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-1 text-slate-100">
                <span>DevQuest Premium Pro</span>
                <span className="text-amber-500">👑</span>
              </h3>
            </div>
            
            <div className="text-2xl font-black text-slate-100 font-mono flex items-baseline gap-1.5">
              <span>R$ 29,90</span>
              <span className="text-xs font-normal text-slate-400 uppercase">/ mensal</span>
            </div>

            <div className="w-full h-px bg-slate-850" />

            <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest font-mono">BENEFÍCIOS COBERTOS:</div>
              {features.map((feat, fidx) => (
                <div key={fidx} className="flex gap-2.5 items-start text-xs text-slate-300">
                  <span className="text-sky-450 text-sky-400 font-black shrink-0">✓</span>
                  <div>
                    <h5 className="font-extrabold leading-tight text-slate-200">{feat.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-bold">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {stats.isPremium ? (
              <div className="w-full py-3.5 bg-emerald-500/10 text-emerald-400 text-center font-black text-xs uppercase rounded-xl border border-emerald-500/20 shadow-md">
                ✓ Plano Pro Ativado! Obrigado!
              </div>
            ) : (
              <button
                onClick={activatePremium}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 hover:scale-[1.01] text-white text-center font-black text-xs uppercase rounded-xl transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
              >
                Ativar Plano Premium Pro Instantâneo
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
