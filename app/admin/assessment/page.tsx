"use client";

import { useCallback, useEffect, useState } from "react";
import type { AssessmentConfig } from "@/lib/assessment-defaults";

export default function AdminAssessmentPage() {
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/assessment-config");
      const data = (await response.json()) as AssessmentConfig & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "진단 설정을 불러오지 못했습니다.");
        return;
      }
      setConfig(data);
    } catch {
      setError("진단 설정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  function updateScaleLabel(value: number, label: string) {
    setConfig((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        responseScale: previous.responseScale.map((item) => (item.value === value ? { ...item, label } : item)),
      };
    });
  }

  function updateQuestionPrompt(id: string, prompt: string) {
    setConfig((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        questions: previous.questions.map((question) => (question.id === id ? { ...question, prompt } : question)),
      };
    });
  }

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/assessment-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as AssessmentConfig & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }

      setConfig(data);
      setMessage("진단 설정을 저장했습니다.");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="muted admin-page">불러오는 중...</p>;
  }

  if (!config) {
    return (
      <section className="admin-page">
        <p className="form-error">{error || "진단 설정을 불러오지 못했습니다."}</p>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Assessment</span>
          <h1>진단 문항 설정</h1>
          <p className="muted">진단 문항과 1~5점 응답 라벨을 수정할 수 있습니다.</p>
          {config.updatedAt ? (
            <p className="muted">마지막 저장: {new Date(config.updatedAt).toLocaleString("ko-KR")}</p>
          ) : null}
        </div>
        <button className="button" type="button" disabled={saving} onClick={() => void handleSave()}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <article className="card admin-section-card">
        <h2>응답 척도 (1~5)</h2>
        <div className="admin-scale-editor">
          {config.responseScale.map((item) => (
            <label key={item.value}>
              <span className="scale-number">{item.value}</span>
              <input
                type="text"
                value={item.label}
                onChange={(event) => updateScaleLabel(item.value, event.target.value)}
              />
            </label>
          ))}
        </div>
      </article>

      <article className="card admin-section-card">
        <h2>진단 문항 ({config.questions.length})</h2>
        <div className="admin-question-editor">
          {config.questions.map((question, index) => (
            <div key={question.id} className="admin-question-item">
              <div className="admin-question-meta">
                <strong>
                  {index + 1}. {question.categoryLabel}
                </strong>
                <span className="muted">{question.areaTitle}</span>
              </div>
              <textarea
                rows={3}
                value={question.prompt}
                onChange={(event) => updateQuestionPrompt(question.id, event.target.value)}
              />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
