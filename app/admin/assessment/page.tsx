"use client";

import { useState } from "react";
import { deepAssessmentMeta, getDeepAssessmentQuestionCount } from "@/data/deep-assessment";
import { AdminAssessmentEditor } from "@/components/AdminAssessmentEditor";
import { proficiencyLevels } from "@/lib/assessment-defaults";
import type { ProficiencyLevel } from "@/lib/scoring";

type AssessmentTab = "basic" | ProficiencyLevel;

export default function AdminAssessmentPage() {
  const [tab, setTab] = useState<AssessmentTab>("basic");

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Assessment</span>
          <h1>진단 문항 설정</h1>
          <p className="muted">기본 진단과 숙련도별 심층 진단의 문항·응답 라벨을 수정할 수 있습니다.</p>
        </div>
      </div>

      <div className="admin-assessment-tabs" role="tablist" aria-label="진단 유형">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "basic"}
          className={tab === "basic" ? "active" : undefined}
          onClick={() => setTab("basic")}
        >
          기본 진단
        </button>
        {proficiencyLevels.map((level) => (
          <button
            key={level}
            type="button"
            role="tab"
            aria-selected={tab === level}
            className={tab === level ? "active" : undefined}
            onClick={() => setTab(level)}
          >
            {level} 심층
          </button>
        ))}
      </div>

      {tab === "basic" ? (
        <AdminAssessmentEditor
          title="기본 진단"
          description="15문항 기본 진단의 응답 척도와 문항을 수정합니다."
          loadUrl="/api/admin/assessment-config"
          saveUrl="/api/admin/assessment-config"
          resumeKey="basic"
        />
      ) : (
        <AdminAssessmentEditor
          title={deepAssessmentMeta[tab].title}
          description={`${tab} 수준 심층 진단(${getDeepAssessmentQuestionCount(tab)}문항, 역량별 지식·기술·태도)의 응답 척도와 문항을 수정합니다. ${deepAssessmentMeta[tab].focus}`}
          loadUrl={`/api/admin/assessment-config/deep/${encodeURIComponent(tab)}`}
          saveUrl={`/api/admin/assessment-config/deep/${encodeURIComponent(tab)}`}
          resumeKey={`deep-${tab}`}
          variant="deep"
        />
      )}
    </section>
  );
}
