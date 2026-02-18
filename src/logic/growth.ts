import { RikishiStatus, Oyakata } from './models';
import { CONSTANTS } from './constants';

/**
 * 能力成長・衰退ロジック
 * @param currentStatus 現在の状態
 * @param oyakata 親方パラメータ
 * @param injuryOccurred この場所で怪我をしたかどうか
 */
export const applyGrowth = (currentStatus: RikishiStatus, oyakata: Oyakata | null, injuryOccurred: boolean): RikishiStatus => {
  const { age, growthType, tactics, stats, injuryLevel, potential } = currentStatus;
  
  // 1. 基本成長率の取得（年齢とタイプに基づく）
  const params = CONSTANTS.GROWTH_PARAMS[growthType];
  let growthRate = 0;

  if (age < params.peakStart) {
    // 成長期
    growthRate = 2.0 * params.growthRate;
  } else if (age <= params.peakEnd) {
    // 全盛期（微増）
    growthRate = 0.5 * params.growthRate;
  } else if (age <= params.decayStart) {
    // 衰退開始前（維持〜微減）
    growthRate = -0.05;
  } else {
    // 衰退期
    const yearsPastPeak = age - params.decayStart;
    growthRate = -1.0 - (yearsPastPeak * 0.2); // 年々衰えが加速
  }

  // 2. 親方補正
  // 親方の得意分野なら伸びやすく、苦手なら伸びにくい（未実装なら1.0）
  
  // 3. 怪我補正
  if (injuryOccurred) {
    // 怪我をした場所は成長しないどころか大幅に下がる (5.0 -> 15.0)
    growthRate -= 15.0;
    // 癖になる（耐久力低下は呼び出し元で処理してもいいが、ここでは一時的なステータスダウンのみ）
  }

  // 4. 新しいステータス計算
  const newStats = { ...stats };
  const keys = Object.keys(newStats) as (keyof typeof stats)[];

  keys.forEach(key => {
    // 親方ボーナス
    const mod = oyakata?.growthMod[key] || 1.0;
    
    // 戦術タイプ補正 (成長時のみ適用)
    const tacticalMod = (growthRate > 0) 
      ? (CONSTANTS.TACTICAL_GROWTH_MODIFIERS[tactics || 'BALANCE'][key] || 1.0) 
      : 1.0;
    
    // 基本変動値 (ランダム係数を掛けて不規則にする: 0.0 ~ 1.5)
    const randomFactor = Math.random() * 1.5;
    let delta = growthRate * mod * tacticalMod * randomFactor;
    
    // ランダムな揺らぎ (大きくする: -1.0 ~ +1.0)
    delta += (Math.random() * 2.0 - 1.0);
    
    // 成長期の上振れ（覚醒）
    if (growthRate > 0 && Math.random() < 0.05) {
        delta += 2.0; // たまにグッと伸びる
    }

    // 適用
    newStats[key] = Math.min(100 + potential, Math.max(1, newStats[key] + delta));
  });

  // 5. 怪我レベルの回復
  let newInjuryLevel = injuryLevel;
  if (injuryOccurred) {
      newInjuryLevel += 2; // 重症化
  } else {
      newInjuryLevel = Math.max(0, newInjuryLevel - 1); // 自然治癒
  }
  
  // 6. 耐久力の変化（加齢とともに下がる）
  let newDurability = currentStatus.durability;
  if (age > 30) {
      newDurability -= 1;
  }

  return {
    ...currentStatus,
    stats: newStats,
    injuryLevel: newInjuryLevel,
    durability: newDurability
  };
};

/**
 * 引退判定
 * @returns boolean 引退すべきか
 */
export const checkRetirement = (status: RikishiStatus): { shouldRetire: boolean, reason?: string } => {
    // 1. 強制引退年齢
    if (status.age >= CONSTANTS.MANDATORY_RETIREMENT_AGE) {
        return { shouldRetire: true, reason: '定年により引退' };
    }

    // 1.5. 元関取の引き際（幕内・十両経験者）
    // 最高位が十両以上の場合
    const isFormerSekitori = ['Makuuchi', 'Juryo'].includes(status.history.maxRank.division);
    
    if (isFormerSekitori) {
        // A. 幕下陥落（復帰を諦める）
        if (!['Makuuchi', 'Juryo'].includes(status.rank.division)) {
            // 35歳以上で陥落したら引退（再起不能と判断されやすい）
            if (status.age >= 30) {
                 return { shouldRetire: true, reason: '度重なる怪我により気力・体力の限界' };
            }
        }

        // B. 大怪我（関取としてのプライド、または公傷制度なき今）
        // 怪我レベルが高い＝長期休場不可避
        if (status.injuryLevel >= 6 && status.age >= 22) {
             return { shouldRetire: true, reason: '怪我の回復が見込めず引退（関取）' };
        }
        
        // C. 上位での限界（連続負け越し）
        // 関取在位中でも、成績不振が続けば引退を選ぶ（35歳以上で4場所連続負け越し）
        if (status.age >= 35 && ['Makuuchi', 'Juryo'].includes(status.rank.division)) {
             const recs = status.history.records.slice(-4);
             if (recs.length === 4 && recs.every(r => r.wins < 8)) {
                 return { shouldRetire: true, reason: '体力の限界により引退（連続負け越し）' };
             }
        }
    }

    // 2. 能力低下による引退（弱すぎて勝てない）
    const totalStats = Object.values(status.stats).reduce((a, b) => a + b, 0);

    // 横綱の引退勧告（厳格化と休場考慮）
    if (status.rank.name === '横綱') {
        // 3場所連続負け越し（全休は除く）
        // 横綱は怪我による休場（全休）はカウントせず、実際に出場して負け越した場所が続くと引退
        // 横綱在位中の記録のみ抽出し、かつ全休（15休）を除外
        const effectiveRecords = status.history.records
            .filter(r => r.rank.name === '横綱')
            .filter(r => r.absent < 15);
        
        if (effectiveRecords.length >= 2) {
            const last2 = effectiveRecords.slice(-2);
            
            // 2連続で「出場して負け越し」
            if (last2.every(r => r.wins < 8)) {
                return { shouldRetire: true, reason: '横綱として出場場所2連続負け越し' };
            }
        }
        // 能力の大幅な衰え（プライドによる引退）
        if (totalStats < 250 && status.age > 30) {
             return { shouldRetire: true, reason: '体力の限界（横綱）' };
        }
    } else {
        // 大関以下の引退判定
        // 幕下以下で35歳以上かつ能力値がピークの半分以下...などの判定
        // 簡易的に「十両以上の経験値がありながら幕下に低迷」かつ「年齢30超え」
        if (status.age > 30 && status.rank.division !== 'Makuuchi' && status.rank.division !== 'Juryo') {
            // 元関取かどうかの判定が必要だが、ここでは「現在幕下以下」で一括
             if (totalStats < 200) {
                return { shouldRetire: true, reason: '体力の限界' };
             }
        }
    }

    // 3. 怪我による引退
    // リハビリが長引いて引退などはここで
    if (status.injuryLevel > 10) { // 緩和: 5->10 (横綱は休みがちなので少し許容、あるいはロジック変更)
         // 長期休場明けで復帰不能
         return { shouldRetire: true, reason: '怪我の回復が見込めず引退' };
    }

    return { shouldRetire: false };
};
