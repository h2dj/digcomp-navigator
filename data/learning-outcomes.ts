import { allCompetencies, digcompAreas, type AssessmentQuestion, type DigcompAreaId } from "@/data/digcomp";
import type { ProficiencyLevel } from "@/lib/scoring";

export type OutcomeType = "knowledge" | "skill" | "attitude";

export type LearningOutcome = {
  id: string;
  competencyId: string;
  areaId: DigcompAreaId;
  level: ProficiencyLevel;
  type: OutcomeType;
  statement: string;
};

export const outcomeTypeLabels: Record<OutcomeType, string> = {
  knowledge: "지식",
  skill: "기술",
  attitude: "태도",
};

const promptIndexByLevel: Record<ProficiencyLevel, number> = {
  초급: 0,
  중급: 1,
  상급: 2,
  최상급: 2,
};

/** DigComp 3.0 Learning Outcomes 기준으로 해당 숙련도·유형이 없는 조합 */
const unavailableOutcomes = new Set<string>([
  "programming:초급:attitude",
  "environment:초급:skill",
  "environment:중급:skill",
]);

const skillOverrides: Partial<Record<ProficiencyLevel, Partial<Record<string, string>>>> = {
  최상급: {
    "identify-gaps":
      "조직의 디지털 역량 격차를 진단하고 학습·개선 로드맵을 설계할 수 있다.",
    "creative-use":
      "디지털 기술을 조합해 조직의 새로운 공익 활동 모델을 설계하고 검증할 수 있다.",
  },
};

const knowledgeTemplates: Record<
  ProficiencyLevel,
  (title: string, shortTitle: string, description: string) => string
> = {
  초급: (title, _shortTitle, description) =>
    `「${title}」과 관련해 ${description.replace(/\.$/, "")}에 필요한 기본 개념과 용어를 이해한다.`,
  중급: (title, _shortTitle, description) =>
    `「${title}」 영역에서 ${description.replace(/\.$/, "")}의 원리와 절차를 설명할 수 있다.`,
  상급: (title, shortTitle, description) =>
    `「${title}」(${shortTitle}) 맥락에서 ${description.replace(/\.$/, "")}을 다양한 상황에 적용할 수 있다.`,
  최상급: (title, shortTitle, description) =>
    `「${title}」(${shortTitle})의 전략적 함의를 평가하고, ${description.replace(/\.$/, "")}을 조직 차원에서 해석할 수 있다.`,
};

const attitudeTemplates: Record<
  ProficiencyLevel,
  (title: string, shortTitle: string) => string
> = {
  초급: (_title, shortTitle) =>
    `${shortTitle} 관련 디지털 활동에서 안전하고 책임감 있는 태도를 유지한다.`,
  중급: (_title, shortTitle) =>
    `${shortTitle} 영역에서 윤리적·비판적 관점을 갖고 디지털 도구를 사용한다.`,
  상급: (_title, shortTitle) =>
    `${shortTitle} 업무에서 동료와 참여자의 권리·다양성을 존중하는 태도로 의사결정한다.`,
  최상급: (_title, shortTitle) =>
    `${shortTitle} 영역에서 조직의 디지털 문화와 가치를 모델링하고 확산한다.`,
};

function outcomeKey(competencyId: string, level: ProficiencyLevel, type: OutcomeType): string {
  return `${competencyId}:${level}:${type}`;
}

function isOutcomeAvailable(competencyId: string, level: ProficiencyLevel, type: OutcomeType): boolean {
  return !unavailableOutcomes.has(outcomeKey(competencyId, level, type));
}

function getAreaTitle(areaId: DigcompAreaId): string {
  return digcompAreas.find((area) => area.id === areaId)?.title ?? areaId;
}

function getSkillStatement(
  competencyId: string,
  title: string,
  prompts: string[],
  level: ProficiencyLevel,
): string {
  const override = skillOverrides[level]?.[competencyId];
  if (override) return override;

  const promptIndex = promptIndexByLevel[level];
  return prompts[promptIndex] ?? prompts[prompts.length - 1] ?? title;
}

function getKnowledgeStatement(
  title: string,
  shortTitle: string,
  description: string,
  level: ProficiencyLevel,
): string {
  return knowledgeTemplates[level](title, shortTitle, description);
}

function getAttitudeStatement(title: string, shortTitle: string, level: ProficiencyLevel): string {
  return attitudeTemplates[level](title, shortTitle);
}

export function getLearningOutcomesForLevel(level: ProficiencyLevel): LearningOutcome[] {
  const outcomes: LearningOutcome[] = [];

  for (const competency of allCompetencies) {
    const types: OutcomeType[] = ["knowledge", "skill", "attitude"];

    for (const type of types) {
      if (!isOutcomeAvailable(competency.id, level, type)) continue;

      const statement =
        type === "skill"
          ? getSkillStatement(competency.id, competency.title, competency.prompts, level)
          : type === "knowledge"
            ? getKnowledgeStatement(competency.title, competency.shortTitle, competency.description, level)
            : getAttitudeStatement(competency.title, competency.shortTitle, level);

      outcomes.push({
        id: outcomeKey(competency.id, level, type),
        competencyId: competency.id,
        areaId: competency.areaId,
        level,
        type,
        statement,
      });
    }
  }

  return outcomes;
}

export function getDeepAssessmentQuestions(level: ProficiencyLevel): AssessmentQuestion[] {
  return getLearningOutcomesForLevel(level).map((outcome) => {
    const competency = allCompetencies.find((item) => item.id === outcome.competencyId);

    return {
      id: outcome.id,
      competencyId: outcome.competencyId,
      promptIndex: promptIndexByLevel[level],
      areaId: outcome.areaId,
      areaTitle: getAreaTitle(outcome.areaId),
      categoryLabel: `${competency?.shortTitle ?? outcome.competencyId} · ${outcomeTypeLabels[outcome.type]}`,
      prompt: outcome.statement,
      outcomeType: outcome.type,
    };
  });
}

export function getDeepAssessmentQuestionCount(level: ProficiencyLevel): number {
  return getDeepAssessmentQuestions(level).length;
}
