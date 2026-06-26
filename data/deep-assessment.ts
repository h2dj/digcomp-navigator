import {
  allCompetencies,
  digcompAreas,
  type AssessmentQuestion,
  type DigcompAreaId,
} from "@/data/digcomp";
import type { ProficiencyLevel } from "@/lib/scoring";

export const proficiencyLevels: ProficiencyLevel[] = ["기초", "중급", "고급", "전문가"];

export const deepAssessmentMeta: Record<
  ProficiencyLevel,
  { title: string; lead: string; duration: string; focus: string }
> = {
  기초: {
    title: "기초 심층 진단",
    lead: "디지털 업무를 시작하는 단계에서 필요한 역량을 21개 항목으로 점검합니다.",
    duration: "약 15분",
    focus: "기본 도구 활용과 안전한 사용 습관",
  },
  중급: {
    title: "중급 심층 진단",
    lead: "익숙한 업무 맥락에서 스스로 도구를 선택하고 적용하는 역량을 점검합니다.",
    duration: "약 15분",
    focus: "협업·정보 활용의 실무 적용",
  },
  고급: {
    title: "고급 심층 진단",
    lead: "복잡한 과업 해결과 동료 지원이 가능한 역량을 21개 항목으로 점검합니다.",
    duration: "약 15분",
    focus: "문제 해결과 조직 내 확산",
  },
  전문가: {
    title: "전문가 심층 진단",
    lead: "조직 차원의 개선과 새로운 방식을 설계하는 역량을 점검합니다.",
    duration: "약 15분",
    focus: "전략적 판단과 변화 주도",
  },
};

const promptIndexByLevel: Record<ProficiencyLevel, number> = {
  기초: 0,
  중급: 1,
  고급: 2,
  전문가: 2,
};

/** 숙련도·역량별 심층 진단 문항 (필요 시 개별 문구 수정) */
export const deepPromptOverrides: Partial<Record<ProficiencyLevel, Partial<Record<string, string>>>> = {
  전문가: {
    "identify-gaps":
      "조직의 디지털 역량 격차를 진단하고 학습·개선 로드맵을 설계할 수 있다.",
    "creative-use":
      "디지털 기술을 조합해 조직의 새로운 공익 활동 모델을 설계하고 검증할 수 있다.",
  },
};

function getAreaTitle(areaId: DigcompAreaId): string {
  return digcompAreas.find((area) => area.id === areaId)?.title ?? areaId;
}

export function getDeepAssessmentQuestions(level: ProficiencyLevel): AssessmentQuestion[] {
  const promptIndex = promptIndexByLevel[level];
  const overrides = deepPromptOverrides[level] ?? {};

  return allCompetencies.map((competency) => {
    const defaultPrompt = competency.prompts[promptIndex] ?? competency.prompts[0];
    const prompt = overrides[competency.id] ?? defaultPrompt;

    return {
      id: `${competency.id}:${promptIndex}`,
      competencyId: competency.id,
      promptIndex,
      areaId: competency.areaId,
      areaTitle: getAreaTitle(competency.areaId),
      categoryLabel: competency.shortTitle,
      prompt,
    };
  });
}

export function isProficiencyLevel(value: string): value is ProficiencyLevel {
  return proficiencyLevels.includes(value as ProficiencyLevel);
}

export const CONSULTING_URL = "https://ictact.kr/dctest";
