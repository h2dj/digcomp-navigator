import Link from "next/link";
import { getDigitalTypeDefinition } from "@/data/digital-types";
import type { AssessmentResult } from "@/lib/scoring";

type TypeMatchInsightProps = {
  result: AssessmentResult;
};

function matchPercent(score: number): number {
  return Math.round(Math.max(0, Math.min(1, (score - 1) / 4)) * 100);
}

export function TypeMatchInsight({ result }: TypeMatchInsightProps) {
  const digitalType = result.digitalType;
  if (!digitalType) return null;

  const selectedId = result.selectedTypeId ?? null;
  const selectedDef = selectedId ? getDigitalTypeDefinition(selectedId) : null;
  const primaryDef = getDigitalTypeDefinition(digitalType.primaryType);
  const isSpecialistResult = digitalType.candidates.some((candidate) => candidate.typeId === digitalType.primaryType);
  const isMatch = Boolean(selectedId && selectedId === digitalType.primaryType);
  const ranked = [...digitalType.candidates].sort((a, b) => b.score - a.score);

  return (
    <section className="card type-match-card">
      <span className="eyebrow">디지털 유형 부합도</span>
      <h2>
        {selectedDef
          ? isMatch
            ? `선택하신 '${selectedDef.name}' 유형과 실제 결과가 일치해요`
            : `선택하신 '${selectedDef.name}' 유형과는 조금 다른 결과가 나왔어요`
          : "회원님과 가장 가까운 디지털 유형이에요"}
      </h2>

      <p className="muted">
        {digitalType.primaryType === "T7" ? (
          <>
            지금까지의 응답으로는{" "}
            <Link href={`/types/${primaryDef.id}`}>
              <strong>{primaryDef.name}</strong>
            </Link>{" "}
            유형에 가장 가까워요. 여러 영역에서 고르게 강점을 보이고 있어요.
          </>
        ) : isSpecialistResult ? (
          <>
            지금까지의 응답으로는{" "}
            <Link href={`/types/${primaryDef.id}`}>
              <strong>{primaryDef.name}</strong>
            </Link>{" "}
            유형에 가장 가까워요.
          </>
        ) : digitalType.fallbackCase === "B" && digitalType.latentType ? (
          <>
            아직 뚜렷한 유형은 아니지만{" "}
            <Link href={`/types/${digitalType.latentType}`}>
              <strong>{getDigitalTypeDefinition(digitalType.latentType).name}</strong>
            </Link>{" "}
            유형의 씨앗이 보여요. 관련 역량을 키우면 이 유형으로 성장할 수 있어요.
          </>
        ) : (
          <>
            <strong>{primaryDef.name}</strong> 단계로, 특정 유형보다 기초 역량 전반을 골고루 다지는 게 먼저예요.
          </>
        )}
      </p>

      <ul className="type-match-list">
        {ranked.map((candidate) => {
          const def = getDigitalTypeDefinition(candidate.typeId);
          const percent = matchPercent(candidate.score);
          const isSelected = candidate.typeId === selectedId;
          const isActual = candidate.typeId === digitalType.primaryType;

          return (
            <li key={candidate.typeId}>
              <Link href={`/types/${candidate.typeId}`} className="type-match-row">
                <span className="type-match-name">
                  {def.name}
                  {isSelected ? <span className="type-match-tag">선택함</span> : null}
                  {isActual ? <span className="type-match-tag type-match-tag-actual">실제 결과</span> : null}
                </span>
                <span className="type-match-bar-track">
                  <span className="type-match-bar-fill" style={{ width: `${percent}%` }} />
                </span>
                <span className="type-match-pct">{percent}%</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {digitalType.basedOnPartialData ? (
        <p className="muted type-match-note">
          기본 진단은 15개 역량만 직접 확인해 참고용 추정치예요. 심층 진단을 하면 21개 역량을 모두 반영한 정확한
          유형을 확인할 수 있어요.
        </p>
      ) : null}
    </section>
  );
}
