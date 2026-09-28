import React, { useState } from 'react';
import { AIInsight, ScreenType } from '../../types';
import { ConfidenceBadge } from '../Common/ConfidenceBadge';
import { EscalationNotice } from '../Common/EscalationNotice';
import { SourceCitation } from '../Common/SourceCitation';
import {
  Brain,
  Sparkles,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  PhoneCall
} from 'lucide-react';

interface InsightsScreenProps {
  insights: AIInsight[];
  onNavigate: (screen: ScreenType) => void;
  onOpenAppointments: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  insights,
  onNavigate,
  onOpenAppointments,
}) => {
  const [filter, setFilter] = useState<'all' | 'maternal' | 'vitals' | 'escalated'>('all');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);

  const filteredInsights = insights.filter((ins) => {
    if (filter === 'all') return true;
    if (filter === 'escalated') return !!ins.escalated;
    return ins.category === filter;
  });

  return (
    <div className="space-y-7 pb-12 max-w-4xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C3A27] px-3 py-1 rounded-full bg-[#F5ECE8] mb-2">
          <Brain className="w-3.5 h-3.5 text-[#B25742]" />
          <span>Intelligent Care Pattern Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
          Your AI Health Insights
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          Evidence-based pattern synthesis correlating your daily logs, lab values, and gestational stage.
        </p>
      </div>

      {/* Filter Tabs (Interactive buttons) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF6F2] rounded-2xl border border-[#EFE7DE] overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            filter === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All Insights ({insights.length})
        </button>
        <button
          onClick={() => setFilter('maternal')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            filter === 'maternal'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Maternal & Physical
        </button>
        <button
          onClick={() => setFilter('vitals')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            filter === 'vitals'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Lab & Vitals
        </button>
        <button
          onClick={() => setFilter('escalated')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer whitespace-nowrap ${
            filter === 'escalated'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Clinical Review Notes
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-5">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-4 hover:border-[#DECBC2] transition"
          >
            {/* Header: Title and Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#F0E6DE]">
              <div className="space-y-1">
                <span className="text-[11px] text-stone-600 font-mono tabular-nums">
                  {insight.timestamp}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#242122]">
                  {insight.title}
                </h3>
              </div>
              <div className="shrink-0">
                <ConfidenceBadge level={insight.confidence} />
              </div>
            </div>

            {/* Pattern noticed */}
            <div>
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Pattern Noticed
              </h4>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                {insight.patternNoticed}
              </p>
            </div>

            {/* Why this insight? */}
            <div className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs space-y-1">
              <span className="font-semibold text-stone-800 block">
                Why this insight?
              </span>
              <p className="text-stone-600 leading-relaxed">
                {insight.whyThisInsight}
              </p>
            </div>

            {/* What you can do */}
            <div>
              <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                What You Can Do (Safe Next Steps)
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {insight.whatYouCanDo}
              </p>
            </div>

            {/* When to seek professional care (Escalation) */}
            <EscalationNotice
              message={insight.whenToSeekCare}
              onContactDoctor={onOpenAppointments}
              isEmergencyAlert={!!insight.escalated}
            />

            {/* Bottom: Medical sources */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F0E6DE]">
              <SourceCitation sources={insight.medicalSources} />

              <button
                onClick={() => onNavigate('appointments')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C3A27] hover:underline self-start sm:self-auto cursor-pointer"
              >
                <span>Add to doctor check-in notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grounding and Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-semibold text-stone-800 mb-0.5">Clinical Transparency Notice</p>
          <p>
            MomCare AI insights are generated by analyzing pattern shifts against peer-reviewed obstetric literature (ACOG, WHO, NICE). Insights are for maternal education and do not establish a clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};
