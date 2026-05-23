import {
  GRADES,
  OPERATIONS,
  TIERS,
  getGrade,
  getOperation,
  getTier,
  isModeAvailableForGrade,
  normalizeModeForGrade,
} from "../lib/gradeRules.js";
import ShareButton from "./ShareButton.jsx";

function getUnavailableOperationMessage(operationId, gradeId) {
  if ((operationId === "fraction" || operationId === "decimal") && gradeId <= 2) {
    return "3학년부터";
  }

  return `${gradeId}학년에서는 아직 안 해요`;
}

export default function StartScreen({ settings, onChange, onStart }) {
  const grade = getGrade(settings.grade);
  const tier = getTier(settings.tier);
  const operation = getOperation(settings.mode);

  function changeGrade(nextGrade) {
    onChange({
      ...settings,
      grade: nextGrade,
      mode: normalizeModeForGrade(settings.mode, nextGrade),
    });
  }

  return (
    <section className="screen start-screen" aria-labelledby="start-title">
      <div className="start-hero">
        <div className="hero-meta">
          <div className="hero-brand" aria-label="루돌프쌤 로고">
            <img
              className="hero-brand-image"
              src={`${import.meta.env.BASE_URL}rudolph-logo.png`}
              alt=""
              aria-hidden="true"
            />
            <span className="hero-brand-title">루돌프쌤</span>
          </div>
          <p className="screen-kicker">10문제 연산 게임</p>
        </div>
        <div className="hero-badge" aria-hidden="true">
          +
        </div>
        <h1 id="start-title">초등 연산 놀이터</h1>
        <p className="screen-copy">학년과 수준을 고르고 10문제를 풀어보세요</p>
      </div>

      <section className="choice-section" aria-labelledby="grade-title">
        <div className="section-heading">
          <span className="step-dot">1</span>
          <h2 id="grade-title">학년을 골라요</h2>
        </div>
        <div className="choice-grid grade-grid">
          {GRADES.map((item) => (
            <button
              className="choice-button grade-button"
              data-selected={settings.grade === item.id}
              key={item.id}
              type="button"
              onClick={() => changeGrade(item.id)}
              aria-pressed={settings.grade === item.id}
            >
              <span className="choice-label">{item.label}</span>
              <span className="choice-helper">{item.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="choice-section" aria-labelledby="tier-title">
        <div className="section-heading">
          <span className="step-dot">2</span>
          <h2 id="tier-title">수준을 골라요</h2>
        </div>
        <div className="choice-grid tier-grid">
          {TIERS.map((item) => (
            <button
              className="choice-button tier-button"
              data-selected={settings.tier === item.id}
              key={item.id}
              type="button"
              onClick={() => onChange({ ...settings, tier: item.id })}
              aria-pressed={settings.tier === item.id}
            >
              <span className="choice-label">{item.label}</span>
              <span className="choice-helper">{item.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="choice-section" aria-labelledby="operation-title">
        <div className="section-heading">
          <span className="step-dot">3</span>
          <h2 id="operation-title">어떤 연습을 해볼까요?</h2>
        </div>
        <div className="choice-grid operation-grid">
          {OPERATIONS.map((item) => {
            const isAvailable = isModeAvailableForGrade(item.id, settings.grade);

            return (
              <button
                className="choice-button"
                data-selected={settings.mode === item.id}
                key={item.id}
                type="button"
                onClick={() => onChange({ ...settings, mode: item.id })}
                aria-pressed={settings.mode === item.id}
                disabled={!isAvailable}
              >
                <span className="choice-symbol">{item.symbol}</span>
                <span className="choice-label">{item.label}</span>
                <span className="choice-helper">
                  {isAvailable ? item.helper : getUnavailableOperationMessage(item.id, settings.grade)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="start-actions">
        <button className="primary-action start-button" type="button" onClick={() => onStart(settings)}>
          {grade.label} · {tier.label} · {operation.label} 시작하기
        </button>
        <ShareButton settings={settings} />
      </div>
    </section>
  );
}
