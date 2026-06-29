import Link from "next/link";
import { digcompAreas } from "@/data/digcomp";
import { getGuideLinksConfig } from "@/lib/guide-config";

export default async function GuidePage() {
  const guideConfig = await getGuideLinksConfig();

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Learning guide</span>
        <h1>역량 개발 가이드</h1>
        <p>
          진단 결과의 개발 필요 영역을 바탕으로 학습 자료를 추천합니다. 영역별 추천 링크를 확인하고
          필요한 역량부터 학습을 시작해 보세요.
        </p>
      </section>

      <section className="section compact">
        <div className="grid two">
          {digcompAreas.map((area) => (
            <article className="card" key={area.id}>
              <span className="area-number">{area.number}</span>
              <h2>{area.title}</h2>
              <p>{area.nonprofitContext}</p>
              <ol className="rank-list">
                {guideConfig.linksByArea[area.id].map((link) => (
                  <li key={`${area.id}-${link.href}-${link.title}`}>
                    <span>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.title}
                      </a>
                      <br />
                      <small className="muted">{link.description}</small>
                    </span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact">
        <article className="card">
          <h2>나에게 맞는 순서로 보고 싶나요?</h2>
          <p>진단을 완료하면 결과 화면에서 개발 필요 TOP 3를 확인하고, 해당 영역부터 학습을 시작할 수 있습니다.</p>
          <Link className="button" href="/diagnosis">
            진단하고 추천 받기
          </Link>
        </article>
      </section>
    </>
  );
}
