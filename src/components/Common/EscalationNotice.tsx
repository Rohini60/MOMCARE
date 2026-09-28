import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

interface EscalationNoticeProps {
  message: string;
  onContactDoctor?: () => void;
  className?: string;
  isEmergencyAlert?: boolean;
}

export const EscalationNotice: React.FC<EscalationNoticeProps> = ({
  message,
  onContactDoctor,
  className = '',
  isEmergencyAlert = false,
}) => {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        isEmergencyAlert
          ? 'bg-[#FDF3F2] border-[#E8C5C0] text-[#7A281E]'
          : 'bg-[#FDF8F3] border-[#EADACD] text-[#694228]'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <AlertTriangle className={`w-4 h-4 ${isEmergencyAlert ? 'text-[#B24C3D]' : 'text-[#A66120]'}`} />
        </div>
        <div className="flex-1 text-xs leading-relaxed">
          <p className="font-semibold mb-1 text-[13px]">
            {isEmergencyAlert ? 'When to seek prompt medical care' : 'Healthcare Professional Guidance'}
          </p>
          <p className="text-stone-700">{message}</p>

          {onContactDoctor && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onContactDoctor}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2B2829] text-white hover:bg-[#403B3C] active:scale-[0.98] transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Talk to a healthcare professional</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
