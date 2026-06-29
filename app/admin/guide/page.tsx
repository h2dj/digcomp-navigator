"use client";

import { useCallback, useEffect, useState } from "react";
import { digcompAreas, type DigcompAreaId } from "@/data/digcomp";
import type { GuideLink, GuideLinksConfig } from "@/lib/guide-defaults";
import { getDefaultGuideLinksConfig } from "@/lib/guide-defaults";

const emptyLink = (): GuideLink => ({ title: "", href: "", description: "" });

export default function AdminGuidePage() {
  const [config, setConfig] = useState<GuideLinksConfig>(() => getDefaultGuideLinksConfig());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/guide-links");
      const data = (await response.json()) as GuideLinksConfig & { error?: string };
      if (!response.ok) {
        setError(data.error ?? "개발 가이드 설정을 불러오지 못했습니다.");
        return;
      }
      setConfig(data);
    } catch {
      setError("개발 가이드 설정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  function updateLink(areaId: DigcompAreaId, index: number, field: keyof GuideLink, value: string) {
    setConfig((previous) => ({
      ...previous,
      linksByArea: {
        ...previous.linksByArea,
        [areaId]: previous.linksByArea[areaId].map((link, linkIndex) =>
          linkIndex === index ? { ...link, [field]: value } : link,
        ),
      },
    }));
  }

  function addLink(areaId: DigcompAreaId) {
    setConfig((previous) => ({
      ...previous,
      linksByArea: {
        ...previous.linksByArea,
        [areaId]: [...previous.linksByArea[areaId], emptyLink()],
      },
    }));
  }

  function removeLink(areaId: DigcompAreaId, index: number) {
    setConfig((previous) => ({
      ...previous,
      linksByArea: {
        ...previous.linksByArea,
        [areaId]: previous.linksByArea[areaId].filter((_, linkIndex) => linkIndex !== index),
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/guide-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as GuideLinksConfig & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }

      setConfig(data);
      setMessage("개발 가이드 추천 링크를 저장했습니다.");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="muted admin-page">불러오는 중...</p>;
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="eyebrow">Guide</span>
          <h1>개발 가이드 설정</h1>
          <p className="muted">역량 개발 가이드 페이지의 영역별 추천 링크를 수정할 수 있습니다.</p>
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

      <div className="admin-guide-grid">
        {digcompAreas.map((area) => (
          <article key={area.id} className="card admin-section-card">
            <h2>
              {area.number}. {area.title}
            </h2>
            <p className="muted">{area.nonprofitContext}</p>

            <div className="admin-guide-links">
              {config.linksByArea[area.id].map((link, index) => (
                <div key={`${area.id}-${index}`} className="admin-guide-link-item">
                  <label>
                    사이트명
                    <input
                      type="text"
                      value={link.title}
                      onChange={(event) => updateLink(area.id, index, "title", event.target.value)}
                    />
                  </label>
                  <label>
                    URL
                    <input
                      type="url"
                      value={link.href}
                      onChange={(event) => updateLink(area.id, index, "href", event.target.value)}
                    />
                  </label>
                  <label>
                    설명
                    <textarea
                      rows={2}
                      value={link.description}
                      onChange={(event) => updateLink(area.id, index, "description", event.target.value)}
                    />
                  </label>
                  <button
                    className="text-button danger"
                    type="button"
                    onClick={() => removeLink(area.id, index)}
                    disabled={config.linksByArea[area.id].length <= 1}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <button className="button secondary" type="button" onClick={() => addLink(area.id)}>
              링크 추가
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
