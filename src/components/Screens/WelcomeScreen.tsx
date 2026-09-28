import React from 'react';
import { ScreenType } from '../../types';
import { ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onLoginDemo: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onLoginDemo, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242122] flex flex-col justify-between">
      {/* Top minimal header */}
      <header className="px-6 py-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F5ECE8] text-[#8C3A27] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            M
          </div>
          <span className="font-serif font-bold text-xl text-[#242122] tracking-tight">
            MomCare AI
          </span>
        </div>
        <span className="text-xs font-medium text-stone-500 hidden sm:inline-block">
          Maternal & Baby Health Intelligence
        </span>
      </header>

      {/* Main Hero Container */}
      <main className="max-w-5xl mx-auto w-full px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C3A27] px-3.5 py-1.5 rounded-full bg-[#F5ECE8] mx-auto lg:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-[#B25742]" />
            <span>Maternal Healthcare Support</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#242122] tracking-tight leading-[1.1] text-balance">
              MomCare AI
            </h1>
            <p className="text-xl sm:text-2xl font-serif text-[#5E3B33] font-medium leading-snug">
              Intelligent care for every step of motherhood.
            </p>
          </div>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Personalized health guidance for you and your little one, powered by AI and trusted medical knowledge.
          </p>

          {/* Value points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-2.5 text-xs text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0" />
              <span>Evidence-based clinical guidelines</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0" />
              <span>Plain-English lab explanations</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0" />
              <span>Contextual daily care timeline</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B4E] shrink-0" />
              <span>Private & confidential health logs</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2B2829] text-white font-semibold text-sm hover:bg-[#3E3839] active:scale-[0.98] transition shadow-md flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => (onOpenAuth ? onOpenAuth('login') : onLoginDemo())}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#E3D5C8] text-[#242122] font-semibold text-sm hover:bg-[#FAF6F2] active:scale-[0.98] transition cursor-pointer"
            >
              I already have an account (Sign In)
            </button>
          </div>

          {/* Subtle trust statement */}
          <p className="text-xs text-stone-600 pt-2 flex items-center justify-center lg:justify-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-stone-400" />
            <span>Designed for health support and education — not medical diagnosis.</span>
          </p>
        </div>

        {/* Right Column: Hero Visual Asset */}
        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Soft decorative aura */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#E8A2A8]/20 via-[#F5ECE8] to-[#E5D9C8]/40 rounded-3xl blur-2xl -z-10" />

            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EFE7DE] bg-white aspect-[4/3]">
              <img
                src="/src/assets/images/hero_motherhood_1790403294475.jpg"
                alt="Expectant mother in serene natural morning light"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold tracking-wide uppercase opacity-90">
                  Week-by-Week Guidance
                </p>
                <p className="text-sm font-serif font-medium">
                  Continuous maternal care tailored to your unique biological rhythm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-xs text-stone-600 max-w-6xl mx-auto w-full border-t border-[#EFE7DE]">
        MomCare AI · Built for maternal & infant health intelligence · ACOG & WHO reference-aligned
      </footer>
    </div>
  );
};
