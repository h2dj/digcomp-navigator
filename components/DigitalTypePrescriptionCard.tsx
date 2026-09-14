import { getDigitalTypeCardImageUrl, type DigitalTypeId } from "@/data/digital-types";

type DigitalTypePrescriptionCardProps = {
  typeId: DigitalTypeId;
  typeName: string;
};

/**
 * 서울공익활동박람회 부스에서 배포한 "디지털 미니 처방전" 카드 이미지를 보여준다.
 * 강점·주의점·오늘의 처방·성장 가이드·추천 도구까지 담긴 유형별 상세 카드.
 */
export function DigitalTypePrescriptionCard({ typeId, typeName }: DigitalTypePrescriptionCardProps) {
  const imageUrl = getDigitalTypeCardImageUrl(typeId);

  return (
    <section className="card type-prescription-card">
      <span className="eyebrow">디지털 미니 처방전</span>
      <h2>{typeName}의 강점·주의점·성장 가이드</h2>
      <a href={imageUrl} target="_blank" rel="noreferrer" className="type-prescription-image-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={`${typeName} 디지털 미니 처방전 카드`} className="type-prescription-image" />
      </a>
      <p className="muted">이미지를 누르면 크게 볼 수 있어요.</p>
    </section>
  );
}
