import type { DigcompAreaId } from "@/data/digcomp";
import { getSingleTypeId, getSynergyTypeId, sproutTypeId, type DigitalTypeId } from "@/data/digital-types";

/**
 * 정식 진단 전 미리보기용 미니 테스트 — 서울공익활동박람회 부스 "나의 디지털 체크카드"와
 * 동일한 문항·판정 규칙을 온라인으로 그대로 구현한 것.
 * 참고용 미니 테스트이며, 개별 답변은 저장하지 않고 정식 진단에도 반영하지 않는다.
 */

export type MiniTestLocale = "ko" | "en";

export type MiniTestOption = {
  label: string;
  areaId: DigcompAreaId;
};

export type MiniTestQuestion = {
  id: string;
  question: string;
  options: MiniTestOption[];
};

const areaLabelsByLocale: Record<MiniTestLocale, Record<DigcompAreaId, string>> = {
  ko: {
    "information-data": "정보",
    "communication-collaboration": "연결",
    "content-creation": "창작",
    safety: "안전",
    "problem-solving": "해결",
  },
  en: {
    "information-data": "Info",
    "communication-collaboration": "Connect",
    "content-creation": "Create",
    safety: "Safety",
    "problem-solving": "Solve",
  },
};

export function getAreaLabel(areaId: DigcompAreaId, locale: MiniTestLocale = "ko"): string {
  return areaLabelsByLocale[locale][areaId];
}

/** 마지막 한 판(동점 타이브레이크)에서 보여주는 영역별 능력 한 줄 설명 */
const areaAbilityDescriptionsByLocale: Record<MiniTestLocale, Record<DigcompAreaId, string>> = {
  ko: {
    "information-data": "무엇이든 제대로 찾아내는 능력",
    "communication-collaboration": "누구와도 함께 일하는 능력",
    "content-creation": "생각한 것을 멋지게 만들어내는 능력",
    safety: "위험을 미리 알아채고 피하는 능력",
    "problem-solving": "어떤 디지털 문제든 해결하는 능력",
  },
  en: {
    "information-data": "The ability to find anything, done well",
    "communication-collaboration": "The ability to work well with anyone",
    "content-creation": "The ability to turn ideas into something great",
    safety: "The ability to spot and avoid risks early",
    "problem-solving": "The ability to solve any digital problem",
  },
};

export function getAreaAbilityDescription(areaId: DigcompAreaId, locale: MiniTestLocale = "ko"): string {
  return areaAbilityDescriptionsByLocale[locale][areaId];
}

const areaOrder: DigcompAreaId[] = [
  "information-data",
  "communication-collaboration",
  "content-creation",
  "safety",
  "problem-solving",
];

/** START — 성장 새싹 후보 여부만 표시하고, Q1부터는 동일하게 계속 진행한다. */
export type MiniTestGateAnswer = "A" | "B" | "C" | "D";

export type MiniTestGateQuestion = {
  question: string;
  options: { key: MiniTestGateAnswer; label: string }[];
};

const miniTestGateQuestionByLocale: Record<MiniTestLocale, MiniTestGateQuestion> = {
  ko: {
    question: "디지털 도구를 사용할 때 나는?",
    options: [
      { key: "A", label: "대체로 어렵지 않다" },
      { key: "B", label: "익숙한 것은 괜찮지만 새로운 것은 조금 어렵다" },
      { key: "C", label: "누가 알려주지 않으면 왜 어렵다" },
      { key: "D", label: "디지털 기기나 서비스 사용 자체가 부담스럽다" },
    ],
  },
  en: {
    question: "When I use digital tools, I...",
    options: [
      { key: "A", label: "generally find it easy" },
      { key: "B", label: "am fine with familiar things, but new ones are a bit hard" },
      { key: "C", label: "find it hard unless someone shows me" },
      { key: "D", label: "feel burdened just using digital devices or services" },
    ],
  },
};

export function getMiniTestGateQuestion(locale: MiniTestLocale = "ko"): MiniTestGateQuestion {
  return miniTestGateQuestionByLocale[locale];
}

/** 하위 호환용 기본(한국어) 문항 — 기존 import 경로를 그대로 지원한다. */
export const miniTestGateQuestion = miniTestGateQuestionByLocale.ko;

export function isBeginnerCandidateGateAnswer(answer: MiniTestGateAnswer): boolean {
  return answer === "C" || answer === "D";
}

const miniTestQuestionsByLocale: Record<MiniTestLocale, MiniTestQuestion[]> = {
  ko: [
    {
      id: "q1",
      question: "필요한 디지털 정보가 생겼을 때 나는?",
      options: [
        { label: "검색하고 여러 출처를 비교한다", areaId: "information-data" },
        { label: "잘 아는 사람이나 커뮤니티에 물어본다", areaId: "communication-collaboration" },
        { label: "찾은 내용을 내가 보기 좋게 다시 정리한다", areaId: "content-creation" },
        { label: "출처와 개인정보/보안 위험부터 확인한다", areaId: "safety" },
        { label: "일단 필요한 도구를 써보며 답을 찾아간다", areaId: "problem-solving" },
      ],
    },
    {
      id: "q2",
      question: "여러 사람이 함께 일을 시작한다면?",
      options: [
        { label: "단체방/공동문서 등 함께 일할 공간부터 만든다", areaId: "communication-collaboration" },
        { label: "일의 내용을 한눈에 볼 수 있는 자료부터 만든다", areaId: "content-creation" },
        { label: "어떤 도구와 방식이 가장 효율적인지 먼저 정한다", areaId: "problem-solving" },
        { label: "필요한 자료와 참고 사례부터 찾아본다", areaId: "information-data" },
        { label: "공유 범위와 계정/자료 접근 권한부터 확인한다", areaId: "safety" },
      ],
    },
    {
      id: "q3",
      question: "처음 보는 앱이나 AI 도구를 써야 한다면?",
      options: [
        { label: "직접 눌러보고 시행착오를 겪으며 익힌다", areaId: "problem-solving" },
        { label: "사용법/후기/비교 자료를 먼저 찾아본다", areaId: "information-data" },
        { label: "어떤 정보가 수집되는지와 위험 요소를 확인한다", areaId: "safety" },
        { label: "써본 사람에게 팁을 묻거나 함께 해본다", areaId: "communication-collaboration" },
        { label: "바로 작은 결과물을 하나 만들어본다", areaId: "content-creation" },
      ],
    },
    {
      id: "q4",
      question: "온라인에 올릴 자료를 거의 다 만들었습니다. 마지막으로?",
      options: [
        { label: "표현과 디자인을 한 번 더 다듬는다", areaId: "content-creation" },
        { label: "저작권/개인정보/공개 범위를 점검한다", areaId: "safety" },
        { label: "내용과 수치, 출처가 정확한지 확인한다", areaId: "information-data" },
        { label: "다른 사람에게 보여주고 의견을 받는다", areaId: "communication-collaboration" },
        { label: "더 간단하고 효율적인 제작 방법이 없었는지 돌아본다", areaId: "problem-solving" },
      ],
    },
    {
      id: "q5",
      question: "컴퓨터나 스마트폰에서 문제가 생겼습니다. 나는?",
      options: [
        { label: "보안 문제나 계정 이상이 아닌지 먼저 살핀다", areaId: "safety" },
        { label: "설정과 기능을 살펴보며 직접 해결해본다", areaId: "problem-solving" },
        { label: "잘 아는 사람에게 상황을 설명하고 도움을 구한다", areaId: "communication-collaboration" },
        { label: "오류 문구와 증상을 검색해 해결 사례를 찾는다", areaId: "information-data" },
        { label: "필요하면 다른 도구로 우회해 결과물을 완성한다", areaId: "content-creation" },
      ],
    },
    {
      id: "q6",
      question: "주변 사람들이 나에게 디지털 관련 부탁을 한다면 가장 그럴듯한 것은?",
      options: [
        { label: "“이거 보기 좋게 좀 만들어줘.”", areaId: "content-creation" },
        { label: "“이 정보가 맞는지 좀 찾아봐줄 수 있어?”", areaId: "information-data" },
        { label: "“이거 왜 안 되는지 좀 봐주라.”", areaId: "problem-solving" },
        { label: "“이 링크나 서비스, 안전한지 확인 좀 해줘.”", areaId: "safety" },
        { label: "“사람들에게 이것 좀 잘 알려줄래?”", areaId: "communication-collaboration" },
      ],
    },
  ],
  en: [
    {
      id: "q1",
      question: "When I need some digital information, I...",
      options: [
        { label: "search and compare multiple sources", areaId: "information-data" },
        { label: "ask someone I trust or a community", areaId: "communication-collaboration" },
        { label: "reorganize what I found so it looks better", areaId: "content-creation" },
        { label: "check the source and any privacy/security risks first", areaId: "safety" },
        { label: "just start using the tool and figure it out as I go", areaId: "problem-solving" },
      ],
    },
    {
      id: "q2",
      question: "If several people are starting a project together, I...",
      options: [
        { label: "set up a shared space first (group chat, shared doc)", areaId: "communication-collaboration" },
        { label: "create a document that shows the work at a glance", areaId: "content-creation" },
        { label: "decide first which tools and methods would be most efficient", areaId: "problem-solving" },
        { label: "look for reference materials and examples first", areaId: "information-data" },
        { label: "check sharing settings and account/data access permissions first", areaId: "safety" },
      ],
    },
    {
      id: "q3",
      question: "If I have to use an app or AI tool for the first time, I...",
      options: [
        { label: "just try clicking around and learn through trial and error", areaId: "problem-solving" },
        { label: "look up how-to guides, reviews, or comparisons first", areaId: "information-data" },
        { label: "check what information it collects and any risks", areaId: "safety" },
        { label: "ask someone who has used it for tips, or try it together", areaId: "communication-collaboration" },
        { label: "jump in and make a small result right away", areaId: "content-creation" },
      ],
    },
    {
      id: "q4",
      question: "You've almost finished something to post online. The last thing you do?",
      options: [
        { label: "polish the wording and design once more", areaId: "content-creation" },
        { label: "check copyright, privacy, and who can see it", areaId: "safety" },
        { label: "double-check the content, numbers, and sources are accurate", areaId: "information-data" },
        { label: "show it to someone else and get their opinion", areaId: "communication-collaboration" },
        { label: "think about whether there was a simpler, more efficient way to make it", areaId: "problem-solving" },
      ],
    },
    {
      id: "q5",
      question: "Something goes wrong with your computer or phone. You...",
      options: [
        { label: "first check whether it's a security issue or account problem", areaId: "safety" },
        { label: "look through settings and features and try to fix it yourself", areaId: "problem-solving" },
        { label: "explain the situation to someone you trust and ask for help", areaId: "communication-collaboration" },
        { label: "search the error message and symptoms for similar cases", areaId: "information-data" },
        { label: "work around it with a different tool if needed to finish the task", areaId: "content-creation" },
      ],
    },
    {
      id: "q6",
      question: "If people around you asked for digital help, which request sounds most familiar?",
      options: [
        { label: "“Can you make this look nicer?”", areaId: "content-creation" },
        { label: "“Can you check if this information is true?”", areaId: "information-data" },
        { label: "“Can you take a look at why this isn't working?”", areaId: "problem-solving" },
        { label: "“Can you check if this link or service is safe?”", areaId: "safety" },
        { label: "“Can you help spread the word about this?”", areaId: "communication-collaboration" },
      ],
    },
  ],
};

export function getMiniTestQuestions(locale: MiniTestLocale = "ko"): MiniTestQuestion[] {
  return miniTestQuestionsByLocale[locale];
}

/** 하위 호환용 기본(한국어) 문항 — 기존 import 경로를 그대로 지원한다. */
export const miniTestQuestions = miniTestQuestionsByLocale.ko;

export const miniTestSproutTypeId = sproutTypeId;

export type MiniTestClassification =
  | { kind: "result"; typeId: DigitalTypeId }
  | { kind: "tiebreak"; candidates: DigcompAreaId[]; slotsNeeded: number; fixedArea: DigcompAreaId | null };

type ScoreTier = { score: number; areas: DigcompAreaId[] };

function buildTiers(counts: Map<DigcompAreaId, number>): ScoreTier[] {
  const sorted = [...areaOrder].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
  const tiers: ScoreTier[] = [];

  for (const area of sorted) {
    const score = counts.get(area) ?? 0;
    const currentTier = tiers[tiers.length - 1];
    if (currentTier && currentTier.score === score) {
      currentTier.areas.push(area);
    } else {
      tiers.push({ score, areas: [area] });
    }
  }

  return tiers;
}

/**
 * 6개 문항 선택 결과와 START 응답(성장 새싹 후보 여부)을 바탕으로 유형을 판별한다.
 * - 성장 새싹 후보(START에서 C/D)였고 최고점이 2점 이하 → 성장 새싹
 * - 한 영역이 4점 이상이고 2위보다 2점 이상 높다 → 그 영역의 단일 강점형
 * - 그 외에는 점수가 가장 높은 두 영역의 시너지형
 * - 2위(또는 1위) 자리에 동점이 있어 상위 두 영역을 하나로 정할 수 없으면
 *   "마지막 한 판" 타이브레이크가 필요하다는 결과를 반환한다.
 */
export function classifyMiniTest(
  selectedAreaIds: DigcompAreaId[],
  isBeginnerCandidate: boolean,
): MiniTestClassification {
  const counts = new Map<DigcompAreaId, number>(areaOrder.map((areaId) => [areaId, 0]));
  for (const areaId of selectedAreaIds) {
    counts.set(areaId, (counts.get(areaId) ?? 0) + 1);
  }

  const maxScore = Math.max(...areaOrder.map((areaId) => counts.get(areaId) ?? 0));
  if (isBeginnerCandidate && maxScore <= 2) {
    return { kind: "result", typeId: miniTestSproutTypeId };
  }

  const tiers = buildTiers(counts);
  const topTier = tiers[0];

  if (topTier.areas.length === 1) {
    const top1 = topTier.areas[0];
    const secondScore = tiers[1]?.score ?? 0;

    if (topTier.score >= 4 && topTier.score - secondScore >= 2) {
      return { kind: "result", typeId: getSingleTypeId(top1) };
    }

    const secondTier = tiers[1];
    if (!secondTier || secondTier.areas.length === 0) {
      return { kind: "result", typeId: getSingleTypeId(top1) };
    }
    if (secondTier.areas.length === 1) {
      return { kind: "result", typeId: getSynergyTypeId(top1, secondTier.areas[0]) };
    }
    return { kind: "tiebreak", candidates: secondTier.areas, slotsNeeded: 1, fixedArea: top1 };
  }

  if (topTier.areas.length === 2) {
    return { kind: "result", typeId: getSynergyTypeId(topTier.areas[0], topTier.areas[1]) };
  }

  return { kind: "tiebreak", candidates: topTier.areas, slotsNeeded: 2, fixedArea: null };
}

/** 타이브레이크에서 사용자가 고른 영역(들)로 최종 유형을 확정한다. */
export function resolveMiniTestTiebreak(fixedArea: DigcompAreaId | null, picked: DigcompAreaId[]): DigitalTypeId {
  const areas = fixedArea ? [fixedArea, ...picked] : picked;
  if (areas.length < 2) {
    throw new Error("타이브레이크 결과가 부족합니다.");
  }
  return getSynergyTypeId(areas[0], areas[1]);
}
