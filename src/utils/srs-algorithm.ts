const INTERVALS: Record<number, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
  6: 60,
};

export function getNextInterval(consecutiveCorrect: number): number {
  if (consecutiveCorrect >= 6) return 60;
  return INTERVALS[consecutiveCorrect] ?? 1;
}

export function calculateNextReview(
  consecutiveCorrect: number,
  now: number = Date.now()
): number {
  const days = getNextInterval(consecutiveCorrect);
  if (days === 0) {
    return now + 60 * 60 * 1000;
  }
  return now + days * 24 * 60 * 60 * 1000;
}

export function isDue(nextReviewAt: number, now: number = Date.now()): boolean {
  return nextReviewAt <= now;
}

export interface SrsResult {
  consecutiveCorrect: number;
  nextReviewAt: number;
}

export function processAnswer(
  currentConsecutive: number,
  correct: boolean
): SrsResult {
  const next = correct ? currentConsecutive + 1 : 0;
  return {
    consecutiveCorrect: next,
    nextReviewAt: calculateNextReview(next),
  };
}
