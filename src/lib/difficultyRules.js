export const DEFAULT_MODE = "mix";
export const DEFAULT_LEVEL = "easy";

export const OPERATION_SYMBOLS = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
};

export const OPERATIONS = [
  { id: "add", label: "덧셈", symbol: "+", helper: "더하기 연습" },
  { id: "subtract", label: "뺄셈", symbol: "-", helper: "빼기 연습" },
  { id: "multiply", label: "곱셈", symbol: "×", helper: "구구단 연습" },
  { id: "divide", label: "나눗셈", symbol: "÷", helper: "나누기 연습" },
  { id: "mix", label: "섞어서", symbol: "★", helper: "골고루 연습" },
];

export const LEVELS = [
  { id: "easy", label: "쉬움", helper: "가볍게 시작" },
  { id: "normal", label: "보통", helper: "차근차근 연습" },
  { id: "challenge", label: "도전", helper: "조금 더 어렵게" },
];

export const PLAYABLE_MODE_IDS = ["add", "subtract", "multiply", "divide"];

export const DIFFICULTY_RULES = {
  easy: {
    add: { min: 0, max: 20 },
    subtract: { min: 0, max: 20 },
    multiply: { leftMin: 1, leftMax: 5, rightMin: 1, rightMax: 5 },
    divide: { divisorMin: 1, divisorMax: 5, answerMin: 1, answerMax: 5 },
  },
  normal: {
    add: { min: 0, max: 100 },
    subtract: { min: 0, max: 100 },
    multiply: { leftMin: 2, leftMax: 9, rightMin: 2, rightMax: 9 },
    divide: { divisorMin: 2, divisorMax: 9, answerMin: 2, answerMax: 9 },
  },
  challenge: {
    add: { min: 0, max: 300 },
    subtract: { min: 0, max: 300 },
    multiply: { leftMin: 10, leftMax: 99, rightMin: 2, rightMax: 9 },
    divide: { divisorMin: 2, divisorMax: 9, dividendMin: 10, dividendMax: 99 },
  },
};

export function normalizeMode(mode) {
  return OPERATIONS.some((operation) => operation.id === mode) ? mode : DEFAULT_MODE;
}

export function normalizeLevel(level) {
  return LEVELS.some((difficulty) => difficulty.id === level) ? level : DEFAULT_LEVEL;
}

export function getOperation(mode) {
  return OPERATIONS.find((operation) => operation.id === normalizeMode(mode)) ?? OPERATIONS[4];
}

export function getDifficulty(level) {
  return LEVELS.find((difficulty) => difficulty.id === normalizeLevel(level)) ?? LEVELS[0];
}
