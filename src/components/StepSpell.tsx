import { useState, useEffect } from 'react';
import type { WordEntry } from '../types';
import { speakWord } from '../utils/tts';

interface StepSpellProps {
  word: WordEntry;
  onResult: (correct: boolean) => void;
}

function getBlank(english: string): { prefix: string; answer: string; suffix: string } {
  const parts = english.split(' ');
  if (parts.length > 1) {
    const idx = parts.length - 1;
    return { prefix: parts.slice(0, idx).join(' ') + ' ', answer: parts[idx], suffix: '' };
  }
  const len = english.length;
  if (len <= 3) return { prefix: '', answer: english, suffix: '' };
  const start = Math.floor(len * 0.3);
  const end = Math.floor(len * 0.7);
  return { prefix: english.slice(0, start), answer: english.slice(start, end), suffix: english.slice(end) };
}

export default function StepSpell({ word, onResult }: StepSpellProps) {
  const blank = getBlank(word.english);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setInput('');
    setAttempts(0);
    setResult(null);
    setShowAnswer(false);
  }, [word.id]);

  const handleSubmit = () => {
    const correct = input.trim().toLowerCase() === blank.answer.toLowerCase();
    if (correct) {
      setResult('correct');
      setTimeout(() => onResult(true), 600);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 2) {
        setShowAnswer(true);
        setResult('wrong');
        setTimeout(() => onResult(false), 1500);
      }
    }
    setInput('');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 24px', maxWidth: 480, margin: '0 auto',
      minHeight: '100vh', background: '#0f172a', color: '#e2e8f0',
    }}>
      <div style={{ marginBottom: 32, color: '#94a3b8', fontSize: 13 }}>
        Step 2 · 拼写填空
      </div>

      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, textAlign: 'center', color: '#fbbf24' }}>
        {word.chinese}
      </div>

      <button onClick={() => speakWord(word.english)} style={{
        background: 'rgba(99,102,241,0.2)', border: 'none', borderRadius: 50,
        width: 48, height: 48, fontSize: 20, cursor: 'pointer', marginBottom: 32,
        color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        🔊
      </button>

      <div style={{
        fontSize: 32, fontWeight: 800, marginBottom: 32,
        fontFamily: 'monospace', letterSpacing: 2,
        display: 'flex', alignItems: 'center', gap: 0,
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <span>{blank.prefix}</span>
        <span style={{
          borderBottom: '3px solid #38bdf8',
          minWidth: blank.answer.length * 22,
          display: 'inline-block',
          textAlign: 'center',
          color: '#38bdf8',
          padding: '0 4px',
        }}>
          {result === 'correct' ? blank.answer : input || '___'}
        </span>
        <span>{blank.suffix}</span>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        autoFocus
        placeholder="输入缺失的字母/单词..."
        style={{
          width: '100%', maxWidth: 320, padding: '14px 18px',
          borderRadius: 12, border: result === 'wrong' ? '2px solid #ef4444' : '2px solid #334155',
          background: '#1e293b', color: '#e2e8f0', fontSize: 18,
          textAlign: 'center', outline: 'none',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        style={{
          marginTop: 16, padding: '12px 40px', borderRadius: 14, border: 'none',
          background: input.trim() ? '#6366f1' : '#334155', color: '#fff',
          fontSize: 16, fontWeight: 600, cursor: input.trim() ? 'pointer' : 'default',
        }}
      >
        确认
      </button>

      {attempts > 0 && !showAnswer && (
        <div style={{ marginTop: 12, color: '#ef4444', fontSize: 14 }}>
          不对，再试一次 ({2 - attempts} 次机会)
        </div>
      )}
      {showAnswer && (
        <div style={{ marginTop: 12, color: '#fbbf24', fontSize: 14, fontWeight: 600 }}>
          正确答案：{blank.answer}
        </div>
      )}
    </div>
  );
}
