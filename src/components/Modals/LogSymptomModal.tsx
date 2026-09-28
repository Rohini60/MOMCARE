import React, { useState } from 'react';
import { X, Check, Activity, AlertCircle } from 'lucide-react';
import { SymptomLog } from '../../types';

interface LogSymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSymptom: (symptom: SymptomLog) => void;
}

const COMMON_SYMPTOMS = [
  { name: 'Mild Ankle / Foot Swelling', defaultSeverity: 'mild' as const },
  { name: 'Midday Fatigue & Energy Dip', defaultSeverity: 'moderate' as const },
  { name: 'Braxton Hicks / Uterine Tightening', defaultSeverity: 'mild' as const },
  { name: 'Heartburn or Acid Reflux', defaultSeverity: 'mild' as const },
  { name: 'Lower Back / Ligament Ache', defaultSeverity: 'mild' as const },
  { name: 'Fetal Movement Pattern Change', defaultSeverity: 'moderate' as const },
  { name: 'Sleep Disruption / Restless Legs', defaultSeverity: 'mild' as const },
];

export const LogSymptomModal: React.FC<LogSymptomModalProps> = ({
  isOpen,
  onClose,
  onSaveSymptom,
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState(COMMON_SYMPTOMS[0].name);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'significant'>('mild');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customSymptom.trim() ? customSymptom.trim() : selectedSymptom;
    const newLog: SymptomLog = {
      id: `sym-${Date.now()}`,
      symptomName: finalName,
      severity,
      timestamp: 'Just now',
      notes: notes.trim() || 'Logged via quick check-in.',
    };

    onSaveSymptom(newLog);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EFE7DE]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#242122]">Log Symptoms</h3>
              <p className="text-xs text-stone-500">Record how you are feeling right now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-stone-800">Symptom Logged Securely</h4>
            <p className="text-xs text-stone-600 max-w-xs">
              MomCare AI has updated your daily care timeline and context correlation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Quick symptom selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Select or describe symptom:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {COMMON_SYMPTOMS.map((sym) => (
                  <button
                    key={sym.name}
                    type="button"
                    onClick={() => {
                      setSelectedSymptom(sym.name);
                      setCustomSymptom('');
                      setSeverity(sym.defaultSeverity);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full transition cursor-pointer ${
                      selectedSymptom === sym.name && !customSymptom
                        ? 'bg-[#8C3A27] text-white font-medium shadow-xs'
                        : 'bg-[#F5ECE8] text-stone-700 hover:bg-[#EEDFD9]'
                    }`}
                  >
                    {sym.name}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Or type other specific symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27] focus:border-[#8C3A27]"
              />
            </div>

            {/* Severity selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Severity Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSeverity('mild')}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${
                    severity === 'mild'
                      ? 'border-[#2E6B4E] bg-[#F2F8F4] text-[#2E6B4E]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Mild
                  <span className="block text-[10px] font-normal text-stone-600">Noticeable, gentle</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('moderate')}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${
                    severity === 'moderate'
                      ? 'border-[#A66120] bg-[#FDF8F3] text-[#A66120]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Moderate
                  <span className="block text-[10px] font-normal text-stone-600">Affects routine</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSeverity('significant')}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${
                    severity === 'significant'
                      ? 'border-[#B24C3D] bg-[#FDF3F2] text-[#B24C3D]'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  Significant
                  <span className="block text-[10px] font-normal text-stone-600">Needs attention</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Contextual Notes (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="E.g., Happened after standing for 2 hours, or feels better when lying down..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27] focus:border-[#8C3A27]"
              />
            </div>

            {/* Educational Disclaimer */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FAF6F2] text-[11px] text-stone-600">
              <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                Symptom logging helps personalize your care suggestions. MomCare AI is an educational tool and does not replace medical triage.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] active:scale-[0.98] transition shadow-xs"
              >
                Save Symptom Log
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
