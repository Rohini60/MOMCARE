import React from 'react';
import { ScreenType } from '../../types';
import { Home, Heart, Baby, Sparkles, User, Brain, CheckSquare, FileSearch } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as ScreenType, label: 'Home', icon: Home },
    { id: 'daily-tracker' as ScreenType, label: 'Tracker', icon: CheckSquare },
    { id: 'chat' as ScreenType, label: 'MomCare AI', icon: Sparkles, isCenter: true },
    { id: 'mom-care' as ScreenType, label: 'Mom', icon: Heart },
    { id: 'report-analyzer' as ScreenType, label: 'Reports', icon: FileSearch },
    { id: 'profile' as ScreenType, label: 'Account', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-lg border-t border-[#EFE7DE] pb-safe"
      style={{ boxShadow: '0 -4px 20px rgba(70, 50, 40, 0.05)' }}
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center -mt-3.5 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#B25742] text-white shadow-[#B25742]/30 ring-2 ring-[#EADACD]'
                      : 'bg-[#2B2829] text-white hover:bg-[#3E3839]'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <span
                  className={`text-[9px] font-semibold mt-1 tracking-tight truncate ${
                    isActive ? 'text-[#B25742]' : 'text-stone-600'
                  }`}
                >
                  AI Care
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer focus:outline-none transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? 'text-[#B25742] scale-110' : 'text-stone-500 hover:text-stone-800'
                }`}
                strokeWidth={isActive ? 2.3 : 1.7}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
                  isActive ? 'text-[#B25742] font-semibold' : 'text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
