/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { RankingUser, StudyGroup, WEEKLY_RANKING, MOCK_GROUPS } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion, AnimatePresence } from "motion/react";

interface SocialAreaProps {
  userXpThisWeek: number;
  userLevel: number;
  awardXp: (amount: number) => void;
  awardCoins: (amount: number) => void;
  triggerStreakMultiplier: () => void;
}

export const SocialArea: React.FC<SocialAreaProps> = ({
  userXpThisWeek,
  userLevel,
  awardXp,
  awardCoins,
  triggerStreakMultiplier
}) => {
  const [rankingList, setRankingList] = useState<RankingUser[]>(
    WEEKLY_RANKING.map((u) => u.isCurrentUser ? { ...u, xpThisWeek: userXpThisWeek, level: userLevel } : u)
  );

  const [groups, setGroups] = useState<StudyGroup[]>(MOCK_GROUPS);

  // Quick technical duel battle arena states
  const [inDuel, setInDuel] = useState<boolean>(false);
  const [duelOpponent, setDuelOpponent] = useState<RankingUser | null>(null);
  const [duelStep, setDuelStep] = useState<number>(0);
  const [duelScore, setDuelScore] = useState<number>(0);
  const [duelResult, setDuelResult] = useState<string | null>(null);

  const duelQuestions = [
    {
      q: "Qual propriedade CSS distribui espaço entre itens ao longo do eixo principal?",
      options: ["align-items", "justify-content", "flex-direction", "grid-gap"],
      correct: 1
    },
    {
      q: "Como o interpretador JavaScript avalia a declaração: typeof null?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correct: 2
    },
    {
      q: "Qual dessas ações previne vazamento de memória em listeners assíncronos no React?",
      options: ["Remover os listeners no hook de retorno do useEffect", "Usar classes para todos os componentes", "Declarar funções inline", "Chamar forceUpdate() ao renderizar"],
      correct: 0
    }
  ];

  const handleJoinLeaveGroup = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              joined: !g.joined,
              membersCount: g.joined ? g.membersCount - 1 : g.membersCount + 1
            }
          : g
      )
    );
  };

  const startCombatDuel = () => {
    // Select an opponent above or below
    const candidates = rankingList.filter((u) => !u.isCurrentUser);
    const opponent = candidates[Math.floor(Math.random() * candidates.length)];
    setDuelOpponent(opponent);
    setDuelStep(0);
    setDuelScore(0);
    setDuelResult(null);
    setInDuel(true);
  };

  const handleSelectDuelAnswer = (optionIndex: number) => {
    const question = duelQuestions[duelStep];
    const isCorrect = optionIndex === question.correct;
    if (isCorrect) setDuelScore((s) => s + 1);

    if (duelStep < duelQuestions.length - 1) {
      setDuelStep((s) => s + 1);
    } else {
      // Duel finished! Evaluate outcome
      const finalScore = isCorrect ? duelScore + 1 : duelScore;
      const opponentScore = Math.floor(Math.random() * 3) + 1; // Opponent score: 1 to 3
      
      let resText = "";
      if (finalScore > opponentScore) {
        resText = `VITÓRIA! Você acertou ${finalScore}/${duelQuestions.length} perguntas e derrotou ${duelOpponent?.name} que acertou ${opponentScore}. Recompensas: +100 XP, +40 Moedas! Elites de streak ativos!`;
        awardXp(100);
        awardCoins(40);
        triggerStreakMultiplier();
        
        // Update user position on Weekly Ranking row
        setRankingList((prev) =>
          prev.map((r) =>
            r.isCurrentUser
              ? { ...r, xpThisWeek: r.xpThisWeek + 100 }
              : r
          ).sort((a, b) => b.xpThisWeek - a.xpThisWeek)
        );
      } else if (finalScore === opponentScore) {
        resText = `EMPATE! Ambos acertaram ${finalScore}/${duelQuestions.length} perguntas. Ganhou +20 XP de consolação.`;
        awardXp(20);
      } else {
        resText = `DERROTA! Você acertou ${finalScore}/${duelQuestions.length} perguntas e perdeu de ${duelOpponent?.name} que acertou ${opponentScore}. Não desanime, revise as lições!`;
      }
      setDuelResult(resText);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 opacity-95">
      {/* 1. Duel Room Screen overlay if active */}
      <AnimatePresence>
        {inDuel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl border border-sky-500/25 bg-slate-900/60 glass text-white space-y-6 shadow-xl shadow-sky-500/5"
          >
            {/* Header Battle Banner */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚔️</span>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide uppercase text-sky-400 font-mono">Arena de Duelo Rápido</h4>
                  <p className="text-xs text-slate-400 font-bold">Acerte as perguntas rápidas antes do seu oponente!</p>
                </div>
              </div>
              <button
                onClick={() => setInDuel(false)}
                className="text-xs text-slate-450 hover:text-slate-100 font-bold uppercase transition-colors cursor-pointer"
              >
                Sair da Arena
              </button>
            </div>

            {/* Combatants matching HUD */}
            <div className="flex justify-around items-center py-4 bg-slate-950/60 rounded-2xl border border-slate-850">
              <div className="text-center animate-none">
                <span className="text-3xl block mb-1">🧙‍♀️</span>
                <span className="text-xs font-black text-sky-400 uppercase tracking-widest font-mono">Você</span>
                <span className="text-[10px] text-slate-450 block font-mono font-bold">Nível {userLevel}</span>
              </div>
              <div className="text-center text-slate-600 font-black text-lg select-none">VS</div>
              <div className="text-center animate-none">
                <span className="text-3xl block mb-1">{duelOpponent?.avatar}</span>
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest font-mono">{duelOpponent?.name}</span>
                <span className="text-[10px] text-slate-450 block font-mono font-bold">Nível {duelOpponent?.level}</span>
              </div>
            </div>

            {/* Duel questions stepper block */}
            {!duelResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                  <span className="text-[10px] text-sky-400 tracking-wider font-black block mb-1 uppercase font-mono">
                    Questão {duelStep + 1} de {duelQuestions.length}
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-slate-100">{duelQuestions[duelStep].q}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {duelQuestions[duelStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectDuelAnswer(oIdx)}
                      className="p-3 text-xs text-left rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-sky-500/25 text-slate-200 font-bold transition-all cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-4">
                <p className="text-xs md:text-sm leading-relaxed p-4 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 font-bold">
                  {duelResult}
                </p>
                <button
                  onClick={startCombatDuel}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase bg-sky-500 hover:bg-sky-450 text-white transition-all shadow-md shadow-sky-500/15 cursor-pointer"
                >
                  Novo Adversário
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Social Board: Leaderboard and Communities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly XP Rank Leaderboard column */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-6 shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-100">
                <DynamicIcon name="Trophy" className="text-yellow-500" size={18} />
                Liga Semanal de Programadores
              </h3>
              <p className="text-xs text-slate-400 font-bold">Os 3 melhores ganham moedas extras todo domingo!</p>
            </div>

            <button
              onClick={startCombatDuel}
              className="px-4 py-2.5 rounded-xl font-black text-xs uppercase bg-sky-500 hover:bg-sky-450 hover:scale-[1.01] text-white flex items-center gap-2.5 transition-all shadow-md shadow-sky-500/10 cursor-pointer"
            >
              <span>⚔️ Duelo Rápido</span>
            </button>
          </div>

          {/* Ranking rows */}
          <div className="space-y-2">
            {rankingList.map((user, idx) => {
              const userPodiumColor =
                idx === 0
                  ? "text-yellow-500"
                  : idx === 1
                    ? "text-slate-300"
                    : idx === 2
                      ? "text-amber-500"
                      : "text-slate-500";
              const isMe = user.isCurrentUser;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl flex items-center gap-4 border transition-all ${
                    isMe
                      ? "bg-sky-500/10 border-sky-500/25 shadow-md shadow-sky-500/5 font-bold"
                      : "bg-slate-950/40 border-slate-850"
                  }`}
                >
                  {/* Position position */}
                  <span className={`w-6 text-center font-black text-xs md:text-sm ${userPodiumColor}`}>
                    {idx + 1}º
                  </span>

                  {/* Avatar wrapper */}
                  <span className="text-xl md:text-2xl select-none shrink-0">{user.avatar}</span>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-extrabold truncate text-slate-200">
                      {user.name} {isMe ? "(Você)" : ""}
                    </h4>
                    <span className="text-[10px] text-slate-450 font-mono font-bold">Nível {user.level}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-black text-slate-200 block">
                      {user.xpThisWeek} XP
                    </span>
                    <span className="text-[10px] font-bold text-slate-450">nesta semana</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Groups box column */}
        <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg flex items-center gap-2 text-slate-100">
              <DynamicIcon name="Users" className="text-sky-400" size={18} />
              Salas de Grupo
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-bold">
              Junte-se a grupos ativos para debater e receber desafios exclusivos de comunidade.
            </p>
          </div>

          <div className="space-y-4">
            {groups.map((grp) => (
              <div
                key={grp.id}
                className="p-3.5 rounded-2xl border border-slate-850 bg-slate-950/40 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold leading-tight text-slate-200">{grp.name}</h4>
                    <span className="text-[9px] text-slate-450 font-bold">{grp.membersCount} desenvolvedores</span>
                  </div>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-mono bg-sky-500/10 text-sky-450 border border-sky-500/20">
                    {grp.category}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 font-bold">{grp.desc}</p>
                <button
                  onClick={() => handleJoinLeaveGroup(grp.id)}
                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                    grp.joined
                      ? "bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-750"
                      : "bg-sky-500 text-white hover:bg-sky-450 shadow-md shadow-sky-500/10 font-extrabold"
                  }`}
                >
                  {grp.joined ? "Sair do grupo" : "Aderir ao grupo"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
