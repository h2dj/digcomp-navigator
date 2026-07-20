"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
import { DigitalTypePicker } from "@/components/DigitalTypePicker";
import { getAssessmentQuestionsForType } from "@/data/type-tailored-assessment";
import { getDigitalTypeDefinition, type DigitalTypeId } from "@/data/digital-types";
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

type TypeChoiceState =
  | { status: "loading" }
  | { status: "picking" }
  | { status: "resolved"; typeId: DigitalTypeId | null };

export default function BasicDiagnosisPage() {
  const router = useRouter();
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(() => getDefaultAssessmentConfig());
  const [typeChoice, setTypeChoice] = useState<TypeChoiceState>({ status: "loading" });

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
      setTypeChoice({ status: "picking" });
      return;
    }

    const saved = window.localStorage.getItem(storageKeys.draftBasicType);
    setTypeChoice({ status: "resolved", typeId: saved && saved !== "null" ? (saved as DigitalTypeId) : null });
  }, []);

  const handleTypeSelected = useCallback((typeId: DigitalTypeId | null) => {
    window.localStorage.setItem(storageKeys.draftBasicType, typeId ?? "null");
    setTypeChoice({ status: "resolved", typeId });
  }, []);

  const chosenType = typeChoice.status === "resolved" ? typeChoice.typeId : null;
  // T7(전략가)은 특정 핵심 역량이 없어 기존 기본 문항 구성과 동일하므로 별도 처리가 필요 없다.
  const usesTailoredQuestions = Boolean(chosenType && chosenType !== "T7");

  const questions = useMemo(() => {
    if (usesTailoredQuestions && chosenType) {
      return getAssessmentQuestionsForType(chosenType);
    }
    return assessmentConfig.questions;
  }, [usesTailoredQuestions, chosenType, assessmentConfig.questions]);

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
        {usesTailoredQuestions && chosenType ? (
          <p className="intro-copy">
            <strong>{getDigitalTypeDefinition(chosenType).name}</strong> 유형과 관련 있는 역량 위주로 문항을
            구성했어요.
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
        <button
          type="button"
          className="text-button type-picker-skip"
          onClick={() => setTypeChoice({ status: "picking" })}
        >
          유형 다시 선택하기
        </button>
      </>
    ),
    [questions.length, usesTailoredQuestions, chosenType],
  );

  function handleComplete(answers: AnswerMap) {
    const result = buildAssessmentResult(answers, { assessmentType: "basic", selectedTypeId: chosenType });
    trackAssessmentComplete("basic", { level: result.level, overallScore: result.overallScore });
    saveResult(result);
    void pushUserDataToServer({ result });
    router.push("/results");
  }

  if (typeChoice.status === "loading") {
    return null;
  }

  if (typeChoice.status === "picking") {
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
