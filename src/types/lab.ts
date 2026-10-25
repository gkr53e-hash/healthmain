export type TestCategory = 'Pathology' | 'Cardiology' | 'Radiology' | 'Health Packages';

export interface LabTest {
  id: string;
  name: string;
  code: string;
  category: TestCategory;
  price: number;
  originalPrice?: number;
  fastingHours?: number;
  reportTime: string;
  sampleType: 'Blood' | 'Urine' | 'Scan' | 'Swab' | 'Saliva';
  description: string;
  popular?: boolean;
}

export interface LabPartner {
  id: string;
  name: string;
  badge?: string;
  area: string;
  city: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  hasHomeCollection: boolean;
  hasCentreVisit: boolean;
  phone: string;
  openingHours: string;
  popularTestIds: string[];
  allTestIds: string[];
}

export interface BookingItem {
  testId: string;
  name: string;
  price: number;
  category: TestCategory;
}

export type BookingMode = 'home' | 'centre';

export interface BookingRequest {
  id: string;
  labId: string;
  labName: string;
  labArea: string;
  labAddress: string;
  tests: BookingItem[];
  mode: BookingMode;
  slotDate: string;
  slotTime: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: 'Male' | 'Female' | 'Other';
  address?: string;
  notes?: string;
  subtotal: number;
  collectionFee: number;
  totalAmount: number;
  status: 'Confirmed' | 'Phlebotomist Assigned' | 'Sample Collected' | 'Report In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface BookingFormErrors {
  patientName?: string;
  patientPhone?: string;
  patientAge?: string;
  slotDate?: string;
  slotTime?: string;
  address?: string;
  tests?: string;
}
