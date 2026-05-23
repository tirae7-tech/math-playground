import {
  DEFAULT_GRADE,
  DEFAULT_MODE,
  DEFAULT_TIER,
  OPERATION_SYMBOLS,
  getGradeRule,
  getMixModeIds,
  getPracticeMixModeIds,
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

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);

  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }

  return left || 1;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function formatFraction(numerator, denominator, { simplify = false } = {}) {
  const fraction = simplify ? simplifyFraction(numerator, denominator) : { numerator, denominator };

  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }

  return `${fraction.numerator}/${fraction.denominator}`;
}

function formatDecimal(value) {
  return Number(value.toFixed(3)).toString();
}

function parseFraction(value) {
  const normalized = String(value).trim().replace(",", ".");

  if (normalized.includes("/")) {
    const [numeratorText, denominatorText] = normalized.split("/");
    const numerator = Number(numeratorText);
    const denominator = Number(denominatorText);

    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }

    return { numerator, denominator };
  }

  const numberValue = Number(normalized);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return { numerator: numberValue, denominator: 1 };
}

export function formatAnswerForDisplay(answer) {
  return String(answer);
}

export function isAnswerCorrect(inputValue, expectedAnswer) {
  const input = String(inputValue).trim().replace(",", ".");
  const expected = String(expectedAnswer).trim();

  if (input === "") {
    return false;
  }

  if (expected.includes("/") || input.includes("/")) {
    const inputFraction = parseFraction(input);
    const expectedFraction = parseFraction(expected);

    if (!inputFraction || !expectedFraction) {
      return false;
    }

    return Math.abs(
      inputFraction.numerator * expectedFraction.denominator
        - expectedFraction.numerator * inputFraction.denominator,
    ) < 0.000001;
  }

  const inputNumber = Number(input);
  const expectedNumber = Number(expected);

  if (Number.isFinite(inputNumber) && Number.isFinite(expectedNumber)) {
    return Math.abs(inputNumber - expectedNumber) < 0.000001;
  }

  return input === expected;
}

function createProblemId({ grade, tier, mode }) {
  const randomId = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `g${grade}-${tier}-${mode}-${randomId}`;
}

function buildProblem({
  grade,
  tier,
  mode,
  questionText,
  answer,
  explanation,
  symbol,
  standardCodes,
  skillName,
  answerHint,
}) {
  const meta = getProblemMeta(grade, mode);
  const problem = {
    id: createProblemId({ grade, tier, mode }),
    grade,
    tier,
    mode,
    questionText,
    answer,
    explanation,
    standardCodes: [...(standardCodes ?? meta.standardCodes)],
    skillName: skillName ?? meta.skillName,
  };

  if (symbol) {
    problem.symbol = symbol;
  }

  if (answerHint) {
    problem.answerHint = answerHint;
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

function buildFractionProblem({ grade, tier, questionText, answer, explanation, skillName }) {
  return buildProblem({
    grade,
    tier,
    mode: "fraction",
    questionText,
    answer,
    explanation,
    skillName,
    standardCodes: grade <= 4 ? ["4수01-10"] : ["6수01-05"],
    answerHint: String(answer).includes("/") ? "분수는 3/5처럼 써요." : "숫자만 써요.",
  });
}

function generateFractionReading({ grade, tier }) {
  const maxDenominator = tier === "low" ? 5 : tier === "middle" ? 9 : 12;
  const denominator = randomInt(2, maxDenominator);
  const numerator = randomInt(1, denominator - 1);
  const askNumerator = Math.random() < 0.5;

  return buildFractionProblem({
    grade,
    tier,
    questionText: `${numerator}/${denominator}에서 ${askNumerator ? "분자" : "분모"}는 얼마일까요?`,
    answer: askNumerator ? numerator : denominator,
    explanation: `${numerator}/${denominator}에서 위의 수 ${numerator}는 분자, 아래의 수 ${denominator}는 분모예요.`,
    skillName: "분수 읽기",
  });
}

function generateFractionComparison({ grade, tier }) {
  const maxDenominator = tier === "low" ? 6 : tier === "middle" ? 9 : 12;
  let first;
  let second;

  if (tier === "high") {
    do {
      const firstDenominator = randomInt(3, maxDenominator);
      const secondDenominator = randomInt(3, maxDenominator);
      first = {
        numerator: randomInt(1, firstDenominator - 1),
        denominator: firstDenominator,
      };
      second = {
        numerator: randomInt(1, secondDenominator - 1),
        denominator: secondDenominator,
      };
    } while (first.numerator * second.denominator === second.numerator * first.denominator);
  } else {
    const denominator = randomInt(3, maxDenominator);
    const firstNumerator = randomInt(1, denominator - 1);
    let secondNumerator = randomInt(1, denominator - 1);

    while (secondNumerator === firstNumerator) {
      secondNumerator = randomInt(1, denominator - 1);
    }

    first = { numerator: firstNumerator, denominator };
    second = { numerator: secondNumerator, denominator };
  }

  const firstValue = first.numerator / first.denominator;
  const secondValue = second.numerator / second.denominator;
  const answer = firstValue > secondValue ? 1 : 2;
  const firstText = formatFraction(first.numerator, first.denominator);
  const secondText = formatFraction(second.numerator, second.denominator);

  return buildFractionProblem({
    grade,
    tier,
    questionText: `더 큰 분수는 몇 번일까요?\n1) ${firstText}\n2) ${secondText}`,
    answer,
    explanation: `${firstText}와 ${secondText}의 크기를 비교하면 ${answer === 1 ? firstText : secondText}가 더 커요.`,
    skillName: "분수 크기 비교",
  });
}

function generateSameDenominatorFraction({ grade, tier }) {
  const maxDenominator = tier === "low" ? 7 : tier === "middle" ? 10 : 12;
  const denominator = randomInt(3, maxDenominator);
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    const first = randomInt(1, denominator - 2);
    const second = randomInt(1, denominator - first - 1);
    const answer = formatFraction(first + second, denominator);

    return buildFractionProblem({
      grade,
      tier,
      questionText: `${first}/${denominator} + ${second}/${denominator} = ?`,
      answer,
      explanation: `분모가 같으니 분자끼리 더해요. ${first} + ${second} = ${first + second}이므로 정답은 ${answer}예요.`,
      skillName: "같은 분모 분수 덧셈",
    });
  }

  const first = randomInt(2, denominator - 1);
  const second = randomInt(1, first - 1);
  const answer = formatFraction(first - second, denominator);

  return buildFractionProblem({
    grade,
    tier,
    questionText: `${first}/${denominator} - ${second}/${denominator} = ?`,
    answer,
    explanation: `분모가 같으니 분자끼리 빼요. ${first} - ${second} = ${first - second}이므로 정답은 ${answer}예요.`,
    skillName: "같은 분모 분수 뺄셈",
  });
}

function generateFractionReduction({ grade, tier }) {
  const baseDenominator = randomInt(3, tier === "low" ? 8 : 12);
  const baseNumerator = randomInt(1, baseDenominator - 1);
  const simple = simplifyFraction(baseNumerator, baseDenominator);
  const multiplier = randomInt(2, tier === "high" ? 6 : 4);
  const numerator = simple.numerator * multiplier;
  const denominator = simple.denominator * multiplier;
  const answer = formatFraction(simple.numerator, simple.denominator);

  return buildFractionProblem({
    grade,
    tier,
    questionText: `${numerator}/${denominator}을 약분하면?`,
    answer,
    explanation: `${numerator}와 ${denominator}를 ${multiplier}로 나누면 ${answer}이 돼요.`,
    skillName: "약분",
  });
}

function generateDifferentDenominatorFraction({ grade, tier }) {
  const maxDenominator = tier === "low" ? 6 : tier === "middle" ? 9 : 12;
  let firstDenominator = randomInt(2, maxDenominator);
  let secondDenominator = randomInt(2, maxDenominator);

  while (firstDenominator === secondDenominator) {
    secondDenominator = randomInt(2, maxDenominator);
  }

  const commonDenominator = lcm(firstDenominator, secondDenominator);
  const firstNumerator = randomInt(1, firstDenominator - 1);
  const secondNumerator = randomInt(1, secondDenominator - 1);
  const firstScaled = firstNumerator * (commonDenominator / firstDenominator);
  const secondScaled = secondNumerator * (commonDenominator / secondDenominator);
  const isAddition = Math.random() < 0.55;

  if (isAddition) {
    const answer = formatFraction(firstScaled + secondScaled, commonDenominator, { simplify: true });

    return buildFractionProblem({
      grade,
      tier,
      questionText: `${firstNumerator}/${firstDenominator} + ${secondNumerator}/${secondDenominator} = ?`,
      answer,
      explanation: `공통분모 ${commonDenominator}으로 통분해요. ${firstScaled}/${commonDenominator} + ${secondScaled}/${commonDenominator} = ${answer}예요.`,
      skillName: "이분모 분수 덧셈",
    });
  }

  const leftScaled = Math.max(firstScaled, secondScaled);
  const rightScaled = Math.min(firstScaled, secondScaled);
  const leftText = firstScaled >= secondScaled
    ? `${firstNumerator}/${firstDenominator}`
    : `${secondNumerator}/${secondDenominator}`;
  const rightText = firstScaled >= secondScaled
    ? `${secondNumerator}/${secondDenominator}`
    : `${firstNumerator}/${firstDenominator}`;
  const answer = formatFraction(leftScaled - rightScaled, commonDenominator, { simplify: true });

  return buildFractionProblem({
    grade,
    tier,
    questionText: `${leftText} - ${rightText} = ?`,
    answer,
    explanation: `공통분모 ${commonDenominator}으로 통분한 뒤 분자끼리 빼면 ${answer}예요.`,
    skillName: "이분모 분수 뺄셈",
  });
}

function generateFractionMultiplicationOrDivision({ grade, tier }) {
  const maxDenominator = tier === "low" ? 6 : tier === "middle" ? 9 : 12;
  const firstDenominator = randomInt(3, maxDenominator);
  const secondDenominator = randomInt(3, maxDenominator);
  const firstNumerator = randomInt(1, firstDenominator - 1);
  const secondNumerator = randomInt(1, secondDenominator - 1);
  const useDivision = tier !== "low" && Math.random() < 0.45;

  if (useDivision) {
    const numerator = firstNumerator * secondDenominator;
    const denominator = firstDenominator * secondNumerator;
    const answer = formatFraction(numerator, denominator, { simplify: true });

    return buildFractionProblem({
      grade,
      tier,
      questionText: `${firstNumerator}/${firstDenominator} ÷ ${secondNumerator}/${secondDenominator} = ?`,
      answer,
      explanation: `나누는 분수를 뒤집어 곱해요. ${firstNumerator}/${firstDenominator} × ${secondDenominator}/${secondNumerator} = ${answer}예요.`,
      skillName: "분수 나눗셈 기초",
    });
  }

  const answer = formatFraction(firstNumerator * secondNumerator, firstDenominator * secondDenominator, { simplify: true });

  return buildFractionProblem({
    grade,
    tier,
    questionText: `${firstNumerator}/${firstDenominator} × ${secondNumerator}/${secondDenominator} = ?`,
    answer,
    explanation: `분자는 분자끼리, 분모는 분모끼리 곱해요. 정답은 ${answer}예요.`,
    skillName: "분수 곱셈 기초",
  });
}

function generateFractionProblem({ grade, tier }) {
  if (grade <= 3) {
    return Math.random() < 0.5
      ? generateFractionReading({ grade, tier })
      : generateFractionComparison({ grade, tier });
  }

  if (grade === 4) {
    return generateSameDenominatorFraction({ grade, tier });
  }

  if (grade === 5) {
    const generators = [
      generateFractionReduction,
      generateDifferentDenominatorFraction,
      generateDifferentDenominatorFraction,
    ];
    return pickOne(generators)({ grade, tier });
  }

  return generateFractionMultiplicationOrDivision({ grade, tier });
}

function buildDecimalProblem({ grade, tier, questionText, answer, explanation, skillName }) {
  return buildProblem({
    grade,
    tier,
    mode: "decimal",
    questionText,
    answer,
    explanation,
    skillName,
    standardCodes: grade <= 4 ? ["4수01-11"] : ["6수01-13"],
    answerHint: String(answer).includes(".") ? "소수는 0.5처럼 써요." : "숫자만 써요.",
  });
}

function generateDecimalReading({ grade, tier }) {
  const tenths = randomInt(1, 9);
  const value = `0.${tenths}`;

  if (Math.random() < 0.45) {
    return buildDecimalProblem({
      grade,
      tier,
      questionText: `${value}에서 소수 첫째 자리 숫자는?`,
      answer: tenths,
      explanation: `${value}는 소수 첫째 자리에 ${tenths}가 있어요.`,
      skillName: "소수 한 자리 읽기",
    });
  }

  const otherTenths = randomInt(1, 9);
  const secondValue = `0.${otherTenths === tenths ? (otherTenths % 9) + 1 : otherTenths}`;
  const answer = Number(value) > Number(secondValue) ? 1 : 2;

  return buildDecimalProblem({
    grade,
    tier,
    questionText: `더 큰 소수는 몇 번일까요?\n1) ${value}\n2) ${secondValue}`,
    answer,
    explanation: `소수 첫째 자리 숫자를 비교하면 ${answer === 1 ? value : secondValue}가 더 커요.`,
    skillName: "소수 크기 비교",
  });
}

function generateDecimalAdditionSubtraction({ grade, tier }) {
  const scale = tier === "high" ? 100 : 10;
  const maxUnit = tier === "low" ? 30 : tier === "middle" ? 80 : 150;
  const first = randomInt(1, maxUnit);
  const second = randomInt(1, maxUnit);
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    const answer = formatDecimal((first + second) / scale);

    return buildDecimalProblem({
      grade,
      tier,
      questionText: `${formatDecimal(first / scale)} + ${formatDecimal(second / scale)} = ?`,
      answer,
      explanation: `소수점을 맞춰 더하면 ${answer}예요.`,
      skillName: "소수 덧셈",
    });
  }

  const left = Math.max(first, second);
  const right = Math.min(first, second);
  const answer = formatDecimal((left - right) / scale);

  return buildDecimalProblem({
    grade,
    tier,
    questionText: `${formatDecimal(left / scale)} - ${formatDecimal(right / scale)} = ?`,
    answer,
    explanation: `소수점을 맞춰 빼면 ${answer}예요.`,
    skillName: "소수 뺄셈",
  });
}

function generateDecimalMultiplication({ grade, tier }) {
  const scale = tier === "high" ? 100 : 10;
  const decimalUnits = randomInt(2, tier === "low" ? 20 : 80);
  const multiplier = randomInt(2, tier === "high" ? 9 : 6);
  const answer = formatDecimal((decimalUnits * multiplier) / scale);

  return buildDecimalProblem({
    grade,
    tier,
    questionText: `${formatDecimal(decimalUnits / scale)} × ${multiplier} = ?`,
    answer,
    explanation: `${formatDecimal(decimalUnits / scale)}를 ${multiplier}번 더한 값은 ${answer}예요.`,
    skillName: "소수 곱셈 기초",
  });
}

function generateDecimalDivision({ grade, tier }) {
  const scale = tier === "high" ? 100 : 10;
  const divisor = randomInt(2, tier === "low" ? 5 : 9);
  const quotientUnits = randomInt(2, tier === "low" ? 20 : 80);
  const dividendUnits = divisor * quotientUnits;
  const dividend = formatDecimal(dividendUnits / scale);
  const answer = formatDecimal(quotientUnits / scale);

  return buildDecimalProblem({
    grade,
    tier,
    questionText: `${dividend} ÷ ${divisor} = ?`,
    answer,
    explanation: `${answer} × ${divisor} = ${dividend}이므로 ${dividend} ÷ ${divisor} = ${answer}예요.`,
    skillName: "소수 나눗셈 기초",
  });
}

function generateDecimalProblem({ grade, tier }) {
  if (grade <= 3) {
    return generateDecimalReading({ grade, tier });
  }

  if (grade === 4) {
    return generateDecimalAdditionSubtraction({ grade, tier });
  }

  if (grade === 5) {
    return generateDecimalMultiplication({ grade, tier });
  }

  return generateDecimalDivision({ grade, tier });
}

function generateByMode({ grade, tier, mode, rule }) {
  if (mode === "arithmetic") {
    return generateArithmeticProblem({ grade, tier, rule });
  }

  if (mode === "fraction") {
    return generateFractionProblem({ grade, tier });
  }

  if (mode === "decimal") {
    return generateDecimalProblem({ grade, tier });
  }

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

function pickPlayableArithmeticMode({ mode, grade, rule }) {
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

function generateArithmeticProblem({ grade, tier, rule }) {
  const selectedMode = pickPlayableArithmeticMode({
    mode: "mix",
    grade,
    rule,
  });

  return generateByMode({
    grade,
    tier,
    mode: selectedMode,
    rule,
  });
}

export function generateProblem({
  grade = DEFAULT_GRADE,
  tier = DEFAULT_TIER,
  mode = DEFAULT_MODE,
} = {}) {
  const normalizedGrade = normalizeGrade(grade);
  const normalizedTier = normalizeTier(tier);
  const normalizedMode = normalizeModeForGrade(normalizeMode(mode), normalizedGrade);
  const rule = getGradeRule(normalizedGrade, normalizedTier);
  let selectedMode = normalizedMode;

  if (normalizedMode === "mix") {
    selectedMode = pickOne(getPracticeMixModeIds(normalizedGrade));
  }

  if (["add", "subtract", "multiply", "divide", "mixed"].includes(normalizedMode)) {
    selectedMode = pickPlayableArithmeticMode({
      mode: normalizedMode,
      grade: normalizedGrade,
      rule,
    });
  }

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
