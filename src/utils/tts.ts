let rate = 0.85;
let cachedVoices: SpeechSynthesisVoice[] = [];

async function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (cachedVoices.length > 0) return cachedVoices;

  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    const handler = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(cachedVoices);
    };

    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Fallback: resolve after 2s even if voices never load
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, 2000);
  });
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const enUSVoices = voices.filter(v => v.lang === 'en-US');
  if (enUSVoices.length === 0) {
    const enVoices = voices.filter(v => v.lang.startsWith('en-'));
    return enVoices[0] || null;
  }

  // Prefer named, high-quality voices
  const premiumNames = ['Samantha', 'Alex', 'Karen', 'Tom', 'Susan', 'Ava', 'Allison', 'Zoe'];
  for (const name of premiumNames) {
    const found = enUSVoices.find(v => v.name.includes(name));
    if (found) return found;
  }

  // Fall back to any en-US voice that isn't a generic/robot voice
  const goodVoice = enUSVoices.find(v => v.localService && !v.name.includes('Zarvox'));
  if (goodVoice) return goodVoice;

  return enUSVoices[0];
}

export function setTtsRate(newRate: number) {
  rate = newRate;
}

export function getTtsRate(): number {
  return rate;
}

export async function speak(text: string, lang: string = 'en-US'): Promise<void> {
  if (!('speechSynthesis' in window)) {
    throw new Error('TTS not supported');
  }

  window.speechSynthesis.cancel();

  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = pickBestVoice(voices);
  if (voice) utterance.voice = voice;

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      // "interrupted" is not a real error — it happens when cancel() fires
      if (e.error === 'interrupted') {
        resolve();
        return;
      }
      reject(e);
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function speakWord(word: string): Promise<void> {
  return speak(word, 'en-US');
}

export function speakExample(sentence: string): Promise<void> {
  return speak(sentence, 'en-US');
}
