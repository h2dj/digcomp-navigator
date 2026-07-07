import { proficiencyLevels as digcompProficiencyLevelMeta } from "@/data/digcomp";
import {
  getDeepAssessmentQuestionCount,
  getDeepAssessmentQuestions,
} from "@/data/learning-outcomes";
import {
  isProficiencyLevel,
  parseProficiencyLevel,
  proficiencyLevels,
  type ProficiencyLevel,
} from "@/lib/scoring";

export { getDeepAssessmentQuestions, getDeepAssessmentQuestionCount, isProficiencyLevel, parseProficiencyLevel, proficiencyLevels };

export { digcompProficiencyLevelMeta };

export const deepAssessmentMeta: Record<
  ProficiencyLevel,
  { title: string; lead: string; duration: string; focus: string }
> = {
  초급: {
    title: "초급 심층 진단",
    lead: "DigComp 3.0 학습 결과를 바탕으로 역량별 지식·기술·태도를 점검합니다.",
    duration: "약 20분",
    focus: "기본 도구 활용과 안전한 사용 습관",
  },
  중급: {
    title: "중급 심층 진단",
    lead: "익숙한 업무 맥락에서 역량별 지식·기술·태도를 세분화해 점검합니다.",
    duration: "약 25분",
    focus: "협업·정보 활용의 실무 적용",
  },
  상급: {
    title: "상급 심층 진단",
    lead: "복잡한 과업 해결과 동료 지원에 필요한 지식·기술·태도를 점검합니다.",
    duration: "약 25분",
    focus: "문제 해결과 조직 내 확산",
  },
  최상급: {
    title: "최상급 심층 진단",
    lead: "조직 차원의 개선과 변화 주도에 필요한 지식·기술·태도를 점검합니다.",
    duration: "약 25분",
    focus: "전략적 판단과 변화 주도",
  },
};

export const CONSULTING_URL = "https://ictact.kr/dctest";
