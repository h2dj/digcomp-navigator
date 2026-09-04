import type { DigcompAreaId } from "@/data/digcomp";
import { getSingleTypeId, getSynergyTypeId, sproutTypeId, type DigitalTypeId } from "@/data/digital-types";

/**
 * 정식 진단 전 미리보기용 미니 테스트 — 순서도형(분기형) 구조.
 * 최소 3문항(단일 강점형 도달), 최대 4문항(시너지형 도달)이면 결과에 도착한다.
 * 참고용 미니 테스트이며, 답변은 저장하지 않고 정식 진단에도 반영하지 않는다.
 */

export type MiniTestStep = "q1" | "q2-thought" | "q2-action" | "q3" | "q4";

export type MiniTestOption = {
  label: string;
};

const areaLabels: Record<DigcompAreaId, string> = {
  "information-data": "정보문해력",
  "communication-collaboration": "소통과 협업",
  "content-creation": "콘텐츠 제작",
  safety: "안전",
  "problem-solving": "문제해결",
};

export function getAreaLabel(areaId: DigcompAreaId): string {
  return areaLabels[areaId];
}

export const q1Options: MiniTestOption[] = [
  { label: "먼저 알아보고 생각한다" },
  { label: "일단 사람이나 결과물과 함께 움직인다" },
  { label: "아직 낯설고 조금씩 배우는 중이다" },
];

export const q2ThoughtOptions: { label: string; areaId: DigcompAreaId }[] = [
  { label: "원인과 근거를 파고든다", areaId: "information-data" },
  { label: "이것저것 시도하며 고친다", areaId: "problem-solving" },
];

export const q2ActionOptions: { label: string; areaId: DigcompAreaId }[] = [
  { label: "사람들과 나누고 챙긴다", areaId: "communication-collaboration" },
  { label: "결과물을 만들어서 보여준다", areaId: "content-creation" },
  { label: "위험 요소부터 챙긴다", areaId: "safety" },
];

export const q3Options: { label: string; hasSecondArea: boolean }[] = [
  { label: "아니요, 이게 제일 익숙해요", hasSecondArea: false },
  { label: "네, 하나 더 있어요", hasSecondArea: true },
];

const allAreaIds: DigcompAreaId[] = [
  "information-data",
  "communication-collaboration",
  "content-creation",
  "safety",
  "problem-solving",
];

export function getQ4Options(primaryAreaId: DigcompAreaId): { label: string; areaId: DigcompAreaId }[] {
  return allAreaIds.filter((areaId) => areaId !== primaryAreaId).map((areaId) => ({ label: areaLabels[areaId], areaId }));
}

export function resolveSingleType(areaId: DigcompAreaId): DigitalTypeId {
  return getSingleTypeId(areaId);
}

export function resolveSynergyType(primaryAreaId: DigcompAreaId, secondaryAreaId: DigcompAreaId): DigitalTypeId {
  return getSynergyTypeId(primaryAreaId, secondaryAreaId);
}

export const miniTestSproutTypeId = sproutTypeId;
