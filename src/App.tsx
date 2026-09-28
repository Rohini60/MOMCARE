/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  UserProfile,
  CareTask,
  AIInsight,
  Appointment,
  BabyCareData,
  ChatMessage,
  SymptomLog,
  FirebaseUser,
  MotherRecord,
  CareTaskRecord,
  AppointmentRecord
} from './types';
import {
  initialUserProfile,
  initialCareTasks,
  initialAIInsights,
  initialAppointments,
  initialBabyData,
  initialChatMessages,
  initialSymptomLogs
} from './data/mockData';
import { generateMomCareResponse } from './services/aiService';
import {
  auth,
  testFirestoreConnection,
  getOrCreateMotherProfile,
  subscribeCareTasks,
  toggleCareTask,
  subscribeAppointments,
  addAppointmentRecord,
  subscribeHealthRecords,
  addHealthRecordEntry,
  updateMotherProfile,
  logoutUser
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Navigation Components
import { TopBar } from './components/Navigation/TopBar';
import { BottomNav } from './components/Navigation/BottomNav';
import { SidebarNav } from './components/Navigation/SidebarNav';

// Screens
import { WelcomeScreen } from './components/Screens/WelcomeScreen';
import { OnboardingScreen } from './components/Screens/OnboardingScreen';
import { HomeScreen } from './components/Screens/HomeScreen';
import { MomCareScreen } from './components/Screens/MomCareScreen';
import { DailyCareTrackerScreen } from './components/Screens/DailyCareTrackerScreen';
import { BabyCareScreen } from './components/Screens/BabyCareScreen';
import { InsightsScreen } from './components/Screens/InsightsScreen';
import { ReportAnalyzerScreen } from './components/Screens/ReportAnalyzerScreen';
import { MomCareAIScreen } from './components/Screens/MomCareAIScreen';
import { AppointmentsScreen } from './components/Screens/AppointmentsScreen';
import { PrivacySettingsScreen } from './components/Screens/PrivacySettingsScreen';

// Modals & PWA Indicators
import { LogSymptomModal } from './components/Modals/LogSymptomModal';
import { PrepareAppointmentModal } from './components/Modals/PrepareAppointmentModal';
import { AuthModal } from './components/Auth/AuthModal';
import { EditMotherProfileModal } from './components/Auth/EditMotherProfileModal';
import { OfflineIndicator } from './components/Common/OfflineIndicator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [careTasks, setCareTasks] = useState<CareTask[]>(initialCareTasks);
  const [insights, setInsights] = useState<AIInsight[]>(initialAIInsights);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(initialSymptomLogs);
  const [babyData, setBabyData] = useState<BabyCareData>(initialBabyData);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  // Firebase Authentication & Maternal Profile State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentMother, setCurrentMother] = useState<MotherRecord | null>(null);

  // Modals state
  const [isLogSymptomOpen, setIsLogSymptomOpen] = useState(false);
  const [selectedAppointmentForPrep, setSelectedAppointmentForPrep] = useState<Appointment | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // 1. Initial Firestore connection validation & Firebase Auth observer
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseAuthUser) => {
      if (firebaseAuthUser) {
        const userObj: FirebaseUser = {
          id: firebaseAuthUser.uid,
          email: firebaseAuthUser.email || '',
          name: firebaseAuthUser.displayName || 'MomCare Patient',
          avatar: firebaseAuthUser.photoURL || undefined,
        };
        setCurrentUser(userObj);

        try {
          const mother = await getOrCreateMotherProfile(firebaseAuthUser);
          setCurrentMother(mother);

          setUser((prev) => ({
            ...prev,
            name: mother.name || prev.name,
            pregnancyWeek: mother.current_week || prev.pregnancyWeek,
            expectedDeliveryDate: mother.due_date || prev.expectedDeliveryDate,
            age: mother.age || prev.age,
          }));
        } catch (e) {
          console.warn('Could not sync user profile from Firestore:', e);
        }
      } else {
        // User is not signed into Firebase
        setCurrentUser(null);
        setCurrentMother(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Subscriptions for authenticated user
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubTasks = subscribeCareTasks(currentUser.id, (tasks) => {
      if (tasks.length > 0) {
        const mapped: CareTask[] = tasks.map((r, i) => ({
          id: r.id,
          timeOfDay: (r.category === 'morning' || r.category === 'afternoon' || r.category === 'evening'
            ? r.category
            : i < 2
            ? 'morning'
            : i < 4
            ? 'afternoon'
            : 'evening') as any,
          title: r.task_name,
          subtitle: `Cloud Firestore · ${r.category}`,
          category: 'nutrition',
          completed: r.completed,
          timeString: r.task_date || 'Today',
        }));
        setCareTasks(mapped);
      }
    });

    const unsubAppointments = subscribeAppointments(currentUser.id, (records) => {
      if (records.length > 0) {
        const mapped: Appointment[] = records.map((a) => ({
          id: a.id,
          doctorName: a.doctor_name,
          specialty: 'Obstetrics & Maternal Health',
          clinicName: 'Health Center',
          date: a.appointment_date,
          time: '10:00 AM',
          location: 'Health Facility / Hospital',
          notes: a.notes || a.purpose,
          questionsToAsk: [
            'Review gestational weight and fundal height.',
            'Discuss any recent lab reports or symptoms.'
          ],
          isAiPrepared: false,
          type: (a.purpose?.includes('Scan') || a.purpose?.includes('Ultrasound')
            ? 'Ultrasound'
            : 'Routine Check') as any,
        }));
        setAppointments(mapped);
      }
    });

    const unsubHealth = subscribeHealthRecords(currentUser.id, (records) => {
      if (records.length > 0) {
        const mappedSymptoms: SymptomLog[] = [];
        for (const rec of records) {
          if (rec.record_type === 'symptom') {
            try {
              const parsed = JSON.parse(rec.details);
              mappedSymptoms.push({
                id: rec.id,
                symptomName: parsed.symptomName || 'Recorded Symptom',
                severity: parsed.severity || 'mild',
                timestamp: parsed.timestamp || rec.record_date,
                notes: rec.doctor_notes || parsed.notes || '',
              });
            } catch {
              mappedSymptoms.push({
                id: rec.id,
                symptomName: rec.details.slice(0, 30),
                severity: 'mild',
                timestamp: rec.record_date,
                notes: rec.doctor_notes || '',
              });
            }
          }
        }
        if (mappedSymptoms.length > 0) {
          setSymptoms(mappedSymptoms);
        }
      }
    });

    return () => {
      unsubTasks();
      unsubAppointments();
      unsubHealth();
    };
  }, [currentUser?.id]);

  // 3. Task toggle handler with Firestore persistence
  const handleToggleTask = async (taskId: string) => {
    const target = careTasks.find((t) => t.id === taskId);
    const newCompleted = target ? !target.completed : true;

    // Optimistic UI update
    setCareTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );

    // Persist to Firestore if user has active session
    if (currentUser?.id) {
      try {
        await toggleCareTask(taskId, newCompleted);
      } catch (err) {
        console.warn('Could not update task in Firestore, cached locally:', err);
      }
    }
  };

  // 4. Symptom log handler with Firestore health_records persistence
  const handleSaveSymptom = async (newSymptom: SymptomLog) => {
    setSymptoms([newSymptom, ...symptoms]);
    setCareTasks((prev) =>
      prev.map((t) => (t.id === 'a2' ? { ...t, completed: true } : t))
    );

    // Save to Firestore `health_records`
    if (currentUser?.id) {
      try {
        await addHealthRecordEntry({
          userId: currentUser.id,
          record_date: new Date().toISOString().split('T')[0],
          record_type: 'symptom',
          details: JSON.stringify(newSymptom),
          doctor_notes: newSymptom.notes,
        });
      } catch (e) {
        console.warn('Could not save health record to Firestore:', e);
      }
    }
  };

  // 5. Appointment handlers with Firestore persistence
  const handleSaveQuestions = (appointmentId: string, questions: string[]) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, questionsToAsk: questions, isAiPrepared: true } : apt
      )
    );
  };

  const handleAddAppointment = async (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);

    // Save to Firestore `appointments`
    if (currentUser?.id) {
      try {
        const createdId = await addAppointmentRecord({
          userId: currentUser.id,
          appointment_date: newApt.date,
          doctor_name: newApt.doctorName,
          purpose: newApt.type,
          status: 'scheduled',
          notes: newApt.notes,
        });
        setAppointments((prev) =>
          prev.map((a) => (a.id === newApt.id ? { ...a, id: createdId } : a))
        );
      } catch (e) {
        console.warn('Could not persist appointment to Firestore:', e);
      }
    }
  };

  // 6. Chat message send handler with context
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const responseData = await generateMomCareResponse(text, {
        user,
        pregnancyWeek: user.pregnancyWeek,
        recentSymptoms: symptoms,
      });

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: responseData,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: 'Thank you for your entry. Please consult with your obstetric care provider for individualized medical evaluation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackAiMsg]);
    }
  };

  // 7. Auth success handler
  const handleAuthSuccess = (authUser: FirebaseUser, mother: MotherRecord) => {
    setCurrentUser(authUser);
    setCurrentMother(mother);
    setUser((prev) => ({
      ...prev,
      name: mother.name || prev.name,
      pregnancyWeek: mother.current_week || prev.pregnancyWeek,
      expectedDeliveryDate: mother.due_date || prev.expectedDeliveryDate,
      age: mother.age || prev.age,
    }));
    setCurrentScreen('home');
  };

  // 8. Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setCurrentUser(null);
    setCurrentMother(null);
    setUser(initialUserProfile);
    setCareTasks(initialCareTasks);
    setAppointments(initialAppointments);
    setSymptoms(initialSymptomLogs);
  };

  // 9. Profile updated handler
  const handleProfileUpdated = (updated: MotherRecord) => {
    setCurrentMother(updated);
    setUser((prev) => ({
      ...prev,
      name: updated.name || prev.name,
      pregnancyWeek: updated.current_week || prev.pregnancyWeek,
      expectedDeliveryDate: updated.due_date || prev.expectedDeliveryDate,
      age: updated.age || prev.age,
    }));
  };

  // 10. Week update stepper handler
  const handleUpdateWeek = (newWeek: number) => {
    setUser((prev) => ({ ...prev, pregnancyWeek: newWeek }));
    if (currentMother?.id) {
      updateMotherProfile(currentMother.id, { current_week: newWeek }).catch((e) =>
        console.warn('Could not update week in Firestore:', e)
      );
    }
  };

  // Reset demo data handler
  const handleResetData = () => {
    handleLogout();
    setCurrentScreen('welcome');
  };

  // If on Welcome or Onboarding, show full-screen views without dashboard shell
  if (currentScreen === 'welcome') {
    return (
      <>
        <WelcomeScreen
          onStart={() => setCurrentScreen('onboarding')}
          onLoginDemo={() => setCurrentScreen('home')}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
        <OfflineIndicator />
      </>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <>
        <OnboardingScreen
          initialProfile={user}
          onComplete={(newProfile) => {
            setUser(newProfile);
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
          onCancel={() => setCurrentScreen('welcome')}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setCurrentScreen('home');
          }}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalMode}
        />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242122] flex flex-col antialiased">
      {/* Top Bar (Mobile + Desktop Header) */}
      <TopBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        pregnancyWeek={user.pregnancyWeek}
        userName={user.name}
        currentUser={currentUser}
        currentMother={currentMother}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          user={user}
        />

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 overflow-y-auto">
          {/* Active Screen Rendering */}
          {currentScreen === 'home' && (
            <HomeScreen
              user={user}
              careTasks={careTasks}
              onToggleTask={handleToggleTask}
              featuredInsight={insights[0]}
              onNavigate={setCurrentScreen}
              onOpenLogSymptom={() => setIsLogSymptomOpen(true)}
              onUpdateWeek={handleUpdateWeek}
            />
          )}

          {currentScreen === 'mom-care' && (
            <MomCareScreen
              user={user}
              symptoms={symptoms}
              onOpenLogSymptom={() => setIsLogSymptomOpen(true)}
              onNavigate={setCurrentScreen}
              onPrefillChat={(query) => {
                setPrefilledPrompt(query);
                setCurrentScreen('chat');
              }}
            />
          )}

          {currentScreen === 'daily-tracker' && (
            <DailyCareTrackerScreen
              user={user}
              careTasks={careTasks}
              onToggleTask={handleToggleTask}
              onNavigate={setCurrentScreen}
              onOpenLogSymptom={() => setIsLogSymptomOpen(true)}
              onPrefillChat={(query) => {
                setPrefilledPrompt(query);
                setCurrentScreen('chat');
              }}
              recentSymptoms={symptoms}
            />
          )}

          {currentScreen === 'baby-care' && (
            <BabyCareScreen
              babyData={babyData}
              pregnancyWeek={user.pregnancyWeek}
              onNavigate={setCurrentScreen}
              onPrefillChat={(query) => {
                setPrefilledPrompt(query);
                setCurrentScreen('chat');
              }}
            />
          )}

          {currentScreen === 'insights' && (
            <InsightsScreen
              insights={insights}
              onNavigate={setCurrentScreen}
              onOpenAppointments={() => setCurrentScreen('appointments')}
            />
          )}

          {currentScreen === 'report-analyzer' && (
            <ReportAnalyzerScreen
              motherId={currentMother?.id}
              onNavigate={setCurrentScreen}
              onPrefillChat={(query) => {
                setPrefilledPrompt(query);
                setCurrentScreen('chat');
              }}
            />
          )}

          {currentScreen === 'chat' && (
            <MomCareAIScreen
              user={user}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              prefilledPrompt={prefilledPrompt}
              onClearPrefill={() => setPrefilledPrompt('')}
              onOpenAppointments={() => setCurrentScreen('appointments')}
            />
          )}

          {currentScreen === 'appointments' && (
            <AppointmentsScreen
              appointments={appointments}
              onOpenPrepareModal={(apt) => setSelectedAppointmentForPrep(apt)}
              onNavigate={setCurrentScreen}
              onAddAppointment={handleAddAppointment}
            />
          )}

          {currentScreen === 'profile' && (
            <PrivacySettingsScreen
              user={user}
              currentMother={currentMother}
              currentUser={currentUser}
              allAppData={{
                user,
                currentMother,
                careTasks,
                insights,
                appointments,
                symptoms,
                babyData,
              }}
              onResetData={handleResetData}
              onNavigate={setCurrentScreen}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenAuth={(mode) => {
                setAuthModalMode(mode);
                setIsAuthModalOpen(true);
              }}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />

      {/* Modals */}
      <LogSymptomModal
        isOpen={isLogSymptomOpen}
        onClose={() => setIsLogSymptomOpen(false)}
        onSaveSymptom={handleSaveSymptom}
      />

      {selectedAppointmentForPrep && (
        <PrepareAppointmentModal
          isOpen={!!selectedAppointmentForPrep}
          onClose={() => setSelectedAppointmentForPrep(null)}
          appointment={selectedAppointmentForPrep}
          onSaveQuestions={handleSaveQuestions}
        />
      )}

      {/* Google Sign-In & Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Edit Mother Profile Modal */}
      {currentMother && (
        <EditMotherProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          mother={currentMother}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
