import React, { useState } from 'react';
import { UserProfile, SymptomLog, ScreenType } from '../../types';
import { getFetalDevelopmentForWeek } from '../../data/fetalDevelopment';
import {
  Heart,
  Droplets,
  Moon,
  Pill,
  Apple,
  Sparkles,
  ArrowRight,
  Plus,
  AlertCircle,
  Calendar,
  CheckCircle,
  HelpCircle,
  Activity
} from 'lucide-react';

interface MomCareScreenProps {
  user: UserProfile;
  symptoms: SymptomLog[];
  onOpenLogSymptom: () => void;
  onNavigate: (screen: ScreenType) => void;
  onPrefillChat: (query: string) => void;
}

export const MomCareScreen: React.FC<MomCareScreenProps> = ({
  user,
  symptoms,
  onOpenLogSymptom,
  onNavigate,
  onPrefillChat,
}) => {
  const [hydrationLiters, setHydrationLiters] = useState(1.75);
  const targetHydration = 2.5;

  const handleAddWater = () => {
    if (hydrationLiters < 3.5) {
      setHydrationLiters(Number((hydrationLiters + 0.25).toFixed(2)));
    }
  };

  const stage = getFetalDevelopmentForWeek(user.pregnancyWeek);

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
          Mom Care
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
          Personalized support for your pregnancy journey · Week {user.pregnancyWeek} ({stage.trimester})
        </p>
      </div>

      {/* Contextual AI Support Banner */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EADACD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C3A27]">
            <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
            <span>AI Care Context</span>
          </div>
          <h3 className="text-base font-serif font-bold text-[#242122]">
            Contextual {stage.trimester} Support
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            MomCare AI continuously aligns your daily logs with clinical guidelines from ACOG and NICE. Have questions about fetal movements, nutrition, or blood volume shifts?
          </p>
        </div>

        <button
          onClick={() => {
            onPrefillChat(`What physiological changes are most important to watch for in Week ${user.pregnancyWeek}?`);
            onNavigate('chat');
          }}
          className="px-5 py-3 rounded-2xl bg-[#2B2829] text-white font-semibold text-xs hover:bg-[#3E3839] active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Ask MomCare AI</span>
        </button>
      </div>

      {/* SECTION: TODAY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#242122]">Today</h2>
          <span className="text-xs text-stone-600">Daily health & biological rhythms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Symptoms Card */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">Logged Symptoms</h3>
                </div>
                <button
                  onClick={onOpenLogSymptom}
                  className="text-xs font-semibold text-[#8C3A27] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New</span>
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {symptoms.slice(0, 3).map((sym) => (
                  <div
                    key={sym.id}
                    className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-stone-800">{sym.symptomName}</p>
                      <p className="text-[11px] text-stone-500">{sym.notes}</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        sym.severity === 'mild'
                          ? 'bg-emerald-50 text-emerald-800'
                          : sym.severity === 'moderate'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {sym.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-stone-600 mt-3 pt-2 border-t border-[#F0E6DE]">
              3 entries logged recently · Pattern correlated with hydration
            </p>
          </div>

          {/* 2. Hydration Card */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EBF4FA] text-[#24638A] flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">Hydration Balance</h3>
                </div>
                <button
                  onClick={handleAddWater}
                  className="text-xs font-semibold text-[#24638A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+250 ml</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                    {hydrationLiters} L
                  </span>
                  <span className="text-xs text-stone-500">Target: {targetHydration} L / day</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EFE7DE] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3D85B0] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min((hydrationLiters / targetHydration) * 100, 100)}%` }}
                  />
                </div>

                <p className="text-xs text-stone-600 leading-snug">
                  Staying hydrated expands maternal plasma safely, supports amniotic fluid, and relieves minor extremity swelling.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 mt-3 pt-2 border-t border-[#F0E6DE]">
              Tip: Add a squeeze of lemon or cucumber for gentle electrolytes.
            </p>
          </div>

          {/* 3. Prescribed Supplements */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0E6DE]">
              <div className="w-7 h-7 rounded-lg bg-[#FDF0E6] text-[#B85D1B] flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Prescribed Supplements</h3>
            </div>

            <div className="mt-3 space-y-2.5">
              {user.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-[#EFE7DE] flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-stone-800">{med}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-stone-600 mt-3">
              Take iron with vitamin C; avoid concurrent calcium or black tea for 2 hours.
            </p>
          </div>

          {/* 4. Rest & Recovery */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0E6DE]">
              <div className="w-7 h-7 rounded-lg bg-[#F5EFF8] text-[#7A408C] flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Rest & Wellbeing</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs text-stone-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE]">
                <p className="font-semibold text-stone-800 mb-0.5">Left-Lateral Sleep Comfort</p>
                <p className="text-[11px] text-stone-600">
                  Resting on your left side optimizes blood flow from the inferior vena cava to the placenta and eases kidney filtration.
                </p>
              </div>

              <div className="flex items-center justify-between text-stone-600 pt-1">
                <span>Yesterday's total sleep:</span>
                <span className="font-semibold text-stone-800">8 hrs 00 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: THIS WEEK */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#242122]">This Week · Week {stage.week}</h2>
          <p className="text-xs text-stone-500">Antenatal developmental markers and provider checklist ({stage.trimester})</p>
        </div>

        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-6">
          {/* What you may experience */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Key Developmental Milestones & Maternal Signals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stage.keyHighlights.map((highlight, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE]">
                  <p className="text-xs font-semibold text-stone-900 mb-1">{highlight}</p>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {idx === 0
                      ? stage.summary
                      : idx === 1
                      ? stage.fruitComparison
                      : stage.maternalTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Questions to Ask */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Recommended Questions for Your Healthcare Provider
              </h3>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-[#8C3A27] hover:underline"
              >
                View all in Appointments →
              </button>
            </div>
            <ul className="space-y-2 text-xs text-stone-800">
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-[#EFE7DE]">
                <span className="font-serif font-bold text-[#8C3A27] mt-0.5">1.</span>
                <span>Are my mild late-afternoon swollen ankles within expected normal limits?</span>
              </li>
              <li className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-[#EFE7DE]">
                <span className="font-serif font-bold text-[#8C3A27] mt-0.5">2.</span>
                <span>Review ferritin level (18 ng/mL) and confirm the best schedule for my iron supplement.</span>
              </li>
            </ul>
          </div>

          {/* Upcoming visit card */}
          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EADACD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#8C3A27] flex items-center justify-center border border-[#EFE7DE]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">Next Obstetric Checkup</p>
                <p className="text-[11px] text-stone-600">Friday, Oct 4, 2026 · Dr. Maya Sharma</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#2B2829] text-white hover:bg-[#3E3839] transition self-start sm:self-auto cursor-pointer"
            >
              Prepare for Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
