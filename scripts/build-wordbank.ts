// Generates src/data/wordbank.ts from compact word lists
// Usage: npx tsx scripts/build-wordbank.ts

import * as fs from 'fs';
import * as path from 'path';

interface CompactWord {
  e: string;   // english
  c: string;   // chinese
  p: string;   // phonetic
  pos: string; // part of speech
  lvl: number; // level 1-5
  tags: string;
  ex?: string;  // example english
  exzh?: string; // example chinese
}

// Standard part-of-speech mapping
const POS_MAP: Record<string, string> = {
  'n': 'noun',
  'v': 'verb',
  'adj': 'adjective',
  'adv': 'adverb',
  'prep': 'preposition',
  'conj': 'conjunction',
  'pron': 'pronoun',
  'interj': 'interjection',
  'phr': 'phrase',
  'phr v': 'phrasal verb',
  'idiom': 'idiom',
  'det': 'determiner',
  'num': 'number',
  'art': 'article',
};

function normalizePos(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  return POS_MAP[trimmed] || trimmed;
}

function autoExample(english: string, chinese: string): { en: string; zh: string } {
  const templates: [string, string][] = [
    [`I heard "${english}" in a movie yesterday.`, `我昨天在电影里听到了"${chinese}"。`],
    [`Can you explain what "${english}" means?`, `你能解释一下"${chinese}"是什么意思吗？`],
    [`She said "${english}" with a perfect American accent.`, `她用完美的美音说了"${chinese}"。`],
    [`"${english}" is a word I use every day.`, `"${chinese}"是我每天用的词。`],
    [`Let me give you an example of "${english}".`, `我给你举个例子说明"${chinese}"。`],
    [`I learned "${english}" from my American friend.`, `我从美国朋友那学到了"${chinese}"。`],
    [`Americans say "${english}" all the time.`, `美国人经常说"${chinese}"。`],
    [`The phrase "${english}" means ${chinese} in Chinese.`, `短语"${english}"的中文意思是${chinese}。`],
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function buildWordbank() {
  // Read compact word lists
  const corePath = path.join(__dirname, '..', 'data', 'core-words.json');
  const freqPath = path.join(__dirname, '..', 'data', 'freq-words.json');
  const phrasePath = path.join(__dirname, '..', 'data', 'american-phrases.json');

  let allWords: CompactWord[] = [];

  for (const p of [corePath, freqPath, phrasePath]) {
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      allWords = allWords.concat(data);
    }
  }

  if (allWords.length === 0) {
    console.error('No word data found! Please add files to data/ directory.');
    process.exit(1);
  }

  console.log(`Processing ${allWords.length} words...`);

  const entries: string[] = [];
  let id = 1;

  for (const w of allWords) {
    const pos = normalizePos(w.pos);
    const example = w.ex && w.exzh
      ? { en: w.ex, zh: w.exzh }
      : autoExample(w.e, w.c);

    const tags = w.tags.split(',').map(t => t.trim()).filter(Boolean);
    const tagsStr = tags.map(t => `"${t}"`).join(', ');

    entries.push(
      `  { id: ${id}, english: "${w.e}", chinese: "${w.c}", phonetic: "${w.p}", ` +
      `partOfSpeech: "${pos}", exampleEn: "${example.en}", exampleZh: "${example.zh}", ` +
      `level: ${w.lvl}, tags: [${tagsStr}], alternatives: [] }`
    );
    id++;
  }

  const output = `import type { WordEntry, SceneInfo } from '../types';

export const SCENES: SceneInfo[] = [
  { tag: '日常口语', emoji: '💬', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { tag: '职场', emoji: '💼', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  { tag: '社交', emoji: '🎉', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { tag: '旅行', emoji: '✈️', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { tag: '购物', emoji: '🛍️', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { tag: '餐饮', emoji: '🍔', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  { tag: '情感', emoji: '❤️', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { tag: '校园', emoji: '🎓', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
  { tag: '网络用语', emoji: '📱', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
  { tag: '电话', emoji: '📞', color: '#84cc16', gradient: 'linear-gradient(135deg, #84cc16, #a3e635)' },
  { tag: '面试', emoji: '🤝', color: '#64748b', gradient: 'linear-gradient(135deg, #64748b, #94a3b8)' },
  { tag: '约会', emoji: '💕', color: '#e11d48', gradient: 'linear-gradient(135deg, #e11d48, #fb7185)' },
];

export const WORDBANK: WordEntry[] = [
${entries.join(',\n')}
];

export function getWordsByTag(tag: string): WordEntry[] {
  return WORDBANK.filter(w => w.tags.includes(tag));
}

export function getWordsByLevel(level: number): WordEntry[] {
  return WORDBANK.filter(w => w.level === level);
}

export function getNewWords(
  learnedIds: Set<number>,
  count: number = 10,
  tag?: string
): WordEntry[] {
  let pool = WORDBANK.filter(w => !learnedIds.has(w.id));
  if (tag) {
    pool = pool.filter(w => w.tags.includes(tag));
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getReviewWords(wordIds: number[]): WordEntry[] {
  const words = wordIds
    .map(id => WORDBANK.find(w => w.id === id))
    .filter((w): w is WordEntry => w !== undefined);
  return [...words].sort(() => Math.random() - 0.5);
}

export function getDistractors(
  correctAnswer: WordEntry,
  count: number = 3
): string[] {
  const sameLevel = WORDBANK.filter(
    w => w.id !== correctAnswer.id && w.level === correctAnswer.level
  );
  const shuffled = [...sameLevel].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(w => w.chinese);
}
`;

  const outPath = path.join(__dirname, '..', 'src', 'data', 'wordbank.ts');
  fs.writeFileSync(outPath, output, 'utf-8');
  console.log(`Generated wordbank.ts with ${entries.length} entries`);
  console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
}

buildWordbank();
