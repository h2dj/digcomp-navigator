"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { digcompAreas } from "@/data/digcomp";
import {
  allDigitalTypeIds,
  areaColors,
  getDigitalTypeDefinition,
  isDigitalTypeId,
  sproutColor,
} from "@/data/digital-types";

const categoryLabels = {
  single: "단일 강점형",
  synergy: "시너지형",
  beginner: "입문형",
} as const;

function areaTitle(areaId: string) {
  return digcompAreas.find((area) => area.id === areaId)?.title ?? areaId;
}

export default function DigitalTypeDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = decodeURIComponent(params.id);

  if (!isDigitalTypeId(rawId)) {
    notFound();
  }

  const type = getDigitalTypeDefinition(rawId);
  const heroColor = type.areas[0] ? areaColors[type.areas[0]] : sproutColor;
  const otherTypes = allDigitalTypeIds.filter((id) => id !== rawId).map((id) => getDigitalTypeDefinition(id));

  return (
    <>
      <section className="section compact">
        <Link href="/dashboard" className="text-button">
          &lt; 나의 대시보드로
        </Link>
      </section>

      <section className="section compact">
        <div className="type-hero" style={{ background: `linear-gradient(135deg, ${heroColor} 0%, #1f2f3a 130%)` }}>
          <span className="type-hero-label">디지털 유형 · {categoryLabels[type.category]}</span>
          <h1 className="type-hero-name">
            <span aria-hidden="true">{type.icon}</span> {type.name}
          </h1>
          <p className="type-hero-desc">{type.description}</p>
          <div className="type-hero-tags">
            {type.areas.length > 0 ? (
              type.areas.map((areaId) => (
                <span key={areaId} className="type-tag">
                  <span className="type-tag-dot" style={{ background: areaColors[areaId] }} aria-hidden="true" />
                  {areaTitle(areaId)}
                </span>
              ))
            ) : (
              <span className="type-tag">5개 영역 모두 성장 중</span>
            )}
          </div>
        </div>
      </section>

      {type.areas.length > 0 ? (
        <section className="section compact">
          <div className="card">
            <span className="eyebrow">{type.category === "single" ? "핵심 영역" : "핵심 영역 조합"}</span>
            <h2>이 유형과 연결된 DigComp 영역</h2>
            <ul className="rank-list">
              {type.areas.map((areaId) => {
                const area = digcompAreas.find((item) => item.id === areaId);
                return (
                  <li key={areaId}>
                    <span>
                      <span className="type-tag-dot" style={{ background: areaColors[areaId] }} aria-hidden="true" />{" "}
                      {area?.title ?? areaId}
                    </span>
                    <span className="muted">{area?.summary ?? ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section compact">
        <div className="card type-complement-card">
          <span className="eyebrow">실천 팁</span>
          <h2>{type.name}에게 추천해요</h2>
          <p>{type.tip}</p>
        </div>
      </section>

      <section className="section compact">
        <span className="eyebrow">다른 유형 둘러보기</span>
        <div className="type-picker-grid">
          {otherTypes.map((other) => (
            <Link key={other.id} href={`/types/${other.id}`} className="type-picker-card">
              <strong>
                <span aria-hidden="true">{other.icon}</span> {other.name}
              </strong>
              <p>{other.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
