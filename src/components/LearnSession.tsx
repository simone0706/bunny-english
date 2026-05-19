import { useState, useCallback } from 'react';
import type { WordEntry, LearnStep, WordProgress } from '../types';
import { WORDBANK } from '../data/wordbank';
import { upsertProgress, getProgress } from '../db/srs';
import { processAnswer } from '../utils/srs-algorithm';
import StepChoice from './StepChoice';
import StepSpell from './StepSpell';
import StepListen from './StepListen';
import StepFlash from './StepFlash';

interface LearnSessionProps {
  words: WordEntry[];
  onComplete: () => void;
  onBack: () => void;
  isReview?: boolean;
}

export default function LearnSession({ words, onComplete, onBack, isReview }: LearnSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<LearnStep>(isReview ? 3 : 1);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [sessionDone, setSessionDone] = useState(false);

  const currentWord = words[currentIndex];

  const handleStepResult = useCallback(async (correct: boolean, stepNum: LearnStep) => {
    const newResults = [...stepResults, correct];
    setStepResults(newResults);

    if (!correct) {
      await upsertProgress(currentWord.id, {
        status: 'learning',
        consecutiveCorrect: 0,
        nextReviewAt: Date.now() + 60 * 60 * 1000,
        lastReviewedAt: Date.now(),
        [`step${stepNum}Correct` as keyof WordProgress]: false as never,
      });
      advanceStep(stepNum);
      return;
    }

    await upsertProgress(currentWord.id, {
      lastReviewedAt: Date.now(),
      [`step${stepNum}Correct` as keyof WordProgress]: true as never,
    });

    const maxStep = 4;
    if (stepNum >= maxStep) {
      const progress = await getProgress(currentWord.id);
      const currentConsecutive = progress?.consecutiveCorrect ?? 0;
      const srsResult = processAnswer(currentConsecutive, true);
      const allCorrect = newResults.every(r => r);

      await upsertProgress(currentWord.id, {
        status: allCorrect && srsResult.consecutiveCorrect >= 4 ? 'learned' : 'learning',
        consecutiveCorrect: allCorrect ? srsResult.consecutiveCorrect : currentConsecutive,
        nextReviewAt: srsResult.nextReviewAt,
        lastReviewedAt: Date.now(),
      });

      goToNextWord();
    } else {
      advanceStep(stepNum);
    }
  }, [currentIndex, currentWord, stepResults, words.length, isReview]);

  const advanceStep = (currentStep: LearnStep) => {
    if (currentStep >= 4) {
      goToNextWord();
    } else {
      const next = (currentStep + 1) as LearnStep;
      setStep(next);
    }
  };

  const goToNextWord = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
      setStep(isReview ? 3 : 1);
      setStepResults([]);
    } else {
      setSessionDone(true);
    }
  };

  const progressPct = words.length > 0
    ? ((currentIndex + (step - 1) / 4) / words.length) * 100
    : 0;

  if (sessionDone) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', maxWidth: 480,
        margin: '0 auto', minHeight: '100vh',
        background: '#0f172a', color: '#e2e8f0',
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          {isReview ? '复习完成！' : '学习完成！'}
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
          本次{isReview ? '复习' : '学习'} {words.length} 个词汇
        </div>
        <button onClick={onComplete} style={{
          padding: '16px 48px', borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
        }}>
          返回
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center',
        gap: 12, background: '#0f172a',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#94a3b8',
          fontSize: 20, cursor: 'pointer', padding: 0,
        }}>
          ✕
        </button>
        <div style={{
          flex: 1, height: 4, background: '#334155',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: '#38bdf8', borderRadius: 2,
            transition: 'width 0.3s', width: `${progressPct}%`,
          }} />
        </div>
        <span style={{ color: '#94a3b8', fontSize: 12, minWidth: 40, textAlign: 'right' }}>
          {currentIndex + 1}/{words.length}
        </span>
      </div>

      {step === 1 && <StepChoice word={currentWord} onResult={(c) => handleStepResult(c, 1)} />}
      {step === 2 && <StepSpell word={currentWord} onResult={(c) => handleStepResult(c, 2)} />}
      {step === 3 && <StepListen word={currentWord} onResult={(c) => handleStepResult(c, 3)} wordPool={WORDBANK} />}
      {step === 4 && <StepFlash word={currentWord} onResult={(c) => handleStepResult(c, 4)} />}
    </div>
  );
}
