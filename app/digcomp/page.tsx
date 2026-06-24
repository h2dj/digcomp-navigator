import Link from "next/link";
import { digcompAreas, proficiencyLevels } from "@/data/digcomp";

const areaIcons = ["sage", "teal", "olive", "blue", "brown"] as const;
const areaIconEmoji = ["🔍", "💬", "✏️", "🛡️", "💡"];

export default function DigcompPage() {
  return (
    <>
      <section className="page-title">
        <h1>5가지 역량 영역</h1>
        <p>
          DigComp는 시민이 디지털 사회에서 필요한 지식, 기술, 태도를 설명하는 유럽 디지털 역량
          프레임워크입니다. 비영리 현장 업무 맥락에 맞춰 5개 영역과 21개 역량 항목을 자가진단
          문항으로 변환했습니다.
        </p>
      </section>

      <section className="section compact">
        <div className="grid areas-grid">
          {digcompAreas.map((area, index) => (
            <article className="card" key={area.id}>
              <span className={`area-icon ${areaIcons[index]}`} aria-hidden="true">
                {areaIconEmoji[index]}
              </span>
              <span className="area-label">영역 {area.number}</span>
              <h2>{area.title}</h2>
              <p>{area.summary}</p>
              <ul className="area-list">
                {area.competencies.map((competency) => (
                  <li key={competency.id}>{competency.shortTitle}</li>
                ))}
              </ul>
            </article>
          ))}
          <article className="card card-cta">
            <h2>지금 바로 시작해보세요</h2>
            <p className="muted">나의 디지털 역량은 몇 점일까요?</p>
            <Link className="button" href="/diagnosis">
              진단하기 &gt;
            </Link>
          </article>
        </div>
      </section>

      <section className="section compact">
        <h2 className="section-heading" style={{ textAlign: "left", marginBottom: "1rem" }}>
          숙련도 4단계
        </h2>
        <div className="grid four">
          {proficiencyLevels.map((level) => (
            <article className="card" key={level.id}>
              <h2>{level.label}</h2>
              <p>
                <strong>{level.range}</strong>
              </p>
              <p>{level.description}</p>
            </article>
          ))}
        </div>
        <div className="cta-row align-start">
          <Link className="button" href="/diagnosis">
            진단 시작하기 &gt;
          </Link>
        </div>
      </section>
    </>
  );
}
