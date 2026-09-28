import React, { useState, useEffect } from 'react';
import { testFirestoreConnection, auth, db } from '../../services/firebase';
import { Database, CheckCircle2, ShieldCheck, RefreshCw, X, Server, Cloud, Info } from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

interface FirebaseStatusIndicatorProps {
  onStatusChange?: (isOnline: boolean) => void;
}

export const FirebaseStatusIndicator: React.FC<FirebaseStatusIndicatorProps> = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    const result = await testFirestoreConnection();
    setIsOnline(result.isOnline);
    setIsChecking(false);
    if (onStatusChange) onStatusChange(result.isOnline);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Status Pill in Header / TopBar */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer border ${
          isOnline === true
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : isOnline === false
            ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            : 'bg-stone-100 text-stone-600 border-stone-200'
        }`}
        title="Firebase Cloud Database & Auth Status"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline === true ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <Cloud className="w-3 h-3 text-[#B25742]" />
        <span className="hidden sm:inline">
          {isOnline === true ? 'Firebase Firestore Live' : 'Firebase Connecting…'}
        </span>
        <span className="sm:hidden">
          {isOnline === true ? 'Firebase' : 'Syncing'}
        </span>
      </button>

      {/* Diagnostic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#EFE7DE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#242122]">
                    Firebase Cloud Database & Auth
                  </h3>
                  <p className="text-xs text-stone-500">Google Sign-In & Firestore Persistence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-2xl flex items-start gap-3 border ${
                  isOnline === true
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {isOnline === true ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <RefreshCw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                )}
                <div className="text-xs">
                  <p className="font-semibold">
                    {isOnline === true
                      ? 'Connected to Firebase Firestore Cloud'
                      : 'Connecting to Cloud Firestore…'}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {isOnline === true
                      ? 'Your maternal records, appointments, symptoms, and care tasks persist securely with Zero-Trust Firestore Security Rules.'
                      : 'Connecting to database instance…'}
                  </p>
                </div>
              </div>

              {/* Configuration Details */}
              <div className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#EFE7DE] space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#EFE7DE]">
                  <span className="text-stone-500">Firebase Project:</span>
                  <span className="font-mono font-semibold text-stone-800">{firebaseConfig.projectId}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#EFE7DE]">
                  <span className="text-stone-500">Firestore Database ID:</span>
                  <span className="font-mono text-[11px] text-stone-800 truncate max-w-[200px]" title={firebaseConfig.firestoreDatabaseId}>
                    {firebaseConfig.firestoreDatabaseId}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#EFE7DE]">
                  <span className="text-stone-500">Authentication:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Google Sign-In with Firebase Auth
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-500">Active User:</span>
                  <span className="font-medium text-stone-800">
                    {auth.currentUser ? auth.currentUser.email : 'Signed out'}
                  </span>
                </div>
              </div>

              {/* Collections active */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-stone-700">Firestore Collections Active:</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px]">users</span>
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px]">care_tasks</span>
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px]">appointments</span>
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px]">health_records</span>
                  <span className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-mono text-[11px]">medical_reports</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0E6DE]">
              <button
                type="button"
                onClick={checkStatus}
                disabled={isChecking}
                className="px-3.5 py-1.5 rounded-xl border border-[#DECBC2] text-xs font-medium text-stone-700 hover:bg-[#FAF6F2] transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#2B2829] text-white text-xs font-semibold hover:bg-[#3E3839] transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
