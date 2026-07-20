import Link from "next/link";
import { allCompetencies } from "@/data/digcomp";
import { getDigitalTypeDefinition } from "@/data/digital-types";
import { formatScore, type AssessmentResult } from "@/lib/scoring";

type DigitalTypeCardProps = {
  result: AssessmentResult;
};

export function DigitalTypeCard({ result }: DigitalTypeCardProps) {
  const digitalType = result.digitalType;
  if (!digitalType) return null;

  const primary = getDigitalTypeDefinition(digitalType.primaryType);
  const secondary = digitalType.secondaryType ? getDigitalTypeDefinition(digitalType.secondaryType) : null;
  const latent = digitalType.latentType ? getDigitalTypeDefinition(digitalType.latentType) : null;

  const coreScores = primary.core
    .map((competencyId) => result.competencyScores.find((score) => score.competencyId === competencyId))
    .filter((score): score is NonNullable<typeof score> => Boolean(score))
    .sort((a, b) => b.score - a.score);

  const complementCompetency = primary.complement?.competencyId
    ? allCompetencies.find((competency) => competency.id === primary.complement!.competencyId)
    : undefined;
  const complementScore = complementCompetency
    ? result.competencyScores.find((score) => score.competencyId === complementCompetency.id)
    : undefined;

  return (
    <>
      <section className="type-hero">
        <span className="type-hero-label">당신의 디지털 유형</span>
        <h2 className="type-hero-name">
          <Link href={`/types/${primary.id}`}>{primary.name}</Link>
        </h2>
        <p className="type-hero-desc">{primary.description}</p>
        <div className="type-hero-tags">
          {primary.tags.map((tag) => (
            <span key={tag} className="type-tag">
              {tag}
            </span>
          ))}
        </div>
        {secondary ? (
          <p className="type-hero-note">
            <strong>{secondary.name}</strong> 유형과도 점수가 근접한 복합 유형이에요.
          </p>
        ) : null}
        {latent ? (
          <p className="type-hero-note">
            상대적으로 <strong>{latent.name}</strong> 유형의 씨앗이 보여요. 관련 역량을 키우면 이 유형으로 성장할 수
            있어요.
          </p>
        ) : null}
      </section>

      {coreScores.length > 0 ? (
        <section className="card">
          <span className="eyebrow">판별 근거</span>
          <h2>이 유형으로 판별된 이유</h2>
          <ol className="rank-list">
            {coreScores.map((score) => (
              <li key={score.competencyId}>
                <span>{score.title}</span>
                <strong>{formatScore(score.score)}</strong>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {primary.activities.length > 0 ? (
        <section className="card">
          <span className="eyebrow">활동 추천</span>
          <h2>이런 활동에서 빛을 발해요</h2>
          <ul className="type-activity-list">
            {primary.activities.map((activity) => (
              <li key={activity.title}>
                <span className="type-activity-icon" aria-hidden="true">
                  {activity.icon}
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <p className="muted">{activity.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {primary.complement ? (
        <section className="card type-complement-card">
          <span className="eyebrow">다음 성장 포인트</span>
          <h2>
            {complementCompetency
              ? `${complementCompetency.title}${complementScore ? ` — 내 점수 ${formatScore(complementScore.score)}` : ""}`
              : "균형 잡힌 성장"}
          </h2>
          <p>{primary.complement.note}</p>
        </section>
      ) : null}
    </>
  );
}
