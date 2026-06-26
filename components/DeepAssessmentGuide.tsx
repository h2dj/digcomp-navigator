"use client";

import Link from "next/link";
import { CONSULTING_URL, deepAssessmentMeta, proficiencyLevels } from "@/data/deep-assessment";
import {
  getLatestBasicResult,
  getLatestDeepResult,
  type ProficiencyLevel,
} from "@/lib/scoring";

export function DeepAssessmentGuide() {
  const basicResult = getLatestBasicResult();
  if (!basicResult) return null;

  const recommendedLevel = basicResult.level;
  const completedDeep = getLatestDeepResult(recommendedLevel);

  return (
    <section className="section compact">
      <span className="eyebrow">Deep Assessment</span>
      <h2>심층 진단 안내</h2>
      <p>
        기본 진단을 완료했어요. 현재 숙련도는 <span className="level-badge">{recommendedLevel}</span>입니다.
        {recommendedLevel} 수준에 맞춘 심층 진단으로 21개 역량을 더 자세히 점검할 수 있어요.
      </p>

      <div className="deep-options">
        <article className="card deep-option-card">
          <span className="eyebrow">온라인</span>
          <h3>심층 진단 ({recommendedLevel})</h3>
          <p>
            5개 영역 21개 역량 각각에 대한 추가 질문으로, 기본 진단보다 세밀한 역량 프로필을 확인할 수
            있어요.
          </p>
          <p className="muted">{deepAssessmentMeta[recommendedLevel].duration} · 21문항</p>
          {completedDeep ? (
            <p className="form-success">이미 {recommendedLevel} 심층 진단을 완료했어요.</p>
          ) : null}
          <Link className="button" href={`/diagnosis/deep/${encodeURIComponent(recommendedLevel)}`}>
            {recommendedLevel} 심층 진단 시작 &gt;
          </Link>
        </article>

        <article className="card deep-option-card">
          <span className="eyebrow">컨설팅</span>
          <h3>공동체IT 전문 컨설팅</h3>
          <p>
            온라인 진단과 함께, 공동체IT사회적협동조합의 전문가와 1:1 컨설팅을 받을 수 있어요. 조직
            상황에 맞는 맞춤 피드백을 제공합니다.
          </p>
          <a className="button secondary" href={CONSULTING_URL} target="_blank" rel="noreferrer">
            공동체IT 문의하기 &gt;
          </a>
        </article>
      </div>

      <details className="deep-level-details">
        <summary>다른 숙련도 심층 진단 보기</summary>
        <ul className="deep-level-list">
          {proficiencyLevels.map((level: ProficiencyLevel) => {
            const done = Boolean(getLatestDeepResult(level));
            const isRecommended = level === recommendedLevel;

            return (
              <li key={level}>
                <div>
                  <strong>
                    {level} 심층 진단
                    {isRecommended ? " (추천)" : ""}
                  </strong>
                  <span className="muted">{deepAssessmentMeta[level].focus}</span>
                </div>
                <div className="deep-level-actions">
                  {done ? <span className="muted">완료</span> : null}
                  <Link href={`/diagnosis/deep/${encodeURIComponent(level)}`}>시작</Link>
                </div>
              </li>
            );
          })}
        </ul>
      </details>
    </section>
  );
}
