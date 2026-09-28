import React from 'react';
import { ConfidenceLevel } from '../../types';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
  showIcon?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, className = '', showIcon = true }) => {
  if (level === 'High') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#2E6B4E] ${className}`}>
        {showIcon && <ShieldCheck className="w-3.5 h-3.5" />}
        <span>Confidence: High</span>
      </span>
    );
  }

  if (level === 'Moderate') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#A66120] ${className}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5" />}
        <span>Confidence: Moderate</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#B24C3D] ${className}`}>
      {showIcon && <HelpCircle className="w-3.5 h-3.5" />}
      <span>Confidence: Needs Review</span>
    </span>
  );
};
