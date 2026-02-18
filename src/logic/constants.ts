import { Division } from './models';

export const CONSTANTS = {
  // 力士設定
  MIN_AGE: 15,
  MANDATORY_RETIREMENT_AGE: 45, // さすがにここより上は強制引退
  
  // 場所設定
  BASHO_PER_YEAR: 6,
  
  // 階級ごとの取組数
  BOUTS_MAP: {
    'Makuuchi': 15,
    'Juryo': 15,
    'Makushita': 7,
    'Sandanme': 7,
    'Jonidan': 7,
    'Jonokuchi': 7,
    'Maezumo': 3 // 前相撲は簡易的に3番とする
  } as Record<Division, number>,

  // 番付の序列（数値が小さいほど偉い）
  RANK_VALUE: {
    'Makuuchi': 5, // 前頭相当
    'Yokozuna': 1,
    'Ozeki': 2,
    'Sekiwake': 3,
    'Komusubi': 4,
    'Maegashira': 5,
    'Juryo': 6,
    'Makushita': 7,
    'Sandanme': 8,
    'Jonidan': 9,
    'Jonokuchi': 10,
    'Maezumo': 11
  },

  // 成長タイプごとの補正
  GROWTH_PARAMS: {
    'EARLY': { peakStart: 20, peakEnd: 25, decayStart: 26, growthRate: 1.5 },
    'NORMAL': { peakStart: 24, peakEnd: 29, decayStart: 30, growthRate: 1.0 },
    'LATE': { peakStart: 28, peakEnd: 33, decayStart: 34, growthRate: 0.8 }, // 長く伸びる
    'GENIUS': { peakStart: 22, peakEnd: 30, decayStart: 32, growthRate: 1.2 }
  },

  // 戦術タイプごとの成長補正 (1.0 = 標準, >1.0 = 成長しやすい)
  TACTICAL_GROWTH_MODIFIERS: {
    'PUSH': { tsuki: 1.5, oshi: 1.5, deashi: 1.5, kumi: 0.8, nage: 0.8, koshi: 1.0, waza: 1.0, power: 1.2 },
    'GRAPPLE': { kumi: 1.5, nage: 1.5, koshi: 1.2, tsuki: 0.8, oshi: 0.8, deashi: 1.0, waza: 1.0, power: 1.2 },
    'TECHNIQUE': { waza: 1.5, nage: 1.2, koshi: 0.8, deashi: 1.2, tsuki: 0.9, oshi: 0.9, kumi: 1.0, power: 0.8 },
    'BALANCE': { tsuki: 1.0, oshi: 1.0, kumi: 1.0, nage: 1.0, koshi: 1.0, deashi: 1.0, waza: 1.0, power: 1.0 }
  }
};
