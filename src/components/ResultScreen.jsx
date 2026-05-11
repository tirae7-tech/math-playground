import { getGrade, getOperation, getTier } from "../lib/gradeRules.js";

function getResultSummary(correctCount) {
  if (correctCount === 10) {
    return {
      stars: "★★★★★",
      message: "완벽해요! 오늘의 계산왕이에요!",
    };
  }

  if (correctCount >= 8) {
    return {
      stars: "★★★★☆",
      message: "아주 잘했어요! 조금만 더 하면 완벽해요.",
    };
  }

  if (correctCount >= 6) {
    return {
      stars: "★★★☆☆",
      message: "좋아요! 계속 연습하면 더 빨라질 거예요.",
    };
  }

  if (correctCount >= 4) {
    return {
      stars: "★★☆☆☆",
      message: "괜찮아요. 천천히 다시 해보면 돼요.",
    };
  }

  return {
    stars: "★☆☆☆☆",
    message: "시작한 것만으로도 멋져요. 다시 한번 도전해봐요!",
  };
}

function getAnswerSkillName(answer) {
  return answer.skillName ?? answer.question?.skillName ?? "계산 연습";
}

export default function ResultScreen({ result, onRetry, onRetryWrong, onHome }) {
  const isRetryMode = result.quizKind === "retryWrong";
  const { stars, message } = getResultSummary(result.correctCount);
  const wrongAnswers = result.answers.filter((answer) => !answer.isCorrect);
  const grade = getGrade(result.settings.grade);
  const tier = getTier(result.settings.tier);
  const operation = getOperation(result.settings.mode);
  const resultTitle = isRetryMode
    ? `${grade.label} ${tier.label} 다시 풀기 결과`
    : `${grade.label} ${tier.label} 연습 결과`;

  return (
    <section className="screen result-screen" aria-labelledby="result-title">
      <div className="result-hero">
        <p className="screen-kicker">{grade.label} · {tier.label} · {operation.label}</p>
        <h2 id="result-title">{resultTitle}</h2>
        <p className="result-count">
          {isRetryMode
            ? `${result.totalCount}문제를 다시 풀었어요`
            : `${result.totalCount}문제 중 ${result.correctCount}문제 성공!`}
        </p>
        {isRetryMode ? (
          <div className="retry-summary" aria-label="다시 풀기 결과 요약">
            <div className="retry-stat">
              <span>다시 푼 문제 수</span>
              <strong>{result.totalCount}개</strong>
            </div>
            <div className="retry-stat">
              <span>다시 맞힌 문제 수</span>
              <strong>{result.correctCount}개</strong>
            </div>
            <div className="retry-stat">
              <span>아직 어려웠던 문제 수</span>
              <strong>{wrongAnswers.length}개</strong>
            </div>
          </div>
        ) : (
          <>
            <p className="star-row" aria-label={`별점 ${stars}`}>
              {stars}
            </p>
            <p className="result-message">{message}</p>
          </>
        )}
      </div>

      <section
        className="wrong-review"
        aria-label={wrongAnswers.length === 0 ? "모두 맞힌 문제 안내" : undefined}
        aria-labelledby={wrongAnswers.length > 0 ? "wrong-review-title" : undefined}
      >
        {wrongAnswers.length === 0 ? (
          <div className="perfect-note">
            <p>모두 맞혔어요!</p>
          </div>
        ) : (
          <>
            <div className="review-heading">
              <h3 id="wrong-review-title">
                {isRetryMode ? "아직 어려웠던 문제" : "다시 보면 좋은 문제"}
              </h3>
              <span>{wrongAnswers.length}개</span>
            </div>

            <ul className="wrong-list">
              {wrongAnswers.map((answer, index) => (
                <li className="wrong-card" key={answer.questionId}>
                  <div className="wrong-card-top">
                    <span className="wrong-index">{index + 1}</span>
                    <div>
                      <strong>{answer.problem ?? answer.questionText ?? `${answer.prompt} = ?`}</strong>
                      <p className="skill-tag">관련 기능: {getAnswerSkillName(answer)}</p>
                    </div>
                  </div>
                  <dl className="wrong-details">
                    <div>
                      <dt>내가 쓴 답</dt>
                      <dd>{answer.userAnswer || answer.givenAnswer || "비어 있음"}</dd>
                    </div>
                    <div>
                      <dt>정답</dt>
                      <dd>{answer.correctAnswer ?? answer.answer}</dd>
                    </div>
                  </dl>
                  <p className="wrong-explanation">{answer.explanation}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="action-row">
        {wrongAnswers.length > 0 && (
          <button className="primary-action" type="button" onClick={onRetryWrong}>
            틀린 문제 다시 풀기
          </button>
        )}
        <button className="primary-action" type="button" onClick={onRetry}>
          다시 하기
        </button>
        <button className="secondary-action" type="button" onClick={onHome}>
          처음으로
        </button>
      </div>
    </section>
  );
}
