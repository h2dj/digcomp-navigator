import { type InterestTagId } from "@/data/interest-tags";
import type { AssessmentQuestion } from "@/data/digcomp";

/**
 * 기본 진단 문항 중 일부(우선 6개 역량)는 관심 분야에 맞는 예시 문구로 치환해 보여준다.
 * 측정하는 행동(문항의 의도)은 태그와 무관하게 동일하게 유지하고, 문장 속 도메인 예시만 바꾼다.
 * 이렇게 하면 채점 로직과 참여자 간 점수 비교(백분위 등)를 그대로 유지할 수 있다.
 */
export type QuestionExampleVariant = {
  /** {예시} 자리에 아래 examples 값이 치환된다 */
  template: string;
  examples: Record<InterestTagId, string>;
};

export const questionExampleVariants: Partial<Record<string, QuestionExampleVariant>> = {
  "browse-search-filter": {
    template: "{예시}에 필요한 공공 데이터, 연구 보고서, 현장 사례를 적절한 키워드로 찾을 수 있다.",
    examples: {
      general: "사업 기획",
      environment: "기후·환경 이슈 대응",
      "human-rights": "인권 옹호 활동",
      labor: "노동 상담",
      care: "돌봄 서비스 기획",
      "culture-arts": "문화예술 프로그램 기획",
      "org-management": "조직 운영",
      education: "교육 프로그램 기획",
    },
  },
  "evaluate-data": {
    template: "{예시} 관련 온라인 자료의 작성자, 발행 기관, 근거 자료를 확인해 신뢰도를 판단할 수 있다.",
    examples: {
      general: "관심 있는 주제",
      environment: "기후·환경 이슈",
      "human-rights": "인권·시민참여 이슈",
      labor: "노동 제도·정책",
      care: "복지·돌봄 서비스",
      "culture-arts": "문화예술 이슈",
      "org-management": "비영리조직 운영",
      education: "교육 정책",
    },
  },
  "manage-data": {
    template: "{예시} 자료와 문서를 공동 폴더에서 찾기 쉬운 구조와 이름으로 관리할 수 있다.",
    examples: {
      general: "캠페인",
      environment: "환경 캠페인",
      "human-rights": "인권 옹호 캠페인",
      labor: "노동 상담 사례",
      care: "돌봄 서비스 이용자",
      "culture-arts": "문화예술 프로그램",
      "org-management": "조직 운영",
      education: "교육 프로그램",
    },
  },
  citizenship: {
    template: "온라인 캠페인, 설문, 서명, 이벤트 도구를 활용해 {예시} 참여를 설계할 수 있다.",
    examples: {
      general: "시민",
      environment: "기후·환경 행동",
      "human-rights": "인권 옹호",
      labor: "노동권 보장",
      care: "돌봄 정책",
      "culture-arts": "문화예술 접근성",
      "org-management": "조직 활동",
      education: "교육 정책",
    },
  },
  "develop-content": {
    template: "{예시} 목표와 대상에 맞춰 카드뉴스, 숏폼, 뉴스레터 등 형식을 선택할 수 있다.",
    examples: {
      general: "캠페인",
      environment: "환경 캠페인",
      "human-rights": "인권 캠페인",
      labor: "노동 상담 홍보",
      care: "돌봄 서비스 홍보",
      "culture-arts": "문화예술 프로그램 홍보",
      "org-management": "조직 홍보",
      education: "교육 프로그램 홍보",
    },
  },
  "integrate-content": {
    template: "{예시} 보고서, 인터뷰, 사진, 데이터를 결합해 이해하기 쉬운 스토리로 재구성할 수 있다.",
    examples: {
      general: "현장",
      environment: "환경 현장",
      "human-rights": "인권 현장",
      labor: "노동 현장",
      care: "돌봄 현장",
      "culture-arts": "문화예술 현장",
      "org-management": "조직 운영",
      education: "교육 현장",
    },
  },
};

export function getPersonalizedPrompt(
  competencyId: string,
  fallbackPrompt: string,
  tagId: InterestTagId,
): string {
  const variant = questionExampleVariants[competencyId];
  if (!variant) return fallbackPrompt;

  const example = variant.examples[tagId] ?? variant.examples.general;
  return variant.template.replace("{예시}", example);
}

export function hasPersonalizedVariant(competencyId: string): boolean {
  return Boolean(questionExampleVariants[competencyId]);
}

/** 기본 진단 문항 배열 전체에 관심 분야 예시 치환을 적용한다. 일반(기본값)은 원문과 동일하게 유지된다. */
export function personalizeQuestions<T extends Pick<AssessmentQuestion, "competencyId" | "prompt">>(
  questions: T[],
  tagId: InterestTagId,
): T[] {
  if (tagId === "general") return questions;

  return questions.map((question) =>
    hasPersonalizedVariant(question.competencyId)
      ? { ...question, prompt: getPersonalizedPrompt(question.competencyId, question.prompt, tagId) }
      : question,
  );
}
