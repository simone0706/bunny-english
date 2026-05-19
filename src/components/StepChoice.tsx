import { useEffect, useState, useCallback } from 'react';
import type { WordEntry } from '../types';
import { speakWord, speakExample } from '../utils/tts';
import { getDistractors } from '../data/wordbank';

interface StepChoiceProps {
  word: WordEntry;
  onResult: (correct: boolean) => void;
}

export default function StepChoice({ word, onResult }: StepChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const shuffledOptions = useCallback(() => {
    const distractors = getDistractors(word, 3);
    const all = [word.chinese, ...distractors];
    return all.sort(() => Math.random() - 0.5);
  }, [word])();

  useEffect(() => {
    speakWord(word.english);
  }, [word]);

  const handleSelect = (option: string) => {
    if (result) return;
    setSelected(option);
    const correct = option === word.chinese;
    setResult(correct ? 'correct' : 'wrong');
    if (!correct) setShowAnswer(true);
    setTimeout(() => onResult(correct), correct ? 600 : 1500);
  };

  const getOptionStyle = (opt: string) => {
    const base: React.CSSProperties = {
      padding: '16px 18px',
      borderRadius: 14,
      border: '2px solid #e5e7eb',
      background: '#fff',
      fontSize: 16,
      cursor: result ? 'default' : 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
      color: '#1f2937',
    };
    if (result === 'correct' && opt === word.chinese) {
      return { ...base, borderColor: '#10b981', background: '#d1fae5' };
    }
    if (result === 'wrong') {
      if (opt === word.chinese) return { ...base, borderColor: '#10b981', background: '#d1fae5' };
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
        Step 1 · 选择释义
      </div>

      <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, textAlign: 'center', letterSpacing: 1 }}>
        {word.english}
      </div>

      <div style={{ fontSize: 14, color: '#38bdf8', marginBottom: 16 }}>
        {word.phonetic}
      </div>

      <button
        onClick={() => speakWord(word.english)}
        style={{
          background: 'rgba(99,102,241,0.2)', border: 'none', borderRadius: 50,
          width: 56, height: 56, fontSize: 24, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32, color: '#818cf8',
        }}
      >
        🔊
      </button>

      <div style={{
        background: 'rgba(30,41,59,0.6)', borderRadius: 12, padding: '12px 16px',
        marginBottom: 28, textAlign: 'center', color: '#94a3b8', fontSize: 14,
        cursor: 'pointer',
      }} onClick={() => speakExample(word.exampleEn)}>
        <div style={{ fontStyle: 'italic', marginBottom: 4 }}>"{word.exampleEn}"</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{word.exampleZh}</div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>点击听例句 🔊</div>
      </div>

      <div style={{ display: 'grid', gap: 8, width: '100%' }}>
        {shuffledOptions.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt)} style={getOptionStyle(opt)}>
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div style={{ marginTop: 12, color: '#fbbf24', fontSize: 14, fontWeight: 600 }}>
          正确答案：{word.chinese}
        </div>
      )}
    </div>
  );
}
