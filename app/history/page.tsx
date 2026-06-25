"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { formatScore, getHistory, type AssessmentResult } from "@/lib/scoring";
import { useUserDataRefresh } from "@/lib/use-user-data-refresh";

export default function HistoryPage() {
  const [history, setHistory] = useState<AssessmentResult[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useUserDataRefresh(refresh);

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">History</span>
        <h1>진단 이력</h1>
        <p>과거 진단 목록과 회차별 영역 점수 변화를 확인합니다.</p>
      </section>

      <section className="section compact">
        {history.length === 0 ? (
          <article className="card">
            <h2>아직 저장된 진단이 없습니다</h2>
            <p>진단을 완료하면 이력에 자동 저장됩니다.</p>
            <Link className="button" href="/diagnosis">
              진단 시작하기
            </Link>
          </article>
        ) : (
          <article className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>회차</th>
                  <th>진단일</th>
                  <th>종합</th>
                  <th>레벨</th>
                  <th>직전 대비</th>
                </tr>
              </thead>
              <tbody>
                {history.map((result, index) => {
                  const previous = history[index + 1];
                  const delta = previous ? result.overallScore - previous.overallScore : null;

                  return (
                    <tr key={result.id}>
                      <td>{history.length - index}회차</td>
                      <td>{new Date(result.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td>{formatScore(result.overallScore)}</td>
                      <td>{result.level}</td>
                      <td>
                        {delta === null ? (
                          <span className="muted">-</span>
                        ) : (
                          <span className={delta >= 0 ? "delta-up" : "delta-down"}>
                            {delta >= 0 ? "+" : ""}
                            {delta.toFixed(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </article>
        )}
      </section>
    </>
  );
}
