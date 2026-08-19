"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
import { DigitalTypePicker } from "@/components/DigitalTypePicker";
import { InterestTagPicker } from "@/components/InterestTagPicker";
import { getAssessmentQuestionsForType } from "@/data/type-tailored-assessment";
import { getDigitalTypeDefinition, type DigitalTypeId } from "@/data/digital-types";
import { defaultInterestTagId, getInterestTagLabel, isInterestTagId, type InterestTagId } from "@/data/interest-tags";
import { personalizeQuestions } from "@/data/question-example-variants";
import { getDefaultAssessmentConfig, type AssessmentConfig } from "@/lib/assessment-defaults";
import { trackAssessmentComplete } from "@/lib/analytics";
import {
  buildAssessmentResult,
  clearAssessmentDraft,
  saveResult,
  storageKeys,
  type AnswerMap,
} from "@/lib/scoring";
import { pushUserDataToServer } from "@/lib/user-sync";

type FlowStep = "loading" | "interest" | "type" | "questions";

export default function BasicDiagnosisPage() {
  const router = useRouter();
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(() => getDefaultAssessmentConfig());
  const [step, setStep] = useState<FlowStep>("loading");
  const [interestTagId, setInterestTagId] = useState<InterestTagId>(defaultInterestTagId);
  const [typeId, setTypeId] = useState<DigitalTypeId | null>(null);

  useEffect(() => {
    void fetch("/api/assessment-config")
      .then((response) => response.json())
      .then((data: AssessmentConfig) => {
        if (Array.isArray(data.questions) && Array.isArray(data.responseScale)) {
          setAssessmentConfig(data);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const hasDraft = Boolean(window.localStorage.getItem(storageKeys.draftAnswers));
    if (!hasDraft) {
      setStep("interest");
      return;
    }

    const savedInterest = window.localStorage.getItem(storageKeys.draftInterestTag);
    const savedType = window.localStorage.getItem(storageKeys.draftBasicType);
    setInterestTagId(savedInterest && isInterestTagId(savedInterest) ? savedInterest : defaultInterestTagId);
    setTypeId(savedType && savedType !== "null" ? (savedType as DigitalTypeId) : null);
    setStep("questions");
  }, []);

  const handleInterestSelected = useCallback((tagId: InterestTagId) => {
    window.localStorage.setItem(storageKeys.draftInterestTag, tagId);
    setInterestTagId(tagId);
    setStep("type");
  }, []);

  const handleTypeSelected = useCallback((selected: DigitalTypeId | null) => {
    window.localStorage.setItem(storageKeys.draftBasicType, selected ?? "null");
    setTypeId(selected);
    setStep("questions");
  }, []);

  // T7(전략가)은 특정 핵심 역량이 없어 기존 기본 문항 구성과 동일하므로 별도 처리가 필요 없다.
  const usesTailoredQuestions = Boolean(typeId && typeId !== "T7");

  const questions = useMemo(() => {
    const base = usesTailoredQuestions && typeId ? getAssessmentQuestionsForType(typeId) : assessmentConfig.questions;
    return personalizeQuestions(base, interestTagId);
  }, [usesTailoredQuestions, typeId, assessmentConfig.questions, interestTagId]);

  const intro = useMemo(
    () => (
      <>
        <div className="intro-icon" aria-hidden="true">
          ✓
        </div>
        <h1>기본 진단</h1>
        <p className="intro-lead">총 {questions.length}개의 간단한 질문으로 구성되어 있어요.</p>
        <p className="intro-copy">
          <strong>정답은 없어요.</strong> 지금 내 상황을 솔직하게 체크하면 됩니다. 약 5분 정도 걸려요.
        </p>
        {usesTailoredQuestions && typeId ? (
          <p className="intro-copy">
            <strong>{getDigitalTypeDefinition(typeId).name}</strong> 유형과 관련 있는 역량 위주로 문항을
            구성했어요.
          </p>
        ) : null}
        {interestTagId !== "general" ? (
          <p className="intro-copy">
            <strong>{getInterestTagLabel(interestTagId)}</strong> 분야에 와닿는 예시로 일부 문항을 다듬었어요.
          </p>
        ) : null}
        <div className="intro-stats">
          <article className="intro-stat-card">
            <strong>5개 역량 영역</strong>
            <span>DigComp 3.0 기반</span>
          </article>
          <article className="intro-stat-card">
            <strong>{questions.length}개 질문</strong>
            <span>영역당 3문항</span>
          </article>
          <article className="intro-stat-card">
            <strong>즉시 결과 확인</strong>
            <span>심층 진단 안내</span>
          </article>
        </div>
        <button type="button" className="text-button type-picker-skip" onClick={() => setStep("interest")}>
          관심 분야·유형 다시 선택하기
        </button>
      </>
    ),
    [questions.length, usesTailoredQuestions, typeId, interestTagId],
  );

  function handleComplete(answers: AnswerMap) {
    const result = buildAssessmentResult(answers, {
      assessmentType: "basic",
      selectedTypeId: typeId,
      selectedInterestTagId: interestTagId === "general" ? null : interestTagId,
    });
    trackAssessmentComplete("basic", { level: result.level, overallScore: result.overallScore });
    saveResult(result);
    void pushUserDataToServer({ result });
    router.push("/results");
  }

  if (step === "loading") {
    return null;
  }

  if (step === "interest") {
    return <InterestTagPicker onSelect={handleInterestSelected} />;
  }

  if (step === "type") {
    return <DigitalTypePicker onSelect={handleTypeSelected} />;
  }

  return (
    <DiagnosisFlow
      intro={intro}
      questions={questions}
      responseScale={assessmentConfig.responseScale}
      draftAnswersKey={storageKeys.draftAnswers}
      draftIndexKey={storageKeys.draftQuestionIndex}
      onClearDraft={clearAssessmentDraft}
      onComplete={handleComplete}
      resumeKey="basic"
      analytics={{ assessmentType: "basic" }}
    />
  );
}
