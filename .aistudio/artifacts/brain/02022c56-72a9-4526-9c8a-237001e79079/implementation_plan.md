# Smart Image Classification & Non-Medical Screenshot Detection

Prevent false skin disease diagnoses by adding intelligent image domain classification and verification to the OneCare clinical scanner, accurately identifying non-medical screenshots (such as Google search pages, apps, and general photos) and guiding users in dual Hindi and English to upload medical documents.

> [!IMPORTANT]
> **User Review & Confirmed Decisions from Phase 1:**
> - **Behavior on Non-Medical Uploads**: Accurately describe and identify what the image actually depicts (e.g. "Google Search homepage / Chrome web browser screenshot") rather than falsely diagnosing it as a clinical ailment or skin problem.
> - **Language & Notification Style**: Provide clear, polite guidance in dual Hindi & English with practical tips on what medical files to scan (medicine strips, doctor prescriptions, lab test reports, or actual symptoms).

---

## 1. Overview & Core Concept

### What It Does
Upgrades both the server-side Gemini 3.8 Flash pipeline and the offline heuristic engine to inspect image content before clinical triage. If an image is identified as a non-medical picture (computer screenshot, web page, vehicle, animal, object, or scenery), the assistant clearly tells the user what was detected and explains that no medical condition is present, providing helpful instructions on how to photograph and scan authentic medical documents.

### Target Persona
Users scanning health documents, medicine strips, or symptom photos who may inadvertently upload non-medical images, screenshots, or receipts, ensuring they receive genuine, trustworthy feedback without alarming false positives.

### Key Value
- **Zero False Medical Diagnoses**: Eliminates the critical bug where non-medical images (like a Google search screenshot) were automatically labeled as "Eczema / Contact Dermatitis".
- **Real-World Object & Screenshot Recognition**: Correctly identifies software interfaces, Google homepages, documents, and everyday objects.
- **Supportive Bilingual Guidance**: Warmly prompts users in Hindi and English with examples of what can be scanned (medicine strips, prescriptions, lab reports).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **User Uploads Non-Medical Image**: User uploads a browser screenshot, desktop photo, or everyday object.
2. **Accurate Detection & Explanation**:
   - The AI identifies the image: *"This image shows a Google search engine home page with browser shortcuts."*
   - Polite Bilingual Banner: *"⚠️ गैर-चिकित्सकीय छवि पहचान (Non-Medical Image Detected) — यह कोई दवाई, पर्ची, लैब रिपोर्ट या शारीरिक लक्षण की तस्वीर नहीं है।"*
3. **Interactive Scan Suggestions**:
   - Offers quick-action pills to scan sample medicine strips (Pan-D, Dolo 650) or upload a genuine lab report.

### Visual Identity & Theme
- **Status State**: Amber notification accent (`#F59E0B` / `text-amber-400 bg-amber-500/10 border-amber-500/30`) indicating an informational non-medical upload, avoiding alarming red or false clinical flags.
- **Card Styling**: Clean, structured preview card with clear icon (`Eye` / `FileWarning`) and concise dual-language guidance.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Pre-Triage Classification in Gemini System Instruction
- **Chosen Approach**: Explicitly mandate in the Gemini 3.8 Flash system prompt to evaluate image domain first. If non-medical, explain what it actually is, state clearly that it is non-medical, and do not assign a doctor or disease.
- **Why**: Gemini 3.8 Flash has outstanding multimodal understanding and will immediately recognize a Google Chrome new tab page, search bar, or desktop screenshot.

### Decision 2: Removal of Indiscriminate `hasImage` Fallback
- **Chosen Approach**: Remove the dangerous `hasImage` catch-all condition in the server fallback that previously routed every image to the skin rash handler.
- **Why**: In the previous code, `else if (hasImage || q.includes('skin'))` guaranteed that any image that wasn't explicitly matched as medicine was treated as eczema. We will replace this with intelligent intent detection and a dedicated non-medical fallback response.

### Decision 3: Server-side `dotenv` Integration
- **Chosen Approach**: Ensure `import 'dotenv/config'` is loaded at the very top of `server.ts` and initialize Gemini client per-request to reliably use `process.env.GEMINI_API_KEY`.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Image Upload                               │
│                   (e.g. Google Chrome Screenshot)                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Base64 Payload
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        server.ts (/api/ai-chat)                        │
│                                                                        │
│   Step 1: Domain Classification & Medical Relevance Check              │
│           ├── Is it a Medicine Strip / Packaging?                      │
│           ├── Is it a Doctor Prescription (Rx)?                        │
│           ├── Is it a Pathology Lab Report (CBC/Lipid/Sugar/Thyroid)?  │
│           ├── Is it a Clinical Physical Symptom / Rash?                │
│           └── Is it Non-Medical? (Screenshot, App, Scenery, Object)   │
│                                                                        │
│   Step 2: Dual Hindi/English Response Generation                       │
│           • If Non-Medical: Describe image accurately + guide upload  │
│           • If Medical: Precise OCR, dosage rules & reference ranges   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Client UI (AdvancedAIChatModal)                     │
│    Renders informative Non-Medical Banner or Clinical Report Card      │
└────────────────────────────────────────────────────────────────────────┘
```

### Files & Modules to Modify
- **`server.ts`**:
  - Add `import 'dotenv/config'` at top of file.
  - Revise Gemini prompt to detect non-medical images and report them accurately.
  - Overhaul fallback heuristics: remove the blind `hasImage` shortcut to skin rash; add specific non-medical/screenshot detector.
- **`src/utils/aiChatLogic.ts`**:
  - Add `isNonMedicalImage(query)` detector to identify screenshots, UI elements, wallpaper, web pages, or non-clinical photos.
  - Generate polite, helpful dual Hindi/English non-medical guidance.

---

## 5. Verification Plan

1. **Google Screenshot Test**: Upload the user's attached Google screenshot (`/public/assets/aistudio/gaurac_41673c36.png`) to `/api/ai-chat` and verify that the reply identifies it as a Google search / browser screenshot and does NOT diagnose any skin problem.
2. **Medical Scan Verification**: Verify that genuine medicine strips (Pan-D, Dolo 650) and lab reports still get analyzed with 100% precision.
3. **Applet Compilation & Linting**: Run `compile_applet` and `lint_applet` to confirm zero regressions.
