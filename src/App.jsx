import { useEffect, useMemo, useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { normalizeGrade, normalizeModeForGrade, normalizeTier } from "./lib/gradeRules.js";
import { generateQuiz } from "./lib/problemGenerator.js";
import { buildShareUrl, readSettingsFromSearch } from "./lib/shareSettings.js";

export default function App() {
  const initialSettings = useMemo(() => readSettingsFromSearch(window.location.search), []);
  const [screen, setScreen] = useState("start");
  const [settings, setSettings] = useState(initialSettings);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [quizKind, setQuizKind] = useState("main");

  useEffect(() => {
    if (screen !== "start") {
      return;
    }

    window.history.replaceState(null, "", buildShareUrl(settings, window.location.href));
  }, [screen, settings]);

  function startQuiz(nextSettings = settings) {
    const grade = normalizeGrade(nextSettings.grade);
    const quizSettings = {
      grade,
      tier: normalizeTier(nextSettings.tier),
      mode: normalizeModeForGrade(nextSettings.mode, grade),
    };

    setSettings(quizSettings);
    setQuestions(generateQuiz({ ...quizSettings, count: 10 }));
    setResult(null);
    setQuizKind("main");
    setScreen("quiz");
  }

  function finishQuiz(answers) {
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    setResult({
      answers,
      correctCount,
      totalCount: answers.length,
      settings,
      quizKind,
    });
    setScreen("result");
  }

  function buildRetryQuestion(answer, index) {
    if (answer.question) {
      return answer.question;
    }

    return {
      id: answer.questionId ?? `retry-${index}`,
      grade: answer.grade ?? settings.grade,
      tier: answer.tier ?? settings.tier,
      mode: answer.mode ?? settings.mode,
      symbol: answer.symbol,
      left: answer.left,
      right: answer.right,
      questionText: answer.problem ?? answer.questionText ?? `${answer.prompt} = ?`,
      prompt: answer.prompt,
      answer: answer.correctAnswer ?? answer.answer,
      explanation: answer.explanation,
      standardCodes: answer.standardCodes ?? [],
      skillName: answer.skillName ?? "다시 풀기",
    };
  }

  function startWrongAnswerQuiz(sourceResult = result) {
    const wrongAnswers = sourceResult?.answers.filter((answer) => !answer.isCorrect) ?? [];

    if (wrongAnswers.length === 0) {
      return;
    }

    setSettings(sourceResult.settings);
    setQuestions(wrongAnswers.map(buildRetryQuestion));
    setResult(null);
    setQuizKind("retryWrong");
    setScreen("quiz");
  }

  return (
    <div className="app-shell">
      {screen !== "start" && (
        <header className="app-header app-header--compact">
          <div>
            <p className="eyebrow">10문제 연산 게임</p>
            <h1>초등 연산 놀이터</h1>
          </div>
        </header>
      )}

      <main className="app-main">
        {screen === "start" && (
          <StartScreen settings={settings} onChange={setSettings} onStart={startQuiz} />
        )}

        {screen === "quiz" && (
          <QuizScreen
            questions={questions}
            settings={settings}
            quizKind={quizKind}
            onFinish={finishQuiz}
            onExit={() => setScreen("start")}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            onRetry={() => startQuiz(result.settings)}
            onRetryWrong={() => startWrongAnswerQuiz(result)}
            onHome={() => {
              setResult(null);
              setQuizKind("main");
              setScreen("start");
            }}
          />
        )}
      </main>
    </div>
  );
}
