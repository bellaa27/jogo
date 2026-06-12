/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StudyTrack, Lesson, UserStats } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { motion } from "motion/react";

interface LessonsEngineProps {
  tracks: StudyTrack[];
  stats: UserStats;
  onCompleteLesson: (trackId: string, lessonId: string, xpReward: number, coinsReward: number) => void;
  deductEnergy: (amount: number) => void;
  onSelectCodeChallenge: (lesson: Lesson, trackId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const LessonsEngine: React.FC<LessonsEngineProps> = ({
  tracks,
  stats,
  onCompleteLesson,
  deductEnergy,
  onSelectCodeChallenge,
  setActiveTab
}) => {
  const [selectedTrack, setSelectedTrack] = useState<StudyTrack>(tracks[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const handleSelectTrack = (track: StudyTrack) => {
    setSelectedTrack(track);
    setSelectedLesson(null);
    clearQuizState();
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    clearQuizState();
  };

  const clearQuizState = () => {
    setSelectedOption(null);
    setQuizChecked(false);
    setQuizCorrect(null);
  };

  const handleApplyTheoryCompleted = () => {
    if (!selectedLesson) return;
    onCompleteLesson(selectedTrack.id, selectedLesson.id, selectedLesson.xpReward, 15);
    // Move to next lesson if available or simply confirm completion
    const currentIndex = selectedTrack.lessons.findIndex((l) => l.id === selectedLesson.id);
    const updatedLesson = { ...selectedLesson, completed: true };
    setSelectedLesson(updatedLesson);
  };

  const checkQuizAnswer = () => {
    if (selectedOption === null || !selectedLesson) return;
    
    if (stats.energy <= 0) {
      alert("Oops! Você está sem energia ⚡. Vá ao Painel Principal e tome um café expresso duplo ou descanse para recuperar!");
      return;
    }

    setQuizChecked(true);
    const isCorrect = selectedOption === selectedLesson.quizCorrectIndex;
    setQuizCorrect(isCorrect);

    if (isCorrect) {
      onCompleteLesson(selectedTrack.id, selectedLesson.id, selectedLesson.xpReward, 25);
      const updatedLesson = { ...selectedLesson, completed: true };
      setSelectedLesson(updatedLesson);
    } else {
      deductEnergy(1);
    }
  };

  const handleSendToSandbox = (lesson: Lesson) => {
    onSelectCodeChallenge(lesson, selectedTrack.id);
    setActiveTab("sandbox");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      {/* 1. Track Selector Horizontal Row */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-100">
          <DynamicIcon name="BookOpen" className="text-sky-400" size={18} />
          Escolha uma Trilha de Estudo
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin dark:scrollbar-thumb-slate-900">
          {tracks.map((track) => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`flex items-center gap-3 p-4 rounded-3xl border text-left shrink-0 min-w-[210px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-sky-550 to-blue-600 bg-sky-500 text-white shadow-lg shadow-sky-500/20 border-sky-400 font-bold"
                    : "bg-slate-900/40 border-slate-850 text-slate-200 glass hover:bg-slate-900/60"
                }`}
              >
                <div className={`p-2 rounded-2xl ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-900 border border-slate-800 text-sky-400"
                }`}>
                  <DynamicIcon name={track.iconName} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight truncate max-w-[140px] text-slate-100">{track.title}</h4>
                  <span className={`text-[10px] font-bold ${
                    isSelected ? "text-sky-200" : "text-slate-500"
                  }`}>{track.difficulty}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Selected Track Overview & Sub-lessons layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left column: Sub-lessons timeline layout */}
        <div className="md:col-span-1 p-5 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-wider uppercase text-sky-400 font-mono">
              Sua Jornada
            </span>
            <h3 className="font-extrabold text-xl leading-tight text-slate-100">
              {selectedTrack.title}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">{selectedTrack.description}</p>
          </div>

          <div className="w-full h-px bg-slate-800/80 my-2" />

          {/* Symmetrical Vertical Progress timeline */}
          <div className="relative pl-4 space-y-4">
            <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-slate-800" />
            
            {selectedTrack.lessons.map((lesson, idx) => {
              const isLessonSelected = selectedLesson?.id === lesson.id;
              return (
                <button
                   key={lesson.id}
                   onClick={() => handleSelectLesson(lesson)}
                   className={`w-full flex items-center gap-3 p-2 rounded-xl text-left relative transition-all cursor-pointer ${
                    isLessonSelected
                      ? "bg-slate-900/50 border border-slate-850/30 font-semibold"
                      : "hover:bg-slate-850/40 text-slate-500"
                  }`}
                >
                  {/* Circle state */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 z-10 font-bold text-xs transition-all ${
                    lesson.completed
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/5"
                      : isLessonSelected
                        ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/20"
                        : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {lesson.completed ? "✓" : idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold leading-tight truncate transition-colors ${
                      isLessonSelected ? "text-sky-400" : "text-slate-300 hover:text-slate-200"
                    }`}>
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1 mt-0.5 font-bold">
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.type}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Interactive Work Board containing Theory / Quiz / Sandboxed instructions */}
        <div className="md:col-span-2 p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass min-h-[400px] flex flex-col justify-between">
          {selectedLesson ? (
            <div className="space-y-6">
              {/* Lesson General Badge Header */}
              <div className="flex justify-between items-start border-b border-slate-850 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-sky-400 font-mono">
                    Lição {selectedLesson.completed && "• Completa!"}
                  </span>
                  <h3 className="font-black text-xl md:text-2xl text-slate-100">{selectedLesson.title}</h3>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg border border-yellow-500/10 bg-yellow-400/10 text-yellow-400 font-mono">
                    +{selectedLesson.xpReward} XP
                  </span>
                </div>
              </div>

              {/* 2.1 Theory rendering view */}
              {selectedLesson.type === "teoria" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850">
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {selectedLesson.theoryContent}
                    </p>
                  </div>

                  {selectedLesson.analogy && (
                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-2 ai-glow">
                      <h4 className="text-xs font-black text-purple-400 tracking-wide uppercase flex items-center gap-1 font-mono">
                        💡 Analogia do Yuki
                      </h4>
                      <p className="text-xs text-slate-300 leading-normal">
                        {selectedLesson.analogy}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleApplyTheoryCompleted}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-sky-500 text-white hover:bg-sky-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 cursor-pointer"
                  >
                    <span>{selectedLesson.completed ? "Concluída!" : "Concluir Leitura"}</span>
                    {!selectedLesson.completed && <DynamicIcon name="CheckCircle2" size={16} />}
                  </button>
                </div>
              )}

              {/* 2.2 Quiz rendering view */}
              {selectedLesson.type === "quiz" && (
                <div className="space-y-5">
                  <h4 className="font-extrabold text-sm text-slate-200">
                    {selectedLesson.quizQuestion}
                  </h4>

                  <div className="space-y-2">
                    {selectedLesson.quizOptions?.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          disabled={quizChecked && selectedLesson.completed}
                          onClick={() => {
                            if (!quizChecked) setSelectedOption(idx);
                          }}
                          className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-bold transition-all cursor-pointer ${
                            quizChecked && idx === selectedLesson.quizCorrectIndex
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : quizChecked && isSelected && !quizCorrect
                                ? "bg-red-500/15 border-red-500 text-red-400"
                                : isSelected
                                  ? "bg-sky-500/15 border-sky-500 text-sky-400 shadow-sm shadow-sky-500/5"
                                  : "bg-slate-950/40 border-slate-850 hover:bg-slate-900 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-sky-400">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback on answer */}
                  {quizChecked && (
                    <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 ${
                      quizCorrect
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      <DynamicIcon name={quizCorrect ? "CheckCircle2" : "AlertCircle"} size={18} />
                      <div>
                        {quizCorrect ? (
                          <p className="font-bold">Maravilhoso! Sua resposta está absolutamente correta.</p>
                        ) : (
                          <p className="font-bold">Ops! Resposta incorreta. Você perdeu 1 de energia ⚡. Tente novamente!</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!selectedLesson.completed && (
                    <button
                      disabled={selectedOption === null}
                      onClick={checkQuizAnswer}
                      className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-sky-500 text-white disabled:opacity-50 enabled:hover:bg-sky-400 transition-colors cursor-pointer"
                    >
                      Verificar Resposta
                    </button>
                  )}
                </div>
              )}

              {/* 2.3 Code / Sandbox workflow route indicator */}
              {selectedLesson.type === "codigo" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850 text-slate-300 text-sm space-y-2">
                    <h4 className="font-bold text-slate-200">Instruções do Desafio:</h4>
                    <p className="text-xs md:text-sm">{selectedLesson.codeInstruction}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-850 text-xs font-mono space-y-1.5 header">
                    <span className="font-bold text-slate-400">Casos de Teste esperados:</span>
                    {selectedLesson.testCases?.map((tc, idx) => (
                      <div key={idx} className="flex justify-between text-slate-400">
                        <span>• {tc.description}</span>
                        <span className="text-sky-450 font-black">{tc.expected}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSendToSandbox(selectedLesson)}
                    className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-sky-500 text-white hover:bg-sky-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 cursor-pointer"
                  >
                    <span>Escrever Código no Laboratório</span>
                    <DynamicIcon name="ArrowRight" size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 m-auto">
              <div className="w-16 h-16 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/15 flex items-center justify-center">
                <DynamicIcon name="BookOpen" size={32} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-200">Inicie uma Lição</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                Selecione um tópico na lista lateral esquerda para começar a pontuar, ganhar XP, moedas e desbloquear insígnias.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
