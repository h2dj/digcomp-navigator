import { digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import {
  digitalTypeParams as PARAMS,
  getSingleTypeId,
  getSynergyTypeId,
  sproutTypeId,
  type DigitalTypeId,
} from "@/data/digital-types";

/**
 * 영역별 점수(0~4, 앱 내부 척도)를 입력받아 디지털 활용 유형 16종 중 하나를 판별한다.
 * 판정 기준은 100점 환산 기준으로 설계되어 있어, 내부적으로 (score/4)*100 으로 환산해 적용한다.
 */

export type DigitalTypeAreaScore = {
  areaId: DigcompAreaId;
  areaTitle: string;
  percent: number;
};

export type DigitalTypeResult = {
  typeId: DigitalTypeId;
  /** 영역 점수를 100점 환산해 높은 순으로 정렬한 목록(판별 근거 표시용) */
  areaScores: DigitalTypeAreaScore[];
  explanation: string;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function classifyDigitalType(areaScores: Record<string, number>): DigitalTypeResult {
  const percentScores: DigitalTypeAreaScore[] = digcompAreas.map((area) => ({
    areaId: area.id,
    areaTitle: area.title,
    percent: round1(((areaScores[area.id] ?? 0) / 4) * 100),
  }));

  const sorted = [...percentScores].sort((a, b) => b.percent - a.percent);
  const [top1, top2] = sorted;

  if (top1.percent < PARAMS.BEGINNER_MAX) {
    return {
      typeId: sproutTypeId,
      areaScores: sorted,
      explanation: `모든 영역이 아직 기초 단계(최고 ${top1.percent}점)라 디지털 새싹으로 안내합니다.`,
    };
  }

  if (top1.percent >= PARAMS.SYNERGY_MIN && top2.percent >= PARAMS.SYNERGY_MIN && top1.percent - top2.percent <= PARAMS.SYNERGY_GAP) {
    const typeId = getSynergyTypeId(top1.areaId, top2.areaId);
    return {
      typeId,
      areaScores: sorted,
      explanation: `${top1.areaTitle}(${top1.percent}점)와 ${top2.areaTitle}(${top2.percent}점)가 함께 높아 시너지형으로 판별되었습니다.`,
    };
  }

  const typeId = getSingleTypeId(top1.areaId);
  return {
    typeId,
    areaScores: sorted,
    explanation: `${top1.areaTitle}(${top1.percent}점)가 다른 영역보다 뚜렷하게 높아 단일 강점형으로 판별되었습니다.`,
  };
}
