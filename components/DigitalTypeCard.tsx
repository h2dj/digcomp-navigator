import Link from "next/link";
import { areaColors, getDigitalTypeDefinition, sproutColor } from "@/data/digital-types";
import type { AssessmentResult } from "@/lib/scoring";

type DigitalTypeCardProps = {
  result: AssessmentResult;
};

const categoryLabels = {
  single: "단일 강점형",
  synergy: "시너지형",
  beginner: "입문형",
} as const;

export function DigitalTypeCard({ result }: DigitalTypeCardProps) {
  const digitalType = result.digitalType;
  if (!digitalType) return null;

  const type = getDigitalTypeDefinition(digitalType.typeId);
  const heroColor = type.areas[0] ? areaColors[type.areas[0]] : sproutColor;

  return (
    <>
      <section className="type-hero" style={{ background: `linear-gradient(135deg, ${heroColor} 0%, #1f2f3a 130%)` }}>
        <span className="type-hero-label">당신의 디지털 유형 · {categoryLabels[type.category]}</span>
        <h2 className="type-hero-name">
          <Link href={`/types/${type.id}`}>
            <span aria-hidden="true">{type.icon}</span> {type.name}
          </Link>
        </h2>
        <p className="type-hero-desc">{type.description}</p>
        <div className="type-hero-tags">
          {type.areas.length > 0 ? (
            type.areas.map((areaId) => {
              const area = digitalType.areaScores.find((score) => score.areaId === areaId);
              return (
                <span key={areaId} className="type-tag">
                  <span className="type-tag-dot" style={{ background: areaColors[areaId] }} aria-hidden="true" />
                  {area?.areaTitle ?? areaId}
                </span>
              );
            })
          ) : (
            <span className="type-tag">5개 영역 모두 성장 중</span>
          )}
        </div>
      </section>

      <section className="card">
        <span className="eyebrow">판별 근거</span>
        <h2>영역별 나의 점수(100점 환산)</h2>
        <ol className="rank-list">
          {digitalType.areaScores.map((area) => (
            <li key={area.areaId}>
              <span>
                {type.areas.includes(area.areaId) ? (
                  <span className="type-tag-dot" style={{ background: areaColors[area.areaId] }} aria-hidden="true" />
                ) : null}{" "}
                {area.areaTitle}
              </span>
              <strong>{area.percent}점</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="card type-complement-card">
        <span className="eyebrow">실천 팁</span>
        <h2>{type.name}에게 추천해요</h2>
        <p>{type.tip}</p>
      </section>
    </>
  );
}
