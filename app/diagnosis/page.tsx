"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
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

export default function BasicDiagnosisPage() {
  const router = useRouter();
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(() => getDefaultAssessmentConfig());

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

  const intro = useMemo(
    () => (
      <>
        <div className="intro-icon" aria-hidden="true">
          ✓
        </div>
        <h1>기본 진단</h1>
        <p className="intro-lead">총 {assessmentConfig.questions.length}개의 간단한 질문으로 구성되어 있어요.</p>
        <p className="intro-copy">
          <strong>정답은 없어요.</strong> 지금 내 상황을 솔직하게 체크하면 됩니다. 약 5분 정도 걸려요.
        </p>
        <div className="intro-stats">
          <article className="intro-stat-card">
            <strong>5개 역량 영역</strong>
            <span>DigComp 3.0 기반</span>
          </article>
          <article className="intro-stat-card">
            <strong>{assessmentConfig.questions.length}개 질문</strong>
            <span>영역당 3문항</span>
          </article>
          <article className="intro-stat-card">
            <strong>즉시 결과 확인</strong>
            <span>심층 진단 안내</span>
          </article>
        </div>
      </>
    ),
    [assessmentConfig.questions.length],
  );

  function handleComplete(answers: AnswerMap) {
    const result = buildAssessmentResult(answers, { assessmentType: "basic" });
    trackAssessmentComplete("basic", { level: result.level, overallScore: result.overallScore });
    saveResult(result);
    void pushUserDataToServer({ result });
    router.push("/results");
  }

  return (
    <DiagnosisFlow
      intro={intro}
      questions={assessmentConfig.questions}
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
