import Link from "next/link";
import { digcompAreas } from "@/data/digcomp";
import { getDigitalTypeDefinition, isDigitalTypeId } from "@/data/digital-types";
import { getInterestTagLabel } from "@/data/interest-tags";
import { AreaComparisonChart, RadarScoreChart } from "@/components/ScoreCharts";
import { ResultHighlights } from "@/components/ResultHighlights";
import { formatScore, getAssessmentType, type AssessmentResult } from "@/lib/scoring";

type AdminResultDetailProps = {
  result: AssessmentResult;
};

const digitalTypeCategoryLabels = {
  single: "단일 강점형",
  synergy: "시너지형",
  beginner: "입문형",
} as const;

export function AdminResultDetail({ result }: AdminResultDetailProps) {
  const assessmentType = getAssessmentType(result);
  const digitalType = result.digitalType;
  const digitalTypeDefinition =
    digitalType && isDigitalTypeId(digitalType.typeId) ? getDigitalTypeDefinition(digitalType.typeId) : null;

  return (
    <div className="admin-result-detail">
      <dl className="admin-detail-list admin-detail-list-inline">
        <div>
          <dt>진단 종류</dt>
          <dd>{assessmentType === "deep" ? `심층 진단 (${result.deepLevel})` : "기본 진단"}</dd>
        </div>
        {assessmentType === "basic" && result.selectedInterestTagId ? (
          <div>
            <dt>선택한 관심 분야</dt>
            <dd>{getInterestTagLabel(result.selectedInterestTagId)}</dd>
          </div>
        ) : null}
        <div>
          <dt>결과 ID</dt>
          <dd className="admin-mono">{result.id}</dd>
        </div>
      </dl>

      <div className="grid two">
        <RadarScoreChart result={result} />
        <AreaComparisonChart scores={result.areaScores} />
      </div>

      <div className="admin-competency-groups">
        {digcompAreas.map((area) => {
          const areaScore = result.areaScores.find((score) => score.areaId === area.id);
          const competencies = result.competencyScores.filter((score) => score.areaId === area.id);

          return (
            <article key={area.id} className="admin-competency-group">
              <div className="admin-competency-group-header">
                <h4>{area.title}</h4>
                <strong>{areaScore ? formatScore(areaScore.score) : "-"} / 4.0</strong>
              </div>
              <ol className="rank-list">
                {competencies.map((competency) => (
                  <li key={competency.competencyId}>
                    <span>{competency.title}</span>
                    <strong>{formatScore(competency.score)}</strong>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>

      <ResultHighlights result={result} />

      {digitalType && digitalTypeDefinition ? (
        <article className="admin-digitaltype-summary">
          <div className="admin-competency-group-header">
            <h4>
              <Link href={`/types/${digitalTypeDefinition.id}`}>
                <span aria-hidden="true">{digitalTypeDefinition.icon}</span> {digitalTypeDefinition.name}
              </Link>
            </h4>
            <span className="level-badge">{digitalTypeCategoryLabels[digitalTypeDefinition.category]}</span>
          </div>
          <p className="muted">{digitalType.explanation}</p>
          <ol className="rank-list">
            {digitalType.areaScores.map((area) => (
              <li key={area.areaId}>
                <span>{area.areaTitle}</span>
                <strong>{area.percent}점</strong>
              </li>
            ))}
          </ol>
        </article>
      ) : null}
    </div>
  );
}
