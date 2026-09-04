"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
import { InterestTagPicker } from "@/components/InterestTagPicker";
import { getDigitalTypeDefinition, isDigitalTypeId, type DigitalTypeId } from "@/data/digital-types";
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

type FlowStep = "loading" | "interest" | "questions";

export default function BasicDiagnosisPage() {
  const router = useRouter();
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(() => getDefaultAssessmentConfig());
  const [step, setStep] = useState<FlowStep>("loading");
  const [interestTagId, setInterestTagId] = useState<InterestTagId>(defaultInterestTagId);
  const [miniTestTypeId, setMiniTestTypeId] = useState<DigitalTypeId | null>(null);
  const [liveAnswers, setLiveAnswers] = useState<AnswerMap>({});

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
    setInterestTagId(savedInterest && isInterestTagId(savedInterest) ? savedInterest : defaultInterestTagId);
    setStep("questions");
  }, []);

  useEffect(() => {
    const savedMiniTestType = window.localStorage.getItem(storageKeys.miniTestResultType);
    if (savedMiniTestType && isDigitalTypeId(savedMiniTestType)) {
      setMiniTestTypeId(savedMiniTestType);
    }
  }, []);

  const handleInterestSelected = useCallback((tagId: InterestTagId) => {
    window.localStorage.setItem(storageKeys.draftInterestTag, tagId);
    setInterestTagId(tagId);
    setStep("questions");
  }, []);

  const questions = useMemo(
    () => personalizeQuestions(assessmentConfig.questions, interestTagId),
    [assessmentConfig.questions, interestTagId],
  );

  // 지금까지 답변한 내용을 기준으로 실시간으로 예상 유형을 계산한다(참고용, 응답이 늘수록 정확해짐).
  const liveDigitalType = useMemo(() => {
    if (Object.keys(liveAnswers).length === 0) return null;
    return buildAssessmentResult(liveAnswers, { assessmentType: "basic" }).digitalType ?? null;
  }, [liveAnswers]);

  const contextBadges = useMemo(() => {
    const badges: { label: string; value: string }[] = [];
    if (interestTagId !== "general") {
      badges.push({ label: "관심분야", value: getInterestTagLabel(interestTagId) });
    }
    if (liveDigitalType) {
      badges.push({
        label: "지금까지 답변 기준 예상 유형",
        value: getDigitalTypeDefinition(liveDigitalType.typeId).name,
      });
    } else if (miniTestTypeId) {
      badges.push({ label: "미니 테스트 결과", value: getDigitalTypeDefinition(miniTestTypeId).name });
    }
    return badges;
  }, [interestTagId, liveDigitalType, miniTestTypeId]);

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
        {interestTagId !== "general" ? (
          <p className="intro-copy">
            <strong>{getInterestTagLabel(interestTagId)}</strong> 분야에 와닿는 예시로 일부 문항을 다듬었어요.
          </p>
        ) : null}
        {miniTestTypeId ? (
          <p className="intro-copy">
            미니 테스트 결과는 <strong>{getDigitalTypeDefinition(miniTestTypeId).name}</strong>였어요. 정식 진단으로
            더 정확하게 확인해봐요.
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
            <span>디지털 유형 · 심층 진단 안내</span>
          </article>
        </div>
        <button type="button" className="text-button type-picker-skip" onClick={() => setStep("interest")}>
          관심 분야 다시 선택하기
        </button>
      </>
    ),
    [questions.length, interestTagId, miniTestTypeId],
  );

  function handleComplete(answers: AnswerMap) {
    const result = buildAssessmentResult(answers, {
      assessmentType: "basic",
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
      contextBadges={contextBadges}
      onAnswersChange={setLiveAnswers}
    />
  );
}
