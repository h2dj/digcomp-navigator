"use client";

import { useEffect, useState } from "react";
import { defaultProfile, getProfile, saveProfile, type Profile } from "@/lib/scoring";
import { pushUserDataToServer } from "@/lib/user-sync";

const roleOptions = ["실무 직원", "중간 관리자", "교육 담당자", "임원/대표"];
const organizationOptions = ["시민사회단체", "복지기관", "재단", "협동조합", "기타"];
const yearOptions = ["1년 미만", "1-3년", "4-7년", "8-10년", "10년 이상"];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setSaved(false);
    setProfile((previous) => ({ ...previous, [key]: value }));
  }

  return (
    <>
      <section className="page-title">
        <span className="eyebrow">Profile</span>
        <h1>프로필 설정</h1>
        <p>
          직군, 조직 유형, 근무 연수는 통계 비교 분류에 활용됩니다. 이메일을 입력하면 다른 기기에서도
          결과를 불러올 수 있습니다.
        </p>
      </section>

      <section className="section compact">
        <article className="card">
          <div className="form-grid">
            <div className="field form-grid-full">
              <label htmlFor="email">이메일 (결과 복원용)</label>
              <input
                id="email"
                type="email"
                placeholder="example@organization.org"
                value={profile.email ?? ""}
                onChange={(event) => updateProfile("email", event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="role">직군</label>
              <select id="role" value={profile.role} onChange={(event) => updateProfile("role", event.target.value)}>
                {roleOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="organizationType">조직 유형</label>
              <select
                id="organizationType"
                value={profile.organizationType}
                onChange={(event) => updateProfile("organizationType", event.target.value)}
              >
                {organizationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="years">근무 연수</label>
              <select id="years" value={profile.years} onChange={(event) => updateProfile("years", event.target.value)}>
                {yearOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="emailOptIn">재진단 알림</label>
              <select
                id="emailOptIn"
                value={profile.emailOptIn ? "yes" : "no"}
                onChange={(event) => updateProfile("emailOptIn", event.target.value === "yes")}
              >
                <option value="no">받지 않음</option>
                <option value="yes">3개월 미진단 시 이메일 알림</option>
              </select>
            </div>
          </div>
          <div className="cta-row">
            <button
              className="button"
              type="button"
              onClick={() => {
                saveProfile(profile);
                void pushUserDataToServer({ profile });
                setSaved(true);
              }}
            >
              저장하기
            </button>
            {saved ? <span className="level-badge">저장되었습니다</span> : null}
          </div>
        </article>
      </section>
    </>
  );
}
