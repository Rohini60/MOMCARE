import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition active:scale-95 shadow-xs cursor-pointer ${className}`}
        title="Install MOMCARE on your Android or PC home screen"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-200" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF6F2] border border-[#EADACD] text-stone-700 hover:bg-[#F0E6DE] transition cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#B25742]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF9] p-6 shadow-2xl border border-[#EFE7DE] text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E6DE]">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Install MomCare on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button (box with an arrow) in your Safari toolbar.<br />
                2. Scroll down and select <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> at top right to launch MomCare full screen.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#2B2829] text-white font-semibold transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
