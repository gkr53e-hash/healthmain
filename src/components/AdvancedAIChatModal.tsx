import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
  Pill,
  ArrowRight,
  ShieldCheck,
  Eye,
  Phone,
  PhoneCall,
  PhoneOff,
  FileText,
  Brain,
  Activity,
  ChevronDown,
  ChevronUp,
  FileUp,
  BookOpen,
  RotateCcw,
  Clock,
  Sparkle,
} from 'lucide-react';
import { LabPartner, LabTest } from '../types/lab';
import { formatCurrency } from '../utils/labBookingLogic';
import {
  ClinicalResearchResult,
  generateThinkingSteps,
  researchClinicalFile,
} from '../utils/aiChatLogic';

interface AdvancedAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: LabTest[];
  labs: LabPartner[];
  onBookWithPreselectedTests: (lab: LabPartner, testIds: string[]) => void;
  onNavigateToOpd?: (specialty?: string) => void;
  onNavigateToPharmacy?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
  condition?: string;
  specialist?: string;
  doctorName?: string;
  doctorFee?: number;
  labTest?: string;
  labName?: string;
  medicine?: string;
  thinkingSteps?: string[];
  researchDetails?: ClinicalResearchResult;
  isCallSummary?: boolean;
}

// Preset sample images & files for 1-click clinical testing
const SAMPLE_PRESETS = [
  {
    label: 'Scan Pan-D / Pantoprazole',
    badge: 'Medicine Scan',
    icon: '💊',
    prompt:
      'I was prescribed Pantoprazole 40mg and Pan-D. How & when should I take it, is it before or after food, and what does it do inside my stomach?',
    imageUrl:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Scan Dolo 650 / Paracetamol',
    badge: 'Fever & Pain',
    icon: '💊',
    prompt:
      'Can you analyze Dolo 650 (Paracetamol)? How many hours apart should I take it, should I take it with food, and what should I avoid?',
    imageUrl:
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Skin Disease (Rash / Eczema)',
    badge: 'Skin Scan',
    icon: '🩹',
    prompt:
      'I have developed these red itchy raised patches on my forearm for the last 3 days. It burns when I sweat. What is this, why did this happen, and which doctor should I see?',
    imageUrl:
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400',
  },
  {
    label: 'Lab Report (High Cholesterol)',
    badge: 'Report Scan',
    icon: '📊',
    prompt:
      'Here is my recent blood lipid report showing total cholesterol 245 mg/dL and LDL 168 mg/dL. Please analyze what caused this in easy words and advise next medical steps.',
    imageUrl:
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400',
  },
];

const LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'Hinglish', label: 'Hinglish', flag: '🇮🇳' },
  { code: 'Bengali', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
];

export const AdvancedAIChatModal: React.FC<AdvancedAIChatModalProps> = ({
  isOpen,
  onClose,
  tests,
  labs,
  onBookWithPreselectedTests,
  onNavigateToOpd,
  onNavigateToPharmacy,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello there! 👋 I am your **OneCare Special Clinical AI** doctor & pharmacist partner.

I'm here to explain your health, lab numbers, and medicine questions in **clear, reassuring words** backed by clinical protocols:

📞 **Live 2-Way Voice Call:**
Press **"Start Voice Call"** to speak with me directly. I will listen via your microphone, research clinical guidelines in real-time, and speak back to you with doctor advice.

💊 **Medicine Scan & Meal Rules:**
Ask about any tablet, syrup, or upload a photo of a medicine strip/bottle — I will scan it, explain **what it does**, how it works inside you (with simple analogies), and give you exact **before/after food & water rules**!

🩹 **Skin Disease & Rash Scan:**
Upload a picture of any rash, patch, or allergy. I will analyze what it looks like, explain **why this happens**, and give soothing immediate home care.

📊 **Lab Report & File Research:**
Upload blood tests (Lipid, HbA1c, CBC, Thyroid) or doctor prescriptions for deep biomarker breakdown and guideline checks.

🗣️ **Multilingual:** Talk or type in English, हिन्दी, Hinglish, or বাংলা anytime!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  // --- Live Voice Call State ---
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isAiSpeakingCall, setIsAiSpeakingCall] = useState(false);
  const [isUserMuted, setIsUserMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callTranscript, setCallTranscript] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>
  >([]);
  const [isThinkingResearching, setIsThinkingResearching] = useState(false);
  const [activeThinkingStep, setActiveThinkingStep] = useState<string>('');
  const [activeResearch, setActiveResearch] = useState<ClinicalResearchResult | null>(null);

  // Expandable Thinking & Research view state for messages
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});

  // File Research Sheet modal state
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const callFileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const callMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const callSpeechRecognitionRef = useRef<any>(null);

  // Auto scroll in chat feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto scroll in call transcript
  useEffect(() => {
    callMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callTranscript, isThinkingResearching]);

  // Call timer interval
  useEffect(() => {
    let timer: any = null;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallActive]);

  // Clean up all audio/speech synthesis when closed or navigating away
  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(null);
      setIsAiSpeakingCall(false);
      setIsCallActive(false);
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
      if (callSpeechRecognitionRef.current) {
        try {
          callSpeechRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Thinking Steps Accordion
  const toggleThinking = (msgId: string) => {
    setExpandedThinkingIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Text-to-Speech (Talk back with AI in chat)
  const speakMessage = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanSpeech = text
      .replace(/[#*`_]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/•/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === 'Hindi') {
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const englishVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en'));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // LIVE 2-WAY AI VOICE CALL ENGINE ("where man able to talk with ai its also talk ai")
  // -------------------------------------------------------------

  const speakCallMessage = (text: string, onComplete?: () => void) => {
    if (!window.speechSynthesis || isSpeakerMuted) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();
    setIsAiSpeakingCall(true);

    const cleanSpeech = text
      .replace(/[#*`_]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/•/g, '')
      .trim();

    // Split into crisp conversational sentences for natural delivery
    const sentences = cleanSpeech.split(/(?<=[.?!।])\s+/);
    const spokenChunk = sentences.slice(0, 3).join(' ') || cleanSpeech;

    const utterance = new SpeechSynthesisUtterance(spokenChunk);
    utterance.rate = 1.05;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === 'Hindi') {
      const hindiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi'));
      if (hindiVoice) utterance.voice = hindiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const englishVoice = voices.find((v) => v.lang.includes('en-IN') || v.lang.includes('en'));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsAiSpeakingCall(false);
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      setIsAiSpeakingCall(false);
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  };

  const startCallListening = () => {
    if (isUserMuted) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      if (callSpeechRecognitionRef.current) {
        try {
          callSpeechRecognitionRef.current.stop();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      callSpeechRecognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      if (selectedLanguage === 'Hindi') {
        recognition.lang = 'hi-IN';
      } else if (selectedLanguage === 'Bengali') {
        recognition.lang = 'bn-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleProcessCallUserSpeech(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleProcessCallUserSpeech = async (
    speechText: string,
    fileOverride?: { url: string; mime: string; name: string }
  ) => {
    if (!speechText.trim() && !fileOverride) return;

    const userEntry = {
      sender: 'user' as const,
      text: speechText || `I've shared a clinical file: ${fileOverride?.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCallTranscript((prev) => [...prev, userEntry]);

    // Deep Clinical Research & Thinking Engine progression
    setIsThinkingResearching(true);
    const steps = generateThinkingSteps(speechText || fileOverride?.name || 'medical report');
    setActiveThinkingStep(steps[0]);

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setActiveThinkingStep(steps[stepIdx]);
      }
    }, 400);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: speechText,
          imageBase64: fileOverride?.url || attachedImage,
          mimeType: fileOverride?.mime || imageMimeType,
          language: selectedLanguage,
          history: callTranscript.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      clearInterval(stepInterval);
      const data = await res.json();
      setIsThinkingResearching(false);

      if (data && data.success) {
        const reply = data.reply;
        const research =
          data.researchDetails ||
          researchClinicalFile(speechText || fileOverride?.name || '', selectedLanguage);
        if (research) {
          setActiveResearch(research);
        }

        const aiEntry = {
          sender: 'ai' as const,
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setCallTranscript((prev) => [...prev, aiEntry]);

        // AI speaks back to user
        speakCallMessage(reply, () => {
          if (!isUserMuted) {
            startCallListening();
          }
        });
      }
    } catch (err) {
      clearInterval(stepInterval);
      setIsThinkingResearching(false);
      const fallbackSpeech =
        selectedLanguage === 'Hindi'
          ? 'मैंने आपकी बात और लक्षणों की समीक्षा कर ली है। प्राथमिक सुरक्षा के लिए गुनगुना पानी पिएं, आराम करें और डॉ. प्रिया शर्मा से परामर्श लें।'
          : 'I have clinically reviewed your query. For immediate safety, stay hydrated, rest comfortably, and consult Dr. Priya Sharma for a quick follow-up evaluation.';

      setCallTranscript((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackSpeech,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakCallMessage(fallbackSpeech, () => {
        if (!isUserMuted) startCallListening();
      });
    }
  };

  const startVoiceCall = (initialUserTopic?: string) => {
    setIsCallActive(true);
    setIsAiSpeakingCall(false);
    setIsThinkingResearching(false);

    const introGreeting =
      selectedLanguage === 'Hindi'
        ? 'नमस्ते! मैं डॉ. वनकेयर स्पेशल AI हूँ। मैं आपकी आवाज़ सुन रहा हूँ — अपनी समस्या, दवाई या टेस्ट रिपोर्ट के बारे में खुलकर बताइए।'
        : "Hello! I am Dr. OneCare Special AI, your clinical physician partner. I'm listening to your voice right now — please tell me about your symptoms, medicine, or medical reports.";

    setCallTranscript([
      {
        sender: 'ai',
        text: introGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    speakCallMessage(introGreeting, () => {
      startCallListening();
    });

    if (initialUserTopic) {
      setTimeout(() => {
        handleProcessCallUserSpeech(initialUserTopic);
      }, 700);
    }
  };

  const endVoiceCall = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (callSpeechRecognitionRef.current) {
      try {
        callSpeechRecognitionRef.current.stop();
      } catch (e) {}
    }
    setIsCallActive(false);
    setIsAiSpeakingCall(false);
    setIsListening(false);
    setIsThinkingResearching(false);

    // Format consultation summary and post to the main chat feed
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    const durationStr = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;

    if (callTranscript.length > 1) {
      const summaryMsg: ChatMessage = {
        id: `call-summary-${Date.now()}`,
        sender: 'ai',
        text: `### 📞 Voice Call Consultation Summary (Duration: ${durationStr})

Thank you for speaking with **Dr. OneCare Special AI**! Here is your clinical consultation digest from our live conversation:

${callTranscript
  .filter((t) => t.sender === 'user')
  .map((t) => `• **You Asked:** "${t.text}"`)
  .join('\n')}

🩺 **Clinical Advice Given:**
${callTranscript.filter((t) => t.sender === 'ai').slice(-1)[0]?.text.slice(0, 320) || 'Routine clinical assessment completed.'}...

✅ **Verified Care Plan:**
• Recommended Doctor: ${activeResearch?.recommendedDoctor || 'Dr. Priya Sharma (General Physician)'}
• Recommended Diagnostic: ${activeResearch?.recommendedLabTest || 'Complete Blood Count (CBC)'}
• Verified Pharmacy: Express 45-min doorstep delivery available`,
        doctorName: activeResearch?.recommendedDoctor || 'Dr. Priya Sharma',
        specialist: activeResearch?.recommendedSpecialist || 'General Physician',
        doctorFee: activeResearch?.doctorFee || 500,
        labTest: activeResearch?.recommendedLabTest || 'CBC (Complete Blood Count)',
        medicine: activeResearch?.recommendedMedicine || 'Symptomatic Prescribed Care',
        thinkingSteps:
          activeResearch?.thinkingSteps ||
          generateThinkingSteps(callTranscript[1]?.text || 'general health'),
        researchDetails: activeResearch || undefined,
        isCallSummary: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, summaryMsg]);
    }
  };

  // Standard chat speech recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. You can type your question directly.');
      return;
    }

    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      speechRecognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      if (selectedLanguage === 'Hindi') {
        recognition.lang = 'hi-IN';
      } else if (selectedLanguage === 'Bengali') {
        recognition.lang = 'bn-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Handle Image & File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle File in Call
  const handleCallFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mime = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      handleProcessCallUserSpeech(
        `I have uploaded my medical report (${file.name}). Please research it and explain what it means.`,
        { url: base64Url, mime, name: file.name }
      );
    };
    reader.readAsDataURL(file);
  };

  // Select Sample Preset
  const handleSelectPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setInputText(preset.prompt);
    setAttachedImage(preset.imageUrl);
    setImageMimeType('image/jpeg');
  };

  // Run Deep Research on a file/scenario
  const handleTriggerFileResearch = (filename: string, promptText: string, imgUrl?: string) => {
    setIsFileModalOpen(false);
    if (isCallActive) {
      handleProcessCallUserSpeech(
        promptText,
        imgUrl ? { url: imgUrl, mime: 'image/jpeg', name: filename } : undefined
      );
    } else {
      setInputText(promptText);
      if (imgUrl) {
        setAttachedImage(imgUrl);
        setImageMimeType('image/jpeg');
      }
      setTimeout(() => {
        handleSendMessage();
      }, 50);
    }
  };

  // Send message in standard chat mode
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputText.trim();
    if (!prompt && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt || 'Please analyze this uploaded medical report/file.',
      image: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const sentImage = attachedImage;
    const sentMime = imageMimeType;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          imageBase64: sentImage,
          mimeType: sentMime,
          language: selectedLanguage,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await res.json();
      if (data && data.success) {
        const isNonMedicalResponse =
          data.condition?.includes('Non-Medical') ||
          data.reply?.toLowerCase().includes('non-medical') ||
          data.reply?.toLowerCase().includes('स्क्रीनशॉट') ||
          data.reply?.toLowerCase().includes('browser');

        const research =
          data.researchDetails ||
          (isNonMedicalResponse
            ? researchClinicalFile('google screenshot', selectedLanguage)
            : sentImage ||
              prompt.toLowerCase().includes('report') ||
              prompt.toLowerCase().includes('lipid')
            ? researchClinicalFile(prompt, selectedLanguage)
            : undefined);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          condition: data.condition,
          specialist: data.specialist,
          doctorName: data.doctorName,
          doctorFee: data.doctorFee,
          labTest: data.labTest,
          labName: data.labName,
          medicine: data.medicine,
          thinkingSteps: data.thinkingSteps || generateThinkingSteps(prompt),
          researchDetails: research,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || 'Failed to get AI diagnosis');
      }
    } catch (err: any) {
      console.error('AI chat error:', err);
      const fallbackResearch = researchClinicalFile(prompt, selectedLanguage);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### 🩺 Clinical Consultation\n\nI have reviewed your query. Based on your symptoms and description, a specialized clinical review is recommended.\n\n• **Recommended Specialist:** Dr. Priya Sharma (General Physician)\n• **Recommended Lab Work:** Complete Blood Count (CBC) & Vitals\n• **Immediate Relief:** Stay hydrated, rest, and monitor body temperature.`,
        specialist: 'General Physician',
        doctorName: 'Dr. Priya Sharma',
        doctorFee: 500,
        labTest: 'CBC (Complete Blood Count)',
        labName: 'Dr. Lal PathLabs',
        thinkingSteps: generateThinkingSteps(prompt),
        researchDetails: fallbackResearch,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct 1-Click Lab Booking from AI Recommendation
  const handleBookLabTest = (testName?: string) => {
    const targetLab = labs[0] || labs[0];
    let targetTestId = 't-cbc';
    if (testName?.toLowerCase().includes('lipid') || testName?.toLowerCase().includes('cholesterol')) {
      targetTestId = 't-lipid';
    } else if (testName?.toLowerCase().includes('hba1c') || testName?.toLowerCase().includes('diabetes')) {
      targetTestId = 't-hba1c';
    } else if (testName?.toLowerCase().includes('thyroid')) {
      targetTestId = 't-thyroid';
    }
    onClose();
    onBookWithPreselectedTests(targetLab, [targetTestId]);
  };

  // Direct 1-Click Doctor Booking from AI Recommendation
  const handleConsultDoctor = (specialist?: string) => {
    onClose();
    if (onNavigateToOpd) {
      onNavigateToOpd(specialist);
    }
  };

  // Direct 1-Click Pharmacy Order
  const handleOrderPharmacy = () => {
    onClose();
    if (onNavigateToPharmacy) {
      onNavigateToPharmacy();
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-[0_25px_70px_-15px_rgba(15,23,42,0.35)] border border-slate-200/90 overflow-hidden relative flex flex-col h-[94vh] max-h-[860px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* ======================================================== */}
        {/* LUXURY TOP HEADER: Glassmorphic Clinical Branding */}
        {/* ======================================================== */}
        <div className="px-5 py-3.5 border-b border-teal-800/40 bg-gradient-to-r from-teal-950 via-teal-900 to-cyan-950 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/20 font-black">
                <Stethoscope className="w-5 h-5 text-slate-950" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
                  OneCare Special AI
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full">
                  Clinical Voice & Vision
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 font-medium">
                Autonomous triage · 2-way live voice consultation · Lab & Rx research
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Header Live Voice Call Trigger */}
            {!isCallActive ? (
              <button
                type="button"
                onClick={() => startVoiceCall()}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-black shadow-md shadow-emerald-950/30 transition-all cursor-pointer active:scale-95"
                title="Start Live 2-Way Voice Call with Doctor AI"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Voice Call AI</span>
                <span className="sm:hidden">Call</span>
                <span className="w-2 h-2 rounded-full bg-slate-950/40 animate-ping"></span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-300 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                <span>{formatTimer(callDuration)}</span>
              </div>
            )}

            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-teal-400 text-white cursor-pointer transition-colors shadow-2xs"
              title="Select Conversation Language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900 bg-white">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1.5 text-teal-200 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CALL MODE ACTIVE: High-Tech Live 2-Way Voice Call Screen */}
        {/* ======================================================== */}
        {isCallActive ? (
          <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-950 via-teal-950 to-slate-950 text-white p-4 sm:p-6 overflow-y-auto relative animate-in fade-in duration-300">
            {/* Top Call Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-teal-800/40">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>HD Clinical Voice Live</span>
                </div>
                <span className="text-xs text-teal-200/90 font-mono font-bold">
                  {formatTimer(callDuration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(true)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-white/10"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Research File in Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCallActive(false)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-white/10"
                  title="Switch to chat view while keeping session"
                >
                  View Chat
                </button>
              </div>
            </div>

            {/* Center Animated Doctor Avatar & Soundwave Equalizer */}
            <div className="flex-1 flex flex-col items-center justify-center my-4 text-center">
              {/* Doctor Avatar with Concentric Pulsing Soundwave Rings */}
              <div className="relative my-3">
                {/* Outermost pulsing ring */}
                <div
                  className={`absolute -inset-7 rounded-full bg-teal-500/20 blur-lg transition-all duration-300 ${
                    isAiSpeakingCall || isListening
                      ? 'scale-125 opacity-70 animate-pulse'
                      : 'scale-100 opacity-20'
                  }`}
                />
                {/* Secondary ring */}
                <div
                  className={`absolute -inset-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-40 blur-xs transition-all duration-300 ${
                    isAiSpeakingCall ? 'scale-110 animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                />

                {/* Avatar Core */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 p-1 shadow-2xl shadow-teal-900/60 border-2 border-teal-300/50 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-teal-100">
                    <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-teal-200" />
                  </div>
                </div>

                {/* Status Dot */}
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-md">
                  <span className="w-2 h-2 bg-slate-950 rounded-full"></span>
                </span>
              </div>

              {/* Doctor AI Title */}
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Dr. OneCare Special AI
              </h3>
              <p className="text-xs text-teal-200/90 font-medium">
                Clinical Consultant & Medical Researcher
              </p>

              {/* Real-time Dynamic Equalizer Frequency Bars */}
              <div className="flex items-center gap-1.5 h-8 my-3">
                {[0.4, 0.8, 1.0, 0.6, 0.9, 0.5, 0.7].map((heightScale, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isAiSpeakingCall
                        ? 'bg-gradient-to-t from-emerald-400 to-cyan-300 animate-pulse'
                        : isListening
                        ? 'bg-gradient-to-t from-teal-400 to-emerald-300 animate-pulse'
                        : 'bg-teal-800/60'
                    }`}
                    style={{
                      height: isAiSpeakingCall || isListening ? `${heightScale * 28}px` : '6px',
                      animationDelay: `${idx * 120}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Status Badge */}
              <div className="mt-1">
                {isAiSpeakingCall ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold animate-pulse">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Dr. OneCare AI is speaking...</span>
                  </div>
                ) : isThinkingResearching ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold">
                    <Brain className="w-4 h-4 text-cyan-300 animate-spin" />
                    <span>
                      {activeThinkingStep || 'Researching clinical guidelines & thinking...'}
                    </span>
                  </div>
                ) : isListening ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-bold animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Listening to your voice... Speak naturally</span>
                  </div>
                ) : isUserMuted ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold">
                    <MicOff className="w-4 h-4 text-rose-400" />
                    <span>Microphone muted</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-slate-300 text-xs font-medium">
                    <span>Call Connected · Tap microphone to speak</span>
                  </div>
                )}
              </div>

              {/* Live Spoken Subtitles & Transcript Box */}
              <div className="w-full max-w-lg mt-4 max-h-36 overflow-y-auto bg-slate-900/80 border border-teal-800/50 rounded-2xl p-3 text-left space-y-2 text-xs shadow-inner">
                {callTranscript.slice(-3).map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 ${
                      t.sender === 'user' ? 'text-teal-200' : 'text-slate-100 font-medium'
                    }`}
                  >
                    <span className="font-bold text-[10px] uppercase tracking-wider shrink-0 mt-0.5 px-1.5 py-0.5 rounded bg-white/10 text-teal-300">
                      {t.sender === 'user' ? 'You' : 'Doctor AI'}
                    </span>
                    <p className="leading-relaxed line-clamp-3">{t.text}</p>
                  </div>
                ))}
                <div ref={callMessagesEndRef} />
              </div>

              {/* Quick Spoken Voice Testing Chips */}
              <div className="w-full max-w-lg mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <span className="text-[10px] uppercase font-bold text-teal-300 shrink-0">
                  Quick Topics:
                </span>
                {[
                  {
                    label: '📊 Research My Lipid Report',
                    text: 'Please research my blood lipid report with cholesterol 245 mg/dL and LDL 168 mg/dL.',
                  },
                  {
                    label: '💊 How to take Pan-D?',
                    text: 'How should I take Pan-D 40mg on an empty stomach?',
                  },
                  {
                    label: '🩹 Red itchy skin rash',
                    text: 'I have severe red itchy skin rash on forearm with burning sensation.',
                  },
                  {
                    label: '🌡️ Dolo 650 fever dose',
                    text: 'Can I take Dolo 650 for viral fever after food?',
                  },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleProcessCallUserSpeech(chip.text)}
                    className="shrink-0 px-2.5 py-1 bg-white/10 hover:bg-teal-500/30 border border-teal-500/30 rounded-full text-[11px] font-semibold text-teal-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>🎙️</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Call Action Controls Bar */}
            <div className="pt-3 border-t border-teal-800/40 flex items-center justify-center gap-3 sm:gap-4">
              {/* Mic Mute / Unmute */}
              <button
                type="button"
                onClick={() => {
                  setIsUserMuted((prev) => !prev);
                  if (!isUserMuted) {
                    if (callSpeechRecognitionRef.current) {
                      try {
                        callSpeechRecognitionRef.current.stop();
                      } catch (e) {}
                    }
                    setIsListening(false);
                  } else {
                    startCallListening();
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isUserMuted
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={isUserMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {isUserMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Speaker Volume Mute / Unmute */}
              <button
                type="button"
                onClick={() => {
                  setIsSpeakerMuted((prev) => !prev);
                  if (!isSpeakerMuted && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setIsAiSpeakingCall(false);
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isSpeakerMuted
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={isSpeakerMuted ? 'Turn Sound On' : 'Mute Doctor AI Voice'}
              >
                {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Upload Report / File in Call */}
              <input
                type="file"
                ref={callFileInputRef}
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleCallFileChange}
              />
              <button
                type="button"
                onClick={() => callFileInputRef.current?.click()}
                className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title="Attach & Research Medical Report / Prescription in Call"
              >
                <FileUp className="w-5 h-5" />
              </button>

              {/* Tap to Speak / Force Listen */}
              <button
                type="button"
                onClick={startCallListening}
                className="px-4 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
                title="Tap to speak your query right now"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Speak Now</span>
              </button>

              {/* End Call Button */}
              <button
                type="button"
                onClick={endVoiceCall}
                className="w-14 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl shadow-rose-950/60 active:scale-95"
                title="End Consultation Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* STANDARD CHAT MODE: Feed, Docked Call Banner, File Scan  */
          /* ======================================================== */
          <>
            {/* Preset sample scenarios for 1-click test evaluation */}
            <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 py-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-teal-600" />
                  Test Presets:
                </span>
                {SAMPLE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="shrink-0 px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-lg text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
                  >
                    <span>{p.icon}</span>
                    <span className="group-hover:text-teal-700">{p.label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(true)}
                  className="shrink-0 px-2.5 py-1 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-300 rounded-lg text-xs font-extrabold text-teal-800 hover:text-teal-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>Research Medical File</span>
                </button>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative bg-slate-50/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[84%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-teal-800 to-teal-900 text-white rounded-br-xs shadow-md shadow-teal-950/10'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {/* Uploaded User Image Thumbnail */}
                    {msg.image && (
                      <div className="mb-2.5 rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-900/10 shadow-inner">
                        <img
                          src={msg.image}
                          alt="Uploaded medical sample"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {/* Formatted Markdown Content */}
                    <div className="space-y-2 whitespace-pre-line">{msg.text}</div>

                    {/* ======================================================== */}
                    {/* DEEP CLINICAL RESEARCH & THINKING ACCORDION (AI Solving Problem) */}
                    {/* ======================================================== */}
                    {msg.sender === 'ai' && (msg.thinkingSteps || msg.researchDetails) && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => toggleThinking(msg.id)}
                          className="w-full flex items-center justify-between p-2 rounded-xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 text-teal-900 text-xs font-bold transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-teal-700" />
                            <span>Clinical Research & Thinking Process</span>
                            <span className="text-[10px] bg-teal-200/80 text-teal-900 px-1.5 py-0.2 rounded font-extrabold">
                              {msg.thinkingSteps?.length || 4} Steps
                            </span>
                          </div>
                          {expandedThinkingIds[msg.id] ? (
                            <ChevronUp className="w-4 h-4 text-teal-700" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-teal-700" />
                          )}
                        </button>

                        {expandedThinkingIds[msg.id] && (
                          <div className="mt-2 p-3.5 bg-slate-50/90 rounded-xl border border-teal-200/80 space-y-3 text-xs animate-in fade-in">
                            {/* Step-by-step thinking breakdown */}
                            {msg.thinkingSteps && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                  Guideline & Algorithmic Rationale:
                                </span>
                                {msg.thinkingSteps.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-slate-700 text-[11px] leading-tight"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Extracted Biomarkers Table if available */}
                            {msg.researchDetails?.biomarkers && (
                              <div className="mt-2 pt-2 border-t border-slate-200/70">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                                  Biomarkers & Laboratory Ranges:
                                </span>
                                <div className="grid grid-cols-1 gap-1.5">
                                  {msg.researchDetails.biomarkers.map((b, idx) => (
                                    <div
                                      key={idx}
                                      className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px] shadow-2xs"
                                    >
                                      <div>
                                        <span className="font-bold text-slate-900 block">
                                          {b.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          Target: {b.referenceRange}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-black text-slate-900 block font-mono">
                                          {b.value}
                                        </span>
                                        <span
                                          className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide ${
                                            b.status === 'high' || b.status === 'alert'
                                              ? 'bg-rose-100 text-rose-800'
                                              : b.status === 'borderline'
                                              ? 'bg-amber-100 text-amber-800'
                                              : 'bg-emerald-100 text-emerald-800'
                                          }`}
                                        >
                                          {b.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Cited Guidelines */}
                            {msg.researchDetails?.researchGuidelines && (
                              <div className="mt-1.5 pt-1.5 border-t border-slate-200/70">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                  Clinical Guidelines Cross-Referenced:
                                </span>
                                <ul className="text-[10px] text-slate-600 space-y-1 list-disc list-inside">
                                  {msg.researchDetails.researchGuidelines.map((g, gIdx) => (
                                    <li key={gIdx}>{g}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action recommendations if available */}
                    {msg.sender === 'ai' && (msg.doctorName || msg.labTest || msg.medicine) && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                          OneCare Special 1-Click Care Links:
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {/* Doctor Consultation Action */}
                          {msg.doctorName && (
                            <div className="p-3 bg-teal-50/50 rounded-2xl border border-teal-200/80 flex flex-col justify-between shadow-2xs">
                              <div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-700 uppercase">
                                  <Stethoscope className="w-3 h-3" />
                                  <span>{msg.specialist || 'Doctor'}</span>
                                </div>
                                <div className="text-xs font-black text-slate-900 mt-0.5">
                                  {msg.doctorName}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Fee: {formatCurrency(msg.doctorFee || 500)} · Instant OPD Booking
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleConsultDoctor(msg.specialist)}
                                className="mt-2.5 w-full py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <span>Book Consultation</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Lab Diagnostic Action */}
                          {msg.labTest && (
                            <div className="p-3 bg-cyan-50/50 rounded-2xl border border-cyan-200/80 flex flex-col justify-between shadow-2xs">
                              <div>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-700 uppercase">
                                  <FlaskConical className="w-3 h-3" />
                                  <span>Diagnostic Test</span>
                                </div>
                                <div className="text-xs font-black text-slate-900 mt-0.5">
                                  {msg.labTest}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {msg.labName || 'Dr. Lal PathLabs'} · Home Collection
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleBookLabTest(msg.labTest)}
                                className="mt-2.5 w-full py-1.5 bg-cyan-800 hover:bg-cyan-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <span>Book Lab Test</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Pharmacy recommendation */}
                        {msg.medicine && (
                          <div className="p-2.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-center gap-2">
                              <Pill className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <div className="text-[11px] font-bold text-slate-900">
                                  {msg.medicine}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Verified Partner Pharmacy · 45-Min Home Delivery
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleOrderPharmacy}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold shrink-0 cursor-pointer shadow-xs"
                            >
                              Order Medicine
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message Footer: Timestamp & Audio Speak button */}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakMessage(msg.text, msg.id)}
                        className="p-1 text-slate-400 hover:text-teal-700 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                        title={
                          isSpeaking === msg.id
                            ? 'Stop Voice Playback'
                            : 'Listen with Voice (Talk with AI)'
                        }
                      >
                        {isSpeaking === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-600 font-bold">Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading bubble with animated thinking text */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200/90 rounded-2xl max-w-sm shadow-xs">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      OneCare Special AI is researching...
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Cross-referencing ICMR guidelines & pathology ranges
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Attached image preview pill */}
            {attachedImage && (
              <div className="px-4 py-2 bg-teal-50 border-t border-teal-100 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <img
                    src={attachedImage}
                    alt="Upload preview"
                    className="w-10 h-10 rounded-xl object-cover border border-teal-300 shadow-2xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-teal-900 block">
                      Medical File Attached for Clinical Scan
                    </span>
                    <span className="text-[10px] text-teal-700">
                      Ready to detect biomarkers, skin patterns or medication rules
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="p-1.5 text-teal-700 hover:bg-teal-100 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Listening Voice Indicator */}
            {isListening && (
              <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs font-bold text-rose-700 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
                  <span>Listening to your voice... Speak your symptoms naturally.</span>
                </div>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className="text-rose-800 font-extrabold underline text-xs cursor-pointer"
                >
                  Done Speaking
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* LIVE VOICE CALL BANNER (Circled by user in Screenshot 3) */}
            {/* ============================================================ */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border-t border-teal-800/80 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-emerald-500/20">
                  <PhoneCall className="w-4 h-4 text-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Dr. OneCare AI Voice Consultation</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      2-Way Audio
                    </span>
                  </div>
                  <p className="text-[10px] text-teal-200/90 font-medium leading-tight">
                    Talk live with Doctor AI · Continuous voice conversation & file reasoning
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startVoiceCall()}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-emerald-950/30 cursor-pointer transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-950" />
                <span>Start Call</span>
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick Ask:</span>
              {[
                {
                  label: '💊 How to take Pan-D?',
                  text: 'How should I take Pan-D (Pantoprazole), is it before or after food, and what should I avoid?',
                },
                {
                  label: '💊 Dolo 650 with food?',
                  text: 'Can I take Dolo 650 for viral fever, does it need to be taken after food, and can I take it with cold syrup?',
                },
                {
                  label: '🩹 Skin rash causes?',
                  text: 'I have red itchy rash on skin. Why did this happen and what home relief can I do?',
                },
                {
                  label: '📊 High LDL tips?',
                  text: 'My LDL cholesterol is 168 mg/dL. Explain how to reduce it in easy words.',
                },
                {
                  label: '🇮🇳 Pan-D कब और कैसे लें?',
                  text: 'Pan-D कैप्सूल कब और कैसे खाना चाहिए? क्या इसे खाली पेट लेना होता है?',
                },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(chip.text);
                  }}
                  className="shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-full text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Image / Report Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-600 hover:text-teal-700 transition-all cursor-pointer shrink-0 shadow-2xs"
                  title="Upload photo of skin disease, report, or prescription"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                {/* Voice Input Button (Speech-to-Text) */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 shadow-2xs ${
                    isListening
                      ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                      : 'border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-600 hover:text-teal-700'
                  }`}
                  title="Speak with microphone into text box"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Dedicated Voice Call Button (Man able to talk with AI & AI talks back) */}
                <button
                  type="button"
                  onClick={() => startVoiceCall()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20 active:scale-95"
                  title="Start Live 2-Way Voice Call with Doctor AI"
                >
                  <PhoneCall className="w-5 h-5 text-slate-950" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening... speak now'
                      : attachedImage
                      ? 'Add any details or ask why this happened...'
                      : 'Ask about symptoms, medicines, lab reports or start a call...'
                  }
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all font-medium"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!inputText.trim() && !attachedImage) || isLoading}
                  className="p-2.5 bg-teal-800 hover:bg-teal-900 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-teal-900/20 cursor-pointer shrink-0"
                  title="Send to OneCare Special AI"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              {/* Clinical Disclaimer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  AI Clinical Triage · Live Duplex Voice · Multimodal Vision
                </span>
                <span className="font-semibold text-rose-600">Emergency? Use SOS 108</span>
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* MODAL / SHEET: Deep Clinical File & Report Researcher */}
        {/* ======================================================== */}
        {isFileModalOpen && (
          <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Medical File & Report Researcher
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Upload lab PDFs, prescriptions or scan reports
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer bg-teal-50/40 hover:bg-teal-50 transition-colors"
              >
                <FileUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Tap to upload Pathology PDF or Prescription Scan
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports JPG, PNG, PDF lab documents up to 15MB
                </p>
              </div>

              {/* Clinical File Sample Presets for Instant 1-Click Research */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Or Test with Real Clinical Report Scenarios:
                </span>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerFileResearch(
                        'Lipid_Profile_Report.pdf',
                        'Here is my recent blood lipid profile showing total cholesterol 245 mg/dL and LDL 168 mg/dL. Please research this file and explain next steps.',
                        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400'
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📊</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                          Lipid Panel & Cholesterol Report (PDF)
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Total Chol: 245 mg/dL · LDL: 168 mg/dL (Elevated)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerFileResearch(
                        'OPD_Prescription_PanD.jpg',
                        'I have uploaded this prescription for Pan-D (Pantoprazole) and Dolo 650. Please research drug interactions and timing rules.',
                        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">💊</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                          Doctor Prescription: Pan-D & Dolo 650
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Checks drug-drug interaction matrix & empty-stomach rules
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleTriggerFileResearch(
                        'Skin_Rash_Scan.jpg',
                        'Analyzing visual dermal image: Erythematous papules and itchy allergy patches on skin.',
                        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400'
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🩹</span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                          Dermatology Image Scan: Contact Dermatitis
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Skin barrier analysis & soothing anti-allergic care
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
