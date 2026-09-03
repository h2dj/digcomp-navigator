"use client";

import Link from "next/link";
import { useState } from "react";
import type { DigcompAreaId } from "@/data/digcomp";
import { areaColors, getDigitalTypeDefinition, sproutColor, type DigitalTypeId } from "@/data/digital-types";
import {
  getAreaLabel,
  getQ4Options,
  q1Options,
  q2ActionOptions,
  q2ThoughtOptions,
  q3Options,
  resolveSingleType,
  resolveSynergyType,
  miniTestSproutTypeId,
  type MiniTestStep,
} from "@/data/mini-type-test";

type Phase = "intro" | MiniTestStep | "result";

const categoryLabels = {
  single: "단일 강점형",
  synergy: "시너지형",
  beginner: "입문형",
} as const;

export function MiniTypeTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [primaryArea, setPrimaryArea] = useState<DigcompAreaId | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [resultTypeId, setResultTypeId] = useState<DigitalTypeId | null>(null);

  function start() {
    setPhase("q1");
  }

  function reset() {
    setPhase("intro");
    setPrimaryArea(null);
    setAnsweredCount(0);
    setResultTypeId(null);
  }

  function handleQ1(index: number) {
    setAnsweredCount(1);
    if (index === 2) {
      setResultTypeId(miniTestSproutTypeId);
      setPhase("result");
      return;
    }
    setPhase(index === 0 ? "q2-thought" : "q2-action");
  }

  function handleQ2(areaId: DigcompAreaId) {
    setPrimaryArea(areaId);
    setAnsweredCount(2);
    setPhase("q3");
  }

  function handleQ3(hasSecondArea: boolean) {
    setAnsweredCount(3);
    if (!hasSecondArea) {
      if (primaryArea) setResultTypeId(resolveSingleType(primaryArea));
      setPhase("result");
      return;
    }
    setPhase("q4");
  }

  function handleQ4(secondAreaId: DigcompAreaId) {
    setAnsweredCount(4);
    if (primaryArea) setResultTypeId(resolveSynergyType(primaryArea, secondAreaId));
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <section className="type-picker-page">
        <div className="intro-icon" aria-hidden="true">
          🧭
        </div>
        <h1>1분 미니 테스트로 미리 알아보기</h1>
        <p className="intro-lead">3~4개의 질문에 답하면 나의 디지털 활용 유형을 가볍게 짐작해볼 수 있어요.</p>
        <p className="intro-copy">
          이름·연락처 입력 없이 바로 시작할 수 있어요. <strong>정확한 진단은 정식 진단</strong>에서 이루어지며,
          이 결과는 참고용이에요.
        </p>
        <button type="button" className="button intro-start" onClick={start}>
          미니 테스트 시작하기 &gt;
        </button>
        <Link href="/diagnosis" className="text-button type-picker-skip">
          바로 정식 진단하러 가기 &gt;
        </Link>
      </section>
    );
  }

  if (phase === "result" && resultTypeId) {
    const type = getDigitalTypeDefinition(resultTypeId);
    const heroColor = type.areas[0] ? areaColors[type.areas[0]] : sproutColor;

    return (
      <>
        <section className="type-hero" style={{ background: `linear-gradient(135deg, ${heroColor} 0%, #1f2f3a 130%)` }}>
          <span className="type-hero-label">미니 테스트 결과 · {categoryLabels[type.category]}</span>
          <h2 className="type-hero-name">
            <span aria-hidden="true">{type.icon}</span> {type.name}
          </h2>
          <p className="type-hero-desc">{type.description}</p>
          <div className="type-hero-tags">
            {type.areas.length > 0 ? (
              type.areas.map((areaId) => (
                <span key={areaId} className="type-tag">
                  <span className="type-tag-dot" style={{ background: areaColors[areaId] }} aria-hidden="true" />
                  {getAreaLabel(areaId)}
                </span>
              ))
            ) : (
              <span className="type-tag">5개 영역 모두 성장 중</span>
            )}
          </div>
        </section>

        <section className="card type-complement-card">
          <span className="eyebrow">실천 팁</span>
          <h2>{type.name}에게 추천해요</h2>
          <p>{type.tip}</p>
        </section>

        <p className="muted mini-test-disclaimer">
          ※ 이 결과는 참고용 미니 테스트이며 정확도를 보장하지 않아요. 답변 데이터는 저장되지 않아요.
        </p>

        <div className="cta-row">
          <Link className="button" href="/diagnosis">
            정식 진단 받아보기 &gt;
          </Link>
          <button type="button" className="button secondary" onClick={reset}>
            다시 하기
          </button>
        </div>
      </>
    );
  }

  const step = phase as MiniTestStep;
  const questionMeta: Record<MiniTestStep, { question: string }> = {
    q1: { question: "낯선 디지털 상황을 마주쳤을 때, 나는?" },
    "q2-thought": { question: "그다음엔 주로?" },
    "q2-action": { question: "그다음엔 주로?" },
    q3: { question: "요즘 이것 말고도 곧잘 하는 다른 게 있나요?" },
    q4: { question: "그중에서도 특히 자주 하게 되는 건?" },
  };

  return (
    <section className="type-picker-page">
      <div className="mini-test-progress" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={4}>
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={`mini-test-dot${index < answeredCount ? " is-filled" : ""}`} />
        ))}
      </div>

      <h1 className="mini-test-question">{questionMeta[step].question}</h1>

      <div className="type-picker-grid mini-test-options">
        {step === "q1"
          ? q1Options.map((option, index) => (
              <button key={option.label} type="button" className="type-picker-card" onClick={() => handleQ1(index)}>
                <strong>{option.label}</strong>
              </button>
            ))
          : null}
        {step === "q2-thought"
          ? q2ThoughtOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="type-picker-card"
                onClick={() => handleQ2(option.areaId)}
              >
                <strong>{option.label}</strong>
                <p className="muted">{getAreaLabel(option.areaId)}</p>
              </button>
            ))
          : null}
        {step === "q2-action"
          ? q2ActionOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                className="type-picker-card"
                onClick={() => handleQ2(option.areaId)}
              >
                <strong>{option.label}</strong>
                <p className="muted">{getAreaLabel(option.areaId)}</p>
              </button>
            ))
          : null}
        {step === "q3"
          ? q3Options.map((option) => (
              <button
                key={option.label}
                type="button"
                className="type-picker-card"
                onClick={() => handleQ3(option.hasSecondArea)}
              >
                <strong>{option.label}</strong>
              </button>
            ))
          : null}
        {step === "q4" && primaryArea
          ? getQ4Options(primaryArea).map((option) => (
              <button
                key={option.label}
                type="button"
                className="type-picker-card"
                onClick={() => handleQ4(option.areaId)}
              >
                <strong>{option.label}</strong>
              </button>
            ))
          : null}
      </div>
    </section>
  );
}
