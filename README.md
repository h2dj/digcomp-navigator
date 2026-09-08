# DigComp Navigator

DigComp 3.0 기반 공익활동가의 디지털 역량 자가 진단 사이트입니다. 한국 비영리조직 임직원이
5개 영역, 21개 역량 항목에 대해 자가진단하고 결과를 시각화해 볼 수 있는 Next.js MVP입니다.

## 주요 기능

- DigComp 3.0 5개 영역 및 21개 역량 항목 안내
- 영역별 단계 진행 방식의 자가진단
- 5점 척도 응답을 0~4점 숙련도 점수로 환산
- 레이더 차트, 영역별 평균 비교, 강점 TOP 3, 개발 필요 TOP 3 표시
- 브라우저 로컬 저장소 기반 진단 이력, 대시보드, 비교 분석, 프로필 설정
- 최소 통계 인원 10명 미만 비공개 원칙을 반영한 공개 통계/개인정보 안내

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증

```bash
npm run typecheck
npm run build
npm start
```

로컬 프로덕션 미리보기: `http://localhost:3000`

## 프로덕션 배포

브라우저 `localStorage`와 **서버 DB(Neon PostgreSQL)** 에 이용자 정보·진단 결과를 함께 저장합니다.

### 환경 변수 (Vercel)

| 변수 | 용도 |
|------|------|
| `DATABASE_URL` | 이용자·진단 결과 영구 저장 (Neon) |
| `RESEND_API_KEY` / `EMAIL_FROM` | 결과 이메일 발송 |
| `NEXT_PUBLIC_SITE_URL` | SNS 공유 링크 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 이용자 분석 |

GA4에서 확인할 수 있는 맞춤 이벤트:

| 이벤트 | 발생 시점 | 주요 파라미터 |
|--------|-----------|---------------|
| `assessment_start` | 진단 시작하기 클릭 | `assessment_type`, `deep_level` |
| `assessment_complete` | 진단 완료 | `assessment_type`, `proficiency_level`, `overall_score`, `deep_level` |
| `profile_save` | 프로필 저장 | `has_email`, `role`, `organization_type` |
| `academy_view` | (가칭) 디지털 배움대학 페이지 진입 | `source` |
| `academy_cta_click` | 배움대학 페이지/진단 결과의 CTA 클릭 | `cta_id` |
| `academy_form_submit` | 관심 등록 폼 제출 완료 | `interest_count` |

DB 스키마는 `scripts/schema.sql`을 참고하세요. API 첫 호출 시 테이블이 자동 생성됩니다.

### 방법 A — Vercel (권장, 가장 빠름)

1. [GitHub](https://github.com/h2dj/digcomp-navigator)에 최신 코드를 push합니다.
2. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인합니다.
3. **Add New Project** → `digcomp-navigator` 저장소를 선택합니다.
4. Framework Preset: **Next.js** (자동 감지)
5. Environment Variables에 `DATABASE_URL` 등을 등록하고 **Deploy**합니다.
6. 배포가 끝나면 `https://프로젝트명.vercel.app` URL을 테스터에게 공유합니다.

이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다.

### 방법 B — Docker (VPS·클라우드 VM)

```bash
docker build -t digcomp-navigator .
docker run -p 3000:3000 digcomp-navigator
```

방화벽에서 3000 포트를 열고 `http://서버IP:3000`으로 접속합니다. HTTPS는 Nginx/Caddy 등 리버스 프록시를 앞에 두세요.

### 방법 C — 서버에서 직접 실행

```bash
npm ci
npm run build
npm start
# 또는 standalone: npm run start:standalone
```

`PORT=8080 npm start`처럼 포트를 바꿀 수 있습니다.

### 테스터에게 알릴 점

- 진단 결과는 브라우저와 서버에 저장됩니다. **프로필에 이메일**을 입력하면 다른 기기에서도 불러올 수 있습니다.
- `DATABASE_URL` 미설정 시 서버 저장은 되지 않고 브라우저에만 남습니다.
- 시크릿/프라이빗 모드에서는 창을 닫으면 로컬 데이터가 사라질 수 있습니다.
- 공개 통계(`/stats`)는 데모용 고정 수치이며, **통합 통계**(항상 공개)와 **세그먼트별 통계**(10명 이상만 평균 공개)로 구분됩니다.

## (가칭) 디지털 배움대학

`/baeumdaehak` 경로에 있는 소개 페이지로, 기존 사이트 내 “개발 가이드” 메뉴를 대체합니다. 진단 결과를
실제 학습 기회로 연결하기 위한 온보딩 페이지이며, 독립된 브랜딩(컬러·타이포)을 사용합니다.

- 진단 결과 화면(`/results`)에 이 페이지로 연결되는 CTA가 있습니다.
- 이메일 + 관심 분야(복수 선택) + 선택 자유서술로 구성된 관심 등록 폼을 제공하며, 제출 내용은
  `academy_interests` 테이블(`scripts/schema.sql` 참고)에 저장됩니다. `DATABASE_URL` 미설정 시에는
  저장 없이 정상 응답만 반환합니다.
- 유형별 추천 과정 연결, 진단 관심사 기반 개인화, 추천 결과 저장·공유, 파일럿 수요 기반 과정 우선순위
  조정은 후속 고도화 범위로 이번 개편에는 포함하지 않았습니다.

## Development / 개발 안내

사이트 내부에는 별도의 개발 문서 페이지를 두지 않습니다. 과거 “개발 가이드” 메뉴가 제공하던 역량
영역별 추천 학습 링크는 아래처럼 보관합니다 (현재는 `/baeumdaehak` 소개 페이지가 이 메뉴를 대체합니다).

<details>
<summary>이전 “개발 가이드” 추천 링크 (아카이브)</summary>

**정보문해력**
- [공공데이터포털](https://www.data.go.kr) — 공익 의제 조사에 활용할 수 있는 공공 데이터 탐색
- [팩트체크넷](https://factchecker.or.kr) — 온라인 정보 검증과 사실 확인 사례 학습

**소통과 협업**
- [Google for Nonprofits](https://www.google.com/nonprofits/) — 비영리 협업 도구와 운영 사례
- [Slack Nonprofit Guide](https://slack.com/intl/ko-kr/solutions/nonprofit) — 팀 커뮤니케이션 설계 참고

**콘텐츠 제작**
- [Creative Commons Korea](https://creativecommons.org/licenses/?lang=ko) — 저작권과 오픈 라이선스 이해
- [Canva Design School](https://www.canva.com/learn/) — 캠페인 콘텐츠 제작 기초

**안전**
- [개인정보보호위원회](https://www.pipc.go.kr) — 개인정보 보호 법제와 가이드라인
- [Google Safety Center](https://safety.google/intl/ko/) — 계정 보안과 피싱 예방 학습

**문제해결**
- [TechSoup Korea](https://www.techsoupkorea.kr) — 비영리 디지털 도구와 교육 자원
- [NPO스쿨](https://www.snpo.kr/bbs/board.php?bo_table=npo_aca) — 공익활동가 역량 강화 교육 탐색

</details>
