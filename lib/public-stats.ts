import type { DigcompAreaId } from "@/data/digcomp";

export const MINIMUM_SEGMENT_SIZE = 10;

export type DistributionItem = {
  name: string;
  value: number;
};

export type AggregateStats = {
  totalParticipants: number;
  completedAssessments: number;
  averageScore: number | null;
  medianScore: number | null;
  areaAverages: Record<DigcompAreaId, number | null>;
  roleDistribution: DistributionItem[];
  organizationDistribution: DistributionItem[];
  roleSegmentStats: SegmentStat[];
  organizationSegmentStats: SegmentStat[];
};

/** @deprecated AggregateStats 사용 */
export type AggregateCounts = Pick<AggregateStats, "totalParticipants" | "completedAssessments">;

export type SegmentStat = {
  name: string;
  participantCount: number;
  averageScore: number;
};

/** @deprecated MINIMUM_SEGMENT_SIZE 사용 */
export const publicStats = {
  minimumSegmentSize: MINIMUM_SEGMENT_SIZE,
};

export function canPublishSegment(segment: Pick<SegmentStat, "participantCount">): boolean {
  return segment.participantCount >= MINIMUM_SEGMENT_SIZE;
}

export function findPublishedSegmentAverage(segments: SegmentStat[], segmentName: string): number | null {
  const segment = segments.find((item) => item.name === segmentName);
  if (!segment || !canPublishSegment(segment)) {
    return null;
  }
  return segment.averageScore;
}
