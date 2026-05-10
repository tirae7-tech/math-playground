import { useEffect, useRef, useState } from "react";
import { getDifficulty, getOperation } from "../lib/difficultyRules.js";

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
  const inputRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isRetryMode = quizKind === "retryWrong";
  const operation = getOperation(settings.mode);
  const difficulty = getDifficulty(settings.level);
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const progressText = `${isRetryMode ? "다시 풀기" : "문제"} ${currentIndex + 1} / ${questions.length}`;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasCheckedAnswer = feedback?.kind === "correct" || feedback?.kind === "try-again";

  useEffect(() => {
    inputRef.current?.focus();
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

    const numericAnswer = Number(trimmedInput);
    const isCorrect = numericAnswer === currentQuestion.answer;
    const answerRecord = {
      questionId: currentQuestion.id,
      problem: currentQuestion.questionText,
      prompt: currentQuestion.prompt,
      questionText: currentQuestion.questionText,
      userAnswer: trimmedInput,
      givenAnswer: trimmedInput,
      correctAnswer: currentQuestion.answer,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
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
            detail: `괜찮아요, 정답은 ${currentQuestion.answer}예요.`,
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
  }

  function updateInputValue(nextValue) {
    setInputValue(nextValue.replace(/[^0-9]/g, ""));

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
    <section className="screen quiz-screen" aria-labelledby="quiz-title">
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
            {isRetryMode ? "틀린 문제 다시 풀기" : `${operation.label} · ${difficulty.label}`}
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
        <div className="question-text" aria-live="polite">
          {currentQuestion.questionText}
        </div>

        <label className="answer-label" htmlFor="answer-input">
          답을 써 보세요
        </label>
        <input
          ref={inputRef}
          id="answer-input"
          className="answer-input"
          inputMode="numeric"
          pattern="[0-9]*"
          type="text"
          value={inputValue}
          disabled={hasCheckedAnswer}
          onChange={(event) => updateInputValue(event.target.value)}
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
