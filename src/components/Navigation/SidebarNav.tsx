import React from 'react';
import { ScreenType, UserProfile } from '../../types';
import {
  Home,
  Heart,
  Baby,
  Brain,
  FileSearch,
  Sparkles,
  Calendar,
  Shield,
  PhoneCall,
  ChevronRight,
  Info,
  CheckSquare
} from 'lucide-react';

interface SidebarNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ currentScreen, onNavigate, user }) => {
  const navItems = [
    { id: 'home' as ScreenType, label: 'Home Dashboard', icon: Home, badge: null },
    { id: 'mom-care' as ScreenType, label: 'Mom Care', icon: Heart, badge: `Wk ${user.pregnancyWeek}` },
    { id: 'daily-tracker' as ScreenType, label: 'Daily Care Tracker', icon: CheckSquare, badge: 'Today' },
    { id: 'baby-care' as ScreenType, label: 'Baby Care', icon: Baby, badge: null },
    { id: 'insights' as ScreenType, label: 'AI Health Insights', icon: Brain, badge: '1 notice' },
    { id: 'report-analyzer' as ScreenType, label: 'Understand My Report', icon: FileSearch, badge: null },
    { id: 'chat' as ScreenType, label: 'Ask MomCare AI', icon: Sparkles, badge: 'Active' },
    { id: 'appointments' as ScreenType, label: 'My Appointments', icon: Calendar, badge: 'Oct 4' },
    { id: 'profile' as ScreenType, label: 'Privacy & Settings', icon: Shield, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#FFFDF9] border-r border-[#EFE7DE] h-screen sticky top-0 shrink-0 p-5 overflow-y-auto">
      {/* Brand header */}
      <div className="mb-6 pb-5 border-b border-[#F0E6DE]">
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center font-serif font-bold text-base shadow-sm">
              M
            </div>
            <span className="text-xl font-serif font-bold text-[#242122] tracking-tight">
              MomCare AI
            </span>
          </div>
          <p className="text-xs text-stone-500 font-normal">
            Intelligent maternal & baby healthcare
          </p>
        </button>
      </div>

      {/* Navigation items */}
      <nav className="space-y-1 flex-1">
        <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 px-3">
          Care Experience
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#F5ECE8] text-[#8C3A27] font-semibold shadow-xs'
                  : 'text-stone-600 hover:bg-[#FAF5F0] hover:text-[#242122]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#B25742]' : 'text-stone-400 group-hover:text-stone-700'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-[#EADACD] text-[#694228]'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Patient snapshot card */}
      <div className="pt-4 border-t border-[#F0E6DE] space-y-3">
        <div className="bg-[#FAF6F2] rounded-2xl p-3.5 border border-[#EFE7DE]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EADACD] text-[#694228] flex items-center justify-center font-serif font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-800">{user.name}</p>
                <p className="text-[11px] text-stone-500">Week {user.pregnancyWeek} · {user.pregnancyType}</p>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-600">Due date:</span>
              <span className="font-medium text-stone-800">{user.expectedDeliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Next visit:</span>
              <span className="font-medium text-[#8C3A27]">Oct 4 (Dr. Sharma)</span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="flex items-start gap-2 text-[10px] text-stone-600 leading-tight p-2">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>Designed for health support and education — not medical diagnosis.</span>
        </div>
      </div>
    </aside>
  );
};
