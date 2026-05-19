import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearnedCount, getDueCount, getStreak, checkInToday } from '../db/srs';
import { WORDBANK } from '../data/wordbank';

export default function Home() {
  const navigate = useNavigate();
  const [learned, setLearned] = useState(0);
  const [due, setDue] = useState(0);
  const [streak, setStreak] = useState(0);
  const total = WORDBANK.length;

  useEffect(() => {
    (async () => {
      setLearned(await getLearnedCount());
      setDue(await getDueCount());
      setStreak(await getStreak());
    })();
  }, []);

  const handleStartLearn = async () => {
    await checkInToday();
    setStreak(await getStreak());
    navigate('/learn');
  };

  const handleStartReview = async () => {
    await checkInToday();
    navigate('/review');
  };

  const pct = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div style={{ padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#111' }}>Bunny English</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>每天进步一点点</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', borderRadius: 16, padding: '12px 18px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>🔥 {streak}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>连续打卡</div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 24, padding: '28px 24px', marginBottom: 20, color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `conic-gradient(rgba(255,255,255,0.9) ${pct}%, rgba(255,255,255,0.2) ${pct}%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800,
            }}>
              {pct}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, opacity: 0.9 }}>已掌握 {learned} / {total}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>待复习 {due} 个单词</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <button onClick={handleStartLearn} style={{
          background: 'linear-gradient(135deg, #10b981, #34d399)',
          border: 'none', borderRadius: 18, padding: '20px 24px',
          color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
        }}>
          <span>📖 学习新词</span>
          <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>开始 →</span>
        </button>
        {due > 0 && (
          <button onClick={handleStartReview} style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            border: 'none', borderRadius: 18, padding: '20px 24px',
            color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
          }}>
            <span>🔄 复习 ({due} 个待复习)</span>
            <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.9 }}>开始 →</span>
          </button>
        )}
      </div>
    </div>
  );
}
