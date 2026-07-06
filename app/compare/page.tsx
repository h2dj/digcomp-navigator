"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AreaComparisonChart } from "@/components/ScoreCharts";
import {
  formatScore,
  getLatestResult,
  getProfile,
  type AssessmentResult,
  type Profile,
} from "@/lib/scoring";
import {
  findPublishedSegmentAverage,
  MINIMUM_SEGMENT_SIZE,
  type AggregateStats,
} from "@/lib/public-stats";

export default function ComparePage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [publicStats, setPublicStats] = useState<AggregateStats | null>(null);

  useEffect(() => {
    setResult(getLatestResult());
    setProfile(getProfile());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicStats() {
      try {
        const response = await fetch("/api/public-stats");
        if (!response.ok) return;

        const data = (await response.json()) as AggregateStats;
        if (!cancelled) {
          setPublicStats(data);
        }
      } catch {
        if (!cancelled) {
          setPublicStats(null);
        }
      }
    }

    void loadPublicStats();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!result) {
    return (
      <section className="page-title">
        <span className="eyebrow">Compare</span>
        <h1>비교 분석</h1>
        <p>진단을 완료하면 전체 참여자와 동일 직군·조직 유형 대비 나의 위치를 확인할 수 있습니다.</p>
        <Link className="button" href="/diagnosis">
          진단 시작하기
        </Link>
      </section>
    );
  }

  const activeProfile = profile ?? getProfile();
  const cohortAverage = publicStats?.averageScore;
  const roleAverage = publicStats
    ? findPublishedSegmentAverage(publicStats.roleSegmentStats, activeProfile.role)
    : undefined;
  const organizationAverage = publicStats
    ? findPublishedSegmentAverage(publicStats.organizationSegmentStats, activeProfile.organizationType)
    : undefined;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Compare</span>
        <h1>비교 분석</h1>
        <p>전체 참여자 평균과 내 프로필 기준 세그먼트를 비교합니다.</p>
      </section>

      <section className="section compact">
        <div className="grid three">
          <ComparisonCard
            label="전체 참여자"
            myScore={result.overallScore}
            average={cohortAverage}
            unavailableLabel="집계 데이터 없음"
          />
          <ComparisonCard
            label={`동일 직군: ${activeProfile.role}`}
            myScore={result.overallScore}
            average={roleAverage}
          />
          <ComparisonCard
            label={`동일 조직 유형: ${activeProfile.organizationType}`}
            myScore={result.overallScore}
            average={organizationAverage}
          />
        </div>
      </section>

      <section className="section compact">
        <AreaComparisonChart scores={result.areaScores} />
      </section>

      <section className="section compact">
        <div className="notice">
          현재 프로필은 <strong>{activeProfile.role}</strong>, <strong>{activeProfile.organizationType}</strong>,{" "}
          <strong>{activeProfile.years}</strong> 기준입니다. 세그먼트별 비교는 각 직군·조직 유형의 응답자가{" "}
          {MINIMUM_SEGMENT_SIZE}명 미만이면 공개되지 않습니다. 전체 참여자 평균은 항상 비교할 수 있습니다.
        </div>
        <div className="cta-row">
          <Link className="button secondary" href="/profile">
            프로필 수정하기
          </Link>
        </div>
      </section>
    </>
  );
}

function ComparisonCard({
  label,
  myScore,
  average,
  unavailableLabel = "집계 인원 부족 (10명 미만)",
}: {
  label: string;
  myScore: number;
  average: number | null | undefined;
  unavailableLabel?: string;
}) {
  if (average === undefined) {
    return (
      <article className="card">
        <span className="eyebrow">{label}</span>
        <h2>{formatScore(myScore)} / 4.0</h2>
        <p className="muted">…</p>
      </article>
    );
  }

  if (average === null) {
    return (
      <article className="card">
        <span className="eyebrow">{label}</span>
        <h2>{formatScore(myScore)} / 4.0</h2>
        <p className="stats-unavailable">{unavailableLabel}</p>
      </article>
    );
  }

  const delta = myScore - average;

  return (
    <article className="card">
      <span className="eyebrow">{label}</span>
      <h2>{formatScore(myScore)} / 4.0</h2>
      <p>비교 평균 {formatScore(average)}</p>
      <p>
        평균 대비{" "}
        <strong className={delta >= 0 ? "delta-up" : "delta-down"}>
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}
        </strong>
      </p>
    </article>
  );
}
