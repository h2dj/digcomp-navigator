import type { DigcompAreaId } from "@/data/digcomp";

export type DigitalTypeId = "T0" | "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7";

export type DigitalTypeActivity = {
  icon: string;
  title: string;
  description: string;
};

export type DigitalTypeComplement = {
  competencyId: string;
  note: string;
};

export type DigitalTypeDefinition = {
  id: DigitalTypeId;
  name: string;
  description: string;
  tags: string[];
  /** 유형 판별의 핵심 역량 (T0, T7 제외) */
  core: string[];
  /** 동점 시 보조 판단용 연관 역량 */
  related: string[];
  activities: DigitalTypeActivity[];
  complement?: DigitalTypeComplement;
};

export const digitalTypeDefinitions: DigitalTypeDefinition[] = [
  {
    id: "T1",
    name: "데이터 스토리텔러",
    description:
      "흩어진 정보와 데이터를 모아 의미 있는 이야기로 바꾸는 사람입니다. 근거 자료를 빠르게 찾고, 정리하고, 남들이 이해하기 쉬운 형태로 전달하는 데 강점이 있습니다.",
    tags: ["#데이터시각화", "#보고서", "#근거기반", "#스토리텔링"],
    core: ["browse-search-filter", "manage-data", "develop-content"],
    related: ["evaluate-data", "share"],
    activities: [
      {
        icon: "📊",
        title: "연차보고서·임팩트 리포트 제작",
        description: "사업 성과와 데이터를 근거로 한 연차보고서·임팩트 리포트를 기획하고 작성해 보세요.",
      },
      {
        icon: "💰",
        title: "모금 캠페인의 근거 데이터 구성",
        description: "캠페인 메시지를 뒷받침할 통계와 근거 자료를 찾아 설득력을 높일 수 있습니다.",
      },
      {
        icon: "📈",
        title: "사업 성과 시각화",
        description: "흩어진 데이터를 차트·대시보드로 정리해 의사결정에 활용할 수 있게 만들어 보세요.",
      },
      {
        icon: "📝",
        title: "정책 제안서 작성",
        description: "조사한 근거 자료를 바탕으로 정책 제안서나 실행 가이드를 작성하는 역할이 잘 맞습니다.",
      },
    ],
    complement: {
      competencyId: "protect-data",
      note: "데이터를 다루는 만큼 비식별화·동의 관리 역량이 함께 필요합니다.",
    },
  },
  {
    id: "T2",
    name: "커뮤니티 빌더",
    description:
      "사람들을 온라인으로 모으고 연결하는 데 능한 유형입니다. 화상회의·커뮤니티 운영·의견 수렴을 자연스럽게 해내고, 참여자가 소외되지 않도록 챙깁니다.",
    tags: ["#커뮤니티운영", "#참여설계", "#네트워킹", "#퍼실리테이션"],
    core: ["interact", "citizenship", "collaborate"],
    related: ["netiquette", "identify-gaps"],
    activities: [
      {
        icon: "🚩",
        title: "온라인 캠페인 운영",
        description: "서명·해시태그 운동 등 조직의 온라인 캠페인을 기획하고 참여를 이끌어낼 수 있습니다.",
      },
      {
        icon: "🤝",
        title: "자원봉사자 커뮤니티 관리",
        description: "자원봉사자·회원 커뮤니티를 온라인에서 꾸준히 운영하고 참여를 독려해 보세요.",
      },
      {
        icon: "🏘️",
        title: "주민 참여 프로그램 기획",
        description: "지역 주민이나 수혜자의 의견을 모으는 설문·포럼·간담회를 기획하고 진행할 수 있습니다.",
      },
      {
        icon: "🔗",
        title: "다기관 협력 사업 코디네이션",
        description: "여러 기관이 함께하는 협력 사업에서 소통과 협업을 조율하는 역할이 잘 맞습니다.",
      },
    ],
    complement: {
      competencyId: "digital-identity",
      note: "커뮤니티가 커질수록 조직 평판 관리가 중요해집니다.",
    },
  },
  {
    id: "T3",
    name: "콘텐츠 크리에이터",
    description:
      "조직의 이야기를 매력적인 콘텐츠로 만들어 퍼뜨리는 사람입니다. 카드뉴스·영상·뉴스레터 등 형식을 넘나들며, 하나의 소재를 여러 채널에 맞게 변주하는 데 강합니다.",
    tags: ["#카드뉴스", "#스토리텔링", "#채널운영", "#캠페인"],
    core: ["develop-content", "integrate-content", "share"],
    related: ["copyright", "digital-identity"],
    activities: [
      {
        icon: "📣",
        title: "SNS 채널 운영",
        description: "인스타그램·페이스북 등 조직 공식 채널의 콘텐츠 기획과 게시를 맡아보세요.",
      },
      {
        icon: "💛",
        title: "모금·인식개선 캠페인 콘텐츠 제작",
        description: "캠페인의 핵심 메시지를 카드뉴스·영상 등으로 변주해 확산을 이끌 수 있습니다.",
      },
      {
        icon: "🎙️",
        title: "수혜자 스토리 발굴·확산",
        description: "현장의 이야기를 콘텐츠로 만들어 후원자와 시민에게 전하는 역할이 잘 맞습니다.",
      },
      {
        icon: "✉️",
        title: "뉴스레터 운영",
        description: "정기 뉴스레터의 기획·편집·발행을 통해 조직의 팬층을 키워보세요.",
      },
    ],
    complement: {
      competencyId: "copyright",
      note: "콘텐츠 제작량이 많을수록 라이선스 리스크도 커집니다. 이 역량이 뒷받침되면 '빠르게 만드는 사람'에서 '안심하고 맡길 수 있는 사람'이 됩니다.",
    },
  },
  {
    id: "T4",
    name: "디지털 가디언",
    description:
      "조직과 수혜자를 디지털 위험으로부터 지키는 유형입니다. 피싱·유출·허위정보에 민감하고, 남들이 놓치는 위험 신호를 먼저 알아챕니다.",
    tags: ["#정보보안", "#개인정보보호", "#위험관리", "#신뢰구축"],
    core: ["protect-devices", "protect-data", "evaluate-data"],
    related: ["netiquette", "wellbeing"],
    activities: [
      {
        icon: "🔐",
        title: "조직 개인정보 관리 담당",
        description: "개인정보보호책임자(CPO)를 보좌하며 조직의 개인정보 처리 현황을 관리할 수 있습니다.",
      },
      {
        icon: "🛡️",
        title: "보안 수칙·교육 운영",
        description: "직원 대상 보안 수칙 안내와 교육을 기획하고 운영하는 역할이 잘 맞습니다.",
      },
      {
        icon: "🗂️",
        title: "후원자 DB 관리",
        description: "후원자·수혜자 데이터베이스의 접근 권한과 보관 기준을 안전하게 관리해 보세요.",
      },
      {
        icon: "🧓",
        title: "취약계층 대상 디지털 안전 교육",
        description: "고령층 등 취약계층에게 피싱·개인정보 보호 등 디지털 안전 수칙을 안내할 수 있습니다.",
      },
    ],
    complement: {
      competencyId: "share",
      note: "지키는 것과 알리는 것 사이의 균형 감각이 있으면 '막기만 하는 사람'이 아니라 '안전하게 열어주는 사람'이 됩니다.",
    },
  },
  {
    id: "T5",
    name: "프로세스 이노베이터",
    description:
      "반복 업무를 보면 자동화하고 싶어지는 사람입니다. 도구를 비교·검증해 조직에 맞는 것을 골라내고, 수작업을 시스템으로 바꿔 동료들의 시간을 벌어줍니다.",
    tags: ["#업무자동화", "#디지털전환", "#도구비교", "#프로세스개선"],
    core: ["programming", "identify-needs", "creative-use"],
    related: ["solve-technical", "manage-data"],
    activities: [
      {
        icon: "⚙️",
        title: "업무 자동화 프로젝트",
        description: "반복되는 데이터 입력·정리 업무를 자동화 도구로 개선하는 프로젝트를 이끌 수 있습니다.",
      },
      {
        icon: "🧪",
        title: "신규 도구 도입 검토·파일럿",
        description: "새 디지털 도구를 비교·검증하고 소규모 파일럿으로 실효성을 확인하는 역할이 잘 맞습니다.",
      },
      {
        icon: "📋",
        title: "행정 프로세스 개선",
        description: "번거로운 행정·보고 절차를 디지털 도구로 단순화하는 개선안을 제안해 보세요.",
      },
      {
        icon: "💡",
        title: "소규모 단체 대상 디지털 전환 컨설팅",
        description: "예산과 인력이 제한된 소규모 단체에 적합한 디지털 전환 방법을 안내할 수 있습니다.",
      },
    ],
    complement: {
      competencyId: "collaborate",
      note: "혁신은 혼자 만드는 게 아니라 동료가 따라올 수 있어야 정착됩니다.",
    },
  },
  {
    id: "T6",
    name: "디지털 멘토",
    description:
      "스스로 배우는 것을 넘어 남의 성장을 돕는 데서 보람을 느끼는 유형입니다. 기술을 어려워하는 동료·수혜자의 눈높이에 맞춰 설명하고, 건강한 디지털 사용 문화를 퍼뜨립니다.",
    tags: ["#교육기획", "#멘토링", "#디지털격차해소", "#디지털웰빙"],
    core: ["identify-gaps", "netiquette", "wellbeing"],
    related: ["interact", "environment"],
    activities: [
      {
        icon: "🎓",
        title: "사내 디지털 교육 운영",
        description: "동료들의 눈높이에 맞춘 디지털 도구 교육을 기획하고 진행할 수 있습니다.",
      },
      {
        icon: "🧓",
        title: "고령층·취약계층 디지털 격차 해소 사업",
        description: "디지털 기기 사용을 어려워하는 대상에게 친절하게 안내하는 사업이 잘 맞습니다.",
      },
      {
        icon: "👋",
        title: "신입 직원 온보딩",
        description: "새로 합류한 동료가 조직의 디지털 도구에 빠르게 적응하도록 도울 수 있습니다.",
      },
      {
        icon: "🌿",
        title: "디지털 웰빙 캠페인",
        description: "건강한 디지털 사용 습관을 제안하고 조직 문화로 퍼뜨리는 역할을 해보세요.",
      },
    ],
    complement: {
      competencyId: "manage-data",
      note: "교육 성과를 데이터로 기록·증명하면 사업 확장의 근거가 됩니다.",
    },
  },
];

export const digitalTypeT7: DigitalTypeDefinition = {
  id: "T7",
  name: "디지털 전략가",
  description:
    "한 분야의 스페셜리스트라기보다 조직 전체를 보는 제너럴리스트입니다. 기술·사람·프로세스를 함께 고려해 조직의 디지털 방향을 설계할 수 있습니다.",
  tags: ["#디지털전환전략", "#거버넌스", "#의사결정", "#제너럴리스트"],
  core: [],
  related: [],
  activities: [
    {
      icon: "🗺️",
      title: "조직 디지털 전환 로드맵 수립",
      description: "조직의 비전과 사업 목표에 맞춘 단계별 디지털 전환 계획을 세울 수 있습니다.",
    },
    {
      icon: "💼",
      title: "IT 예산·투자 의사결정",
      description: "제한된 예산 안에서 어떤 도구·시스템에 투자할지 우선순위를 정하는 역할이 잘 맞습니다.",
    },
    {
      icon: "📜",
      title: "디지털 관련 정책·거버넌스 수립",
      description: "개인정보·보안·콘텐츠 등 조직 전반의 디지털 정책을 설계하고 운영할 수 있습니다.",
    },
    {
      icon: "🌐",
      title: "섹터 차원의 네트워크·연구 활동",
      description: "비영리 섹터의 디지털 전환 사례를 조사하고 다른 조직과 지식을 나누는 활동을 해보세요.",
    },
  ],
  complement: {
    competencyId: "",
    note: "전략가일수록 한두 개의 '직접 잘하는 것'이 있어야 현장 설득력이 생깁니다.",
  },
};

export const digitalTypeT0: DigitalTypeDefinition = {
  id: "T0",
  name: "성장 탐색가",
  description: "아직 뚜렷한 강점 조합보다는 여러 역량을 고르게 탐색하고 있는 단계입니다. 기초를 다지며 나만의 강점을 찾아가고 있어요.",
  tags: ["#성장중", "#탐색단계"],
  core: [],
  related: [],
  activities: [
    {
      icon: "🌱",
      title: "관심 있는 영역부터 하나씩 깊게 진단해보기",
      description: "5개 영역 중 가장 끌리는 영역을 골라 심층 진단으로 구체적인 강점을 확인해 보세요.",
    },
    {
      icon: "📚",
      title: "가장 낮은 영역의 기초 학습 자료부터 시작",
      description: "부담 없는 기초 학습으로 시작하면 다음 진단에서 뚜렷한 유형이 드러날 수 있어요.",
    },
  ],
};

export function getDigitalTypeDefinition(id: DigitalTypeId): DigitalTypeDefinition {
  if (id === "T0") return digitalTypeT0;
  if (id === "T7") return digitalTypeT7;
  const found = digitalTypeDefinitions.find((type) => type.id === id);
  if (!found) throw new Error(`알 수 없는 디지털 유형 ID입니다: ${id}`);
  return found;
}

export const allDigitalTypeIds: DigitalTypeId[] = ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7"];

export function isDigitalTypeId(value: string): value is DigitalTypeId {
  return (allDigitalTypeIds as string[]).includes(value);
}

/** 유형 판별 튜닝 파라미터 */
export const digitalTypeParams = {
  ABS_THRESHOLD: 3.5,
  REL_GAP: 0.4,
  MIN_CORE: 3.0,
  DUAL_TYPE_GAP: 0.15,
  STRATEGIST_AREA_THRESHOLD: 3.8,
  STRATEGIST_AREA_COUNT: 4,
  STRATEGIST_AREA_FLOOR: 3.0,
  STRATEGIST_MEAN: 3.8,
  FALLBACK_CASE_A_MEAN: 2.5,
  FLAT_STDEV: 0.3,
} as const;

export type DigitalTypeAreaKey = DigcompAreaId;
