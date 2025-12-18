const spineOrder = {
  counting: 1,
  "direct-addition": 2,
  "direct-subtraction": 3,
  "little-friend-addition": 4,
  "little-friend-subtraction": 5,
  "tens-counting": 6,
  "big-friend-addition": 7,
  "big-friend-subtraction": 8,
  "mixed-friends": 9,
  "integration-0-99": 10
};

export const learningSpine = [
  {
    id: "training-counting-1",
    name: "Counting 1-9 — Isolation",
    concept: "counting",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder.counting,
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: true,
    lowerBeads: 9,
    sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    resetAfterStep: true,
    unlocksOnComplete: {
      practice: true,
      speeds: ["slow"],
      nextLessonId: "counting-repetition-ones"
    },
    active: true
  },
  // Planned phases (encoded for ordering; inactive until implemented)
  {
    id: "counting-repetition-ones",
    name: "Counting — Repetition",
    concept: "counting",
    phase: "repetition",
    phaseOrder: 2,
    spineOrder: spineOrder.counting,
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: true,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "counting-constraint-upper",
    name: "Counting — Constraint Expansion",
    concept: "counting",
    phase: "constraint-expansion",
    phaseOrder: 3,
    spineOrder: spineOrder.counting,
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "counting-pressure",
    name: "Counting — Pressure",
    concept: "counting",
    phase: "pressure",
    phaseOrder: 4,
    spineOrder: spineOrder.counting,
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "counting-integration",
    name: "Counting — Integration",
    concept: "counting",
    phase: "integration",
    phaseOrder: 5,
    spineOrder: spineOrder.counting,
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  // Additional concepts encoded in order for future implementation; inactive by default.
  {
    id: "direct-addition-isolation",
    name: "Direct Addition — Isolation",
    concept: "direct-addition",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["direct-addition"],
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: true,
    lowerBeads: 4,
    sequence: [],
    active: false
  },
  {
    id: "direct-subtraction-isolation",
    name: "Direct Subtraction — Isolation",
    concept: "direct-subtraction",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["direct-subtraction"],
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: true,
    lowerBeads: 4,
    sequence: [],
    active: false
  },
  {
    id: "little-friend-addition-isolation",
    name: "Little Friend Addition — Isolation",
    concept: "little-friend-addition",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["little-friend-addition"],
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: false,
    lowerBeads: 4,
    sequence: [],
    active: false
  },
  {
    id: "little-friend-subtraction-isolation",
    name: "Little Friend Subtraction — Isolation",
    concept: "little-friend-subtraction",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["little-friend-subtraction"],
    track: "education",
    mode: "training",
    rods: 1,
    upperBeadDisabled: false,
    lowerBeads: 4,
    sequence: [],
    active: false
  },
  {
    id: "tens-counting-isolation",
    name: "Tens Rod Counting — Isolation",
    concept: "tens-counting",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["tens-counting"],
    track: "education",
    mode: "training",
    rods: 2,
    upperBeadDisabled: true,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "big-friend-addition-isolation",
    name: "Big Friend Addition — Isolation",
    concept: "big-friend-addition",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["big-friend-addition"],
    track: "education",
    mode: "training",
    rods: 2,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "big-friend-subtraction-isolation",
    name: "Big Friend Subtraction — Isolation",
    concept: "big-friend-subtraction",
    phase: "isolation",
    phaseOrder: 1,
    spineOrder: spineOrder["big-friend-subtraction"],
    track: "education",
    mode: "training",
    rods: 2,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "mixed-friends-integration",
    name: "Mixed Operations — Integration",
    concept: "mixed-friends",
    phase: "integration",
    phaseOrder: 5,
    spineOrder: spineOrder["mixed-friends"],
    track: "education",
    mode: "training",
    rods: 2,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  },
  {
    id: "integration-0-99",
    name: "0–99 Integration",
    concept: "integration-0-99",
    phase: "integration",
    phaseOrder: 5,
    spineOrder: spineOrder["integration-0-99"],
    track: "education",
    mode: "training",
    rods: 2,
    upperBeadDisabled: false,
    lowerBeads: 9,
    sequence: [],
    active: false
  }
];

function sortLessons(list) {
  return [...list].sort((a, b) => {
    const spineA = a.spineOrder ?? Number.MAX_SAFE_INTEGER;
    const spineB = b.spineOrder ?? Number.MAX_SAFE_INTEGER;
    if (spineA !== spineB) return spineA - spineB;
    const phaseA = a.phaseOrder ?? Number.MAX_SAFE_INTEGER;
    const phaseB = b.phaseOrder ?? Number.MAX_SAFE_INTEGER;
    return phaseA - phaseB;
  });
}

export function getEducationLessons({ activeOnly = true } = {}) {
  const lessons = learningSpine.filter((lesson) => {
    const trackMatch = lesson.track === "education";
    const modeMatch = lesson.mode === "training";
    const activeMatch = activeOnly ? lesson.active !== false : true;
    return trackMatch && modeMatch && activeMatch;
  });
  return sortLessons(lessons);
}

export const trainingLessons = getEducationLessons({ activeOnly: true });
