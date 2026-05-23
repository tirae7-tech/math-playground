import { useEffect, useRef, useState } from "react";
import { getGrade, getOperation, getTier } from "../lib/gradeRules.js";
import { formatAnswerForDisplay, isAnswerCorrect } from "../lib/problemGenerator.js";

const CORRECT_MESSAGES = [
  "잘했어요!",
  "멋져요!",
  "계산 실력이 반짝반짝해요!",
];

export default function QuizScreen({ questions, settings, quizKind = "main", onFinish, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isRetryMode = quizKind === "retryWrong";
  const operation = getOperation(settings.mode);
  const grade = getGrade(settings.grade);
  const tier = getTier(settings.tier);
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const progressText = `문제 ${currentIndex + 1} / ${questions.length}`;
  const settingText = `${grade.label} · ${tier.label} · ${isRetryMode ? "다시 풀기" : operation.label}`;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasCheckedAnswer = feedback?.kind === "correct" || feedback?.kind === "try-again";
  const answerHint = currentQuestion?.answerHint ?? "숫자로 답을 써요.";
  const questionLength = currentQuestion?.questionText.length ?? 0;
  const questionSize = questionLength > 34 ? "long" : questionLength > 20 ? "medium" : "short";

  useEffect(() => {
    const canUseKeyboardWithoutCoveringScreen =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (canUseKeyboardWithoutCoveringScreen) {
      inputRef.current?.focus();
    }
  }, [currentIndex]);

  function submitAnswer(event) {
    event.preventDefault();

    if (!currentQuestion || hasCheckedAnswer) {
      return;
    }

    const trimmedInput = inputValue.trim();

    if (trimmedInput === "") {
      setFeedback({
        kind: "notice",
        title: "답을 입력해 주세요.",
      });
      inputRef.current?.focus();
      return;
    }

    const isCorrect = isAnswerCorrect(trimmedInput, currentQuestion.answer);
    const promptText = currentQuestion.questionText.replace(" = ?", "");
    const answerRecord = {
      questionId: currentQuestion.id,
      problem: currentQuestion.questionText,
      prompt: promptText,
      questionText: currentQuestion.questionText,
      grade: currentQuestion.grade,
      tier: currentQuestion.tier,
      mode: currentQuestion.mode,
      symbol: currentQuestion.symbol,
      userAnswer: trimmedInput,
      givenAnswer: trimmedInput,
      correctAnswer: currentQuestion.answer,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      standardCodes: currentQuestion.standardCodes,
      skillName: currentQuestion.skillName,
      isCorrect,
      question: currentQuestion,
    };
    const nextAnswers = [...answers, answerRecord];

    setAnswers(nextAnswers);
    setFeedback(
      isCorrect
        ? {
            kind: "correct",
            title: CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)],
          }
        : {
            kind: "try-again",
            title: "다시 생각해볼까요?",
            detail: `괜찮아요, 정답은 ${formatAnswerForDisplay(currentQuestion.answer)}예요.`,
          },
    );
  }

  function goNext() {
    if (isLastQuestion) {
      onFinish(answers);
      return;
    }

    setCurrentIndex(currentIndex + 1);
    setInputValue("");
    setFeedback(null);
    setIsInputFocused(false);
  }

  function updateInputValue(nextValue) {
    setInputValue(nextValue.replace(/[^0-9/.,]/g, "").replace(",", "."));

    if (feedback?.kind === "notice") {
      setFeedback(null);
    }
  }

  function submitWithEnter(event) {
    if (event.key !== "Enter" || hasCheckedAnswer) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  if (!currentQuestion) {
    return (
      <section className="screen quiz-screen">
        <p>문제를 준비하고 있어요.</p>
      </section>
    );
  }

  return (
    <section
      className="screen quiz-screen"
      data-keyboard-active={isInputFocused && !hasCheckedAnswer ? "true" : "false"}
      aria-labelledby="quiz-title"
    >
      <div className="quiz-topbar">
        <button className="ghost-button" type="button" onClick={onExit}>
          처음으로
        </button>
        <div className="progress-pill" aria-label={`현재 ${progressText}`}>
          {progressText}
        </div>
      </div>

      <div className="quiz-status">
        <div>
          <p className="screen-kicker">
            {settingText}
          </p>
          <h2 id="quiz-title">
            {isRetryMode ? "천천히 다시 풀어볼까요?" : "빈칸에 들어갈 수는?"}
          </h2>
        </div>
        <div className="correct-pill" aria-label={`현재 맞힌 개수 ${correctCount}개`}>
          맞힌 개수 {correctCount}
        </div>
      </div>

      <form className="question-panel" onSubmit={submitAnswer}>
        <div className="question-text" data-length={questionSize} aria-live="polite">
          {currentQuestion.questionText}
        </div>

        <label className="answer-label" htmlFor="answer-input">
          답을 써 보세요
        </label>
        <p className="answer-hint">{answerHint}</p>
        <input
          ref={inputRef}
          id="answer-input"
          className="answer-input"
          inputMode={answerHint.includes("분수") ? "text" : "decimal"}
          type="text"
          value={inputValue}
          disabled={hasCheckedAnswer}
          onChange={(event) => updateInputValue(event.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={submitWithEnter}
          aria-describedby={feedback ? "quiz-feedback" : undefined}
        />

        {!hasCheckedAnswer && (
          <button className="primary-action" type="submit">
            확인
          </button>
        )}

        {feedback && (
          <div
            id="quiz-feedback"
            className="feedback-block"
            data-kind={feedback.kind}
            role="status"
            aria-live="polite"
          >
            <p className="feedback-title">{feedback.title}</p>
            {feedback.detail && <p className="feedback-detail">{feedback.detail}</p>}
            {hasCheckedAnswer && (
              <p className="feedback-explanation">{currentQuestion.explanation}</p>
            )}
            {hasCheckedAnswer && (
              <button className="primary-action" type="button" onClick={goNext}>
                {isLastQuestion ? "결과 보기" : "다음 문제"}
              </button>
            )}
          </div>
        )}
      </form>
    </section>
  );
}
