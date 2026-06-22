import Link from "next/link";
import { digcompAreas } from "@/data/digcomp";

const guideLinks = {
  "information-data": [
    ["공공데이터포털", "https://www.data.go.kr", "공익 의제 조사에 활용할 수 있는 공공 데이터 탐색"],
    ["팩트체크넷", "https://factchecker.or.kr", "온라인 정보 검증과 사실 확인 사례 학습"],
  ],
  "communication-collaboration": [
    ["Google for Nonprofits", "https://www.google.com/nonprofits/", "비영리 협업 도구와 운영 사례"],
    ["Slack Nonprofit Guide", "https://slack.com/intl/ko-kr/solutions/nonprofit", "팀 커뮤니케이션 설계 참고"],
  ],
  "content-creation": [
    ["Creative Commons Korea", "https://creativecommons.org/licenses/?lang=ko", "저작권과 오픈 라이선스 이해"],
    ["Canva Design School", "https://www.canva.com/learn/", "캠페인 콘텐츠 제작 기초"],
  ],
  safety: [
    ["개인정보보호위원회", "https://www.pipc.go.kr", "개인정보 보호 법제와 가이드라인"],
    ["Google Safety Center", "https://safety.google/intl/ko/", "계정 보안과 피싱 예방 학습"],
  ],
  "problem-solving": [
    ["TechSoup Korea", "https://www.techsoupkorea.kr", "비영리 디지털 도구와 교육 자원"],
    ["NPO스쿨", "https://www.snpo.kr/bbs/board.php?bo_table=npo_aca", "공익활동가 역량 강화 교육 탐색"],
  ],
};

export default function GuidePage() {
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Learning guide</span>
        <h1>역량 개발 가이드</h1>
        <p>
          진단 결과의 개발 필요 영역을 바탕으로 학습 자료를 추천합니다. MVP에서는 영역별 추천 링크를
          제공하며, 이후 개인 결과와 연동해 자동 우선순위를 표시할 수 있습니다.
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
                {guideLinks[area.id].map(([title, href, description]) => (
                  <li key={href}>
                    <span>
                      <a href={href} target="_blank" rel="noreferrer">
                        {title}
                      </a>
                      <br />
                      <small className="muted">{description}</small>
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
