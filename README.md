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

이 MVP는 **서버 API·DB 없이** 브라우저 `localStorage`에 진단 결과를 저장합니다. 배포 시 별도 비밀키가 필요하지 않습니다.

### 방법 A — Vercel (권장, 가장 빠름)

1. [GitHub](https://github.com/h2dj/digcomp-navigator)에 최신 코드를 push합니다.
2. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인합니다.
3. **Add New Project** → `digcomp-navigator` 저장소를 선택합니다.
4. Framework Preset: **Next.js** (자동 감지)
5. Environment Variables: 비워 두고 **Deploy**를 누릅니다.
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

- 진단 결과는 **각자 브라우저**에만 저장됩니다 (기기·브라우저를 바꾸면 이전 결과가 없을 수 있음).
- 시크릿/프라이빗 모드에서는 창을 닫으면 데이터가 사라질 수 있습니다.
- 공개 통계(`/stats`)는 데모용 고정 수치입니다.
