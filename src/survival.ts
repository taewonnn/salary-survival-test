export type SpendingType = 'save' | 'normal' | 'flex';
export type HousingType = 'oneroom' | 'officetel' | 'new';

export interface SurvivalInput {
  salary: number;
  spendingType: SpendingType;
  housingType: HousingType;
  hasCar: boolean;
}

export interface RegionResult {
  name: string;
  emoji: string;
  score: number;
  totalCost: number;
  label: string;
  color: string;
  resultEmoji: string;
}

const SPENDING_MULTIPLIER: Record<SpendingType, number> = {
  save: 0.8,
  normal: 1.0,
  flex: 1.35,
};

const HOUSING_EXTRA: Record<HousingType, number> = {
  oneroom: 0,
  officetel: 35,
  new: 60,
};

const CAR_COST = 40;

const REGIONS: Array<{ name: string; emoji: string; baseCost: number }> = [
  { name: '강남', emoji: '🏙️', baseCost: 320 },
  { name: '성수', emoji: '☕', baseCost: 280 },
  { name: '잠실', emoji: '🏟️', baseCost: 260 },
  { name: '마포', emoji: '🌿', baseCost: 240 },
  { name: '수원', emoji: '🏰', baseCost: 180 },
  { name: '부산', emoji: '🌊', baseCost: 170 },
  { name: '대구', emoji: '🍎', baseCost: 160 },
];

function getResultMeta(score: number): { label: string; color: string; resultEmoji: string } {
  if (score >= 1.5) return { label: '왕처럼 가능', color: '#22C55E', resultEmoji: '👑' };
  if (score >= 1.2) return { label: '여유롭게 가능', color: '#22C55E', resultEmoji: '😊' };
  if (score >= 1.0) return { label: '무난하게 생존', color: '#EAB308', resultEmoji: '😅' };
  if (score >= 0.8) return { label: '통장 잔고 위험', color: '#EAB308', resultEmoji: '😰' };
  if (score >= 0.6) return { label: '배달앱 삭제 권장', color: '#EF4444', resultEmoji: '😭' };
  return { label: '다음 생에 도전', color: '#EF4444', resultEmoji: '💀' };
}

export function calcAllRegions(input: SurvivalInput): RegionResult[] {
  const { salary, spendingType, housingType, hasCar } = input;
  const housingExtra = HOUSING_EXTRA[housingType];
  const carCost = hasCar ? CAR_COST : 0;

  return REGIONS.map(({ name, emoji, baseCost }) => {
    const totalCost =
      Math.round(baseCost * SPENDING_MULTIPLIER[spendingType]) + housingExtra + carCost;
    const score = salary / totalCost;
    const { label, color, resultEmoji } = getResultMeta(score);
    return { name, emoji, score, totalCost, label, color, resultEmoji };
  });
}

export const SPENDING_LABELS: Record<SpendingType, string> = {
  save: '절약형',
  normal: '보통형',
  flex: '플렉스형',
};

export const HOUSING_LABELS: Record<HousingType, string> = {
  oneroom: '원룸',
  officetel: '오피스텔',
  new: '신축/역세권',
};
