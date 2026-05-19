import { useEffect, useState } from 'react';
import { getLearnedCount, getStreak, resetAllProgress, getDueCount } from '../db/srs';
import { WORDBANK } from '../data/wordbank';
import { setTtsRate, getTtsRate } from '../utils/tts';

export default function Profile() {
  const [learned, setLearned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [due, setDue] = useState(0);
  const [rate, setRate] = useState(() => {
    const saved = localStorage.getItem('memrise-tts-rate');
    return saved ? Number(saved) : getTtsRate();
  });
  const [dailyNew, setDailyNew] = useState(() =>
    Number(localStorage.getItem('memrise-daily-new') || '10')
  );

  useEffect(() => {
    (async () => {
      setLearned(await getLearnedCount());
      setStreak(await getStreak());
      setDue(await getDueCount());
    })();
  }, []);

  const handleReset = async () => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
      await resetAllProgress();
      localStorage.removeItem('memrise-streak');
      setLearned(0);
      setStreak(0);
      setDue(0);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setTtsRate(newRate);
    localStorage.setItem('memrise-tts-rate', String(newRate));
  };

  const handleDailyChange = (n: number) => {
    setDailyNew(n);
    localStorage.setItem('memrise-daily-new', String(n));
  };

  const total = WORDBANK.length;
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div style={{ padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#111' }}>
        👤 我的
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: '已掌握', value: `${learned}`, sub: `共 ${total}` },
          { label: '连续打卡', value: `🔥 ${streak}`, sub: '天' },
          { label: '掌握率', value: `${pct}%`, sub: '' },
          { label: '待复习', value: `${due}`, sub: '个' },
        ].map(item => (
          <div key={item.label} style={{
            background: '#f3f4f6', borderRadius: 16, padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{item.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{item.label}</div>
            {item.sub && <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ background: '#f3f4f6', borderRadius: 20, padding: '20px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#111' }}>
          ⚙️ 设置
        </h3>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            每日新词数量：{dailyNew}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[10, 15, 20].map(n => (
              <button key={n} onClick={() => handleDailyChange(n)} style={{
                flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                background: dailyNew === n ? '#6366f1' : '#e5e7eb',
                color: dailyNew === n ? '#fff' : '#374151',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
            发音语速：{rate.toFixed(1)}x
          </div>
          <input
            type="range" min="0.5" max="1.5" step="0.05"
            value={rate}
            onChange={(e) => handleRateChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
            <span>慢</span><span>正常</span><span>快</span>
          </div>
        </div>

        <button onClick={handleReset} style={{
          width: '100%', padding: '14px', borderRadius: 14,
          border: '2px solid #fca5a5', background: '#fff',
          color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          重置所有学习进度
        </button>
      </div>
    </div>
  );
}
