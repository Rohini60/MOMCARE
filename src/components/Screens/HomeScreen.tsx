import React, { useState } from 'react';
import { UserProfile, CareTask, AIInsight, ScreenType } from '../../types';
import { getFetalDevelopmentForWeek } from '../../data/fetalDevelopment';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Activity,
  FileSearch,
  MessageSquare,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Heart,
  Droplets,
  Moon,
  Info,
  CheckSquare,
  Footprints
} from 'lucide-react';
import { ConfidenceBadge } from '../Common/ConfidenceBadge';

interface HomeScreenProps {
  user: UserProfile;
  careTasks: CareTask[];
  onToggleTask: (taskId: string) => void;
  featuredInsight: AIInsight;
  onNavigate: (screen: ScreenType) => void;
  onOpenLogSymptom: () => void;
  onUpdateWeek?: (week: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  careTasks,
  onToggleTask,
  featuredInsight,
  onNavigate,
  onOpenLogSymptom,
  onUpdateWeek,
}) => {
  const [showWhyModal, setShowWhyModal] = useState(false);

  // Dynamically resolve fetal development stage, image, and milestones for user's pregnancy week
  const stage = getFetalDevelopmentForWeek(user.pregnancyWeek);

  // Group tasks
  const morningTasks = careTasks.filter((t) => t.timeOfDay === 'morning');
  const afternoonTasks = careTasks.filter((t) => t.timeOfDay === 'afternoon');
  const eveningTasks = careTasks.filter((t) => t.timeOfDay === 'evening');

  const completedCount = careTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / careTasks.length) * 100);

  const handleWeekStep = (delta: number) => {
    if (onUpdateWeek) {
      const nextWeek = Math.max(4, Math.min(40, user.pregnancyWeek + delta));
      onUpdateWeek(nextWeek);
    }
  };

  const handleSelectQuickWeek = (wk: number) => {
    if (onUpdateWeek) {
      onUpdateWeek(wk);
    }
  };

  return (
    <div className="space-y-7 pb-12 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
            Good morning, {user.name} ❤️
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Your care journey — Week {user.pregnancyWeek} ({stage.trimester}) · {user.pregnancyType}
          </p>
        </div>

        {/* Progress pill indicator (interactive filter/status) */}
        <div className="flex items-center gap-3 bg-[#FFFDF9] border border-[#EFE7DE] rounded-2xl px-4 py-2 self-start sm:self-auto shadow-xs">
          <div className="text-right">
            <span className="text-[10px] text-stone-600 block uppercase tracking-wider font-semibold">
              Today's Care Flow
            </span>
            <span className="text-xs font-semibold text-stone-800">
              {completedCount} of {careTasks.length} Completed
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FAF6F2] flex items-center justify-center border-2 border-[#B25742] text-xs font-serif font-bold text-[#8C3A27]">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* 2. Fetal-Development Visual & Stage Guide (Dynamically changes with pregnancy week) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-sm overflow-hidden">
        {/* Week Switcher bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C3A27] bg-[#F5ECE8] px-2.5 py-0.5 rounded-full">
              {stage.trimester}
            </span>
            <span className="text-xs font-serif font-bold text-stone-800">
              Week {stage.week} of 40
            </span>
          </div>

          {/* Quick week switcher controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleWeekStep(-1)}
              disabled={user.pregnancyWeek <= 4}
              title="Previous week"
              className="w-7 h-7 rounded-lg bg-[#FAF6F2] border border-[#EFE7DE] flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick jump milestones */}
            <div className="hidden sm:flex items-center gap-1">
              {[8, 12, 15, 20, 24, 32, 36].map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => handleSelectQuickWeek(wk)}
                  className={`text-[11px] px-2 py-1 rounded-md transition cursor-pointer ${
                    user.pregnancyWeek === wk
                      ? 'bg-[#8C3A27] text-white font-semibold'
                      : 'bg-[#FAF6F2] text-stone-600 hover:bg-[#EFE7DE]'
                  }`}
                >
                  W{wk}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleWeekStep(1)}
              disabled={user.pregnancyWeek >= 40}
              title="Next week"
              className="w-7 h-7 rounded-lg bg-[#FAF6F2] border border-[#EFE7DE] flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Fetal visual with dynamic image based on pregnancy week */}
          <div className="md:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden aspect-square border border-[#F0E6DE] bg-[#FAF8F5]">
              <img
                key={stage.imageSrc}
                src={stage.imageSrc}
                alt={`Illustrative 3D rendering of ${stage.week}-week fetal development`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full inline-block mb-1">
                  Illustrative fetal development
                </span>
                <p className="text-xs font-medium">
                  Week {stage.week} · {stage.fruitComparison}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-stone-600 text-center mt-1.5 italic">
              Medical illustration · Not an ultrasound scan
            </p>
          </div>

          {/* Development insights based on stage */}
          <div className="md:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C3A27]">
              <Heart className="w-3.5 h-3.5 text-[#B25742]" />
              <span>What is happening in Week {stage.week}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#242122] leading-snug">
              {stage.title}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {stage.summary}
            </p>

            {/* Stage Biometrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-stone-700 py-1 border-y border-[#F0E6DE]">
              <div>
                <span className="text-[10px] text-stone-600 uppercase block font-sans">Length</span>
                <span className="font-semibold">~{stage.lengthCm.toFixed(1)} cm</span>
              </div>
              <div className="h-6 w-px bg-[#EFE7DE]" />
              <div>
                <span className="text-[10px] text-stone-600 uppercase block font-sans">Estimated Weight</span>
                <span className="font-semibold">
                  {stage.weightG >= 1000
                    ? `~${(stage.weightG / 1000).toFixed(1)} kg`
                    : `~${Math.round(stage.weightG)} g`}
                </span>
              </div>
              <div className="h-6 w-px bg-[#EFE7DE]" />
              <div>
                <span className="text-[10px] text-stone-600 uppercase block font-sans">Comparison</span>
                <span className="font-sans font-medium text-stone-800 truncate max-w-[140px] block">
                  {stage.fruitComparison.split('(')[0].trim()}
                </span>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2 text-xs">
              {stage.keyHighlights.map((highlight, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-[#FAF6F2] text-stone-700 border border-[#EFE7DE]">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('mom-care')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C3A27] hover:text-[#5E3B33] transition cursor-pointer"
              >
                <span>Explore full Week {stage.week} maternal guidance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Prominent MomCare Insight Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EADACD] shadow-sm relative overflow-hidden">
        {/* Subtle accent border on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B25742]" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-1">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C3A27] flex items-center gap-1.5">
                <span className="text-sm">🧠</span> MomCare Insight
              </span>
              <span className="text-stone-300">·</span>
              <ConfidenceBadge level={featuredInsight.confidence} />
            </div>

            <h3 className="text-base sm:text-lg font-serif font-bold text-[#242122]">
              We noticed something worth checking.
            </h3>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {featuredInsight.patternNoticed}
            </p>

            {/* Why am I seeing this? Trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowWhyModal(!showWhyModal)}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition underline underline-offset-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why am I seeing this?</span>
              </button>

              {showWhyModal && (
                <div className="mt-2 p-3 bg-[#FAF6F2] rounded-xl text-xs text-stone-600 border border-[#EFE7DE] animate-fade-in">
                  <p className="font-semibold text-stone-800 mb-1">Context Analysis:</p>
                  <p>{featuredInsight.whyThisInsight}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
            <button
              onClick={() => onNavigate('insights')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] active:scale-[0.98] transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>View Insight</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mandatory prototype disclaimer */}
        <div className="mt-4 pt-3 border-t border-[#F0E6DE] text-[11px] text-stone-600 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            Example UI state. MomCare AI provides supportive health guidance and does not diagnose medical conditions.
          </span>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">
          Quick Health Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('daily-tracker')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] hover:border-[#DECBC2] hover:shadow-xs transition text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#242122] group-hover:text-[#8C3A27] transition-colors">
              Daily Care Tracker
            </span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              Water, kicks & vitamins
            </span>
          </button>

          <button
            onClick={onOpenLogSymptom}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] hover:border-[#DECBC2] hover:shadow-xs transition text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#242122] group-hover:text-[#8C3A27] transition-colors">
              Log Symptoms
            </span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              Record swelling or energy
            </span>
          </button>

          <button
            onClick={() => onNavigate('report-analyzer')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] hover:border-[#DECBC2] hover:shadow-xs transition text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSearch className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#242122] group-hover:text-[#8C3A27] transition-colors">
              Understand My Report
            </span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              Simplify CBC or ultrasound
            </span>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] hover:border-[#DECBC2] hover:shadow-xs transition text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-[#B25742]" />
            </div>
            <span className="text-xs font-semibold text-[#242122] group-hover:text-[#8C3A27] transition-colors">
              Ask MomCare AI
            </span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              Contextual guidance
            </span>
          </button>

          <button
            onClick={() => onNavigate('appointments')}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] hover:border-[#DECBC2] hover:shadow-xs transition text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#242122] group-hover:text-[#8C3A27] transition-colors">
              My Appointments
            </span>
            <span className="text-[11px] text-stone-600 mt-0.5">
              Oct 4 with Dr. Sharma
            </span>
          </button>
        </div>
      </div>

      {/* 5. Your Care Today (Timeline / Story-like Experience) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#F0E6DE] gap-2">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#242122]">Your Care Today</h3>
            <p className="text-xs text-stone-500">
              A gentle rhythm designed around your maternal biology
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-stone-500 hidden sm:inline">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <button
              onClick={() => onNavigate('daily-tracker')}
              className="text-xs font-semibold text-[#8C3A27] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Full Daily Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Morning section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Morning
              </span>
              <div className="h-px flex-1 bg-[#F0E6DE]" />
            </div>
            <div className="space-y-2.5">
              {morningTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#FAF6F2] border-[#EADACD] opacity-80'
                      : 'bg-white border-[#EFE7DE] hover:border-[#DECBC2] shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-stone-400 focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2E6B4E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-semibold text-[#242122] ${
                          task.completed ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{task.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-stone-600 shrink-0">
                    {task.timeString}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Afternoon section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B25742]">
                Afternoon
              </span>
              <div className="h-px flex-1 bg-[#F0E6DE]" />
            </div>
            <div className="space-y-2.5">
              {afternoonTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#FAF6F2] border-[#EADACD] opacity-80'
                      : 'bg-white border-[#EFE7DE] hover:border-[#DECBC2] shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-stone-400 focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2E6B4E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-semibold text-[#242122] ${
                          task.completed ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{task.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-stone-600 shrink-0">
                    {task.timeString}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evening section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-900">
                Evening
              </span>
              <div className="h-px flex-1 bg-[#F0E6DE]" />
            </div>
            <div className="space-y-2.5">
              {eveningTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#FAF6F2] border-[#EADACD] opacity-80'
                      : 'bg-white border-[#EFE7DE] hover:border-[#DECBC2] shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 text-stone-400 focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#2E6B4E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-semibold text-[#242122] ${
                          task.completed ? 'line-through text-stone-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{task.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-stone-600 shrink-0">
                    {task.timeString}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
