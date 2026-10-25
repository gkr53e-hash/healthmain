import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Video,
  Clock,
  User,
  FileText,
  CheckCircle2,
  Calendar,
  Send,
  Plus,
} from 'lucide-react';
import { UserProfile } from '../types/user';

interface DoctorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const DoctorPortalModal: React.FC<DoctorPortalModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [inCall, setInCall] = useState(false);
  const [activePatient, setActivePatient] = useState('Rahul Sharma');
  const [rxIssued, setRxIssued] = useState(false);
  const [rxMedicine, setRxMedicine] = useState('Pantoprazole 40mg (OD), Multivitamin (BD)');
  const [rxLabTest, setRxLabTest] = useState('Lipid Profile, HbA1c');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-teal-700 to-cyan-800 text-white">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{user.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                  DOCTOR CONSOLE
                </span>
              </div>
              <p className="text-xs text-teal-100">{user.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close doctor console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          {/* Active Call Simulator */}
          {inCall ? (
            <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center ring-8 ring-teal-500/10">
                <Video className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <span className="px-2.5 py-1 bg-red-600 text-white font-bold text-xs rounded-full inline-block mb-1">
                  🔴 LIVE TELE-CONSULTATION
                </span>
                <h3 className="text-xl font-bold">Consulting with {activePatient}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Encrypted HD WebRTC Video Stream Active • 04:12 mins
                </p>
              </div>

              {/* Rx form inside call */}
              <div className="bg-slate-800 p-4 rounded-2xl text-left text-xs space-y-3">
                <span className="font-bold uppercase tracking-wider text-teal-400 block">
                  Quick Digital Prescription (Auto-Routes to Patient & Pharmacy)
                </span>
                <div>
                  <label className="text-slate-400 block mb-1">Prescribed Medicines</label>
                  <input
                    type="text"
                    value={rxMedicine}
                    onChange={(e) => setRxMedicine(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white text-xs outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Recommended Lab Tests</label>
                  <input
                    type="text"
                    value={rxLabTest}
                    onChange={(e) => setRxLabTest(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white text-xs outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {rxIssued ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4" /> e-Rx signed & sent to patient
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRxIssued(true)}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Sign & Issue e-Prescription</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setInCall(false);
                      setRxIssued(false);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    End Consultation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Today's Appointments Queue */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-700" />
                    Today's Consultation Schedule (3 Patients)
                  </h3>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    Online & Ready
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Rahul Sharma', age: 32, slot: '04:30 PM (Now Ready)', chiefComplaint: 'Chest tightness, elevated blood pressure', type: 'Video Call' },
                    { name: 'Ananya Verma', age: 29, slot: '05:00 PM', chiefComplaint: 'Follow-up for Thyroid panel and iron supplement', type: 'Video Call' },
                    { name: 'Vikram Roy', age: 54, slot: '05:30 PM', chiefComplaint: 'Post-ECG consultation & treadmill review', type: 'Clinic Visit' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{p.name}</span>
                          <span className="text-xs text-slate-500 font-medium">({p.age} yrs)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {p.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Reason: <span className="font-medium text-slate-800">{p.chiefComplaint}</span>
                        </p>
                        <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> Slot: {p.slot}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setActivePatient(p.name);
                            setInCall(true);
                          }}
                          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Video Consult</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">OPD Video Room powered by OneCare Special HD Tele-Health</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
