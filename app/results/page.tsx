"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AreaComparisonChart, RadarScoreChart } from "@/components/ScoreCharts";
import { ResultHighlights } from "@/components/ResultHighlights";
import { ResultSharePanel } from "@/components/ResultSharePanel";
import { getDeepAssessmentQuestionCount } from "@/data/deep-assessment";
import { getLatestResult, formatScore, clearAssessmentDraft, getAssessmentType, type AssessmentResult } from "@/lib/scoring";
import { useUserDataRefresh } from "@/lib/use-user-data-refresh";

export default function ResultsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const refresh = useCallback(() => {
    setResult(getLatestResult());
  }, []);

  useUserDataRefresh(refresh);

  if (!result) {
    return (
      <>
        <section className="page-title">
          <h1>저장된 결과가 없습니다</h1>
          <p>진단을 완료하면 이곳에서 영역별 점수, 강점과 개발 필요 역량을 확인할 수 있습니다.</p>
        </section>
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            📊
          </span>
          <h2>아직 진단 결과가 없어요</h2>
          <p className="muted">진단을 완료하면 나의 역량 프로필을 확인할 수 있어요.</p>
          <Link className="button" href="/diagnosis">
            진단 시작하기 &gt;
          </Link>
        </div>
      </>
    );
  }

  const assessmentType = getAssessmentType(result);
  const isDeep = assessmentType === "deep";
  const deepQuestionCount = result.deepLevel ? getDeepAssessmentQuestionCount(result.deepLevel) : 0;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Result</span>
        <h1>{isDeep ? `${result.deepLevel} 심층 진단 결과` : "기본 진단 결과"}</h1>
        <p>
          {isDeep
            ? `역량별 지식·기술·태도 ${deepQuestionCount}문항에 대한 심층 진단 결과입니다.`
            : "5점 척도 응답을 DigComp 숙련도 0~4점으로 환산했습니다. 대시보드에서 심층 진단 안내를 확인할 수 있어요."}
        </p>
      </section>

      <section className="section compact">
        <div className="score-hero">
          <article className="card">
            <span className="eyebrow">{isDeep ? "심층 진단" : "기본 진단"}</span>
            <div className="score-number">
              {formatScore(result.overallScore)}
              <small>/4.0</small>
            </div>
            <p>
              현재 숙련도는 <span className="level-badge">{result.level}</span> 단계입니다.
            </p>
            <p className="muted">진단일: {new Date(result.createdAt).toLocaleString("ko-KR")}</p>
            <div className="cta-row">
              <Link className="button" href="/dashboard">
                대시보드로 이동
              </Link>
              {isDeep ? (
                <Link className="button secondary" href="/diagnosis" onClick={() => clearAssessmentDraft()}>
                  기본 진단 다시하기
                </Link>
              ) : (
                <Link className="button secondary" href="/dashboard">
                  심층 진단 안내 보기
                </Link>
              )}
            </div>
          </article>
          <RadarScoreChart result={result} />
        </div>
      </section>

      <section className="section compact">
        <ResultSharePanel result={result} />
      </section>

      <section className="section compact">
        <div className="grid two">
          <article className="card">
            <span className="eyebrow">영역별 백분위</span>
            <h2>전체 참여자 대비 나의 위치</h2>
            <ol className="rank-list">
              {result.areaScores.map((area) => (
                <li key={area.areaId}>
                  <span>{area.title}</span>
                  <strong>상위 {100 - area.percentile}%</strong>
                </li>
              ))}
            </ol>
          </article>
          <article className="card">
            <span className="eyebrow">비교 해석</span>
            <h2>평균 대비 차이</h2>
            <ol className="rank-list">
              {result.areaScores.map((area) => {
                const delta = area.score - area.average;
                return (
                  <li key={area.areaId}>
                    <span>{area.title}</span>
                    <strong className={delta >= 0 ? "delta-up" : "delta-down"}>
                      {delta >= 0 ? "+" : ""}
                      {delta.toFixed(1)}
                    </strong>
                  </li>
                );
              })}
            </ol>
          </article>
        </div>
      </section>

      <section className="section compact">
        <AreaComparisonChart scores={result.areaScores} />
      </section>

      <section className="section compact">
        <ResultHighlights result={result} />
      </section>
    </>
  );
}
