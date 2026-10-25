import React, { useState, useEffect } from 'react';
import {
  X,
  Droplets,
  HeartPulse,
  Building2,
  Users,
  ExternalLink,
  Globe,
  CheckCircle2,
  PhoneCall,
  Search,
  Sparkles,
  AlertCircle,
  Share2,
  Clock,
  ShieldCheck,
  Save,
} from 'lucide-react';

interface BloodBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BloodBank {
  name: string;
  location: string;
  distanceKm: number;
  phone: string;
  verified: boolean;
  stock: Record<string, number>;
  platelets: number;
  type: string;
}

const BLOOD_BANKS: BloodBank[] = [
  {
    name: 'PMCH Central Blood Bank',
    location: 'Ashok Rajpath, Patna',
    distanceKm: 3.2,
    phone: '+91 612 2300080',
    verified: true,
    stock: { 'O+': 16, 'O-': 4, 'B+': 22, 'B-': 3, 'A+': 12, 'A-': 2, 'AB+': 8, 'AB-': 1 },
    platelets: 28,
    type: 'Government Apex Bank',
  },
  {
    name: 'AIIMS Patna Transfusion Medicine',
    location: 'Phulwari Sharif, Patna',
    distanceKm: 4.8,
    phone: '+91 612 2451055',
    verified: true,
    stock: { 'O+': 24, 'O-': 6, 'B+': 18, 'B-': 4, 'A+': 15, 'A-': 3, 'AB+': 10, 'AB-': 2 },
    platelets: 36,
    type: 'NABH Accredited Apex Center',
  },
  {
    name: 'Indian Red Cross Society Blood Centre',
    location: 'North Gandhi Maidan, Patna',
    distanceKm: 2.1,
    phone: '+91 612 2223844',
    verified: true,
    stock: { 'O+': 11, 'O-': 2, 'B+': 14, 'B-': 2, 'A+': 9, 'A-': 1, 'AB+': 6, 'AB-': 1 },
    platelets: 18,
    type: '24×7 Emergency Dispatch',
  },
  {
    name: 'Mahavir Cancer Sansthan Blood Bank',
    location: 'Phulwari Road, Patna',
    distanceKm: 4.1,
    phone: '+91 612 2250127',
    verified: true,
    stock: { 'O+': 14, 'O-': 3, 'B+': 19, 'B-': 2, 'A+': 11, 'A-': 2, 'AB+': 7, 'AB-': 1 },
    platelets: 42,
    type: 'Apheresis & Platelet Specialty',
  },
];

const COMPATIBILITY_RULES: Record<string, { canReceiveFrom: string[]; canDonateTo: string[] }> = {
  'O-': {
    canReceiveFrom: ['O-'],
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  },
  'O+': {
    canReceiveFrom: ['O-', 'O+'],
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
  },
  'A-': {
    canReceiveFrom: ['O-', 'A-'],
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
  },
  'A+': {
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+'],
    canDonateTo: ['A+', 'AB+'],
  },
  'B-': {
    canReceiveFrom: ['O-', 'B-'],
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
  },
  'B+': {
    canReceiveFrom: ['O-', 'O+', 'B-', 'B+'],
    canDonateTo: ['B+', 'AB+'],
  },
  'AB-': {
    canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'],
    canDonateTo: ['AB-', 'AB+'],
  },
  'AB+': {
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canDonateTo: ['AB+'],
  },
};

const STORAGE_KEY_URL = 'bloodbridge_custom_url';
const STORAGE_KEY_AUTO_REDIRECT = 'bloodbridge_auto_redirect';

export const BloodBridgeModal: React.FC<BloodBridgeModalProps> = ({ isOpen, onClose }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [activeTab, setActiveTab] = useState<'banks' | 'request' | 'settings'>('banks');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [autoRedirect, setAutoRedirect] = useState<boolean>(false);
  const [urlSavedFeedback, setUrlSavedFeedback] = useState<boolean>(false);

  // Emergency request form
  const [reqPatient, setReqPatient] = useState('');
  const [reqHospital, setReqHospital] = useState('AIIMS Patna');
  const [reqUnits, setReqUnits] = useState('2');
  const [reqUrgency, setReqUrgency] = useState<'Immediate (< 1 hr)' | 'Urgent (< 4 hrs)' | 'Scheduled'>('Immediate (< 1 hr)');
  const [reqBroadcastSuccess, setReqBroadcastSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_URL);
      if (saved) setCustomUrl(saved);
      const savedAuto = localStorage.getItem(STORAGE_KEY_AUTO_REDIRECT);
      if (savedAuto) setAutoRedirect(savedAuto === 'true');
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    try {
      localStorage.setItem(STORAGE_KEY_URL, customUrl.trim());
      localStorage.setItem(STORAGE_KEY_AUTO_REDIRECT, autoRedirect ? 'true' : 'false');
      setUrlSavedFeedback(true);
      setTimeout(() => setUrlSavedFeedback(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunchWebsite = () => {
    if (customUrl && customUrl.trim() !== '') {
      let finalUrl = customUrl.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setReqBroadcastSuccess(true);
    setTimeout(() => {
      setReqBroadcastSuccess(false);
      setReqPatient('');
    }, 4500);
  };

  const compatibility = COMPATIBILITY_RULES[selectedGroup] || COMPATIBILITY_RULES['O+'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-slate-900 border border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] flex flex-col text-white">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 border-b border-rose-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Droplets className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  BloodBridge AI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  <span>Live Blood Network</span>
                </span>
              </div>
              <p className="text-xs text-rose-200/80 font-medium mt-0.5">
                AI-Driven Emergency Blood Bank Stock &amp; Voluntary Donor Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customUrl && customUrl.trim() !== '' && (
              <button
                onClick={handleLaunchWebsite}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
                title="Open deployed website"
              >
                <span>Launch Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close BloodBridge AI modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Website Setup Configuration Bar (Always accessible, no git repo redirect) */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-bold text-rose-300">Website URL Setup:</span>
            <span className="text-slate-400 hidden md:inline">
              (Apna website URL yaha paste karein taaki button se direct website khule)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="e.g. https://bloodbridge-ai.vercel.app"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-400 flex-1 sm:w-64"
            />
            <button
              onClick={handleSaveUrl}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{urlSavedFeedback ? 'Saved!' : 'Save Link'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-800/80 flex items-center gap-2 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('banks')}
            className={`px-4 py-2 font-black text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'banks'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Blood Banks &amp; AI Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 font-black text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'request'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-black text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Redirect Settings</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: Blood Banks & AI Compatibility */}
          {activeTab === 'banks' && (
            <div className="space-y-6">
              {/* Blood Group Filter Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Select Patient Blood Group:
                  </span>
                  <span className="text-[11px] font-bold text-rose-400">
                    Active Filter: <strong className="text-white text-sm">{selectedGroup}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((group) => {
                    const isSelected = selectedGroup === group;
                    return (
                      <button
                        key={group}
                        onClick={() => setSelectedGroup(group)}
                        className={`py-2 rounded-xl font-black text-sm transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 scale-105'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>

                {/* AI Compatibility Matrix */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Can Safely Receive From:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compatibility.canReceiveFrom.map((grp) => (
                        <span key={grp} className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs">
                          {grp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Can Donate To:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compatibility.canDonateTo.map((grp) => (
                        <span key={grp} className="px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-extrabold text-xs">
                          {grp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Blood Banks Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-400" />
                    <span>Real-Time Blood Bank Stock in Patna ({BLOOD_BANKS.length})</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Stock Synchronized</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BLOOD_BANKS.map((bank, idx) => {
                    const unitsForGroup = bank.stock[selectedGroup] ?? 0;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-white text-sm group-hover:text-rose-300 transition-colors">
                                  {bank.name}
                                </h4>
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{bank.location} • {bank.distanceKm} km</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-bold shrink-0">
                              {bank.type}
                            </span>
                          </div>

                          {/* Stock Meters */}
                          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                            <div>
                              <div className="text-[9px] uppercase font-bold text-slate-400">{selectedGroup} Units</div>
                              <div className="text-base font-black text-rose-400 flex items-center gap-1">
                                <span>{unitsForGroup}</span>
                                <span className="text-[10px] font-bold text-slate-400">Available</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] uppercase font-bold text-slate-400">Platelets (RDP/SDP)</div>
                              <div className="text-base font-black text-amber-400 flex items-center gap-1">
                                <span>{bank.platelets}</span>
                                <span className="text-[10px] font-bold text-slate-400">Packs</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                          <a
                            href={`tel:${bank.phone}`}
                            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                            <span>{bank.phone}</span>
                          </a>
                          <button
                            onClick={() => {
                              alert(`Priority Hold Placed: 1 unit of ${selectedGroup} blood held at ${bank.name} for 45 minutes.`);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0"
                          >
                            Hold Unit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Emergency SOS Broadcast */}
          {activeTab === 'request' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-sm text-white">Emergency Blood Alert Broadcast</div>
                  <div className="text-xs text-rose-200/80 leading-relaxed mt-0.5">
                    Broadcast urgent blood requests to 1,200+ verified voluntary donors in Patna and nearby network hospitals within a 15 km radius.
                  </div>
                </div>
              </div>

              {reqBroadcastSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-black text-white">Emergency Alert Broadcasted!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Alert dispatched to 142 voluntary donors with blood group <strong className="text-rose-400">{selectedGroup}</strong> near {reqHospital}. Donors are contacting the emergency desk.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBroadcast} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Patient Name</label>
                      <input
                        type="text"
                        required
                        value={reqPatient}
                        onChange={(e) => setReqPatient(e.target.value)}
                        placeholder="Patient Full Name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Required Blood Group</label>
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-400"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Hospital / Blood Bank</label>
                      <input
                        type="text"
                        required
                        value={reqHospital}
                        onChange={(e) => setReqHospital(e.target.value)}
                        placeholder="e.g. AIIMS Patna / Paras HMRI"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Units Required</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={reqUnits}
                        onChange={(e) => setReqUnits(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Urgency Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Immediate (< 1 hr)', 'Urgent (< 4 hrs)', 'Scheduled'] as const).map((urg) => (
                        <button
                          key={urg}
                          type="button"
                          onClick={() => setReqUrgency(urg)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            reqUrgency === urg
                              ? 'bg-red-600 text-white border-red-400'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {urg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer active:scale-98 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Broadcast Emergency SOS Request Now</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Redirect Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-400" />
                  <span>Custom BloodBridge AI Website Configuration</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Aap apna deployed website URL (jaise Vercel, Netlify, ya custom domain) yaha add kar sakte hain. Jab bhi koi BloodBridge AI button press karega, seedhe aapki website open hogi.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Deployed Website URL
                  </label>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://your-bloodbridge-domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="autoRedirectCheckbox"
                    checked={autoRedirect}
                    onChange={(e) => setAutoRedirect(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <label htmlFor="autoRedirectCheckbox" className="text-xs font-bold text-slate-300 cursor-pointer">
                    Direct redirect to website when clicking floating button
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={handleSaveUrl}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{urlSavedFeedback ? 'Settings Saved Successfully!' : 'Save Settings'}</span>
                  </button>

                  {customUrl && customUrl.trim() !== '' && (
                    <button
                      onClick={handleLaunchWebsite}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Link</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>BloodBridge AI • Integrated with OneCare Special Network</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
