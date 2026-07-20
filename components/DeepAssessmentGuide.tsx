"use client";

import Link from "next/link";
import { CONSULTING_URL, deepAssessmentMeta, getDeepAssessmentQuestionCount, proficiencyLevels } from "@/data/deep-assessment";
import {
  getLatestBasicResult,
  getLatestDeepResult,
  type ProficiencyLevel,
} from "@/lib/scoring";

export function DeepAssessmentGuide() {
  const basicResult = getLatestBasicResult();
  if (!basicResult) return null;

  const recommendedLevel = basicResult.level;
  const recommendedQuestionCount = getDeepAssessmentQuestionCount(recommendedLevel);
  const completedDeep = getLatestDeepResult(recommendedLevel);

  return (
    <section className="section compact">
      <span className="eyebrow">Deep Assessment</span>
      <h2>심층 진단 안내</h2>
      <p>
        기본 진단을 완료했어요. 추정 숙련도는 <span className="level-badge">{recommendedLevel}</span>
        입니다. {recommendedLevel} 수준에 맞춘 심층 진단으로 역량별 실제 행동 문항을 더 자세히 점검하고,{" "}
        <strong>나의 디지털 유형까지 확인</strong>할 수 있어요.
      </p>

      <div className="deep-options">
        <article className="card deep-option-card">
          <span className="eyebrow">온라인</span>
          <h3>심층 진단 ({recommendedLevel})</h3>
          <p>
            DigComp 3.0 기반 자가평가 문항집의 21개 역량별 실제 행동 문항으로 점검합니다. 기본 진단보다
            세밀한 역량 프로필을 확인할 수 있고, 진단을 마치면 강점 조합을 바탕으로 한{" "}
            <strong>&ldquo;나의 디지털 유형&rdquo;과 추천 활동</strong>도 함께 알려드려요.
          </p>
          <p className="muted">{deepAssessmentMeta[recommendedLevel].duration} · {recommendedQuestionCount}문항</p>
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
            온라인으로 제공되는 객관식 심층 진단은 대략적으로만 역량을 확인할 수 있습니다. 공동체IT사회적협동조합을
            통해 대면/비대면 1:1 컨설팅을 받아보세요. 보다 정확한 역량 진단이 가능하며 역량 발전 시나리오 등
            상황에 맞는 맞춤 피드백을 제공해드립니다.
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
