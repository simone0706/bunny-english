import { useEffect, useState } from 'react';
import { getDueWords, getDueCount, checkInToday } from '../db/srs';
import { getReviewWords } from '../data/wordbank';
import LearnSession from '../components/LearnSession';
import type { WordEntry } from '../types';

export default function Review() {
  const [dueCount, setDueCount] = useState(0);
  const [sessionWords, setSessionWords] = useState<WordEntry[] | null>(null);
  const [mode, setMode] = useState<'idle' | 'session'>('idle');

  useEffect(() => {
    (async () => {
      setDueCount(await getDueCount());
      await checkInToday();
    })();
  }, []);

  const startReview = async () => {
    const due = await getDueWords();
    if (due.length === 0) return;
    const wordIds = due.map(p => p.wordId);
    const words = getReviewWords(wordIds);
    setSessionWords(words);
    setMode('session');
  };

  const onSessionComplete = () => {
    setSessionWords(null);
    setMode('idle');
    (async () => { setDueCount(await getDueCount()); })();
  };

  if (mode === 'session' && sessionWords) {
    return (
      <LearnSession
        words={sessionWords}
        onComplete={onSessionComplete}
        onBack={() => { setSessionWords(null); setMode('idle'); }}
        isReview
      />
    );
  }

  return (
    <div style={{ padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#111' }}>
        🔄 复习
      </h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>
        SRS 间隔重复，把记忆焊进脑子里
      </p>

      {dueCount === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#374151' }}>
            都复习完了！
          </div>
          <div style={{ fontSize: 13, marginTop: 8 }}>
            暂时没有需要复习的词汇，等等再来吧~
          </div>
        </div>
      ) : (
        <button onClick={startReview} style={{
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          border: 'none', borderRadius: 20, padding: '24px',
          color: '#fff', fontSize: 18, fontWeight: 700,
          cursor: 'pointer', width: '100%', textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔄</div>
          <div>{dueCount} 个词汇等待复习</div>
          <div style={{ fontSize: 14, fontWeight: 400, opacity: 0.9, marginTop: 4 }}>
            点击开始 →
          </div>
        </button>
      )}
    </div>
  );
}
