import React, { useState } from 'react';
import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

interface SourceCitationProps {
  sources: string[];
  className?: string;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ sources, className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className={`text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition font-medium group cursor-pointer"
      >
        <BookOpen className="w-3.5 h-3.5 text-[#B25742]" />
        <span>Medical sources ({sources.length})</span>
        <ChevronRight
          className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      </button>

      {expanded && (
        <ul className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-[#EADACD] text-[11px] text-stone-600">
          {sources.map((source, index) => (
            <li key={index} className="flex items-start gap-1.5 leading-snug">
              <span className="shrink-0 text-stone-400">·</span>
              <span className="flex-1">{source}</span>
            </li>
          ))}
          <li className="pt-1 text-[10px] text-stone-600 italic">
            Connecting directly with MomCare RAG clinical reference registry.
          </li>
        </ul>
      )}
    </div>
  );
};
