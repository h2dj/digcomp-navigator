export type DigcompAreaId =
  | "information-data"
  | "communication-collaboration"
  | "content-creation"
  | "safety"
  | "problem-solving";

export type Competency = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  prompts: string[];
};

export type DigcompArea = {
  id: DigcompAreaId;
  number: number;
  title: string;
  summary: string;
  nonprofitContext: string;
  competencies: Competency[];
};

export const proficiencyLevels = [
  {
    id: "foundation",
    label: "초급",
    range: "0.0 - 1.4",
    description: "도움이나 예시가 있을 때 기본 과업을 수행할 수 있어요.",
  },
  {
    id: "intermediate",
    label: "중급",
    range: "1.5 - 2.4",
    description: "익숙한 상황에서 스스로 디지털 도구를 선택하고 적용할 수 있어요.",
  },
  {
    id: "advanced",
    label: "상급",
    range: "2.5 - 3.3",
    description: "복잡한 과업을 해결하고 동료에게 방법을 설명할 수 있어요.",
  },
  {
    id: "expert",
    label: "최상급",
    range: "3.4 - 4.0",
    description: "새로운 문제를 구조화하고 조직 차원의 개선을 이끌 수 있어요.",
  },
] as const;

export const responseScale = [
  { value: 1, label: "아직 어려워요", helper: "" },
  { value: 2, label: "들어는 봤어요", helper: "" },
  { value: 3, label: "가끔 해봤어요", helper: "" },
  { value: 4, label: "할 수 있어요", helper: "" },
  { value: 5, label: "자신 있어요", helper: "" },
] as const;

export const digcompAreas: DigcompArea[] = [
  {
    id: "information-data",
    number: 1,
    title: "정보·데이터 리터러시",
    summary: "필요한 정보를 찾고, 신뢰성을 판단하며, 데이터를 정리해 의사결정에 활용하는 역량",
    nonprofitContext: "정책 자료 조사, 후원자 데이터 정리, 현장 이슈 모니터링에 직접 연결됩니다.",
    competencies: [
      {
        id: "browse-search-filter",
        title: "정보와 디지털 콘텐츠 탐색·검색·필터링",
        shortTitle: "검색·필터링",
        description: "목적에 맞는 정보를 찾기 위해 검색 전략과 필터를 활용합니다.",
        prompts: [
          "사업 기획에 필요한 공공 데이터, 연구 보고서, 현장 사례를 적절한 키워드로 찾을 수 있다.",
          "검색 결과를 기간, 출처, 파일 형식 등으로 좁혀 필요한 자료를 빠르게 선별할 수 있다.",
          "반복적으로 확인해야 하는 이슈를 알림, RSS, 뉴스레터 등으로 추적할 수 있다.",
        ],
      },
      {
        id: "evaluate-data",
        title: "데이터·정보·디지털 콘텐츠 평가",
        shortTitle: "정보 평가",
        description: "정보의 출처, 정확성, 편향, 최신성을 비판적으로 검토합니다.",
        prompts: [
          "온라인 자료의 작성자, 발행 기관, 근거 자료를 확인해 신뢰도를 판단할 수 있다.",
          "통계나 시각화가 특정 결론을 과장하거나 왜곡하는지 검토할 수 있다.",
          "조직 외부에 공유하기 전 사실 확인과 저작권 여부를 점검할 수 있다.",
        ],
      },
      {
        id: "manage-data",
        title: "데이터·정보·디지털 콘텐츠 관리",
        shortTitle: "데이터 관리",
        description: "자료를 체계적으로 저장, 분류, 갱신, 공유합니다.",
        prompts: [
          "캠페인 자료와 문서를 공동 폴더에서 찾기 쉬운 구조와 이름으로 관리할 수 있다.",
          "스프레드시트의 중복, 누락, 형식 오류를 정리해 분석 가능한 상태로 만들 수 있다.",
          "개인정보가 포함된 파일의 접근 권한과 보관 기간을 관리할 수 있다.",
        ],
      },
    ],
  },
  {
    id: "communication-collaboration",
    number: 2,
    title: "커뮤니케이션·협업",
    summary: "디지털 채널에서 소통하고, 협업하며, 시민과 커뮤니티에 안전하게 참여하는 역량",
    nonprofitContext: "캠페인 홍보, 파트너 협업, 자원활동가 커뮤니케이션의 품질을 좌우합니다.",
    competencies: [
      {
        id: "interact",
        title: "디지털 기술을 통한 상호작용",
        shortTitle: "디지털 소통",
        description: "상황에 맞는 채널과 표현 방식으로 소통합니다.",
        prompts: [
          "이메일, 메신저 등 다양한 채널로 업무 소통을 원활하게 할 수 있다.",
          "온라인 회의에서 안건, 기록, 후속 작업을 명확하게 공유할 수 있다.",
          "수신자와 맥락에 맞춰 메시지의 톤, 길이, 첨부 형식을 조정할 수 있다.",
        ],
      },
      {
        id: "share",
        title: "디지털 기술을 통한 공유",
        shortTitle: "자료 공유",
        description: "자료를 적절한 권한과 맥락으로 공유합니다.",
        prompts: [
          "문서, 이미지, 데이터 파일을 링크 권한과 만료 설정을 고려해 공유할 수 있다.",
          "동료가 바로 이해할 수 있도록 파일의 목적, 버전, 사용 방법을 함께 안내할 수 있다.",
          "외부 파트너에게 공유해도 되는 정보와 내부 전용 정보를 구분할 수 있다.",
        ],
      },
      {
        id: "citizenship",
        title: "디지털 시민 참여",
        shortTitle: "시민 참여",
        description: "디지털 공간에서 공익 의제를 확산하고 참여를 조직합니다.",
        prompts: [
          "온라인 캠페인, 설문, 서명, 이벤트 도구를 활용해 시민 참여를 설계할 수 있다.",
          "디지털 플랫폼의 알고리즘과 커뮤니티 규칙이 참여 확산에 미치는 영향을 고려할 수 있다.",
          "온라인 참여자의 피드백을 수집해 활동 개선에 반영할 수 있다.",
        ],
      },
      {
        id: "collaborate",
        title: "디지털 기술을 통한 협업",
        shortTitle: "협업",
        description: "공동 편집, 프로젝트 관리, 의사결정 도구를 활용합니다.",
        prompts: [
          "구글 독스, 노션 등 협업 도구로 팀원과 함께 작업할 수 있다.",
          "비동기 협업 상황에서 변경 사항과 결정 배경을 기록할 수 있다.",
          "반복 업무를 템플릿이나 자동화로 줄이는 협업 방식을 제안할 수 있다.",
        ],
      },
      {
        id: "netiquette",
        title: "네티켓",
        shortTitle: "네티켓",
        description: "온라인 소통에서 존중과 포용의 규범을 지킵니다.",
        prompts: [
          "온라인 논쟁이나 민감한 의제에서 차별적 표현과 혐오 표현을 피할 수 있다.",
          "댓글, 게시물, 메신저에서 오해를 줄이는 문맥과 근거를 제공할 수 있다.",
          "조직 공식 채널에서 위기 상황에 맞는 응답 원칙을 따를 수 있다.",
        ],
      },
      {
        id: "digital-identity",
        title: "디지털 정체성 관리",
        shortTitle: "정체성 관리",
        description: "개인과 조직의 온라인 정체성과 평판을 관리합니다.",
        prompts: [
          "개인 계정과 조직 계정의 역할, 권한, 발화 범위를 구분할 수 있다.",
          "프로필, 소개 문구, 공개 게시물이 조직 신뢰도에 미치는 영향을 고려할 수 있다.",
          "계정 인수인계와 접근 권한 회수를 안전하게 처리할 수 있다.",
        ],
      },
    ],
  },
  {
    id: "content-creation",
    number: 3,
    title: "디지털 콘텐츠 창작",
    summary: "콘텐츠를 제작·편집·통합하고 저작권과 자동화 원칙을 이해하는 역량",
    nonprofitContext: "카드뉴스, 보고서, 뉴스레터, 데이터 스토리텔링 제작에 필요합니다.",
    competencies: [
      {
        id: "develop-content",
        title: "디지털 콘텐츠 개발",
        shortTitle: "콘텐츠 개발",
        description: "목적과 대상에 맞는 디지털 콘텐츠를 제작합니다.",
        prompts: [
          "캠페인 목표와 대상에 맞춰 카드뉴스, 숏폼, 뉴스레터 등 형식을 선택할 수 있다.",
          "접근성을 고려해 대체 텍스트, 자막, 명확한 색 대비를 적용할 수 있다.",
          "간단한 디자인 도구나 편집 도구로 배포 가능한 콘텐츠를 만들 수 있다.",
        ],
      },
      {
        id: "integrate-content",
        title: "디지털 콘텐츠 통합·재구성",
        shortTitle: "통합·재구성",
        description: "기존 자료를 결합해 새로운 맥락의 콘텐츠로 재구성합니다.",
        prompts: [
          "보고서, 인터뷰, 사진, 데이터를 결합해 이해하기 쉬운 스토리로 재구성할 수 있다.",
          "서로 다른 파일 형식의 자료를 웹 게시나 발표에 맞게 변환할 수 있다.",
          "기존 콘텐츠를 채널별 특성에 맞춰 요약, 편집, 재배포할 수 있다.",
        ],
      },
      {
        id: "copyright",
        title: "저작권과 라이선스",
        shortTitle: "저작권",
        description: "저작권, 초상권, 라이선스 조건을 준수합니다.",
        prompts: [
          "자료 공유 시 저작권 여부를 확인하고 지킬 수 있다.",
          "후원자나 활동가의 사진·사례를 사용할 때 동의 범위를 확인할 수 있다.",
          "오픈 라이선스 자료를 조직 콘텐츠에 적절히 활용할 수 있다.",
        ],
      },
      {
        id: "programming",
        title: "프로그래밍과 자동화",
        shortTitle: "자동화",
        description: "간단한 자동화와 디지털 시스템의 작동 원리를 이해합니다.",
        prompts: [
          "반복되는 데이터 정리나 알림 업무를 자동화 도구로 줄일 수 있다.",
          "웹폼, 스프레드시트 함수, 노코드 도구의 기본 작동 원리를 이해할 수 있다.",
          "개발자나 외부 업체와 요구사항, 입력값, 결과물을 구체적으로 논의할 수 있다.",
        ],
      },
    ],
  },
  {
    id: "safety",
    number: 4,
    title: "안전",
    summary: "기기, 개인정보, 건강, 환경을 보호하며 디지털 위험을 관리하는 역량",
    nonprofitContext: "활동가와 참여자의 개인정보 보호, 계정 보안, 디지털 소진 예방과 연결됩니다.",
    competencies: [
      {
        id: "protect-devices",
        title: "기기 보호",
        shortTitle: "기기 보호",
        description: "계정, 기기, 파일을 위협으로부터 보호합니다.",
        prompts: [
          "업무 계정에 강한 비밀번호와 다중 인증을 설정할 수 있다.",
          "피싱 메일, 악성 링크, 의심스러운 첨부파일을 식별하고 대응할 수 있다.",
          "기기 분실이나 퇴사 상황에 대비해 접근 권한과 백업을 관리할 수 있다.",
        ],
      },
      {
        id: "protect-data",
        title: "개인정보와 프라이버시 보호",
        shortTitle: "개인정보 보호",
        description: "개인정보 수집·이용·보관·파기 원칙을 지킵니다.",
        prompts: [
          "설문이나 후원 신청에서 꼭 필요한 개인정보만 수집하도록 설계할 수 있다.",
          "개인정보가 포함된 문서를 암호화하거나 접근 권한을 제한할 수 있다.",
          "개인정보 처리 목적, 보관 기간, 제3자 제공 여부를 참여자에게 설명할 수 있다.",
        ],
      },
      {
        id: "wellbeing",
        title: "건강과 웰빙 보호",
        shortTitle: "디지털 웰빙",
        description: "디지털 업무 환경에서 신체적·정서적 부담을 관리합니다.",
        prompts: [
          "알림, 회의, 메신저 사용 규칙을 조정해 집중 시간을 확보할 수 있다.",
          "온라인 괴롭힘이나 악성 댓글 대응 절차를 알고 동료를 보호할 수 있다.",
          "장시간 디지털 업무로 인한 피로를 줄이는 습관과 도구를 활용할 수 있다.",
        ],
      },
      {
        id: "environment",
        title: "환경 보호",
        shortTitle: "환경 보호",
        description: "디지털 기술 사용의 환경 영향을 고려합니다.",
        prompts: [
          "불필요한 대용량 파일 보관과 중복 저장을 줄일 수 있다.",
          "기기 구매, 사용, 폐기 과정에서 수리 가능성과 재사용을 고려할 수 있다.",
          "온라인 행사와 오프라인 이동의 환경 영향을 비교해 운영 방식을 선택할 수 있다.",
        ],
      },
    ],
  },
  {
    id: "problem-solving",
    number: 5,
    title: "문제 해결",
    summary: "기술 문제를 해결하고 필요에 맞는 도구를 선택하며 역량 격차를 개선하는 역량",
    nonprofitContext: "작은 조직의 제한된 자원 안에서 적절한 디지털 전환 우선순위를 정하는 데 중요합니다.",
    competencies: [
      {
        id: "solve-technical",
        title: "기술 문제 해결",
        shortTitle: "기술 문제",
        description: "일상적인 기술 문제의 원인을 찾고 해결합니다.",
        prompts: [
          "로그인 오류, 권한 문제, 파일 동기화 실패의 원인을 단계적으로 확인할 수 있다.",
          "도움말, 커뮤니티, 고객지원 문서를 활용해 해결 방법을 찾을 수 있다.",
          "문제가 반복될 때 원인, 조치, 재발 방지 방법을 기록해 공유할 수 있다.",
        ],
      },
      {
        id: "identify-needs",
        title: "필요와 기술적 대응 식별",
        shortTitle: "기술 선택",
        description: "문제와 제약에 맞는 디지털 도구나 프로세스를 선택합니다.",
        prompts: [
          "조직의 업무 문제를 기능 요구사항, 예산, 보안, 사용 난이도로 나눠 정리할 수 있다.",
          "새 도구 도입 전에 기존 도구로 해결 가능한지 비교할 수 있다.",
          "무료·저비용 도구의 한계와 데이터 이전 가능성을 검토할 수 있다.",
        ],
      },
      {
        id: "creative-use",
        title: "디지털 기술의 창의적 활용",
        shortTitle: "창의적 활용",
        description: "디지털 도구를 조합해 새로운 활동 방식과 서비스를 만듭니다.",
        prompts: [
          "현장 활동, 교육, 캠페인을 온라인 또는 혼합 방식으로 재설계할 수 있다.",
          "데이터와 스토리텔링을 결합해 공익 의제를 설득력 있게 전달할 수 있다.",
          "새로운 도구를 작은 실험으로 검증하고 조직에 맞게 확장할 수 있다.",
        ],
      },
      {
        id: "identify-gaps",
        title: "디지털 역량 격차 식별",
        shortTitle: "역량 격차",
        description: "개인과 조직의 학습 필요를 진단하고 개선 계획을 세웁니다.",
        prompts: [
          "나와 팀의 디지털 업무 강점과 어려움을 구체적인 행동 기준으로 설명할 수 있다.",
          "업무 목표와 현재 역량 사이의 차이를 파악해 학습 우선순위를 정할 수 있다.",
          "학습 결과를 업무 방식 개선이나 동료 교육으로 연결할 수 있다.",
        ],
      },
    ],
  },
];

export const allCompetencies = digcompAreas.flatMap((area) =>
  area.competencies.map((competency) => ({ ...competency, areaId: area.id })),
);

export type AssessmentQuestion = {
  id: string;
  competencyId: string;
  promptIndex: number;
  areaId: DigcompAreaId;
  areaTitle: string;
  categoryLabel: string;
  prompt: string;
};

const questionsPerArea = 3;

const assessmentCompetencyIds: Partial<Record<DigcompAreaId, string[]>> = {
  "communication-collaboration": ["interact", "collaborate", "citizenship"],
};

function getAssessmentCompetencies(area: DigcompArea) {
  const selectedIds = assessmentCompetencyIds[area.id];
  if (selectedIds) {
    return selectedIds
      .map((id) => area.competencies.find((competency) => competency.id === id))
      .filter((competency): competency is Competency => Boolean(competency));
  }

  return area.competencies.slice(0, questionsPerArea);
}

export const assessmentQuestions: AssessmentQuestion[] = digcompAreas.flatMap((area) =>
  getAssessmentCompetencies(area).map((competency) => ({
    id: `${competency.id}:0`,
    competencyId: competency.id,
    promptIndex: 0,
    areaId: area.id,
    areaTitle: area.title,
    categoryLabel: competency.shortTitle,
    prompt: competency.prompts[0],
  })),
);
