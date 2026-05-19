export interface WordEntry {
  id: number;
  english: string;
  chinese: string;
  phonetic: string;
  partOfSpeech: string;
  exampleEn: string;
  exampleZh: string;
  level: number;
  tags: string[];
  alternatives: string[];
}

export type WordStatus = 'new' | 'learning' | 'learned';

export interface WordProgress {
  wordId: number;
  status: WordStatus;
  consecutiveCorrect: number;
  nextReviewAt: number;
  lastReviewedAt: number;
  step1Correct: boolean;
  step2Correct: boolean;
  step3Correct: boolean;
  step4Correct: boolean;
}

export type LearnStep = 1 | 2 | 3 | 4;

export interface LearnState {
  word: WordEntry;
  currentStep: LearnStep;
  step1Result: boolean | null;
  step2Result: boolean | null;
  step3Result: boolean | null;
  step4Result: boolean | null;
}

export interface SceneInfo {
  tag: string;
  emoji: string;
  color: string;
  gradient: string;
}
