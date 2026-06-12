/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { LessonsEngine } from "./components/LessonsEngine";
import { CodeSandbox } from "./components/CodeSandbox";
import { InterviewSim } from "./components/InterviewSim";
import { CareerRoadmaps } from "./components/CareerRoadmaps";
import { SocialArea } from "./components/SocialArea";
import { TutorHub } from "./components/TutorHub";
import { MonetizationPage } from "./components/MonetizationPage";
import {
  INITIAL_TRACKS,
  INITIAL_ACHIEVEMENTS,
  CAREER_ROADMAPS,
  UserStats,
  StudyTrack,
  Lesson,
  Achievement
} from "./types";
import { motion, AnimatePresence } from "motion/react";
import { DynamicIcon } from "./components/DynamicIcon";

export default function App() {
  // 1. Core Persistent States or Fallback Init
  const [stats, setStats] = useState<UserStats>(() => {
    const local = localStorage.getItem("devquest_stats");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // Fallback
      }
    }
    return {
      level: 1,
      xp: 0,
      xpNeeded: 1000,
      streak: 5,
      energy: 5,
      maxEnergy: 5,
      coins: 120,
      isPremium: false
    };
  });

  const [tracks, setTracks] = useState<StudyTrack[]>(() => {
    const local = localStorage.getItem("devquest_tracks");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_TRACKS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const local = localStorage.getItem("devquest_achievements");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Active view tracking
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Challenge transition payload
  const [activeChallenge, setActiveChallenge] = useState<Lesson | null>(null);
  const [activeChallengeTrackId, setActiveChallengeTrackId] = useState<string | null>(null);

  // Alert overlay feedback
  const [levelupAlert, setLevelupAlert] = useState<string | null>(null);

  // 2. Local Storage Sync
  useEffect(() => {
    localStorage.setItem("devquest_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("devquest_tracks", JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem("devquest_achievements", JSON.stringify(achievements));
  }, [achievements]);

  // 3. Game action mechanics
  const awardXp = (amount: number) => {
    setStats((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpNeeded = prev.xpNeeded;
      let leveledUp = false;

      while (newXp >= newXpNeeded) {
        newXp -= newXpNeeded;
        newLevel += 1;
        newXpNeeded = Math.round(newXpNeeded * 1.5);
        leveledUp = true;
      }

      if (leveledUp) {
        setLevelupAlert(`🎉 SENSACIONAL! Você subiu de nível! Agora você está no Nível ${newLevel}. Continue assim!`);
        setTimeout(() => setLevelupAlert(null), 5000);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpNeeded: newXpNeeded,
        coins: prev.coins + Math.round(amount * 0.2) // Give some casual coins
      };
    });
  };

  const deductEnergy = (amount: number) => {
    setStats((prev) => {
      const remaining = Math.max(0, prev.energy - amount);
      return { ...prev, energy: remaining };
    });
  };

  const recoverEnergy = (costCoins: number, value: number) => {
    setStats((prev) => {
      const nextEnergy = Math.min(prev.maxEnergy, prev.energy + value);
      const remainingCoins = Math.max(0, prev.coins - costCoins);
      return {
        ...prev,
        energy: nextEnergy,
        coins: remainingCoins
      };
    });
  };

  const awardCoins = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount)
    }));
  };

  const onCompleteLesson = (trackId: string, lessonId: string, xpReward: number, coinsReward: number) => {
    // Mark completed inside state tracks array
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          return {
            ...t,
            lessons: t.mapLessons ? t.lessons : t.lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l))
          };
        }
        return t;
      })
    );

    // Apply currency
    awardXp(xpReward);
    awardCoins(coinsReward);

    // Check achievement unlock for completed lesson counts
    checkGeneralLessonsProgressAchievements();
  };

  const onSelectCodeChallengeInSandbox = (lesson: Lesson, trackId: string) => {
    setActiveChallenge(lesson);
    setActiveChallengeTrackId(trackId);
  };

  const onCompleteChallenge = (xpReward: number, coinsReward: number) => {
    // Award currency
    awardXp(xpReward);
    awardCoins(coinsReward);

    // Mark current coding lesson complete if loaded from course
    if (activeChallenge && activeChallengeTrackId) {
      onCompleteLesson(activeChallengeTrackId, activeChallenge.id, 0, 0); // XP given directly already
    }

    // Progress milestone achievements
    unlockAchievement("first_steps");
    unlockAchievement("code_master");
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          awardXp(ach.xpReward);
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  };

  const checkGeneralLessonsProgressAchievements = () => {
    unlockAchievement("first_steps");
  };

  // Preset specific cheats/multipliers for gamification
  const triggerStreakMultiplier = () => {
    setStats((prev) => ({
      ...prev,
      streak: prev.streak + 1
    }));
    unlockAchievement("streak_3");
  };

  const customStreakBonus = () => {
    setStats((prev) => ({
      ...prev,
      coins: prev.coins + 50
    }));
    awardXp(20);
  };

  const activatePremiumInParentState = () => {
    setStats((prev) => ({ ...prev, isPremium: true }));
    setLevelupAlert("👑 Parabéns! Licença Premium PRO Ativada com Sucesso - IA Ilimitada e Simulador desbloqueados!");
    setTimeout(() => setLevelupAlert(null), 5000);
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-indigo-500/30 transition-colors duration-200 ${
      darkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Visual Overlay elements / Modals */}
      <AnimatePresence>
        {levelupAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold leading-relaxed shadow-lg max-w-lg border border-white/20 select-none flex items-center gap-3.5"
          >
            <span className="text-2xl shrink-0">✨</span>
            <span className="text-sm">{levelupAlert}</span>
            <button
              onClick={() => setLevelupAlert(null)}
              className="text-xs text-white/60 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Side menu navigation */}
        <Sidebar
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Right main viewing cards workspace */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "dashboard" && (
                <Dashboard
                  stats={stats}
                  achievements={achievements}
                  redeemReward={(id, xp) => {
                    // Mark achievement redeemed in parent state
                    setAchievements((prev) =>
                      prev.map((a) => (a.id === id ? { ...a, unlocked: false } : a))
                    );
                    awardXp(xp);
                  }}
                  recoverEnergy={recoverEnergy}
                  setActiveTab={setActiveTab}
                  quizStreakBonus={customStreakBonus}
                />
              )}

              {activeTab === "lessons" && (
                <LessonsEngine
                  tracks={tracks}
                  stats={stats}
                  onCompleteLesson={onCompleteLesson}
                  deductEnergy={deductEnergy}
                  onSelectCodeChallenge={onSelectCodeChallengeInSandbox}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "sandbox" && (
                <CodeSandbox
                  activeChallenge={activeChallenge}
                  trackId={activeChallengeTrackId}
                  stats={stats}
                  onCompleteChallenge={onCompleteChallenge}
                  awardCoins={awardCoins}
                />
              )}

              {activeTab === "tutor" && (
                <TutorHub
                  stats={stats}
                  awardXp={awardXp}
                  awardCoins={awardCoins}
                  markAchievementUnlocked={unlockAchievement}
                />
              )}

              {activeTab === "interview" && (
                <InterviewSim
                  stats={stats}
                  unlockAchievementInParent={unlockAchievement}
                  awardXp={awardXp}
                />
              )}

              {activeTab === "roadmaps" && (
                <CareerRoadmaps
                  roadmaps={CAREER_ROADMAPS}
                  tracks={tracks}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "social" && (
                <SocialArea
                  userXpThisWeek={450 + stats.xp * 0.1}
                  userLevel={stats.level}
                  awardXp={awardXp}
                  awardCoins={awardCoins}
                  triggerStreakMultiplier={triggerStreakMultiplier}
                />
              )}

              {activeTab === "premium" && (
                <MonetizationPage
                  stats={stats}
                  activatePremium={activatePremiumInParentState}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
