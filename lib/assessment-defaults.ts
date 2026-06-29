import { assessmentQuestions, responseScale } from "@/data/digcomp";
import { getDeepAssessmentQuestions, proficiencyLevels } from "@/data/deep-assessment";
import type { ProficiencyLevel } from "@/lib/scoring";

export type ResponseScaleItem = {
  value: number;
  label: string;
  helper: string;
};

export type AssessmentQuestionConfig = {
  id: string;
  competencyId: string;
  promptIndex: number;
  areaId: string;
  areaTitle: string;
  categoryLabel: string;
  prompt: string;
};

export type AssessmentConfig = {
  responseScale: ResponseScaleItem[];
  questions: AssessmentQuestionConfig[];
  updatedAt?: string;
};

export function getDefaultAssessmentConfig(): AssessmentConfig {
  return {
    responseScale: responseScale.map((item) => ({ ...item })),
    questions: assessmentQuestions.map((question) => ({ ...question })),
  };
}

export function getDefaultDeepAssessmentConfig(level: ProficiencyLevel): AssessmentConfig {
  return {
    responseScale: responseScale.map((item) => ({ ...item })),
    questions: getDeepAssessmentQuestions(level).map((question) => ({ ...question })),
  };
}

export { proficiencyLevels };
