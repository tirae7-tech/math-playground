export const DEFAULT_GRADE = 1;
export const DEFAULT_TIER = "low";
export const DEFAULT_MODE = "mix";

export const PRACTICE_MODE_IDS = ["arithmetic", "fraction", "decimal", "mix"];
export const ARITHMETIC_MODE_IDS = ["add", "subtract", "multiply", "divide", "mixed"];
export const MODE_IDS = [...PRACTICE_MODE_IDS, ...ARITHMETIC_MODE_IDS];

export const OPERATION_SYMBOLS = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
};

export const OPERATIONS = [
  { id: "arithmetic", label: "사칙연산", symbol: "+−×÷", helper: "자연수 계산 연습" },
  { id: "fraction", label: "분수", symbol: "1/2", helper: "분수 읽기와 계산" },
  { id: "decimal", label: "소수", symbol: "0.5", helper: "소수 읽기와 계산" },
  { id: "mix", label: "섞어서", symbol: "★", helper: "학년에 맞게 골고루" },
];

export const ARITHMETIC_OPERATIONS = [
  { id: "add", label: "덧셈", symbol: "+", helper: "더하기 연습" },
  { id: "subtract", label: "뺄셈", symbol: "-", helper: "빼기 연습" },
  { id: "multiply", label: "곱셈", symbol: "×", helper: "곱하기 연습" },
  { id: "divide", label: "나눗셈", symbol: "÷", helper: "나누기 연습" },
];

export const MIXED_OPERATION = {
  id: "mixed",
  label: "혼합계산",
  symbol: "★",
  helper: "계산 순서를 생각해요",
};

export const GRADES = [
  { id: 1, label: "1학년", helper: "덧셈과 뺄셈 중심" },
  { id: 2, label: "2학년", helper: "구구단까지 차근차근" },
  { id: 3, label: "3학년", helper: "분수와 소수 시작" },
  { id: 4, label: "4학년", helper: "분수와 소수 계산" },
  { id: 5, label: "5학년", helper: "약분, 통분, 소수 곱셈" },
  { id: 6, label: "6학년", helper: "분수·소수 나눗셈" },
];

export const TIERS = [
  { id: "low", label: "기초", helper: "천천히 시작" },
  { id: "middle", label: "표준", helper: "학년 수준 연습" },
  { id: "high", label: "도전", helper: "조금 더 어렵게" },
];

export const GRADE_OPERATION_RULES = {
  1: {
    availableModes: ["add", "subtract", "mix"],
    mixModes: ["add", "subtract"],
  },
  2: {
    availableModes: ["add", "subtract", "multiply", "mix"],
    mixModes: ["add", "subtract", "multiply"],
  },
  3: {
    availableModes: ["add", "subtract", "multiply", "divide", "mix"],
    mixModes: ["add", "subtract", "multiply", "divide"],
  },
  4: {
    availableModes: ["add", "subtract", "multiply", "divide", "mix"],
    mixModes: ["add", "subtract", "multiply", "divide"],
  },
  5: {
    availableModes: ["add", "subtract", "multiply", "divide", "mix"],
    mixModes: ["add", "subtract", "multiply", "divide", "mixed"],
  },
  6: {
    availableModes: ["add", "subtract", "multiply", "divide", "mix"],
    mixModes: ["add", "subtract", "multiply", "divide", "mixed"],
  },
};

export const GRADE_PRACTICE_RULES = {
  1: {
    availableModes: ["arithmetic", "mix"],
    mixModes: ["arithmetic"],
  },
  2: {
    availableModes: ["arithmetic", "mix"],
    mixModes: ["arithmetic"],
  },
  3: {
    availableModes: ["arithmetic", "fraction", "decimal", "mix"],
    mixModes: ["arithmetic", "fraction", "decimal"],
  },
  4: {
    availableModes: ["arithmetic", "fraction", "decimal", "mix"],
    mixModes: ["arithmetic", "fraction", "decimal"],
  },
  5: {
    availableModes: ["arithmetic", "fraction", "decimal", "mix"],
    mixModes: ["arithmetic", "fraction", "decimal"],
  },
  6: {
    availableModes: ["arithmetic", "fraction", "decimal", "mix"],
    mixModes: ["arithmetic", "fraction", "decimal"],
  },
};

export const GRADE_RULES = {
  1: {
    low: {
      problemTypes: ["0~10 덧셈/뺄셈", "받아올림/받아내림 최소화"],
      add: [{ type: "range", min: 0, max: 10, maxAnswer: 10 }],
      subtract: [{ type: "range", min: 0, max: 10 }],
    },
    middle: {
      problemTypes: ["0~20 덧셈/뺄셈", "뺄셈 답 0 이상"],
      add: [{ type: "range", min: 0, max: 20 }],
      subtract: [{ type: "range", min: 0, max: 20 }],
    },
    high: {
      problemTypes: ["0~50 덧셈/뺄셈", "두 자리 수와 한 자리 수 계산 포함"],
      add: [
        { type: "range", min: 0, max: 50 },
        { type: "twoDigitOneDigit", twoDigitMin: 10, twoDigitMax: 49, oneDigitMin: 1, oneDigitMax: 9 },
      ],
      subtract: [
        { type: "range", min: 0, max: 50 },
        { type: "twoDigitMinusOneDigit", twoDigitMin: 10, twoDigitMax: 50, oneDigitMin: 1, oneDigitMax: 9 },
      ],
    },
  },
  2: {
    low: {
      problemTypes: ["0~50 덧셈/뺄셈", "2단과 5단 곱셈"],
      add: [{ type: "range", min: 0, max: 50 }],
      subtract: [{ type: "range", min: 0, max: 50 }],
      multiply: [{ type: "facts", factors: [2, 5], rightMin: 1, rightMax: 9 }],
    },
    middle: {
      problemTypes: ["0~100 덧셈/뺄셈", "2~9단 곱셈"],
      add: [{ type: "range", min: 0, max: 100 }],
      subtract: [{ type: "range", min: 0, max: 100 }],
      multiply: [{ type: "range", leftMin: 2, leftMax: 9, rightMin: 1, rightMax: 9 }],
    },
    high: {
      problemTypes: ["두 자리 수 덧셈/뺄셈", "구구단 전체", "세 수 계산 제외"],
      add: [{ type: "range", min: 10, max: 99 }],
      subtract: [{ type: "range", min: 10, max: 99 }],
      multiply: [{ type: "range", leftMin: 2, leftMax: 9, rightMin: 1, rightMax: 9 }],
    },
  },
  3: {
    low: {
      problemTypes: ["0~100 덧셈/뺄셈", "구구단", "나머지 없는 구구단 기반 나눗셈"],
      add: [{ type: "range", min: 0, max: 100 }],
      subtract: [{ type: "range", min: 0, max: 100 }],
      multiply: [{ type: "range", leftMin: 2, leftMax: 9, rightMin: 1, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, answerMin: 1, answerMax: 9 }],
    },
    middle: {
      problemTypes: ["세 자리 수 덧셈/뺄셈", "두 자리 수 × 한 자리 수", "두 자리 수 ÷ 한 자리 수"],
      add: [{ type: "range", min: 100, max: 999 }],
      subtract: [{ type: "range", min: 100, max: 999 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 99 }],
    },
    high: {
      problemTypes: ["세 자리 수 덧셈/뺄셈", "세 자리 수 × 한 자리 수", "세 자리 수 ÷ 한 자리 수"],
      add: [{ type: "range", min: 100, max: 999 }],
      subtract: [{ type: "range", min: 100, max: 999 }],
      multiply: [{ type: "range", leftMin: 100, leftMax: 999, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 100, dividendMax: 999 }],
    },
  },
  4: {
    low: {
      problemTypes: ["3학년 표준 복습", "두 자리 수 × 한 자리 수", "두 자리 수 ÷ 한 자리 수"],
      add: [{ type: "range", min: 100, max: 999 }],
      subtract: [{ type: "range", min: 100, max: 999 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 99 }],
    },
    middle: {
      problemTypes: ["두 자리 수 × 두 자리 수", "세 자리 수 ÷ 한 자리 수", "나머지 제외"],
      add: [{ type: "range", min: 100, max: 999 }],
      subtract: [{ type: "range", min: 100, max: 999 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 10, rightMax: 99 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 100, dividendMax: 999 }],
    },
    high: {
      problemTypes: ["세 자리 수 × 두 자리 수", "세 자리 수 ÷ 두 자리 수", "나머지 제외"],
      add: [{ type: "range", min: 100, max: 9999 }],
      subtract: [{ type: "range", min: 100, max: 9999 }],
      multiply: [{ type: "range", leftMin: 100, leftMax: 499, rightMin: 10, rightMax: 30 }],
      divide: [{ type: "exact", divisorMin: 10, divisorMax: 99, dividendMin: 100, dividendMax: 999 }],
    },
  },
  5: {
    low: {
      problemTypes: ["자연수 사칙계산 복습", "너무 큰 수 제외"],
      add: [{ type: "range", min: 0, max: 1000 }],
      subtract: [{ type: "range", min: 0, max: 1000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 999 }],
    },
    middle: {
      problemTypes: ["두 연산이 섞인 혼합계산", "괄호 없는 계산 순서"],
      add: [{ type: "range", min: 0, max: 1000 }],
      subtract: [{ type: "range", min: 0, max: 1000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 999 }],
      mixed: { kind: "twoOps", allowParentheses: false },
    },
    high: {
      problemTypes: ["세 연산이 섞인 혼합계산", "괄호는 적게 사용"],
      add: [{ type: "range", min: 0, max: 3000 }],
      subtract: [{ type: "range", min: 0, max: 3000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 10, rightMax: 99 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 12, dividendMin: 10, dividendMax: 999 }],
      mixed: { kind: "threeOps", allowParentheses: "rare" },
    },
  },
  6: {
    low: {
      problemTypes: ["5학년 표준 복습", "괄호 없는 두 연산 혼합계산"],
      add: [{ type: "range", min: 0, max: 1000 }],
      subtract: [{ type: "range", min: 0, max: 1000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 999 }],
      mixed: { kind: "twoOps", allowParentheses: false },
    },
    middle: {
      problemTypes: ["자연수 혼합계산", "괄호 없는 문제와 괄호 있는 문제 섞기"],
      add: [{ type: "range", min: 0, max: 3000 }],
      subtract: [{ type: "range", min: 0, max: 3000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 10, rightMax: 99 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 12, dividendMin: 10, dividendMax: 999 }],
      mixed: { kind: "mixedParentheses", allowParentheses: true },
    },
    high: {
      problemTypes: ["괄호 포함 자연수 혼합계산", "정답은 정수"],
      add: [{ type: "range", min: 0, max: 5000 }],
      subtract: [{ type: "range", min: 0, max: 5000 }],
      multiply: [{ type: "range", leftMin: 10, leftMax: 99, rightMin: 10, rightMax: 99 }],
      divide: [{ type: "exact", divisorMin: 2, divisorMax: 12, dividendMin: 10, dividendMax: 999 }],
      mixed: { kind: "parentheses", allowParentheses: true },
    },
  },
};

export const PROBLEM_META = {
  lower: {
    add: { standardCodes: ["2수01-06"], skillName: "자연수 덧셈" },
    subtract: { standardCodes: ["2수01-06"], skillName: "자연수 뺄셈" },
    multiply: { standardCodes: ["2수01-11"], skillName: "구구단 곱셈" },
    divide: { standardCodes: [], skillName: "나머지 없는 나눗셈" },
    mixed: { standardCodes: [], skillName: "자연수 혼합계산" },
    fraction: { standardCodes: [], skillName: "분수 기초" },
    decimal: { standardCodes: [], skillName: "소수 기초" },
  },
  middle: {
    add: { standardCodes: ["4수01-03"], skillName: "세 자리 수 덧셈" },
    subtract: { standardCodes: ["4수01-03"], skillName: "세 자리 수 뺄셈" },
    multiply: { standardCodes: ["4수01-04"], skillName: "자연수 곱셈" },
    divide: { standardCodes: ["4수01-06"], skillName: "나머지 없는 나눗셈" },
    mixed: { standardCodes: [], skillName: "자연수 혼합계산" },
    fraction: { standardCodes: ["4수01-10"], skillName: "분수의 이해와 계산" },
    decimal: { standardCodes: ["4수01-11"], skillName: "소수의 이해와 계산" },
  },
  upper: {
    add: { standardCodes: ["4수01-03"], skillName: "자연수 덧셈 복습" },
    subtract: { standardCodes: ["4수01-03"], skillName: "자연수 뺄셈 복습" },
    multiply: { standardCodes: ["4수01-04"], skillName: "자연수 곱셈 복습" },
    divide: { standardCodes: ["4수01-06"], skillName: "나머지 없는 나눗셈 복습" },
    mixed: { standardCodes: ["6수01-01"], skillName: "자연수 혼합계산" },
    fraction: { standardCodes: ["6수01-05"], skillName: "분수 계산" },
    decimal: { standardCodes: ["6수01-13"], skillName: "소수 계산" },
  },
};

export function normalizeGrade(grade) {
  const numericGrade = Number.parseInt(grade, 10);
  return GRADES.some((item) => item.id === numericGrade) ? numericGrade : DEFAULT_GRADE;
}

export function normalizeTier(tier) {
  return TIERS.some((item) => item.id === tier) ? tier : DEFAULT_TIER;
}

export function normalizeMode(mode) {
  return MODE_IDS.includes(mode) ? mode : DEFAULT_MODE;
}

export function isPracticeMode(mode) {
  return PRACTICE_MODE_IDS.includes(mode);
}

export function isArithmeticMode(mode) {
  return ARITHMETIC_MODE_IDS.includes(mode);
}

export function getGrade(grade) {
  return GRADES.find((item) => item.id === normalizeGrade(grade)) ?? GRADES[0];
}

export function getTier(tier) {
  return TIERS.find((item) => item.id === normalizeTier(tier)) ?? TIERS[0];
}

export function getOperation(mode) {
  const normalizedMode = normalizeMode(mode);
  return OPERATIONS.find((operation) => operation.id === normalizedMode)
    ?? ARITHMETIC_OPERATIONS.find((operation) => operation.id === normalizedMode)
    ?? MIXED_OPERATION;
}

export function getGradeRule(grade, tier) {
  return GRADE_RULES[normalizeGrade(grade)][normalizeTier(tier)];
}

export function getAvailableModeIds(grade) {
  return GRADE_PRACTICE_RULES[normalizeGrade(grade)].availableModes;
}

export function getMixModeIds(grade) {
  return GRADE_OPERATION_RULES[normalizeGrade(grade)].mixModes;
}

export function getPracticeMixModeIds(grade) {
  return GRADE_PRACTICE_RULES[normalizeGrade(grade)].mixModes;
}

export function isModeAvailableForGrade(mode, grade) {
  const normalizedMode = normalizeMode(mode);

  if (normalizedMode === "mixed") {
    return normalizeGrade(grade) >= 5;
  }

  if (isPracticeMode(normalizedMode)) {
    return getAvailableModeIds(grade).includes(normalizedMode);
  }

  if (isArithmeticMode(normalizedMode)) {
    return GRADE_OPERATION_RULES[normalizeGrade(grade)].availableModes.includes(normalizedMode);
  }

  return false;
}

export function normalizeModeForGrade(mode, grade) {
  const normalizedMode = normalizeMode(mode);
  return isModeAvailableForGrade(normalizedMode, grade) ? normalizedMode : DEFAULT_MODE;
}

export function getProblemMeta(grade, mode) {
  const normalizedGrade = normalizeGrade(grade);
  const normalizedMode = mode === "mix" ? "mixed" : normalizeMode(mode);
  const band = normalizedGrade <= 2 ? "lower" : normalizedGrade <= 4 ? "middle" : "upper";
  const meta = PROBLEM_META[band][normalizedMode] ?? PROBLEM_META[band].mixed;

  if (normalizedMode === "divide" && normalizedGrade === 4) {
    return {
      ...meta,
      standardCodes: ["4수01-07"],
    };
  }

  return meta;
}
