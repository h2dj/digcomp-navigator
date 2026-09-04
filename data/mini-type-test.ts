import type { DigcompAreaId } from "@/data/digcomp";
import { getSingleTypeId, getSynergyTypeId, sproutTypeId, type DigitalTypeId } from "@/data/digital-types";

/**
 * 정식 진단 전 미리보기용 미니 테스트 — 답변 집계 방식.
 * 5개 문항에 모두 답한 뒤 영역별 선택 횟수를 집계해 결과를 정한다.
 * 참고용 미니 테스트이며, 개별 답변은 저장하지 않고 정식 진단에도 반영하지 않는다.
 */

export type MiniTestOption = {
  label: string;
  areaId: DigcompAreaId;
};

export type MiniTestQuestion = {
  id: string;
  question: string;
  options: MiniTestOption[];
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

const areaOrder: DigcompAreaId[] = [
  "information-data",
  "communication-collaboration",
  "content-creation",
  "safety",
  "problem-solving",
];

export const miniTestQuestions: MiniTestQuestion[] = [
  {
    id: "q1",
    question: "새로운 앱이나 서비스를 처음 써야 할 때, 나는?",
    options: [
      { label: "후기나 정보를 먼저 찾아본다", areaId: "information-data" },
      { label: "주변 사람에게 물어보거나 같이 써본다", areaId: "communication-collaboration" },
      { label: "써보면서 나만의 사용법을 정리해본다", areaId: "content-creation" },
      { label: "개인정보 설정부터 확인한다", areaId: "safety" },
      { label: "일단 이것저것 눌러보며 익힌다", areaId: "problem-solving" },
    ],
  },
  {
    id: "q2",
    question: "온라인에서 헷갈리는 정보를 봤을 때, 나는?",
    options: [
      { label: "다른 자료와 비교하며 사실을 확인한다", areaId: "information-data" },
      { label: "아는 사람에게 물어보고 의견을 나눈다", areaId: "communication-collaboration" },
      { label: "요약하거나 정리해서 기록해둔다", areaId: "content-creation" },
      { label: "출처가 불분명하면 일단 넘긴다", areaId: "safety" },
      { label: "검색 방법을 바꿔가며 직접 찾아본다", areaId: "problem-solving" },
    ],
  },
  {
    id: "q3",
    question: "사진이나 문서를 정리할 때, 나는?",
    options: [
      { label: "필요한 자료를 잘 찾아서 모은다", areaId: "information-data" },
      { label: "다른 사람과 공유 폴더로 함께 정리한다", areaId: "communication-collaboration" },
      { label: "보기 좋게 편집하고 꾸민다", areaId: "content-creation" },
      { label: "백업과 비밀번호 설정을 꼭 챙긴다", areaId: "safety" },
      { label: "자동으로 정리되는 방법을 찾아 적용한다", areaId: "problem-solving" },
    ],
  },
  {
    id: "q4",
    question: "온라인 모임이나 단체 대화방에서, 나는?",
    options: [
      { label: "필요한 정보를 찾아서 공유한다", areaId: "information-data" },
      { label: "대화를 이끌고 사람들을 챙긴다", areaId: "communication-collaboration" },
      { label: "재미있는 콘텐츠를 만들어 올린다", areaId: "content-creation" },
      { label: "수상한 링크를 조심하라고 알린다", areaId: "safety" },
      { label: "오류가 생기면 나서서 해결한다", areaId: "problem-solving" },
    ],
  },
  {
    id: "q5",
    question: "기기나 프로그램에 문제가 생겼을 때, 나는?",
    options: [
      { label: "원인을 검색해서 찾아본다", areaId: "information-data" },
      { label: "잘 아는 사람에게 물어본다", areaId: "communication-collaboration" },
      { label: "화면을 캡처해 기록해둔다", areaId: "content-creation" },
      { label: "혹시 모를 데이터 유출을 걱정한다", areaId: "safety" },
      { label: "이것저것 눌러보며 스스로 고쳐본다", areaId: "problem-solving" },
    ],
  },
];

export const miniTestSproutTypeId = sproutTypeId;

/**
 * 영역별 선택 횟수를 집계해 유형을 판별한다.
 * - 1위 영역이 1점 이하(고르게 분산)면 → 새싹
 * - 1위 영역이 3점 이상이면 → 단일 강점형
 * - 1위 · 2위가 둘 다 2점으로 동점이면 → 시너지형
 * - 그 외(1위 2점, 2위 1점 이하 등)에는 → 1위 영역의 단일 강점형
 */
export function tallyMiniTestResult(selectedAreaIds: DigcompAreaId[]): DigitalTypeId {
  const counts = new Map<DigcompAreaId, number>(areaOrder.map((areaId) => [areaId, 0]));
  for (const areaId of selectedAreaIds) {
    counts.set(areaId, (counts.get(areaId) ?? 0) + 1);
  }

  const sorted = [...areaOrder].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top1Count = counts.get(top1) ?? 0;
  const top2Count = counts.get(top2) ?? 0;

  if (top1Count <= 1) return miniTestSproutTypeId;
  if (top1Count >= 3) return getSingleTypeId(top1);
  if (top2Count === 2) return getSynergyTypeId(top1, top2);
  return getSingleTypeId(top1);
}
