
import { Division } from './models';

export interface EnemyStats {
  shikona: string;
  rankValue: number; // 1(Yokozuna) - 13(Jonokuchi)
  power: number;
}

// 幕内 (42名)
// 横綱: 145-150, 大関: 130-140, 関脇/小結: 120-130, 平幕: 100-120
const Makuuchi: EnemyStats[] = [
    { shikona: "大横綱・雷電", rankValue: 1, power: 150 }, // 最強ボス
    { shikona: "横綱・北の湖", rankValue: 1, power: 145 },
    { shikona: "大関・貴ノ花", rankValue: 2, power: 135 },
    { shikona: "大関・千代の富士", rankValue: 2, power: 132 }, // 大関時代
    { shikona: "関脇・若乃花", rankValue: 3, power: 130 },
    { shikona: "関脇・輪島", rankValue: 3, power: 128 },
    { shikona: "小結・高見山", rankValue: 4, power: 125 },
    { shikona: "小結・琴櫻", rankValue: 4, power: 123 },
    // 平幕上位 (Power 115-120)
    { shikona: "前頭・朝潮", rankValue: 5, power: 120 },
    { shikona: "前頭・北天佑", rankValue: 5, power: 118 },
    { shikona: "前頭・旭富士", rankValue: 5, power: 117 },
    { shikona: "前頭・双羽黒", rankValue: 5, power: 116 },
    { shikona: "前頭・小錦", rankValue: 5, power: 115 },
    // 平幕中位 (Power 105-114)
    { shikona: "前頭・霧島", rankValue: 5, power: 114 },
    { shikona: "前頭・水戸泉", rankValue: 5, power: 112 },
    { shikona: "前頭・寺尾", rankValue: 5, power: 110 },
    { shikona: "前頭・舞の海", rankValue: 5, power: 108 },
    { shikona: "前頭・智ノ花", rankValue: 5, power: 106 },
    { shikona: "前頭・琴錦", rankValue: 5, power: 105 },
    // 平幕下位 (Power 100-104) x Rest
    ...Array.from({ length: 26 }, (_, i) => ({
        shikona: `幕内力士${i + 1}`,
        rankValue: 5,
        power: 100 + Math.floor(Math.random() * 5)
    }))
];

// 十両 (28名) - Power 90-105
const Juryo: EnemyStats[] = [
    { shikona: "十両筆頭・安芸乃島", rankValue: 6, power: 105 },
    { shikona: "十両・貴闘力", rankValue: 6, power: 102 },
    { shikona: "十両・琴別府", rankValue: 6, power: 100 },
    { shikona: "十両・若翔洋", rankValue: 6, power: 98 },
    { shikona: "十両・大至", rankValue: 6, power: 95 },
    ...Array.from({ length: 23 }, (_, i) => ({
        shikona: `十両力士${i + 1}`,
        rankValue: 6,
        power: 90 + Math.floor(Math.random() * 10)
    }))
];

// 幕下 (Power 70-90)
const Makushita: EnemyStats[] = [
    { shikona: "幕下筆頭・未来の関取", rankValue: 7, power: 90 },
    { shikona: "幕下・ベテラン", rankValue: 7, power: 85 },
    { shikona: "幕下・怪我明け", rankValue: 7, power: 80 },
    ...Array.from({ length: 7 }, (_, i) => ({
        shikona: `幕下力士${i + 1}`,
        rankValue: 7,
        power: 70 + Math.floor(Math.random() * 15)
    }))
];

// 三段目 (Power 50-70)
const Sandanme: EnemyStats[] = [
    { shikona: "三段目・期待株", rankValue: 8, power: 70 },
    ...Array.from({ length: 9 }, (_, i) => ({
        shikona: `三段目力士${i + 1}`,
        rankValue: 8,
        power: 50 + Math.floor(Math.random() * 20)
    }))
];

// 序二段 (Power 40-50)
const Jonidan: EnemyStats[] = [
    { shikona: "序二段・小兵", rankValue: 9, power: 50 },
    ...Array.from({ length: 9 }, (_, i) => ({
        shikona: `序二段力士${i + 1}`,
        rankValue: 9,
        power: 40 + Math.floor(Math.random() * 10)
    }))
];

// 序ノ口 (Power 30-40)
const Jonokuchi: EnemyStats[] = [
    { shikona: "序ノ口・新人", rankValue: 10, power: 40 },
    ...Array.from({ length: 9 }, (_, i) => ({
        shikona: `序ノ口力士${i + 1}`,
        rankValue: 10,
        power: 30 + Math.floor(Math.random() * 10)
    }))
];

// 前相撲 (Power 25-30)
const Maezumo: EnemyStats[] = [
    { shikona: "前相撲・未経験", rankValue: 11, power: 25 },
    { shikona: "前相撲・柔道部", rankValue: 11, power: 28 },
    { shikona: "前相撲・怪力", rankValue: 11, power: 30 }
];


export const ENEMY_POOL: Record<Division, EnemyStats[]> = {
  'Makuuchi': Makuuchi,
  'Juryo': Juryo,
  'Makushita': Makushita,
  'Sandanme': Sandanme,
  'Jonidan': Jonidan,
  'Jonokuchi': Jonokuchi,
  'Maezumo': Maezumo
};
