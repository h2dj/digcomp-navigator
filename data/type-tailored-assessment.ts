import {
  assessmentCompetencyIds,
  digcompAreas,
  questionsPerArea,
  type AssessmentQuestion,
} from "@/data/digcomp";
import { getDigitalTypeDefinition, type DigitalTypeId } from "@/data/digital-types";

/**
 * 선택한 디지털 유형의 핵심·연관 역량을 영역별로 우선 배치해 기본 진단 문항을 구성한다.
 * 영역당 문항 수(3문항)와 전체 문항 수(15문항)는 기본 진단과 동일하게 유지한다.
 * 유형을 고르지 않았거나 특정 역량 조합이 없는 유형(T7)은 기존 기본 문항 구성과 같은 결과를 낸다.
 */
export function getAssessmentQuestionsForType(typeId: DigitalTypeId | null): AssessmentQuestion[] {
  const typeDef = typeId ? getDigitalTypeDefinition(typeId) : null;
  const priorityIds = typeDef ? [...typeDef.core, ...typeDef.related] : [];

  return digcompAreas.flatMap((area) => {
    const defaultIds =
      assessmentCompetencyIds[area.id] ?? area.competencies.slice(0, questionsPerArea).map((competency) => competency.id);
    const areaCompetencyIds = area.competencies.map((competency) => competency.id);
    const candidateOrder = [
      ...priorityIds.filter((id) => areaCompetencyIds.includes(id)),
      ...defaultIds,
      ...areaCompetencyIds,
    ];

    const chosenIds: string[] = [];
    for (const id of candidateOrder) {
      if (chosenIds.includes(id)) continue;
      chosenIds.push(id);
      if (chosenIds.length === questionsPerArea) break;
    }

    return chosenIds.map((id) => {
      const competency = area.competencies.find((item) => item.id === id)!;
      return {
        id: `${competency.id}:0`,
        competencyId: competency.id,
        promptIndex: 0,
        areaId: area.id,
        areaTitle: area.title,
        categoryLabel: competency.shortTitle,
        prompt: competency.prompts[0],
      };
    });
  });
}
