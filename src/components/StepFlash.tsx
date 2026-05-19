import { useState, useEffect } from 'react';
import type { WordEntry } from '../types';
import { speakWord } from '../utils/tts';

interface StepFlashProps {
  word: WordEntry;
  onResult: (correct: boolean) => void;
}

export default function StepFlash({ word, onResult }: StepFlashProps) {
  const [phase, setPhase] = useState<'english' | 'chinese' | 'choice'>('english');

  useEffect(() => {
    setPhase('english');
  }, [word.id]);

  const handleTap = () => {
    if (phase === 'english') {
      setPhase('chinese');
    } else if (phase === 'chinese') {
      setPhase('choice');
    }
  };

  const handleChoice = (correct: boolean) => {
    if (correct) speakWord(word.english);
    onResult(correct);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      background: '#0f172a', color: '#e2e8f0',
    }}>
      <div style={{ marginBottom: 32, color: '#94a3b8', fontSize: 13 }}>
        Step 4 · 快速闪卡
      </div>

      {phase !== 'choice' && (
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
          👆 点击卡片翻转
        </div>
      )}

      <div
        onClick={phase !== 'choice' ? handleTap : undefined}
        style={{
          fontSize: phase === 'english' ? 32 : 24,
          fontWeight: 800,
          textAlign: 'center',
          color: phase === 'english' ? '#e2e8f0' : '#fbbf24',
          cursor: phase !== 'choice' ? 'pointer' : 'default',
          minHeight: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 48,
          padding: '20px 24px',
          background: 'rgba(30,41,59,0.5)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 340,
          transition: 'all 0.2s',
          userSelect: 'none',
        }}
      >
        {phase === 'english' && (
          <>
            <div style={{ fontSize: 32, color: '#e2e8f0' }}>{word.english}</div>
            <div style={{ fontSize: 14, color: '#38bdf8', marginTop: 8 }}>{word.phonetic}</div>
          </>
        )}
        {phase === 'chinese' && (
          <>
            <div style={{ fontSize: 28, color: '#e2e8f0' }}>{word.english}</div>
            <div style={{ fontSize: 20, color: '#fbbf24', marginTop: 8 }}>{word.chinese}</div>
          </>
        )}
        {phase === 'choice' && (
          <>
            <div style={{ fontSize: 28, color: '#e2e8f0' }}>{word.english}</div>
            <div style={{ fontSize: 20, color: '#fbbf24', marginTop: 8 }}>{word.chinese}</div>
          </>
        )}
      </div>

      {phase === 'choice' && (
        <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 320 }}>
          <button onClick={() => handleChoice(false)} style={{
            flex: 1, padding: '16px', borderRadius: 14, border: 'none',
            background: '#dc2626', color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
          }}>
            忘了 ✗
          </button>
          <button onClick={() => handleChoice(true)} style={{
            flex: 1, padding: '16px', borderRadius: 14, border: 'none',
            background: '#059669', color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: 'pointer',
          }}>
            认识 ✓
          </button>
        </div>
      )}
    </div>
  );
}
