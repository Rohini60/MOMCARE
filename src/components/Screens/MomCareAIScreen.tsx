import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, ProductRecommendation } from '../../types';
import { SourceCitation } from '../Common/SourceCitation';
import { EscalationNotice } from '../Common/EscalationNotice';
import {
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  FileText,
  Activity,
  Bot,
  ExternalLink,
  ShoppingBag,
  Info
} from 'lucide-react';

interface MomCareAIScreenProps {
  user: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  prefilledPrompt?: string;
  onClearPrefill?: () => void;
  onOpenAppointments: () => void;
}

const SUGGESTED_QUESTIONS = [
  'I am urinating frequently. What should I do?',
  'What should I discuss at my next appointment?',
  'Help me understand my blood test report.',
  'I noticed mild ankle swelling. What should I know?',
  'Explain Braxton Hicks in simple language.',
  "Help me organize today's care.",
];

export const MomCareAIScreen: React.FC<MomCareAIScreenProps> = ({
  user,
  messages,
  onSendMessage,
  prefilledPrompt,
  onClearPrefill,
  onOpenAppointments,
}) => {
  const [inputText, setInputText] = useState(prefilledPrompt || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefilledPrompt) {
      setInputText(prefilledPrompt);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestedClick = (q: string) => {
    onSendMessage(q);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] max-w-4xl mx-auto pb-4">
      {/* Top Clinical Context Banner */}
      <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#EFE7DE] shadow-xs mb-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-serif font-bold text-[#242122]">
                Ask MomCare AI
              </h2>
              <p className="text-[11px] text-stone-500">
                Pregnancy Week {user.pregnancyWeek} · Medical safety protocol & Cloud Firestore context active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-600 bg-[#FAF6F2] px-2.5 py-1 rounded-full self-start sm:self-auto border border-[#EFE7DE]">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
            <span>Non-diagnostic · Evidence-based ACOG & WHO standards</span>
          </div>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestedClick(q)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFFDF9] border border-[#EFE7DE] text-stone-700 hover:border-[#DECBC2] hover:bg-[#FAF6F2] transition cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 my-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-sm bg-[#2B2829] text-white p-4 shadow-xs">
                  <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  <span className="block text-[10px] text-stone-400 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          // MomCare AI Structured Response UI
          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-1 border border-[#EFE7DE]">
                M
              </div>

              <div className="max-w-[92%] sm:max-w-[85%] bg-[#FFFDF9] rounded-3xl rounded-tl-sm p-5 sm:p-6 border border-[#EFE7DE] shadow-xs space-y-4 text-xs sm:text-sm">
                {/* 1. Primary Answer */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#8C3A27] mb-1">
                    Guidance Summary
                  </h4>
                  <div className="text-stone-800 leading-relaxed space-y-2 whitespace-pre-line">
                    {msg.structuredData ? msg.structuredData.answer : msg.text}
                  </div>
                </div>

                {/* 2. Structured Follow-up Questions (Triage Assessment) */}
                {msg.structuredData?.followUpQuestions && msg.structuredData.followUpQuestions.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EADACD] space-y-2">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-[#B25742]" />
                      Clinical Triage Checklist (Tap to answer):
                    </span>
                    <div className="space-y-1.5">
                      {msg.structuredData.followUpQuestions.map((fq, fqIdx) => (
                        <button
                          key={fqIdx}
                          type="button"
                          onClick={() => onSendMessage(`In response to "${fq}": `)}
                          className="w-full text-left p-2 rounded-xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] text-[11px] text-stone-800 transition cursor-pointer flex items-center justify-between"
                        >
                          <span>{fq}</span>
                          <span className="text-[10px] text-[#8C3A27] font-semibold shrink-0 ml-2">Answer →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Optional Commercial Product Recommendations (If applicable) */}
                {msg.structuredData?.productRecommendations && msg.structuredData.productRecommendations.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#FDF8F3] border border-[#EADACD] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#8C3A27]" />
                        Optional Comfort Products
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        Commercial Option
                      </span>
                    </div>

                    <div className="space-y-2">
                      {msg.structuredData.productRecommendations.map((prod, pIdx) => (
                        <div key={pIdx} className="p-3 rounded-xl bg-white border border-[#EFE7DE] space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-stone-900 text-xs">{prod.name}</p>
                              <p className="text-[11px] text-stone-500">Manufacturer: {prod.manufacturer}</p>
                            </div>
                            <a
                              href={prod.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C3A27] hover:underline shrink-0"
                            >
                              <span>Official Site</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-[11px] text-stone-600 leading-snug">{prod.intendedUse}</p>
                          <p className="text-[10px] text-stone-500 italic pt-1 border-t border-stone-100">
                            {prod.clinicalReminder}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Why this information is relevant */}
                {msg.structuredData?.whyRelevant && (
                  <div className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] text-xs space-y-1">
                    <span className="font-semibold text-stone-800 block">
                      Why this information is relevant:
                    </span>
                    <p className="text-stone-600 leading-snug">
                      {msg.structuredData.whyRelevant}
                    </p>
                  </div>
                )}

                {/* 5. When to contact a healthcare professional */}
                {msg.structuredData?.whenToContactDoctor && (
                  <EscalationNotice
                    message={msg.structuredData.whenToContactDoctor}
                    onContactDoctor={onOpenAppointments}
                  />
                )}

                {/* 6. Sources */}
                {msg.structuredData?.sources && (
                  <div className="pt-2 border-t border-[#F0E6DE]">
                    <SourceCitation sources={msg.structuredData.sources} />
                  </div>
                )}

                <span className="block text-[10px] text-stone-400 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-[#FFFDF9] rounded-2xl border border-[#E3D5C8] focus-within:border-[#8C3A27] focus-within:ring-1 focus-within:ring-[#8C3A27] shadow-sm overflow-hidden"
        >
          <input
            type="text"
            placeholder="Ask about frequent urination, symptoms, lab reports, or pregnancy changes..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-transparent focus:outline-none placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`mr-2 p-2 rounded-xl transition ${
              inputText.trim()
                ? 'bg-[#2B2829] text-white hover:bg-[#3E3839] cursor-pointer'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-600 text-center mt-1.5">
          MomCare AI is designed for supportive health guidance and does not provide formal medical diagnoses or prescribe medications.
        </p>
      </div>
    </div>
  );
};

