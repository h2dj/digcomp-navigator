import type { QuizTopicId } from "@/lib/quizData";

export type QuizResult = {
  correct: number;
  total: number;
  completedAt: string;
};

function resultKey(topicId: QuizTopicId): string {
  return `digcomp-navigator:quiz-result:${topicId}`;
}

export function saveQuizResult(topicId: QuizTopicId, result: QuizResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(resultKey(topicId), JSON.stringify(result));
}

export function getQuizResult(topicId: QuizTopicId): QuizResult | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(resultKey(topicId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function clearQuizResult(topicId: QuizTopicId): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(resultKey(topicId));
}
