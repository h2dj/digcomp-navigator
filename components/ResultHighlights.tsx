import type { AssessmentResult } from "@/lib/scoring";
import { formatScore } from "@/lib/scoring";

type ResultHighlightsProps = {
  result: AssessmentResult;
};

export function ResultHighlights({ result }: ResultHighlightsProps) {
  return (
    <div className="grid two">
      <section className="card">
        <span className="eyebrow">강점 TOP 3</span>
        <h2>지금 가장 잘 활용하는 역량</h2>
        <ol className="rank-list">
          {result.strengths.map((item) => (
            <li key={item.competencyId}>
              <span>{item.title}</span>
              <strong>{formatScore(item.score)}</strong>
            </li>
          ))}
        </ol>
      </section>
      <section className="card">
        <span className="eyebrow">개발 필요 TOP 3</span>
        <h2>다음 학습 우선순위</h2>
        <ol className="rank-list">
          {result.growthAreas.map((item) => (
            <li key={item.competencyId}>
              <span>{item.title}</span>
              <strong>{formatScore(item.score)}</strong>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
