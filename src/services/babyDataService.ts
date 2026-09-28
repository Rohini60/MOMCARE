import { BabyCareData } from '../types';
import { getFetalDevelopmentForWeek } from '../data/fetalDevelopment';

interface MotherInput {
  name?: string;
  pregnancyWeek?: number;
  expectedDeliveryDate?: string;
  due_date?: string;
  baby_name?: string;
  babyName?: string;
  baby_gender?: 'boy' | 'girl' | 'surprise';
  babyGender?: 'boy' | 'girl' | 'surprise';
  baby_notes?: string;
  babyNotes?: string;
  pregnancyType?: string;
  pregnancy_number?: number | string;
}

/**
 * Dynamically computes BabyCareData completely personalized to the mother's details:
 * - Baby's custom name or dynamically synthesized family nickname (never hardcoded Arya!)
 * - Gestational age, due date, fetal metrics (weight, length, fruit comparison)
 * - Week-specific movement rhythms, kicks, sleep patterns, and growth history
 * - Antenatal vaccine schedules (Tdap, Flu, Hepatitis B)
 */
export function buildBabyDataForMother(mother: MotherInput): BabyCareData {
  const week = Math.max(4, Math.min(42, Math.round(mother.pregnancyWeek || 16)));
  const motherName = (mother.name || 'Mother').trim();
  const rawBabyName = mother.baby_name || mother.babyName;
  const gender = mother.baby_gender || mother.babyGender || 'surprise';
  const notes = mother.baby_notes || mother.babyNotes || '';

  // Determine baby display name
  let babyDisplayName = '';
  if (rawBabyName && rawBabyName.trim().length > 0) {
    babyDisplayName = rawBabyName.trim();
  } else {
    // Dynamic derivation from mother's name
    const firstName = motherName.split(' ')[0] || 'Mother';
    babyDisplayName = `Baby of ${firstName}`;
  }

  // Delivery Date
  const dueDateStr = mother.due_date || mother.expectedDeliveryDate || 'Expected within 40 weeks';

  // Fetal stage metrics
  const stage = getFetalDevelopmentForWeek(week);
  const weeksToArrival = Math.max(0, 40 - week);

  // Dynamic growth history: show 2 historical checkpoints and current week
  const prevWeek1 = Math.max(4, week - 8);
  const prevWeek2 = Math.max(4, week - 4);
  const stage1 = getFetalDevelopmentForWeek(prevWeek1);
  const stage2 = getFetalDevelopmentForWeek(prevWeek2);

  const growthHistory = [
    {
      month: prevWeek1,
      weightKg: Number((stage1.weightG / 1000).toFixed(2)),
      heightCm: Number(stage1.lengthCm.toFixed(1)),
      headCircumferenceCm: Number((stage1.lengthCm * 0.7).toFixed(1)),
      percentileWeight: '50th',
    },
    {
      month: prevWeek2,
      weightKg: Number((stage2.weightG / 1000).toFixed(2)),
      heightCm: Number(stage2.lengthCm.toFixed(1)),
      headCircumferenceCm: Number((stage2.lengthCm * 0.7).toFixed(1)),
      percentileWeight: '52nd',
    },
    {
      month: week,
      weightKg: Number((stage.weightG / 1000).toFixed(2)),
      heightCm: Number(stage.lengthCm.toFixed(1)),
      headCircumferenceCm: Number((stage.lengthCm * 0.7).toFixed(1)),
      percentileWeight: '50th (Current)',
    },
  ];

  // Dynamic Feeding / Placental Nutrition tailored to week
  const todayFeedings = [
    {
      id: 'f1',
      time: '08:00 AM',
      type: 'Maternal-Fetal Nutrient Transfer',
      amount: week <= 18 ? 'Folate, Choline & Plant Iron' : 'Calcium & Omega-3 DHA',
      notes: `Supports baby's ${week <= 20 ? 'neural tube and primitive heart' : 'rapid brain myelination and bone density'} at Week ${week}.`,
    },
    {
      id: 'f2',
      time: '01:00 PM',
      type: 'Hydration & Amniotic Fluid Exchange',
      amount: '500ml Filtered Water with Citrus',
      notes: `Amniotic fluid volume refreshes every 3–4 hours through fetal swallowing and maternal hydration.`,
    },
    {
      id: 'f3',
      time: '06:30 PM',
      type: 'Electrolyte & Protein Intake',
      amount: 'Lentils, Greens & Pumpkin Seeds',
      notes: `Provides vital amino acids for fetal tissue growth (${stage.fruitComparison}).`,
    },
  ];

  // Dynamic Sleep & Movement Cycles
  const isKickPhase = week >= 20;
  const todaySleep = [
    {
      id: 's1',
      time: '11:00 PM - 07:00 AM',
      duration: '8h 00m',
      quality: 'Restful, supported with maternity pillow on left side (encourages optimal placental vena cava blood flow)',
    },
    {
      id: 's2',
      time: '02:30 PM - 03:15 PM',
      duration: '45m',
      quality: isKickPhase
        ? 'Rest period with gentle flutter movements noticed when resting quietly'
        : 'Afternoon power nap with elevated feet to soothe dependent edema',
    },
  ];

  // Antenatal Vaccinations
  const vaccinations: BabyCareData['vaccinations'] = [
    {
      id: 'v1',
      name: 'Maternal Tdap Booster',
      description: 'Protects against Tetanus, Diphtheria, and Pertussis (whooping cough); transfers passive newborn antibodies through umbilical cord.',
      targetAge: '27–36 Weeks of Pregnancy',
      status: week >= 27 && week <= 36 ? 'due-soon' : week > 36 ? 'completed' : 'upcoming',
      dueDate: week >= 27 ? `Due Now (Week ${week})` : 'Target: Week 28–32',
      notes: 'Recommended by ACOG, CDC, and WHO for every pregnancy',
    },
    {
      id: 'v2',
      name: 'Maternal Influenza Vaccine',
      description: 'Safeguards mother and newborn against seasonal respiratory viral illness.',
      targetAge: 'Any Trimester (Annual)',
      status: 'completed',
      dueDate: 'Administered / Verified',
      notes: 'Safe in all trimesters',
    },
    {
      id: 'v3',
      name: 'Newborn Hepatitis B (Birth Dose)',
      description: 'First pediatric dose administered in the maternal ward within 24 hours of birth.',
      targetAge: 'At Birth (Day 0)',
      status: 'upcoming',
      dueDate: dueDateStr,
      notes: 'Standard pediatric newborn protocol',
    },
  ];

  // Gestational Milestones tailored to trimester
  const milestones: BabyCareData['milestones'] = [
    {
      id: 'm1',
      title: week < 20 ? 'Facial Grimacing & Tiny Finger Flexes' : 'Active Kicking & Auditory Recognition',
      description: week < 20
        ? `Baby can squint, frown, and make delicate grasping motions with fingers.`
        : `Inner ear ossicles are hardened; baby responds to maternal voice, heartbeat, and music.`,
      category: 'Motor',
      targetMonth: `Week ${week}`,
      achieved: true,
    },
    {
      id: 'm2',
      title: 'Placental Nutrient Transfer & Bone Calcification',
      description: `Skeletal bones are absorbing dietary calcium rapidly from maternal circulation.`,
      category: 'Cognitive',
      targetMonth: `Week ${week}`,
      achieved: true,
    },
    {
      id: 'm3',
      title: week < 28 ? 'Surfactant Air Sac Preparation' : 'Rapid Brain Cortex Growth & Cephalic Position',
      description: week < 28
        ? `Lungs develop alveoli and begin secreting surfactant fluid for breathing practice.`
        : `Subcutaneous fat fills cheeks and baby rotates toward cephalic head-down orientation.`,
      category: 'Motor',
      targetMonth: `Week ${Math.min(40, week + 4)}`,
      achieved: false,
    },
  ];

  return {
    mode: 'antenatal',
    profile: {
      name: babyDisplayName,
      nickname: rawBabyName || '',
      gender: gender as any,
      dobOrDue: dueDateStr,
      ageFormatted: `Week ${week} of gestation (~${weeksToArrival} weeks to arrival)`,
      gestationalAgeWeeks: week,
      notes: notes || stage.summary,
    },
    todayFeedings,
    todaySleep,
    growthHistory,
    vaccinations,
    milestones,
  };
}
