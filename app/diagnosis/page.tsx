"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { digcompAreas, responseScale } from "@/data/digcomp";
import { buildAssessmentResult, saveResult, storageKeys, type AnswerMap } from "@/lib/scoring";

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const currentArea = digcompAreas[step];
  const totalQuestions = useMemo(
    () => digcompAreas.reduce((sum, area) => sum + area.competencies.reduce((inner, item) => inner + item.prompts.length, 0), 0),
    [],
  );
  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKeys.draftAnswers);
    if (!raw) return;

    try {
      setAnswers(JSON.parse(raw) as AnswerMap);
    } catch {
      window.localStorage.removeItem(storageKeys.draftAnswers);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.draftAnswers, JSON.stringify(answers));
  }, [answers]);

  const currentKeys = currentArea.competencies.flatMap((competency) =>
    competency.prompts.map((_, index) => `${competency.id}:${index}`),
  );
  const isCurrentComplete = currentKeys.every((key) => answers[key]);
  const isLastStep = step === digcompAreas.length - 1;

  function updateAnswer(key: string, value: number) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function moveToStep(nextStep: number) {
    setStep(nextStep);
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }

  function completeAssessment() {
    const result = buildAssessmentResult(answers);
    saveResult(result);
    router.push("/results");
  }

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Assessment</span>
        <h1>디지털 역량 진단하기</h1>
        <p>
          각 문장을 읽고 “얼마나 자신 있게 할 수 있나요?”에 답해주세요. 5개 영역을 순서대로 진행하며,
          현재 브라우저에 중간 응답이 저장됩니다.
        </p>
      </section>

      <section className="diagnosis-shell" aria-live="polite">
        <div className="progress-track" aria-label={`전체 진행률 ${progress}%`}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="muted">
          {step + 1} / {digcompAreas.length} 영역 · 전체 {progress}% 완료
        </p>

        <div className="card">
          <span className="area-number">{currentArea.number}</span>
          <h2>{currentArea.title}</h2>
          <p>{currentArea.summary}</p>
          <p className="muted">{currentArea.nonprofitContext}</p>
        </div>

        {currentArea.competencies.map((competency) => (
          <div className="question-card" key={competency.id}>
            <h3>{competency.title}</h3>
            <p className="muted">{competency.description}</p>
            {competency.prompts.map((prompt, promptIndex) => {
              const key = `${competency.id}:${promptIndex}`;

              return (
                <fieldset className="question-card" key={key}>
                  <legend>{prompt}</legend>
                  <div className="scale">
                    {responseScale.map((scale) => (
                      <label key={scale.value}>
                        <input
                          type="radio"
                          name={key}
                          value={scale.value}
                          checked={answers[key] === scale.value}
                          onChange={() => updateAnswer(key, scale.value)}
                        />
                        <strong>{scale.label}</strong>
                        <small>{scale.helper}</small>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        ))}

        <div className="cta-row">
          <button className="button secondary" type="button" disabled={step === 0} onClick={() => moveToStep(step - 1)}>
            이전 영역
          </button>
          {!isLastStep ? (
            <button className="button" type="button" disabled={!isCurrentComplete} onClick={() => moveToStep(step + 1)}>
              다음 영역
            </button>
          ) : (
            <button className="button" type="button" disabled={!isCurrentComplete} onClick={completeAssessment}>
              결과 보기
            </button>
          )}
          <button
            className="button ghost"
            type="button"
            onClick={() => {
              setAnswers({});
              window.localStorage.removeItem(storageKeys.draftAnswers);
            }}
          >
            응답 초기화
          </button>
        </div>
      </section>
    </>
  );
}
