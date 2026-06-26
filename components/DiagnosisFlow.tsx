"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { AssessmentQuestionConfig, ResponseScaleItem } from "@/lib/assessment-defaults";
import type { AnswerMap } from "@/lib/scoring";

type Phase = "intro" | "questions";

const areaIcons: Record<string, string> = {
  "information-data": "🔍",
  "communication-collaboration": "💬",
  "content-creation": "✏️",
  safety: "🛡️",
  "problem-solving": "💡",
};

type DiagnosisFlowProps = {
  intro: ReactNode;
  questions: AssessmentQuestionConfig[];
  responseScale: ResponseScaleItem[];
  draftAnswersKey: string;
  draftIndexKey: string;
  onClearDraft: () => void;
  onComplete: (answers: AnswerMap) => void;
  resumeKey?: string;
};

export function DiagnosisFlow({
  intro,
  questions,
  responseScale,
  draftAnswersKey,
  draftIndexKey,
  onClearDraft,
  onComplete,
  resumeKey = "default",
}: DiagnosisFlowProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);
  const [wentBack, setWentBack] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const shouldResetScroll = useRef(false);
  const skipDraftPersist = useRef(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[questionIndex];
  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  useEffect(() => {
    const rawAnswers = window.localStorage.getItem(draftAnswersKey);
    const rawIndex = window.localStorage.getItem(draftIndexKey);

    if (!rawAnswers) {
      setAnswers({});
      setQuestionIndex(0);
      setMaxVisitedIndex(0);
      setWentBack(false);
      setPhase("intro");
      skipDraftPersist.current = false;
      return;
    }

    try {
      const parsedAnswers = JSON.parse(rawAnswers) as AnswerMap;
      if (Object.keys(parsedAnswers).length === 0) {
        onClearDraft();
        return;
      }

      setAnswers(parsedAnswers);

      const savedIndex = rawIndex ? Number.parseInt(rawIndex, 10) : 0;
      const firstUnanswered = questions.findIndex((question) => parsedAnswers[question.id] === undefined);
      const resumeIndex = firstUnanswered >= 0 ? firstUnanswered : Math.min(savedIndex, totalQuestions - 1);
      const restoredMaxVisited =
        firstUnanswered >= 0 ? firstUnanswered : Math.max(resumeIndex, totalQuestions - 1);

      setQuestionIndex(resumeIndex);
      setMaxVisitedIndex(restoredMaxVisited);
      setWentBack(false);
      setPhase("questions");
    } catch {
      onClearDraft();
    }
  }, [totalQuestions, resumeKey, draftAnswersKey, draftIndexKey, onClearDraft, questions]);

  useEffect(() => {
    if (phase !== "questions" || skipDraftPersist.current) return;
    window.localStorage.setItem(draftAnswersKey, JSON.stringify(answers));
    window.localStorage.setItem(draftIndexKey, String(questionIndex));
  }, [answers, questionIndex, phase, draftAnswersKey, draftIndexKey]);

  useLayoutEffect(() => {
    if (!shouldResetScroll.current) return;
    shouldResetScroll.current = false;
    resetPageScroll();
  }, [questionIndex, phase]);

  function startAssessment() {
    onClearDraft();
    skipDraftPersist.current = false;
    shouldResetScroll.current = true;
    setAnswers({});
    setPhase("questions");
    setQuestionIndex(0);
    setMaxVisitedIndex(0);
    setWentBack(false);
  }

  function completeAssessment(nextAnswers: AnswerMap) {
    skipDraftPersist.current = true;
    onClearDraft();
    onComplete(nextAnswers);
  }

  function selectAnswer(value: number) {
    const question = questions[questionIndex];
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (questionIndex < totalQuestions - 1) {
      shouldResetScroll.current = true;
      const nextIndex = questionIndex + 1;
      window.setTimeout(() => {
        setQuestionIndex(nextIndex);
        setMaxVisitedIndex((index) => Math.max(index, nextIndex));
      }, 180);
      return;
    }

    completeAssessment(nextAnswers);
  }

  function goToNext() {
    const question = questions[questionIndex];
    if (questionIndex === totalQuestions - 1 && answers[question.id] !== undefined) {
      completeAssessment(answers);
      return;
    }
    if (questionIndex >= maxVisitedIndex) return;
    shouldResetScroll.current = true;
    setQuestionIndex((index) => index + 1);
  }

  const isLastQuestion = questionIndex === totalQuestions - 1;
  const hasCurrentAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const showNext =
    wentBack &&
    (questionIndex < maxVisitedIndex ||
      (isLastQuestion && hasCurrentAnswer && maxVisitedIndex === totalQuestions - 1));

  function goToPrevious() {
    if (questionIndex === 0) return;
    shouldResetScroll.current = true;
    setWentBack(true);
    setQuestionIndex((index) => index - 1);
  }

  function resetAssessment() {
    onClearDraft();
    skipDraftPersist.current = false;
    setAnswers({});
    setQuestionIndex(0);
    setMaxVisitedIndex(0);
    setWentBack(false);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <section className="diagnosis-intro">
        {intro}
        <button className="button intro-start" type="button" onClick={startAssessment}>
          진단 시작하기
        </button>
      </section>
    );
  }

  if (!currentQuestion) {
    return <p className="muted">진단 문항을 불러오는 중...</p>;
  }

  return (
    <section className="diagnosis-shell" aria-live="polite">
      <article className="question-panel">
        <div className="question-header">
          <div className="question-meta">
            <span aria-hidden="true">{areaIcons[currentQuestion.areaId] ?? "📋"}</span>
            <span>{currentQuestion.categoryLabel}</span>
          </div>
          <span className="question-counter">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="progress-track" aria-label={`전체 진행률 ${progress}%`}>
          <div className="progress-bar" style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }} />
        </div>

        <p className="question-area">{currentQuestion.areaTitle}</p>
        <h2 className="question-text">{currentQuestion.prompt}</h2>

        <div className="scale" role="radiogroup" aria-label={currentQuestion.prompt}>
          {responseScale.map((scale) => (
            <label key={scale.value}>
              <input
                type="radio"
                name={currentQuestion.id}
                value={scale.value}
                checked={answers[currentQuestion.id] === scale.value}
                onClick={() => selectAnswer(scale.value)}
              />
              <span className="scale-number">{scale.value}</span>
              <strong>{scale.label}</strong>
            </label>
          ))}
        </div>
      </article>

      <div className="diagnosis-nav">
        <button className="text-button nav-start" type="button" onClick={resetAssessment}>
          처음으로
        </button>
        <button className="text-button nav-center" type="button" disabled={questionIndex === 0} onClick={goToPrevious}>
          &lt; 이전
        </button>
        {showNext ? (
          <button className="text-button nav-end" type="button" onClick={goToNext}>
            다음 &gt;
          </button>
        ) : (
          <span className="nav-end" aria-hidden="true" />
        )}
      </div>
    </section>
  );
}

function resetPageScroll() {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  const scrollingElement = document.scrollingElement ?? document.documentElement;

  document.documentElement.style.scrollBehavior = "auto";
  scrollingElement.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
}
