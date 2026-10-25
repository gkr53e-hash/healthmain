import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, ShieldCheck, CheckCircle, Stethoscope, Search } from 'lucide-react';
import { LabPartner, LabTest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';

interface MedHOneAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: LabTest[];
  labs: LabPartner[];
  onBookWithPreselectedTests: (lab: LabPartner, testIds: string[]) => void;
}

interface Recommendation {
  testId: string;
  reason: string;
}

export const MedHOneAIModal: React.FC<MedHOneAIModalProps> = ({
  isOpen,
  onClose,
  tests,
  labs,
  onBookWithPreselectedTests,
}) => {
  const [symptomInput, setSymptomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  if (!isOpen) return null;

  const testMap = new Map(tests.map((t) => [t.id, t]));

  const quickPrompts = [
    {
      title: 'Persistent Fatigue & Hair Fall',
      symptoms: 'Feeling tired constantly, weak, cold intolerance and sudden hair thinning',
      suggested: [
        { testId: 't-thyroid', reason: 'Evaluates hypo/hyperthyroidism causing sluggishness and hair loss' },
        { testId: 't-vit-d', reason: 'Excludes severe Vitamin D3 deficiency common in bone & muscle lethargy' },
        { testId: 't-cbc', reason: 'Checks hemoglobin and hematocrit for anemia' },
      ],
    },
    {
      title: 'Increased Thirst & Frequent Urination',
      symptoms: 'Extreme thirst, waking up at night to urinate, unexpected weight drop',
      suggested: [
        { testId: 't-hba1c', reason: 'Measures 3-month average glucose control to screen for diabetes mellitus' },
        { testId: 't-kft', reason: 'Screens kidney filtration rate and microalbuminuria risk' },
        { testId: 't-urine', reason: 'Checks for glucosuria, protein leakage, and potential urinary tract infection' },
      ],
    },
    {
      title: 'Annual Comprehensive Preventive Health',
      symptoms: 'Routine checkup for age 30+ adults with desk job and family history of metabolic issues',
      suggested: [
        { testId: 't-full-body', reason: 'Comprehensive 85+ parameter profile covering vitals, lipids, renal & hepatic panels' },
        { testId: 't-lipid', reason: 'Cardiovascular assessment of LDL, HDL, and triglycerides' },
      ],
    },
    {
      title: 'Chest Heaviness & Palpitations',
      symptoms: 'Occasional breathlessness after climbing stairs, palpitations, stress',
      suggested: [
        { testId: 't-ecg', reason: 'Detects cardiac rhythm disturbances and electrical conduction abnormalities' },
        { testId: 't-lipid', reason: 'Assesses atherogenic plaque risk factors in blood' },
      ],
    },
  ];

  const handleSelectPrompt = (prompt: typeof quickPrompts[0]) => {
    setSymptomInput(prompt.symptoms);
    setIsAnalyzing(true);
    setTimeout(() => {
      setRecommendations(prompt.suggested);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const q = symptomInput.toLowerCase();
      const recs: Recommendation[] = [];

      if (q.includes('tired') || q.includes('fatigue') || q.includes('weak') || q.includes('hair')) {
        recs.push({ testId: 't-thyroid', reason: 'Check thyroid gland function and metabolic hormone levels' });
        recs.push({ testId: 't-vit-d', reason: 'Evaluate Vitamin D levels affecting energy and bone health' });
        recs.push({ testId: 't-cbc', reason: 'Screen for iron-deficiency anemia and hemoglobin drop' });
      } else if (q.includes('sugar') || q.includes('thirst') || q.includes('diabetes') || q.includes('urine')) {
        recs.push({ testId: 't-hba1c', reason: '3-month gold standard glycemic measurement for diabetes' });
        recs.push({ testId: 't-kft', reason: 'Monitor renal creatinine and electrolyte regulation' });
      } else if (q.includes('chest') || q.includes('heart') || q.includes('breath') || q.includes('bp')) {
        recs.push({ testId: 't-ecg', reason: '12-lead electrocardiogram for heart rhythm screening' });
        recs.push({ testId: 't-lipid', reason: 'Cholesterol profile evaluating arterial plaque risk' });
      } else if (q.includes('liver') || q.includes('alcohol') || q.includes('jaundice') || q.includes('digestion')) {
        recs.push({ testId: 't-lft', reason: 'Hepatic enzymes SGOT/SGPT and bilirubin function evaluation' });
      } else {
        recs.push({ testId: 't-full-body', reason: 'Broad spectrum full body screening covering all essential organ markers' });
        recs.push({ testId: 't-cbc', reason: 'Complete blood count for infection, immunity, and cell indices' });
      }

      setRecommendations(recs);
      setIsAnalyzing(false);
    }, 450);
  };

  const recommendedTestObjects = (recommendations || [])
    .map((r) => ({
      test: testMap.get(r.testId),
      reason: r.reason,
    }))
    .filter((item) => Boolean(item.test)) as { test: LabTest; reason: string }[];

  const totalRecommendedPrice = recommendedTestObjects.reduce((acc, curr) => acc + curr.test.price, 0);

  const handleProceedBooking = () => {
    // Pick the most comprehensive lab (Dr. Lal PathLabs by default)
    const targetLab = labs[0] || labs.find((l) => l.hasHomeCollection) || labs[0];
    const testIds = recommendedTestObjects.map((item) => item.test.id);
    onClose();
    onBookWithPreselectedTests(targetLab, testIds);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-2xl shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-black text-slate-900">Ask OneCare Special AI</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">
                  Diagnostic Triage
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Describe your symptoms for smart test recommendations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close AI modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              What symptoms or health concerns are you experiencing?
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="E.g., Feeling unusually tired for the past 3 weeks, morning joint stiffness, and hair thinning..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-teal-600 resize-none"
              />
              <button
                type="submit"
                disabled={!symptomInput.trim() || isAnalyzing}
                className="absolute right-3 bottom-3 px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-40"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Or select common scenarios
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrompt(p)}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                    {p.symptoms}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendations Result */}
          {recommendations && (
            <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  Recommended Diagnostic Tests
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Total: {formatCurrency(totalRecommendedPrice)}
                </span>
              </div>

              <div className="space-y-2">
                {recommendedTestObjects.map(({ test, reason }) => (
                  <div
                    key={test.id}
                    className="p-3 bg-white rounded-xl border border-teal-200/80 shadow-2xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{test.name}</span>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {test.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-900/80 font-medium mt-1">
                        Why: {reason}
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      {formatCurrency(test.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleProceedBooking}
                  className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Book Recommended Tests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            <span>OneCare Special AI provides clinical triage suggestions, not a definitive diagnosis. Consult a physician for acute emergencies.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
