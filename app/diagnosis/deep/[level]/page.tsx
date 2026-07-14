"use client";

import Link from "next/link";
import { useEffect, useMemo, useCallback, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import {
  CONSULTING_URL,
  deepAssessmentMeta,
  getDeepAssessmentQuestionCount,
  parseProficiencyLevel,
} from "@/data/deep-assessment";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
import { getDefaultDeepAssessmentConfig, type AssessmentConfig } from "@/lib/assessment-defaults";
import { trackAssessmentComplete } from "@/lib/analytics";
import {
  buildAssessmentResult,
  clearDeepAssessmentDraft,
  getDeepDraftKeys,
  getLatestBasicResult,
  saveResult,
  type AnswerMap,
  type ProficiencyLevel,
} from "@/lib/scoring";
import { pushUserDataToServer } from "@/lib/user-sync";

export default function DeepDiagnosisPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const levelParam = decodeURIComponent(params.level);
  const parsedLevel = parseProficiencyLevel(levelParam);

  if (!parsedLevel) {
    notFound();
  }

  const level = parsedLevel;
  const questionCount = getDeepAssessmentQuestionCount(level);
  const basicResult = getLatestBasicResult();
  const meta = deepAssessmentMeta[level];
  const draftKeys = getDeepDraftKeys(level);
  const onClearDraft = useCallback(() => clearDeepAssessmentDraft(level), [level]);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(() =>
    getDefaultDeepAssessmentConfig(level),
  );

  useEffect(() => {
    if (levelParam !== level) {
      router.replace(`/diagnosis/deep/${encodeURIComponent(level)}`);
    }
  }, [level, levelParam, router]);

  useEffect(() => {
    void fetch(`/api/assessment-config/deep/${encodeURIComponent(level)}`)
      .then((response) => response.json())
      .then((data: AssessmentConfig) => {
        if (Array.isArray(data.questions) && Array.isArray(data.responseScale)) {
          setAssessmentConfig(data);
        }
      })
      .catch(() => undefined);
  }, [level]);

  const intro = useMemo(
    () => (
      <>
        <div className="intro-icon" aria-hidden="true">
          ◎
        </div>
        <h1>{meta.title}</h1>
        <p className="intro-lead">{meta.lead}</p>
        <p className="intro-copy">
          <strong>21개 역량</strong>마다 DigComp 3.0 기반 자가평가 문항집의 실제 문항으로 점검합니다.
          총 <strong>{questionCount}문항</strong>이며 {meta.duration} 정도 걸려요.
        </p>
        <div className="intro-stats">
          <article className="intro-stat-card">
            <strong>{questionCount}문항</strong>
            <span>역량별 행동 문항</span>
          </article>
          <article className="intro-stat-card">
            <strong>{level} 수준</strong>
            <span>{meta.focus}</span>
          </article>
          <article className="intro-stat-card">
            <strong>맞춤 심층 결과</strong>
            <span>역량별 상세 점수</span>
          </article>
        </div>
      </>
    ),
    [level, meta, questionCount],
  );

  if (!basicResult) {
    return (
      <section className="diagnosis-intro">
        <div className="intro-icon" aria-hidden="true">
          !
        </div>
        <h1>기본 진단이 필요해요</h1>
        <p className="intro-lead">심층 진단은 기본 진단을 완료한 후에 받을 수 있어요.</p>
        <p className="intro-copy">
          먼저 기본 진단으로 전체 숙련도를 확인한 뒤, 해당 수준에 맞는 심층 진단을 진행해 주세요.
        </p>
        <Link className="button intro-start" href="/diagnosis">
          기본 진단 시작하기
        </Link>
      </section>
    );
  }

  function handleComplete(answers: AnswerMap) {
    const result = buildAssessmentResult(answers, {
      assessmentType: "deep",
      deepLevel: level,
      questions: assessmentConfig.questions,
    });
    trackAssessmentComplete("deep", {
      level: result.level,
      overallScore: result.overallScore,
      deepLevel: level,
    });
    saveResult(result);
    void pushUserDataToServer({ result });
    router.push("/results");
  }

  return (
    <>
      {basicResult.level !== level ? (
        <div className="notice deep-level-notice">
          기본 진단 숙련도는 <strong>{basicResult.level}</strong>입니다.{" "}
          <Link href={`/diagnosis/deep/${encodeURIComponent(basicResult.level)}`}>
            {basicResult.level} 심층 진단
          </Link>
          으로 이동하거나,{" "}
          <a href={CONSULTING_URL} target="_blank" rel="noreferrer">
            공동체IT 컨설팅
          </a>
          을 문의할 수 있어요.
        </div>
      ) : null}
      <DiagnosisFlow
        intro={intro}
        questions={assessmentConfig.questions}
        responseScale={assessmentConfig.responseScale}
        draftAnswersKey={draftKeys.answers}
        draftIndexKey={draftKeys.questionIndex}
        onClearDraft={onClearDraft}
        onComplete={handleComplete}
        resumeKey={`deep-${level}`}
        analytics={{ assessmentType: "deep", deepLevel: level }}
      />
    </>
  );
}
