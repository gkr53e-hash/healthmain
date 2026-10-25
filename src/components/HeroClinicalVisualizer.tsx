import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Activity,
  Brain,
  Video,
  Mic,
  MessageSquare,
  ShieldCheck,
  Building2,
  FlaskConical,
  Ambulance,
  Radio,
  Sparkles,
  Zap,
  Eye,
  CheckCircle2,
  Stethoscope,
  Maximize2,
  PhoneCall,
  User,
} from 'lucide-react';

interface HeroClinicalVisualizerProps {
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
  onOpenSOS: () => void;
}

type VisualizerMode = 'biometric' | 'teleconsult' | 'radar';

interface VitalNode {
  id: string;
  name: string;
  icon: React.ElementType;
  x: string;
  y: string;
  status: string;
  metric: string;
  detail: string;
  color: string;
}

const VITAL_NODES: VitalNode[] = [
  {
    id: 'neural',
    name: 'Neural Cortex Triage',
    icon: Brain,
    x: '50%',
    y: '18%',
    status: 'Optimal (99.8%)',
    metric: 'Cognitive Sync',
    detail: 'AI Symptom & Multilingual Voice triage active',
    color: 'teal',
  },
  {
    id: 'cardiac',
    name: 'Cardio Telemetry',
    icon: HeartPulse,
    x: '46%',
    y: '34%',
    status: '72 BPM Steady',
    metric: 'Sinus Rhythm',
    detail: 'QRS interval 88ms • Normal ST segment',
    color: 'rose',
  },
  {
    id: 'respiratory',
    name: 'Pulmonary SpO2',
    icon: Activity,
    x: '54%',
    y: '42%',
    status: '99% Saturation',
    metric: 'Tidal Flow 16/min',
    detail: 'Lungs clear • Bilateral air entry normal',
    color: 'cyan',
  },
  {
    id: 'metabolic',
    name: 'Vascular & Glucose',
    icon: Zap,
    x: '50%',
    y: '58%',
    status: 'BP 118/76 mmHg',
    metric: 'Glucose 94 mg/dL',
    detail: 'NABL Home Lab Sync active (Dr. Lal PathLabs)',
    color: 'emerald',
  },
];

const CONSULT_TRANSCRIPTS = [
  { speaker: 'Dr. Priya Sharma (MD)', text: 'Hello Rahul, I have your CBC & Thyroid reports open on my screen.' },
  { speaker: 'Rahul (Patient)', text: 'Thank you doctor! Platelets are normal now?' },
  { speaker: 'Dr. Priya Sharma (MD)', text: 'Yes, 2.45 Lacs. All markers look healthy. I am issuing the prescription now.' },
  { speaker: 'OneCare AI Assistant', text: 'Prescription encrypted & routed to Apollo Pharmacy for 45-min delivery.' },
];

export const HeroClinicalVisualizer: React.FC<HeroClinicalVisualizerProps> = ({
  onNavigate,
  onOpenAI,
  onOpenSOS,
}) => {
  const [activeMode, setActiveMode] = useState<VisualizerMode>('biometric');
  const [activeNode, setActiveNode] = useState<VitalNode>(VITAL_NODES[1]); // Cardiac default
  const [callTimer, setCallTimer] = useState<number>(142);
  const [transcriptIndex, setTranscriptIndex] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(72);

  // Live BPM realistic variation
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const next = prev + delta;
        return next >= 70 && next <= 75 ? next : 72;
      });
    }, 2800);
    return () => clearInterval(bpmInterval);
  }, []);

  // Call timer increment
  useEffect(() => {
    if (activeMode !== 'teleconsult') return;
    const timer = setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeMode]);

  // Teleconsult transcript cycling
  useEffect(() => {
    if (activeMode !== 'teleconsult') return;
    const transcriptTimer = setInterval(() => {
      setTranscriptIndex((prev) => (prev + 1) % CONSULT_TRANSCRIPTS.length);
    }, 4000);
    return () => clearInterval(transcriptTimer);
  }, [activeMode]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-teal-500/30 shadow-[0_0_40px_rgba(13,148,136,0.18)] bg-slate-950/95 backdrop-blur-2xl group transition-all duration-500">
      {/* Top Header Mode Navigation Strip */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 z-20 relative">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMode('biometric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'biometric'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AI Vitals Scan</span>
          </button>

          <button
            onClick={() => setActiveMode('teleconsult')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'teleconsult'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Tele-Consult</span>
          </button>

          <button
            onClick={() => setActiveMode('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'radar'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>108 Radar</span>
          </button>
        </div>

        {/* Live System Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 pr-1">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            TELEMETRY LIVE
          </span>
        </div>
      </div>

      {/* Main Animated Display Area */}
      <div className="relative h-[390px] sm:h-[430px] overflow-hidden bg-gradient-to-b from-slate-950 via-[#060d1a] to-slate-950 flex flex-col justify-between p-4">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-cyber-grid opacity-60 pointer-events-none" />

        {/* =========================================================================
            MODE 1: AI BIOMETRIC HOLOGRAPHIC SCANNER
           ========================================================================= */}
        {activeMode === 'biometric' && (
          <div className="relative w-full h-full flex flex-col justify-between z-10 animate-fadeIn">
            {/* Holographic Body Container */}
            <div className="relative flex-1 flex items-center justify-center py-2">
              {/* Animated Laser Scanning Line */}
              <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf] animate-scanline z-20 pointer-events-none" />

              {/* Holographic Human Biometric Silhouette & Scanning Rings */}
              <div className="relative w-48 h-64 flex items-center justify-center">
                {/* Concentric Hologram Scanning Pulse Rings */}
                <div className="absolute w-52 h-52 rounded-full border border-teal-500/20 animate-ping opacity-25 pointer-events-none" />
                <div className="absolute w-40 h-40 rounded-full border border-teal-400/30 animate-pulse pointer-events-none" />

                {/* SVG Anatomical Human Body Holographic Wireframe */}
                <svg
                  viewBox="0 0 200 320"
                  className="w-full h-full drop-shadow-[0_0_16px_rgba(20,184,166,0.35)]"
                  fill="none"
                  stroke="currentColor"
                >
                  {/* Head */}
                  <ellipse cx="100" cy="50" rx="22" ry="28" stroke="#14b8a6" strokeWidth="1.6" strokeDasharray="3 2" opacity="0.8" />
                  <circle cx="100" cy="50" r="14" stroke="#2dd4bf" strokeWidth="1" opacity="0.5" />
                  {/* Neck */}
                  <line x1="95" y1="78" x2="95" y2="92" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6" />
                  <line x1="105" y1="78" x2="105" y2="92" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6" />
                  {/* Torso & Shoulders */}
                  <path
                    d="M 60 98 Q 100 88 140 98 L 132 180 Q 100 188 68 180 Z"
                    stroke="#0d9488"
                    strokeWidth="1.6"
                    strokeDasharray="4 2"
                    opacity="0.85"
                  />
                  {/* Rib Cage Lines */}
                  <path d="M 76 118 Q 100 128 124 118" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.6" />
                  <path d="M 78 134 Q 100 144 122 134" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.6" />
                  <path d="M 80 150 Q 100 160 120 150" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.6" />
                  {/* Spine Center Flow */}
                  <line x1="100" y1="92" x2="100" y2="182" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.7" />
                  {/* Arms */}
                  <path d="M 60 98 L 44 165 L 36 215" stroke="#0d9488" strokeWidth="1.4" opacity="0.6" />
                  <path d="M 140 98 L 156 165 L 164 215" stroke="#0d9488" strokeWidth="1.4" opacity="0.6" />
                  {/* Pelvis & Legs */}
                  <path d="M 72 180 L 80 250 L 78 310" stroke="#0d9488" strokeWidth="1.4" opacity="0.6" />
                  <path d="M 128 180 L 120 250 L 122 310" stroke="#0d9488" strokeWidth="1.4" opacity="0.6" />
                  {/* Vital Coordinates Grid Crosshairs */}
                  <circle cx="100" cy="115" r="5" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping opacity-60" />
                </svg>

                {/* Interactive Pulsing Anatomy Vital Points */}
                {VITAL_NODES.map((node) => {
                  const isSelected = activeNode.id === node.id;
                  const IconComp = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveNode(node)}
                      style={{ top: node.y, left: node.x }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 z-30 group ${
                        isSelected
                          ? 'bg-teal-400 text-slate-950 scale-125 shadow-[0_0_20px_#2dd4bf]'
                          : 'bg-slate-900/90 text-teal-300 border border-teal-500/50 hover:scale-115'
                      }`}
                      title={node.name}
                    >
                      <IconComp className="w-3.5 h-3.5 animate-pulse" />
                      {/* Pulse beacon ring around node */}
                      <span className="absolute inset-0 rounded-full border border-teal-400 animate-ripple-ping pointer-events-none" />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic HUD Vital Inspection Callout Box */}
              <div className="absolute right-2 top-2 max-w-[190px] p-2.5 rounded-2xl bg-slate-900/95 border border-teal-500/40 backdrop-blur-md shadow-xl text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>{activeNode.name}</span>
                </div>
                <div className="text-sm font-black text-white">{activeNode.status}</div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">{activeNode.detail}</div>
                <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] text-teal-300 font-bold">
                  <span>AI Confidence</span>
                  <span className="text-emerald-400">99.4%</span>
                </div>
              </div>

              {/* Top Left Floating AI Care Badge */}
              <div className="absolute left-2 top-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">AI Diagnostic Engine</div>
                <div className="text-xs font-black text-white flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span>OneCare Cortex-4</span>
                </div>
                {/* Mini audio equalizer wave */}
                <div className="flex items-end gap-0.5 h-4 mt-1.5">
                  <div className="w-1 bg-teal-400 rounded-full animate-audio-1" />
                  <div className="w-1 bg-cyan-400 rounded-full animate-audio-2" />
                  <div className="w-1 bg-teal-300 rounded-full animate-audio-3" />
                  <div className="w-1 bg-emerald-400 rounded-full animate-audio-4" />
                  <div className="w-1 bg-teal-400 rounded-full animate-audio-5" />
                </div>
              </div>
            </div>

            {/* Continuous Live Hospital ECG Monitor Waveform */}
            <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800/90 backdrop-blur-md mt-2">
              <div className="flex items-center justify-between text-[11px] mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-teal-400">
                  <HeartPulse className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>Live Dynamic ECG</span>
                </span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span>Normal Sinus Rhythm</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[10px]">
                    {bpm} BPM
                  </span>
                </span>
              </div>

              {/* Animated ECG SVG Path */}
              <div className="w-full h-7 overflow-hidden flex items-center bg-slate-950/70 rounded-lg px-2 border border-slate-800/60">
                <svg
                  className="w-full h-full stroke-teal-400 fill-none"
                  viewBox="0 0 320 28"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 14 L 35 14 L 42 6 L 50 22 L 58 14 L 95 14 L 102 4 L 110 24 L 118 14 L 160 14 L 168 5 L 176 23 L 184 14 L 225 14 L 232 7 L 240 21 L 248 14 L 320 14"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2: REAL-TIME TELE-CONSULT SUITE
           ========================================================================= */}
        {activeMode === 'teleconsult' && (
          <div className="relative w-full h-full flex flex-col justify-between z-10 animate-fadeIn">
            {/* Main Video Screen with Doctor & PIP Patient */}
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-inner flex flex-col justify-between p-3.5">
              {/* Doctor Avatar & Video Frame Graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-slate-900/90 to-slate-950 flex items-center justify-center pointer-events-none">
                {/* Doctor animated graphic representation */}
                <div className="relative text-center">
                  <div className="relative w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border-2 border-slate-900">
                      <Stethoscope className="w-12 h-12 text-teal-400 animate-pulse" />
                    </div>
                    {/* Live Video Indicator Beacon */}
                    <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                  </div>
                  <div className="mt-2 text-white font-black text-sm">Dr. Priya Sharma</div>
                  <div className="text-[11px] text-teal-300 font-bold">MD, Medicine (AIIMS Patna) • 12 yrs exp</div>
                </div>
              </div>

              {/* Top Controls Overlay */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-slate-950/90 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>HD ENCRYPTED VIDEO • {formatTimer(callTimer)}</span>
                </span>

                <span className="px-2 py-0.5 rounded-md bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold">
                  24ms LATENCY
                </span>
              </div>

              {/* Patient Picture-in-Picture Mini Box */}
              <div className="absolute top-12 right-3 w-20 h-24 rounded-xl bg-slate-950/90 border border-slate-700/80 overflow-hidden shadow-2xl p-1.5 flex flex-col justify-between z-20">
                <div className="flex items-center justify-between text-[8px] text-slate-400">
                  <span>YOU</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="w-full h-12 rounded-lg bg-slate-800/80 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-300" />
                </div>
                <div className="text-[8px] font-bold text-slate-300 text-center truncate">Rahul (Patient)</div>
              </div>

              {/* Live Animated Speech Transcript Box */}
              <div className="relative z-10 mt-auto p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-teal-400 uppercase tracking-wider mb-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{CONSULT_TRANSCRIPTS[transcriptIndex].speaker}</span>
                </div>
                <div className="text-xs text-slate-200 font-medium leading-relaxed italic">
                  "{CONSULT_TRANSCRIPTS[transcriptIndex].text}"
                </div>
              </div>

              {/* Call Control Strip */}
              <div className="relative z-10 mt-2 flex items-center justify-center gap-3">
                <button
                  title="Microphone Active"
                  className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Camera Active"
                  className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-all cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('opd')}
                  className="px-3 py-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Book Slot</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 3: 108 EMERGENCY GPS RADAR
           ========================================================================= */}
        {activeMode === 'radar' && (
          <div className="relative w-full h-full flex flex-col justify-between z-10 animate-fadeIn">
            {/* Radar Viewport */}
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-rose-500/30 bg-slate-900/90 flex items-center justify-center bg-radar-grid">
              {/* Rotating Radar Sweep Line */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-rose-500/20 relative animate-radar-sweep">
                  <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-bl from-rose-500/30 to-transparent transform -translate-x-full origin-bottom-right" />
                  <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-rose-500/60 shadow-[0_0_8px_#f43f5e]" />
                </div>
              </div>

              {/* Radar Concentric Distance Rings */}
              <div className="absolute w-56 h-56 rounded-full border border-rose-500/20 pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full border border-rose-500/20 pointer-events-none" />
              <div className="absolute w-16 h-16 rounded-full border border-rose-500/30 pointer-events-none" />
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10" />

              {/* Ambulance Blip 1: Bailey Road */}
              <div className="absolute top-16 left-12 flex items-center gap-1.5 z-20 animate-float-gentle">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-rose-500/40 text-[9px] font-bold text-rose-300">
                  🚑 108-A4 (Bailey Rd) • 6m ETA
                </span>
              </div>

              {/* Ambulance Blip 2: Kankarbagh */}
              <div className="absolute bottom-20 right-8 flex items-center gap-1.5 z-20 animate-float-delayed">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-rose-500/40 text-[9px] font-bold text-rose-300">
                  🚑 108-C1 (Kankarbagh) • 9m ETA
                </span>
              </div>

              {/* Hospital ICU Marker: Paras HMRI */}
              <div className="absolute top-24 right-14 flex items-center gap-1.5 z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-teal-500/40 text-[8px] font-bold text-teal-300">
                  🏥 Paras HMRI (14 Beds)
                </span>
              </div>

              {/* Radar Status Badge */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/90 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1.5">
                <Ambulance className="w-3.5 h-3.5 text-rose-400" />
                <span>108 RAPID FLEET DISPATCH</span>
              </div>

              {/* Quick Trigger Button */}
              <button
                onClick={onOpenSOS}
                className="absolute bottom-2 left-2 right-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Trigger Instant 108 Dispatch</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            BOTTOM ACTIONS: Live Beds in Patna & Test Booking
           ========================================================================= */}
        <div className="mt-3 flex items-center justify-between gap-3 z-20">
          <div
            onClick={() => onNavigate('emergency')}
            className="p-2.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 hover:border-rose-500/50 transition-all flex items-center gap-3 cursor-pointer flex-1 group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                Live Beds in Patna
              </div>
              <div className="text-base font-black text-white flex items-center gap-1.5">
                <span>147 Free</span>
                <span className="text-[10px] text-emerald-400 font-bold">(33 ICU)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lab-tests')}
            className="px-4 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/25 cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Book Tests</span>
          </button>
        </div>
      </div>
    </div>
  );
};
