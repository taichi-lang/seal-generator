/** 有料パック購入者に発行する利用許諾書の本文を組み立てる。
 *
 * 発行番号は Stripe の Checkout セッション ID をそのまま使う。
 * 当方に台帳はないが、Stripe 側の決済記録と 1 対 1 で照合できる。
 */

import { SELLER_NAME, CONTACT_EMAIL, SERVICE_NAME } from "./site";

export interface LicenseInput {
  companyName: string;
  licenseId: string;
  purchasedAt: number | null;
}

function formatDate(ms: number | null): string {
  if (!ms) return "(取得できませんでした)";
  const d = new Date(ms);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function buildLicenseText({
  companyName,
  licenseId,
  purchasedAt,
}: LicenseInput): string {
  return [
    `${SERVICE_NAME} 利用許諾書`,
    "",
    `発行番号: ${licenseId}`,
    `購入日: ${formatDate(purchasedAt)}`,
    `対象の印影: ${companyName}`,
    "",
    "【許諾する範囲】",
    `${SELLER_NAME}(以下「発行者」)は、上記の印影データについて、購入者に対し`,
    "次の利用を許諾します。期間の定めはありません。",
    "",
    "1. 請求書・見積書・納品書・契約書など、購入者の業務書類への使用",
    "2. 購入者の自社ウェブサイト・印刷物への使用",
    "3. 上記の目的に必要な範囲での複製・拡大縮小・色の変更",
    "",
    "【許諾しない範囲】",
    "1. 印影データそのものの再配布・販売・素材集への収録",
    "2. 第三者になりすます目的での使用",
    "",
    "【注意事項】",
    "本サービスが生成するのは画像データであり、実物の印章ではありません。",
    "印鑑登録(実印)には使用できません。生成された印影が既存の登録商標・",
    "他社の印影と類似しないことは保証しません。使用にあたっては購入者の",
    "責任においてご確認ください。",
    "",
    `発行者: ${SELLER_NAME}`,
    `連絡先: ${CONTACT_EMAIL}`,
  ].join("\n");
}
