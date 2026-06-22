export default function PrivacyPage() {
  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Privacy by design</span>
        <h1>개인정보 보호 원칙</h1>
        <p>
          비영리 디지털 역량 진단 플랫폼은 개인 응답의 민감성을 고려해 최소 수집, 목적 제한, 익명
          집계, 세그먼트 보호를 기본 설계 원칙으로 삼습니다.
        </p>
      </section>

      <section className="section compact">
        <div className="grid two">
          {[
            ["최소 수집", "회원가입 시 이메일과 비밀번호만 필수로 받고, 조직 유형·직군·근무 연수는 선택 정보로 둡니다."],
            ["본인 조회", "개인별 응답 원자료와 진단 이력은 본인 계정에서만 조회할 수 있도록 설계합니다."],
            ["익명 집계", "공개 통계와 비교 분석에는 개인을 식별할 수 없는 평균과 분포만 활용합니다."],
            ["10명 미만 비공개", "동일 직군·조직 유형 등 세그먼트가 10명 미만이면 집계 수치를 공개하지 않습니다."],
            ["탈퇴 처리", "회원 탈퇴 시 개인 식별 정보는 즉시 삭제하고, 통계 목적의 익명 집계만 유지합니다."],
            ["선택 알림", "3개월 이상 미진단 시 재진단 알림 이메일은 명시적으로 동의한 사용자에게만 발송합니다."],
          ].map(([title, description]) => (
            <article className="card" key={title}>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
