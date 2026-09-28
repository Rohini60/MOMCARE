import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { ArrowRight, ArrowLeft, Check, Sparkles, Shield, Heart } from 'lucide-react';

interface OnboardingScreenProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<UserProfile>(initialProfile);

  // Field helpers
  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as 2 | 3 | 4);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    } else {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242122] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Back to Welcome' : 'Previous Step'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center font-serif font-bold text-xs">
            M
          </div>
          <span className="font-serif font-bold text-sm text-[#242122]">MomCare AI</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-xl mx-auto w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EFE7DE] my-auto">
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-stone-600 mb-2.5">
            <span className={step >= 1 ? 'text-[#8C3A27] font-semibold' : ''}>1. You</span>
            <span className={step >= 2 ? 'text-[#8C3A27] font-semibold' : ''}>2. Pregnancy</span>
            <span className={step >= 3 ? 'text-[#8C3A27] font-semibold' : ''}>3. Your Baby</span>
            <span className={step >= 4 ? 'text-[#8C3A27] font-semibold' : ''}>4. Preferences</span>
          </div>
          <div className="w-full bg-[#EFE7DE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#B25742] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#242122]">About You</h2>
              <p className="text-xs text-stone-500">
                Let's personalize your care journey with basic details.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="E.g., Ananya"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || 28)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Current Status
                  </label>
                  <select
                    value={formData.pregnancyStatus}
                    onChange={(e) => updateField('pregnancyStatus', e.target.value as any)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                  >
                    <option value="pregnant">Pregnant (Antenatal)</option>
                    <option value="postpartum">Postpartum (Newborn)</option>
                    <option value="trying">Preconception</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Your Pregnancy */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#242122]">Your Pregnancy</h2>
              <p className="text-xs text-stone-500">
                Helps calculate clinical milestones and fetal development stages.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Current Pregnancy Week
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="4"
                    max="40"
                    value={formData.pregnancyWeek}
                    onChange={(e) => updateField('pregnancyWeek', parseInt(e.target.value))}
                    className="w-full accent-[#B25742]"
                  />
                  <span className="font-serif font-bold text-base text-[#8C3A27] w-16 text-right">
                    Wk {formData.pregnancyWeek}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Trimester: {formData.pregnancyWeek <= 12 ? 'First' : formData.pregnancyWeek <= 27 ? 'Second (Current)' : 'Third'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Estimated Delivery Date
                </label>
                <input
                  type="text"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => updateField('expectedDeliveryDate', e.target.value)}
                  placeholder="E.g., January 14, 2027"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pregnancy Experience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('pregnancyType', 'First pregnancy')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      formData.pregnancyType === 'First pregnancy'
                        ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    First Pregnancy
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('pregnancyType', 'Previous pregnancy')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition ${
                      formData.pregnancyType === 'Previous pregnancy'
                        ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    Previous Pregnancy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Your Baby */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#242122]">Your Baby</h2>
              <p className="text-xs text-stone-500">
                Tell us about your little one. You can choose a name or change it anytime.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Baby's Expected Name or Nickname
                </label>
                <input
                  type="text"
                  value={formData.babyName || ''}
                  onChange={(e) => updateField('babyName', e.target.value)}
                  placeholder={`E.g., Little Peanut, or Baby of ${formData.name || 'Mother'}`}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
                <p className="text-[11px] text-stone-600 mt-1">
                  Optional: If left blank, we'll gently address your baby as "Baby of {formData.name || 'Mother'}".
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateField('babyGender', 'surprise')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      formData.babyGender === 'surprise' || !formData.babyGender
                        ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    ✨ Surprise
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('babyGender', 'girl')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      formData.babyGender === 'girl'
                        ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    🎀 Baby Girl
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('babyGender', 'boy')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      formData.babyGender === 'boy'
                        ? 'border-[#8C3A27] bg-[#F5ECE8] text-[#8C3A27] font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    💙 Baby Boy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Special Baby Notes / Nursery Preparations
                </label>
                <input
                  type="text"
                  value={formData.babyNotes || ''}
                  onChange={(e) => updateField('babyNotes', e.target.value)}
                  placeholder="E.g., Natural lullaby rhythm, cotton nursery"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Your Preferences */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#242122]">Your Preferences</h2>
              <p className="text-xs text-stone-500">
                Tailor nutrition guidelines, supplement alerts, and reminders.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Food Preferences / Diet Style
                </label>
                <input
                  type="text"
                  value={formData.foodPreferences.join(', ')}
                  onChange={(e) =>
                    updateField(
                      'foodPreferences',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  placeholder="E.g., Vegetarian, High Fiber, Low Sugar"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies.join(', ')}
                  onChange={(e) =>
                    updateField(
                      'allergies',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  placeholder="E.g., Penicillin, Peanuts, None"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Prescribed Supplements & Medications
                </label>
                <input
                  type="text"
                  value={formData.medications.join(', ')}
                  onChange={(e) =>
                    updateField(
                      'medications',
                      e.target.value.split(',').map((s) => s.trim())
                    )
                  }
                  placeholder="E.g., Prenatal Multivitamin, Iron Bisglycinate 28mg, DHA"
                  className="w-full px-4 py-2 text-xs rounded-xl border border-[#E3D5C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#8C3A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Preferred Daily Reminder Schedule
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE]">
                    <span className="text-[10px] text-stone-600 block">Morning</span>
                    <span className="text-xs font-semibold text-stone-800">
                      {formData.reminderTimes.morning}
                    </span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE]">
                    <span className="text-[10px] text-stone-600 block">Afternoon</span>
                    <span className="text-xs font-semibold text-stone-800">
                      {formData.reminderTimes.afternoon}
                    </span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[#FAF6F2] border border-[#EFE7DE]">
                    <span className="text-[10px] text-stone-600 block">Evening</span>
                    <span className="text-xs font-semibold text-stone-800">
                      {formData.reminderTimes.evening}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-5 border-t border-[#F0E6DE] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-[#2B2829] text-white font-semibold text-xs hover:bg-[#3E3839] active:scale-[0.98] transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            {step === 4 ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Create My Care Journey</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="max-w-xl mx-auto w-full text-center text-xs text-stone-600 pt-4">
        Your data is encrypted locally and used solely to tailor evidence-based guidance.
      </div>
    </div>
  );
};
