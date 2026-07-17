import { allCompetencies, digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import {
  digitalTypeDefinitions,
  digitalTypeParams as PARAMS,
  digitalTypeT0,
  digitalTypeT7,
  type DigitalTypeId,
} from "@/data/digital-types";

/**
 * 21개 역량 점수(0~4, 앱 내부 척도)를 입력받아 디지털 유형(T0~T7)을 판별한다.
 * 임계값은 원본 설계(1.0~5.0 척도, Likert 평균) 기준이므로 내부적으로 +1 하여 사용한다.
 */

export type DigitalTypeCandidate = {
  typeId: DigitalTypeId;
  name: string;
  score: number;
  gapFromMean: number;
  eligible: boolean;
};

export type DigitalTypeResult = {
  primaryType: DigitalTypeId;
  secondaryType: DigitalTypeId | null;
  fallbackCase: "A" | "B" | null;
  latentType: DigitalTypeId | null;
  explanation: string;
  candidates: DigitalTypeCandidate[];
};

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function stdev(nums: number[]): number {
  const m = mean(nums);
  return Math.sqrt(mean(nums.map((n) => (n - m) ** 2)));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** 심층 진단에서 21개 역량이 모두 직접 응답되었는지 확인한다. */
export function canClassifyDigitalType(directlyScoredCompetencyIds: Set<string>): boolean {
  return allCompetencies.every((competency) => directlyScoredCompetencyIds.has(competency.id));
}

export function classifyDigitalType(competencyScores: Record<string, number>): DigitalTypeResult {
  // 내부 0~4 척도를 원본 설계 기준인 1~5 척도로 환산
  const toLikert = (competencyId: string) => (competencyScores[competencyId] ?? 0) + 1;

  const values = allCompetencies.map((competency) => toLikert(competency.id));
  const overallMean = mean(values);
  const sd = stdev(values);
  const isFlat = sd < PARAMS.FLAT_STDEV;

  const areaMeans = Object.fromEntries(
    digcompAreas.map((area) => {
      const ids = allCompetencies.filter((c) => c.areaId === area.id).map((c) => c.id);
      return [area.id, mean(ids.map(toLikert))];
    }),
  ) as Record<DigcompAreaId, number>;

  const candidates: DigitalTypeCandidate[] = digitalTypeDefinitions.map((def) => {
    const coreScores = def.core.map(toLikert);
    const score = mean(coreScores);
    const gapFromMean = score - overallMean;
    const minCore = Math.min(...coreScores);

    const eligible =
      score >= PARAMS.ABS_THRESHOLD && gapFromMean >= PARAMS.REL_GAP && minCore >= PARAMS.MIN_CORE;

    return {
      typeId: def.id,
      name: def.name,
      score: round2(score),
      gapFromMean: round2(gapFromMean),
      eligible,
    };
  });

  // STEP 1. 전략가(T7) 선행 판정 — 플랫 프로필 가드를 적용하지 않는다.
  const areaValues = Object.values(areaMeans);
  const isStrategist =
    areaValues.filter((a) => a >= PARAMS.STRATEGIST_AREA_THRESHOLD).length >= PARAMS.STRATEGIST_AREA_COUNT &&
    areaValues.every((a) => a >= PARAMS.STRATEGIST_AREA_FLOOR) &&
    overallMean >= PARAMS.STRATEGIST_MEAN;

  if (isStrategist) {
    return {
      primaryType: "T7",
      secondaryType: null,
      fallbackCase: null,
      latentType: null,
      candidates,
      explanation: `${digitalTypeT7.name}: 5개 영역이 고르게 높아 조직 전체를 보는 제너럴리스트 유형으로 판별되었습니다.`,
    };
  }

  // STEP 2~3. 적격 후보 정렬 (플랫 프로필이면 스페셜리스트 판별을 건너뛴다)
  const eligible = candidates.filter((c) => c.eligible);

  if (!isFlat && eligible.length > 0) {
    const sorted = [...eligible].sort((a, b) => b.score - a.score || b.gapFromMean - a.gapFromMean);
    const first = sorted[0];
    const second = sorted[1] ?? null;
    const isDual = second !== null && first.score - second.score <= PARAMS.DUAL_TYPE_GAP;

    return {
      primaryType: first.typeId,
      secondaryType: isDual ? second!.typeId : null,
      fallbackCase: null,
      latentType: null,
      candidates,
      explanation: isDual
        ? `${first.name}(${first.score})와 ${second!.name}(${second!.score})의 점수가 근접해 복합 유형으로 판별되었습니다.`
        : `핵심 역량 평균 ${first.score}점, 전체 평균 대비 +${first.gapFromMean}점으로 ${first.name} 유형으로 판별되었습니다.`,
    };
  }

  // STEP 5. 폴백 — 성장 탐색가(T0)
  if (overallMean < PARAMS.FALLBACK_CASE_A_MEAN) {
    return {
      primaryType: "T0",
      secondaryType: null,
      fallbackCase: "A",
      latentType: null,
      candidates,
      explanation: `전체 평균 ${round2(overallMean)}점으로 ${digitalTypeT0.name} 단계입니다. 특정 유형보다 기초 역량 전반의 성장을 먼저 안내합니다.`,
    };
  }

  const latent = [...candidates].sort((a, b) => b.score - a.score || b.gapFromMean - a.gapFromMean)[0];

  return {
    primaryType: "T0",
    secondaryType: null,
    fallbackCase: "B",
    latentType: latent.typeId,
    candidates,
    explanation: isFlat
      ? `역량 간 차이가 작아 탐색 단계로 안내합니다. 상대적으로 ${latent.name}(${latent.score}점) 방향의 잠재력이 보입니다.`
      : `아직 뚜렷한 유형은 없지만 ${latent.name}(${latent.score}점) 유형의 씨앗이 보입니다. 핵심 역량을 키우면 이 유형으로 성장할 수 있습니다.`,
  };
}
