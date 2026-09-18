"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DigcompAreaId } from "@/data/digcomp";
import { areaColors, getDigitalTypeDefinition, sproutColor, type DigitalTypeId } from "@/data/digital-types";
import { getDigitalTypeTextEn } from "@/data/digital-types.en";
import { DigitalTypePrescriptionCard } from "@/components/DigitalTypePrescriptionCard";
import {
  classifyMiniTest,
  getAreaAbilityDescription,
  getAreaLabel,
  getMiniTestGateQuestion,
  getMiniTestQuestions,
  isBeginnerCandidateGateAnswer,
  resolveMiniTestTiebreak,
  type MiniTestClassification,
  type MiniTestGateAnswer,
  type MiniTestLocale,
} from "@/data/mini-type-test";
import { storageKeys } from "@/lib/scoring";

type Phase = "intro" | "gate" | "questions" | "tiebreak" | "result";

const categoryLabelsByLocale = {
  ko: { single: "단일 강점형", synergy: "시너지형", beginner: "입문형" },
  en: { single: "Single Strength Type", synergy: "Synergy Type", beginner: "Starter Type" },
} as const satisfies Record<MiniTestLocale, Record<"single" | "synergy" | "beginner", string>>;

const uiStrings = {
  ko: {
    introTitle: "3분 만에 찾는 나의 디지털 활용 유형",
    introLead: "서울공익활동박람회 부스에서 사용한 “나의 디지털 체크카드”를 온라인에서도 그대로 해볼 수 있어요.",
    introCopyPrefix: "이름·연락처 입력 없이 바로 시작할 수 있어요. ",
    introCopyStrong: "정확한 진단은 정식 진단",
    introCopySuffix: "에서 이루어지며, 이 결과는 참고용이에요.",
    startButton: "미니 테스트 시작하기 >",
    skipLink: "바로 정식 진단하러 가기 >",
    languageToggle: "English",
    gateCounter: "가볍게 하나만 답해주세요",
    tiebreakTitle: "동점인 능력 가운데 딱 하나를 선물 받을 수 있다면?",
    tiebreakCopySingle: "가장 갖고 싶은 능력 1가지를 골라주세요.",
    tiebreakCopyMultiple: (n: number) => `가장 갖고 싶은 능력 ${n}가지를 골라주세요.`,
    tiebreakButton: "결과 보기 >",
    resultLabelPrefix: "미니 테스트 결과 · ",
    allAreasGrowing: "5개 영역 모두 성장 중",
    disclaimer: "※ 이 결과는 참고용 미니 테스트이며 정확도를 보장하지 않아요. 답변 데이터는 저장되지 않아요.",
    ctaFull: "정식 진단 받아보기 >",
    ctaRetry: "다시 하기",
    qrCaption: "QR로 정식 진단 이어하기",
    qrAlt: "정식 진단 페이지로 이동하는 QR 코드",
  },
  en: {
    introTitle: "Find Your Digital Type in 3 Minutes",
    introLead:
      "Try the same “My Digital Check Card” online that we used at the Seoul Public Interest Activity Fair booth.",
    introCopyPrefix: "Start right away — no name or contact info needed. ",
    introCopyStrong: "The full assessment gives an accurate result",
    introCopySuffix: "; this one is just for reference.",
    startButton: "Start the Mini Test >",
    skipLink: "Skip to the full assessment >",
    languageToggle: "한국어",
    gateCounter: "Just one quick question first",
    tiebreakTitle: "If you could be given just one of your tied strengths as a gift?",
    tiebreakCopySingle: "Choose the one ability you would want most.",
    tiebreakCopyMultiple: (n: number) => `Choose the ${n} abilities you would want most.`,
    tiebreakButton: "See My Result >",
    resultLabelPrefix: "Mini Test Result · ",
    allAreasGrowing: "Growing in all 5 areas",
    disclaimer: "※ This is a reference-only mini test and does not guarantee accuracy. Your answers are not saved.",
    ctaFull: "Take the Full Assessment >",
    ctaRetry: "Try Again",
    qrCaption: "Scan to continue with the full assessment",
    qrAlt: "QR code linking to the full assessment page",
  },
} satisfies Record<MiniTestLocale, Record<string, string | ((n: number) => string)>>;

export function MiniTypeTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [locale, setLocale] = useState<MiniTestLocale>("ko");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isBeginnerCandidate, setIsBeginnerCandidate] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<DigcompAreaId[]>([]);
  const [tiebreak, setTiebreak] = useState<{ candidates: DigcompAreaId[]; slotsNeeded: number; fixedArea: DigcompAreaId | null } | null>(
    null,
  );
  const [tiebreakPicked, setTiebreakPicked] = useState<DigcompAreaId[]>([]);
  const [resultTypeId, setResultTypeId] = useState<DigitalTypeId | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const t = uiStrings[locale];
  const categoryLabels = categoryLabelsByLocale[locale];
  const miniTestQuestions = getMiniTestQuestions(locale);
  const miniTestGateQuestion = getMiniTestGateQuestion(locale);

  useEffect(() => {
    if (phase !== "result" || !resultTypeId) return;
    let cancelled = false;

    const diagnosisUrl = typeof window !== "undefined" ? `${window.location.origin}/diagnosis` : "/diagnosis";

    void import("qrcode")
      .then((QRCode) => QRCode.toDataURL(diagnosisUrl, { margin: 1, width: 160 }))
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [phase, resultTypeId]);

  function start() {
    setPhase("gate");
    setQuestionIndex(0);
    setSelectedAreas([]);
    setTiebreak(null);
    setTiebreakPicked([]);
  }

  function reset() {
    setPhase("intro");
    setQuestionIndex(0);
    setIsBeginnerCandidate(false);
    setSelectedAreas([]);
    setTiebreak(null);
    setTiebreakPicked([]);
    setResultTypeId(null);
    setQrDataUrl(null);
  }

  function finishWithClassification(classification: MiniTestClassification) {
    if (classification.kind === "result") {
      applyResult(classification.typeId);
      return;
    }

    setTiebreak({
      candidates: classification.candidates,
      slotsNeeded: classification.slotsNeeded,
      fixedArea: classification.fixedArea,
    });
    setTiebreakPicked([]);
    setPhase("tiebreak");
  }

  function applyResult(typeId: DigitalTypeId) {
    setResultTypeId(typeId);
    // 개별 답변은 저장하지 않고, 최종 결과 유형만 진단 화면에 참고로 보여주기 위해 남긴다.
    window.localStorage.setItem(storageKeys.miniTestResultType, typeId);
    setPhase("result");
  }

  function selectGateAnswer(answer: MiniTestGateAnswer) {
    setIsBeginnerCandidate(isBeginnerCandidateGateAnswer(answer));
    setPhase("questions");
  }

  function selectOption(areaId: DigcompAreaId) {
    const nextSelected = [...selectedAreas, areaId];

    if (questionIndex < miniTestQuestions.length - 1) {
      setSelectedAreas(nextSelected);
      setQuestionIndex((index) => index + 1);
      return;
    }

    setSelectedAreas(nextSelected);
    finishWithClassification(classifyMiniTest(nextSelected, isBeginnerCandidate));
  }

  function toggleTiebreakCandidate(areaId: DigcompAreaId) {
    if (!tiebreak) return;

    setTiebreakPicked((previous) => {
      if (previous.includes(areaId)) {
        return previous.filter((id) => id !== areaId);
      }
      if (previous.length >= tiebreak.slotsNeeded) {
        return previous;
      }
      return [...previous, areaId];
    });
  }

  function confirmTiebreak() {
    if (!tiebreak || tiebreakPicked.length !== tiebreak.slotsNeeded) return;
    applyResult(resolveMiniTestTiebreak(tiebreak.fixedArea, tiebreakPicked));
  }

  if (phase === "intro") {
    return (
      <section className="type-picker-page">
        <div className="intro-icon" aria-hidden="true">
          🧭
        </div>
        <button
          type="button"
          className="text-button mini-test-language-toggle"
          onClick={() => setLocale((current) => (current === "ko" ? "en" : "ko"))}
        >
          {t.languageToggle}
        </button>
        <h1>{t.introTitle}</h1>
        <p className="intro-lead">{t.introLead}</p>
        <p className="intro-copy">
          {t.introCopyPrefix}
          <strong>{t.introCopyStrong}</strong>
          {t.introCopySuffix}
        </p>
        <button type="button" className="button intro-start" onClick={start}>
          {t.startButton}
        </button>
        <Link href="/diagnosis" className="text-button type-picker-skip">
          {t.skipLink}
        </Link>
      </section>
    );
  }

  if (phase === "gate") {
    return (
      <section className="type-picker-page">
        <span className="muted mini-test-counter">{t.gateCounter}</span>
        <h1 className="mini-test-question">{miniTestGateQuestion.question}</h1>
        <div className="type-picker-grid mini-test-options">
          {miniTestGateQuestion.options.map((option) => (
            <button
              key={option.key}
              type="button"
              className="type-picker-card"
              onClick={() => selectGateAnswer(option.key)}
            >
              <strong>{option.label}</strong>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (phase === "tiebreak" && tiebreak) {
    const selectionDone = tiebreakPicked.length === tiebreak.slotsNeeded;

    return (
      <section className="type-picker-page">
        <div className="intro-icon" aria-hidden="true">
          🎁
        </div>
        <h1 className="mini-test-question">{t.tiebreakTitle}</h1>
        <p className="intro-copy">
          {tiebreak.slotsNeeded === 1 ? t.tiebreakCopySingle : t.tiebreakCopyMultiple(tiebreak.slotsNeeded)}
        </p>
        <div className="type-picker-grid mini-test-options">
          {tiebreak.candidates.map((areaId) => {
            const isSelected = tiebreakPicked.includes(areaId);
            return (
              <button
                key={areaId}
                type="button"
                className={`type-picker-card mini-test-tiebreak-card${isSelected ? " is-selected" : ""}`}
                onClick={() => toggleTiebreakCandidate(areaId)}
              >
                <strong>
                  {isSelected ? "✓ " : ""}
                  {getAreaLabel(areaId, locale)}
                </strong>
                <p>{getAreaAbilityDescription(areaId, locale)}</p>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="button intro-start"
          disabled={!selectionDone}
          onClick={confirmTiebreak}
        >
          {t.tiebreakButton}
        </button>
      </section>
    );
  }

  if (phase === "result" && resultTypeId) {
    const type = getDigitalTypeDefinition(resultTypeId);
    const typeText = locale === "en" ? getDigitalTypeTextEn(resultTypeId) : { name: type.name, description: type.description };
    const heroColor = type.areas[0] ? areaColors[type.areas[0]] : sproutColor;

    return (
      <section className="section compact">
        <div className="type-hero" style={{ background: `linear-gradient(135deg, ${heroColor} 0%, #1f2f3a 130%)` }}>
          <span className="type-hero-label">
            {t.resultLabelPrefix}
            {categoryLabels[type.category]}
          </span>
          <h2 className="type-hero-name">
            <span aria-hidden="true">{type.icon}</span> {typeText.name}
          </h2>
          <p className="type-hero-desc">{typeText.description}</p>
          <div className="type-hero-tags">
            {type.areas.length > 0 ? (
              type.areas.map((areaId) => (
                <span key={areaId} className="type-tag">
                  <span className="type-tag-dot" style={{ background: areaColors[areaId] }} aria-hidden="true" />
                  {getAreaLabel(areaId, locale)}
                </span>
              ))
            ) : (
              <span className="type-tag">{t.allAreasGrowing}</span>
            )}
          </div>
        </div>

        <DigitalTypePrescriptionCard typeId={type.id} typeName={typeText.name} locale={locale} />

        <p className="muted mini-test-disclaimer">{t.disclaimer}</p>

        <div className="mini-test-cta-block">
          <div className="cta-row">
            <Link className="button" href="/diagnosis">
              {t.ctaFull}
            </Link>
            <button type="button" className="button secondary" onClick={reset}>
              {t.ctaRetry}
            </button>
          </div>
          {qrDataUrl ? (
            <figure className="mini-test-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt={t.qrAlt} width={120} height={120} />
              <figcaption className="muted">{t.qrCaption}</figcaption>
            </figure>
          ) : null}
        </div>
      </section>
    );
  }

  const currentQuestion = miniTestQuestions[questionIndex];

  return (
    <section className="type-picker-page">
      <div
        className="mini-test-progress"
        role="progressbar"
        aria-valuenow={questionIndex}
        aria-valuemin={0}
        aria-valuemax={miniTestQuestions.length}
      >
        {miniTestQuestions.map((question, index) => (
          <span key={question.id} className={`mini-test-dot${index < questionIndex ? " is-filled" : ""}`} />
        ))}
      </div>
      <span className="muted mini-test-counter">
        {questionIndex + 1} / {miniTestQuestions.length}
      </span>

      <h1 className="mini-test-question">{currentQuestion.question}</h1>

      <div className="type-picker-grid mini-test-options">
        {currentQuestion.options.map((option) => (
          <button
            key={option.label}
            type="button"
            className="type-picker-card"
            onClick={() => selectOption(option.areaId)}
          >
            <strong>{option.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
