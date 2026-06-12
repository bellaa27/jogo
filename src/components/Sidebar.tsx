/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";

interface SidebarProps {
  stats: UserStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stats,
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode
}) => {
  const navItems = [
    { id: "dashboard", label: "Painel Principal", icon: "Layout" },
    { id: "lessons", label: "Trilhas de Estudo", icon: "BookOpen" },
    { id: "sandbox", label: "Laboratório de Código", icon: "Code2" },
    { id: "tutor", label: "Tutor Yuki IA", icon: "Sparkles" },
    { id: "interview", label: "Simulador de Entrevista", icon: "Award" },
    { id: "roadmaps", label: "Planos de Carreira", icon: "Network" },
    { id: "social", label: "Comunidade / Ranking", icon: "Users" },
    { id: "premium", label: "Assinatura PRO", icon: "Gem" }
  ];

  const xpPercentage = Math.min(100, Math.floor((stats.xp / stats.xpNeeded) * 100));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-72 shrink-0 border-r min-h-screen transition-all duration-200 ${
        darkMode ? "bg-slate-950/80 backdrop-blur-md border-slate-850 text-slate-200" : "bg-white border-slate-200 text-slate-850"
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/10 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-sky-500/20">
              DQ
            </div>
            <div>
              <h1 className="font-sans font-black text-lg tracking-tight hover:text-sky-400 transition-colors">
                DevQuest
              </h1>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                v1.2.0 • Gamificado
              </span>
            </div>
          </div>
          {stats.isPremium && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/15 text-amber-500 border border-amber-500/20 animate-pulse">
              PRO
            </span>
          )}
        </div>

        {/* User Stats Overview Mini-HUD */}
        <div className="p-5 mx-4 my-4 rounded-2xl glass border border-slate-850/50 flex flex-col gap-4">
          {/* Level & XP bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-sky-400">Nível {stats.level}</span>
              <span className="text-xs font-mono text-slate-400">{stats.xp}/{stats.xpNeeded} XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500 shadow-md shadow-sky-500/10"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

          {/* Core game resource bars: Streak, Energy, Coins */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center p-2 rounded-xl bg-orange-500/10 border border-orange-500/15">
              <span className="text-orange-400 text-sm font-black flex items-center gap-0.5 justify-center">
                🔥 {stats.streak}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-orange-400/80">Streak</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-rose-500/10 border border-rose-500/15">
              <span className="text-rose-400 text-sm font-black flex items-center gap-0.5 justify-center">
                ⚡ {stats.energy}/{stats.maxEnergy}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-rose-400/80">Energia</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/15">
              <span className="text-yellow-400 text-sm font-black flex items-center gap-0.5 justify-center">
                🪙 {stats.coins}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-400/80">Moedas</span>
            </div>
          </div>
        </div>

        {/* Navigation Items list */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sky-500/10 border-l-4 border-sky-500 text-sky-400 shadow-sm shadow-sky-500/5"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <DynamicIcon name={item.icon} className={isActive ? "text-sky-400" : "text-slate-500 dark:text-slate-400"} size={18} />
                <span>{item.label}</span>
                {item.id === "premium" && !stats.isPremium && (
                  <span className="ml-auto bg-amber-500 text-slate-950 font-extrabold text-[9px] px-1.5 py-0.5 rounded-md animate-pulse">
                    PRO
                  </span>
                )}
                {item.id === "tutor" && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions: Theme Switcher & Credits */}
        <div className="p-4 border-t border-slate-800/10 dark:border-slate-850 flex items-center justify-between">
          <div className="text-xs text-slate-400 tracking-wide font-mono">
            Modo {darkMode ? "Noturno 🌙" : "Claro ☀️"}
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            title="Alternar Tema"
          >
            <DynamicIcon name={darkMode ? "Compass" : "Flame"} size={18} />
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation + Bottom Bar HUD */}
      <div className={`md:hidden flex flex-col w-full border-b transition-colors ${
        darkMode ? "bg-slate-950 border-slate-850 text-slate-100" : "bg-white border-slate-200 text-slate-800"
      }`}>
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-850 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
              DQ
            </div>
            <span className="font-bold font-sans text-md">DevQuest</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-0.5">
              🔥 {stats.streak}
            </span>
            <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-0.5">
              ⚡ {stats.energy}/{stats.maxEnergy}
            </span>
            <span className="text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-0.5">
              🪙 {stats.coins}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900"
            >
              <DynamicIcon name={darkMode ? "Compass" : "Flame"} size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation bar */}
        <div className="flex overflow-x-auto px-2 py-2 gap-1.5 scrollbar-thin dark:scrollbar-thumb-slate-900 bg-slate-950/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 transition-all ${
                  isActive
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                }`}
              >
                <DynamicIcon name={item.icon} size={12} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
