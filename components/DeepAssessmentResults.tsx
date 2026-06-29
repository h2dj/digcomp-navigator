"use client";

import Link from "next/link";
import { RadarScoreChart } from "@/components/ScoreCharts";
import { ResultHighlights } from "@/components/ResultHighlights";
import { ResultSharePanel } from "@/components/ResultSharePanel";
import { formatScore, type AssessmentResult } from "@/lib/scoring";

type DeepAssessmentResultsProps = {
  results: AssessmentResult[];
};

export function DeepAssessmentResults({ results }: DeepAssessmentResultsProps) {
  if (results.length === 0) return null;

  return (
    <section className="section compact">
      <span className="eyebrow">Deep Assessment</span>
      <h2>심층 진단 결과</h2>
      <p className="muted">21개 역량 전체를 점검한 심층 진단 결과입니다.</p>

      <div className="deep-results-stack">
        {results.map((result) => (
          <div key={result.id} className="deep-result-block">
            <div className="score-hero">
              <article className="card">
                <span className="eyebrow">{result.deepLevel} 심층 진단</span>
                <div className="score-number">
                  {formatScore(result.overallScore)}
                  <small>/4.0</small>
                </div>
                <p>
                  숙련도 <span className="level-badge">{result.level}</span>
                </p>
                <p className="muted">진단일: {new Date(result.createdAt).toLocaleString("ko-KR")}</p>
                <div className="cta-row">
                  <Link
                    className="button secondary"
                    href={`/diagnosis/deep/${encodeURIComponent(result.deepLevel ?? "기초")}`}
                  >
                    {result.deepLevel} 심층 진단 다시하기
                  </Link>
                </div>
              </article>
              <RadarScoreChart result={result} />
            </div>

            <ResultHighlights result={result} />
            <ResultSharePanel result={result} />
          </div>
        ))}
      </div>
    </section>
  );
}
