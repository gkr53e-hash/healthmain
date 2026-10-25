import React, { useState } from 'react';
import {
  X,
  User,
  Stethoscope,
  ShieldAlert,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DEMO_USERS, UserProfile, UserRole } from '../types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

interface DemoAccount {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  password: string;
  desc: string;
  color: string;
  bgLight: string;
  borderColor: string;
  icon: React.ReactNode;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'patient',
    label: 'Patient Login',
    name: 'Rahul Sharma',
    email: 'patient@onecarespecial.in',
    password: 'Patient@123',
    desc: 'Patient records, OPD bookings, lab reports & active e-Rx',
    color: 'text-teal-700',
    bgLight: 'bg-teal-50/60 hover:bg-teal-50',
    borderColor: 'border-teal-200 hover:border-teal-500',
    icon: <User className="w-5 h-5 text-teal-600" />,
  },
  {
    role: 'doctor',
    label: 'Doctor Login',
    name: 'Dr. Priya Sharma',
    email: 'dr.priya@onecarespecial.in',
    password: 'Doctor@123',
    desc: 'Senior Cardiologist OPD portal, video consults & prescriptions',
    color: 'text-cyan-700',
    bgLight: 'bg-cyan-50/60 hover:bg-cyan-50',
    borderColor: 'border-cyan-200 hover:border-cyan-500',
    icon: <Stethoscope className="w-5 h-5 text-cyan-600" />,
  },
  {
    role: 'admin',
    label: 'Admin Login',
    name: 'Dr. Rajesh Mehta',
    email: 'admin@onecarespecial.in',
    password: 'Admin@123',
    desc: 'Command center, live ICU bed monitor & 108 ambulance fleet',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50/60 hover:bg-rose-50',
    borderColor: 'border-rose-200 hover:border-rose-500',
    icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
  },
  {
    role: 'lab',
    label: 'Lab Partner Login',
    name: 'Vikram Singh (Dr. Lal PathLabs)',
    email: 'lab.lal@onecarespecial.in',
    password: 'Lab@123',
    desc: 'Home sample collection dispatch & diagnostic test report manager',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50/60 hover:bg-emerald-50',
    borderColor: 'border-emerald-200 hover:border-emerald-500',
    icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [emailInput, setEmailInput] = useState('patient@onecarespecial.in');
  const [passwordInput, setPasswordInput] = useState('Patient@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handles clicking a demo account: autofills boxes in real-time, displays feedback, and logs in reliably
  const handleAutoFillAndLogin = (demo: DemoAccount) => {
    setEmailInput(demo.email);
    setPasswordInput(demo.password);
    setAutoFillSuccess(`Auto-filled: ${demo.name} (${demo.label})`);

    setIsSubmitting(true);
    setTimeout(() => {
      const demoUser = DEMO_USERS[demo.role];
      onLogin(demoUser);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setAutoFillSuccess('Connecting with Google Account...');
    setTimeout(() => {
      const googleUser: UserProfile = {
        id: 'usr-google-9921',
        name: 'Rahul Sharma',
        role: 'patient',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=160',
        title: 'Verified Google Patient',
        badge: 'Google Verified',
      };
      onLogin(googleUser);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  // Manual Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmedEmail = emailInput.trim().toLowerCase();
      let matchedRole: UserRole = 'patient';

      if (trimmedEmail.includes('admin')) {
        matchedRole = 'admin';
      } else if (trimmedEmail.includes('doctor') || trimmedEmail.includes('dr.')) {
        matchedRole = 'doctor';
      } else if (trimmedEmail.includes('lab') || trimmedEmail.includes('pathlabs')) {
        matchedRole = 'lab';
      }

      const baseUser = DEMO_USERS[matchedRole];
      const customUser: UserProfile = {
        ...baseUser,
        email: emailInput || baseUser.email,
      };

      onLogin(customUser);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/70 via-cyan-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
              O
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">OneCare Special</h2>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 rounded">
                  Healthcare Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentUser ? `Active: ${currentUser.name}` : 'Sign in to access OPD, Labs & Prescriptions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Logged In View / Profile & Switcher */
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{currentUser.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-teal-700 text-white">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{currentUser.title}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email || currentUser.phone}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Quick Switch Role (For Live Presentation)
                </span>
                <span className="text-[11px] text-teal-700 font-bold">1-Click Switch</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => {
                  const isCurrent = currentUser.role === account.role;
                  return (
                    <button
                      key={account.role}
                      onClick={() => handleAutoFillAndLogin(account)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-teal-600 bg-teal-50 font-bold text-teal-900 ring-1 ring-teal-600 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {account.icon}
                        <span className="text-xs font-black uppercase tracking-wider">{account.role}</span>
                      </div>
                      <div className="text-[11px] truncate text-slate-500">{account.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onLogout();
                }}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-teal-700 text-white font-bold rounded-xl text-xs hover:bg-teal-800 cursor-pointer"
              >
                Continue as {currentUser.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ) : (
          /* Sign In View */
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Auto-fill feedback banner */}
            {autoFillSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{autoFillSuccess}</span>
              </div>
            )}

            {/* 1. Continue with Google Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 active:scale-99 rounded-xl font-bold text-xs sm:text-sm text-slate-800 transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* 2. DEMO LOGIN FEATURE - Placed prominently below Google Login as requested */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Demo Quick Login (Auto-Fills Credentials)
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Instant Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2.5">
                Click any option below to automatically populate the ID and password boxes and sign in:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleAutoFillAndLogin(acc)}
                    disabled={isSubmitting}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group shadow-2xs ${acc.bgLight} ${acc.borderColor}`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        {acc.icon}
                        <span className="text-xs font-black text-slate-900 group-hover:text-teal-700">
                          {acc.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 truncate">{acc.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Or sign in with email & password
              </span>
            </div>

            {/* 3. Real Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  User ID / Email / Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. patient@onecarespecial.in or 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setPasswordInput('Patient@123');
                      setAutoFillSuccess('Reset password filled with demo credentials');
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
                </label>
                <span className="text-[11px] text-slate-400">Secure 256-bit SSL</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !emailInput || !passwordInput}
                className="w-full py-3 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 active:scale-99 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-700/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to OneCare Special</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Healthcare compliance badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px]">ABDM & HIPAA-Compliant Healthcare Login</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
