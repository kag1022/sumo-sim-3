import { useState } from 'react';
import { ScoutScreen } from './components/input/ScoutScreen';
import { ReportScreen } from './components/result/ReportScreen';
import { RikishiStatus, Oyakata } from './logic/models';
import { runSimulation } from './logic/runner';
import { Trophy } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<RikishiStatus | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStart = (initialStats: RikishiStatus, oyakata: Oyakata | null) => {
    setIsSimulating(true);
    // UI描画をブロックしないように少し遅らせる（演出用）
    setTimeout(() => {
        const result = runSimulation({ initialStats, oyakata });
        setStatus(result);
        setIsSimulating(false);
    }, 100);
  };

  const handleReset = () => {
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <span className="text-2xl">🏋️</span>
            爆速！横綱メーカー
          </h1>
          <button 
            onClick={() => {
                import('./logic/storage').then(({ loadAllRikishi }) => {
                    const data = loadAllRikishi();
                    console.log(data);
                    if(data.length === 0) alert('保存されたデータはありません');
                    else {
                        const msg = data.map(d => `${d.status.shikona} (${d.status.history.maxRank.name})`).join('\n');
                        alert('保存済み力士:\n' + msg);
                    }
                });
            }}
            className="text-sm bg-slate-800 px-3 py-1 rounded hover:bg-slate-700 transition"
          >
            殿堂入りを見る
          </button>
        </div>
      </header>

      <main className="p-4 pt-8">
        {!status ? (
            !isSimulating ? (
                <ScoutScreen onStart={handleStart} />
            ) : (
                <div className="flex flex-col items-center justify-center py-40 space-y-4 animate-pulse">
                    <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
                    <p className="text-2xl font-bold">力士人生を演算中...</p>
                    <p className="text-slate-500">15歳から引退までを一気にシミュレーションしています</p>
                </div>
            )
        ) : (
            <ReportScreen status={status} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
