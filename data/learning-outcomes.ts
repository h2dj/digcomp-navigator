import { allCompetencies, digcompAreas, type AssessmentQuestion, type DigcompAreaId } from "@/data/digcomp";
import { deepAssessmentQuestionBank } from "@/data/deep-assessment-content";
import type { ProficiencyLevel } from "@/lib/scoring";

function getAreaTitle(areaId: DigcompAreaId): string {
  return digcompAreas.find((area) => area.id === areaId)?.title ?? areaId;
}

export function getDeepAssessmentQuestions(level: ProficiencyLevel): AssessmentQuestion[] {
  return allCompetencies.flatMap((competency) => {
    const prompts = deepAssessmentQuestionBank[competency.id]?.[level] ?? [];

    return prompts.map((prompt, index) => ({
      id: `${competency.id}:${level}:${index}`,
      competencyId: competency.id,
      promptIndex: index,
      areaId: competency.areaId,
      areaTitle: getAreaTitle(competency.areaId),
      categoryLabel: competency.shortTitle,
      prompt,
    }));
  });
}

export function getDeepAssessmentQuestionCount(level: ProficiencyLevel): number {
  return getDeepAssessmentQuestions(level).length;
}
