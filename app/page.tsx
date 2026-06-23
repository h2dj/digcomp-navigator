import Link from "next/link";
import { digcompAreas, proficiencyLevels } from "@/data/digcomp";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">DigComp 3.0 기반 자가진단</span>
          <h1>공익활동가를 위한 디지털 역량 내비게이터</h1>
          <p>
            한국의 비영리조직 임직원이 자신의 디지털 역량을 무료로 진단하고, 전체 참여자 통계와
            비교하며, 로그인 이후에는 변화 추이를 이어서 확인할 수 있는 플랫폼입니다.
          </p>
          <div className="cta-row">
            <Link className="button" href="/diagnosis">
              진단 시작하기
            </Link>
            <Link className="button secondary" href="/digcomp">
              DigComp 3.0 알아보기
            </Link>
          </div>
        </div>
        <aside className="hero-panel" aria-label="서비스 핵심 지표">
          <div className="metric-grid">
            <div className="metric">
              <strong>5</strong>
              <span>DigComp 역량 영역</span>
            </div>
            <div className="metric">
              <strong>21</strong>
              <span>역량 항목</span>
            </div>
            <div className="metric">
              <strong>4</strong>
              <span>숙련도 수준</span>
            </div>
            <div className="metric">
              <strong>25분</strong>
              <span>평균 진단 소요</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="section">
        <span className="eyebrow">사용자 흐름</span>
        <div className="grid three">
          {[
            ["1. 비회원 진단", "5개 영역을 섹션별로 응답하고 즉시 결과를 확인합니다."],
            ["2. 결과 저장", "회원가입 또는 로그인 후 방금 결과를 진단 이력에 저장합니다."],
            ["3. 성장 추적", "재진단을 통해 영역별 변화와 학습 우선순위를 비교합니다."],
          ].map(([title, description]) => (
            <article className="card" key={title}>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact">
        <span className="eyebrow">DigComp 영역</span>
        <div className="grid five">
          {digcompAreas.map((area) => (
            <article className="card" key={area.id}>
              <span className="area-number">{area.number}</span>
              <h2>{area.title}</h2>
              <p>{area.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section compact">
        <div className="grid two">
          <article className="card">
            <span className="eyebrow">결과 시각화</span>
            <h2>나의 위치를 바로 이해하는 리포트</h2>
            <p>
              레이더 차트, 영역별 평균 비교, 강점 TOP 3, 개발 필요 TOP 3, 숙련도 배지를 한 화면에서
              제공합니다.
            </p>
            <ul className="pill-list">
              {proficiencyLevels.map((level) => (
                <li key={level.id}>{level.label}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <span className="eyebrow">개인정보 보호</span>
            <h2>통계는 익명 집계, 개인 응답은 본인만</h2>
            <p>
              이메일 외 프로필 정보는 선택이며, 10명 미만 세그먼트는 집계를 공개하지 않는 원칙을
              제품 설계에 반영합니다.
            </p>
            <Link className="button ghost" href="/privacy">
              보호 원칙 보기
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
