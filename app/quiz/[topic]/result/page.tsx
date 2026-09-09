"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuizFeedbackMessage, getQuizTopic, isQuizTopicId } from "@/lib/quizData";
import { getQuizResult, type QuizResult } from "@/lib/quiz-storage";

export default function QuizResultPage() {
  const params = useParams<{ topic: string }>();
  const rawId = decodeURIComponent(params.topic);

  if (!isQuizTopicId(rawId)) {
    notFound();
  }

  const topic = getQuizTopic(rawId);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    setResult(getQuizResult(topic.id));
  }, [topic.id]);

  if (!result) {
    return (
      <div className="quiz-page">
        <section className="quiz-result-card">
          <span className="quiz-eyebrow">{topic.title}</span>
          <h1>아직 결과가 없어요</h1>
          <p className="muted">퀴즈를 먼저 풀어야 결과를 확인할 수 있어요.</p>
          <Link className="quiz-next-button" href={`/quiz/${topic.id}`}>
            퀴즈 풀러 가기
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <section className="quiz-result-card">
        <span className="quiz-eyebrow">{topic.title}</span>
        <div className="quiz-result-score">
          {result.correct}
          <small> / {result.total}</small>
        </div>
        <p className="quiz-result-message">{getQuizFeedbackMessage(topic.title, result.correct, result.total)}</p>

        <div className="quiz-result-actions">
          <Link className="quiz-next-button" href="/digcomp">
            내 디지털 역량 진단하기
          </Link>
          <Link className="quiz-secondary-button" href={`/quiz/${topic.id}`}>
            다시 풀기
          </Link>
        </div>
        <Link href="/quiz" className="text-button">
          다른 주제 보기
        </Link>
      </section>
    </div>
  );
}
