import React, { useState } from 'react';
import { MotherRecord } from '../../types';
import { updateMotherProfile } from '../../services/firebase';
import { User, Phone, MapPin, Calendar, Heart, X, Check, AlertCircle } from 'lucide-react';

interface EditMotherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  mother: MotherRecord;
  onProfileUpdated: (updated: MotherRecord) => void;
}

export const EditMotherProfileModal: React.FC<EditMotherProfileModalProps> = ({
  isOpen,
  onClose,
  mother,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(mother.name || '');
  const [age, setAge] = useState<number>(mother.age || 26);
  const [contact, setContact] = useState(mother.contact || '');
  const [address, setAddress] = useState(mother.address || '');
  const [pregnancyNumber, setPregnancyNumber] = useState<number | string>(mother.pregnancy_number || 1);
  const [currentWeek, setCurrentWeek] = useState<number>(mother.current_week || 15);
  const [dueDate, setDueDate] = useState(mother.due_date || '');
  const [babyName, setBabyName] = useState(mother.baby_name || '');
  const [babyGender, setBabyGender] = useState<'boy' | 'girl' | 'surprise'>(
    mother.baby_gender || 'surprise'
  );
  const [babyNotes, setBabyNotes] = useState(mother.baby_notes || '');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      let updated: MotherRecord;
      if (mother.id) {
        updated = await updateMotherProfile(mother.id, {
          name,
          age: Number(age),
          contact,
          address,
          pregnancy_number: Number(pregnancyNumber),
          current_week: Number(currentWeek),
          due_date: dueDate,
          baby_name: babyName.trim(),
          baby_gender: babyGender,
          baby_notes: babyNotes.slice(0, 500),
        });
      } else {
        updated = {
          ...mother,
          name,
          age: Number(age),
          contact,
          address,
          pregnancy_number: Number(pregnancyNumber),
          current_week: Number(currentWeek),
          due_date: dueDate,
          baby_name: babyName.trim(),
          baby_gender: babyGender,
          baby_notes: babyNotes.slice(0, 500),
        };
      }
      onProfileUpdated(updated);
      onClose();
    } catch (err: any) {
      console.error('Error updating mother profile in Cloud Firestore:', err);
      // Still update local state if network is offline
      const updatedLocal: MotherRecord = {
        ...mother,
        name,
        age: Number(age),
        contact,
        address,
        pregnancy_number: Number(pregnancyNumber),
        current_week: Number(currentWeek),
        due_date: dueDate,
      };
      onProfileUpdated(updatedLocal);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EFE7DE] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center font-serif font-bold text-sm">
              M
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#242122]">Edit Mother Profile</h3>
              <p className="text-xs text-stone-500">Update your clinical records in Cloud Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="60"
                required
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 26)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Address / Village</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-3">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#B25742]" />
              Gestational Health Parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Current Pregnancy Week</label>
                <input
                  type="number"
                  min="4"
                  max="42"
                  required
                  value={currentWeek}
                  onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 15)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white font-bold text-[#8C3A27]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Pregnancy Number</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={pregnancyNumber}
                  onChange={(e) => setPregnancyNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Expected Delivery Date (EDD)</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="2027-01-14 or January 14, 2027"
                className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white"
              />
            </div>
          </div>

          {/* Baby Profile Section */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE] space-y-3">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <span>👶</span>
              Baby Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Baby's Expected Name / Nickname</label>
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder={`E.g., Little Peanut, or Baby of ${name || 'Mother'}`}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">Gender Preference</label>
                <select
                  value={babyGender}
                  onChange={(e) => setBabyGender(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white text-xs"
                >
                  <option value="surprise">✨ Surprise</option>
                  <option value="girl">🎀 Baby Girl</option>
                  <option value="boy">💙 Baby Boy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-1">Baby Notes / Nursery Wishes</label>
              <input
                type="text"
                value={babyNotes}
                onChange={(e) => setBabyNotes(e.target.value)}
                placeholder="E.g., Soft lullabies, organic cotton swaddles"
                className="w-full px-3 py-1.5 rounded-xl border border-[#E3D5C8] bg-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-2xl bg-[#2B2829] text-white font-semibold hover:bg-[#3E3839] transition flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
