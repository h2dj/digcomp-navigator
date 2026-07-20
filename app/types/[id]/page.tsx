"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { allCompetencies, digcompAreas } from "@/data/digcomp";
import { allDigitalTypeIds, getDigitalTypeDefinition, isDigitalTypeId } from "@/data/digital-types";

function competencyInfo(competencyId: string) {
  const competency = allCompetencies.find((item) => item.id === competencyId);
  if (!competency) return null;
  const area = digcompAreas.find((item) => item.id === competency.areaId);
  return { title: competency.title, areaTitle: area?.title ?? "" };
}

export default function DigitalTypeDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = decodeURIComponent(params.id);

  if (!isDigitalTypeId(rawId)) {
    notFound();
  }

  const type = getDigitalTypeDefinition(rawId);
  const otherTypes = allDigitalTypeIds.filter((id) => id !== rawId).map((id) => getDigitalTypeDefinition(id));

  return (
    <>
      <section className="section compact">
        <Link href="/dashboard" className="text-button">
          &lt; 나의 대시보드로
        </Link>
      </section>

      <section className="section compact">
        <div className="type-hero">
          <span className="type-hero-label">디지털 유형</span>
          <h1 className="type-hero-name">{type.name}</h1>
          <p className="type-hero-desc">{type.description}</p>
          <div className="type-hero-tags">
            {type.tags.map((tag) => (
              <span key={tag} className="type-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {type.core.length > 0 ? (
        <section className="section compact">
          <div className="card">
            <span className="eyebrow">핵심 역량</span>
            <h2>이 유형을 판별하는 핵심 역량</h2>
            <ul className="rank-list">
              {type.core.map((competencyId) => {
                const info = competencyInfo(competencyId);
                if (!info) return null;
                return (
                  <li key={competencyId}>
                    <span>{info.title}</span>
                    <span className="muted">{info.areaTitle}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {type.related.length > 0 ? (
        <section className="section compact">
          <div className="card">
            <span className="eyebrow">연관 역량</span>
            <h2>함께 살펴보면 좋은 역량</h2>
            <ul className="rank-list">
              {type.related.map((competencyId) => {
                const info = competencyInfo(competencyId);
                if (!info) return null;
                return (
                  <li key={competencyId}>
                    <span>{info.title}</span>
                    <span className="muted">{info.areaTitle}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {type.activities.length > 0 ? (
        <section className="section compact">
          <div className="card">
            <span className="eyebrow">활동 추천</span>
            <h2>이런 활동에서 빛을 발해요</h2>
            <ul className="type-activity-list">
              {type.activities.map((activity) => (
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
          </div>
        </section>
      ) : null}

      {type.complement ? (
        <section className="section compact">
          <div className="card type-complement-card">
            <span className="eyebrow">다음 성장 포인트</span>
            <h2>{competencyInfo(type.complement.competencyId)?.title ?? "균형 잡힌 성장"}</h2>
            <p>{type.complement.note}</p>
          </div>
        </section>
      ) : null}

      <section className="section compact">
        <span className="eyebrow">다른 유형 둘러보기</span>
        <div className="type-picker-grid">
          {otherTypes.map((other) => (
            <Link key={other.id} href={`/types/${other.id}`} className="type-picker-card">
              <strong>{other.name}</strong>
              <p>{other.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
