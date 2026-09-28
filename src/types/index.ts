export type ScreenType =
  | 'welcome'
  | 'onboarding'
  | 'home'
  | 'mom-care'
  | 'daily-tracker'
  | 'baby-care'
  | 'insights'
  | 'report-analyzer'
  | 'chat'
  | 'appointments'
  | 'profile';

export interface UserProfile {
  name: string;
  age: number;
  pregnancyStatus: 'pregnant' | 'postpartum' | 'trying';
  pregnancyWeek: number;
  expectedDeliveryDate: string;
  pregnancyType: 'First pregnancy' | 'Previous pregnancy';
  foodPreferences: string[];
  allergies: string[];
  medications: string[];
  reminderTimes: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  babyName?: string;
  babyGender?: 'boy' | 'girl' | 'surprise';
  babyNotes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'wellness' | 'reminder' | 'clinical';
  timestamp: string;
  category: 'milestone' | 'hydration' | 'medication' | 'appointment' | 'kicks';
  actionLabel?: string;
  actionScreen?: ScreenType;
  prefillChat?: string;
  read?: boolean;
}

export interface CareTask {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  title: string;
  subtitle: string;
  category: 'nutrition' | 'medication' | 'hydration' | 'symptom' | 'rest' | 'appointment';
  completed: boolean;
  timeString: string;
}

export type ConfidenceLevel = 'High' | 'Moderate' | 'Needs Review';

export interface AIInsight {
  id: string;
  title: string;
  patternNoticed: string;
  confidence: ConfidenceLevel;
  whyThisInsight: string;
  whatYouCanDo: string;
  whenToSeekCare: string;
  medicalSources: string[];
  category: 'maternal' | 'nutrition' | 'vitals';
  escalated?: boolean;
  timestamp: string;
}

export interface ReportTerm {
  term: string;
  definition: string;
  normalRange?: string;
  userValue?: string;
  interpretation?: string;
}

export interface HealthReport {
  id: string;
  title: string;
  date: string;
  doctorOrLab: string;
  type: 'Blood Report' | 'Prescription' | 'Ultrasound / Scan' | 'Discharge Summary' | 'Glucose Screen' | 'Urinalysis / Protein Screen';
  whatReportContains: string[];
  simpleExplanation: string;
  importantTerms: ReportTerm[];
  questionsForProvider: string[];
  medicalSources: string[];
  confidence: ConfidenceLevel;
  fileUrl?: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  questionsToAsk: string[];
  isAiPrepared: boolean;
  type: 'Ultrasound' | 'Routine Check' | 'Glucose Screening' | 'Pediatrician Consult';
}

export interface BabyCareData {
  mode: 'antenatal' | 'postpartum';
  profile: {
    name: string;
    nickname?: string;
    gender?: 'boy' | 'girl' | 'surprise';
    dobOrDue: string;
    ageFormatted: string;
    gestationalAgeWeeks?: number;
    notes?: string;
  };
  todayFeedings: {
    id: string;
    time: string;
    type: string;
    amount: string;
    notes: string;
  }[];
  todaySleep: {
    id: string;
    time: string;
    duration: string;
    quality: string;
  }[];
  growthHistory: {
    month: number;
    weightKg: number;
    heightCm: number;
    headCircumferenceCm: number;
    percentileWeight: string;
  }[];
  vaccinations: {
    id: string;
    name: string;
    description: string;
    targetAge: string;
    status: 'completed' | 'upcoming' | 'due-soon';
    dueDate: string;
    notes?: string;
    batchOrNotes?: string;
  }[];
  milestones: {
    id: string;
    title: string;
    description: string;
    category: 'Motor' | 'Cognitive' | 'Social' | 'Language';
    targetMonth: string;
    achieved: boolean;
  }[];
}

export interface SymptomLog {
  id: string;
  symptomName: string;
  severity: 'mild' | 'moderate' | 'significant';
  timestamp: string;
  notes: string;
}

export interface ProductRecommendation {
  name: string;
  intendedUse: string;
  manufacturer: string;
  productUrl: string;
  clinicalReminder: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  structuredData?: {
    answer: string;
    whyRelevant: string;
    sources: string[];
    whenToContactDoctor?: string;
    followUpQuestions?: string[];
    productRecommendations?: ProductRecommendation[];
  };
}

// Firebase & Firestore Schema Interfaces
export interface FirebaseUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created?: string;
  updated?: string;
}

// Backward-compatibility alias
export type PocketBaseUser = FirebaseUser;

export interface MotherRecord {
  id: string;
  user?: string; // Relation to user id
  userId?: string;
  email?: string;
  name: string;
  age: number;
  contact: string;
  address: string;
  pregnancy_number: number | string;
  due_date: string;
  current_week: number;
  lmp_date?: string;
  baby_name?: string;
  baby_gender?: 'boy' | 'girl' | 'surprise';
  baby_notes?: string;
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentRecord {
  id: string;
  userId?: string;
  mother?: string; // Compatible alias
  appointment_date: string;
  doctor_name: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthRecordItem {
  id: string;
  userId?: string;
  mother?: string; // Compatible alias
  record_date: string;
  record_type: 'symptom' | 'vitals' | 'clinical_note';
  details: string; // text or JSON string
  doctor_notes?: string;
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareTaskRecord {
  id: string;
  userId?: string;
  mother?: string; // Compatible alias
  task_name: string;
  task_date: string;
  completed: boolean;
  category: 'morning' | 'afternoon' | 'evening' | 'nutrition' | 'medication' | 'hydration' | 'symptom' | 'rest';
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalReportRecord {
  id: string;
  userId?: string;
  mother?: string; // Compatible alias
  report_name: string;
  report_date: string;
  file?: string;
  file_name?: string;
  summary: string;
  file_url?: string;
  file_data?: string;
  created?: string;
  updated?: string;
  createdAt?: string;
  updatedAt?: string;
}
