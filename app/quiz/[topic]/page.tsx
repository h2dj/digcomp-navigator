"use client";

import Link from "next/link";
import { useRouter, useParams, notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { getQuizTopic, isQuizTopicId, shuffleQuestions, type QuizAnswer } from "@/lib/quizData";
import { saveQuizResult } from "@/lib/quiz-storage";

export default function QuizTopicPage() {
  const router = useRouter();
  const params = useParams<{ topic: string }>();
  const rawId = decodeURIComponent(params.topic);

  if (!isQuizTopicId(rawId)) {
    notFound();
  }

  const topic = getQuizTopic(rawId);
  // 문항 순서는 매 진입마다 섞는다(온라인 공개 시 정답 노출 우려 완화, 기획안 11절).
  const [questions] = useState(() => shuffleQuestions(topic.questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<QuizAnswer | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[index];
  const isLast = index === questions.length - 1;
  const isCorrect = selected !== null && selected === currentQuestion.answer;

  const progressPercent = useMemo(() => Math.round((index / questions.length) * 100), [index, questions.length]);

  function selectAnswer(answer: QuizAnswer) {
    if (selected !== null) return;
    setSelected(answer);
    if (answer === currentQuestion.answer) {
      setCorrectCount((count) => count + 1);
    }
  }

  function goNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }

    saveQuizResult(topic.id, {
      correct: correctCount,
      total: questions.length,
      completedAt: new Date().toISOString(),
    });
    router.push(`/quiz/${topic.id}/result`);
  }

  return (
    <div className="quiz-page">
      <section className="quiz-progress-header">
        <div className="quiz-progress-row">
          <span>{topic.title}</span>
          <span className="muted">
            {index + 1} / {questions.length}
          </span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </section>

      <section className="quiz-question-card">
        <p className="quiz-question-text">{currentQuestion.question}</p>
      </section>

      <div className="quiz-options-row">
        <button
          type="button"
          className={`quiz-option-button${selected === "O" ? " is-selected" : ""}${
            selected !== null && currentQuestion.answer === "O" ? " is-answer" : ""
          }`}
          onClick={() => selectAnswer("O")}
          disabled={selected !== null}
        >
          O{selected !== null && currentQuestion.answer === "O" ? <span aria-hidden="true"> ✓</span> : null}
        </button>
        <button
          type="button"
          className={`quiz-option-button${selected === "X" ? " is-selected" : ""}${
            selected !== null && currentQuestion.answer === "X" ? " is-answer" : ""
          }`}
          onClick={() => selectAnswer("X")}
          disabled={selected !== null}
        >
          X{selected !== null && currentQuestion.answer === "X" ? <span aria-hidden="true"> ✓</span> : null}
        </button>
      </div>

      {selected !== null ? (
        <>
          <section className={`quiz-feedback-card${isCorrect ? " is-correct" : " is-incorrect"}`}>
            <strong>{isCorrect ? "정답이에요" : `아쉬워요, 정답은 ${currentQuestion.answer}예요`}</strong>
            <p>{currentQuestion.explanation}</p>
          </section>

          <button type="button" className="quiz-next-button" onClick={goNext}>
            {isLast ? "결과 보기" : "다음 문항"}
          </button>
        </>
      ) : null}

      <div className="quiz-exit-link">
        <Link href="/quiz" className="text-button">
          다른 주제 보기
        </Link>
      </div>
    </div>
  );
}
