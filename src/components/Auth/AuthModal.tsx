import React, { useState } from 'react';
import { signInWithGoogle } from '../../services/firebase';
import { MotherRecord, FirebaseUser } from '../../types';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  X,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Cloud
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: FirebaseUser, mother: MotherRecord) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Gestational Profile Fields (Customizable on Google Sign-In)
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(16);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 150 * 86400000).toISOString().split('T')[0]
  );
  const [pregnancyNumber, setPregnancyNumber] = useState<number>(1);
  const [customName, setCustomName] = useState<string>('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { user, mother } = await signInWithGoogle();
      // If user specified custom week/due date in the modal, update mother record
      const updatedMother: MotherRecord = {
        ...mother,
        name: customName.trim() || mother.name || user.name || 'MomCare Patient',
        current_week: pregnancyWeek || mother.current_week,
        due_date: dueDate || mother.due_date,
        pregnancy_number: pregnancyNumber || mother.pregnancy_number,
      };

      setSuccessMsg(`Welcome, ${updatedMother.name}! Google Authentication verified.`);
      setTimeout(() => {
        onAuthSuccess(user, updatedMother);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      let msg = err.message || 'Google Sign-In failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completing. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'The Google popup was blocked by your browser. Please allow popups for this site.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    const demoUser: FirebaseUser = {
      id: 'demo-google-user',
      email: 'mother.demo@momcare.ai',
      name: customName.trim() || 'Ananya Sharma',
    };
    const demoMother: MotherRecord = {
      id: 'demo-google-user',
      userId: 'demo-google-user',
      user: 'demo-google-user',
      email: 'mother.demo@momcare.ai',
      name: customName.trim() || 'Ananya Sharma',
      age: 28,
      contact: '+1 555-019-2831',
      address: 'City Center Maternal Ward',
      pregnancy_number: pregnancyNumber || 1,
      due_date: dueDate,
      current_week: pregnancyWeek || 16,
    };
    setSuccessMsg('Signed in with Demo Patient Account!');
    setTimeout(() => {
      onAuthSuccess(demoUser, demoMother);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#EFE7DE] my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-[#F5ECE8] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pb-4 border-b border-[#F0E6DE]">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C3A27] px-2.5 py-0.5 rounded-full bg-[#F5ECE8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B25742]" />
            <span>Secure Firebase Authentication</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#242122]">
            Sign in with Google
          </h2>
          <p className="text-xs text-stone-500">
            Connect your Google account to securely sync your maternal health records and appointments to Cloud Firestore.
          </p>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Sign-in Notice</p>
              <p className="text-[11px] mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Gestational Profile Configuration */}
        <div className="py-4 space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE7DE] space-y-3">
            <p className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#B25742]" />
              <span>Pregnancy Profile Setup</span>
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Pregnancy Week
                </label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={pregnancyWeek}
                  onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Pregnancy #
                </label>
                <select
                  value={pregnancyNumber}
                  onChange={(e) => setPregnancyNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs font-medium"
                >
                  <option value={1}>1st Pregnancy</option>
                  <option value={2}>2nd Pregnancy</option>
                  <option value={3}>3rd Pregnancy</option>
                  <option value={4}>4th+ Pregnancy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Expected Due Date (EDD)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Preferred Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Defaults to your Google Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE7DE] focus:outline-none focus:ring-2 focus:ring-[#8C3A27] text-stone-800 text-xs"
              />
            </div>
          </div>

          {/* Primary Action: Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-[#EFE7DE] hover:border-[#DECBC2] text-stone-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Authenticating with Google…' : 'Continue with Google'}</span>
          </button>

          {/* Privacy & Cloud Notice */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-[#B25742]" />
              Firestore Data Persistence
            </span>
            <span>Zero-Trust Security</span>
          </div>

          <div className="border-t border-[#F0E6DE] pt-3 text-center">
            <button
              type="button"
              onClick={handleDemoMode}
              className="text-xs text-stone-500 hover:text-[#8C3A27] underline decoration-dotted transition cursor-pointer"
            >
              Or preview with Demo Patient Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
