import React from 'react';
import { Sparkles, PhoneCall, Droplets, HeartPulse } from 'lucide-react';

interface FloatingAIButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  onOpenBloodBridge?: () => void;
}

export const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  onClick,
  isOpen,
  onOpenBloodBridge,
}) => {
  if (isOpen) return null;

  const handleBloodBridgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const savedUrl = localStorage.getItem('bloodbridge_custom_url');
      const autoRedirect = localStorage.getItem('bloodbridge_auto_redirect');
      if (
        savedUrl &&
        savedUrl.trim() !== '' &&
        !savedUrl.includes('github.com') &&
        autoRedirect === 'true'
      ) {
        let finalUrl = savedUrl.trim();
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = `https://${finalUrl}`;
        }
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        return;
      }
    } catch (err) {
      console.error(err);
    }

    if (onOpenBloodBridge) {
      onOpenBloodBridge();
    }
  };

  return (
    <aside
      aria-label="AI Assistant Quick Access Stack"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none"
    >
      {/* 1. BloodBridge AI Button (Positioned Directly Above Ask OneCare AI) */}
      <button
        onClick={handleBloodBridgeClick}
        aria-label="Open BloodBridge AI"
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-950 via-red-800 to-rose-700 hover:from-rose-900 hover:via-red-700 hover:to-rose-600 text-white shadow-xl shadow-rose-950/30 hover:shadow-2xl hover:shadow-red-600/40 border border-rose-300/40 hover:border-rose-200/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
      >
        {/* Soft pulsing red glow behind the button */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 opacity-35 blur-xs group-hover:opacity-75 transition duration-300 animate-pulse" />

        <div className="relative flex items-center gap-2.5">
          {/* Blood Drop Container */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-rose-200 group-hover:text-white group-hover:scale-110 transition-transform duration-300">
            <Droplets className="w-4 h-4 text-rose-200 fill-rose-300" />
          </div>

          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-tight leading-none text-white">
                BloodBridge AI
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-rose-500/40 text-rose-200 text-[9px] font-black tracking-wider uppercase flex items-center gap-1 border border-rose-400/30">
                <HeartPulse className="w-2.5 h-2.5 text-rose-300 animate-pulse" />
                <span>Donor Live</span>
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
              </span>
            </div>
            <span className="text-[10px] font-semibold text-rose-100/90 hidden sm:inline leading-tight mt-0.5">
              Smart Blood Bank Matching • Emergency Donors
            </span>
          </div>
        </div>
      </button>

      {/* 2. Ask OneCare AI Button */}
      <button
        onClick={onClick}
        aria-label="Ask OneCare Special AI & Voice Call"
        className="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-teal-900 via-teal-700 to-cyan-700 hover:from-teal-800 hover:via-teal-600 hover:to-cyan-600 text-white shadow-xl shadow-teal-950/25 hover:shadow-2xl hover:shadow-teal-600/30 border border-teal-300/30 hover:border-teal-200/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
      >
        {/* Soft pulsing glow behind the button */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-30 blur-xs group-hover:opacity-60 transition duration-300" />

        <div className="relative flex items-center gap-2.5">
          {/* Sparkles / Phone container */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-teal-200 group-hover:text-white group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-teal-200" />
          </div>

          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-tight leading-none text-white">
                Ask OneCare AI
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 text-[9px] font-black tracking-wider uppercase flex items-center gap-1">
                <PhoneCall className="w-2.5 h-2.5 text-emerald-300 animate-pulse" />
                <span>Call Live</span>
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>
            <span className="text-[10px] font-semibold text-teal-100/90 hidden sm:inline leading-tight mt-0.5">
              2-Way Voice Call • Prescriptions • Reports
            </span>
          </div>
        </div>
      </button>
    </aside>
  );
};
