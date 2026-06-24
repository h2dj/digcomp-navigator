"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AssessmentResult, AreaScore } from "@/lib/scoring";
import { digcompAreas } from "@/data/digcomp";

type ScoreChartsProps = {
  result: AssessmentResult;
};

export function RadarScoreChart({ result }: ScoreChartsProps) {
  const data = result.areaScores.map((area) => ({
    area: compactAreaName(area.title),
    나의점수: area.score,
    전체평균: area.average,
  }));

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} outerRadius={105}>
          <PolarGrid />
          <PolarAngleAxis dataKey="area" tick={{ fill: "#3d5a4c", fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 4]} tickCount={5} tick={{ fill: "#5c6b62", fontSize: 11 }} />
          <Radar dataKey="전체평균" stroke="#c8d9c4" fill="#dce8dc" fillOpacity={0.4} />
          <Radar dataKey="나의점수" stroke="#4f6f5e" fill="#6b9b7a" fillOpacity={0.45} />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaComparisonChart({ scores }: { scores: AreaScore[] }) {
  const data = scores.map((area) => ({
    area: compactAreaName(area.title),
    나의점수: area.score,
    전체평균: area.average,
  }));

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="area" tick={{ fill: "#3d5a4c", fontSize: 12 }} />
          <YAxis domain={[0, 4]} tickCount={5} tick={{ fill: "#5c6b62", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="전체평균" fill="#c8d9c4" radius={[8, 8, 0, 0]} />
          <Bar dataKey="나의점수" fill="#4f6f5e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrowthLineChart({ history }: { history: AssessmentResult[] }) {
  const ordered = [...history].reverse();
  const data = ordered.map((result, index) => {
    const row: Record<string, string | number> = {
      round: `${index + 1}회차`,
      종합: result.overallScore,
    };

    result.areaScores.forEach((score) => {
      row[compactAreaName(score.title)] = score.score;
    });

    return row;
  });

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="round" tick={{ fill: "#3d5a4c", fontSize: 12 }} />
          <YAxis domain={[0, 4]} tickCount={5} tick={{ fill: "#5c6b62", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="종합" stroke="#3d5a4c" strokeWidth={3} dot={{ r: 4 }} />
          {digcompAreas.map((area, index) => (
            <Line
              key={area.id}
              type="monotone"
              dataKey={compactAreaName(area.title)}
              stroke={lineColors[index]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const lineColors = ["#4f6f5e", "#6b9b7a", "#b8753a", "#7a9e8e", "#5c7a6a"];

function compactAreaName(title: string): string {
  return title.replace("정보·데이터 리터러시", "정보·데이터").replace("커뮤니케이션·협업", "소통·협업");
}
