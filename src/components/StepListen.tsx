import { useEffect, useState } from 'react';
import type { WordEntry } from '../types';
import { speakWord } from '../utils/tts';

interface StepListenProps {
  word: WordEntry;
  onResult: (correct: boolean) => void;
  wordPool: WordEntry[];
}

export default function StepListen({ word, onResult, wordPool }: StepListenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const options = (() => {
    const others = wordPool
      .filter(w => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    return [word.english, ...others].sort(() => Math.random() - 0.5);
  })();

  useEffect(() => {
    speakWord(word.english);
  }, [word]);

  const handleSelect = (option: string) => {
    if (result) return;
    setSelected(option);
    const correct = option === word.english;
    setResult(correct ? 'correct' : 'wrong');
    if (!correct) setShowAnswer(true);
    setTimeout(() => onResult(correct), correct ? 600 : 1500);
  };

  const getOptionStyle = (opt: string) => {
    const base: React.CSSProperties = {
      padding: '16px 18px', borderRadius: 14,
      border: '2px solid #e5e7eb', background: '#fff',
      fontSize: 16, cursor: result ? 'default' : 'pointer',
      transition: 'all 0.2s', textAlign: 'left', color: '#1f2937',
    };
    if (result === 'correct' && opt === word.english) {
      return { ...base, borderColor: '#10b981', background: '#d1fae5' };
    }
    if (result === 'wrong') {
      if (opt === word.english) return { ...base, borderColor: '#10b981', background: '#d1fae5' };
      if (opt === selected) return { ...base, borderColor: '#ef4444', background: '#fee2e2' };
    }
    return base;
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 24px', maxWidth: 480, margin: '0 auto',
      minHeight: '100vh', background: '#0f172a', color: '#e2e8f0',
    }}>
      <div style={{ marginBottom: 32, color: '#94a3b8', fontSize: 13 }}>
        Step 3 · 听音辨义
      </div>

      <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, textAlign: 'center' }}>
        听发音，选择正确的英文
      </div>

      <button onClick={() => speakWord(word.english)} style={{
        background: 'rgba(99,102,241,0.15)',
        border: '3px solid rgba(99,102,241,0.4)',
        borderRadius: 50, width: 80, height: 80, fontSize: 36,
        cursor: 'pointer', marginBottom: 36, color: '#818cf8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        🔊
      </button>

      <div style={{ display: 'grid', gap: 8, width: '100%' }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt)} style={getOptionStyle(opt)}>
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div style={{ marginTop: 12, color: '#fbbf24', fontSize: 14, fontWeight: 600 }}>
          正确答案：{word.english} ({word.chinese})
        </div>
      )}
    </div>
  );
}
