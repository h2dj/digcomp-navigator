"use client";

import { useCallback, useEffect, useState } from "react";
import type { AssessmentConfig } from "@/lib/assessment-defaults";

type AdminAssessmentEditorProps = {
  title: string;
  description: string;
  loadUrl: string;
  saveUrl: string;
  resumeKey: string;
};

export function AdminAssessmentEditor({
  title,
  description,
  loadUrl,
  saveUrl,
  resumeKey,
}: AdminAssessmentEditorProps) {
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(loadUrl);
      const data = (await response.json()) as AssessmentConfig & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "진단 설정을 불러오지 못했습니다.");
        setConfig(null);
        return;
      }
      setConfig(data);
    } catch {
      setError("진단 설정을 불러오지 못했습니다.");
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [loadUrl]);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig, resumeKey]);

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
      const response = await fetch(saveUrl, {
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
    return <p className="muted">불러오는 중...</p>;
  }

  if (!config) {
    return <p className="form-error">{error || "진단 설정을 불러오지 못했습니다."}</p>;
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h2>{title}</h2>
          <p className="muted">{description}</p>
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
        <h3>응답 척도 (1~5)</h3>
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
        <h3>진단 문항 ({config.questions.length})</h3>
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
    </>
  );
}
