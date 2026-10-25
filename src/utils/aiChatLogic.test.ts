import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseClinicalIntent,
  validateLoginCredentials,
  detectMedicine,
  generateHumanLikeMedicineReply,
  generateHumanLikeSkinReply,
  isMedicineIntent,
  researchClinicalFile,
  generateThinkingSteps,
  isNonMedicalIntent,
  generateNonMedicalReply,
} from './aiChatLogic.ts';

test('isNonMedicalIntent identifies Google screenshots and non-medical web images', () => {
  assert.equal(isNonMedicalIntent('Google search screenshot'), true);
  assert.equal(isNonMedicalIntent('chrome browser screenshot of google'), true);
  assert.equal(isNonMedicalIntent('gaurac_41673c36.png google search screen'), true);
  assert.equal(isNonMedicalIntent('Prescription for fever'), false);
  assert.equal(isNonMedicalIntent('Red itchy rash on back'), false);
});

test('generateNonMedicalReply warns in dual Hindi and English without false medical diagnosis', () => {
  const replyHi = generateNonMedicalReply('google screenshot', 'Hindi');
  assert.match(replyHi, /Google Search/i);
  assert.match(replyHi, /स्वास्थ्य संबंधी समस्या या बीमारी नहीं है/);
  assert.match(replyHi, /त्वचा रोग \(Skin problem\/rash\) नहीं है/);
  assert.match(replyHi, /दवाई का पत्ता/);
  assert.match(replyHi, /डॉक्टर का पर्चा/);
  assert.equal(replyHi.includes('Eczema / Contact Dermatitis'), false);

  const replyEn = generateNonMedicalReply('google screenshot', 'English');
  assert.match(replyEn, /Google Search/i);
  assert.match(replyEn, /NOT a skin rash/);
  assert.match(replyEn, /Medicine Packaging & Strips/i);
  assert.equal(replyEn.includes('Eczema / Contact Dermatitis'), false);
});

test('parseClinicalIntent handles non-medical screenshots gracefully without false dermatology alert', () => {
  const result = parseClinicalIntent('This is a google search screenshot photo');
  assert.equal(result.condition, 'Non-Medical Image / गैर-चिकित्सकीय छवि');
  assert.equal(result.urgency, 'Routine');
});


test('detectMedicine accurately identifies Pantoprazole / Pan-D with empty stomach timing', () => {
  const med = detectMedicine('How do I take this Pantoprazole 40mg capsule?');
  assert.ok(med);
  assert.equal(med.name, 'Pantoprazole / Pan-D');
  assert.match(med.timingRule, /Empty stomach/);
  assert.match(med.howToTake, /30 to 45 minutes BEFORE breakfast/);
});

test('detectMedicine identifies Dolo 650 and warns against alcohol & double dosing', () => {
  const med = detectMedicine('Can I take Dolo 650 for my severe headache and fever?');
  assert.ok(med);
  assert.match(med.name, /Dolo 650/);
  assert.ok(med.whatToAvoid.some((warning) => warning.includes('alcohol')));
});

test('isMedicineIntent recognizes diverse medicine keywords', () => {
  assert.equal(isMedicineIntent('What is this capsule for?'), true);
  assert.equal(isMedicineIntent('Tell me about azithromycin tablet'), true);
  assert.equal(isMedicineIntent('ye dawa kaise khaye?'), true);
  assert.equal(isMedicineIntent('general morning walk questions'), false);
});

test('generateHumanLikeMedicineReply outputs warm, human-like explanation with emojis', () => {
  const med = detectMedicine('Pantoprazole')!;
  const replyEn = generateHumanLikeMedicineReply(med, 'English');
  assert.match(replyEn, /💊/);
  assert.match(replyEn, /✨/);
  assert.match(replyEn, /💡/);
  assert.match(replyEn, /kitchen tap/); // Simple analogy
  assert.match(replyEn, /💧/);

  const replyHi = generateHumanLikeMedicineReply(med, 'Hindi');
  assert.match(replyHi, /💊/);
  assert.match(replyHi, /नमस्ते!/);
  assert.match(replyHi, /दवाई/);
});

test('generateHumanLikeSkinReply provides plain language explanation with emojis', () => {
  const reply = generateHumanLikeSkinReply('Red rash on arm', 'English');
  assert.match(reply, /🩺/);
  assert.match(reply, /Skin Shield Disturbance/);
  assert.match(reply, /🧊/);
  assert.match(reply, /Dr\. Farhan Ali/);
});

test('parseClinicalIntent routes skin rash to Dermatologist Dr. Farhan Ali', () => {
  const result = parseClinicalIntent('Severe red itchy skin rash on forearm with burning sensation');
  assert.equal(result.specialist, 'Dermatologist');
  assert.equal(result.doctorName, 'Dr. Farhan Ali');
  assert.equal(result.doctorFee, 650);
  assert.match(result.labTest, /Allergy/);
});

test('parseClinicalIntent routes cardiopulmonary symptoms to Cardiologist Dr. Anil Verma', () => {
  const result = parseClinicalIntent('Sudden chest heaviness and palpitations');
  assert.equal(result.specialist, 'Cardiologist');
  assert.equal(result.doctorName, 'Dr. Anil Verma');
  assert.equal(result.doctorFee, 900);
  assert.equal(result.urgency, 'Urgent');
});

test('validateLoginCredentials validates demo emails and matches appropriate roles', () => {
  const patient = validateLoginCredentials('patient@onecarespecial.in', 'Patient@123');
  assert.equal(patient.isValid, true);
  assert.equal(patient.role, 'patient');

  const doctor = validateLoginCredentials('dr.priya@onecarespecial.in', 'Doctor@123');
  assert.equal(doctor.isValid, true);
  assert.equal(doctor.role, 'doctor');

  const admin = validateLoginCredentials('admin@onecarespecial.in', 'Admin@123');
  assert.equal(admin.isValid, true);
  assert.equal(admin.role, 'admin');

  const lab = validateLoginCredentials('lab.lal@onecarespecial.in', 'Lab@123');
  assert.equal(lab.isValid, true);
  assert.equal(lab.role, 'lab');
});

test('researchClinicalFile extracts lipid profile biomarkers and provides clinical guidelines', () => {
  const research = researchClinicalFile('Patient Lipid Blood Report.pdf', 'English');
  assert.ok(research.biomarkers.length >= 3);
  const ldl = research.biomarkers.find((b) => b.name.includes('LDL'));
  assert.ok(ldl);
  assert.equal(ldl.status, 'high');
  assert.equal(research.recommendedSpecialist, 'Cardiologist');
  assert.equal(research.recommendedDoctor, 'Dr. Anil Verma');
  assert.ok(research.researchGuidelines.some((g) => g.includes('ICMR') || g.includes('AHA')));
  assert.ok(research.thinkingSteps.length >= 3);
});

test('generateThinkingSteps creates step-by-step reasoning steps for clinical reasoning', () => {
  const steps = generateThinkingSteps('I need to research my Pan-D prescription file');
  assert.ok(steps.length >= 3);
  assert.ok(steps[0].includes('pharmaceutical') || steps[0].includes('molecules') || steps[0].includes('Extracting'));
});

