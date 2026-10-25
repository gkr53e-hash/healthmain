import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, HeartPulse, Ambulance, Radio, Sparkles } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const helplines = [
    { title: 'National Emergency Ambulance', number: '108', desc: 'Free 24x7 Ambulance Dispatch across India' },
    { title: 'Police Assistance', number: '112', desc: 'Unified Emergency Services Helpline' },
    { title: 'Women & Child Helpline', number: '1091', desc: 'Emergency response for women in distress' },
    { title: 'OneCare Special Emergency Desk', number: '1800-208-1080', desc: 'Dedicated ICU bed & critical pathology helpline' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 relative text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle red background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close emergency modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/25">
            <Ambulance className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white rounded-md">
                Critical Care SOS
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                <Radio className="w-3 h-3 text-red-500 animate-ping" />
                Live Network
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">108 Emergency SOS</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          If you or someone nearby is experiencing acute chest pain, severe trauma, stroke symptoms, or breathing distress, tap below to dispatch assistance immediately.
        </p>

        {/* Big Call 108 Button */}
        <a
          href="tel:108"
          className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 active:scale-98 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/30 transition-all cursor-pointer mb-5 text-center"
        >
          <PhoneCall className="w-5 h-5 fill-white" />
          <span>Call 108 Free Ambulance Dispatch</span>
        </a>

        {/* Other Emergency Numbers */}
        <div className="space-y-2.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">
            Emergency Hotlines & Bed Allocation
          </span>
          {helplines.map((h, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/90 hover:bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{h.title}</p>
                <p className="text-[11px] text-slate-500 font-medium">{h.desc}</p>
              </div>
              <a
                href={`tel:${h.number.replace(/\D/g, '')}`}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-red-500 hover:text-red-600 text-slate-800 text-xs font-bold rounded-lg transition-colors shrink-0 shadow-2xs"
              >
                {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

