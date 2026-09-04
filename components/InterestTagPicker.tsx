"use client";

import Link from "next/link";
import { interestTags, type InterestTagId } from "@/data/interest-tags";

type InterestTagPickerProps = {
  onSelect: (tagId: InterestTagId) => void;
};

export function InterestTagPicker({ onSelect }: InterestTagPickerProps) {
  return (
    <section className="type-picker-page">
      <div className="intro-icon" aria-hidden="true">
        🌱
      </div>
      <h1>어떤 분야에서 활동하고 계신가요?</h1>
      <p className="intro-lead">고르신 분야에 와닿는 예시로 일부 문항을 다듬어 드려요.</p>
      <p className="intro-copy">확신이 없다면 건너뛰어도 괜찮아요. 채점 방식은 동일하게 유지돼요.</p>

      <Link href="/mini-test" className="mini-test-entry-card">
        <span className="mini-test-entry-badge">1분</span>
        <span className="mini-test-entry-icon" aria-hidden="true">
          🧭
        </span>
        <span className="mini-test-entry-copy">
          <strong>미니 테스트로 내 디지털 활용 유형 먼저 알아보기</strong>
          <span> 5개 질문으로 16가지 유형 중 나와 가까운 유형을 가볍게 짐작해봐요</span>
        </span>
        <span className="mini-test-entry-arrow" aria-hidden="true">
          &gt;
        </span>
      </Link>

      <div className="type-picker-grid">
        {interestTags.map((tag) => (
          <button key={tag.id} type="button" className="type-picker-card" onClick={() => onSelect(tag.id)}>
            <strong>{tag.label}</strong>
            <p>{tag.description}</p>
          </button>
        ))}
      </div>

      <button type="button" className="text-button type-picker-skip" onClick={() => onSelect("general")}>
        잘 모르겠어요 · 건너뛰고 진단하기 &gt;
      </button>
    </section>
  );
}
