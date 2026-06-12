/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserStats, Achievement } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  stats: UserStats;
  achievements: Achievement[];
  redeemReward: (achievementId: string, xpReward: number) => void;
  recoverEnergy: (costCoins: number, value: number) => void;
  setActiveTab: (tab: string) => void;
  quizStreakBonus: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  achievements,
  redeemReward,
  recoverEnergy,
  setActiveTab,
  quizStreakBonus
}) => {
  const [energyStatus, setEnergyStatus] = useState<string | null>(null);

  const activeQuests = [
    { id: "q1", title: "Primeiros Termos da Sintaxe", desc: "Faça qualquer lição prática em uma trilha ativa", xp: 50, done: stats.xp > 0 },
    { id: "q2", title: "Mente Sã", desc: "Converse com o tutor de IA Yuki no chat do jogo", xp: 50, done: achievements.find(a => a.id === "ai_tutor")?.unlocked || false },
    { id: "q3", title: "Super Duelo Técnico", desc: "Entre na sala social do ranking e dispute na velocidade", xp: 100, done: false }
  ];

  const handleCoffeeRest = () => {
    if (stats.energy >= stats.maxEnergy) {
      setEnergyStatus("Sua energia já está no nível máximo! Vá codar!");
      setTimeout(() => setEnergyStatus(null), 3000);
      return;
    }
    if (stats.coins < 25) {
      // Free rest option or cost option
      recoverEnergy(0, 1);
      setEnergyStatus("Você descansou 5 minutos de tela e recuperou +1 ⚡ grátis!");
      setTimeout(() => setEnergyStatus(null), 3500);
    } else {
      recoverEnergy(25, 3);
      setEnergyStatus("Hummm! Você tomou um café expresso duplo! Recuperou +3 ⚡ por 25 moedas!");
      setTimeout(() => setEnergyStatus(null), 4000);
    }
  };

  const handleClaimChest = () => {
    quizStreakBonus();
    setEnergyStatus("🎁 Baú diário coletado! Você ganhou +50 Moedas e +20 XP de presença!");
    setTimeout(() => setEnergyStatus(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-2 opacity-95">
      {/* Header Banner Section */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 text-white overflow-hidden shadow-xl shadow-slate-950/40 border border-slate-800">
        <div className="absolute -right-6 -top-6 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <DynamicIcon name="Sparkles" size={200} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold tracking-widest text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            PRESENÇA DIÁRIA COMPLETA
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Olá, Programador! 👋
          </h2>
          <p className="max-w-xl text-slate-300 text-sm md:text-base leading-relaxed font-sans">
            Seu streak de estudos está seguro com <strong className="text-orange-400 font-extrabold">{stats.streak} dias seguidos</strong>. Mantenha as lições em dia para desbloquear multiplicadores de moedas no laboratório.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab("lessons")}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-sky-500 text-white hover:bg-sky-400 transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <DynamicIcon name="Play" size={16} />
              Continuar Trilha
            </button>
            <button
              onClick={handleClaimChest}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-sky-550/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-base">🎁</span>
              Coletar Baú de Recompensa
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {energyStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-450 dark:text-sky-300 text-sm font-semibold"
          >
            <DynamicIcon name="Sparkles" className="text-sky-400 shrink-0" size={18} />
            <span>{energyStatus}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Core Hub and Health Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Quests Panel (Glass styled) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-800 bg-slate-900/40 glass space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <DynamicIcon name="Flame" className="text-orange-400" size={18} />
              Missões Diárias
            </h3>
            <span className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">Reseta a cada 24h</span>
          </div>

          <div className="space-y-3">
            {activeQuests.map((quest, idx) => (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  quest.done 
                    ? "bg-emerald-500/5 border-emerald-500/15 text-slate-500"
                    : "bg-slate-900/20 dark:bg-slate-900/50 border-slate-800 text-slate-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold leading-none ${
                  quest.done 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-slate-800 dark:bg-slate-900 text-slate-400 border border-slate-700 dark:border-slate-800"
                }`}>
                  {quest.done ? "✓" : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${quest.done ? "line-through text-slate-500" : ""}`}>
                    {quest.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{quest.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg font-mono ${
                    quest.done ? "bg-slate-800 text-slate-500" : "bg-yellow-400/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/10"
                  }`}>
                    +{quest.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy recovery cafe box */}
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/30 glass flex flex-col justify-between gap-5 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center mx-auto text-rose-400 font-extrabold text-xl">
              ⚡
            </div>
            <h3 className="font-bold text-lg">Central de Descanso</h3>
            <p className="text-xs text-slate-450 max-w-xs mx-auto leading-relaxed">
              Errou lições ou gerou desafios complexos e esgotou sua energia? Não se desespere. Descanse os olhos ou beba um café expresso virtual!
            </p>
          </div>

          <div className="p-3 bg-slate-900/55 rounded-2xl border border-slate-850 flex items-center justify-around">
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Energia Atual</span>
              <div className="text-lg font-black text-rose-400">{stats.energy} / {stats.maxEnergy}</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Moeda Virtual</span>
              <div className="text-lg font-black text-yellow-400">🪙 {stats.coins}</div>
            </div>
          </div>

          <button
            onClick={handleCoffeeRest}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase bg-sky-500 text-white hover:bg-sky-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            <span>☕ Tomar Expresso Duplo</span>
            <span className="text-yellow-300 font-mono">(-25 moedas)</span>
          </button>
        </div>
      </div>

      {/* Accomplishments / Achievements Section */}
      <div className="space-y-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <DynamicIcon name="Award" className="text-amber-400" size={20} />
          Conquistas Desbloqueáveis
        </h3>
        <p className="text-xs text-slate-400 -mt-2">Redima seu prêmio assim que cumprir os requisitos da missão.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                ach.unlocked
                  ? "bg-slate-900/40 border-amber-500/30 glass"
                  : "bg-slate-950/20 border-slate-900 opacity-70 glass"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-2xl ${
                  ach.unlocked ? "bg-amber-500/15 text-amber-400" : "bg-slate-900 text-slate-500 border border-slate-800"
                }`}>
                  <DynamicIcon name={ach.icon} size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">{ach.title}</h4>
                  <p className="text-xs text-slate-450 leading-normal">{ach.description}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider bg-slate-900/80 border border-slate-850 px-2.5 py-1 rounded-md">
                 🎁 {ach.xpReward} XP Recompensa
                </div>

                {ach.unlocked ? (
                  <button
                    onClick={() => redeemReward(ach.id, ach.xpReward)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors cursor-pointer"
                  >
                    Resgatar
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <DynamicIcon name="Lock" size={12} />
                    Bloqueada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
