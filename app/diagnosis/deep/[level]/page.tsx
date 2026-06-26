"use client";

import Link from "next/link";
import { useMemo, useCallback } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { CONSULTING_URL, deepAssessmentMeta, getDeepAssessmentQuestions, isProficiencyLevel } from "@/data/deep-assessment";
import { responseScale } from "@/data/digcomp";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";
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

  if (!isProficiencyLevel(levelParam)) {
    notFound();
  }

  const level = levelParam as ProficiencyLevel;
  const basicResult = getLatestBasicResult();
  const meta = deepAssessmentMeta[level];
  const questions = useMemo(() => getDeepAssessmentQuestions(level), [level]);
  const draftKeys = getDeepDraftKeys(level);
  const onClearDraft = useCallback(() => clearDeepAssessmentDraft(level), [level]);

  const intro = useMemo(
    () => (
      <>
        <div className="intro-icon" aria-hidden="true">
          ◎
        </div>
        <h1>{meta.title}</h1>
        <p className="intro-lead">{meta.lead}</p>
        <p className="intro-copy">
          <strong>21개 역량 전체</strong>를 점검하는 심층 진단입니다. {meta.duration} 정도 걸려요.
        </p>
        <div className="intro-stats">
          <article className="intro-stat-card">
            <strong>21개 역량</strong>
            <span>5개 영역 전체</span>
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
    [level, meta],
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
    const result = buildAssessmentResult(answers, { assessmentType: "deep", deepLevel: level });
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
        questions={questions}
        responseScale={responseScale.map((item) => ({ ...item }))}
        draftAnswersKey={draftKeys.answers}
        draftIndexKey={draftKeys.questionIndex}
        onClearDraft={onClearDraft}
        onComplete={handleComplete}
        resumeKey={`deep-${level}`}
      />
    </>
  );
}
