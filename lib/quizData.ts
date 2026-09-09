/**
 * OX 퀴즈 문항 데이터 (1단계 MVP — 정적 데이터).
 * 서울공익활동박람회 부스에서 사용한 6개 주제 54문항을 그대로 시딩했다.
 * 온라인 공개 시 정답 노출 우려가 있어(기획안 11절), 문항 순서는 화면에서 매번 섞어 보여준다.
 */

export type QuizTopicId =
  | "ai-ethics-labor"
  | "environment"
  | "open-source"
  | "digital-divide"
  | "ai-screentime"
  | "digital-safety";

export type QuizAnswer = "O" | "X";

export type QuizQuestion = {
  id: string;
  question: string;
  answer: QuizAnswer;
  explanation: string;
};

export type QuizTopic = {
  id: QuizTopicId;
  title: string;
  icon: string;
  description: string;
  questions: QuizQuestion[];
};

export const quizTopics: QuizTopic[] = [
  {
    id: "ai-ethics-labor",
    title: "AI·윤리·노동",
    icon: "⚖️",
    description: "AI와 저작권, 일자리, 알고리즘을 둘러싼 이야기",
    questions: [
      {
        id: "ai-ethics-labor-1",
        question: "사람이 창작에 관여하지 않았다면 AI가 만든 그림이나 글은 현재 한국에서 저작권 보호를 받기 어렵다.",
        answer: "O",
        explanation:
          "한국 저작권법은 인간의 창작 행위를 전제로 하고 있어, AI가 단독으로 만든 결과물은 원칙적으로 저작권 보호 대상이 아니라는 것이 현재의 실무적 입장입니다. 다만 인간이 프롬프트 작성 등에서 상당한 창작적 개입을 했다면 판단이 달라질 수 있어, 그 경계는 여전히 논의 중입니다.",
      },
      {
        id: "ai-ethics-labor-2",
        question: "AI 도입으로 사라지는 일자리보다 새로 생기는 일자리가 더 많다는 것은 이미 확립된 사실이다.",
        answer: "X",
        explanation:
          "이는 아직 확립된 사실이 아니라 논쟁 중인 전망입니다. 기관과 연구마다 예측이 크게 엇갈리며, 어떤 일자리가 줄고 늘지는 산업과 지역에 따라 다르게 나타나고 있습니다.",
      },
      {
        id: "ai-ethics-labor-3",
        question: "생성형 AI 모델들은 저작권자의 동의 없이 인터넷의 글과 이미지를 학습에 사용해 논란이 되어 왔다.",
        answer: "O",
        explanation:
          "다수의 언론사·작가·예술가가 AI 기업을 상대로 저작권 침해 소송을 제기하는 등, 학습 데이터 수집 방식을 둘러싼 논란이 세계 곳곳에서 이어지고 있습니다.",
      },
      {
        id: "ai-ethics-labor-4",
        question: "AI가 나에 대해 내린 결정에 대해 그 이유를 설명해달라고 요구할 수 있는 제도적 장치가 일부 도입되고 있다.",
        answer: "O",
        explanation:
          "EU의 개인정보 보호 규정(GDPR)이나 AI 관련 법안 등에서 자동화된 결정에 대한 설명을 요구할 권리가 일부 제도화되고 있습니다. 다만 실제로 얼마나 충분히 작동하는지는 여전히 논쟁적입니다.",
      },
      {
        id: "ai-ethics-labor-5",
        question: "배달, 대리운전 같은 플랫폼 노동에는 이미 AI·알고리즘이 업무 배정에 널리 쓰이고 있다.",
        answer: "O",
        explanation:
          "배차·업무 배정 알고리즘은 이미 플랫폼 노동 현장에서 폭넓게 쓰이고 있으며, 그 기준이 불투명하다는 점이 노동 현장의 주요 쟁점 중 하나입니다.",
      },
      {
        id: "ai-ethics-labor-6",
        question: "일반적으로 자원이 부족한 소규모 시민단체·공익조직이 대기업보다 AI를 더 적극적으로 도입하고 있다.",
        answer: "X",
        explanation:
          "오히려 반대인 경우가 많습니다. 자원·인력·교육 기회가 부족한 소규모 조직일수록 새 기술 도입이 늦어지는 경향이 있어, 이 격차를 줄이는 것이 중요한 과제로 꼽힙니다.",
      },
      {
        id: "ai-ethics-labor-7",
        question: "여러 나라에서는 AI가 채용이나 해고에 사용될 경우 사전 통보나 설명을 요구하는 제도를 이미 도입했거나 논의 중이다.",
        answer: "O",
        explanation:
          "일부 도시·국가에서는 채용 등에 쓰이는 자동화 도구에 대해 사전 고지나 검증을 요구하는 제도를 도입하거나 논의하고 있습니다. 다만 국가별로 속도와 수준 차이가 큽니다.",
      },
      {
        id: "ai-ethics-labor-8",
        question: "AI 챗봇은 감정이 없으므로 항상 편향되지 않은 중립적 답변만 내놓는다.",
        answer: "X",
        explanation:
          "AI는 감정은 없지만, 학습한 데이터에 포함된 편향을 그대로 반영하거나 증폭할 수 있습니다. '감정이 없다'는 것이 '편향이 없다'는 뜻은 아닙니다.",
      },
      {
        id: "ai-ethics-labor-9",
        question: "AI가 발전할수록, 개인의 '디지털 기초 역량'은 예전보다 덜 중요해진다.",
        answer: "X",
        explanation:
          "AI를 얼마나 잘 활용할 수 있는지는 결국 사용자의 기초 역량과 사고력에 달려 있습니다. 기초가 탄탄할수록 AI의 도움을 더 주도적으로 받을 수 있어, 기초 역량의 중요성은 오히려 커지고 있다는 시각이 많습니다.",
      },
      {
        id: "ai-ethics-labor-10",
        question: "AI로 인한 일자리 변화 문제는 노동자 개인의 재교육만으로 충분히 해결된다는 것이 널리 합의된 견해다.",
        answer: "X",
        explanation:
          "개인의 역량 강화도 중요하지만, 이것만으로 충분하다는 데는 합의가 없습니다. 제도·정책·조직 차원의 대응이 함께 필요하다는 비판적 시각이 널리 제기되고 있습니다.",
      },
    ],
  },
  {
    id: "environment",
    title: "환경·자원 소모",
    icon: "🌱",
    description: "AI와 디지털 기기가 남기는 전력·자원의 흔적",
    questions: [
      {
        id: "environment-1",
        question: "거대언어모델(LLM) 같은 AI를 훈련시키는 과정에는 많은 전력이 필요해, 상당한 양의 이산화탄소가 배출된다.",
        answer: "O",
        explanation:
          "대형 AI 모델의 훈련에는 대규모 연산이 필요해 상당한 전력이 소모되며, 이에 따른 탄소 배출량도 여러 연구를 통해 보고되어 왔습니다. 정확한 수치는 모델과 훈련 방식, 사용하는 전력원에 따라 크게 달라집니다.",
      },
      {
        id: "environment-2",
        question: "AI 챗봇에게 짧은 질문 하나를 하는 것은 전력을 거의 소모하지 않아, 환경에 미치는 영향은 무시해도 된다.",
        answer: "X",
        explanation:
          "질문 하나하나는 작아 보여도, 전 세계에서 매일 이뤄지는 수많은 질의를 합치면 그 전력 소모는 결코 작지 않습니다. 개별 사용량이 적다고 전체 영향까지 무시할 수 있는 것은 아닙니다.",
      },
      {
        id: "environment-3",
        question: "AI 데이터센터는 서버 냉각을 위해 상당한 양의 물을 사용하기도 한다.",
        answer: "O",
        explanation:
          "많은 데이터센터가 서버 냉각을 위해 대규모 냉각수를 사용하며, 주요 IT기업들도 이와 관련한 물 사용량을 공개적으로 보고하고 있습니다. 물 부족 지역에 데이터센터가 위치할 경우 지역사회와의 갈등 요인이 되기도 합니다.",
      },
      {
        id: "environment-4",
        question: "스마트폰이나 노트북 안에는 재활용이 어려운 희귀금속들이 들어있어, 전자폐기물 문제를 일으킨다.",
        answer: "O",
        explanation:
          "전자기기에는 코발트, 리튬, 희토류 등 채굴 과정에서 환경·인권 문제를 동반하는 자원이 다수 들어 있으며, 이를 완전히 회수·재활용하기가 쉽지 않아 전자폐기물 문제의 핵심 원인 중 하나로 꼽힙니다.",
      },
      {
        id: "environment-5",
        question: "전 세계 전자폐기물(e-waste)의 양은 최근 몇 년간 감소하는 추세다.",
        answer: "X",
        explanation:
          "전자기기 사용이 늘고 교체 주기가 짧아지면서, 전 세계 전자폐기물 발생량은 오히려 꾸준히 증가해 왔습니다. 반면 이 중 정식으로 수거·재활용되는 비율은 여전히 낮은 편입니다.",
      },
      {
        id: "environment-6",
        question: "재생에너지로만 데이터센터를 운영하면 AI의 환경 영향은 완전히 사라진다.",
        answer: "X",
        explanation:
          "전력을 재생에너지로 충당해도, 서버·반도체 제조 과정에서 발생하는 탄소, 냉각에 쓰이는 물, 하드웨어 폐기 문제 등은 남아 있습니다. 재생에너지는 영향을 줄이는 중요한 방법이지만 '완전히 사라진다'고 보기는 어렵습니다.",
      },
      {
        id: "environment-7",
        question: "오래된 전자기기를 새 것으로 자주 바꾸는 것보다, 되도록 오래 쓰고 수리해서 쓰는 것이 환경에 더 이롭다.",
        answer: "O",
        explanation:
          "기기 하나를 새로 만드는 데 드는 자원과 탄소 배출이 사용 단계보다 큰 경우가 많아, 오래 쓰고 수리하는 것이 자원 소모를 줄이는 데 도움이 된다는 것이 널리 알려진 원칙입니다.",
      },
      {
        id: "environment-8",
        question: "클라우드에 저장한 파일은 물리적 실체가 없으므로, 저장 자체로는 전력을 소모하지 않는다.",
        answer: "X",
        explanation:
          "'클라우드'라는 이름과 달리, 파일은 실제로는 어딘가의 데이터센터 서버에 저장되어 있고, 이 서버들은 파일을 보관하는 동안에도 계속 전력을 소모합니다.",
      },
      {
        id: "environment-9",
        question: "일회용 배터리보다 충전식 배터리를 쓰는 것이 장기적으로 자원 소모를 줄이는 데 도움이 된다.",
        answer: "O",
        explanation:
          "충전식 배터리도 제조 과정에서 자원이 들지만, 여러 번 반복해서 쓸 수 있기 때문에 같은 사용량 기준으로 보면 일회용 배터리보다 자원 소모와 폐기물을 줄이는 데 도움이 됩니다.",
      },
      {
        id: "environment-10",
        question: "전자폐기물은 대부분 선진국 내에서 처리되며, 개발도상국으로 수출되는 경우는 매우 드물다.",
        answer: "X",
        explanation:
          "상당량의 전자폐기물이 처리 비용이 낮은 개발도상국으로 수출되어 온 것으로 알려져 있으며, 이 과정에서 현지의 환경오염과 노동자 건강 문제가 함께 지적되어 왔습니다.",
      },
    ],
  },
  {
    id: "open-source",
    title: "오픈소스",
    icon: "‹/›",
    description: "코드를 공개하고 함께 만드는 오픈소스의 세계",
    questions: [
      {
        id: "open-source-1",
        question: "오픈소스 소프트웨어는 누구나 무료로 사용할 수 있지만, 소스코드를 들여다보거나 수정하는 것은 불가능하다.",
        answer: "X",
        explanation:
          "오픈소스의 핵심은 소스코드를 공개해 누구나 들여다보고 수정할 수 있게 하는 것입니다. 무료이면서 소스코드를 볼 수 없는 것은 '프리웨어'에 가깝습니다.",
      },
      {
        id: "open-source-2",
        question: "리눅스(Linux)는 대표적인 오픈소스 운영체제로, 전 세계 서버의 상당수가 이를 기반으로 운영되고 있다.",
        answer: "O",
        explanation:
          "리눅스는 가장 유명한 오픈소스 운영체제로, 전 세계 서버와 클라우드 인프라의 상당 부분이 리눅스 기반으로 운영되고 있습니다.",
      },
      {
        id: "open-source-3",
        question: "오픈소스 프로젝트는 기업이 아니라 오직 개인 자원봉사자들에 의해서만 운영된다.",
        answer: "X",
        explanation:
          "구글, 마이크로소프트, 메타 같은 대기업들도 자체 오픈소스 프로젝트를 공개하거나 기존 프로젝트에 적극 기여하고 있습니다. 개인 자원봉사자와 기업이 함께 생태계를 이루는 경우가 많습니다.",
      },
      {
        id: "open-source-4",
        question: "오픈소스 라이선스에는 여러 종류가 있으며, 라이선스에 따라 상업적 이용 조건이 다르게 적용된다.",
        answer: "O",
        explanation:
          "MIT, GPL, Apache 등 수십 가지의 오픈소스 라이선스가 있으며, 상업적 이용 가능 여부나 수정본 공개 의무 등이 라이선스마다 다르게 정해져 있습니다.",
      },
      {
        id: "open-source-5",
        question: "오픈소스로 공개된 코드는 저작권이 전혀 없으므로, 아무 제약 없이 마음대로 가져다 써도 된다.",
        answer: "X",
        explanation:
          "오픈소스도 엄연히 저작권이 있으며, 라이선스를 통해 일정한 조건(출처 표기, 동일 라이선스 배포 등) 하에 사용을 허용하는 것입니다. 라이선스를 어기면 법적 문제가 생길 수 있습니다.",
      },
      {
        id: "open-source-6",
        question: "AI 모델 중에도 코드나 가중치를 공개하는 '오픈소스 AI'가 존재한다.",
        answer: "O",
        explanation:
          "일부 AI 기업들은 모델의 구조나 가중치를 공개하는 '오픈웨이트' 모델을 내놓고 있습니다. 다만 학습 데이터까지 완전히 공개하는지는 모델마다 달라, '진정한 오픈소스인가'를 둘러싼 논란도 있습니다.",
      },
      {
        id: "open-source-7",
        question: "오픈소스 소프트웨어는 코드가 공개되어 있어, 보안 취약점을 더 빨리 발견하고 고칠 수 있다는 장점이 있다.",
        answer: "O",
        explanation:
          "소스코드가 공개되어 있어 전 세계 개발자가 코드를 검토할 수 있기 때문에, 취약점이 빠르게 발견되고 수정되는 경우가 많습니다. 물론 관리가 소홀해지면 오히려 취약점이 오래 방치될 수도 있어, 지속적인 관리가 중요합니다.",
      },
      {
        id: "open-source-8",
        question: "위키피디아는 오픈소스 정신을 콘텐츠 영역에 적용한 대표적인 사례로 꼽힌다.",
        answer: "O",
        explanation:
          "위키피디아는 소프트웨어가 아닌 콘텐츠 영역에서 오픈소스적 협업 방식을 적용한 대표적인 사례로 자주 언급됩니다. 누구나 편집할 수 있고, 그 결과물은 다시 모두에게 공개됩니다.",
      },
      {
        id: "open-source-9",
        question: "오픈소스 프로젝트에 기여하려면 반드시 전문 프로그래머여야 한다.",
        answer: "X",
        explanation:
          "문서 작성, 번역, 버그 리포트, 테스트, 디자인 제안 등 비개발 영역에서도 오픈소스 프로젝트에 기여할 수 있는 길이 많이 있어, 전문 개발자가 아니어도 참여할 수 있습니다.",
      },
      {
        id: "open-source-10",
        question: "한글과컴퓨터의 '아래아한글'이나 마이크로소프트 '워드'는 오픈소스 소프트웨어의 대표적인 예다.",
        answer: "X",
        explanation:
          "아래아한글과 워드는 소스코드가 공개되지 않는 대표적인 상용(폐쇄형) 소프트웨어입니다. 이들과 비교되는 오픈소스 대안으로는 LibreOffice 등이 있습니다.",
      },
    ],
  },
  {
    id: "digital-divide",
    title: "디지털 격차",
    icon: "🌉",
    description: "접속의 격차를 넘어, 활용 역량의 격차 이야기",
    questions: [
      {
        id: "digital-divide-1",
        question: "디지털 격차는 단순히 인터넷 접속 여부만을 의미한다.",
        answer: "X",
        explanation:
          "디지털 격차는 접속 여부뿐 아니라, 기기를 얼마나 잘 활용할 수 있는지, 정보를 얼마나 비판적으로 판단할 수 있는지 등 질적인 차이까지 포함하는 개념입니다.",
      },
      {
        id: "digital-divide-2",
        question: "한국은 초고속 인터넷 보급률이 높아 디지털 기기 접근성 자체는 상당히 보편화되어 있다.",
        answer: "O",
        explanation:
          "한국은 초고속 인터넷 인프라와 스마트폰 보급률이 매우 높은 나라로 꼽힙니다. 다만 접근성이 높다고 활용 역량까지 균등한 것은 아닙니다.",
      },
      {
        id: "digital-divide-3",
        question: "디지털 기기를 가지고 있으면 디지털 격차 문제는 대부분 해결된 것으로 볼 수 있다.",
        answer: "X",
        explanation:
          "기기를 가진 것과 실제로 잘 활용하는 것은 별개의 문제입니다. 보유율이 높아져도 활용 역량·자신감의 격차는 여전히 남아 있는 경우가 많습니다.",
      },
      {
        id: "digital-divide-4",
        question: "고령층은 디지털 기기 보유율은 낮지 않지만, 활용 역량에서 격차가 큰 경우가 많다.",
        answer: "O",
        explanation:
          "여러 조사에서 고령층의 기기 보유율은 낮지 않지만, 실제 활용 능력이나 자신감은 상대적으로 낮게 나타나는 경향이 보고되고 있습니다.",
      },
      {
        id: "digital-divide-5",
        question: "디지털 격차는 개인의 노력 부족 때문에 발생하는 것이지, 사회·경제적 요인과는 관계가 없다.",
        answer: "X",
        explanation:
          "디지털 격차는 개인의 노력만으로 설명되지 않습니다. 교육 기회, 소득 수준, 거주 지역 등 사회·경제적 요인이 함께 작용한다는 것이 널리 지적되고 있습니다.",
      },
      {
        id: "digital-divide-6",
        question: "도시와 비수도권 지역 간에는 디지털 인프라·교육 기회의 격차가 존재한다고 알려져 있다.",
        answer: "O",
        explanation:
          "도시와 비수도권 지역 사이에는 디지털 교육 인프라와 기회의 격차가 존재한다는 지적이 꾸준히 제기되어 왔으며, 교육 프로그램도 수도권에 집중되는 경향이 있습니다.",
      },
      {
        id: "digital-divide-7",
        question: "생성형 AI의 등장으로 디지털 격차는 오히려 줄어들 가능성이 크다는 것이 일반적으로 합의된 견해다.",
        answer: "X",
        explanation:
          "AI가 격차를 줄일지 키울지는 여전히 논쟁적인 주제입니다. 기초 역량이 부족하면 AI조차 제대로 활용하기 어려워, 격차가 더 벌어질 수 있다는 우려도 있습니다.",
      },
      {
        id: "digital-divide-8",
        question:
          "디지털 격차 해소를 위한 정책은 주로 기기 보급에만 집중되어 왔고, 활용 교육은 상대적으로 부족했다는 지적이 있다.",
        answer: "O",
        explanation:
          "그동안의 디지털 격차 해소 정책은 기기·인프라 보급에 집중된 경우가 많았고, 활용 능력을 기르는 체계적인 교육은 상대적으로 부족했다는 비판이 꾸준히 제기되어 왔습니다.",
      },
      {
        id: "digital-divide-9",
        question: "디지털 격차가 심할수록 오히려 경제적 기회는 균등해지는 경향이 있다.",
        answer: "X",
        explanation:
          "디지털 격차가 클수록 정보·기회에 대한 접근이 불균등해져, 경제적 격차도 함께 커지는 경향이 있다는 것이 일반적인 시각입니다.",
      },
      {
        id: "digital-divide-10",
        question: "공익활동가나 비영리조직 구성원들도 디지털 격차의 영향을 받을 수 있다.",
        answer: "O",
        explanation:
          "공익활동가나 비영리조직 구성원도 예외가 아닙니다. 바쁜 현실 속에서 체계적인 디지털 교육 기회를 얻기 어려워, 스스로 역량이 부족하다고 느끼는 경우가 많다는 것이 현장에서 지적되어 왔습니다.",
      },
    ],
  },
  {
    id: "ai-screentime",
    title: "AI·스크린타임",
    icon: "📱",
    description: "화면 속 알고리즘이 내 시간과 마음을 다루는 방식",
    questions: [
      {
        id: "ai-screentime-1",
        question: "'당겨서 새로고침(Pull-to-Refresh)' 동작은 디지털 과몰입을 방지하기 위해 만들어졌다.",
        answer: "X",
        explanation:
          "화면을 당겼을 때 어떤 새로운 소식(보상)이 나올지 모르는 불확실성이 도파민을 강력하게 자극합니다. 카지노 슬롯머신과 같은 원리로, '간헐적 변동 보상'이라 불리는 행동 중독 유도 디자인입니다.",
      },
      {
        id: "ai-screentime-2",
        question: "SNS를 과도하게 사용하면 분비되는 '도파민'은 많이 분비될수록 무조건 뇌 건강과 행복감에 좋다.",
        answer: "X",
        explanation:
          "도파민이 과도하게 지속 분비되면 자극에 무뎌지는 내성이 생기고, 일상적인 활동에서 쉽게 지루함을 느끼는 '팝콘 브레인' 현상이 나타날 수 있습니다.",
      },
      {
        id: "ai-screentime-3",
        question:
          "좋아하거나 자주 보는 분야의 정보만 추천받아 반대 견해는 차단되고 편향된 정보에 갇히는 현상을 '필터 버블(Filter Bubble)'이라고 한다.",
        answer: "O",
        explanation: "플랫폼이 사용자 취향에 맞춘 정보만 보여주면서 편향된 세계관을 갖게 되는 현상입니다. 확증편향과 사회적 양극화를 심화시킬 수 있습니다.",
      },
      {
        id: "ai-screentime-4",
        question: "AI 챗봇이 사실이 아닌 정보를 마치 진짜인 것처럼 그럴듯하게 만들어내는 현상을 'AI 환각(Hallucination)'이라고 한다.",
        answer: "O",
        explanation: "언어모델이 확률적으로 그럴듯한 단어를 이어 붙이는 과정에서 발생하며, 사실이 아닌 내용을 자신 있게 출력하는 대표적인 한계입니다.",
      },
      {
        id: "ai-screentime-5",
        question: "외로울 때 AI 챗봇에 의존하는 습관은 현실의 인간관계 형성 능력에 아무런 부정적 영향을 주지 않는다.",
        answer: "X",
        explanation: "거절과 갈등 없이 맞춰주는 AI 대화에 익숙해지면, 갈등과 타협이 필요한 실제 인간관계에서 피로감과 회피 경향이 커질 수 있습니다.",
      },
      {
        id: "ai-screentime-6",
        question: "불안을 유발하는 사건 소식을 계속 찾아보며 스크롤을 내리는 행위를 '둠스크롤링(Doomscrolling)'이라고 한다.",
        answer: "O",
        explanation:
          "위협 정보에 더 민감하게 반응하는 '부정성 편향'을 이용해, 플랫폼이 부정적이고 자극적인 뉴스를 상단에 우선 노출하기 때문에 나타나는 현상입니다.",
      },
      {
        id: "ai-screentime-7",
        question: "'디지털 디톡스(Digital Detox)'는 스마트폰 백신 프로그램을 설치해 악성코드를 치료하는 보안 활동을 뜻한다.",
        answer: "X",
        explanation: "보안 용어가 아니라, 디지털 기기 사용을 일정 기간 줄이거나 중단해 뇌와 마음의 스트레스를 해소하는 웰빙 활동을 뜻합니다.",
      },
      {
        id: "ai-screentime-8",
        question: "탈퇴·구독취소를 의도적으로 복잡하게 만들어 서비스 이용을 강제로 유도하는 화면 설계를 '유니버설 디자인'이라고 한다.",
        answer: "X",
        explanation: "이는 '다크 패턴(Dark Pattern)'이라고 부릅니다. 가입은 쉽게, 해지는 어렵게 만들어 이용자의 이탈을 막는 기만적 설계입니다.",
      },
    ],
  },
  {
    id: "digital-safety",
    title: "생활 속 디지털 보안",
    icon: "🛡️",
    description: "일상에서 바로 써먹는 디지털 보안 습관",
    questions: [
      {
        id: "digital-safety-1",
        question: "프로젝트 참가자 명단 파일과 암호를 같은 단체 카톡방에 함께 보내도 안전하다.",
        answer: "X",
        explanation:
          "파일과 암호를 같은 채널로 보내면 계정 탈취 시 함께 유출될 수 있습니다. 명단은 긴 암호로 암호화해 메일·메신저로 보내고, 암호는 문자·전화 등 다른 채널로 따로 전달하세요. 링크 공유 시 접근 계정을 제한하고, 오래된 링크는 주기적으로 삭제하세요.",
      },
      {
        id: "digital-safety-2",
        question: "윈도우나 스마트폰 업데이트를 미루는 것은 특별히 위험하지 않다.",
        answer: "X",
        explanation:
          "업데이트를 미루면 이미 알려진 보안 취약점에 그대로 노출됩니다. 윈도우·브라우저·백신은 자동 업데이트를 켜고 반드시 실행하고, 지원이 끊긴 오래된 프로그램은 삭제하세요. 스마트폰도 앱·운영체제 자동 업데이트를 켜두세요.",
      },
      {
        id: "digital-safety-3",
        question: "가족이 전화로 급하게 돈이 필요하다고 하면, 문자로 알려준 번호로 바로 연락해 확인하면 된다.",
        answer: "X",
        explanation:
          "문자 속 번호가 아니라 기존에 저장해둔 번호로 직접 전화해 목소리와 상황을 확인해야 합니다. 신분증·인증번호는 가족에게도 보내지 말고, 가족 간 비상 암호를 미리 정해두세요.",
      },
      {
        id: "digital-safety-4",
        question: "SNS나 숏폼에서 자극적인 소식을 보면 사실 확인 없이 바로 공유하는 게 좋다.",
        answer: "X",
        explanation:
          "AI로 가짜뉴스·가짜 영상을 누구나 쉽게 만들 수 있는 시대입니다. 출처가 불분명하거나 자극적인 소식은 언론사 보도 여부를 확인하고, 제작 목적을 생각해본 뒤 공유 대신 신고·차단을 고려하세요.",
      },
      {
        id: "digital-safety-5",
        question: "랜섬웨어에 걸려 파일이 암호화됐을 때, 돈을 지불하면 반드시 파일을 되찾을 수 있다.",
        answer: "X",
        explanation:
          "돈을 지불해도 복구가 보장되지 않습니다. 평소 백업 습관이 가장 중요합니다. 메일 첨부파일은 함부로 열지 말고, 스마트폰은 스마트스위치·아이클라우드로, 윈도우는 원드라이브로 미리 백업하세요.",
      },
      {
        id: "digital-safety-6",
        question: "내 개인 기기 하나가 해킹당해도 조직 전체에는 영향을 주지 않는다.",
        answer: "X",
        explanation:
          "해킹당한 개인 기기·계정은 조직의 클라우드·중앙 서버를 공격하는 징검다리로 악용될 수 있습니다. 알 수 없는 와이파이는 연결하지 말고, 주요 서비스에 2단계 인증을 설정하세요. 기기가 이상하면 즉시 담당자에게 알리세요.",
      },
    ],
  },
];

const quizTopicIds = quizTopics.map((topic) => topic.id);

export function isQuizTopicId(value: string): value is QuizTopicId {
  return (quizTopicIds as string[]).includes(value);
}

export function getQuizTopic(id: QuizTopicId): QuizTopic {
  const found = quizTopics.find((topic) => topic.id === id);
  if (!found) throw new Error(`알 수 없는 퀴즈 주제 ID입니다: ${id}`);
  return found;
}

export function getTotalQuizQuestionCount(): number {
  return quizTopics.reduce((sum, topic) => sum + topic.questions.length, 0);
}

/** 온라인 공개 시 정답 노출 우려를 줄이기 위해 문항 순서를 매번 섞는다(기획안 11절). */
export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 맞고 틀림보다 해설을 읽는 경험이 핵심이므로(기획안 11절), 점수와 무관하게 부담 없는 톤을 유지한다.
 */
export function getQuizFeedbackMessage(topicTitle: string, correct: number, total: number): string {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio >= 0.8) return `${topicTitle}의 숨은 이야기를 잘 알고 계시네요`;
  if (ratio >= 0.5) return `${topicTitle}, 어느 정도 알고 계셨네요`;
  return `${topicTitle}에 대해 새롭게 알아가 볼까요`;
}
