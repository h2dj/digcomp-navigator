"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { assessmentQuestions, responseScale } from "@/data/digcomp";
import { buildAssessmentResult, clearAssessmentDraft, saveResult, storageKeys, type AnswerMap } from "@/lib/scoring";
import { pushUserDataToServer } from "@/lib/user-sync";

type Phase = "intro" | "questions";

const areaIcons: Record<string, string> = {
  "information-data": "🔍",
  "communication-collaboration": "💬",
  "content-creation": "✏️",
  safety: "🛡️",
  "problem-solving": "💡",
};

export default function DiagnosisPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [maxVisitedIndex, setMaxVisitedIndex] = useState(0);
  const [wentBack, setWentBack] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const shouldResetScroll = useRef(false);
  const skipDraftPersist = useRef(false);
  const totalQuestions = assessmentQuestions.length;
  const currentQuestion = assessmentQuestions[questionIndex];
  const answeredCount = assessmentQuestions.filter((question) => answers[question.id] !== undefined).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  useEffect(() => {
    const rawAnswers = window.localStorage.getItem(storageKeys.draftAnswers);
    const rawIndex = window.localStorage.getItem(storageKeys.draftQuestionIndex);

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
        clearAssessmentDraft();
        return;
      }

      setAnswers(parsedAnswers);

      const savedIndex = rawIndex ? Number.parseInt(rawIndex, 10) : 0;
      const firstUnanswered = assessmentQuestions.findIndex((question) => parsedAnswers[question.id] === undefined);
      const resumeIndex = firstUnanswered >= 0 ? firstUnanswered : Math.min(savedIndex, totalQuestions - 1);
      const restoredMaxVisited =
        firstUnanswered >= 0 ? firstUnanswered : Math.max(resumeIndex, totalQuestions - 1);

      setQuestionIndex(resumeIndex);
      setMaxVisitedIndex(restoredMaxVisited);
      setWentBack(false);
      setPhase("questions");
    } catch {
      clearAssessmentDraft();
    }
  }, [totalQuestions, pathname]);

  useEffect(() => {
    if (phase !== "questions" || skipDraftPersist.current) return;
    window.localStorage.setItem(storageKeys.draftAnswers, JSON.stringify(answers));
    window.localStorage.setItem(storageKeys.draftQuestionIndex, String(questionIndex));
  }, [answers, questionIndex, phase]);

  useLayoutEffect(() => {
    if (!shouldResetScroll.current) return;
    shouldResetScroll.current = false;
    resetPageScroll();
  }, [questionIndex, phase]);

  function startAssessment() {
    clearAssessmentDraft();
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
    clearAssessmentDraft();
    const result = buildAssessmentResult(nextAnswers);
    saveResult(result);
    void pushUserDataToServer({ result });
    router.push("/results");
  }

  function selectAnswer(value: number) {
    const question = assessmentQuestions[questionIndex];
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
    const question = assessmentQuestions[questionIndex];
    if (questionIndex === totalQuestions - 1 && answers[question.id] !== undefined) {
      completeAssessment(answers);
      return;
    }
    if (questionIndex >= maxVisitedIndex) return;
    shouldResetScroll.current = true;
    setQuestionIndex((index) => index + 1);
  }

  const isLastQuestion = questionIndex === totalQuestions - 1;
  const hasCurrentAnswer = answers[currentQuestion.id] !== undefined;
  const showNext =
    wentBack &&
    (questionIndex < maxVisitedIndex || (isLastQuestion && hasCurrentAnswer && maxVisitedIndex === totalQuestions - 1));

  function goToPrevious() {
    if (questionIndex === 0) return;
    shouldResetScroll.current = true;
    setWentBack(true);
    setQuestionIndex((index) => index - 1);
  }

  function resetAssessment() {
    clearAssessmentDraft();
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
        <div className="intro-icon" aria-hidden="true">
          ✓
        </div>
        <h1>디지털 역량 진단</h1>
        <p className="intro-lead">총 15개의 간단한 질문으로 구성되어 있어요.</p>
        <p className="intro-copy">
          <strong>정답은 없어요.</strong> 지금 내 상황을 솔직하게 체크하면 됩니다. 약 5분 정도 걸려요.
        </p>

        <div className="intro-stats">
          <article className="intro-stat-card">
            <strong>5개 역량 영역</strong>
            <span>DigComp 3.0 기반</span>
          </article>
          <article className="intro-stat-card">
            <strong>15개 질문</strong>
            <span>영역당 3문항</span>
          </article>
          <article className="intro-stat-card">
            <strong>즉시 결과 확인</strong>
            <span>대시보드 저장</span>
          </article>
        </div>

        <button className="button intro-start" type="button" onClick={startAssessment}>
          진단 시작하기
        </button>
      </section>
    );
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
