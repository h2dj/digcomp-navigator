import type { DigitalTypeId } from "@/data/digital-types";

export type DigitalTypeTextEn = {
  name: string;
  description: string;
};

/**
 * 미니 테스트 영문 모드에서 사용하는 유형 이름·설명(영문).
 * category/areas/icon 등 언어 무관 정보는 기존 digitalTypeDefinitions를 그대로 사용한다.
 */
export const digitalTypeTextEn: Record<DigitalTypeId, DigitalTypeTextEn> = {
  detective: { name: "Fact Finder", description: "Someone who seeks reliable information, checks the facts, and makes sense of the world through evidence." },
  artisan: { name: "Content Artisan", description: "Someone who shapes meaningful stories into engaging content that informs, inspires, and moves people." },
  connector: { name: "Networker", description: "Someone who connects people, information, and opportunities to make a greater impact together." },
  gatekeeper: { name: "Digital Guardian", description: "Someone who protects people, information, and digital rights while helping create a safer and more trustworthy digital environment." },
  solver: { name: "Troubleshooter", description: "Someone who quickly identifies digital problems, finds practical solutions, and helps others overcome technical difficulties." },
  compass: { name: "Information Guide", description: "Someone who finds useful information, organizes it clearly, and guides others to what they need." },
  homekeeper: { name: "Information Steward", description: "Someone who collects, organizes, stores, and maintains information so it stays useful and easy to find." },
  editor: { name: "Story Editor", description: "Someone who gathers diverse stories, finds the meaning within them, and shapes them into messages that connect with people." },
  analyst: { name: "Analytical Problem Solver", description: "Someone who analyzes problems using data and evidence and turns insights into practical solutions." },
  influencer: { name: "Impact Amplifier", description: "Someone who helps good ideas and meaningful activities reach more people, inspiring participation and wider change." },
  leader: { name: "Community Guardian", description: "Someone who helps create healthy digital communities where people can connect, participate, and communicate safely and respectfully." },
  fixer: { name: "Collaborative Problem Solver", description: "Someone who brings people and their strengths together to solve problems and achieve shared goals." },
  allrounder: { name: "Versatile Maker", description: "Someone who combines ideas, digital tools, creativity, and problem-solving to turn possibilities into real outcomes." },
  meticulous: { name: "Responsible Creator", description: "Someone who creates trustworthy content with care for accuracy, ethics, rights, and social impact." },
  guardian: { name: "Crisis Problem Solver", description: "Someone who stays calm when unexpected problems arise, finds workable solutions, and helps restore stability." },
  sprout: { name: "Growing Explorer", description: "Someone who grows step by step by learning, experimenting, asking for help, and taking on new digital challenges." },
};

export function getDigitalTypeTextEn(id: DigitalTypeId): DigitalTypeTextEn {
  return digitalTypeTextEn[id];
}
