import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUserAuth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  MotherRecord,
  AppointmentRecord,
  HealthRecordItem,
  CareTaskRecord,
  MedicalReportRecord,
  FirebaseUser
} from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with explicit firestoreDatabaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Operation Types for Hardened Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standardized Firestore error handler conforming to skill requirements
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Test initial Firestore server connection at boot
 */
export async function testFirestoreConnection(): Promise<{ isOnline: boolean; error?: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { isOnline: true };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
      return { isOnline: false, error: 'Offline / Network restricted' };
    }
    // Any permission error or response confirms the server endpoint is reachable
    return { isOnline: true };
  }
}

// -------------------------------------------------------------
// Authentication with Google
// -------------------------------------------------------------

export async function signInWithGoogle(): Promise<{ user: FirebaseUser; mother: MotherRecord }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const authUser = cred.user;

    const userObj: FirebaseUser = {
      id: authUser.uid,
      email: authUser.email || '',
      name: authUser.displayName || 'MomCare Mother',
      avatar: authUser.photoURL || undefined,
    };

    // Load or create linked mother record in Firestore
    const mother = await getOrCreateMotherProfile(authUser);
    return { user: userObj, mother };
  } catch (err: any) {
    console.error('Google Sign-In failed:', err);
    throw new Error(err.message || 'Failed to authenticate with Google.');
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// -------------------------------------------------------------
// Mother Profile (users collection)
// -------------------------------------------------------------

export async function getOrCreateMotherProfile(authUser: FirebaseUserAuth): Promise<MotherRecord> {
  const path = `users/${authUser.uid}`;
  const userRef = doc(db, 'users', authUser.uid);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        userId: snap.id,
        user: snap.id,
        email: data.email || authUser.email || '',
        name: data.name || authUser.displayName || 'MomCare Patient',
        age: Number(data.age) || 28,
        contact: data.contact || '',
        address: data.address || '',
        pregnancy_number: Number(data.pregnancy_number) || 1,
        due_date: data.due_date || new Date(Date.now() + 150 * 86400000).toISOString().split('T')[0],
        current_week: Number(data.current_week) || 16,
        lmp_date: data.lmp_date || '',
        baby_name: data.baby_name || '',
        baby_gender: data.baby_gender || 'surprise',
        baby_notes: data.baby_notes || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  // Create default profile for first-time sign-in
  const now = new Date().toISOString();
  const defaultProfile = {
    email: authUser.email || 'mother@momcare.ai',
    name: authUser.displayName || 'MomCare Patient',
    age: 28,
    contact: '+1 555-019-2831',
    address: 'City Center Maternal Ward',
    pregnancy_number: 1,
    due_date: new Date(Date.now() + 150 * 86400000).toISOString().split('T')[0],
    current_week: 16,
    lmp_date: '',
    baby_name: '',
    baby_gender: 'surprise',
    baby_notes: '',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(userRef, defaultProfile);
    // Seed initial tasks for new mother
    await seedDefaultCareTasks(authUser.uid);

    return {
      id: authUser.uid,
      userId: authUser.uid,
      user: authUser.uid,
      ...defaultProfile,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMotherProfile(
  userId: string,
  data: Partial<MotherRecord>
): Promise<MotherRecord> {
  const path = `users/${userId}`;
  const userRef = doc(db, 'users', userId);

  const cleanData: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  delete cleanData.id;
  delete cleanData.user;
  delete cleanData.userId;

  try {
    await updateDoc(userRef, cleanData);
    const snap = await getDoc(userRef);
    const updated = snap.data();
    return {
      id: userId,
      userId,
      user: userId,
      email: updated?.email || '',
      name: updated?.name || 'MomCare Patient',
      age: Number(updated?.age) || 28,
      contact: updated?.contact || '',
      address: updated?.address || '',
      pregnancy_number: Number(updated?.pregnancy_number) || 1,
      due_date: updated?.due_date || '',
      current_week: Number(updated?.current_week) || 16,
      lmp_date: updated?.lmp_date || '',
      baby_name: updated?.baby_name || '',
      baby_gender: updated?.baby_gender || 'surprise',
      baby_notes: updated?.baby_notes || '',
      updatedAt: updated?.updatedAt,
      createdAt: updated?.createdAt,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// -------------------------------------------------------------
// Care Tasks (care_tasks collection)
// -------------------------------------------------------------

export function subscribeCareTasks(
  userId: string,
  callback: (tasks: CareTaskRecord[]) => void
): () => void {
  const path = 'care_tasks';
  const q = query(collection(db, 'care_tasks'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: CareTaskRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          mother: d.userId,
          task_name: d.task_name,
          task_date: d.task_date,
          completed: Boolean(d.completed),
          category: d.category,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      callback(tasks);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function toggleCareTask(taskId: string, completed: boolean): Promise<void> {
  const path = `care_tasks/${taskId}`;
  try {
    await updateDoc(doc(db, 'care_tasks', taskId), {
      completed,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addCareTask(task: {
  userId: string;
  task_name: string;
  task_date: string;
  completed: boolean;
  category: 'morning' | 'afternoon' | 'evening' | 'nutrition' | 'medication' | 'hydration' | 'symptom' | 'rest';
}): Promise<string> {
  const path = 'care_tasks';
  const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'care_tasks', id), {
      ...task,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function seedDefaultCareTasks(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const defaults = [
    {
      userId,
      task_name: 'Warm Spinach & Lentil Toast (Folate & Iron)',
      task_date: today,
      completed: true,
      category: 'morning' as const,
    },
    {
      userId,
      task_name: 'Prenatal Multivitamin with Orange Juice',
      task_date: today,
      completed: true,
      category: 'morning' as const,
    },
    {
      userId,
      task_name: 'Hydration Target (Sip 1.5L before 2:00 PM)',
      task_date: today,
      completed: false,
      category: 'afternoon' as const,
    },
    {
      userId,
      task_name: 'Daily Symptom & Energy Check-in',
      task_date: today,
      completed: false,
      category: 'afternoon' as const,
    },
    {
      userId,
      task_name: '20-Minute Left-Lateral Rest with Elevated Legs',
      task_date: today,
      completed: false,
      category: 'evening' as const,
    },
    {
      userId,
      task_name: 'Review Questions for Next Clinical Visit',
      task_date: today,
      completed: false,
      category: 'evening' as const,
    },
  ];

  for (const t of defaults) {
    try {
      await addCareTask(t);
    } catch (e) {
      console.warn('Seeding task error:', e);
    }
  }
}

// -------------------------------------------------------------
// Appointments (appointments collection)
// -------------------------------------------------------------

export function subscribeAppointments(
  userId: string,
  callback: (appointments: AppointmentRecord[]) => void
): () => void {
  const path = 'appointments';
  const q = query(collection(db, 'appointments'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: AppointmentRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          mother: d.userId,
          doctor_name: d.doctor_name,
          appointment_date: d.appointment_date,
          purpose: d.purpose,
          status: d.status || 'scheduled',
          notes: d.notes || '',
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function addAppointmentRecord(appointment: {
  userId: string;
  doctor_name: string;
  appointment_date: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}): Promise<string> {
  const id = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const path = `appointments/${id}`;
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'appointments', id), {
      ...appointment,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteAppointmentRecord(appointmentId: string): Promise<void> {
  const path = `appointments/${appointmentId}`;
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// Health Records & Symptoms (health_records collection)
// -------------------------------------------------------------

export function subscribeHealthRecords(
  userId: string,
  callback: (records: HealthRecordItem[]) => void
): () => void {
  const path = 'health_records';
  const q = query(collection(db, 'health_records'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: HealthRecordItem[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          mother: d.userId,
          record_date: d.record_date,
          record_type: d.record_type,
          details: d.details,
          doctor_notes: d.doctor_notes,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function addHealthRecordEntry(record: {
  userId: string;
  record_date: string;
  record_type: 'symptom' | 'vitals' | 'clinical_note';
  details: string;
  doctor_notes?: string;
}): Promise<string> {
  const id = `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const path = `health_records/${id}`;
  const now = new Date().toISOString();
  try {
    await setDoc(doc(db, 'health_records', id), {
      ...record,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// -------------------------------------------------------------
// Medical Reports (medical_reports collection)
// -------------------------------------------------------------

export function subscribeMedicalReports(
  userId: string,
  callback: (reports: MedicalReportRecord[]) => void
): () => void {
  const path = 'medical_reports';
  const q = query(collection(db, 'medical_reports'), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports: MedicalReportRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          mother: d.userId,
          report_name: d.report_name,
          report_date: d.report_date,
          file: d.file_name || d.file || '',
          file_name: d.file_name || '',
          summary: d.summary,
          file_url: d.file_data || d.file_url || undefined,
          file_data: d.file_data,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        };
      });
      callback(reports);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function uploadMedicalReport(
  userId: string,
  file: File,
  reportName: string,
  reportDate: string,
  summary: string
): Promise<MedicalReportRecord> {
  const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const path = `medical_reports/${id}`;
  const now = new Date().toISOString();

  // Convert file to Base64 data URL for lightweight storage if under 750KB
  let fileDataUrl: string = '';
  if (file.size < 750000) {
    fileDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  const payload = {
    userId,
    report_name: reportName.trim() || file.name,
    report_date: reportDate || now.split('T')[0],
    file_name: file.name,
    file_data: fileDataUrl || '',
    summary: summary.slice(0, 8000),
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'medical_reports', id), payload);
    return {
      id,
      mother: userId,
      ...payload,
      file_url: fileDataUrl || URL.createObjectURL(file),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateMedicalReportSummary(
  reportId: string,
  summary: string
): Promise<void> {
  const path = `medical_reports/${reportId}`;
  try {
    await updateDoc(doc(db, 'medical_reports', reportId), {
      summary: summary.slice(0, 8000),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
