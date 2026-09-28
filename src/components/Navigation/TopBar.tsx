import React, { useState } from 'react';
import { ScreenType, FirebaseUser, MotherRecord } from '../../types';
import { Sparkles, Calendar, FileText, Heart, Shield, LogIn, LogOut, User, Edit3, ChevronDown } from 'lucide-react';
import { FirebaseStatusIndicator } from '../Common/FirebaseStatusIndicator';
import { PWAInstallButton } from '../Common/PWAInstallButton';

interface TopBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  pregnancyWeek?: number;
  userName?: string;
  currentUser?: FirebaseUser | null;
  currentMother?: MotherRecord | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onLogout?: () => void;
  onOpenEditProfile?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  onNavigate,
  pregnancyWeek = 15,
  userName = 'Ananya',
  currentUser,
  currentMother,
  onOpenAuth,
  onLogout,
  onOpenEditProfile,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFE7DE] px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark + Firebase Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#242122] group-hover:text-[#B25742] transition-colors">
              MomCare AI
            </span>
          </button>

          <FirebaseStatusIndicator />
        </div>

        {/* Zone 2: 4-6 clean text navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'home' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('mom-care')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'mom-care' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Mom Care
          </button>
          <button
            onClick={() => onNavigate('daily-tracker')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'daily-tracker' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Daily Tracker
          </button>
          <button
            onClick={() => onNavigate('baby-care')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'baby-care' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Baby Care
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'insights' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => onNavigate('report-analyzer')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'report-analyzer' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => onNavigate('appointments')}
            className={`transition-colors hover:text-[#242122] ${
              currentScreen === 'appointments' ? 'text-[#B25742] font-semibold' : ''
            }`}
          >
            Appointments
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Install PWA, Ask AI, Auth profile) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* PWA Install Button */}
          <PWAInstallButton />

          <button
            onClick={() => onNavigate('chat')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5ECE8] text-[#8C3A27] hover:bg-[#EEDFD9] transition active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
            <span>Ask MomCare AI</span>
          </button>

          {/* User Profile or Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full bg-white border border-[#EFE7DE] hover:border-[#DECBC2] transition text-left cursor-pointer"
                title="Account menu"
              >
                <span className="text-xs font-medium text-stone-700 hidden md:inline truncate max-w-[110px]">
                  Wk {pregnancyWeek} · {userName}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#EADACD] text-[#694228] flex items-center justify-center font-serif font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#EFE7DE] py-1.5 text-xs text-stone-700 z-50 animate-fade-in">
                  <div className="px-3.5 py-2 border-b border-[#F0E6DE]">
                    <p className="font-semibold text-stone-900 truncate">{userName}</p>
                    <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-[#8C3A27] font-medium mt-0.5">
                      Week {pregnancyWeek} · Pregnancy #{currentMother?.pregnancy_number || 1}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-[#FAF6F2] flex items-center gap-2 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Edit Mother Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      onNavigate('profile');
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-[#FAF6F2] flex items-center gap-2 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-stone-500" />
                    <span>Privacy & Settings</span>
                  </button>

                  <div className="border-t border-[#F0E6DE] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#3E3839] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
