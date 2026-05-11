import {
  DEFAULT_GRADE,
  DEFAULT_MODE,
  DEFAULT_TIER,
  OPERATION_SYMBOLS,
  getGradeRule,
  getMixModeIds,
  getProblemMeta,
  normalizeGrade,
  normalizeMode,
  normalizeModeForGrade,
  normalizeTier,
} from "./gradeRules.js";

const DEFAULT_QUIZ_COUNT = 10;
const MAX_DUPLICATE_ATTEMPTS_PER_PROBLEM = 30;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne(items) {
  return items[randomInt(0, items.length - 1)];
}

function pickVariant(variants) {
  return pickOne(Array.isArray(variants) ? variants : [variants]);
}

function createProblemId({ grade, tier, mode }) {
  const randomId = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `g${grade}-${tier}-${mode}-${randomId}`;
}

function buildProblem({ grade, tier, mode, questionText, answer, explanation, symbol }) {
  const meta = getProblemMeta(grade, mode);
  const problem = {
    id: createProblemId({ grade, tier, mode }),
    grade,
    tier,
    mode,
    questionText,
    answer,
    explanation,
    standardCodes: [...meta.standardCodes],
    skillName: meta.skillName,
  };

  if (symbol) {
    problem.symbol = symbol;
  }

  return problem;
}

function buildSimpleProblem({ grade, tier, mode, left, right, answer }) {
  const symbol = OPERATION_SYMBOLS[mode];

  return buildProblem({
    grade,
    tier,
    mode,
    symbol,
    questionText: `${left} ${symbol} ${right} = ?`,
    answer,
    explanation: createSimpleExplanation({ mode, left, right, answer }),
  });
}

function createSimpleExplanation({ mode, left, right, answer }) {
  if (mode === "add") {
    return `${left}에 ${right}을 더하면 ${answer}이에요.`;
  }

  if (mode === "subtract") {
    return `${left}에서 ${right}을 빼면 ${answer}이에요.`;
  }

  if (mode === "multiply") {
    return `${left} × ${right} = ${answer}이에요.`;
  }

  return `${right} × ${answer} = ${left}이므로 ${left} ÷ ${right} = ${answer}이에요.`;
}

function generateAddition({ grade, tier, rule }) {
  const variant = pickVariant(rule.add);

  if (variant.type === "twoDigitOneDigit") {
    const left = randomInt(variant.twoDigitMin, variant.twoDigitMax);
    const right = randomInt(variant.oneDigitMin, variant.oneDigitMax);
    return buildSimpleProblem({ grade, tier, mode: "add", left, right, answer: left + right });
  }

  let left = randomInt(variant.min, variant.max);
  let right = randomInt(variant.min, variant.max);

  if (typeof variant.maxAnswer === "number") {
    let attempts = 0;

    while (left + right > variant.maxAnswer && attempts < 100) {
      attempts += 1;
      left = randomInt(variant.min, variant.max);
      right = randomInt(variant.min, variant.max);
    }
  }

  return buildSimpleProblem({ grade, tier, mode: "add", left, right, answer: left + right });
}

function generateSubtraction({ grade, tier, rule }) {
  const variant = pickVariant(rule.subtract);

  if (variant.type === "twoDigitMinusOneDigit") {
    const left = randomInt(variant.twoDigitMin, variant.twoDigitMax);
    const right = Math.min(left, randomInt(variant.oneDigitMin, variant.oneDigitMax));
    return buildSimpleProblem({ grade, tier, mode: "subtract", left, right, answer: left - right });
  }

  const first = randomInt(variant.min, variant.max);
  const second = randomInt(variant.min, variant.max);
  const left = Math.max(first, second);
  const right = Math.min(first, second);

  return buildSimpleProblem({ grade, tier, mode: "subtract", left, right, answer: left - right });
}

function generateMultiplication({ grade, tier, rule }) {
  const variant = pickVariant(rule.multiply);
  const left = variant.type === "facts"
    ? pickOne(variant.factors)
    : randomInt(variant.leftMin, variant.leftMax);
  const right = randomInt(variant.rightMin, variant.rightMax);

  return buildSimpleProblem({ grade, tier, mode: "multiply", left, right, answer: left * right });
}

function generateDivision({ grade, tier, rule }) {
  const variant = pickVariant(rule.divide);
  const right = randomInt(variant.divisorMin, variant.divisorMax);
  const answerMin = Math.max(1, variant.answerMin ?? Math.ceil((variant.dividendMin ?? right) / right));
  const answerMax = Math.max(answerMin, variant.answerMax ?? Math.floor((variant.dividendMax ?? right * 12) / right));
  const answer = randomInt(answerMin, answerMax);
  const left = right * answer;

  return buildSimpleProblem({ grade, tier, mode: "divide", left, right, answer });
}

function buildMixedProblem({ grade, tier, expression, answer, explanation }) {
  return buildProblem({
    grade,
    tier,
    mode: "mixed",
    questionText: `${expression} = ?`,
    answer,
    explanation,
  });
}

function generateTwoOperationMixed({ grade, tier }) {
  const templates = [
    () => {
      const left = randomInt(5, 50);
      const factorLeft = randomInt(2, 9);
      const factorRight = randomInt(2, 9);
      const product = factorLeft * factorRight;
      const answer = left + product;

      return buildMixedProblem({
        grade,
        tier,
        expression: `${left} + ${factorLeft} × ${factorRight}`,
        answer,
        explanation: `먼저 ${factorLeft} × ${factorRight} = ${product}를 계산하고 ${left} + ${product} = ${answer}예요.`,
      });
    },
    () => {
      const factorLeft = randomInt(2, 9);
      const factorRight = randomInt(2, 9);
      const product = factorLeft * factorRight;
      const left = randomInt(product, product + 60);
      const answer = left - product;

      return buildMixedProblem({
        grade,
        tier,
        expression: `${left} - ${factorLeft} × ${factorRight}`,
        answer,
        explanation: `먼저 ${factorLeft} × ${factorRight} = ${product}를 계산하고 ${left} - ${product} = ${answer}예요.`,
      });
    },
    () => {
      const divisor = randomInt(2, 9);
      const quotient = randomInt(2, 12);
      const dividend = divisor * quotient;
      const extra = randomInt(3, 40);
      const answer = quotient + extra;

      return buildMixedProblem({
        grade,
        tier,
        expression: `${dividend} ÷ ${divisor} + ${extra}`,
        answer,
        explanation: `먼저 ${dividend} ÷ ${divisor} = ${quotient}를 계산하고 ${quotient} + ${extra} = ${answer}예요.`,
      });
    },
  ];

  return pickOne(templates)();
}

function generateThreeOperationMixed({ grade, tier }) {
  const templates = [
    () => {
      const divisor = randomInt(2, 9);
      const quotient = randomInt(2, 12);
      const dividend = divisor * quotient;
      const factorLeft = randomInt(2, 9);
      const factorRight = randomInt(2, 9);
      const product = factorLeft * factorRight;
      const answer = quotient + product;

      return buildMixedProblem({
        grade,
        tier,
        expression: `${dividend} ÷ ${divisor} + ${factorLeft} × ${factorRight}`,
        answer,
        explanation: `먼저 ${dividend} ÷ ${divisor} = ${quotient}, ${factorLeft} × ${factorRight} = ${product}를 계산하고 ${quotient} + ${product} = ${answer}예요.`,
      });
    },
    () => {
      const first = randomInt(20, 80);
      const factorLeft = randomInt(2, 9);
      const factorRight = randomInt(2, 9);
      const product = factorLeft * factorRight;
      const minus = randomInt(1, Math.min(20, first + product));
      const answer = first + product - minus;

      return buildMixedProblem({
        grade,
        tier,
        expression: `${first} + ${factorLeft} × ${factorRight} - ${minus}`,
        answer,
        explanation: `먼저 ${factorLeft} × ${factorRight} = ${product}를 계산하고 ${first} + ${product} - ${minus} = ${answer}예요.`,
      });
    },
  ];

  return pickOne(templates)();
}

function generateParenthesesMixed({ grade, tier }) {
  const templates = [
    () => {
      const divisor = pickOne([2, 4, 5, 8, 10]);
      const quotient = randomInt(8, 14);
      const sum = divisor * quotient;
      const first = randomInt(10, Math.min(40, sum - 1));
      const second = sum - first;
      const extra = randomInt(1, 20);
      const answer = quotient + extra;

      return buildMixedProblem({
        grade,
        tier,
        expression: `(${first} + ${second}) ÷ ${divisor} + ${extra}`,
        answer,
        explanation: `괄호를 먼저 계산해요. ${first} + ${second} = ${sum}, ${sum} ÷ ${divisor} = ${quotient}, ${quotient} + ${extra} = ${answer}예요.`,
      });
    },
    () => {
      const divisor = pickOne([2, 3, 4, 5, 6, 8, 9]);
      const quotient = randomInt(3, 12);
      const difference = divisor * quotient;
      const second = randomInt(1, 30);
      const first = difference + second;
      const extra = randomInt(1, 20);
      const answer = quotient + extra;

      return buildMixedProblem({
        grade,
        tier,
        expression: `(${first} - ${second}) ÷ ${divisor} + ${extra}`,
        answer,
        explanation: `괄호를 먼저 계산해요. ${first} - ${second} = ${difference}, ${difference} ÷ ${divisor} = ${quotient}, ${quotient} + ${extra} = ${answer}예요.`,
      });
    },
    () => {
      const first = randomInt(10, 40);
      const second = randomInt(10, 40);
      const multiplier = randomInt(2, 6);
      const sum = first + second;
      const product = sum * multiplier;
      const minus = randomInt(1, Math.min(30, product));
      const answer = product - minus;

      return buildMixedProblem({
        grade,
        tier,
        expression: `(${first} + ${second}) × ${multiplier} - ${minus}`,
        answer,
        explanation: `괄호를 먼저 계산해요. ${first} + ${second} = ${sum}, ${sum} × ${multiplier} = ${product}, ${product} - ${minus} = ${answer}예요.`,
      });
    },
  ];

  return pickOne(templates)();
}

function generateMixed({ grade, tier, rule }) {
  if (rule.mixed?.kind === "twoOps") {
    return generateTwoOperationMixed({ grade, tier });
  }

  if (rule.mixed?.kind === "threeOps") {
    return Math.random() < 0.25
      ? generateParenthesesMixed({ grade, tier })
      : generateThreeOperationMixed({ grade, tier });
  }

  if (rule.mixed?.kind === "mixedParentheses") {
    return Math.random() < 0.5
      ? generateParenthesesMixed({ grade, tier })
      : generateThreeOperationMixed({ grade, tier });
  }

  return generateParenthesesMixed({ grade, tier });
}

function generateByMode({ grade, tier, mode, rule }) {
  if (mode === "add") {
    return generateAddition({ grade, tier, rule });
  }

  if (mode === "subtract") {
    return generateSubtraction({ grade, tier, rule });
  }

  if (mode === "multiply") {
    return generateMultiplication({ grade, tier, rule });
  }

  if (mode === "divide") {
    return generateDivision({ grade, tier, rule });
  }

  return generateMixed({ grade, tier, rule });
}

function pickPlayableMode({ mode, grade, rule }) {
  const normalizedMode = normalizeModeForGrade(mode, grade);

  if (normalizedMode === "mixed") {
    return rule.mixed ? "mixed" : pickOne(getMixModeIds(grade).filter((item) => item !== "mixed"));
  }

  if (normalizedMode !== "mix") {
    return normalizedMode;
  }

  const mixModes = getMixModeIds(grade);
  const simpleModes = mixModes.filter((item) => item !== "mixed");

  if (rule.mixed && mixModes.includes("mixed") && Math.random() < 0.25) {
    return "mixed";
  }

  return pickOne(simpleModes);
}

export function generateProblem({
  grade = DEFAULT_GRADE,
  tier = DEFAULT_TIER,
  mode = DEFAULT_MODE,
} = {}) {
  const normalizedGrade = normalizeGrade(grade);
  const normalizedTier = normalizeTier(tier);
  const normalizedMode = normalizeMode(mode);
  const rule = getGradeRule(normalizedGrade, normalizedTier);
  const selectedMode = pickPlayableMode({
    mode: normalizedMode,
    grade: normalizedGrade,
    rule,
  });

  return generateByMode({
    grade: normalizedGrade,
    tier: normalizedTier,
    mode: selectedMode,
    rule,
  });
}

export function generateQuiz({
  grade = DEFAULT_GRADE,
  tier = DEFAULT_TIER,
  mode = DEFAULT_MODE,
  count = DEFAULT_QUIZ_COUNT,
} = {}) {
  const targetCount = Math.max(1, Math.floor(Number(count) || DEFAULT_QUIZ_COUNT));
  const quiz = [];
  const seenQuestionTexts = new Set();

  while (quiz.length < targetCount) {
    let problem = generateProblem({ grade, tier, mode });
    let duplicateAttempts = 0;

    while (
      seenQuestionTexts.has(problem.questionText)
      && duplicateAttempts < MAX_DUPLICATE_ATTEMPTS_PER_PROBLEM
    ) {
      duplicateAttempts += 1;
      problem = generateProblem({ grade, tier, mode });
    }

    if (!seenQuestionTexts.has(problem.questionText)) {
      seenQuestionTexts.add(problem.questionText);
    }

    quiz.push(problem);
  }

  return quiz;
}
