import React from 'react';
import {
  X,
  Building2,
  Ambulance,
  FlaskConical,
  TrendingUp,
  Activity,
  Users,
  ShieldCheck,
  Radio,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types/user';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">OneCare Command Center</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  LIVE ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as {user.name} ({user.title})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close admin console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Beds Active
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">147 / 180</div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3" /> 33 Free Now
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                108 Dispatches Today
              </span>
              <div className="text-2xl font-black text-red-600 mt-1">42</div>
              <span className="text-[11px] font-bold text-slate-600 mt-1 block">
                Avg ETA: 8.4 mins
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lab Tests Processed
              </span>
              <div className="text-2xl font-black text-teal-700 mt-1">318</div>
              <span className="text-[11px] font-bold text-teal-700 mt-1 block">
                5 Partner Labs Online
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Gross Platform Vol
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹1,42,850</div>
              <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
                +18.4% this week
              </span>
            </div>
          </div>

          {/* Hospital Bed Live Allocation Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-600" />
                Live Patna Hospital Emergency Network
              </h3>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                Telemetry Active
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Hospital Name</th>
                    <th className="py-2.5 px-3">General</th>
                    <th className="py-2.5 px-3">ICU</th>
                    <th className="py-2.5 px-3">NICU</th>
                    <th className="py-2.5 px-3">Ventilator</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">AIIMS Patna</td>
                    <td className="py-2.5 px-3">22</td>
                    <td className="py-2.5 px-3 font-bold text-red-600">6</td>
                    <td className="py-2.5 px-3">3</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">4</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Accepting
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Paras HMRI Hospital</td>
                    <td className="py-2.5 px-3">18</td>
                    <td className="py-2.5 px-3 font-bold text-red-600">5</td>
                    <td className="py-2.5 px-3">2</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">3</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Accepting
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Ruban Memorial Hospital</td>
                    <td className="py-2.5 px-3">15</td>
                    <td className="py-2.5 px-3 font-bold text-red-600">3</td>
                    <td className="py-2.5 px-3">1</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">2</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Accepting
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-900">Big Apollo Spectra</td>
                    <td className="py-2.5 px-3">20</td>
                    <td className="py-2.5 px-3 font-bold text-red-600">5</td>
                    <td className="py-2.5 px-3">2</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">3</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Accepting
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Ambulance Fleet */}
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-red-600" />
              Active Ambulance Dispatches (Live GPS Tracking)
            </h3>
            <div className="space-y-2">
              {[
                { id: 'AMB-108-01', tier: 'ICU on Wheels', driver: 'Manoj Kumar', destination: 'Paras HMRI Hospital', eta: '4 mins away', status: 'En-route' },
                { id: 'AMB-108-04', tier: 'Advanced Life Support (ALS)', driver: 'Sunil Prasad', destination: 'AIIMS Patna', eta: '8 mins away', status: 'Patient Onboard' },
                { id: 'AMB-108-09', tier: 'Basic Life Support (BLS)', driver: 'Amit Singh', destination: 'Big Apollo Spectra', eta: '11 mins away', status: 'Dispatched' },
              ].map((amb) => (
                <div key={amb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{amb.id}</span> •{' '}
                    <span className="text-red-700 font-semibold">{amb.tier}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Driver: {amb.driver} → {amb.destination} ({amb.eta})
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[11px]">
                    {amb.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">OneCare Special Command System v2.4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
