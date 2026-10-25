import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  detectMedicine,
  generateHumanLikeMedicineReply,
  generateHumanLikeSkinReply,
  generateNonMedicalReply,
  isMedicineIntent,
  isNonMedicalIntent,
  parseClinicalIntent,
  generateThinkingSteps,
  researchClinicalFile,
} from './src/utils/aiChatLogic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Allow up to 15MB for multimodal image scans and base64 reports
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Server-side Gemini AI Client Factory
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory data stores for backend API
const CERTIFIED_LABS_BACKEND = [
  {
    id: '58b58c85-05ad-4fd9-886a-9a875a6f5e84',
    name: 'Dr. Lal PathLabs',
    badge: 'NABL & CAP Accredited',
    area: 'Bailey Road',
    city: 'Patna',
    address: 'Plot No. 14, Bailey Road, Near Jagdeo Path, Patna, Bihar 800014',
    distanceKm: 1.2,
    rating: 4.5,
    reviewsCount: 1420,
    hasHomeCollection: true,
    hasCentreVisit: true,
    phone: '+91 612 2548900',
    openingHours: '07:00 AM - 08:00 PM',
    popularTestIds: ['t-cbc', 't-lipid', 't-thyroid', 't-hba1c'],
    allTestIds: [
      't-cbc', 't-lipid', 't-hba1c', 't-thyroid', 't-vit-d', 't-lft', 't-kft',
      't-urine', 't-vit-b12', 't-iron', 't-ecg', 't-echo', 't-tmt', 't-holter',
      't-xray-chest', 't-xray-single', 't-usg-abdomen', 't-usg-pelvis'
    ],
  },
  {
    id: '89ba0fd6-dbff-416e-8c76-bc3fb44737ea',
    name: 'Thyrocare',
    badge: 'NABL Certified',
    area: 'Boring Road',
    city: 'Patna',
    address: '2nd Floor, Grand Plaza, Boring Road Crossing, Patna, Bihar 800001',
    distanceKm: 2.4,
    rating: 4.5,
    reviewsCount: 980,
    hasHomeCollection: true,
    hasCentreVisit: true,
    phone: '+91 612 2589012',
    openingHours: '06:30 AM - 07:30 PM',
    popularTestIds: ['t-full-body', 't-diabetes-panel', 't-lft', 't-thyroid'],
    allTestIds: [
      't-full-body', 't-diabetes-panel', 't-lft', 't-thyroid', 't-cbc', 't-lipid',
      't-hba1c', 't-vit-d', 't-vit-b12', 't-kft', 't-iron', 't-urine'
    ],
  },
  {
    id: '9412f97b-479c-4b7d-9828-15270a8cfbba',
    name: 'SRL Diagnostics',
    badge: 'NABL & ISO Accredited',
    area: 'Kankarbagh',
    city: 'Patna',
    address: 'Near Old Bypass, Main Road, Kankarbagh, Patna, Bihar 800020',
    distanceKm: 3.1,
    rating: 4.5,
    reviewsCount: 1150,
    hasHomeCollection: true,
    hasCentreVisit: true,
    phone: '+91 612 2356789',
    openingHours: '07:00 AM - 09:00 PM',
    popularTestIds: ['t-mri-brain', 't-ct-scan', 't-usg-abdomen', 't-xray-chest'],
    allTestIds: [
      't-mri-brain', 't-ct-scan', 't-usg-abdomen', 't-usg-pelvis', 't-xray-chest',
      't-xray-single', 't-cbc', 't-lipid', 't-hba1c', 't-ecg', 't-echo', 't-lft', 't-kft'
    ],
  },
  {
    id: '61e15c2f-93fb-4b89-9e58-9ece647d0d57',
    name: 'Metropolis',
    badge: 'CAP & NABL Certified',
    area: 'Rajendra Nagar',
    city: 'Patna',
    address: 'Opp. Moin-ul-Haq Stadium, Rajendra Nagar, Patna, Bihar 800016',
    distanceKm: 3.8,
    rating: 4.5,
    reviewsCount: 890,
    hasHomeCollection: true,
    hasCentreVisit: true,
    phone: '+91 612 2674321',
    openingHours: '07:00 AM - 08:30 PM',
    popularTestIds: ['t-cbc', 't-rtpcr', 't-iron', 't-vit-d'],
    allTestIds: [
      't-cbc', 't-rtpcr', 't-iron', 't-vit-d', 't-vit-b12', 't-lipid',
      't-hba1c', 't-thyroid', 't-lft', 't-kft', 't-urine', 't-full-body'
    ],
  },
  {
    id: '636e1807-a34a-43ce-9d5f-3e5f0bfa2dcc',
    name: 'HealthPlus Diagnostics',
    badge: 'Verified Care Partner',
    area: 'Kankarbagh, Patna',
    city: 'Patna',
    address: 'Doctor Colony, Kankarbagh Road, Patna, Bihar 800020',
    distanceKm: 2.8,
    rating: 4.5,
    reviewsCount: 640,
    hasHomeCollection: true,
    hasCentreVisit: true,
    phone: '+91 612 2389100',
    openingHours: '07:30 AM - 08:00 PM',
    popularTestIds: ['t-cbc', 't-vit-d', 't-lft', 't-kft'],
    allTestIds: [
      't-cbc', 't-vit-d', 't-lft', 't-kft', 't-lipid', 't-hba1c', 't-thyroid',
      't-urine', 't-ecg', 't-xray-chest'
    ],
  },
];

const OPD_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    rating: 4.8,
    experience: '8y exp',
    location: 'Boring Road, Patna',
    fee: 500,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=240',
    available: 'Today at 04:30 PM',
  },
  {
    id: 'doc-2',
    name: 'Dr. Anil Verma',
    specialty: 'Cardiologist',
    rating: 4.9,
    experience: '15y exp',
    location: 'Patliputra Colony, Patna',
    fee: 900,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=240',
    available: 'Tomorrow at 10:00 AM',
  },
  {
    id: 'doc-3',
    name: 'Dr. Meera Nair',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '10y exp',
    location: 'Boring Road, Patna',
    fee: 600,
    avatar: 'https://images.unsplash.com/photo-1594824813587-8495a639b56f?auto=format&fit=crop&q=80&w=240',
    available: 'Today at 06:00 PM',
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajiv Ranjan',
    specialty: 'Orthopedic Surgeon',
    rating: 4.6,
    experience: '12y exp',
    location: 'Patliputra, Patna',
    fee: 800,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=240',
    available: 'Today at 05:00 PM',
  },
  {
    id: 'doc-5',
    name: 'Dr. Sneha Kapoor',
    specialty: 'Gynecologist',
    rating: 4.8,
    experience: '9y exp',
    location: 'Patliputra Colony, Patna',
    fee: 750,
    avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=240',
    available: 'Tomorrow at 11:30 AM',
  },
  {
    id: 'doc-6',
    name: 'Dr. Karthik Iyer',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '18y exp',
    location: 'Bailey Road, Patna',
    fee: 1200,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=240',
    available: 'Tomorrow at 02:00 PM',
  },
  {
    id: 'doc-7',
    name: 'Dr. Farhan Ali',
    specialty: 'Dermatologist',
    rating: 4.5,
    experience: '7y exp',
    location: 'Kankarbagh, Patna',
    fee: 650,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=240',
    available: 'Today at 07:00 PM',
  },
  {
    id: 'doc-8',
    name: 'Dr. Ananya Das',
    specialty: 'ENT Specialist',
    rating: 4.6,
    experience: '6y exp',
    location: 'Rajendra Nagar, Patna',
    fee: 550,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=240',
    available: 'Today at 05:30 PM',
  },
];

const PHARMACIES = [
  {
    id: 'ph-1',
    name: 'Apollo Pharmacy',
    area: 'Bailey Road',
    deliveryTime: '~45 min delivery',
    rating: 4.8,
    topMedicines: ['Paracetamol 650mg', 'Azithromycin 500mg', 'Cetirizine 10mg', 'Pantoprazole 40mg', 'Vitamin C + Zinc'],
  },
  {
    id: 'ph-2',
    name: 'MedPlus',
    area: 'Kankarbagh',
    deliveryTime: '~45 min delivery',
    rating: 4.7,
    topMedicines: ['Metformin 500mg', 'Telmisartan 40mg', 'Atorvastatin 10mg', 'Amoxicillin Clavulanate', 'Multivitamin Gold'],
  },
  {
    id: 'ph-3',
    name: '1mg Store',
    area: 'Patliputra',
    deliveryTime: '~45 min delivery',
    rating: 4.9,
    topMedicines: ['ORS Electrolyte', 'Dolo 650', 'Digestive Enzymes', 'Calcium + D3 Tablets', 'Antiseptic Solution'],
  },
  {
    id: 'ph-4',
    name: 'Netmeds Local',
    area: 'Rajendra Nagar',
    deliveryTime: '~45 min delivery',
    rating: 4.6,
    topMedicines: ['Thyronorm 50mcg', 'Insulin Cartridge', 'Pain Relief Gel', 'BP Monitor Digital', 'Steam Inhaler'],
  },
];

const EMERGENCY_HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'AIIMS Patna',
    area: 'Phulwari Sharif, Patna',
    distanceKm: 4.2,
    beds: { general: 22, icu: 6, nicu: 3, ventilator: 4, total: 35 },
    phone: '+91 612 2451000',
    traumaLevel: 'Level 1 Trauma Care',
  },
  {
    id: 'hosp-2',
    name: 'Paras HMRI Hospital',
    area: 'Bailey Road, Patna',
    distanceKm: 1.8,
    beds: { general: 18, icu: 5, nicu: 2, ventilator: 3, total: 28 },
    phone: '+91 612 7107777',
    traumaLevel: '24x7 Cardiac & Neuro Emergency',
  },
  {
    id: 'hosp-3',
    name: 'Ruban Memorial Hospital',
    area: 'Patliputra Colony',
    distanceKm: 2.6,
    beds: { general: 15, icu: 3, nicu: 1, ventilator: 2, total: 21 },
    phone: '+91 612 2271000',
    traumaLevel: 'Multispecialty Critical Care',
  },
  {
    id: 'hosp-4',
    name: 'Big Apollo Spectra',
    area: 'Kankarbagh, Patna',
    distanceKm: 3.4,
    beds: { general: 20, icu: 5, nicu: 2, ventilator: 3, total: 30 },
    phone: '+91 612 3500100',
    traumaLevel: 'Surgical Emergency & ICU',
  },
  {
    id: 'hosp-5',
    name: 'Medanta Superspeciality',
    area: 'Kankarbagh',
    distanceKm: 3.9,
    beds: { general: 22, icu: 6, nicu: 2, ventilator: 3, total: 33 },
    phone: '+91 612 3505000',
    traumaLevel: 'Comprehensive Heart & Stroke Unit',
  },
];

// In-memory bookings store on backend
let serverBookings: any[] = [
  {
    id: 'MED-LAB-72914',
    type: 'lab',
    labId: '58b58c85-05ad-4fd9-886a-9a875a6f5e84',
    labName: 'Dr. Lal PathLabs',
    labArea: 'Bailey Road',
    labAddress: 'Plot No. 14, Bailey Road, Near Jagdeo Path, Patna',
    tests: [
      { testId: 't-cbc', name: 'CBC (Complete Blood Count)', price: 350, category: 'Pathology' },
      { testId: 't-thyroid', name: 'Thyroid Profile (T3, T4, TSH)', price: 650, category: 'Pathology' },
    ],
    mode: 'home',
    slotDate: 'Tomorrow',
    slotTime: '07:30 AM - 08:30 AM',
    patientName: 'Demo Patient',
    patientPhone: '9876543210',
    patientAge: '32',
    patientGender: 'Male',
    address: 'B-402, Green Valley Apartments, Bailey Road, Patna',
    subtotal: 1000,
    collectionFee: 0,
    totalAmount: 1000,
    status: 'Phlebotomist Assigned',
    createdAt: new Date().toISOString(),
  },
];

// Backend API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'OneCare Special Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/labs', (req, res) => {
  const { search, location } = req.query;
  let results = [...CERTIFIED_LABS_BACKEND];

  if (location && location !== 'all') {
    results = results.filter((l) => l.area.toLowerCase().includes(String(location).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((l) => l.name.toLowerCase().includes(q) || l.area.toLowerCase().includes(q));
  }

  res.json({ labs: results, count: results.length });
});

app.get('/api/labs/:id', (req, res) => {
  const lab = CERTIFIED_LABS_BACKEND.find((l) => l.id === req.params.id);
  if (!lab) {
    return res.status(404).json({ error: 'Lab not found' });
  }
  res.json({ lab });
});

app.get('/api/doctors', (req, res) => {
  const { specialty, search } = req.query;
  let results = [...OPD_DOCTORS];

  if (specialty && specialty !== 'all' && specialty !== 'All') {
    results = results.filter((d) => d.specialty.toLowerCase().includes(String(specialty).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
  }

  res.json({ doctors: results, count: results.length });
});

app.get('/api/pharmacies', (req, res) => {
  res.json({ pharmacies: PHARMACIES });
});

app.get('/api/hospitals', (req, res) => {
  const totalAvailableBeds = EMERGENCY_HOSPITALS.reduce((acc, h) => acc + h.beds.total, 0);
  res.json({ hospitals: EMERGENCY_HOSPITALS, totalAvailableBeds });
});

app.get('/api/bookings', (req, res) => {
  res.json({ bookings: serverBookings });
});

app.post('/api/bookings', (req, res) => {
  const body = req.body;
  if (!body.patientName || !body.patientPhone) {
    return res.status(400).json({ error: 'Missing required patient details' });
  }

  const newBooking = {
    ...body,
    id: body.id || `MED-${Math.floor(10000 + Math.random() * 90000)}`,
    status: body.status || 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  serverBookings = [newBooking, ...serverBookings];
  res.status(201).json({ success: true, booking: newBooking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  serverBookings = serverBookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b));
  res.json({ success: true, message: `Booking ${id} cancelled` });
});

app.post('/api/ai-triage', (req, res) => {
  const { symptoms } = req.body;
  const q = (symptoms || '').toLowerCase();

  let recommendation = {
    urgency: 'Routine Consultation',
    recommendedSpecialty: 'General Physician',
    recommendedLabTests: ['CBC (Complete Blood Count)', 'Lipid Profile'],
    reasoning: 'General symptoms require primary clinical assessment and basic blood work.',
  };

  if (q.includes('chest') || q.includes('heart') || q.includes('stroke') || q.includes('breath')) {
    recommendation = {
      urgency: 'High / Critical',
      recommendedSpecialty: 'Cardiologist',
      recommendedLabTests: ['ECG (12-lead)', 'Troponin-I', 'Echocardiography'],
      reasoning: 'Cardiopulmonary symptoms indicate urgent cardiac evaluation and immediate bed reserve if severe.',
    };
  } else if (q.includes('tired') || q.includes('fatigue') || q.includes('hair') || q.includes('cold')) {
    recommendation = {
      urgency: 'Medium',
      recommendedSpecialty: 'Endocrinologist / General Physician',
      recommendedLabTests: ['Thyroid Profile (T3, T4, TSH)', 'Vitamin D 25-OH', 'Complete Hemogram (CBC)'],
      reasoning: 'Chronic fatigue and hair thinning strongly correlate with thyroid imbalance and micronutrient deficiencies.',
    };
  } else if (q.includes('sugar') || q.includes('thirst') || q.includes('diabetes')) {
    recommendation = {
      urgency: 'Medium',
      recommendedSpecialty: 'Diabetologist',
      recommendedLabTests: ['HbA1c (Diabetes)', 'Fasting Blood Sugar', 'KFT (Kidney Function)'],
      reasoning: 'Symptoms point to glycemic irregularity requiring HbA1c screening.',
    };
  }

  res.json({ success: true, recommendation });
});

// Advanced Multilingual & Multimodal Clinical AI Chatbot Endpoint
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, imageBase64, mimeType = 'image/jpeg', language = 'English', history = [] } = req.body;
    const userPrompt = message || 'Please analyze this medical image / report / symptom.';
    const lang = (language || 'English').toLowerCase();

    // 1. If Gemini AI is configured with API key, use official @google/genai SDK
    const geminiClient = getGeminiClient();
    if (geminiClient) {
      try {
        const systemInstruction = `You are "OneCare Special AI", an elite board-certified Doctor and Clinical Pharmacist AI for the OneCare Special healthcare and diagnostic ecosystem.

YOUR ABSOLUTE TOP PRIORITY IS HIGH-ACCURACY VISUAL IDENTIFICATION & CLINICAL EXTRACTION:
- NEVER guess, make up, or hallucinate medical information.
- ALWAYS accurately verify what the uploaded image actually is before offering any medical diagnosis!

NON-MEDICAL IMAGE DETECTION RULE (CRITICAL):
• Before doing medical triage, inspect whether the image is actually a medical item (medicine packaging/strip/bottle, doctor prescription, pathology lab report, X-ray/scan, or biological bodily symptom/rash).
• If the uploaded image is NOT a medical item (for example: a screenshot of a computer screen, a web browser like Google Chrome / Google search page / homepage with shortcuts to YouTube, GitHub, localhost, an app interface, a car, an animal, scenery, meme, or random photo):
  1. STATE CLEARLY IN THE FIRST SENTENCE WHAT THE IMAGE ACTUALLY IS:
     "⚠️ गैर-चिकित्सकीय छवि पहचान (Non-Medical Image Detected): यह Google सर्च इंजन / क्रोम वेब ब्राउज़र का स्क्रीनशॉट है।" (This is a screenshot of the Google search engine / Chrome browser interface).
  2. EMPHASIZE CLEARLY that this is NOT a medical document, medicine, or bodily symptom, and contains NO skin problem, rash, or clinical disease.
  3. NEVER DIAGNOSE NON-MEDICAL IMAGES AS ECZEMA, RASH, OR SKIN PROBLEM!
  4. Politely guide the user in dual Hindi & English to upload an authentic medicine strip (दवाई का पत्ता), doctor prescription (डॉक्टर का पर्चा), or lab report (जांच रिपोर्ट) for medical analysis.
  5. Set condition to "Non-Medical Image / गैर-चिकित्सकीय छवि", specialist to "N/A", medicine to "N/A".

DOCUMENT & SCANNING INSTRUCTIONS FOR GENUINE MEDICAL IMAGES:
1. MEDICINE PACKAGING / STRIP / BOTTLE SCAN:
   • Exact Brand Name (e.g. Dolo 650, Pan-D, Augmentin 625, Telma 40, Thyronorm 50mcg, Azee 500, Shelcal 500, etc.).
   • Exact Generic Salt & Composition (e.g. Paracetamol 650mg, Pantoprazole 40mg + Domperidone 30mg SR).
   • Manufacturer / Marketing company & Expiry/Batch if visible.
   • Breakdown:
     💊 1. What is this medicine for? (Explain in clear, simple everyday words what it treats).
     💡 2. How it works inside you (Simple relatable analogy, e.g. turning off acid taps, soothing pain messengers).
     ⏰ 3. Exact Timing & Meal Rules (CRITICAL: Empty stomach before food vs. with food vs. after food, morning vs. bedtime, water intake).
     ⚠️ 4. Key Precautions & What to Avoid (Substances like alcohol, double dosing, skipping antibiotic course, antacid spacing).
     🩺 5. Doctor & Diagnostic Advice (Recommend the appropriate OPD specialist, lab monitor test, and verified pharmacy).

2. DOCTOR'S PRESCRIPTION (Rx):
   • Identify Doctor name, specialty, clinic/hospital, and date if visible.
   • Itemize every prescribed medicine: Name, Strength, Dosage Frequency (OD, BD, TDS, PRN), Duration (e.g. 5 days), and Meal Timing.
   • Note any ordered lab tests (CBC, Lipid, Ultrasound, etc.) or follow-up instructions.

3. PATHOLOGY / LAB TEST REPORT (Blood, Urine, Lipid, Sugar, Thyroid, LFT, KFT):
   • Identify Lab Name (e.g. Dr. Lal PathLabs, Thyrocare, SRL, AIIMS), Patient details, and Date.
   • Provide a Markdown table of tested biomarkers:
     | Biomarker / Test | Observed Result | Normal Reference Range | Status |
     Use 🟢 NORMAL, 🔴 HIGH, or 🟡 LOW.
   • Explain in simple, reassuring words (in Hindi and English) what abnormal values indicate and what lifestyle, diet, or doctor review is needed.

4. PHYSICAL SYMPTOMS / SKIN / RASH:
   • ONLY when genuine bodily symptoms or skin lesions are photographed, describe visual characteristics (color, border, spread, raised vs. flat).
   • Outline clinical differential possibilities (Contact Dermatitis, Eczema, Tinea, etc.).
   • Provide immediate soothing home comfort care and emergency red flags.

LANGUAGE RULE:
- Deliver explanations in clean DUAL HINDI & ENGLISH with Hinglish clarity so patients and family members understand 100% clearly.
- Generously use friendly emojis (💊, ✨, 💡, 🥪, ⏰, 💧, ⚠️, 🩺, 🌿, 🛡️, 🌙, 😴, 😊) on key bullet points.`;

        let contents: any;
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();
          contents = {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: cleanBase64,
                },
              },
              {
                text: `${userPrompt}\n\nCRITICAL INSTRUCTIONS FOR IMAGE ANALYSIS:
1. Examine the image carefully.
2. If this is a digital screenshot (e.g. Google search homepage, browser screen, desktop wallpaper), explicitly state that it is a Google/browser screenshot and contains NO medical symptoms or skin rash.
3. If this is a medicine strip, bottle, or blister pack, READ AND EXTRACT THE EXACT PRINTED BRAND NAME, CHEMICAL SALT & STRENGTH (e.g., Paracetamol, Dolo 650, Augmentin, Azithromycin, Telma 40, Shelcal, Montair-LC, etc.). DO NOT substitute with a different medicine name! If unclear, ask the user to clarify the name.
4. If this is a lab report, extract the specific test names and numerical values accurately.
5. Provide the response in clear, friendly dual Hindi & English (with Hinglish clarity) and helpful emojis.`,
              },
            ],
          };
        } else {
          contents = `${userPrompt}\n(Please respond accurately in dual Hindi and English in a warm, human-like, easy-to-understand doctor tone with emojis)`;
        }

        // Try active models in order of availability
        const candidateModels = ['gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
        let aiResponse: any = null;
        let usedModel = 'gemini-flash-lite-latest';

        for (const modelName of candidateModels) {
          try {
            const geminiPromise = geminiClient.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.3,
              },
            });

            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 15000)
            );

            aiResponse = await Promise.race([geminiPromise, timeoutPromise]);
            if (aiResponse && aiResponse.text) {
              usedModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`[AI Engine] Model ${modelName} failed (${modelErr?.message || modelErr?.status}), trying next candidate...`);
          }
        }

        if (!aiResponse || !aiResponse.text) {
          throw new Error('All candidate AI models temporarily unavailable');
        }

        const replyText = aiResponse.text || '';

        // Extract structured recommendation metadata: prioritize user prompt and reply header
        const replyHeader = replyText.slice(0, 350);
        const triage = parseClinicalIntent(userPrompt) || parseClinicalIntent(replyHeader);
        let condition = triage.condition;
        let specialist = triage.specialist;
        let doctorName = triage.doctorName;
        let doctorFee = triage.doctorFee;
        let labTest = triage.labTest;
        const labName = 'Dr. Lal PathLabs';
        let medicine = triage.medicine || 'Prescribed Symptomatic Relief';

        // Check if non-medical image was detected in Gemini's response
        const lowerReply = replyText.toLowerCase();
        const isDetectedNonMedical =
          lowerReply.includes('non-medical') ||
          lowerReply.includes('google') ||
          lowerReply.includes('screenshot') ||
          lowerReply.includes('स्क्रीनशॉट') ||
          lowerReply.includes('browser') ||
          isNonMedicalIntent(userPrompt);

        if (isDetectedNonMedical) {
          condition = 'Non-Medical Image / गैर-चिकित्सकीय छवि';
          specialist = 'General Physician (On-Demand)';
          doctorName = 'Dr. Priya Sharma';
          doctorFee = 500;
          labTest = 'Consultation If Needed';
          medicine = 'None (Non-Medical Upload)';
        } else {
          // Check medicine in user prompt first, then reply header, then full reply
          const userMed = detectMedicine(userPrompt);
          const replyMed = detectMedicine(replyHeader) || detectMedicine(replyText);
          const detectedMed = userMed || replyMed;
          if (detectedMed) {
            condition = `Medicine Scan: ${detectedMed.name}`;
            specialist = detectedMed.specialist;
            doctorName = detectedMed.recommendedDoctor;
            doctorFee = detectedMed.doctorFee;
            labTest = detectedMed.relevantLabTest;
            medicine = detectedMed.name;
          }
        }

        const thinkingSteps = generateThinkingSteps(userPrompt + ' ' + replyText);
        const researchDetails = (imageBase64 || userPrompt.toLowerCase().includes('report') || userPrompt.toLowerCase().includes('lipid') || userPrompt.toLowerCase().includes('cholesterol') || userPrompt.toLowerCase().includes('skin') || userPrompt.toLowerCase().includes('file') || userPrompt.toLowerCase().includes('pdf') || isMedicineIntent(userPrompt) || isDetectedNonMedical)
          ? researchClinicalFile(userPrompt + ' ' + (isDetectedNonMedical ? 'google screenshot' : ''), language)
          : undefined;

        return res.json({
          success: true,
          reply: replyText,
          condition,
          specialist,
          doctorName,
          doctorFee,
          labTest,
          labName,
          medicine,
          thinkingSteps,
          researchDetails,
          model: usedModel,
        });
      } catch (geminiError: any) {
        console.log('[AI Triage Engine] Using clinical heuristics fallback:', geminiError?.message || 'standard fallback');
      }
    }

    // 2. Intelligent Clinical Fallback Engine (Guarantees zero-failure operation with human-like tone & emojis)
    const q = userPrompt.toLowerCase();
    const hasImage = Boolean(imageBase64);

    let reply = '';
    let condition = 'Health Consultation';
    let specialist = 'General Physician';
    let doctorName = 'Dr. Priya Sharma';
    let doctorFee = 500;
    let labTest = 'CBC (Complete Blood Count)';
    let labName = 'Dr. Lal PathLabs';
    let medicine = 'Prescription / Over-the-counter care';

    const isHindi = lang.includes('hindi') || lang.includes('हिन्दी') || lang.includes('hinglish') || q.includes('kya') || q.includes('hai') || q.includes('hota') || q.includes('dawa') || q.includes('batao');

    // Case 0: Explicit Non-Medical Image / Screenshot Check (Fixes false skin problem diagnosis)
    const isNonMedical = isNonMedicalIntent(userPrompt) ||
      q.includes('google') || q.includes('screenshot') || q.includes('chrome') ||
      q.includes('screen') || q.includes('browser') || q.includes('desktop') ||
      q.includes('youtube') || q.includes('localhost') || q.includes('github') ||
      (hasImage && (q.includes('goggle') || q.includes('screem') || q.includes('screenshot')));

    if (isNonMedical) {
      condition = 'Non-Medical Image / गैर-चिकित्सकीय छवि';
      specialist = 'General Physician (On-Demand)';
      doctorName = 'Dr. Priya Sharma';
      doctorFee = 500;
      labTest = 'Consultation If Needed';
      labName = 'OneCare Care Network';
      medicine = 'N/A (Non-Medical Upload)';
      reply = generateNonMedicalReply(userPrompt, language);
    }
    // A. Medicine Query or Medicine Image Scan
    else if (isMedicineIntent(userPrompt) || (hasImage && (q.includes('medicine') || q.includes('strip') || q.includes('tablet') || q.includes('capsule') || q.includes('panto') || q.includes('dolo') || q.includes('dawa')))) {
      const detectedMed = detectMedicine(userPrompt);
      if (detectedMed) {
        condition = `Medicine Scan: ${detectedMed.name}`;
        specialist = detectedMed.specialist;
        doctorName = detectedMed.recommendedDoctor;
        doctorFee = detectedMed.doctorFee;
        labTest = detectedMed.relevantLabTest;
        medicine = detectedMed.name;
        reply = generateHumanLikeMedicineReply(detectedMed, language);
      } else {
        // Never hallucinate or default to an unrelated medicine
        condition = 'Medicine Identification & Guidance';
        specialist = 'Clinical Pharmacist / Physician';
        doctorName = 'Dr. Priya Sharma';
        doctorFee = 500;
        labTest = 'Diagnostic Review If Prescribed';
        labName = 'OneCare Care Network';
        medicine = 'Verification Required';
        reply = isHindi
          ? `### 💊 दवाई की पहचान और परामर्श (Medicine Review)

नमस्ते! 😊 आपकी भेजी गई दवाई की तस्वीर प्राप्त हो गई है।

🔍 **सटीक व सुरक्षित जानकारी के लिए:**
• कृपया दवाई के पत्ते (Strip) या डिब्बी पर लिखे **ब्रांड नाम व साल्ट** (जैसे Dolo 650, Augmentin, Telma, Pantoprazole, Azithromycin आदि) की एक साफ व सीधी फोटो अपलोड करें।
• या आप चैट में दवाई का नाम टाइप कर दें — हम तुरंत बताएंगे कि इसे **खाली पेट या खाने के बाद कब लेना है**, यह क्या काम करती है और क्या सावधानियां रखनी हैं! 🩺`
          : `### 💊 Medicine Review & Safety Guidance

Hello! 😊 Your medicine image has been received by OneCare AI.

🔍 **For 100% Accurate Guidance:**
• Please upload a clear, focused photo showing the **printed brand name and chemical salt** on the blister strip or packaging.
• Alternatively, simply type the name printed on the medicine (e.g. Dolo 650, Augmentin, Telma 40, Azithromycin) — we will instantly provide the exact meal timing, indication, and vital precautions! 🩺`;
      }
    }
    // B. Blood Lab Report / Lipid / Sugar / CBC / Thyroid Scan
    else if (q.includes('blood') || q.includes('lipid') || q.includes('cholesterol') || q.includes('hba1c') || q.includes('sugar') || q.includes('cbc') || q.includes('thyroid') || q.includes('report') || q.includes('test')) {
      const research = researchClinicalFile(userPrompt, language);
      condition = research.documentType;
      specialist = research.recommendedSpecialist;
      doctorName = research.recommendedDoctor;
      doctorFee = research.doctorFee;
      labTest = research.recommendedLabTest;
      medicine = research.recommendedMedicine || 'Clinical Guidance';
      reply = isHindi
        ? `### 📊 लैब रिपोर्ट विश्लेषण: ${research.documentType}\n\nनमस्ते! 😊 आपकी रिपोर्ट की समीक्षा कर ली गई है:\n\n✨ **मुख्य निष्कर्ष:**\n${research.plainLanguageSummary}\n\n🩺 **OneCare स्पेशल 1-क्लिक सुविधा:**\n• **डॉक्टर:** ${research.recommendedDoctor} (${research.recommendedSpecialist})\n• **जांच:** ${research.recommendedLabTest}`
        : `### 📊 Lab Report Analysis: ${research.documentType}\n\nHello! 😊 Your diagnostic report has been clinically reviewed:\n\n✨ **Key Findings:**\n${research.plainLanguageSummary}\n\n🩺 **OneCare Special Quick Actions:**\n• **Specialist:** ${research.recommendedDoctor} (${research.recommendedSpecialist})\n• **Diagnostic:** ${research.recommendedLabTest}`;
    }
    // C. Skin Condition / Visual Rash Scan (ONLY when user explicitly mentions skin symptoms or rash)
    else if (q.includes('skin') || q.includes('rash') || q.includes('itch') || q.includes('allergy') || q.includes('eczema') || q.includes('fungal') || q.includes('ringworm') || q.includes('dermat') || q.includes('khujli') || q.includes('daag')) {
      condition = 'Eczema / Contact Dermatitis & Allergic Rash';
      specialist = 'Dermatologist';
      doctorName = 'Dr. Farhan Ali';
      doctorFee = 650;
      labTest = 'Total IgE Allergy Panel & Skin Scraping';
      labName = 'Dr. Lal PathLabs';
      medicine = 'Hydrocortisone 1% Cream & Cetirizine 10mg';
      reply = generateHumanLikeSkinReply(userPrompt, language);
    }
    // D. Generic Uploaded Image without medical keywords -> Guide user to upload genuine medical items
    else if (hasImage) {
      condition = 'Image Inspection & Verification';
      specialist = 'General Physician';
      doctorName = 'Dr. Priya Sharma';
      doctorFee = 500;
      labTest = 'Consultation If Needed';
      labName = 'OneCare Care Network';
      medicine = 'N/A';
      reply = generateNonMedicalReply(userPrompt, language);
    }
    // C. Blood Lab Report / Lipid / Sugar Scan
    else if (q.includes('blood') || q.includes('lipid') || q.includes('cholesterol') || q.includes('hba1c') || q.includes('sugar') || q.includes('report') || q.includes('test')) {
      condition = 'Metabolic & Cardiovascular Lab Assessment';
      specialist = 'Cardiologist / Physician';
      doctorName = 'Dr. Anil Verma';
      doctorFee = 900;
      labTest = 'Lipid Profile & HbA1c Diabetes Screen';
      labName = 'Thyrocare';
      medicine = 'Atorvastatin 10mg & Lifestyle Regimen';

      if (isHindi) {
        reply = `### 📊 लैब रिपोर्ट स्कैन व विश्लेषण: लिपिड व मेटाबॉलिक स्वास्थ्य

नमस्ते! 😊 आइए आपकी रिपोर्ट को आसान, समझने योग्य भाषा में देखें:

✨ **1. रिपोर्ट क्या दिखा रही है?**
रक्त में टोटल कोलेस्ट्रॉल (245 mg/dL) और "खराब" LDL (168 mg/dL) सामान्य सीमा (<100 mg/dL) से ऊपर है।

💡 **2. यह क्यों होता है (सरल उदाहरण)?**
हमारी रक्त वाहिकाएं (Arteries) शरीर के स्मूथ हाईवे की तरह होती हैं। जब खाने में सैचुरेटेड ऑइल्स, ट्रांस-फैट्स या कम एक्टिविटी होती है, तो हाईवे पर अतिरिक्त ग्रीस जमने लगता है, जिससे दिल पर ज्यादा जोर पड़ता है। 🫀

⏰ **3. आगे क्या करना चाहिए (डॉक्टर की सलाह):**
• 🥗 भोजन में फाइबर, ओट्स, मेथी और हरी सब्जियां बढ़ाएं।
• 🏃‍♂️ रोजाना 25-30 मिनट तेज वॉक करें ताकि "अच्छा" HDL कोलेस्ट्रॉल बढ़े।
• 🚫 डीप फ्राइड और पैकेज्ड स्नैक्स को कुछ हफ्तों के लिए बंद रखें।

🩺 **OneCare स्पेशल 1-क्लिक सुविधा:**
• **डॉक्टर:** Dr. Anil Verma (Senior Cardiologist, 15y exp)
• **फॉलो-अप जांच:** Comprehensive Lipid Profile (Thyrocare / Dr. Lal PathLabs)`;
      } else {
        reply = `### 📊 Lab Report Analysis: Lipid Profile & Heart Wellness

Hello there! 😊 Let's break down your blood report into clear, easy-to-understand terms:

✨ **1. What does your report show?**
Your Total Cholesterol (245 mg/dL) and "Bad" LDL Cholesterol (168 mg/dL) are elevated above optimal ranges (<100 mg/dL).

💡 **2. Why does this happen (Simple Analogy)?**
Think of your blood vessels like smooth expressways. When dietary saturated fats or metabolic sluggishness occur, sticky grease starts clinging to the lanes, making your heart pump with extra effort! 🫀

⏰ **3. Practical Steps for Quick Improvement:**
• 🏃‍♂️ **Daily Movement:** A brisk 30-minute walk daily naturally boosts your protective "Good" HDL cholesterol.
• 🥗 **Dietary Tweaks:** Swap deep-fried foods and refined flour for oats, walnuts, and green leafy vegetables.
• 💧 **Hydration:** Drink 2.5-3 liters of clean water daily.

🩺 **OneCare Special Quick Actions:**
• **Specialist:** Dr. Anil Verma (Senior Cardiologist, 15y exp)
• **Diagnostic Follow-up:** Comprehensive Lipid Panel (Dr. Lal PathLabs / Thyrocare)`;
      }
    }
    // D. General Clinical Triage
    else {
      condition = 'Primary Care Clinical Triage';
      specialist = 'General Physician';
      doctorName = 'Dr. Priya Sharma';
      doctorFee = 500;
      labTest = 'CBC (Complete Blood Count) & Vitals Panel';
      labName = 'Dr. Lal PathLabs';
      medicine = 'Paracetamol 650mg / Hydration Therapy';

      if (isHindi) {
        reply = `### 🩺 वनकेयर क्लिनिकल सहायता: प्राथमिक परामर्श

नमस्ते! 😊 आपकी बात सुनकर प्राथमिक स्वास्थ्य मार्गदर्शन तैयार किया गया है:

✨ **1. प्राथमिक राय:**
आपके बताए गए लक्षणों के अनुसार एक बार जनरल फिजिशियन से परामर्श और बेसिक ब्लड वर्क (CBC) करवाना सबसे सुरक्षित रहेगा। 🩺

💡 **2. घरेलू देखभाल:**
• 💧 पर्याप्त मात्रा में गुनगुना पानी या ओआरएस पिएं।
• 🥪 हल्का और सुपाच्य भोजन लें, भारी और मसालेदार खाने से बचें।
• 😴 7-8 घंटे की गहरी नींद लें ताकि शरीर तेजी से रिकवर हो सके।

⚠️ **जरूरी सूचना:** यदि अचानक तेज बुखार, सीने में दर्द या सांस लेने में तकलीफ हो, तो तुरंत SOS 108 बटन दबाएं।

🩺 **अनुशंसित डॉक्टर व टेस्ट:**
• **डॉक्टर:** Dr. Priya Sharma (General Physician, OneCare OPD)
• **टेस्ट:** Complete Blood Count (CBC) - Dr. Lal PathLabs`;
      } else {
        reply = `### 🩺 OneCare Clinical Assistant: Primary Care Consultation

Hello! 😊 I'm here to help guide you in warm, simple steps:

✨ **1. Clinical Assessment:**
Based on what you've described, a general primary health evaluation along with a basic Complete Blood Count (CBC) will quickly pinpoint any underlying infection or nutritional fatigue. 🩺

💡 **2. Immediate Comfort Steps:**
• 💧 **Hydration:** Sip lukewarm water or fresh coconut water throughout the day.
• 🥪 **Nourishment:** Stick to light, easy-to-digest home-cooked meals.
• 😴 **Rest:** Allow your body to recharge with good quality sleep.

⚠️ **Emergency Notice:** If you experience sudden chest heaviness or severe breathlessness, tap the Emergency 108 SOS button immediately!

🩺 **OneCare Special Quick Actions:**
• **Specialist:** Dr. Priya Sharma (General Physician & OPD Consultant)
• **Diagnostic Test:** Complete Blood Count (CBC) - Dr. Lal PathLabs`;
      }
    }

    const thinkingSteps = generateThinkingSteps(userPrompt);
    const researchDetails = (imageBase64 || userPrompt.toLowerCase().includes('report') || userPrompt.toLowerCase().includes('lipid') || userPrompt.toLowerCase().includes('cholesterol') || userPrompt.toLowerCase().includes('skin') || userPrompt.toLowerCase().includes('file') || userPrompt.toLowerCase().includes('pdf') || isMedicineIntent(userPrompt))
      ? researchClinicalFile(userPrompt, language)
      : undefined;

    res.json({
      success: true,
      reply,
      condition,
      specialist,
      doctorName,
      doctorFee,
      labTest,
      labName,
      medicine,
      thinkingSteps,
      researchDetails,
      model: 'onecare-clinical-engine',
    });
  } catch (error: any) {
    console.log('[AI Chat] Request handling exception:', error?.message);
    res.status(500).json({ error: 'Internal AI processing error', details: error?.message });
  }
});

// Mount Vite or serve static assets
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      port: Number(PORT),
      host: '0.0.0.0',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OneCare Special Full-Stack server running on port ${PORT}`);
});
