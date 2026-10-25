export type UserRole = 'patient' | 'doctor' | 'admin' | 'lab';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email: string;
  avatar: string;
  badge?: string;
  title?: string;
  organization?: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  patient: {
    id: 'usr-patient-01',
    name: 'Rahul Sharma',
    role: 'patient',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=160',
    title: 'Verified Patient',
    badge: 'Gold Care Member',
  },
  doctor: {
    id: 'usr-doctor-01',
    name: 'Dr. Priya Sharma',
    role: 'doctor',
    phone: '+91 98351 98765',
    email: 'dr.priya@onecarespecial.in',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=160',
    title: 'Senior Cardiologist & Physician',
    organization: 'Paras HMRI Hospital & OneCare OPD',
    badge: 'Verified Specialist (MBBS, MD)',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Rajesh Mehta',
    role: 'admin',
    phone: '+91 94310 11223',
    email: 'admin@onecarespecial.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=160',
    title: 'Chief Medical Officer & Administrator',
    organization: 'OneCare Special Command Center',
    badge: 'Super Admin Access',
  },
  lab: {
    id: 'usr-lab-01',
    name: 'Vikram Singh (Dr. Lal PathLabs)',
    role: 'lab',
    phone: '+91 98350 44556',
    email: 'ops.patna@lalpathlabs.com',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=160',
    title: 'Pathology Diagnostics Head',
    organization: 'Dr. Lal PathLabs — Bailey Road Hub',
    badge: 'Certified Diagnostic Partner',
  },
};
