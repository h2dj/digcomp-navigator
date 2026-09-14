import type { DigcompAreaId } from "@/data/digcomp";

/**
 * DigComp 3.0 5개 역량 영역을 기준으로 한 디지털 활용 유형 16종.
 * 단일 강점형 5종(영역 1개) · 시너지형 10종(영역 2개 조합, 5C2) · 입문형 1종(성장 새싹).
 */
export type DigitalTypeId =
  | "detective"
  | "artisan"
  | "connector"
  | "gatekeeper"
  | "solver"
  | "compass"
  | "homekeeper"
  | "editor"
  | "analyst"
  | "influencer"
  | "leader"
  | "fixer"
  | "allrounder"
  | "meticulous"
  | "guardian"
  | "sprout";

export type DigitalTypeCategory = "single" | "synergy" | "beginner";

export type DigitalTypeDefinition = {
  id: DigitalTypeId;
  name: string;
  category: DigitalTypeCategory;
  /** 단일 강점형은 영역 1개, 시너지형은 2개, 입문형은 빈 배열 */
  areas: DigcompAreaId[];
  icon: string;
  description: string;
  tip: string;
};

/** 영역별 고유 색상(HEX) · 배지·아이콘 배경에 사용 */
export const areaColors: Record<DigcompAreaId, string> = {
  "information-data": "#3B6FD6",
  "communication-collaboration": "#E8735A",
  "content-creation": "#8B5FBF",
  safety: "#3E9B6F",
  "problem-solving": "#D99A2B",
};

/** 입문형(새싹) 전용 색상 — 안전 영역과 같은 그린 계열이지만 톤을 낮췄다 */
export const sproutColor = "#8FB89A";

export const digitalTypeDefinitions: DigitalTypeDefinition[] = [
  // ── 단일 강점형 5종 ──
  {
    id: "detective",
    name: "팩트 파인더",
    category: "single",
    areas: ["information-data"],
    icon: "🔍",
    description: "필요한 정보를 빠르게 찾고 진위를 잘 가려내는 사람",
    tip: "정보를 접할 때 확인한 출처를 주변에도 알려주면 좋아요",
  },
  {
    id: "artisan",
    name: "콘텐츠 장인",
    category: "single",
    areas: ["content-creation"],
    icon: "🛠️",
    description: "사진·영상·문서 등 원하는 결과물을 뚝딱 만들어내는 사람",
    tip: "만든 콘텐츠를 다른 사람과 나누는 공유·협업에도 도전해보세요",
  },
  {
    id: "connector",
    name: "네트워커",
    category: "single",
    areas: ["communication-collaboration"],
    icon: "🤝",
    description: "메신저·화상회의·공유 문서로 사람들을 잘 연결하는 사람",
    tip: "주고받는 정보의 출처와 안전성도 함께 챙기면 더 믿음직해져요",
  },
  {
    id: "gatekeeper",
    name: "수호자",
    category: "single",
    areas: ["safety"],
    icon: "🛡️",
    description: "개인정보와 계정을 안전하게 지키는 습관이 몸에 밴 사람",
    tip: "안전 수칙을 주변에도 알려주면 공동체 전체가 더 안전해져요",
  },
  {
    id: "solver",
    name: "트러블슈터",
    category: "single",
    areas: ["problem-solving"],
    icon: "⚙️",
    description: "기기 오류나 낯선 서비스도 스스로 척척 풀어내는 사람",
    tip: "해결 노하우를 기록해두면 다음번엔 더 빨리 풀 수 있어요",
  },
  // ── 시너지형 10종 (5C2) ──
  {
    id: "compass",
    name: "정보 길잡이",
    category: "synergy",
    areas: ["information-data", "communication-collaboration"],
    icon: "🧭",
    description: "확인된 정보를 골라 주변에 잘 전달하는 사람",
    tip: "판단 기준을 콘텐츠로 정리해 공유하면 영향력이 더 커져요",
  },
  {
    id: "homekeeper",
    name: "정보 살림꾼",
    category: "synergy",
    areas: ["information-data", "safety"],
    icon: "🧺",
    description: "정보를 정리하면서 개인정보도 안전하게 관리하는 사람",
    tip: "정리한 정보를 가족·동료와 나눠보세요",
  },
  {
    id: "editor",
    name: "이야기 편집자",
    category: "synergy",
    areas: ["information-data", "content-creation"],
    icon: "✂️",
    description: "자료를 모아 이해하기 쉬운 콘텐츠로 만들어내는 사람",
    tip: "만든 콘텐츠를 더 많은 사람과 나누는 소통도 시도해보세요",
  },
  {
    id: "analyst",
    name: "분석 해결사",
    category: "synergy",
    areas: ["information-data", "problem-solving"],
    icon: "📊",
    description: "데이터를 바탕으로 문제의 원인을 찾아내는 사람",
    tip: "분석 결과를 쉽게 전달하는 연습도 해보세요",
  },
  {
    id: "influencer",
    name: "확산 메이커",
    category: "synergy",
    areas: ["content-creation", "communication-collaboration"],
    icon: "📣",
    description: "콘텐츠를 만들어 공유하고 반응을 이끌어내는 사람",
    tip: "공유하는 정보의 출처를 한 번 더 확인하면 신뢰도가 올라가요",
  },
  {
    id: "leader",
    name: "커뮤니티 지킴이",
    category: "synergy",
    areas: ["communication-collaboration", "safety"],
    icon: "🎖️",
    description: "온라인 모임이나 단체방을 안전하게 이끌어가는 사람",
    tip: "모임원들에게 안전 수칙을 쉽게 안내해보세요",
  },
  {
    id: "fixer",
    name: "협업 해결사",
    category: "synergy",
    areas: ["communication-collaboration", "problem-solving"],
    icon: "🎓",
    description: "주변의 디지털 고민을 듣고 함께 해결해주는 사람",
    tip: "자주 받는 질문을 정리해두면 더 많은 사람을 도울 수 있어요",
  },
  {
    id: "allrounder",
    name: "만능 메이커",
    category: "synergy",
    areas: ["content-creation", "problem-solving"],
    icon: "🧰",
    description: "필요한 도구나 자동화를 직접 만들어 문제를 해결하는 사람",
    tip: "만든 결과물을 나누면 더 많은 사람에게 도움이 돼요",
  },
  {
    id: "meticulous",
    name: "책임 창작자",
    category: "synergy",
    areas: ["content-creation", "safety"],
    icon: "✅",
    description: "콘텐츠를 만들 때 저작권·개인정보까지 꼼꼼히 챙기는 사람",
    tip: "이 체크포인트를 체크리스트로 만들어 공유해보세요",
  },
  {
    id: "guardian",
    name: "위기 해결사",
    category: "synergy",
    areas: ["safety", "problem-solving"],
    icon: "🚨",
    description: "보안 문제나 오류를 스스로 진단하고 해결하는 사람",
    tip: "겪은 문제와 해결법을 기록해두면 다른 사람도 도울 수 있어요",
  },
  // ── 입문형 1종 ──
  {
    id: "sprout",
    name: "성장 새싹",
    category: "beginner",
    areas: [],
    icon: "🌱",
    description: "이제 막 디지털 활용을 시작해 하나씩 배워가는 사람",
    tip: "관심 있는 영역 하나를 골라 작은 것부터 차근차근 익혀보세요",
  },
];

export const allDigitalTypeIds: DigitalTypeId[] = digitalTypeDefinitions.map((type) => type.id);

export function isDigitalTypeId(value: string): value is DigitalTypeId {
  return (allDigitalTypeIds as string[]).includes(value);
}

export function getDigitalTypeDefinition(id: DigitalTypeId): DigitalTypeDefinition {
  const found = digitalTypeDefinitions.find((type) => type.id === id);
  if (!found) throw new Error(`알 수 없는 디지털 유형 ID입니다: ${id}`);
  return found;
}

export function getSingleTypeId(areaId: DigcompAreaId): DigitalTypeId {
  const found = digitalTypeDefinitions.find((type) => type.category === "single" && type.areas[0] === areaId);
  if (!found) throw new Error(`단일 강점형을 찾을 수 없습니다: ${areaId}`);
  return found.id;
}

export function getSynergyTypeId(areaA: DigcompAreaId, areaB: DigcompAreaId): DigitalTypeId {
  const found = digitalTypeDefinitions.find(
    (type) => type.category === "synergy" && type.areas.includes(areaA) && type.areas.includes(areaB),
  );
  if (!found) throw new Error(`시너지형을 찾을 수 없습니다: ${areaA} + ${areaB}`);
  return found.id;
}

export const sproutTypeId: DigitalTypeId = "sprout";

/** 판정 기준 (영역 점수는 0~100점 환산 기준) */
export const digitalTypeParams = {
  /** 단일 강점형: 최고점 영역이 이 값 이상 */
  SINGLE_MIN: 70,
  /** 단일 강점형: 최고점과 차상위 영역의 점수 차이가 이 값 이상 */
  SINGLE_GAP: 15,
  /** 시너지형: 상위 2개 영역이 모두 이 값 이상 */
  SYNERGY_MIN: 65,
  /** 시너지형: 상위 2개 영역의 점수 차이가 이 값 이내 */
  SYNERGY_GAP: 10,
  /** 입문형: 모든 영역이 이 값 미만이면 새싹 */
  BEGINNER_MAX: 65,
} as const;
