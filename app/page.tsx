import Link from "next/link";
import { digcompAreas } from "@/data/digcomp";

export default function HomePage() {
  return (
    <>
      <section className="hero-centered">
        <span className="badge">유럽연합 DigComp 3.0 기반 · 한국어 서비스</span>
        <h1>나의 디지털 역량을 편안하게 살펴보세요</h1>
        <p>
          정답은 없어요. 지금 나의 위치를 알아보는 것부터 시작해보세요. 5개 영역, 21개 역량 항목을
          통해 디지털 역량을 진단하고 성장 방향을 찾을 수 있습니다.
        </p>
        <div className="cta-row">
          <Link className="button" href="/diagnosis">
            진단 시작하기 &gt;
          </Link>
          <Link className="button secondary" href="/stats">
            공개 통계 보기
          </Link>
        </div>
      </section>

      <section className="section compact">
        <h2 className="section-heading">이용 순서</h2>
        <p className="muted process-intro">아래 순서대로 진행하면 나에게 맞는 디지털 역량 성장 경로를 찾을 수 있어요.</p>
        <div className="process-steps">
          <article className="process-step">
            <span className="process-step-number">1</span>
            <span className="process-step-icon" aria-hidden="true">
              🧭
            </span>
            <h3>내 유형 추정</h3>
            <p>7가지 디지털 유형 중 지금 나와 가장 가까운 모습을 골라요.</p>
          </article>
          <span className="process-step-arrow" aria-hidden="true">
            →
          </span>
          <article className="process-step">
            <span className="process-step-number">2</span>
            <span className="process-step-icon" aria-hidden="true">
              ✓
            </span>
            <h3>기본 진단하기</h3>
            <p>15개 문항으로 5개 영역의 대략적인 역량 수준을 확인해요.</p>
          </article>
          <span className="process-step-arrow" aria-hidden="true">
            →
          </span>
          <article className="process-step">
            <span className="process-step-number">3</span>
            <span className="process-step-icon" aria-hidden="true">
              🔍
            </span>
            <h3>심층 진단하기</h3>
            <p>21개 역량을 실제 행동 문항으로 점검하고 나의 디지털 유형을 확인해요.</p>
          </article>
          <span className="process-step-arrow" aria-hidden="true">
            →
          </span>
          <article className="process-step">
            <span className="process-step-number">4</span>
            <span className="process-step-icon" aria-hidden="true">
              🤝
            </span>
            <h3>컨설팅 받기</h3>
            <p>공동체IT 전문가와 1:1로 더 정확한 진단과 성장 시나리오를 상담해요.</p>
          </article>
        </div>
      </section>

      <section className="info-card">
        <div className="info-card-header">
          <span aria-hidden="true">📖</span>
          <span>DigComp 3.0이란?</span>
        </div>
        <p>
          DigComp는 시민이 디지털 사회에서 필요한 지식, 기술, 태도를 설명하는 유럽 디지털 역량
          프레임워크입니다. 이 플랫폼은 비영리 현장 업무 맥락에 맞춰 5개 영역과 21개 역량 항목을
          자가진단 문항으로 변환했습니다.
        </p>
        <div className="info-stats">
          <div>
            <strong>유럽연합</strong>
            <span>개발 기관</span>
          </div>
          <div>
            <strong>3.0</strong>
            <span>최신 버전 (2025)</span>
          </div>
          <div>
            <strong>5개</strong>
            <span>역량 영역</span>
          </div>
          <div>
            <strong>21개</strong>
            <span>세부 역량</span>
          </div>
        </div>
      </section>

      <section className="section compact">
        <h2 className="section-heading">5가지 역량 영역</h2>
        <div className="grid areas-grid">
          {digcompAreas.map((area) => (
            <article className="card" key={area.id}>
              <span className="area-label">영역 {area.number}</span>
              <h2>{area.title}</h2>
              <p>{area.summary}</p>
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
    </>
  );
}
