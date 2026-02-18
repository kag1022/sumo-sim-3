import { Division, InjuryType, TalentArchetype } from './models';

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

  // 才能タイプ定義
  TALENT_ARCHETYPES: {
    'MONSTER': { name: '怪物（横綱級）', description: '100年に1人の逸材。規格外のパワーを持つ。', potentialRange: [90, 100], initialStatBonus: 20 },
    'GENIUS': { name: '天才（三役級）', description: '天性の相撲センスを持つ若武者。', potentialRange: [75, 95], initialStatBonus: 10 },
    'HARD_WORKER': { name: '叩き上げ（幕下〜関取）', description: '地道な稽古で強くなる、標準的な入門者。', potentialRange: [40, 80], initialStatBonus: 0 },
    'AVG_JOE': { name: '一般（序二段〜三段目）', description: '体格には恵まれていないが、相撲への熱意はある。', potentialRange: [30, 60], initialStatBonus: -10 },
    'UNIVERSITY_YOKOZUNA': { name: '学生横綱', description: '大学相撲の頂点。即戦力として期待される。', potentialRange: [70, 95], initialStatBonus: 30, canTsukedashi: true },
    'HIGH_SCHOOL_CHAMP': { name: '高校横綱', description: '高校相撲界の覇者。将来性は抜群。', potentialRange: [60, 90], initialStatBonus: 15 },
    'STREET_FIGHTER': { name: '喧嘩屋', description: '荒削りだが、強烈な闘争心を持つ。', potentialRange: [50, 90], initialStatBonus: 20 }
  } as Record<TalentArchetype, { name: string, description: string, potentialRange: [number, number], initialStatBonus: number, canTsukedashi?: boolean }>,

  // 得意技データ
  SIGNATURE_MOVE_DATA: {
    '押し出し': { relatedStats: ['tsuki', 'oshi', 'deashi'], winRateBonus: 0.5 }, 
    '突き出し': { relatedStats: ['tsuki', 'deashi', 'power'], winRateBonus: 0.5 },
    '寄り切り': { relatedStats: ['kumi', 'koshi', 'deashi'], winRateBonus: 0.5 },
    '上手投げ': { relatedStats: ['nage', 'power', 'kumi'], winRateBonus: 0.6 },
    '掬い投げ': { relatedStats: ['nage', 'waza', 'kumi'], winRateBonus: 0.6 },
    '叩き込み': { relatedStats: ['tsuki', 'waza', 'deashi'], winRateBonus: 0.4 },
    '突き落とし': { relatedStats: ['tsuki', 'waza', 'kumi'], winRateBonus: 0.4 },
  } as Record<string, { relatedStats: string[], winRateBonus: number }>,

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
  },

  // 確率・イベント系
  PROBABILITY: {
    INJURY_PER_BOUT: 0.005, // 0.5%
    AWAKENING_GROWTH: 0.05, // 5%
    CHRONIC_CONVERSION: 0.1, // 10%
    // 優勝判定 (勝利数に応じた確率)
    YUSHO: {
        MAKUUCHI_14: 0.8,
        MAKUUCHI_13: 0.3,
        JURYO_14: 0.9,
        LOWER_7: 0.9
    }
  },

  // 怪我の種類定義
  INJURY_DATA: {
    'KNEE': { name: '膝半月板損傷', weight: 30, severityMin: 3, severityMax: 8, affectedStats: ['deashi', 'oshi', 'kumi'] },
    'SHOULDER': { name: '肩脱臼', weight: 20, severityMin: 2, severityMax: 7, affectedStats: ['tsuki', 'nage', 'power'] },
    'ELBOW': { name: '肘靭帯損傷', weight: 15, severityMin: 2, severityMax: 6, affectedStats: ['tsuki', 'waza'] },
    'BACK': { name: '腰椎分離症', weight: 15, severityMin: 4, severityMax: 9, affectedStats: ['koshi', 'power', 'deashi'] },
    'ANKLE': { name: '足首捻挫', weight: 10, severityMin: 1, severityMax: 5, affectedStats: ['deashi', 'waza'] },
    'NECK': { name: '首の負傷', weight: 10, severityMin: 5, severityMax: 10, affectedStats: ['kumi', 'tsuki', 'power'] }
  } as Record<InjuryType, { name: string, weight: number, severityMin: number, severityMax: number, affectedStats: string[] }>
};
