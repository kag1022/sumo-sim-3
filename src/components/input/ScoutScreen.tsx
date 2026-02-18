import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { RikishiStatus, Oyakata, GrowthType, TacticsType } from '../../logic/models';
import { generateShikona } from '../../logic/title_generator';
import { RefreshCw, UserPlus } from 'lucide-react';

interface ScoutScreenProps {
  onStart: (initialStats: RikishiStatus, oyakata: Oyakata | null) => void;
}

const TOTAL_POINTS = 400; // 8項目 * 50平均
const STAT_LABELS: Record<string, string> = {
  tsuki: '突き',
  oshi: '押し',
  kumi: '組力',
  nage: '投げ',
  koshi: '腰',
  deashi: '出足',
  waza: '技術',
  power: '筋力'
};

export const ScoutScreen: React.FC<ScoutScreenProps> = ({ onStart }) => {
  const [shikona, setShikona] = useState(generateShikona());
  const [growthType, setGrowthType] = useState<GrowthType>('NORMAL');
  const [tactics, setTactics] = useState<TacticsType>('BALANCE');
  const [stats, setStats] = useState({
    tsuki: 50, oshi: 50, kumi: 50, nage: 50,
    koshi: 50, deashi: 50, waza: 50, power: 50
  });

  const currentTotal = Object.values(stats).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - currentTotal;

  const handleStatChange = (key: keyof typeof stats, val: number) => {
    // 増加の場合、残りポイントが必要
    const diff = val - stats[key];
    if (diff > 0 && remaining < diff) return;
    
    setStats(prev => ({ ...prev, [key]: val }));
  };

  const handleStart = () => {
    // RikishiStatus 初期化
    const initialStatus: RikishiStatus = {
        heyaId: 'my-heya',
        shikona,
        age: 15,
        rank: { division: 'Maezumo', name: '前相撲', side: 'East', number: 1 },
        stats,
        potential: 50, // 仮
        growthType,
        tactics,
        durability: 80,
        currentCondition: 50,
        injuryLevel: 0,
        history: {
            records: [],
            events: [],
            maxRank: { division: 'Maezumo', name: '前相撲' },
            totalWins: 0, totalLosses: 0, totalAbsent: 0,
            yushoCount: { makuuchi: 0, juryo: 0, makushita: 0, others: 0 }
        },
        statHistory: []
    };

    // 親方未実装
    onStart(initialStatus, null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            新弟子検査・能力測定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 四股名 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">四股名</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={shikona} 
                onChange={e => setShikona(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button variant="outline" onClick={() => setShikona(generateShikona())}>
                <RefreshCw className="w-4 h-4 mr-2" />
                おまかせ
              </Button>
            </div>
          </div>

          {/* 成長タイプ */}
          <div className="space-y-2">
            <label className="text-sm font-medium">成長タイプ</label>
            <div className="flex gap-2">
              {(['EARLY', 'NORMAL', 'LATE', 'GENIUS'] as GrowthType[]).map(type => (
                <Button 
                  key={type}
                  variant={growthType === type ? 'primary' : 'outline'}
                  onClick={() => setGrowthType(type)}
                  className="flex-1"
                >
                  {type === 'EARLY' ? '早熟' : type === 'NORMAL' ? '普通' : type === 'LATE' ? '晩成' : '天才'}
                </Button>
              ))}
            </div>
          </div>

          {/* 戦術タイプ */}
          <div className="space-y-2">
            <label className="text-sm font-medium">戦術タイプ</label>
            <div className="flex gap-2">
              {(['PUSH', 'GRAPPLE', 'TECHNIQUE', 'BALANCE'] as TacticsType[]).map(type => (
                <Button 
                  key={type}
                  variant={tactics === type ? 'primary' : 'outline'}
                  onClick={() => setTactics(type)}
                  className="flex-1"
                >
                  {type === 'PUSH' ? '突き押し' : type === 'GRAPPLE' ? '四つ' : type === 'TECHNIQUE' ? '技巧派' : 'バランス'}
                </Button>
              ))}
            </div>
          </div>

          {/* ステータス配分 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">能力配分</label>
              <span className={`text-sm font-bold ${remaining < 0 ? 'text-red-500' : 'text-slate-600'}`}>
                残りポイント: {remaining}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{STAT_LABELS[key]}</span>
                    <span>{val}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={val}
                    onChange={e => handleStatChange(key as keyof typeof stats, Number(e.target.value))}
                    className="w-full accent-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full" size="lg" onClick={handleStart} disabled={remaining < 0}>
               入門させる（シミュレーション開始）
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
