import React, { useState, useEffect } from 'react';
import { UserProfile, CareTask, ScreenType, SymptomLog } from '../../types';
import { getFetalDevelopmentForWeek } from '../../data/fetalDevelopment';
import {
  CheckCircle2,
  Circle,
  Droplets,
  Pill,
  Apple,
  Moon,
  Footprints,
  Heart,
  Sparkles,
  Plus,
  RefreshCw,
  Timer,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Award,
  ShieldCheck,
  Calendar,
  Activity
} from 'lucide-react';

interface DailyCareTrackerScreenProps {
  user: UserProfile;
  careTasks: CareTask[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenLogSymptom: () => void;
  onPrefillChat: (query: string) => void;
  recentSymptoms?: SymptomLog[];
}

export const DailyCareTrackerScreen: React.FC<DailyCareTrackerScreenProps> = ({
  user,
  careTasks,
  onToggleTask,
  onNavigate,
  onOpenLogSymptom,
  onPrefillChat,
  recentSymptoms = [],
}) => {
  const stage = getFetalDevelopmentForWeek(user.pregnancyWeek);

  // 1. Water Intake State
  const [hydrationLiters, setHydrationLiters] = useState(1.75);
  const targetHydration = 2.5;

  const handleAddWater = (amount = 0.25) => {
    setHydrationLiters((prev) => Number(Math.min(4.0, prev + amount).toFixed(2)));
  };

  // 2. Nutrition Log State
  const [loggedMeals, setLoggedMeals] = useState<string[]>([
    'Steamed spinach with whole grain toast & lemon (Iron & Folate)',
    'Lentil dal soup with brown rice & cucumber salad (Protein & Hydration)'
  ]);
  const [newMealInput, setNewMealInput] = useState('');
  const [showAddMeal, setShowAddMeal] = useState(false);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealInput.trim()) return;
    setLoggedMeals([...loggedMeals, newMealInput.trim()]);
    setNewMealInput('');
    setShowAddMeal(false);
  };

  // 3. Fetal Movement & Kick Counter State
  const [kickCount, setKickCount] = useState<number>(7);
  const [isCountingKicks, setIsCountingKicks] = useState(false);
  const [kickTimerSeconds, setKickTimerSeconds] = useState(0);
  const [kickHistory, setKickHistory] = useState<{ time: string; count: number }[]>([
    { time: '09:14 AM', count: 1 },
    { time: '09:22 AM', count: 2 },
    { time: '09:35 AM', count: 3 },
    { time: '09:41 AM', count: 4 },
    { time: '10:02 AM', count: 5 },
    { time: '10:15 AM', count: 6 },
    { time: '10:28 AM', count: 7 },
  ]);

  // Timer effect for kick counting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCountingKicks) {
      interval = setInterval(() => {
        setKickTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCountingKicks]);

  const handleRecordKick = () => {
    if (!isCountingKicks) {
      setIsCountingKicks(true);
    }
    const newCount = kickCount + 1;
    setKickCount(newCount);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setKickHistory((prev) => [{ time: nowStr, count: newCount }, ...prev]);
  };

  const handleResetKicks = () => {
    setIsCountingKicks(false);
    setKickTimerSeconds(0);
    setKickCount(0);
    setKickHistory([]);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 4. Care Tasks Progress
  const completedTasks = careTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasks / Math.max(careTasks.length, 1)) * 100);

  // Group care tasks
  const morningTasks = careTasks.filter((t) => t.timeOfDay === 'morning');
  const afternoonTasks = careTasks.filter((t) => t.timeOfDay === 'afternoon');
  const eveningTasks = careTasks.filter((t) => t.timeOfDay === 'evening');

  return (
    <div className="space-y-7 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
            Daily Care Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Essential routines, biological rhythms & fetal movement · Week {user.pregnancyWeek} ({stage.trimester})
          </p>
        </div>

        {/* Positive Reinforcement Badge */}
        <div className="flex items-center gap-3 bg-[#FFFDF9] border border-[#EFE7DE] rounded-2xl px-4 py-2 self-start sm:self-auto shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center font-serif font-bold text-sm border border-[#EADACD]">
            <Award className="w-5 h-5 text-[#B25742]" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
              Daily Wellness
            </span>
            <span className="text-xs font-bold text-[#8C3A27]">
              {completedTasks} of {careTasks.length} Completed ({progressPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Positive Reinforcement Banner */}
      <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF6F2] to-[#FFFDF9] rounded-3xl p-5 border border-[#EADACD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C3A27]">
            <Heart className="w-3.5 h-3.5 text-[#B25742] fill-[#B25742]/20" />
            <span>Gentle Affirmation & Care Rhythm</span>
          </div>
          <p className="text-sm font-serif font-bold text-[#242122]">
            {progressPercent >= 75
              ? "You're taking extraordinary care of yourself and your little one today! 🌸"
              : progressPercent >= 40
              ? 'Great steady rhythm today. Remember to take small hydration and rest pauses. ✨'
              : 'Take your time today. Listen to your body and embrace gentle pacing. 🌿'}
          </p>
          <p className="text-xs text-stone-600">
            Staying consistent with hydration and vitamins helps sustain healthy amniotic fluid and iron delivery.
          </p>
        </div>

        <button
          onClick={() => {
            onPrefillChat("Review my daily care habits and give me gentle suggestions for optimal nutrition and rest today.");
            onNavigate('chat');
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#2B2829] text-white text-xs font-semibold hover:bg-[#3E3839] transition flex items-center justify-center gap-2 shrink-0 shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Ask AI Routine Tip</span>
        </button>
      </div>

      {/* Grid: Hydration + Fetal Kick Counter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. WATER INTAKE TRACKER */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EBF4FA] text-[#24638A] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Hydration Intake</h3>
                  <p className="text-[11px] text-stone-500">Target: {targetHydration} L / day</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddWater(0.25)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#EBF4FA] text-[#24638A] hover:bg-[#D8EBF7] transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+250 ml</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
                  {hydrationLiters} L
                </span>
                <span className="text-xs font-medium text-stone-600">
                  {Math.round((hydrationLiters / targetHydration) * 100)}% of goal
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#EFE7DE] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#3D85B0] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min((hydrationLiters / targetHydration) * 100, 100)}%` }}
                />
              </div>

              {/* Interactive Cups Indicator */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-500 font-medium block mb-1.5">
                  Cups logged (250 ml each):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const cupLiters = (idx + 1) * 0.25;
                    const isFilled = hydrationLiters >= cupLiters;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHydrationLiters(Number(cupLiters.toFixed(2)))}
                        className={`w-7 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition border cursor-pointer ${
                          isFilled
                            ? 'bg-[#3D85B0] text-white border-[#2A6C94]'
                            : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-400'
                        }`}
                        title={`${cupLiters} L`}
                      >
                        💧
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E6DE] text-[11px] text-stone-600 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>Adequate hydration eases maternal physiological swelling and supports healthy amniotic volume.</span>
          </div>
        </div>

        {/* 2. FETAL MOVEMENT & KICK COUNTER */}
        <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Fetal Kick Counter</h3>
                  <p className="text-[11px] text-stone-500">ACOG Guideline: 10 kicks in ≤ 2 hours</p>
                </div>
              </div>

              {isCountingKicks && (
                <div className="flex items-center gap-1 text-xs font-mono font-semibold text-[#8C3A27] bg-[#F5ECE8] px-2.5 py-1 rounded-lg">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTimer(kickTimerSeconds)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
                      {kickCount}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">/ 10 movements</span>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {kickCount >= 10
                      ? 'Milestone achieved for this session! 🎉'
                      : isCountingKicks
                      ? 'Session in progress… tap below on each flutter.'
                      : 'Sit comfortably or lie on left side to count.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRecordKick}
                    className="px-4 py-2.5 rounded-2xl bg-[#8C3A27] text-white text-xs font-bold hover:bg-[#742F1F] active:scale-95 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tap Kick</span>
                  </button>

                  {kickCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetKicks}
                      title="Reset session"
                      className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Recent Kick log timestamps */}
              {kickHistory.length > 0 && (
                <div className="bg-[#FAF6F2] rounded-2xl p-3 border border-[#EFE7DE]">
                  <span className="text-[11px] font-semibold text-stone-700 block mb-1.5">
                    Today's Recorded Movement Moments:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {kickHistory.slice(0, 8).map((k, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#EFE7DE] text-stone-700 font-mono"
                      >
                        Kick #{k.count} · {k.time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E6DE] text-[11px] text-stone-600 flex items-start gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span>Noticeable decrease in baby's habitual rhythm warrants clinical evaluation by your obstetric team.</span>
          </div>
        </div>
      </div>

      {/* SECTION: PRENATAL VITAMINS & MEDICATIONS */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDF0E6] text-[#B85D1B] flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Prenatal Vitamins & Prescribed Supplements</h3>
              <p className="text-[11px] text-stone-500">Track doses & optimal absorption timing</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#8C3A27] bg-[#F5ECE8] px-2.5 py-1 rounded-full">
            {user.medications.length} Prescribed Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {user.medications.map((med, idx) => {
            const isIron = med.toLowerCase().includes('iron');
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#EFE7DE] flex flex-col justify-between gap-2 shadow-2xs hover:border-[#DECBC2] transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-stone-900 leading-snug">{med}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="text-[11px] text-stone-500">
                  {isIron
                    ? 'Take with Vitamin C (OJ/lemon). Separate from tea & dairy by 2 hours.'
                    : 'Take with morning meal to reduce gastrointestinal sensitivity.'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: NUTRITION & BALANCED MEALS */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F0F8F1] text-[#2C7A39] flex items-center justify-center">
              <Apple className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Maternal Nutrition & Balanced Meals</h3>
              <p className="text-[11px] text-stone-500">Iron, folate, calcium, and complex fibers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMeal(!showAddMeal)}
            className="text-xs font-semibold text-[#2C7A39] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </button>
        </div>

        {showAddMeal && (
          <form onSubmit={handleAddMeal} className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EADACD] flex gap-2">
            <input
              type="text"
              placeholder="e.g. Oatmeal with chia seeds, banana, and almond milk"
              value={newMealInput}
              onChange={(e) => setNewMealInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none"
            />
            <button
              type="submit"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#2B2829] text-white hover:bg-[#3E3839] cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        <div className="space-y-2">
          {loggedMeals.map((meal, mIdx) => (
            <div
              key={mIdx}
              className="p-3 rounded-2xl bg-white border border-[#EFE7DE] flex items-center justify-between text-xs"
            >
              <span className="text-stone-800 font-medium">{meal}</span>
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                Nutrient Dense
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: TODAY'S TIMELINE CARE TASKS (FIRESTORE SYNCED) */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
          <div>
            <h3 className="text-base font-serif font-bold text-[#242122]">
              Today's Care Flow Timeline
            </h3>
            <p className="text-xs text-stone-500">
              Synchronized with Cloud Firestore
            </p>
          </div>
          <span className="text-xs font-semibold text-[#8C3A27]">
            {completedTasks} / {careTasks.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Morning */}
          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Morning
            </span>
            <div className="space-y-2">
              {morningTasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onToggleTask(t.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-xs flex items-start gap-2 cursor-pointer"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                  )}
                  <span className={t.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                    {t.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Afternoon */}
          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Afternoon
            </span>
            <div className="space-y-2">
              {afternoonTasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onToggleTask(t.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-xs flex items-start gap-2 cursor-pointer"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                  )}
                  <span className={t.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                    {t.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Evening */}
          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
              Evening
            </span>
            <div className="space-y-2">
              {eveningTasks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onToggleTask(t.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-xs flex items-start gap-2 cursor-pointer"
                >
                  {t.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                  )}
                  <span className={t.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                    {t.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick link to log symptoms */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">Feeling any new sensations or symptoms?</p>
            <p className="text-[11px] text-stone-500">Keep track of bodily changes for your next clinical appointment.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogSymptom}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#8C3A27] text-white hover:bg-[#742F1F] transition self-start sm:self-auto cursor-pointer"
        >
          Log Symptom
        </button>
      </div>
    </div>
  );
};
