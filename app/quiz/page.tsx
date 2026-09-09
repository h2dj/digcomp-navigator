import Link from "next/link";
import { quizTopics } from "@/lib/quizData";

export default function QuizPage() {
  return (
    <div className="quiz-page">
      <section className="quiz-hero">
        <span className="quiz-eyebrow">OX 퀴즈</span>
        <h1>디지털 이야기를 재미로 알아봐요</h1>
        <p className="quiz-hero-lead">
          6개 주제, 총 {quizTopics.reduce((sum, topic) => sum + topic.questions.length, 0)}개의 O/X 문항으로 AI·환경·보안 같은
          디지털 이슈를 가볍게 알아가요.
        </p>
      </section>

      <section className="quiz-topic-grid">
        {quizTopics.map((topic) => (
          <Link key={topic.id} href={`/quiz/${topic.id}`} className="quiz-topic-card">
            <span className="quiz-topic-icon" aria-hidden="true">
              {topic.icon}
            </span>
            <strong>{topic.title}</strong>
            <span className="quiz-topic-count">{topic.questions.length}문항</span>
          </Link>
        ))}
      </section>

      <div className="quiz-diagnosis-cta">
        <Link href="/digcomp" className="quiz-link-cta">
          내 디지털 역량도 알아보기 →
        </Link>
      </div>
    </div>
  );
}
