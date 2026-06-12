/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CareerRoadmap, StudyTrack } from "../types";
import { DynamicIcon } from "./DynamicIcon";

interface CareerRoadmapsProps {
  roadmaps: CareerRoadmap[];
  tracks: StudyTrack[];
  setActiveTab: (tab: string) => void;
}

export const CareerRoadmaps: React.FC<CareerRoadmapsProps> = ({
  roadmaps,
  tracks,
  setActiveTab
}) => {
  const [selectedRoadmap, setSelectedRoadmap] = useState<CareerRoadmap>(roadmaps[0]);

  // Helper check if required lessons are completed by looking at our tracks completed lessons
  const isMilestoneCompleted = (requiredIds: string[]) => {
    if (requiredIds.length === 0) return true; // Freebie node
    
    // Check if ALL required lesson ids are marked as completed: true in tracks
    let completedCount = 0;
    requiredIds.forEach((id) => {
      tracks.forEach((track) => {
        const lesson = track.lessons.find((l) => l.id === id);
        if (lesson && lesson.completed) {
          completedCount++;
        }
      });
    });

    return completedCount >= requiredIds.length;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 opacity-95">
      {/* Tab select option header block */}
      <div className="flex gap-4 border-b dark:border-slate-850 pb-3">
        {roadmaps.map((road) => {
          const isSelected = selectedRoadmap.id === road.id;
          return (
            <button
              key={road.id}
              onClick={() => setSelectedRoadmap(road)}
              className={`pb-2.5 font-black text-sm border-b-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-sky-500 text-sky-450 dark:text-sky-300"
                  : "border-transparent text-slate-400 hover:text-slate-300"
              }`}
            >
              📊 {road.role}
            </button>
          );
        })}
      </div>

      {/* Main road detailed layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left guide block */}
        <div className="lg:col-span-1 p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <DynamicIcon name="Network" size={24} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest font-mono">
              Roadmap Vocacional
            </span>
            <h3 className="font-black text-xl text-slate-100">{selectedRoadmap.title}</h3>
            <p className="text-xs text-slate-400 leading-normal">{selectedRoadmap.description}</p>
          </div>

          <div className="pt-2">
            <span className="inline-block text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 font-mono">
              Foco: {selectedRoadmap.difficulty}
            </span>
          </div>

          <button
            onClick={() => setActiveTab("lessons")}
            className="w-full py-3 rounded-xl font-extrabold text-xs uppercase bg-sky-500 text-white hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
          >
            <span>Resolver Lições da Carreira</span>
            <DynamicIcon name="ArrowRight" size={12} />
          </button>
        </div>

        {/* Right Symmetrical Node tree flow diagram */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-850 bg-slate-900/40 glass space-y-8 relative">
          
          <div className="absolute left-10 md:left-12 top-10 bottom-10 w-0.5 bg-slate-800" />
          
          <div className="space-y-8 relative z-10">
            {selectedRoadmap.milestones.map((milestone, idx) => {
              const isCompleted = isMilestoneCompleted(milestone.requiredLessons);
              return (
                <div key={milestone.id} className="flex gap-5 md:gap-7 items-start">
                  {/* Bubble connector node */}
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs md:text-sm shrink-0 transition-all ${
                    isCompleted
                      ? "bg-sky-500/10 border-sky-500 text-sky-400 shadow-lg shadow-sky-500/10"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>

                  {/* Node cards details */}
                  <div className={`p-5 rounded-3xl border flex-1 transition-all ${
                    isCompleted
                      ? "bg-sky-500/5 border-sky-505/20 border-sky-500/20"
                      : "bg-slate-950/40 border-slate-850"
                  }`}>
                    <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                      <h4 className="font-extrabold text-xs md:text-sm text-slate-100">
                        {milestone.title}
                      </h4>
                      <span className={`text-[9px] font-bold tracking-wider font-mono px-2.5 py-0.5 rounded-lg border uppercase ${
                        isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-slate-800/50 border-slate-700/50 text-slate-400"
                      }`}>
                        {isCompleted ? "Concluído" : "Pendente"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 ml-1.5 leading-relaxed">{milestone.description}</p>
                    
                    {/* Required components display metrics */}
                    {milestone.requiredLessons.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono">
                          Requisitos:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {milestone.requiredLessons.map((les) => (
                            <span
                              key={les}
                              className="text-[9px] font-bold px-2 py-0.5 rounded-lg border bg-sky-500/10 border-sky-500/20 text-sky-400 font-mono"
                            >
                              {les.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
