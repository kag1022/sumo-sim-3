import React from 'react';
import { RikishiStatus, Rank } from '../../logic/models'; // Rank added
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { ArrowLeft, Trophy, Activity, TrendingUp } from 'lucide-react'; // TrendingUp fixed
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ReportScreenProps {
  status: RikishiStatus;
  onReset: () => void;
}

// ヘルパー: グラフ用ランク値計算
// ヘルパー: グラフ用ランク値計算（表示用スケール）
const getRankValueForChart = (rank: Rank): number => {
    if (rank.division === 'Makuuchi') {
        if (rank.name === '横綱') return 0;
        if (rank.name === '大関') return 10;
        if (rank.name === '関脇') return 20;
        if (rank.name === '小結') return 30;
        return 40 + (rank.number || 1); // M1=41, M17=57
    }
    if (rank.division === 'Juryo') return 60 + (rank.number || 1); // J1=61, J14=74
    if (rank.division === 'Makushita') return 80 + (rank.number || 1); // Ms1=81, Ms60=141
    if (rank.division === 'Sandanme') return 150 + (rank.number || 1); // Sd1=151
    if (rank.division === 'Jonidan') return 260 + (rank.number || 1); // Jd1=261
    if (rank.division === 'Jonokuchi') return 470 + (rank.number || 1); // Jk1=471
    return 600; // Maezumo
};

// ヘルパー: イベント色
const getEventColor = (type: string) => {
    switch(type) {
        case 'ENTRY': return 'bg-blue-500';
        case 'PROMOTION': return 'bg-green-500';
        case 'DEMOTION': return 'bg-red-400'; // was red-400
        case 'YUSHO': return 'bg-yellow-500';
        case 'INJURY': return 'bg-red-600';
        case 'RETIREMENT': return 'bg-slate-900';
        default: return 'bg-slate-300';
    }
};

// ヘルパー: ランク名フォーマット（筆頭対応）
const formatRankName = (rank: Rank) => {
    const isSpecial = ['横綱', '大関', '関脇', '小結', '前相撲'].includes(rank.name);
    if (isSpecial) return rank.name;
    if (rank.number === 1) return `${rank.name}筆頭`;
    return `${rank.name}${rank.number || ''}枚目`;
};

export const ReportScreen: React.FC<ReportScreenProps> = ({ status, onReset }) => {
  const { shikona, history } = status;
  const { title, maxRank, totalWins, totalLosses, totalAbsent, yushoCount } = history;
  
  // 幕内成績計算
  const makuuchiStats = React.useMemo(() => {
    const records = history.records.filter(r => r.rank.division === 'Makuuchi');
    const wins = records.reduce((a, c) => a + c.wins, 0);
    const losses = records.reduce((a, c) => a + c.losses, 0);
    const absent = records.reduce((a, c) => a + c.absent, 0);
    return { wins, losses, absent, bashoCount: records.length };
  }, [history.records]);
  const totalBashoCount = history.records.length;

  // 階級別成績データ作成
  const divisionStats = React.useMemo(() => {
    const divs = ['Makuuchi', 'Juryo', 'Makushita', 'Sandanme', 'Jonidan', 'Jonokuchi', 'Maezumo'] as const;
    return divs.map(div => {
      const records = history.records.filter(r => r.rank.division === div);
      const wins = records.reduce((a, c) => a + c.wins, 0);
      const losses = records.reduce((a, c) => a + c.losses, 0);
      const absent = records.reduce((a, c) => a + c.absent, 0);
      const yusho = records.filter(r => r.yusho).length;
      return { name: div, basho: records.length, wins, losses, absent, yusho };
    }).filter(d => d.basho > 0);
  }, [history.records]);

  // 能力推移データ作成 (年齢ごと)
  const abilityHistoryData = React.useMemo(() => {
    if (!status.statHistory || status.statHistory.length === 0) return [];
    return status.statHistory.map(item => ({
        age: item.age,
        tsuki: Math.round(item.stats.tsuki),
        oshi: Math.round(item.stats.oshi),
        kumi: Math.round(item.stats.kumi),
        nage: Math.round(item.stats.nage),
        koshi: Math.round(item.stats.koshi),
        deashi: Math.round(item.stats.deashi),
        waza: Math.round(item.stats.waza),
        power: Math.round(item.stats.power),
    }));
  }, [status.statHistory]);

  // 番付推移データ
  const lineData = history.records.map(r => {
        const label = formatRankName(r.rank);
            
        const age = Math.floor((r.year - history.records[0].year) + 15);
        return {
          time: `${r.year}年${r.month}月`,
          age: age,
          rankVal: -1 * getRankValueForChart(r.rank), 
          rankLabel: label
        };
    });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ヒーローセクション */}
      <div className="bg-slate-900 text-white p-8 rounded-xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-900 to-slate-900"></div>
        <div className="relative z-10">
          <p className="text-yellow-400 font-bold tracking-widest text-lg mb-2">{title || '無名の力士'}</p>
          <h1 className="text-5xl font-black mb-4 tracking-tight">{shikona}</h1>
          <div className="flex justify-center gap-6 text-slate-300">
            <div>
              <span className="block text-xs uppercase tracking-wider">最高位</span>
              <span className="text-2xl font-bold text-white">
                {formatRankName(maxRank)}
              </span>
            </div>
            <div className="text-left">
              <div className="mb-2">
                <span className="block text-xs uppercase tracking-wider text-slate-400">生涯戦歴</span>
                <span className="text-xl font-bold text-white block">
                  {totalWins}勝{totalLosses}敗{totalAbsent}休 <span className="text-sm font-normal text-slate-400">({totalBashoCount}場所)</span>
                </span>
              </div>
              {makuuchiStats.bashoCount > 0 && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400">幕内戦歴</span>
                  <span className="text-xl font-bold text-white block">
                    {makuuchiStats.wins}勝{makuuchiStats.losses}敗{makuuchiStats.absent}休 <span className="text-sm font-normal text-slate-400">({makuuchiStats.bashoCount}場所)</span>
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider">幕内優勝</span>
              <span className="text-2xl font-bold text-white">{yushoCount.makuuchi}回</span>
            </div>
          </div>
        </div>
      </div>

      {/* グラフエリア */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2"/>
                 能力履歴 (年齢別)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={abilityHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" label={{ value: '年齢', position: 'insideBottomRight', offset: -5 }} />
                <YAxis domain={[0, 150]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tsuki" name="突き" stroke="#ef4444" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="oshi" name="押し" stroke="#f97316" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="kumi" name="組力" stroke="#3b82f6" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="nage" name="投げ" stroke="#22c55e" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="koshi" name="腰" stroke="#a855f7" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="deashi" name="出足" stroke="#06b6d4" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="waza" name="技術" stroke="#ec4899" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="power" name="筋力" stroke="#854d0e" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2"/>番付推移</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide={false} interval={5} tick={{fontSize: 10}} label={{ value: '場所', position: 'insideBottomRight', offset: -5 }} />
                <YAxis 
                    hide={false} 
                    domain={[-500, 10]} 
                    tickFormatter={(val) => {
                        const v = Math.abs(val);
                        if (v === 0) return '横綱';
                        if (v === 10) return '大関';
                        if (v === 40) return '幕内';
                        if (v === 60) return '十両';
                        if (v === 80) return '幕下';
                        if (v === 150) return '三段目';
                        return '';
                    }}
                    ticks={[0, -10, -40, -60, -80, -150]}
                    width={50}
                    tick={{fontSize: 10}}
                />
                <Tooltip 
                    labelFormatter={(label) => `${label}`}
                    formatter={(_val: any, _name: any, props: any) => [props.payload.rankLabel, '番付']}
                />
                <Line type="monotone" dataKey="rankVal" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>階級別成績詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100 uppercase text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">階級</th>
                  <th className="px-4 py-2 font-medium text-right">場所数</th>
                  <th className="px-4 py-2 font-medium text-right">勝</th>
                  <th className="px-4 py-2 font-medium text-right">敗</th>
                  <th className="px-4 py-2 font-medium text-right">休</th>
                  <th className="px-4 py-2 font-medium text-center">優勝</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {divisionStats.map(d => (
                  <tr key={d.name} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-700">
                      {{
                        'Makuuchi':'幕内', 'Juryo':'十両', 'Makushita':'幕下', 
                        'Sandanme':'三段目', 'Jonidan':'序二段', 'Jonokuchi':'序ノ口', 'Maezumo':'前相撲'
                      }[d.name] || d.name}
                    </td>
                    <td className="px-4 py-2 text-right">{d.basho}</td>
                    <td className="px-4 py-2 text-right text-red-600 font-medium">{d.wins}</td>
                    <td className="px-4 py-2 text-right">{d.losses}</td>
                    <td className="px-4 py-2 text-right text-slate-400">{d.absent}</td>
                    <td className="px-4 py-2 text-center text-yellow-600 font-bold">{d.yusho > 0 ? d.yusho + '回' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* タイムライン */}
      <Card>
        <CardHeader>
          <CardTitle>相撲人生記</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {history.events.map((ev, idx) => (
              <div key={idx} className="flex gap-4 items-start border-l-2 border-slate-200 pl-4 py-1 relative">
                <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-white ${getEventColor(ev.type)}`}></div>
                <div className="w-20 font-mono text-sm text-slate-500 pt-0.5">{ev.year}年{ev.month}月</div>
                <div className="flex-1">
                    <p className="text-sm">{ev.description}</p>
                    {ev.type === 'YUSHO' && <Trophy className="w-4 h-4 text-yellow-500 inline mt-1" />}
                </div>
              </div>
            ))}
            {history.events.length === 0 && <p className="text-slate-500">記録なし</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 pt-8">
        <Button size="lg" onClick={onReset} variant="secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          もう一度遊ぶ
        </Button>
        <Button size="lg" onClick={() => {
            import('../../logic/storage').then(({ saveRikishi }) => {
                saveRikishi(status);
                alert('保存しました！');
            });
        }}>
            <Trophy className="w-4 h-4 mr-2" />
            殿堂入り保存
        </Button>
      </div>
    </div>
  );
};
