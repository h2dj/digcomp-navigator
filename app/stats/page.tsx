import { digcompAreas } from "@/data/digcomp";
import { cohortAverages, publicStats } from "@/lib/scoring";

export default function StatsPage() {
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Public statistics</span>
        <h1>공개 통계</h1>
        <p>
          전체 참여자의 익명 집계 통계를 보여주는 예시 화면입니다. 실제 서비스에서는 세그먼트별
          참여자가 10명 이상일 때만 조직 유형·직군별 통계를 공개합니다.
        </p>
      </section>

      <section className="section compact">
        <div className="metric-grid">
          <div className="metric">
            <strong>{publicStats.totalParticipants}</strong>
            <span>누적 참여자</span>
          </div>
          <div className="metric">
            <strong>{publicStats.completedAssessments}</strong>
            <span>완료 진단 수</span>
          </div>
          <div className="metric">
            <strong>{publicStats.averageScore.toFixed(1)}</strong>
            <span>전체 평균 점수</span>
          </div>
          <div className="metric">
            <strong>{publicStats.minimumSegmentSize}명</strong>
            <span>최소 공개 기준</span>
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="grid two">
          <article className="card">
            <span className="eyebrow">영역별 평균</span>
            <h2>전체 참여자 평균</h2>
            <ol className="rank-list">
              {digcompAreas.map((area) => (
                <li key={area.id}>
                  <span>{area.title}</span>
                  <strong>{cohortAverages[area.id].toFixed(1)} / 4.0</strong>
                </li>
              ))}
            </ol>
          </article>
          <article className="card">
            <span className="eyebrow">조직 유형 분포</span>
            <h2>참여자 구성</h2>
            <ol className="rank-list">
              {publicStats.organizationDistribution.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.value}명</strong>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="section compact">
        <div className="notice">
          개인정보 보호를 위해 10명 미만의 직군·조직 유형 조합은 "집계 인원 부족"으로 표시됩니다.
          개인 응답은 본인만 확인할 수 있으며 공개 통계에는 익명화된 평균만 반영됩니다.
        </div>
      </section>
    </>
  );
}
