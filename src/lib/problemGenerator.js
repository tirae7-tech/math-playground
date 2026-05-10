import {
  DIFFICULTY_RULES,
  OPERATION_SYMBOLS,
  PLAYABLE_MODE_IDS,
  normalizeLevel,
  normalizeMode,
} from "./difficultyRules.js";

const DEFAULT_QUIZ_COUNT = 10;
const MAX_UNIQUE_ATTEMPTS_PER_PROBLEM = 40;
const FALLBACK_UNIQUE_ATTEMPT_LIMIT = 5000;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickPlayableMode(mode) {
  const normalizedMode = normalizeMode(mode);

  if (normalizedMode === "mix") {
    return PLAYABLE_MODE_IDS[randomInt(0, PLAYABLE_MODE_IDS.length - 1)];
  }

  return normalizedMode;
}

function createId(mode, left, right) {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${mode}-${left}-${right}-${randomPart}`;
}

function createExplanation({ mode, left, right, answer }) {
  if (mode === "add") {
    return `${left}에 ${right}을 더하면 ${answer}이에요.`;
  }

  if (mode === "subtract") {
    return `${left}에서 ${right}을 빼면 ${answer}이에요.`;
  }

  if (mode === "multiply") {
    return `${left}을 ${right}번 묶으면 ${answer}이에요.`;
  }

  return `${right}씩 나누면 ${answer}묶음이 되고, ${right} × ${answer} = ${left}예요.`;
}

function buildProblem({ mode, left, right, answer }) {
  const symbol = OPERATION_SYMBOLS[mode];
  const questionText = `${left} ${symbol} ${right} = ?`;

  return {
    id: createId(mode, left, right),
    mode,
    symbol,
    left,
    right,
    questionText,
    answer,
    explanation: createExplanation({ mode, left, right, answer }),
    prompt: `${left} ${symbol} ${right}`,
  };
}

function generateAddition(level) {
  const range = DIFFICULTY_RULES[level].add;
  const left = randomInt(range.min, range.max);
  const right = randomInt(range.min, range.max);

  return buildProblem({ mode: "add", left, right, answer: left + right });
}

function generateSubtraction(level) {
  const range = DIFFICULTY_RULES[level].subtract;
  const first = randomInt(range.min, range.max);
  const second = randomInt(range.min, range.max);
  const left = Math.max(first, second);
  const right = Math.min(first, second);

  return buildProblem({ mode: "subtract", left, right, answer: left - right });
}

function generateMultiplication(level) {
  const range = DIFFICULTY_RULES[level].multiply;
  const left = randomInt(range.leftMin, range.leftMax);
  const right = randomInt(range.rightMin, range.rightMax);

  return buildProblem({ mode: "multiply", left, right, answer: left * right });
}

function generateDivision(level) {
  const range = DIFFICULTY_RULES[level].divide;
  const right = randomInt(range.divisorMin, range.divisorMax);
  const answer =
    level === "challenge"
      ? randomInt(Math.ceil(range.dividendMin / right), Math.floor(range.dividendMax / right))
      : randomInt(range.answerMin, range.answerMax);
  const left = right * answer;

  return buildProblem({ mode: "divide", left, right, answer });
}

export function generateProblem({ mode = "mix", level = "easy" } = {}) {
  const normalizedLevel = normalizeLevel(level);
  const selectedMode = pickPlayableMode(mode);

  if (selectedMode === "add") {
    return generateAddition(normalizedLevel);
  }

  if (selectedMode === "subtract") {
    return generateSubtraction(normalizedLevel);
  }

  if (selectedMode === "multiply") {
    return generateMultiplication(normalizedLevel);
  }

  return generateDivision(normalizedLevel);
}

export function generateQuiz({ mode = "mix", level = "easy", count = DEFAULT_QUIZ_COUNT } = {}) {
  const quiz = [];
  const seenProblems = new Set();
  const targetCount = Math.max(1, Math.floor(Number(count) || DEFAULT_QUIZ_COUNT));
  let attempts = 0;

  while (quiz.length < targetCount && attempts < targetCount * MAX_UNIQUE_ATTEMPTS_PER_PROBLEM) {
    attempts += 1;
    const problem = generateProblem({ mode, level });
    const problemKey = `${problem.mode}:${problem.left}:${problem.right}`;

    if (!seenProblems.has(problemKey)) {
      seenProblems.add(problemKey);
      quiz.push(problem);
    }
  }

  while (quiz.length < targetCount && attempts < FALLBACK_UNIQUE_ATTEMPT_LIMIT) {
    attempts += 1;
    const problem = generateProblem({ mode, level });
    const problemKey = `${problem.mode}:${problem.left}:${problem.right}`;

    if (!seenProblems.has(problemKey)) {
      seenProblems.add(problemKey);
      quiz.push(problem);
    }
  }

  return quiz;
}
