import React, { useState } from 'react';
import { BabyCareData, MotherRecord } from '../../types';
import { updateMotherProfile } from '../../services/firebase';
import {
  Baby,
  Heart,
  Calendar,
  Sparkles,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface EditBabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyData: BabyCareData;
  mother?: MotherRecord | null;
  onSaveBabyProfile: (updatedData: {
    babyName: string;
    gender: 'boy' | 'girl' | 'surprise';
    dueDate: string;
    notes: string;
  }) => void;
}

export const EditBabyProfileModal: React.FC<EditBabyProfileModalProps> = ({
  isOpen,
  onClose,
  babyData,
  mother,
  onSaveBabyProfile,
}) => {
  const [name, setName] = useState(
    babyData.profile.nickname || (babyData.profile.name.includes('Baby of') ? '' : babyData.profile.name)
  );
  const [gender, setGender] = useState<'boy' | 'girl' | 'surprise'>(
    babyData.profile.gender || 'surprise'
  );
  const [dueDate, setDueDate] = useState(
    mother?.due_date || babyData.profile.dobOrDue.split(' ')[0] || ''
  );
  const [notes, setNotes] = useState(babyData.profile.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    const trimmedName = name.trim();
    const finalDisplayName = trimmedName || `Baby of ${mother?.name || 'Mother'}`;

    try {
      // If user has authenticated session, save to Firestore
      if (mother?.id) {
        await updateMotherProfile(mother.id, {
          baby_name: trimmedName,
          baby_gender: gender,
          baby_notes: notes.slice(0, 500),
          due_date: dueDate || mother.due_date,
        });
      }

      onSaveBabyProfile({
        babyName: finalDisplayName,
        gender,
        dueDate: dueDate || mother?.due_date || babyData.profile.dobOrDue,
        notes,
      });

      onClose();
    } catch (err: any) {
      console.warn('Saving baby profile note:', err);
      // Still update local state if network has glitch
      onSaveBabyProfile({
        babyName: finalDisplayName,
        gender,
        dueDate: dueDate || mother?.due_date || babyData.profile.dobOrDue,
        notes,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#EFE7DE] my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#242122]">
                Customize Baby Profile
              </h3>
              <p className="text-xs text-stone-500">
                Personalize your little one's name, gender & notes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-[#F5ECE8] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Baby's Name / Nickname */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Baby's Name or Affectionate Nickname
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`E.g., Little Peanut, Maya, Aarav, or Baby of ${mother?.name || 'Mother'}`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs font-medium"
            />
            <p className="text-[11px] text-stone-600 mt-1">
              Leave blank to automatically display "Baby of {mother?.name || 'Mother'}"
            </p>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Gender / Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGender('surprise')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                  gender === 'surprise'
                    ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                ✨ Surprise
              </button>
              <button
                type="button"
                onClick={() => setGender('girl')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                  gender === 'girl'
                    ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                🎀 Baby Girl
              </button>
              <button
                type="button"
                onClick={() => setGender('boy')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                  gender === 'boy'
                    ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                💙 Baby Boy
              </button>
            </div>
          </div>

          {/* Expected Due Date */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Expected Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs font-medium"
              />
            </div>
          </div>

          {/* Personal Baby Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Personal Notes or Nursery Preparations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Preparing cotton swaddles, wooden crib, and calming lullaby playlist"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#F0E6DE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#2B2829] text-white hover:bg-[#3E3839] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving…' : 'Save Baby Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
