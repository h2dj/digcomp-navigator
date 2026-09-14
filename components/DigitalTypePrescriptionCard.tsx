"use client";

import type { CSSProperties } from "react";
import { digitalTypeCardContent } from "@/data/digital-type-cards";
import type { DigitalTypeId } from "@/data/digital-types";

type DigitalTypePrescriptionCardProps = {
  typeId: DigitalTypeId;
  typeName: string;
};

function withLineBreaks(lines: string[], keyPrefix: string) {
  return lines.map((line, index) => (
    <span key={`${keyPrefix}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

/**
 * 서울공익활동박람회 부스에서 배포한 "디지털 미니 처방전" 웹페이지(16종)를
 * 그대로 옮긴 카드. 강점·주의점·오늘의 처방·성장 가이드·추천 도구를 담고 있다.
 */
export function DigitalTypePrescriptionCard({ typeId, typeName }: DigitalTypePrescriptionCardProps) {
  const content = digitalTypeCardContent[typeId];
  const themeStyle = {
    "--rx-theme": content.themeColor,
    "--rx-soft": content.softColor,
  } as CSSProperties;

  return (
    <section className="rx-card" style={themeStyle}>
      <div className="rx-card-printbar">
        <button type="button" onClick={() => window.print()}>
          A4로 인쇄하기
        </button>
      </div>

      <div className="rx-card-hero">
        <div>
          <span className="rx-card-badge">Rx · 디지털 미니 처방전</span>
          <h2 className="rx-card-name">{typeName}</h2>
          <p className="rx-card-lead">{withLineBreaks(content.leadLines, "lead")}</p>
          <span className="rx-card-tag">{content.tag}</span>
        </div>
        <div className="rx-card-hero-art">
          <div className="rx-card-speech">{withLineBreaks(content.speechLines, "speech")}</div>
          <div className="rx-card-emoji" aria-hidden="true">
            {content.emoji}
          </div>
        </div>
      </div>

      <div className="rx-card-grid2">
        <article className="rx-card-panel rx-card-good">
          <h3>⭐ 이런 강점이 있어요</h3>
          <ul>
            {content.strengths.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="rx-card-panel rx-card-warn">
          <h3>❗ 이런 점은 조심해요</h3>
          <ul>
            {content.cautions.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot is-warn">!</span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="rx-card-rxbox">
        <div>
          <h3>💊 오늘의 처방</h3>
          <p className="rx-card-quote">{content.prescriptionQuote}</p>
          <ul>
            {content.prescriptionItems.map((item, index) => (
              <li key={index}>
                <span className="rx-card-dot">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <aside className="rx-card-sticky">
          <strong>기억하세요!</strong>
          {content.stickyLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </aside>
      </div>

      <div className="rx-card-growth">
        <h3>
          📈 성장 가이드 <small>더 멀리 성장하기 위한 실천 방법</small>
        </h3>
        <div className="rx-card-steps">
          {content.growthSteps.map((step, index) => (
            <div className="rx-card-step" key={index}>
              <span className="rx-card-step-num">{index + 1}</span>
              <span className="rx-card-step-title">{step.title}</span>
              <span className="rx-card-step-desc">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rx-card-tools">
        <div className="rx-card-message">
          <span aria-hidden="true">{content.messageEmoji}</span> {withLineBreaks(content.messageLines, "message")}
        </div>
        <div className="rx-card-toolbox">
          <h3>🔧 추천 도구·자료</h3>
          <ul>
            {content.tools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rx-card-footer">
        <span>다양한 사람들이 만드는 더 좋은 디지털 사회</span>
        <span>나의 가능성이, 더 나은 변화를 만듭니다.</span>
      </div>
    </section>
  );
}
