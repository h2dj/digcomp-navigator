"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { academyInterestOptions, type AcademyInterestId } from "@/data/academy-interests";
import { trackAcademyCtaClick, trackAcademyFormSubmit, trackAcademyView } from "@/lib/analytics";

type PainPoint = { icon: string; title: string; detail: string };

const painPoints: PainPoint[] = [
  { icon: "📣", title: "캠페인을 더 잘 알리고 싶다", detail: "콘텐츠·SNS·영상·이미지 활용" },
  { icon: "🤖", title: "AI를 어디서부터 써야 할지 모르겠다", detail: "조사·글쓰기·회의·업무 자동화" },
  { icon: "📊", title: "데이터는 있는데 활용을 못한다", detail: "정리·분석·시각화·스토리텔링" },
  { icon: "⚡", title: "반복되는 조직 업무를 줄이고 싶다", detail: "협업도구·자동화·업무 설계" },
  { icon: "🔐", title: "활동과 조직을 안전하게 지키고 싶다", detail: "계정·개인정보·디지털 자산" },
  { icon: "🌱", title: "기술을 사회문제 해결에 쓰고 싶다", detail: "오픈소스·시민기술·공익적 활용" },
];

type Topic = { icon: string; area: string; message: string; examples: string; colorVar: string };

const topics: Topic[] = [
  { icon: "🤖", area: "AI × 활동", message: "AI를 내 활동의 동료로", examples: "자료 조사, 글쓰기, 회의 정리, 아이디어 발굴", colorVar: "var(--academy-lime)" },
  { icon: "📊", area: "데이터 × 사회문제", message: "숫자 속에서 이야기를 발견하기", examples: "설문·공개데이터 정리, 분석, 시각화", colorVar: "var(--academy-sky)" },
  { icon: "🎨", area: "콘텐츠 × 캠페인", message: "좋은 활동을 더 잘 전달하기", examples: "이미지, 영상, SNS, 캠페인 콘텐츠", colorVar: "var(--academy-coral)" },
  { icon: "🤝", area: "협업 × 조직", message: "도구보다 중요한 것은 함께 일하는 방법", examples: "온라인 문서, 협업도구, 자동화", colorVar: "var(--academy-lavender)" },
  { icon: "🔐", area: "디지털 안전", message: "활동을 지키는 디지털 습관", examples: "계정, 개인정보, 조직의 디지털 자산 관리", colorVar: "var(--academy-yellow)" },
  { icon: "🌱", area: "오픈소스 × 시민기술", message: "기술을 소비하는 사람에서 함께 만드는 사람으로", examples: "비개발자의 오픈소스 참여, 공익적 기술 활용", colorVar: "var(--academy-mint)" },
];

const learningSteps = [
  { step: "01", title: "활동에서 출발", desc: "지금 하고 있는 활동과 고민에서 시작해요" },
  { step: "02", title: "직접 해보기", desc: "설명을 듣기보다 먼저 도구를 직접 써봐요" },
  { step: "03", title: "동료와 배우기", desc: "같은 고민을 가진 동료와 함께 배워요" },
  { step: "04", title: "반복 실험", desc: "작게 시도하고 다시 내 활동에 적용해봐요" },
];

const timeline = [
  { step: "1단계", title: "카피·브랜딩·디자인 시안 확정", timing: "박람회 전" },
  { step: "2단계", title: "메뉴 교체 및 정적 소개 페이지 공개", timing: "박람회 운영 전" },
  { step: "3단계", title: "이메일+관심 분야 등록 폼 적용", timing: "10월 시범학교 전후" },
  { step: "4단계", title: "디지털 활용 유형과 배움 분야 연결", timing: "자가진단 개편과 연계" },
  { step: "5단계", title: "진단 결과 기반 개인화 추천", timing: "후속 개발" },
];

const brandKeywords = ["실험적", "친근한", "젊은", "공익적", "기술 친화적", "비전문가도 참여 가능한"];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function AcademyPage() {
  const [selectedInterests, setSelectedInterests] = useState<AcademyInterestId[]>([]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    trackAcademyView();
  }, []);

  function toggleInterest(id: AcademyInterestId) {
    setSelectedInterests((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  }

  function handleCtaClick(ctaId: string, focusTarget?: "email" | "note") {
    trackAcademyCtaClick(ctaId);
    if (!focusTarget) return;
    window.setTimeout(() => {
      const target = focusTarget === "email" ? emailInputRef.current : noteInputRef.current;
      target?.focus();
    }, 400);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (selectedInterests.length === 0) {
      setErrorMessage("관심 분야를 1개 이상 선택해주세요.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/academy/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          interests: selectedInterests,
          note,
          source: "baeumdaehak",
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "등록 중 오류가 발생했습니다.");
        return;
      }

      trackAcademyFormSubmit(selectedInterests.length);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류로 등록하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="academy-page">
      {/* 01 HERO */}
      <section className="academy-hero">
        <div className="academy-inner academy-hero-inner">
          <span className="academy-eyebrow">(가칭) 디지털 배움대학</span>
          <h1>
            진단했다면,
            <br />
            <span className="academy-highlight">이제 직접 해볼 차례.</span>
          </h1>
          <p className="academy-hero-lead">
            AI부터 데이터, 콘텐츠, 협업 도구까지.
            <br />
            내 활동에 필요한 디지털을 직접 배우고 실험합니다.
          </p>
          <a
            href="#register"
            className="academy-btn academy-btn-primary"
            onClick={() => handleCtaClick("hero_primary")}
          >
            나에게 맞는 배움 찾아보기 →
          </a>
        </div>
      </section>

      {/* 02 공감 */}
      <section className="academy-section">
        <div className="academy-inner">
          <h2 className="academy-section-title">혹시 이런 생각을 해본 적 있나요?</h2>
          <div className="academy-pain-grid">
            {painPoints.map((point) => (
              <article className="academy-pain-card" key={point.title}>
                <span className="academy-pain-icon" aria-hidden="true">
                  {point.icon}
                </span>
                <strong>{point.title}</strong>
                <span className="academy-pain-detail">{point.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 03 배움 주제 */}
      <section className="academy-section academy-section-tint">
        <div className="academy-inner">
          <h2 className="academy-section-title">이런 것을 함께 배우려고 합니다</h2>
          <p className="academy-section-lead">
            아직 “개설 강좌”라고 확정해 부르기보다, 함께 배우고 실험해볼 주제를 먼저 소개할게요.
          </p>
          <div className="academy-topic-grid">
            {topics.map((topic) => (
              <article className="academy-topic-card" key={topic.area} style={{ background: topic.colorVar }}>
                <span className="academy-topic-icon" aria-hidden="true">
                  {topic.icon}
                </span>
                <span className="academy-topic-area">{topic.area}</span>
                <strong>{topic.message}</strong>
                <span className="academy-topic-examples">{topic.examples}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 04 학습 방식 */}
      <section className="academy-section">
        <div className="academy-inner">
          <h2 className="academy-section-title">배우는 방식도 활동가답게</h2>
          <div className="academy-steps-row">
            {learningSteps.map((step, index) => (
              <div className="academy-step-item" key={step.step}>
                <article className="academy-step-card">
                  <span className="academy-step-number">{step.step}</span>
                  <strong>{step.title}</strong>
                  <span className="academy-step-desc">{step.desc}</span>
                </article>
                {index < learningSteps.length - 1 ? (
                  <span className="academy-step-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 진단 연계 */}
      <section className="academy-section academy-section-tint">
        <div className="academy-inner">
          <h2 className="academy-section-title">진단 결과가 실제 배움으로 이어집니다</h2>
          <div className="academy-flow-row">
            <span className="academy-flow-node">역량 진단</span>
            <span className="academy-flow-arrow" aria-hidden="true">→</span>
            <span className="academy-flow-node">나의 유형 발견</span>
            <span className="academy-flow-arrow" aria-hidden="true">→</span>
            <span className="academy-flow-node">맞는 배움 찾기</span>
            <span className="academy-flow-arrow" aria-hidden="true">→</span>
            <span className="academy-flow-node">활동에서 활용</span>
          </div>
          <div className="academy-cta-row">
            <Link href="/diagnosis" className="academy-btn academy-btn-outline">
              진단하러 가기
            </Link>
            <Link href="/results" className="academy-btn academy-btn-outline">
              내 결과 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 06 신뢰 */}
      <section className="academy-section academy-trust">
        <div className="academy-inner">
          <h2 className="academy-section-title">공동체IT의 교육 경험과 준비 과정</h2>
          <p className="academy-section-lead">
            <a href="https://ictact.kr" target="_blank" rel="noreferrer">
              공동체IT사회적협동조합
            </a>
            은 오랫동안 시민사회 조직과 함께 디지털 도구를 다뤄온 비영리 기술 조직입니다. “(가칭) 디지털
            배움대학”은 이 진단 사이트에서 확인한 활동가들의 디지털 고민을 바탕으로, 2026년 하반기 파일럿
            운영을 준비하고 있습니다.
          </p>
          <ul className="academy-keyword-list">
            {brandKeywords.map((keyword) => (
              <li key={keyword} className="academy-keyword-pill">
                {keyword}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 07 현재 단계 */}
      <section className="academy-section">
        <div className="academy-inner">
          <h2 className="academy-section-title">지금은 이 단계를 함께 만들어가고 있어요</h2>
          <ol className="academy-timeline">
            {timeline.map((item, index) => (
              <li className={`academy-timeline-item${index <= 2 ? " is-current" : ""}`} key={item.step}>
                <span className="academy-timeline-step">{item.step}</span>
                <div className="academy-timeline-body">
                  <strong>{item.title}</strong>
                  <span className="academy-timeline-timing">{item.timing}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 08 CTA + 관심 등록 폼 */}
      <section className="academy-section academy-cta-section" id="register">
        <div className="academy-inner">
          <h2 className="academy-section-title academy-cta-title">당신이라면 무엇을 배우고 싶나요?</h2>
          <div className="academy-cta-row">
            <button
              type="button"
              className="academy-btn academy-btn-primary"
              onClick={() => handleCtaClick("final_learn", "note")}
            >
              내가 배우고 싶은 것 알려주기
            </button>
            <button
              type="button"
              className="academy-btn academy-btn-outline-invert"
              onClick={() => handleCtaClick("final_updates", "email")}
            >
              배움대학 소식 받기
            </button>
          </div>

          {status === "success" ? (
            <div className="academy-form-card academy-form-success">
              <span className="academy-form-success-icon" aria-hidden="true">
                ✓
              </span>
              <strong>등록이 완료되었어요!</strong>
              <p>배움대학 소식과 파일럿 참여 안내를 이메일로 보내드릴게요.</p>
            </div>
          ) : (
            <form className="academy-form-card" onSubmit={handleSubmit}>
              <label className="academy-form-field">
                이메일
                <input
                  ref={emailInputRef}
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <div className="academy-form-field">
                <span>관심 분야 (복수 선택 가능)</span>
                <div className="academy-chip-row">
                  {academyInterestOptions.map((option) => {
                    const isSelected = selectedInterests.includes(option.id);
                    return (
                      <button
                        type="button"
                        key={option.id}
                        className={`academy-chip${isSelected ? " is-selected" : ""}`}
                        aria-pressed={isSelected}
                        onClick={() => toggleInterest(option.id)}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="academy-form-field">
                디지털로 해결해보고 싶은 일 <span className="academy-form-optional">(선택)</span>
                <textarea
                  ref={noteInputRef}
                  rows={3}
                  placeholder="예: 후원자에게 활동 소식을 더 잘 전달하고 싶어요"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </label>

              {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

              <button type="submit" className="academy-btn academy-btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "등록 중..." : "등록하기"}
              </button>
              <p className="academy-form-note">
                등록하신 이메일은 배움대학 소식 안내와 파일럿 참여 안내에만 사용됩니다.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
