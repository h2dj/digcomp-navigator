"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GrowthLineChart, RadarScoreChart } from "@/components/ScoreCharts";
import { ResultHighlights } from "@/components/ResultHighlights";
import { formatScore, getHistory, getLatestResult, type AssessmentResult } from "@/lib/scoring";

export default function DashboardPage() {
  const [latest, setLatest] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    setLatest(getLatestResult());
    setHistory(getHistory());
  }, []);

  if (!latest) {
    return (
      <section className="page-title">
        <span className="eyebrow">Dashboard</span>
        <h1>나의 대시보드</h1>
        <p>최근 진단 결과와 변화 추이를 보려면 먼저 진단을 완료해주세요.</p>
        <Link className="button" href="/diagnosis">
          첫 진단 시작하기
        </Link>
      </section>
    );
  }

  const previous = history[1];
  const delta = previous ? latest.overallScore - previous.overallScore : null;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Dashboard</span>
        <h1>나의 대시보드</h1>
        <p>최근 진단 결과, 강점·약점, 재진단에 따른 변화 추이를 확인합니다.</p>
      </section>

      <section className="section compact">
        <div className="score-hero">
          <article className="card">
            <span className="eyebrow">최근 결과</span>
            <div className="score-number">
              {formatScore(latest.overallScore)}
              <small>/4.0</small>
            </div>
            <p>
              숙련도 <span className="level-badge">{latest.level}</span>
            </p>
            {delta !== null ? (
              <p>
                직전 회차 대비{" "}
                <strong className={delta >= 0 ? "delta-up" : "delta-down"}>
                  {delta >= 0 ? "+" : ""}
                  {delta.toFixed(1)}
                  {delta >= 0 ? "▲" : "▼"}
                </strong>
              </p>
            ) : (
              <p className="muted">2회 이상 진단하면 변화량이 표시됩니다.</p>
            )}
            <div className="cta-row">
              <Link className="button" href="/diagnosis">
                다시 진단하기
              </Link>
              <Link className="button secondary" href="/compare">
                비교 분석 보기
              </Link>
            </div>
          </article>
          <RadarScoreChart result={latest} />
        </div>
      </section>

      <section className="section compact">
        {history.length >= 2 ? (
          <>
            <span className="eyebrow">Growth</span>
            <h2>역량 변화 추이</h2>
            <GrowthLineChart history={history} />
          </>
        ) : (
          <div className="notice">최소 2회 이상 진단하면 꺾은선 차트로 영역별 변화를 확인할 수 있습니다.</div>
        )}
      </section>

      <section className="section compact">
        <ResultHighlights result={latest} />
      </section>
    </>
  );
}
