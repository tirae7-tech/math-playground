import { getDifficulty, getOperation, LEVELS, OPERATIONS } from "../lib/difficultyRules.js";
import ShareButton from "./ShareButton.jsx";

export default function StartScreen({ settings, onChange, onStart }) {
  const operation = getOperation(settings.mode);
  const difficulty = getDifficulty(settings.level);

  return (
    <section className="screen start-screen" aria-labelledby="start-title">
      <div className="start-hero">
        <div className="hero-badge" aria-hidden="true">
          +
        </div>
        <p className="screen-kicker">10문제 사칙연산 게임</p>
        <h1 id="start-title">사칙연산 놀이터</h1>
        <p className="screen-copy">10문제를 풀고 별을 모아보세요</p>
      </div>

      <section className="choice-section" aria-labelledby="operation-title">
        <div className="section-heading">
          <span className="step-dot">1</span>
          <h2 id="operation-title">어떤 연산을 해볼까요?</h2>
        </div>
        <div className="choice-grid operation-grid">
          {OPERATIONS.map((item) => (
            <button
              className="choice-button"
              data-selected={settings.mode === item.id}
              key={item.id}
              type="button"
              onClick={() => onChange({ ...settings, mode: item.id })}
              aria-pressed={settings.mode === item.id}
            >
              <span className="choice-symbol">{item.symbol}</span>
              <span className="choice-label">{item.label}</span>
              <span className="choice-helper">{item.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="choice-section" aria-labelledby="difficulty-title">
        <div className="section-heading">
          <span className="step-dot">2</span>
          <h2 id="difficulty-title">난이도를 골라요</h2>
        </div>
        <div className="choice-grid difficulty-grid">
          {LEVELS.map((item) => (
            <button
              className="choice-button difficulty-button"
              data-selected={settings.level === item.id}
              key={item.id}
              type="button"
              onClick={() => onChange({ ...settings, level: item.id })}
              aria-pressed={settings.level === item.id}
            >
              <span className="choice-label">{item.label}</span>
              <span className="choice-helper">{item.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="start-actions">
        <button className="primary-action start-button" type="button" onClick={() => onStart(settings)}>
          {operation.label} · {difficulty.label} 시작하기
        </button>
        <ShareButton settings={settings} />
      </div>
    </section>
  );
}
