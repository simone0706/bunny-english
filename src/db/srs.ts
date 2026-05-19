import Dexie, { type Table } from 'dexie';
import type { WordProgress } from '../types';

class SrsDatabase extends Dexie {
  progress!: Table<WordProgress, number>;

  constructor() {
    super('MemriseCloneDB');
    this.version(1).stores({
      progress: 'wordId, status, nextReviewAt',
    });
  }
}

export const db = new SrsDatabase();

export async function getProgress(wordId: number): Promise<WordProgress | undefined> {
  return db.progress.get(wordId);
}

export async function getAllProgress(): Promise<WordProgress[]> {
  return db.progress.toArray();
}

export async function upsertProgress(
  wordId: number,
  updates: Partial<WordProgress>
): Promise<void> {
  const existing = await db.progress.get(wordId);
  if (existing) {
    await db.progress.update(wordId, updates);
  } else {
    await db.progress.put({
      wordId,
      status: 'new',
      consecutiveCorrect: 0,
      nextReviewAt: 0,
      lastReviewedAt: 0,
      step1Correct: false,
      step2Correct: false,
      step3Correct: false,
      step4Correct: false,
      ...updates,
    });
  }
}

export async function getDueWords(): Promise<WordProgress[]> {
  const now = Date.now();
  return db.progress
    .where('nextReviewAt')
    .belowOrEqual(now)
    .filter(p => p.status !== 'new')
    .toArray();
}

export async function getDueCount(): Promise<number> {
  const due = await getDueWords();
  return due.length;
}

export async function getLearnedCount(): Promise<number> {
  return db.progress.where('status').equals('learned').count();
}

export async function getTodayLearnedCount(): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const progress = await db.progress
    .where('lastReviewedAt')
    .aboveOrEqual(todayStart.getTime())
    .toArray();
  return progress.filter(p => p.status === 'learning' || p.status === 'learned').length;
}

export async function resetAllProgress(): Promise<void> {
  await db.progress.clear();
}

export async function getStreak(): Promise<number> {
  const stored = localStorage.getItem('memrise-streak');
  if (!stored) return 0;
  const { days, lastDate } = JSON.parse(stored);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastDate === today) return days;
  if (lastDate === yesterday) return days;
  return 0;
}

export async function checkInToday(): Promise<number> {
  const stored = localStorage.getItem('memrise-streak');
  const today = new Date().toDateString();
  let days = 1;
  if (stored) {
    const data = JSON.parse(stored);
    if (data.lastDate === today) return data.days;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    days = data.lastDate === yesterday ? data.days + 1 : 1;
  }
  localStorage.setItem('memrise-streak', JSON.stringify({ days, lastDate: today }));
  return days;
}
