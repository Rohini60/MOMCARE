export interface FetalDevelopmentStage {
  week: number;
  trimester: 'First Trimester' | 'Second Trimester' | 'Third Trimester';
  fruitComparison: string;
  lengthCm: number;
  weightG: number;
  imageSrc: string;
  title: string;
  summary: string;
  keyHighlights: string[];
  maternalTip: string;
}

// Stage thresholds for realistic 3D medical illustrations
export function getFetalDevelopmentForWeek(week: number): FetalDevelopmentStage {
  const safeWeek = Math.max(4, Math.min(42, Math.round(week)));

  if (safeWeek <= 9) {
    // Early 1st Trimester / Embryo
    return {
      week: safeWeek,
      trimester: 'First Trimester',
      fruitComparison: safeWeek <= 6 ? 'Size of a sweet pea (~0.6 cm)' : 'Size of a raspberry (~1.6 cm / 1g)',
      lengthCm: Math.max(0.5, (safeWeek - 3) * 0.4),
      weightG: 1.5,
      imageSrc: '/src/assets/images/fetal_week8_1790425555984.jpg',
      title: 'Embryonic heart formation & limb bud genesis',
      summary: `At week ${safeWeek}, major organs including the neural tube, heart, and digestive system are rapidly differentiating. Tiny paddle-shaped limb buds are transforming into fingers and toes, and the primitive heart is beating at 150–170 bpm.`,
      keyHighlights: [
        'Webbed fingers and toes forming',
        'Primitive cardiovascular rhythm active',
        'Facial features and retinal pigment developing',
      ],
      maternalTip: 'Prioritize folate/folic acid intake and stay well-hydrated to soothe early digestive changes.',
    };
  }

  if (safeWeek <= 13) {
    // Late 1st Trimester
    return {
      week: safeWeek,
      trimester: 'First Trimester',
      fruitComparison: safeWeek === 10 ? 'Size of a strawberry (~3.1 cm / 4g)' : 'Size of a lime (~5.4 cm / 14g)',
      lengthCm: 3 + (safeWeek - 9) * 1.5,
      weightG: 14 + (safeWeek - 9) * 10,
      imageSrc: '/src/assets/images/fetal_week8_1790425555984.jpg',
      title: 'Vocal cords, fingernails & bone ossification',
      summary: `At week ${safeWeek}, all essential organs are present and beginning to function. Baby's kidneys are producing small amounts of urine into the amniotic fluid, and tiny reflex movements have begun.`,
      keyHighlights: [
        'Vital organ systems fully formed',
        'Tiny nail beds developing on fingers',
        'First swallowing reflex begins',
      ],
      maternalTip: 'Nausea often begins easing toward the end of this stage as placental hormones stabilize.',
    };
  }

  if (safeWeek <= 17) {
    // Early 2nd Trimester (e.g. Week 14, 15, 16, 17)
    return {
      week: safeWeek,
      trimester: 'Second Trimester',
      fruitComparison: safeWeek === 14 ? 'Size of a lemon (~8.7 cm / 43g)' : safeWeek === 15 ? 'Size of an apple (~10.1 cm / 70g)' : 'Size of an avocado (~11.6 cm / 100g)',
      lengthCm: 8.5 + (safeWeek - 13) * 1.6,
      weightG: 45 + (safeWeek - 13) * 30,
      imageSrc: '/src/assets/images/fetal_week15_1790425573126.jpg',
      title: 'Delicate facial expressions & active limb flexes',
      summary: `At week ${safeWeek}, your baby's legs are growing longer than their arms, and they can move all their joints and fingers. Delicate translucent skin is covered in fine lanugo hair. Tiny inner ear bones are hardening, and facial muscles can squint and grimace.`,
      keyHighlights: [
        'Active joint and finger flexing',
        'Bones absorbing calcium rapidly',
        'Light sensitivity developing behind closed eyelids',
      ],
      maternalTip: 'Energy levels frequently rebound during this golden second-trimester window.',
    };
  }

  if (safeWeek <= 21) {
    // Mid 2nd Trimester / 20-week Anatomy Milestone
    return {
      week: safeWeek,
      trimester: 'Second Trimester',
      fruitComparison: safeWeek <= 19 ? 'Size of a bell pepper (~15 cm / 240g)' : 'Size of a banana (~25 cm / 300g)',
      lengthCm: 15 + (safeWeek - 17) * 2.5,
      weightG: 200 + (safeWeek - 17) * 55,
      imageSrc: '/src/assets/images/fetal_week20_1790425586716.jpg',
      title: 'Sensory awakening, hair follicles & vernix protection',
      summary: `At week ${safeWeek}, your baby is covered in vernix caseosa, a protective natural coating that shields delicate skin from amniotic fluid. You may now start feeling gentle flutter movements (quickening).`,
      keyHighlights: [
        'Vernix caseosa protective skin coating',
        'Auditory nerve pathways refining',
        'Coordinated thumb sucking and swallowing',
      ],
      maternalTip: 'This is the standard window for your comprehensive mid-pregnancy anatomical ultrasound.',
    };
  }

  if (safeWeek <= 28) {
    // Late 2nd Trimester (Weeks 22–28, including Week 24)
    return {
      week: safeWeek,
      trimester: safeWeek <= 27 ? 'Second Trimester' : 'Third Trimester',
      fruitComparison: safeWeek <= 23 ? 'Size of an eggplant (~28 cm / 430g)' : safeWeek <= 25 ? 'Size of an ear of corn (~30 cm / 600g)' : 'Size of an acorn squash (~36 cm / 900g)',
      lengthCm: 26 + (safeWeek - 21) * 1.5,
      weightG: 400 + (safeWeek - 21) * 90,
      imageSrc: '/src/assets/images/fetal_week24_1790403306686.jpg',
      title: 'Hearing maternal rhythms & preparing respiratory surfactant',
      summary: `At week ${safeWeek}, your baby's hearing is sharp enough to recognize your voice, heartbeat, and gentle music. The bronchial tree is branching, and tiny air sacs begin producing surfactant for postpartum breathing.`,
      keyHighlights: [
        'Recognizes maternal voice and heartbeat',
        'Alveolar surfactant production begins',
        'Distinct REM sleep and active waking cycles',
      ],
      maternalTip: 'Maintain optimal hydration (2.5L) to balance amniotic fluid and ease mild extremity swelling.',
    };
  }

  // Weeks 29–42 (Third Trimester / Term)
  return {
    week: safeWeek,
    trimester: 'Third Trimester',
    fruitComparison: safeWeek <= 33 ? 'Size of a butternut squash (~42 cm / 1.7kg)' : safeWeek <= 36 ? 'Size of a honeydew melon (~47 cm / 2.6kg)' : 'Size of a small watermelon (~50 cm / 3.4kg)',
    lengthCm: 38 + (safeWeek - 28) * 1.1,
    weightG: 1200 + (safeWeek - 28) * 200,
    imageSrc: '/src/assets/images/fetal_week36_1790425600049.jpg',
    title: 'Rapid brain development, fat stores & cephalic positioning',
    summary: `At week ${safeWeek}, your baby is putting on healthy insulating fat stores at about half a pound per week. Lungs and central nervous system are maturing toward full independence, and baby typically shifts into a head-down cephalic posture.`,
    keyHighlights: [
      'Subcutaneous fat filling out chubby cheeks',
      'Immune antibodies transferring from placenta',
      'Settling into head-down birth position',
    ],
    maternalTip: 'Practice pelvic floor tilts and left-lateral rest to relieve lumbar and diaphragm pressure.',
  };
}
