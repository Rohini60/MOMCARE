import React, { useState } from 'react';
import { X, Sparkles, Check, Copy, Calendar, Plus } from 'lucide-react';
import { Appointment } from '../../types';

interface PrepareAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onSaveQuestions: (appointmentId: string, questions: string[]) => void;
}

export const PrepareAppointmentModal: React.FC<PrepareAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSaveQuestions,
}) => {
  const [questions, setQuestions] = useState<string[]>(appointment.questionsToAsk);
  const [newQuestion, setNewQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAiRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = [
        'Is my late-afternoon mild ankle edema consistent with normal second-trimester vascular expansion?',
        'Given my ferritin level of 18 ng/mL, should I continue 28mg iron bisglycinate or adjust dosing?',
        'Can you check fundal height measurement to ensure fetal growth trajectory remains on target?',
        'Are there specific signs that differentiate normal Braxton Hicks from preterm uterine irritation?',
        'Do you recommend administering the maternal Tdap vaccine at 28 weeks?'
      ];
      setQuestions(generated);
      setIsGenerating(false);
    }, 700);
  };

  const handleCopyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndClose = () => {
    onSaveQuestions(appointment.id, questions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EFE7DE] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DE] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#B25742]" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#242122]">
                Prepare for Your Appointment
              </h3>
              <p className="text-xs text-stone-500">
                {appointment.doctorName} · {appointment.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="p-3.5 rounded-2xl bg-[#FDF8F3] border border-[#EADACD] text-xs text-stone-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
                MomCare AI Personalized Synthesis
              </span>
              <button
                type="button"
                onClick={handleAiRefresh}
                disabled={isGenerating}
                className="text-[11px] font-semibold text-[#8C3A27] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {isGenerating ? 'Synthesizing...' : 'Regenerate from logs'}
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-600">
              Questions synthesized from your Week 24 gestational timeline, your recent lab report (Ferritin: 18 ng/mL), and logged ankle swelling episodes.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Questions to ask ({questions.length}):
              </label>
              <button
                type="button"
                onClick={handleCopyAll}
                className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to clipboard' : 'Copy all'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-[#EFE7DE] text-xs text-stone-800"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-serif font-bold text-stone-400 mt-0.5">{index + 1}.</span>
                    <span className="leading-snug">{q}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-stone-400 hover:text-rose-500 transition p-1"
                    title="Remove question"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom question */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add your own question for the doctor..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddQuestion();
                }
              }}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#F5ECE8] text-[#8C3A27] hover:bg-[#EEDFD9] flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F0E6DE] shrink-0 mt-3">
          <span className="text-[11px] text-stone-600">
            Saved to this visit's notes
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] active:scale-[0.98] transition shadow-xs"
            >
              Save to Visit Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
