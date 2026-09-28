import React, { useState, useEffect } from 'react';
import { NotificationItem, ScreenType } from '../../types';
import {
  Bell,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Heart,
  Droplets,
  Calendar,
  Activity,
  AlertCircle
} from 'lucide-react';

interface NotificationLightPopupProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onAction?: (actionScreen?: ScreenType, prefillChat?: string) => void;
  soundEnabled?: boolean;
}

/**
 * Gentle Web Audio synthesizer for pleasant notification chime
 */
function playChime(enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (C5 - 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second harmonious tone (E5 - 659.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.09, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (e) {
    // Audio contexts may be blocked before first user gesture
  }
}

export const NotificationLightPopup: React.FC<NotificationLightPopupProps> = ({
  notification,
  onDismiss,
  onAction,
  soundEnabled = true,
}) => {
  const [sound, setSound] = useState(soundEnabled);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      playChime(sound);
    } else {
      setIsVisible(false);
    }
  }, [notification?.id]);

  if (!notification || !isVisible) return null;

  // Color themes according to priority
  const isWellness = notification.priority === 'wellness';
  const isClinical = notification.priority === 'clinical';
  const isReminder = notification.priority === 'reminder';

  const lightColorClass = isClinical
    ? 'bg-rose-500 shadow-[0_0_18px_#f43f5e,0_0_35px_#f43f5e]'
    : isReminder
    ? 'bg-amber-400 shadow-[0_0_18px_#fbbf24,0_0_35px_#fbbf24]'
    : 'bg-emerald-400 shadow-[0_0_18px_#34d399,0_0_35px_#34d399]';

  const auraRingClass = isClinical
    ? 'border-rose-400/40 bg-rose-500/20'
    : isReminder
    ? 'border-amber-400/40 bg-amber-500/20'
    : 'border-emerald-400/40 bg-emerald-500/20';

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'hydration':
        return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-3.5 h-3.5 text-purple-600" />;
      case 'milestone':
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'kicks':
        return <Activity className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Heart className="w-3.5 h-3.5 text-[#B25742]" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full animate-bounce-in transition-all duration-300 pointer-events-auto"
    >
      <div className="relative bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border-2 border-[#EFE7DE] hover:border-[#DECBC2] text-[#242122] overflow-hidden">
        {/* Ambient Top Glow Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isClinical ? 'bg-rose-500' : isReminder ? 'bg-amber-400' : 'bg-emerald-500'
          }`}
        />

        {/* Header row with Glowing Light indicator */}
        <div className="flex items-start justify-between gap-3 pb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Pulsing illuminated physical light bulb / jewel */}
            <div className="relative flex items-center justify-center w-7 h-7">
              {/* Animated pulsating aura ring */}
              <span
                className={`absolute w-7 h-7 rounded-full border animate-ping opacity-60 ${auraRingClass}`}
              />
              <span
                className={`absolute w-5 h-5 rounded-full border ${auraRingClass} animate-pulse`}
              />
              {/* The bright glowing core light */}
              <span
                className={`relative w-3.5 h-3.5 rounded-full transition-all duration-300 ${lightColorClass}`}
                title="Pulsing Alert Light"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-[#F5ECE8]">{getCategoryIcon()}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                {notification.category.toUpperCase()} ALERT
              </span>
            </div>
          </div>

          {/* Sound & Dismiss controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const next = !sound;
                setSound(next);
                if (next) playChime(true);
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F5ECE8] transition cursor-pointer"
              title={sound ? 'Mute alert chimes' : 'Enable alert chimes'}
            >
              {sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F5ECE8] transition cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Body */}
        <div className="space-y-1.5 mt-1">
          <h4 className="text-sm font-serif font-bold text-[#242122] leading-snug">
            {notification.title}
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed font-sans">
            {notification.message}
          </p>
          <span className="text-[10px] text-stone-600 font-mono block pt-0.5">
            {notification.timestamp} · AI Maternal Safety Engine
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-[#F0E6DE] flex items-center justify-between gap-2">
          {notification.prefillChat ? (
            <button
              type="button"
              onClick={() => {
                if (onAction) onAction('chat', notification.prefillChat);
                onDismiss();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2B2829] text-white hover:bg-[#3E3839] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Ask MomCare AI</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onAction && notification.actionScreen) {
                  onAction(notification.actionScreen);
                }
                onDismiss();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2B2829] text-white hover:bg-[#3E3839] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>{notification.actionLabel || 'View Details'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-600 transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
