import React, { useState, useEffect } from 'react';
import { BabyCareData, ScreenType, MotherRecord, UserProfile, SymptomLog, CareTask } from '../../types';
import { getFetalDevelopmentForWeek } from '../../data/fetalDevelopment';
import { generateMaternalHealthAssessment, MaternalHealthAssessment } from '../../services/aiService';
import {
  Baby,
  Sparkles,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowRight,
  Info,
  Edit3,
  Activity,
  Heart,
  Brain,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';

interface BabyCareScreenProps {
  babyData: BabyCareData;
  pregnancyWeek?: number;
  mother?: MotherRecord | null;
  user?: UserProfile;
  symptoms?: SymptomLog[];
  careTasks?: CareTask[];
  onNavigate: (screen: ScreenType) => void;
  onPrefillChat: (query: string) => void;
  onOpenEditBabyModal?: () => void;
}

export const BabyCareScreen: React.FC<BabyCareScreenProps> = ({
  babyData,
  pregnancyWeek = 16,
  mother,
  user,
  symptoms = [],
  careTasks = [],
  onNavigate,
  onPrefillChat,
  onOpenEditBabyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'ai-analysis' | 'growth' | 'vaccines' | 'milestones'>('today');
  const [vaccineFilter, setVaccineFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // AI & ML Assessment State
  const [assessment, setAssessment] = useState<MaternalHealthAssessment | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Kick Counter State (Active for Week >= 20)
  const [kickCount, setKickCount] = useState(0);
  const [kickTimerMinutes, setKickTimerMinutes] = useState(0);
  const [isKickTimerRunning, setIsKickTimerRunning] = useState(false);

  const stage = getFetalDevelopmentForWeek(pregnancyWeek);

  // Load AI Maternal-Fetal Analysis
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAi(true);

    const motherName = mother?.name || user?.name || 'Mother';
    const age = mother?.age || user?.age || 28;
    const pregNum = mother?.pregnancy_number || (user?.pregnancyType === 'First pregnancy' ? 1 : 2);
    const babyName = babyData.profile.name;
    const completedCount = careTasks.filter((t) => t.completed).length;

    generateMaternalHealthAssessment({
      motherName,
      pregnancyWeek,
      age,
      pregnancyNumber: pregNum,
      babyName,
      recentSymptoms: symptoms,
      completedTasksCount: completedCount,
      totalTasksCount: careTasks.length || 6,
    }).then((res) => {
      if (isMounted) {
        setAssessment(res);
        setIsLoadingAi(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pregnancyWeek, mother?.name, babyData.profile.name, symptoms.length, careTasks]);

  // Kick Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isKickTimerRunning) {
      interval = setInterval(() => {
        setKickTimerMinutes((prev) => prev + 1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isKickTimerRunning]);

  const filteredVaccines = babyData.vaccinations.filter((v) => {
    if (vaccineFilter === 'all') return true;
    return v.status === vaccineFilter;
  });

  const genderLabel =
    babyData.profile.gender === 'girl'
      ? '🎀 Baby Girl'
      : babyData.profile.gender === 'boy'
      ? '💙 Baby Boy'
      : '✨ Surprise';

  return (
    <div className="space-y-7 pb-12 max-w-4xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
            Baby Care & Fetal Journey
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Personalized developmental tracking for {babyData.profile.name} · Gestational Week {stage.week}
          </p>
        </div>

        {onOpenEditBabyModal && (
          <button
            type="button"
            onClick={onOpenEditBabyModal}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[#DECBC2] bg-[#FAF8F5] hover:bg-[#F5ECE8] text-[#8C3A27] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Baby Details</span>
          </button>
        )}
      </div>

      {/* Baby Profile Hero Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#EFE7DE] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-4 rounded-2xl overflow-hidden aspect-[4/3] border border-[#EFE7DE] bg-[#FAF8F5] relative group">
            <img
              src={stage.imageSrc || '/src/assets/images/baby_gentle_moment_1790403319489.jpg'}
              alt={`Fetal development week ${stage.week}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Week {stage.week} Illustration
            </div>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C3A27] bg-[#F5ECE8] px-2.5 py-0.5 rounded-full">
                  Antenatal Baby Journey · Week {stage.week}
                </span>
                <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                  {genderLabel}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-stone-500 block">Estimated Arrival</span>
                <span className="text-xs font-semibold text-stone-800">
                  {babyData.profile.dobOrDue}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-[#242122]">
                  {babyData.profile.name}
                </h2>
                {onOpenEditBabyModal && (
                  <button
                    type="button"
                    onClick={onOpenEditBabyModal}
                    className="p-1 text-stone-400 hover:text-[#8C3A27] transition cursor-pointer"
                    title="Edit baby name or nickname"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {babyData.profile.ageFormatted}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              At Week {stage.week}, your baby measures approximately{' '}
              <strong className="text-stone-900 font-semibold">{stage.lengthCm.toFixed(1)} cm</strong> and weighs around{' '}
              <strong className="text-stone-900 font-semibold">
                {stage.weightG >= 1000
                  ? (stage.weightG / 1000).toFixed(1) + ' kg'
                  : Math.round(stage.weightG) + ' g'}
              </strong>{' '}
              ({stage.fruitComparison}). {stage.summary}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-center">
                <span className="text-[10px] text-stone-500 block">Size Analogy</span>
                <span className="font-semibold text-stone-800 truncate block text-[11px]">
                  {stage.fruitComparison.split('(')[0]}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-center">
                <span className="text-[10px] text-stone-500 block">Est. Length</span>
                <span className="font-semibold text-stone-800 block text-[11px]">
                  ~{stage.lengthCm.toFixed(1)} cm
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-center">
                <span className="text-[10px] text-stone-500 block">Est. Weight</span>
                <span className="font-semibold text-stone-800 block text-[11px]">
                  ~{stage.weightG >= 1000 ? (stage.weightG / 1000).toFixed(1) + ' kg' : Math.round(stage.weightG) + ' g'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onPrefillChat(
                    `How is my baby (${babyData.profile.name}) developing at Week ${stage.week}? What should I expect this week?`
                  );
                  onNavigate('chat');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Ask MomCare AI About {babyData.profile.name}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai-analysis')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F5ECE8] text-[#8C3A27] hover:bg-[#EEDFD9] border border-[#EADACD] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>View AI-Trained Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF6F2] rounded-2xl border border-[#EFE7DE] overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'today'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Today's Rhythm
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai-analysis')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'ai-analysis'
              ? 'bg-[#8C3A27] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Maternal-Fetal Analysis</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('growth')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'growth'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Fetal Growth Curve
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('vaccines')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'vaccines'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Immunization Schedule
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'milestones'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Milestones & Kicks
        </button>
      </div>

      {/* TAB 1: TODAY'S RHYTHM */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {/* Antenatal Nutrition & Nourishment */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
            <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center justify-between">
              <span>Maternal-Fetal Nutrient Flow</span>
              <span className="text-xs text-stone-500 font-mono">Week {stage.week} Delivery</span>
            </h3>
            <div className="space-y-2.5">
              {babyData.todayFeedings.map((f) => (
                <div key={f.id} className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs">
                  <div className="flex items-center justify-between font-semibold text-stone-800 mb-0.5">
                    <span>{f.type}</span>
                    <span className="text-[11px] font-mono tabular-nums text-stone-600">{f.time}</span>
                  </div>
                  <p className="text-stone-700 font-medium">{f.amount}</p>
                  <p className="text-[11px] text-stone-500 mt-1">{f.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep & Rest Cycles */}
          <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DE] shadow-xs">
            <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center justify-between">
              <span>Rest & Placental Perfusion Cycles</span>
              <span className="text-xs text-stone-500 font-mono">Circadian Rhythm</span>
            </h3>
            <div className="space-y-2.5">
              {babyData.todaySleep.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs">
                  <div className="flex items-center justify-between font-semibold text-stone-800 mb-0.5">
                    <span>Rest Window</span>
                    <span className="text-[11px] font-mono tabular-nums text-stone-600">{s.time}</span>
                  </div>
                  <p className="text-stone-700 font-medium">Duration: {s.duration}</p>
                  <p className="text-[11px] text-stone-500 mt-1">{s.quality}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI & ML MATERNAL-FETAL ANALYSIS (NEW - POWERED BY MOTHER'S DATA) */}
      {activeTab === 'ai-analysis' && (
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E6DE]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C3A27] px-2.5 py-0.5 rounded-full bg-[#F5ECE8] mb-1">
                <Brain className="w-3.5 h-3.5 text-[#B25742]" />
                <span>AI & ML Clinical Cross-Synthesis</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#242122]">
                How Mother's Health is Powering {babyData.profile.name}
              </h3>
              <p className="text-xs text-stone-500">
                Trained on ACOG & WHO perinatal standards, synthesized from your week, vitals & care tasks
              </p>
            </div>

            {assessment && (
              <div className="text-right">
                <span className="text-[10px] text-stone-500 block uppercase tracking-wider">
                  Maternal-Fetal Alignment
                </span>
                <span className="text-xl font-bold font-serif text-emerald-800">
                  {assessment.wellnessScore} / 100
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block mt-0.5">
                  {assessment.scoreGrade}
                </span>
              </div>
            )}
          </div>

          {isLoadingAi ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#8C3A27] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-stone-600 font-medium">
                Analyzing your gestational week, symptoms, and baby development…
              </p>
            </div>
          ) : assessment ? (
            <div className="space-y-4 text-xs">
              {/* Clinical Summary */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFE7DE] space-y-1.5">
                <span className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#B25742]" />
                  <span>Clinical Synthesis for Week {stage.week}</span>
                </span>
                <p className="text-stone-700 leading-relaxed font-sans">{assessment.clinicalSummary}</p>
              </div>

              {/* Fetal Impact */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5">
                <span className="font-semibold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-700" />
                  <span>Direct Fetal Benefit for {babyData.profile.name}</span>
                </span>
                <p className="text-emerald-900 leading-relaxed font-sans">{assessment.fetalImpact}</p>
              </div>

              {/* Nutrition Advice */}
              <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-1.5">
                <span className="font-semibold text-stone-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Targeted Maternal Nutrition</span>
                </span>
                <p className="text-stone-700 leading-relaxed font-sans">{assessment.nutritionAdvice}</p>
              </div>

              {/* Priorities & Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-[#EFE7DE] space-y-2">
                  <span className="font-semibold text-stone-900 block text-xs">
                    Today's Priority Care Directives
                  </span>
                  <ul className="space-y-1.5 text-stone-600 text-[11px]">
                    {assessment.lifestylePriorities.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#EFE7DE] space-y-2">
                  <span className="font-semibold text-stone-900 block text-xs">
                    Questions for Your Next OB/GYN Visit
                  </span>
                  <ul className="space-y-1.5 text-stone-600 text-[11px]">
                    {assessment.doctorChecklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#F5ECE8] text-[#8C3A27] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: GROWTH CURVE */}
      {activeTab === 'growth' && (
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DE]">
            <div>
              <h3 className="text-base font-serif font-bold text-[#242122]">
                Fetal Biometry & Growth History for {babyData.profile.name}
              </h3>
              <p className="text-xs text-stone-500">WHO & SMFM gestational growth velocity</p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>50th Percentile (Ideal Standard)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF6F2] text-stone-700 font-semibold border-b border-[#EFE7DE]">
                <tr>
                  <th className="py-2.5 px-3">Gestational Week</th>
                  <th className="py-2.5 px-3">Estimated Weight</th>
                  <th className="py-2.5 px-3">Length (Crown-Heel)</th>
                  <th className="py-2.5 px-3">Head Circ.</th>
                  <th className="py-2.5 px-3">Growth Curve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6DE] text-stone-800 font-mono tabular-nums">
                {babyData.growthHistory.map((g, i) => (
                  <tr key={i} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-3 font-sans font-semibold">Week {g.month}</td>
                    <td className="py-3 px-3">{(g.weightKg * 1000).toFixed(0)} g</td>
                    <td className="py-3 px-3">{g.heightCm.toFixed(1)} cm</td>
                    <td className="py-3 px-3">{g.headCircumferenceCm.toFixed(1)} cm</td>
                    <td className="py-3 px-3 font-sans font-medium text-emerald-800">
                      {g.percentileWeight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-stone-600">
            Biometrics adapted dynamically to {mother?.name || 'Mother'}'s current week {stage.week}.
          </p>
        </div>
      )}

      {/* TAB 4: VACCINES */}
      {activeTab === 'vaccines' && (
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E6DE]">
            <div>
              <h3 className="text-base font-serif font-bold text-[#242122]">
                Vaccination & Immunization Schedule
              </h3>
              <p className="text-xs text-stone-500">Maternal antibody transfer and newborn protection</p>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF6F2] p-1 rounded-xl border border-[#EFE7DE] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setVaccineFilter('all')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                  vaccineFilter === 'all' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setVaccineFilter('upcoming')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                  vaccineFilter === 'upcoming' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setVaccineFilter('completed')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                  vaccineFilter === 'completed' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-600'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredVaccines.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-white border border-[#EFE7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-stone-900">{v.name}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {v.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">{v.description}</p>
                  <p className="text-[11px] text-stone-600">
                    Recommended target: {v.targetAge} · {v.dueDate}
                  </p>
                </div>

                <div className="shrink-0">
                  {v.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Documented</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MILESTONES & KICKS TRACKER */}
      {activeTab === 'milestones' && (
        <div className="space-y-5 animate-fade-in">
          {/* Kick Counter Feature (Active when week >= 20) */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E6DE]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#242122] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#B25742]" />
                  <span>Fetal Kick & Movement Counter</span>
                </h3>
                <p className="text-xs text-stone-500">
                  {stage.week >= 20
                    ? `Count baby ${babyData.profile.name}'s kicks. Goal: 10 discrete movements within 2 hours.`
                    : `Kick counting standard begins around Week 24–28 as fetal movements strengthen.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsKickTimerRunning(!isKickTimerRunning)}
                  className="px-3 py-1.5 rounded-xl border border-[#DECBC2] text-xs font-semibold text-stone-700 hover:bg-[#FAF6F2] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3 h-3 text-[#B25742]" />
                  <span>{isKickTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKickCount(0);
                    setKickTimerMinutes(0);
                    setIsKickTimerRunning(false);
                  }}
                  className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 transition cursor-pointer"
                  title="Reset Counter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                    Kicks Recorded
                  </span>
                  <span className="text-3xl font-serif font-bold text-[#8C3A27]">
                    {kickCount}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Elapsed time: {kickTimerMinutes} min
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setKickCount((prev) => prev + 1);
                    if (!isKickTimerRunning) setIsKickTimerRunning(true);
                  }}
                  className="w-14 h-14 rounded-2xl bg-[#8C3A27] text-white flex flex-col items-center justify-center hover:bg-[#A3432D] active:scale-95 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-bold">+1 Kick</span>
                </button>
              </div>

              <div className="text-xs text-stone-600 space-y-1.5 leading-relaxed font-sans">
                <p className="font-semibold text-stone-800">Clinical Guideline (ACOG & RCOG):</p>
                <p>
                  Rest on your left side after a meal or glass of cold water. Notice distinct rolls, kicks, or swishes. If you feel fewer than 10 kicks in 2 hours during your baby's active window, contact your maternity triage line.
                </p>
              </div>
            </div>
          </div>

          {/* Developmental Milestones */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#EFE7DE] shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#F0E6DE]">
              <h3 className="text-base font-serif font-bold text-[#242122]">
                Fetal Neurodevelopmental Milestones · Week {stage.week}
              </h3>
              <p className="text-xs text-stone-500">Key physiological capabilities developing this week</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {babyData.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-white border border-[#EFE7DE] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600">
                        {m.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          m.achieved
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {m.achieved ? 'Active Now' : 'Upcoming'}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-900 mb-1">{m.title}</h4>
                    <p className="text-xs text-stone-600 leading-snug">{m.description}</p>
                  </div>
                  <span className="text-[11px] text-stone-600 mt-3 pt-2 border-t border-[#F0E6DE]">
                    Target milestone: {m.targetMonth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
