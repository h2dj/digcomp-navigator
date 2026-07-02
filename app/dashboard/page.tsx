"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { GrowthLineChart, RadarScoreChart } from "@/components/ScoreCharts";
import { DeepAssessmentGuide } from "@/components/DeepAssessmentGuide";
import { DeepAssessmentResults } from "@/components/DeepAssessmentResults";
import { ResultHighlights } from "@/components/ResultHighlights";
import { ResultSharePanel } from "@/components/ResultSharePanel";
import {
  formatScore,
  getAssessmentType,
  getBasicResults,
  getDeepResults,
  getLatestBasicResult,
  getLatestResult,
  clearAssessmentDraft,
  type AssessmentResult,
} from "@/lib/scoring";
import { useUserDataRefresh } from "@/lib/use-user-data-refresh";

type DashboardTab = "basic" | "deep";

export default function DashboardPage() {
  const [tab, setTab] = useState<DashboardTab>("basic");
  const [basicResult, setBasicResult] = useState<AssessmentResult | null>(null);
  const [deepResults, setDeepResults] = useState<AssessmentResult[]>([]);
  const [basicHistory, setBasicHistory] = useState<AssessmentResult[]>([]);

  useUserDataRefresh(
    useCallback(() => {
      setBasicResult(getLatestBasicResult() ?? getLatestResult());
      setDeepResults(getDeepResults());
      setBasicHistory(getBasicResults());
    }, []),
  );

  if (!basicResult) {
    return (
      <>
        <section className="page-title">
          <h1>나의 대시보드</h1>
          <p>진단을 완료하면 여기에서 나의 결과를 볼 수 있어요.</p>
        </section>
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            👤
          </span>
          <h2>아직 진단 결과가 없어요</h2>
          <p className="muted">
            진단을 완료하면 나의 역량 프로필과 맞춤 학습 가이드를 확인할 수 있어요.
          </p>
          <Link className="button" href="/diagnosis">
            기본 진단하러 가기 &gt;
          </Link>
        </div>
      </>
    );
  }

  const previousBasic = basicHistory[1];
  const delta =
    previousBasic && getAssessmentType(basicResult) === "basic"
      ? basicResult.overallScore - previousBasic.overallScore
      : null;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Dashboard</span>
        <h1>나의 대시보드</h1>
        <p>기본 진단과 심층 진단 결과를 탭으로 나눠 확인할 수 있습니다.</p>

        <div className="dashboard-tabs" role="tablist" aria-label="진단 유형">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "basic"}
            className={tab === "basic" ? "active" : undefined}
            onClick={() => setTab("basic")}
          >
            기본 진단
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "deep"}
            className={tab === "deep" ? "active" : undefined}
            onClick={() => setTab("deep")}
          >
            심층 진단{deepResults.length > 0 ? ` (${deepResults.length})` : ""}
          </button>
        </div>
      </section>

      <section className="section compact">
        <article className="card">
          <h2>프로필 입력으로 후속 변화 추적 정확도를 높이세요</h2>
          <p className="muted">
            직군, 조직 유형, 경력 정보를 입력하면 재진단 시 변화 추이를 더 정확하게 비교하고 공개 통계에도 반영할 수
            있어요.
          </p>
          <Link className="button secondary" href="/profile">
            프로필 입력하기 &gt;
          </Link>
        </article>
      </section>

      {tab === "basic" ? (
        <div className="dashboard-tab-panel" role="tabpanel">
          <section className="section compact">
            <div className="score-hero">
              <article className="card">
                <span className="eyebrow">기본 진단 결과</span>
                <div className="score-number">
                  {formatScore(basicResult.overallScore)}
                  <small>/4.0</small>
                </div>
                <p>
                  추정 숙련도 <span className="level-badge">{basicResult.level}</span>
                </p>
                {delta !== null ? (
                  <p>
                    직전 기본 진단 대비{" "}
                    <strong className={delta >= 0 ? "delta-up" : "delta-down"}>
                      {delta >= 0 ? "+" : ""}
                      {delta.toFixed(1)}
                      {delta >= 0 ? "▲" : "▼"}
                    </strong>
                  </p>
                ) : (
                  <p className="muted">기본 진단을 2회 이상 하면 변화량이 표시됩니다.</p>
                )}
                <div className="cta-row">
                  <Link className="button" href="/diagnosis" onClick={() => clearAssessmentDraft()}>
                    기본 진단 다시하기
                  </Link>
                  <Link className="button secondary" href="/compare">
                    비교 분석 보기
                  </Link>
                </div>
              </article>
              <RadarScoreChart result={basicResult} />
            </div>
          </section>

          <section className="section compact">
            <ResultSharePanel result={basicResult} />
          </section>

          <section className="section compact">
            {basicHistory.length >= 2 ? (
              <>
                <span className="eyebrow">Growth</span>
                <h2>기본 진단 변화 추이</h2>
                <GrowthLineChart history={basicHistory} />
              </>
            ) : (
              <div className="notice">기본 진단을 2회 이상 하면 꺾은선 차트로 영역별 변화를 확인할 수 있습니다.</div>
            )}
          </section>

          <section className="section compact">
            <ResultHighlights result={basicResult} />
          </section>

          <section className="section compact">
            <article className="card dashboard-next-tab">
              <h2>다음 단계: 심층 진단</h2>
              <p className="muted">
                추정 숙련도 <span className="level-badge">{basicResult.level}</span>에 맞춘 21문항 심층
                진단으로 역량을 더 자세히 점검할 수 있어요.
              </p>
              <button className="button secondary" type="button" onClick={() => setTab("deep")}>
                심층 진단 탭으로 이동 &gt;
              </button>
            </article>
          </section>
        </div>
      ) : (
        <div className="dashboard-tab-panel" role="tabpanel">
          <DeepAssessmentResults results={deepResults} />
          <DeepAssessmentGuide />
        </div>
      )}
    </>
  );
}
