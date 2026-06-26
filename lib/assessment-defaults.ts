import { assessmentQuestions, responseScale } from "@/data/digcomp";

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
