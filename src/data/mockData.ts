import { UserProfile, CareTask, AIInsight, HealthReport, Appointment, BabyCareData, ChatMessage, SymptomLog } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Ananya',
  age: 29,
  pregnancyStatus: 'pregnant',
  pregnancyWeek: 15,
  expectedDeliveryDate: 'January 14, 2027',
  pregnancyType: 'First pregnancy',
  foodPreferences: ['Vegetarian', 'High Fiber', 'Iron-Rich Whole Foods'],
  allergies: ['Penicillin', 'No known food allergies'],
  medications: [
    'Prenatal Multivitamin (Daily with breakfast)',
    'Iron Bisglycinate 28mg (with Vitamin C)',
    'DHA Omega-3 (Plant-derived 200mg)'
  ],
  reminderTimes: {
    morning: '08:30 AM',
    afternoon: '01:30 PM',
    evening: '08:30 PM',
  },
};

export const initialCareTasks: CareTask[] = [
  // Morning
  {
    id: 'm1',
    timeOfDay: 'morning',
    title: 'Warm Spinach & Lentil Toast',
    subtitle: '🥗 Nutrition · High folate, plant iron & gentle complex carbohydrates',
    category: 'nutrition',
    completed: true,
    timeString: '08:30 AM',
  },
  {
    id: 'm2',
    timeOfDay: 'morning',
    title: 'Prenatal + Iron Supplement',
    subtitle: '💊 Prescribed reminder · Taken with freshly squeezed orange juice for absorption',
    category: 'medication',
    completed: true,
    timeString: '09:00 AM',
  },
  // Afternoon
  {
    id: 'a1',
    timeOfDay: 'afternoon',
    title: 'Hydration Target (1.75L / 2.5L)',
    subtitle: '💧 Hydration · Sip water infused with lemon or cucumber to reduce fluid retention',
    category: 'hydration',
    completed: false,
    timeString: '02:00 PM',
  },
  {
    id: 'a2',
    timeOfDay: 'afternoon',
    title: 'Daily Symptom Check-in',
    subtitle: '📝 Symptom log · Record energy level, swelling, and fetal kick patterns',
    category: 'symptom',
    completed: false,
    timeString: '03:30 PM',
  },
  // Evening
  {
    id: 'e1',
    timeOfDay: 'evening',
    title: 'Rest & Leg Elevation',
    subtitle: '🌙 Rest & wellbeing · 20 minutes left-lateral rest with elevated ankles',
    category: 'rest',
    completed: false,
    timeString: '07:30 PM',
  },
  {
    id: 'e2',
    timeOfDay: 'evening',
    title: 'Prepare Questions for Dr. Sharma',
    subtitle: '👩‍⚕️ Clinical prep · Review AI-curated questions for your Week 24 checkup',
    category: 'appointment',
    completed: false,
    timeString: '08:45 PM',
  },
];

export const initialAIInsights: AIInsight[] = [
  {
    id: 'ins-1',
    title: 'Mild Dependent Edema & Hydration Correlation',
    patternNoticed: 'Your recent symptom entries show a noticeable change compared with your previous entries: mild ankle swelling logged on 3 consecutive late afternoons.',
    confidence: 'High',
    whyThisInsight: 'Based on your recent care entries and pregnancy stage (Week 24). At this stage, maternal blood volume expands by ~40%, making mild lower-extremity swelling common after standing.',
    whatYouCanDo: 'Elevate your feet above heart level for 20–30 minutes when resting. Increase afternoon plain water intake to reach your 2.5L target, and take brief walking breaks if sitting at a desk.',
    whenToSeekCare: 'Contact your obstetrician or triage immediately if swelling is sudden, affects your face or hands, or is accompanied by severe persistent headache, right upper belly pain, or visual aura/spots.',
    medicalSources: [
      'ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia',
      'National Institute for Health and Care Excellence (NICE) Antenatal Care Guidelines NG201'
    ],
    category: 'maternal',
    escalated: false,
    timestamp: 'Today, 09:15 AM',
  },
  {
    id: 'ins-2',
    title: 'Ferritin Level & Midday Fatigue Alignment',
    patternNoticed: 'Logged afternoon fatigue episodes correlate with your recent lab report showing serum ferritin at 18 ng/mL.',
    confidence: 'Moderate',
    whyThisInsight: 'Serum ferritin below 30 ng/mL in the second trimester frequently precedes symptomatic fatigue as fetal iron demand increases sharply from Week 24 onwards.',
    whatYouCanDo: 'Continue taking your prescribed gentle iron supplement with a source of vitamin C (like citrus fruits or bell peppers). Avoid taking iron within 2 hours of calcium supplements or caffeine.',
    whenToSeekCare: 'Consult your doctor if fatigue is accompanied by persistent dizziness, breathlessness during quiet rest, or a racing heartbeat.',
    medicalSources: [
      'WHO Recommendations on Antenatal Care: Iron and Folic Acid Supplementation',
      'American Journal of Obstetrics & Gynecology: Second-Trimester Iron Kinetics'
    ],
    category: 'vitals',
    escalated: false,
    timestamp: 'Yesterday, 04:30 PM',
  },
  {
    id: 'ins-3',
    title: 'Braxton Hicks vs. Preterm Activity Education',
    patternNoticed: 'You logged two instances of mild, painless abdominal tightening after brisk walking.',
    confidence: 'Needs Review',
    whyThisInsight: 'Uterine muscle fibers begin practicing contractions (Braxton Hicks) around Week 20–24. They are typically irregular, painless, and resolve when changing positions.',
    whatYouCanDo: 'Pause your activity, empty your bladder, drink 500ml of room-temperature water, and rest on your left side. Note whether the tightness softens within 15–20 minutes.',
    whenToSeekCare: 'Seek prompt evaluation if contractions occur regularly (more than 4 in 60 minutes), increase in intensity, or are accompanied by vaginal fluid, spotting, or rhythmic lower back pressure.',
    medicalSources: [
      'Royal College of Obstetricians and Gynaecologists (RCOG): Uterine Activity in Mid-Pregnancy',
      'March of Dimes Clinical Advisory on Preterm Labor Signs'
    ],
    category: 'maternal',
    escalated: true,
    timestamp: '2 days ago',
  },
];

export const sampleReports: HealthReport[] = [
  {
    id: 'rep-1',
    title: 'Second Trimester CBC & Iron Studies Panel',
    date: 'Sep 21, 2026',
    doctorOrLab: 'Metropolis Diagnostics · Ordered by Dr. Maya Sharma',
    type: 'Blood Report',
    whatReportContains: [
      'Complete Blood Count (RBC, WBC, Platelets)',
      'Hemoglobin (Hb) & Hematocrit (Hct)',
      'Serum Ferritin & Iron Saturation index',
      'Erythrocyte indices (MCV, MCH)'
    ],
    simpleExplanation: 'Your blood panel shows healthy red blood cell counts and normal platelet function. Your hemoglobin (11.4 g/dL) is within the expected normal range for Week 24. Serum ferritin is slightly on the lower threshold (18 ng/mL), which explains the mild fatigue you have been feeling as your baby rapidly builds iron stores.',
    importantTerms: [
      {
        term: 'Hemoglobin (Hb)',
        definition: 'The iron-rich protein in red blood cells that carries oxygen throughout your body and across the placenta to your baby.',
        normalRange: '10.5 – 14.0 g/dL (2nd Trimester)',
        userValue: '11.4 g/dL',
        interpretation: 'Within healthy target'
      },
      {
        term: 'Serum Ferritin',
        definition: 'A marker of your body’s long-term iron reserves in tissue storage.',
        normalRange: '15 – 150 ng/mL (Target >30 in pregnancy)',
        userValue: '18 ng/mL',
        interpretation: 'Mildly low storage reserves'
      },
      {
        term: 'Platelet Count',
        definition: 'Blood cells responsible for clotting and healthy vascular integrity.',
        normalRange: '150,000 – 450,000 /µL',
        userValue: '215,000 /µL',
        interpretation: 'Normal & stable'
      },
      {
        term: 'Mean Corpuscular Volume (MCV)',
        definition: 'The average physical size of your red blood cells.',
        normalRange: '80 – 100 fL',
        userValue: '86 fL',
        interpretation: 'Optimal red cell size'
      }
    ],
    questionsForProvider: [
      'Should I continue my current 28mg iron bisglycinate dose, or would you recommend adjusting it before the third trimester?',
      'Would taking an extra dietary vitamin C booster with my morning iron benefit my absorption?',
      'Do you want to re-check my ferritin panel at my 28-week routine screening?'
    ],
    medicalSources: [
      'ACOG Practice Bulletin No. 233: Anemia in Pregnancy',
      'British Journal of Haematology: Guidelines on the Management of Iron Deficiency in Pregnancy'
    ],
    confidence: 'High'
  },
  {
    id: 'rep-2',
    title: '1-Hour Gestational Glucose Challenge Test (50g)',
    date: 'Sep 15, 2026',
    doctorOrLab: 'Blossom Maternal Health Clinic · Clinical Lab',
    type: 'Glucose Screen',
    whatReportContains: [
      'Fasting baseline plasma glucose',
      '1-Hour post-oral 50g glucose challenge reading'
    ],
    simpleExplanation: 'This routine screening test checks how efficiently your placenta and pancreas handle carbohydrates during mid-pregnancy. Your 1-hour glucose level was 118 mg/dL, which is safely below the standard screening cutoff of 140 mg/dL. This indicates normal insulin sensitivity.',
    importantTerms: [
      {
        term: '1-Hour Glucose Challenge (50g)',
        definition: 'A screening measure of blood sugar 60 minutes after consuming a standardized glucola drink.',
        normalRange: '< 140 mg/dL',
        userValue: '118 mg/dL',
        interpretation: 'Normal / Non-elevated'
      },
      {
        term: 'Gestational Diabetes Mellitus (GDM)',
        definition: 'A temporary form of carbohydrate intolerance that develops during pregnancy due to placental hormones.',
        normalRange: 'Not detected',
        userValue: 'Negative Screen',
        interpretation: 'Screen passed safely'
      }
    ],
    questionsForProvider: [
      'Do my current dietary patterns support steady glycemic balance through the rest of the second trimester?',
      'Are any repeat glucose checks necessary later in pregnancy?'
    ],
    medicalSources: [
      'American Diabetes Association (ADA) Standards of Care: Management of Diabetes in Pregnancy',
      'ACOG Practice Bulletin No. 190: Gestational Diabetes'
    ],
    confidence: 'High'
  },
  {
    id: 'rep-3',
    title: '20-Week Detailed Fetal Anatomy Ultrasound Summary',
    date: 'Aug 26, 2026',
    doctorOrLab: 'Horizon Imaging Center · Dr. S. Rao, MD Radiologist',
    type: 'Ultrasound / Scan',
    whatReportContains: [
      'Fetal Biometry (BPD, HC, AC, FL)',
      'Estimated Fetal Weight (EFW)',
      'Anatomical Survey (Brain, Spine, Heart 4-chamber, Kidneys)',
      'Placental Location & Amniotic Fluid Index (AFI)'
    ],
    simpleExplanation: 'The 20-week anatomical scan confirmed healthy structural development across all organ systems. Fetal cardiac structures, spine, kidneys, and extremities were normally visualized. Placenta is positioned along the posterior upper uterine wall (clear of the cervix), and amniotic fluid volume is optimal.',
    importantTerms: [
      {
        term: 'Placental Location',
        definition: 'The attachment site of the placenta inside the uterus.',
        normalRange: 'Fundal / Posterior / Anterior (Clear of OS)',
        userValue: 'Posterior Upper (Clear of OS)',
        interpretation: 'Ideal positioning'
      },
      {
        term: 'Amniotic Fluid Index (AFI)',
        definition: 'Measurement of the protective fluid surrounding your baby in four uterine quadrants.',
        normalRange: '8.0 – 18.0 cm',
        userValue: '14.2 cm',
        interpretation: 'Normal fluid volume'
      },
      {
        term: 'Estimated Fetal Weight (EFW)',
        definition: 'Calculated weight using head, abdominal, and femur length measurements.',
        normalRange: '300 – 450 g at 20 weeks',
        userValue: '360 g (52nd percentile)',
        interpretation: 'Normal growth velocity'
      }
    ],
    questionsForProvider: [
      'Is the baby’s current growth trajectory matching the 50th percentile expectation?',
      'When is the next growth ultrasound recommended?'
    ],
    medicalSources: [
      'Society for Maternal-Fetal Medicine (SMFM) Consult Series: Anatomical Ultrasound Evaluation',
      'ISUOG Practice Guidelines: Performance of the Routine Mid-Trimester Fetal Ultrasound Scan'
    ],
    confidence: 'High'
  },
  {
    id: 'rep-4',
    title: 'Routine Antenatal Urinalysis & Albumin Screen',
    date: 'Sep 22, 2026',
    doctorOrLab: 'Blossom Maternal Health Clinic · Antenatal Lab',
    type: 'Urinalysis / Protein Screen',
    whatReportContains: [
      'Urine Albumin / Protein test',
      'Urine Glucose & Ketones',
      'Leukocyte Esterase & Nitrites (UTI markers)'
    ],
    simpleExplanation: 'This routine urine check screens for early signs of preeclampsia (spilling protein/albumin into urine) and silent urinary tract infections (UTIs) which can cause preterm contractions if left untreated. Your urine albumin was negative and no bacterial markers were detected, indicating healthy kidney function and no active infection.',
    importantTerms: [
      {
        term: 'Urine Albumin / Protein',
        definition: 'A screening test measuring albumin leaked through the kidney filtration barrier.',
        normalRange: 'Negative or Trace (< 15 mg/dL)',
        userValue: 'Negative',
        interpretation: 'Normal kidney filtration'
      },
      {
        term: 'Leukocyte Esterase & Nitrites',
        definition: 'Biochemical markers produced by white blood cells and gram-negative bacteria during bladder infections.',
        normalRange: 'Negative',
        userValue: 'Negative',
        interpretation: 'No signs of bacterial UTI'
      },
      {
        term: 'Urine Glucose',
        definition: 'Checks for excessive glucose spillover into the urine.',
        normalRange: 'Negative',
        userValue: 'Negative',
        interpretation: 'Normal glycemic spillover threshold'
      }
    ],
    questionsForProvider: [
      'Are routine dipsticks conducted at every upcoming antenatal appointment?',
      'What symptoms should prompt me to ask for an unscheduled urine check between visits?'
    ],
    medicalSources: [
      'NICE Guideline NG201: Antenatal Care - Screening for Asymptomatic Bacteriuria and Proteinuria',
      'ACOG Practice Advisory: Screening and Diagnosis of Preeclampsia'
    ],
    confidence: 'High'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Maya Sharma, MD, FACOG',
    specialty: 'Obstetrics & Maternal-Fetal Medicine',
    clinicName: 'Blossom Maternal Health Clinic',
    date: 'Friday, Oct 4, 2026',
    time: '10:30 AM',
    location: 'Suite 402, Blossom Medical Pavilion, 120 Elmwood St.',
    notes: 'Routine 24-week antenatal evaluation, fundal height measurement, Doppler fetal heart rate check, and review of recent iron panel.',
    questionsToAsk: [
      'Is my mild late-afternoon ankle swelling within the expected normal range for Week 24?',
      'Review ferritin level (18 ng/mL) and confirm ongoing iron dosage.',
      'Check fundal height and listen to baby’s heart tone.'
    ],
    isAiPrepared: true,
    type: 'Routine Check'
  },
  {
    id: 'apt-2',
    doctorName: 'Dr. Neha Kapoor, MD',
    specialty: 'Pediatric & Perinatal Medicine',
    clinicName: 'Little Sprout Pediatric Associates',
    date: 'Wednesday, Nov 12, 2026',
    time: '02:00 PM',
    location: 'Building B, Suite 105, Cedar Creek Health Center',
    notes: 'Prenatal pediatrician meet-and-greet to discuss newborn care preferences, early vaccination schedule, and immediate postpartum pediatric rounds.',
    questionsToAsk: [
      'What are your clinic’s after-hours pediatric triage protocols?',
      'Do you support lactation consultation during early newborn visits?',
      'How are newborn milestone evaluations structured in the first 6 weeks?'
    ],
    isAiPrepared: false,
    type: 'Pediatrician Consult'
  }
];

export const initialBabyData: BabyCareData = {
  mode: 'antenatal',
  profile: {
    name: 'Baby Arya',
    dobOrDue: 'January 14, 2027 (Expected)',
    ageFormatted: 'Week 24 of gestation (~16 weeks to arrival)',
    gestationalAgeWeeks: 24,
  },
  todayFeedings: [
    { id: 'f1', time: '07:30 AM', type: 'Antenatal Nutrition', amount: 'Iron & Protein Smoothie', notes: 'Spinach, banana, chia seeds, almond milk' },
    { id: 'f2', time: '12:45 PM', type: 'Balanced Lunch', amount: 'Quinoa Bowl with Avocado', notes: 'Rich in healthy fats and magnesium' },
    { id: 'f3', time: '04:15 PM', type: 'Hydration & Snack', amount: 'Walnuts & Dried Figs', notes: 'Natural plant iron boost' }
  ],
  todaySleep: [
    { id: 's1', time: '11:00 PM - 07:00 AM', duration: '8h 00m', quality: 'Restful, supported with maternity pillow on left side' },
    { id: 's2', time: '02:15 PM - 03:00 PM', duration: '45m', quality: 'Power nap with feet elevated' }
  ],
  growthHistory: [
    { month: 16, weightKg: 0.15, heightCm: 11.6, headCircumferenceCm: 12.0, percentileWeight: '50th' },
    { month: 20, weightKg: 0.36, heightCm: 25.6, headCircumferenceCm: 17.5, percentileWeight: '52nd' },
    { month: 24, weightKg: 0.60, heightCm: 30.0, headCircumferenceCm: 21.0, percentileWeight: '50th' }
  ],
  vaccinations: [
    {
      id: 'v1',
      name: 'Maternal Tdap Booster',
      description: 'Protects against Tetanus, Diphtheria, and Pertussis (whooping cough); transfers passive immunity to newborn.',
      targetAge: '27–36 Weeks of Pregnancy',
      status: 'upcoming',
      dueDate: 'Week 28 (Late October 2026)',
      notes: 'Recommended by ACOG & CDC for every pregnancy'
    },
    {
      id: 'v2',
      name: 'Maternal Influenza Vaccine',
      description: 'Safeguards mother and baby during seasonal respiratory exposure.',
      targetAge: 'Second or Third Trimester',
      status: 'completed',
      dueDate: 'Completed Sep 05, 2026',
      notes: 'Administered at clinic'
    },
    {
      id: 'v3',
      name: 'Newborn Hepatitis B (Birth Dose)',
      description: 'First pediatric dose administered within 24 hours of birth.',
      targetAge: 'Birth (0–24 hours)',
      status: 'upcoming',
      dueDate: 'Upon Delivery (Jan 2027)',
      notes: 'Standard hospital protocol'
    },
    {
      id: 'v4',
      name: 'DTaP Pediatric (Dose 1)',
      description: 'Primary infant immunization against diphtheria, tetanus, and acellular pertussis.',
      targetAge: '2 Months Post-Delivery',
      status: 'upcoming',
      dueDate: 'March 2027',
      notes: 'First routine pediatric series'
    }
  ],
  milestones: [
    {
      id: 'm-1',
      title: 'Auditory Response to Voice',
      description: 'Baby’s inner ear bones are fully formed; baby can hear mother’s heartbeat, voice, and gentle music.',
      category: 'Cognitive',
      targetMonth: 'Week 24',
      achieved: true
    },
    {
      id: 'm-2',
      title: 'Regular Sleep-Wake Cycles',
      description: 'Fetal brain waves show distinct periods of REM sleep and active wakefulness.',
      category: 'Cognitive',
      targetMonth: 'Week 24',
      achieved: true
    },
    {
      id: 'm-3',
      title: 'Grasp Reflex Development',
      description: 'Baby touches fingers to toes and practices grasping the umbilical cord.',
      category: 'Motor',
      targetMonth: 'Week 24',
      achieved: true
    },
    {
      id: 'm-4',
      title: 'Lung Surfactant Production Begins',
      description: 'Lungs begin producing surfactant, a substance that helps the tiny air sacs open smoothly after birth.',
      category: 'Motor',
      targetMonth: 'Week 25–26',
      achieved: false
    }
  ]
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Hello Ananya. I am your MomCare health companion. I am tracking your Week 24 journey, your recent blood panel, and your daily symptoms. How can I support you today?',
    timestamp: '09:00 AM',
    structuredData: {
      answer: 'I can assist you with understanding your pregnancy symptoms, reviewing lab terms in plain language, organizing daily nutrition and hydration, or formulating questions for Dr. Sharma.',
      whyRelevant: 'Context: Pregnancy Week 24 • Recent care data available • First pregnancy.',
      sources: ['ACOG Antenatal Guidance', 'WHO Maternal Health Standards'],
      whenToContactDoctor: 'Remember: MomCare AI provides supportive health education. For sudden pain, severe headaches, visual disturbances, or fluid leaks, contact your triage care team directly.'
    }
  }
];

export const initialSymptomLogs: SymptomLog[] = [
  {
    id: 'sym-1',
    symptomName: 'Mild Ankle Swelling',
    severity: 'mild',
    timestamp: 'Today, 03:15 PM',
    notes: 'Both ankles slightly puffy after 3 hours sitting at desk. Relieved after elevation.'
  },
  {
    id: 'sym-2',
    symptomName: 'Afternoon Energy Dip',
    severity: 'moderate',
    timestamp: 'Yesterday, 02:45 PM',
    notes: 'Felt noticeable fatigue around 2:30 PM. Recovered after warm herbal tea and light snack.'
  },
  {
    id: 'sym-3',
    symptomName: 'Gentle Fetal Flutter / Kicks',
    severity: 'mild',
    timestamp: 'Yesterday, 09:30 PM',
    notes: 'Active movement felt after evening meal and when resting on left side.'
  }
];
