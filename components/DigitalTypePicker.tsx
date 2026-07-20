"use client";

import { digitalTypeDefinitions, digitalTypeT7, type DigitalTypeId } from "@/data/digital-types";

type DigitalTypePickerProps = {
  onSelect: (typeId: DigitalTypeId | null) => void;
};

const pickableTypes = [...digitalTypeDefinitions, digitalTypeT7];

export function DigitalTypePicker({ onSelect }: DigitalTypePickerProps) {
  return (
    <section className="type-picker-page">
      <div className="intro-icon" aria-hidden="true">
        🧭
      </div>
      <h1>진단 전에 하나만 물어볼게요</h1>
      <p className="intro-lead">아래 7가지 유형 중 지금 나와 가장 가까운 모습을 골라주세요.</p>
      <p className="intro-copy">
        선택한 유형과 관련 있는 역량 위주로 기본 진단 문항을 구성해 드려요. 확신이 없다면 건너뛰어도 괜찮아요.
      </p>

      <div className="type-picker-grid">
        {pickableTypes.map((type) => (
          <button key={type.id} type="button" className="type-picker-card" onClick={() => onSelect(type.id)}>
            <strong>{type.name}</strong>
            <p>{type.description}</p>
            <div className="type-picker-tags">
              {type.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="type-picker-tag">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <button type="button" className="text-button type-picker-skip" onClick={() => onSelect(null)}>
        잘 모르겠어요 · 건너뛰고 진단하기 &gt;
      </button>
    </section>
  );
}
