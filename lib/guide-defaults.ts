import { digcompAreas, type DigcompAreaId } from "@/data/digcomp";

export type GuideLink = {
  title: string;
  href: string;
  description: string;
};

export type GuideLinksConfig = {
  linksByArea: Record<DigcompAreaId, GuideLink[]>;
  updatedAt?: string;
};

const defaultLinksByArea: Record<DigcompAreaId, GuideLink[]> = {
  "information-data": [
    {
      title: "공공데이터포털",
      href: "https://www.data.go.kr",
      description: "공익 의제 조사에 활용할 수 있는 공공 데이터 탐색",
    },
    {
      title: "팩트체크넷",
      href: "https://factchecker.or.kr",
      description: "온라인 정보 검증과 사실 확인 사례 학습",
    },
  ],
  "communication-collaboration": [
    {
      title: "Google for Nonprofits",
      href: "https://www.google.com/nonprofits/",
      description: "비영리 협업 도구와 운영 사례",
    },
    {
      title: "Slack Nonprofit Guide",
      href: "https://slack.com/intl/ko-kr/solutions/nonprofit",
      description: "팀 커뮤니케이션 설계 참고",
    },
  ],
  "content-creation": [
    {
      title: "Creative Commons Korea",
      href: "https://creativecommons.org/licenses/?lang=ko",
      description: "저작권과 오픈 라이선스 이해",
    },
    {
      title: "Canva Design School",
      href: "https://www.canva.com/learn/",
      description: "캠페인 콘텐츠 제작 기초",
    },
  ],
  safety: [
    {
      title: "개인정보보호위원회",
      href: "https://www.pipc.go.kr",
      description: "개인정보 보호 법제와 가이드라인",
    },
    {
      title: "Google Safety Center",
      href: "https://safety.google/intl/ko/",
      description: "계정 보안과 피싱 예방 학습",
    },
  ],
  "problem-solving": [
    {
      title: "TechSoup Korea",
      href: "https://www.techsoupkorea.kr",
      description: "비영리 디지털 도구와 교육 자원",
    },
    {
      title: "NPO스쿨",
      href: "https://www.snpo.kr/bbs/board.php?bo_table=npo_aca",
      description: "공익활동가 역량 강화 교육 탐색",
    },
  ],
};

export function getDefaultGuideLinksConfig(): GuideLinksConfig {
  return {
    linksByArea: Object.fromEntries(
      digcompAreas.map((area) => [area.id, defaultLinksByArea[area.id].map((link) => ({ ...link }))]),
    ) as Record<DigcompAreaId, GuideLink[]>,
  };
}

export const guideAreaIds = digcompAreas.map((area) => area.id);
