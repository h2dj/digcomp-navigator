"use client";

import { useEffect, useState } from "react";
import { AggregateRadarChart } from "@/components/ScoreCharts";
import { digcompAreas } from "@/data/digcomp";
import {
  canPublishSegment,
  MINIMUM_SEGMENT_SIZE,
  type AggregateStats,
  type DistributionItem,
  type SegmentStat,
} from "@/lib/public-stats";
import { profileOrganizationOptions, profileRoleOptions } from "@/lib/profile-options";

type StatsTab = "aggregate" | "segment";

const emptyAggregateStats: AggregateStats = {
  totalParticipants: 0,
  completedAssessments: 0,
  averageScore: null,
  medianScore: null,
  areaAverages: {
    "information-data": null,
    "communication-collaboration": null,
    "content-creation": null,
    safety: null,
    "problem-solving": null,
  },
  roleDistribution: [],
  organizationDistribution: [],
  roleSegmentStats: profileRoleOptions.map((name) => ({
    name,
    participantCount: 0,
    averageScore: 0,
  })),
  organizationSegmentStats: profileOrganizationOptions.map((name) => ({
    name,
    participantCount: 0,
    averageScore: 0,
  })),
};

export default function StatsPage() {
  const [tab, setTab] = useState<StatsTab>("aggregate");
  const [aggregateStats, setAggregateStats] = useState<AggregateStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAggregateStats() {
      try {
        const response = await fetch("/api/public-stats");
        if (!response.ok) return;

        const data = (await response.json()) as AggregateStats;
        if (!cancelled) {
          setAggregateStats(data);
        }
      } catch {
        if (!cancelled) {
          setAggregateStats(emptyAggregateStats);
        }
      }
    }

    void loadAggregateStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = aggregateStats;

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Public statistics</span>
        <h1>공개 통계</h1>
        <p>
          전체 참여자의 익명 집계를 <strong>통합 통계</strong>와 <strong>세그먼트별 통계</strong>로 나눠
          보여줍니다. 통합 통계는 참여자 수와 관계없이 항상 공개하고, 세그먼트별 통계는 직군·조직 유형별
          응답자가 {MINIMUM_SEGMENT_SIZE}명 이상일 때만 평균 점수를 공개합니다.
        </p>

        <div className="dashboard-tabs" role="tablist" aria-label="공개 통계 유형">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "aggregate"}
            className={tab === "aggregate" ? "active" : undefined}
            onClick={() => setTab("aggregate")}
          >
            통합 통계
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "segment"}
            className={tab === "segment" ? "active" : undefined}
            onClick={() => setTab("segment")}
          >
            세그먼트별 통계
          </button>
        </div>
      </section>

      {tab === "aggregate" ? (
        <div className="dashboard-tab-panel" role="tabpanel">
          <section className="section compact">
            <div className="metric-grid">
              <div className="metric">
                <strong>{formatCount(stats?.totalParticipants)}</strong>
                <span>누적 참여자</span>
              </div>
              <div className="metric">
                <strong>{formatCount(stats?.completedAssessments)}</strong>
                <span>완료 진단 수</span>
              </div>
              <div className="metric">
                <strong>{formatScore(stats?.averageScore)}</strong>
                <span>전체 평균 점수</span>
              </div>
              <div className="metric">
                <strong>{formatScore(stats?.medianScore)}</strong>
                <span>중앙값</span>
              </div>
            </div>
          </section>

          <section className="section compact">
            <article className="card">
              <span className="eyebrow">영역별 평균</span>
              <h2>전체 참여자 오각형 그래프</h2>
              <p className="muted">5개 DigComp 영역의 실제 평균 점수를 오각형 그래프로 표시합니다.</p>
              <AggregateRadarChart areaAverages={stats?.areaAverages ?? emptyAggregateStats.areaAverages} />
            </article>
          </section>

          <section className="section compact">
            <div className="grid two">
              <article className="card">
                <span className="eyebrow">영역별 평균</span>
                <h2>전체 참여자</h2>
                <ol className="rank-list">
                  {digcompAreas.map((area) => (
                    <li key={area.id}>
                      <span>{area.title}</span>
                      <strong>{formatAreaScore(stats?.areaAverages[area.id])}</strong>
                    </li>
                  ))}
                </ol>
              </article>
              <article className="card">
                <span className="eyebrow">참여자 구성</span>
                <h2>직군 분포</h2>
                <ol className="rank-list">
                  <DistributionList items={stats?.roleDistribution} />
                </ol>
              </article>
            </div>
          </section>

          <section className="section compact">
            <article className="card">
              <span className="eyebrow">참여자 구성</span>
              <h2>조직 유형 분포</h2>
              <ol className="rank-list">
                <DistributionList items={stats?.organizationDistribution} />
              </ol>
            </article>
          </section>

          <section className="section compact">
            <div className="notice">
              통합 통계는 전체 참여자를 합산한 익명 평균·분포입니다. 개인 응답은 본인만 확인할 수
              있으며, 참여자 수와 관계없이 항상 공개됩니다.
            </div>
          </section>
        </div>
      ) : (
        <div className="dashboard-tab-panel" role="tabpanel">
          <section className="section compact">
            <div className="metric-grid">
              <div className="metric">
                <strong>{MINIMUM_SEGMENT_SIZE}명</strong>
                <span>세그먼트 최소 공개 기준</span>
              </div>
              <div className="metric">
                <strong>
                  {(stats?.roleSegmentStats ?? []).filter(canPublishSegment).length +
                    (stats?.organizationSegmentStats ?? []).filter(canPublishSegment).length}
                </strong>
                <span>공개 중인 세그먼트</span>
              </div>
            </div>
          </section>

          <section className="section compact">
            <div className="grid two">
              <SegmentStatsCard title="직군별" segments={stats?.roleSegmentStats} />
              <SegmentStatsCard title="조직 유형별" segments={stats?.organizationSegmentStats} />
            </div>
          </section>

          <section className="section compact">
            <div className="notice">
              개인정보 보호를 위해 직군·조직 유형별 응답자가 {MINIMUM_SEGMENT_SIZE}명 미만이면 평균
              점수 대신 &quot;집계 인원 부족&quot;으로 표시합니다. 세그먼트 인원 수는 공개하지
              않습니다.
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function formatCount(value: number | undefined): string {
  if (value === undefined) return "…";
  return value.toLocaleString("ko-KR");
}

function formatScore(value: number | null | undefined): string {
  if (value === undefined) return "…";
  if (value === null) return "-";
  return value.toFixed(1);
}

function formatAreaScore(value: number | null | undefined): string {
  if (value === undefined) return "… / 4.0";
  if (value === null) return "- / 4.0";
  return `${value.toFixed(1)} / 4.0`;
}

function DistributionList({ items }: { items: DistributionItem[] | undefined }) {
  if (!items) {
    return (
      <li>
        <span className="muted">불러오는 중…</span>
      </li>
    );
  }

  if (items.length === 0) {
    return (
      <li>
        <span className="muted">아직 집계할 데이터가 없습니다.</span>
      </li>
    );
  }

  return (
    <>
      {items.map((item) => (
        <li key={item.name}>
          <span>{item.name}</span>
          <strong>{item.value.toLocaleString("ko-KR")}명</strong>
        </li>
      ))}
    </>
  );
}

function SegmentStatsCard({ title, segments }: { title: string; segments: SegmentStat[] | undefined }) {
  if (!segments) {
    return (
      <article className="card">
        <span className="eyebrow">{title}</span>
        <h2>평균 점수</h2>
        <p className="muted">불러오는 중…</p>
      </article>
    );
  }

  return (
    <article className="card">
      <span className="eyebrow">{title}</span>
      <h2>평균 점수</h2>
      <ol className="rank-list">
        {segments.map((segment) => (
          <li key={segment.name}>
            <span>{segment.name}</span>
            {canPublishSegment(segment) ? (
              <strong>{segment.averageScore.toFixed(1)} / 4.0</strong>
            ) : (
              <strong className="stats-unavailable">집계 인원 부족</strong>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}
