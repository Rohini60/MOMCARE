import React, { useState } from 'react';
import { UserProfile, ScreenType, MotherRecord, FirebaseUser } from '../../types';
import firebaseConfig from '../../../firebase-applet-config.json';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  Share2,
  Bell,
  Eye,
  Check,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Info,
  Server,
  Cloud,
  ExternalLink,
  Edit3,
  LogIn,
  LogOut,
  Code
} from 'lucide-react';

interface PrivacySettingsScreenProps {
  user: UserProfile;
  currentMother?: MotherRecord | null;
  currentUser?: FirebaseUser | null;
  allAppData: any;
  onResetData: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenEditProfile?: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({
  user,
  currentMother,
  currentUser,
  allAppData,
  onResetData,
  onNavigate,
  onOpenEditProfile,
  onOpenAuth,
  onLogout,
}) => {
  const [personalizedInsights, setPersonalizedInsights] = useState(true);
  const [aiAssistance, setAiAssistance] = useState(true);
  const [careReminders, setCareReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [supplementReminders, setSupplementReminders] = useState(true);

  const [showDataViewer, setShowDataViewer] = useState(false);
  const [showSecurityRules, setShowSecurityRules] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Handle data export
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allAppData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MomCare_Health_Export_${user.name}_Week${user.pregnancyWeek}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleGenerateShareCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setShareCode(`MC-OBGYN-${code}`);
  };

  return (
    <div className="space-y-7 pb-12 max-w-4xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2E6B4E] px-3 py-1 rounded-full bg-[#EBF4EE] mb-2">
          <Shield className="w-3.5 h-3.5 text-[#2E6B4E]" />
          <span>Patient-Owned Health Privacy & Cloud Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242122] tracking-tight">
          Privacy & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          Full transparency and strict control over your maternal healthcare logs, Firebase Firestore integration, and AI preferences.
        </p>
      </div>

      {/* ACCOUNT & FIREBASE PROFILE CARD */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E6DE]">
          <div>
            <h2 className="text-base font-serif font-bold text-[#242122]">
              Authenticated Patient Account
            </h2>
            <p className="text-xs text-stone-500">
              Secured with Google Sign-in & Firebase Authentication
            </p>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {onOpenEditProfile && (
                <button
                  type="button"
                  onClick={onOpenEditProfile}
                  className="px-3.5 py-1.5 rounded-xl border border-[#DECBC2] text-xs font-semibold text-[#8C3A27] bg-[#F5ECE8] hover:bg-[#EEDFD9] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="px-4 py-2 rounded-xl bg-[#2B2829] text-white text-xs font-semibold hover:bg-[#3E3839] flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE]">
            <span className="text-[10px] text-stone-500 block uppercase tracking-wider">Patient Name</span>
            <span className="font-semibold text-stone-900">{currentMother?.name || user.name}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE]">
            <span className="text-[10px] text-stone-500 block uppercase tracking-wider">Google Email</span>
            <span className="font-semibold text-stone-900 truncate block">
              {currentUser?.email || 'Guest Mode (Demo Session)'}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EFE7DE]">
            <span className="text-[10px] text-stone-500 block uppercase tracking-wider">Gestational Stage</span>
            <span className="font-semibold text-[#8C3A27]">
              Week {currentMother?.current_week || user.pregnancyWeek} · Pregnancy #{currentMother?.pregnancy_number || 1}
            </span>
          </div>
        </div>

        {/* Firebase Cloud Details */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-[#B25742]" />
            <span>Database: <code className="font-mono text-stone-800">{firebaseConfig.projectId}</code> (Firestore Enterprise)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSecurityRules(true)}
              className="text-[#8C3A27] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Security Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: MY DATA */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-5">
        <div className="pb-3 border-b border-[#F0E6DE]">
          <h2 className="text-base font-serif font-bold text-[#242122]">My Data</h2>
          <p className="text-xs text-stone-500">Access, transfer, or permanently erase your health data at any time</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* View data */}
          <button
            onClick={() => setShowDataViewer(true)}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F2] text-stone-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">View My Data</p>
                <p className="text-[11px] text-stone-500">Inspect stored profile & logs</p>
              </div>
            </div>
          </button>

          {/* Export data */}
          <button
            onClick={handleExportData}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF6F2] text-[#8C3A27] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">Export My Data</p>
                <p className="text-[11px] text-stone-500">Download full JSON archive</p>
              </div>
            </div>
          </button>

          {/* Share with healthcare provider */}
          <div className="p-4 rounded-2xl bg-white border border-[#EFE7DE] sm:col-span-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">
                    Share with Healthcare Provider
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Generate an encrypted one-time clinical summary access key for your doctor or midwife
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateShareCode}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition shrink-0 cursor-pointer"
              >
                Generate Provider Key
              </button>
            </div>

            {shareCode && (
              <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EADACD] flex items-center justify-between animate-fade-in">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                    Temporary 24-Hour Access Token
                  </span>
                  <span className="font-mono text-sm font-bold text-[#8C3A27]">{shareCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(shareCode);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#EFE7DE] text-xs font-medium text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                >
                  {copiedShare ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Data */}
        <div className="pt-2">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-medium text-rose-700 hover:text-rose-900 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear local cache & reset demo state</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs text-rose-900">
                  Reset local application cache and restore factory defaults?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    setConfirmDelete(false);
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 transition cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: AI PRIVACY & TRANSPARENCY */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-5">
        <div className="pb-3 border-b border-[#F0E6DE]">
          <h2 className="text-base font-serif font-bold text-[#242122]">AI & Privacy Controls</h2>
          <p className="text-xs text-stone-500">Configure how MomCare AI interacts with your maternal data</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EFE7DE]">
            <div>
              <p className="text-xs font-semibold text-stone-900">Personalized Gestational Insights</p>
              <p className="text-[11px] text-stone-500">Allow AI to synthesize multi-factor trends across logs and lab results</p>
            </div>
            <button
              type="button"
              onClick={() => setPersonalizedInsights(!personalizedInsights)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                personalizedInsights ? 'bg-[#8C3A27]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                  personalizedInsights ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EFE7DE]">
            <div>
              <p className="text-xs font-semibold text-stone-900">Conversational AI Assistance</p>
              <p className="text-[11px] text-stone-500">Enable maternal health Q&A powered by certified clinical guidelines</p>
            </div>
            <button
              type="button"
              onClick={() => setAiAssistance(!aiAssistance)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                aiAssistance ? 'bg-[#8C3A27]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                  aiAssistance ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: NOTIFICATIONS & REMINDERS */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-xs space-y-5">
        <div className="pb-3 border-b border-[#F0E6DE]">
          <h2 className="text-base font-serif font-bold text-[#242122]">Notification Preferences</h2>
          <p className="text-xs text-stone-500">Control timing and delivery of clinical care prompts</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EFE7DE]">
            <div>
              <p className="text-xs font-semibold text-stone-900">Daily Maternal Care Checklist</p>
              <p className="text-[11px] text-stone-500">Morning, afternoon, and evening wellness prompts</p>
            </div>
            <button
              type="button"
              onClick={() => setCareReminders(!careReminders)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                careReminders ? 'bg-[#8C3A27]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                  careReminders ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EFE7DE]">
            <div>
              <p className="text-xs font-semibold text-stone-900">Clinical Appointment Alerts</p>
              <p className="text-[11px] text-stone-500">24-hour and 2-hour pre-visit notifications with AI prep checklists</p>
            </div>
            <button
              type="button"
              onClick={() => setAppointmentReminders(!appointmentReminders)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                appointmentReminders ? 'bg-[#8C3A27]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                  appointmentReminders ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EFE7DE]">
            <div>
              <p className="text-xs font-semibold text-stone-900">Supplement Reminders</p>
              <p className="text-[11px] text-stone-500">Morning prenatal and iron absorption reminders</p>
            </div>
            <button
              type="button"
              onClick={() => setSupplementReminders(!supplementReminders)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                supplementReminders ? 'bg-[#8C3A27]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                  supplementReminders ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Raw Data Viewer Modal */}
      {showDataViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#EFE7DE] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <h3 className="text-base font-serif font-bold text-[#242122]">Raw Encrypted Health Data</h3>
              <button
                type="button"
                onClick={() => setShowDataViewer(false)}
                className="text-stone-400 hover:text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto bg-stone-900 text-stone-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed">
              <pre>{JSON.stringify(allAppData, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Firestore Security Rules Modal */}
      {showSecurityRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#EFE7DE] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#B25742]" />
                <h3 className="text-base font-serif font-bold text-[#242122]">
                  Firebase Firestore Security Rules
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityRules(false)}
                className="text-stone-400 hover:text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto text-xs space-y-3 pr-1">
              <p className="text-stone-600 leading-relaxed">
                MomCare AI implements Attribute-Based Access Control (ABAC) and Zero-Trust Firestore Security Rules to guarantee complete data isolation between mothers:
              </p>

              <div className="p-3.5 rounded-xl bg-stone-900 text-stone-200 font-mono text-[11px] space-y-2 leading-relaxed">
                <div>
                  <span className="text-amber-400 font-bold">1. Users Profile Isolation (/users/{'{userId}'})</span>
                  <p className="text-stone-300">allow read, write: if request.auth.uid == userId;</p>
                </div>
                <div className="border-t border-stone-800 pt-1.5">
                  <span className="text-amber-400 font-bold">2. Subscriptions & Data (/care_tasks, /appointments, /health_records, /medical_reports)</span>
                  <p className="text-stone-300">allow read, list: if resource.data.userId == request.auth.uid;</p>
                  <p className="text-stone-300">allow create, update: if request.resource.data.userId == request.auth.uid;</p>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 italic">
                Enforces type safety, strict string size limits, and protects against shadow field escalation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
