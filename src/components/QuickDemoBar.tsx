import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Stethoscope,
  ShieldCheck,
  FlaskConical,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DEMO_USERS, UserProfile, UserRole } from '../types/user';

interface QuickDemoBarProps {
  currentUser: UserProfile | null;
  onSelectRole: (role: UserRole) => void;
  onOpenDashboard: () => void;
}

export const QuickDemoBar: React.FC<QuickDemoBarProps> = ({
  currentUser,
  onSelectRole,
  onOpenDashboard,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'patient', label: 'Patient (Rahul)', icon: User, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { id: 'doctor', label: 'Doctor (Dr. Priya)', icon: Stethoscope, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
    { id: 'admin', label: 'Super Admin', icon: ShieldCheck, color: 'text-red-700 bg-red-50 border-red-200' },
    { id: 'lab', label: 'Lab Partner', icon: FlaskConical, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-3.5 py-2 rounded-full bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer group"
          title="Open Quick Demo Presenter Bar"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
          <span>⚡ Demo Switcher ({currentUser ? currentUser.role : 'Guest'})</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Demo Presentation Controls"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 max-w-xl z-40 bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-slate-800 animate-in slide-in-from-bottom duration-200"
    >
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-teal-500/20 text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-black tracking-wide text-white">
            Quick Presentation Bar
          </span>
          <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
            (Switch personas instantly to pitch or demo)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'doctor') && (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-[11px] font-black flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
            >
              <span>{currentUser.role === 'admin' ? 'Admin Live Telemetry' : 'Doctor OPD Console'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
            aria-label="Minimize demo bar"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = currentUser?.role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-xs scale-102'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{r.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
