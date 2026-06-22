import Link from "next/link";
import { digcompAreas, proficiencyLevels } from "@/data/digcomp";

export default function DigcompPage() {
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Framework</span>
        <h1>DigComp 3.0 안내</h1>
        <p>
          DigComp는 시민이 디지털 사회에서 필요한 지식, 기술, 태도를 설명하는 유럽 디지털 역량
          프레임워크입니다. 이 플랫폼은 비영리 현장 업무 맥락에 맞춰 5개 영역과 21개 역량 항목을
          자가진단 문항으로 변환했습니다.
        </p>
      </section>

      <section className="section compact">
        <div className="grid two">
          {digcompAreas.map((area) => (
            <article className="card" key={area.id}>
              <span className="area-number">{area.number}</span>
              <h2>{area.title}</h2>
              <p>{area.summary}</p>
              <p>
                <strong>비영리 업무 맥락:</strong> {area.nonprofitContext}
              </p>
              <ul className="tag-list">
                {area.competencies.map((competency) => (
                  <li className="tag" key={competency.id}>
                    {competency.shortTitle}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact">
        <span className="eyebrow">숙련도 4단계</span>
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
        <div className="cta-row">
          <Link className="button" href="/diagnosis">
            진단 시작하기
          </Link>
        </div>
      </section>
    </>
  );
}
