import { useEffect, useState } from 'react';
import { SCENES, WORDBANK, getWordsByTag, getNewWords } from '../data/wordbank';
import { getAllProgress, checkInToday } from '../db/srs';
import SceneCard from '../components/SceneCard';
import LearnSession from '../components/LearnSession';
import type { WordEntry } from '../types';

export default function Learn() {
  const [learnedIds, setLearnedIds] = useState<Set<number>>(new Set());
  const [sessionWords, setSessionWords] = useState<WordEntry[] | null>(null);
  const [mode, setMode] = useState<'select' | 'session'>('select');

  useEffect(() => {
    (async () => {
      const progress = await getAllProgress();
      setLearnedIds(new Set(progress.filter(p => p.status === 'learned').map(p => p.wordId)));
      await checkInToday();
    })();
  }, []);

  const startSession = (tag?: string) => {
    const words = getNewWords(learnedIds, 10, tag);
    if (words.length === 0) {
      alert(tag ? `"${tag}" 场景的新词已全部学完！` : '所有新词已学完！');
      return;
    }
    setSessionWords(words);
    setMode('session');
  };

  const onSessionComplete = () => {
    setSessionWords(null);
    setMode('select');
    (async () => {
      const progress = await getAllProgress();
      setLearnedIds(new Set(progress.filter(p => p.status === 'learned').map(p => p.wordId)));
    })();
  };

  if (mode === 'session' && sessionWords) {
    return (
      <LearnSession
        words={sessionWords}
        onComplete={onSessionComplete}
        onBack={() => { setSessionWords(null); setMode('select'); }}
      />
    );
  }

  const sceneStats = SCENES.map(scene => {
    const words = getWordsByTag(scene.tag);
    const learned = words.filter(w => learnedIds.has(w.id)).length;
    return { scene, total: words.length, learned };
  }).filter(s => s.total > 0);

  return (
    <div style={{ padding: '24px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#111' }}>
        📖 学习新词
      </h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
        选择一个场景开始学习
      </p>

      <button onClick={() => startSession()} style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        border: 'none', borderRadius: 20, padding: '20px',
        color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
        width: '100%', textAlign: 'left', marginBottom: 16,
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎲</div>
        <div>混合学习</div>
        <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
          跨场景随机抽取 10 个新词
        </div>
      </button>

      <div style={{ display: 'grid', gap: 10 }}>
        {sceneStats.map(({ scene, total, learned }) => (
          <SceneCard
            key={scene.tag}
            scene={scene}
            total={total}
            learned={learned}
            onClick={() => startSession(scene.tag)}
          />
        ))}
      </div>

      {WORDBANK.filter(w => !learnedIds.has(w.id)).length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>所有词汇都已学完！</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>去复习巩固吧</div>
        </div>
      )}
    </div>
  );
}
