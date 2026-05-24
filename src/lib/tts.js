// Text-to-Speech via Web Speech API
// Hindi voice is widely available in modern browsers (Chrome, Edge, Safari)

let cachedVoices = null;

function loadVoices() {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }
    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      cachedVoices = voices;
      resolve(voices);
    };
    // Fallback timeout
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices();
      cachedVoices = voices;
      resolve(voices);
    }, 1000);
  });
}

async function getHindiVoice() {
  if (!cachedVoices) {
    await loadVoices();
  }
  const voices = cachedVoices || window.speechSynthesis.getVoices();

  // Prefer hi-IN voices
  const hindiVoices = voices.filter(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
  if (hindiVoices.length === 0) return null;

  // Prefer Google or Microsoft natural voices
  const preferred = hindiVoices.find(v =>
    /google|microsoft|natural/i.test(v.name)
  );
  return preferred || hindiVoices[0];
}

// Speak Hindi text (use Devanagari for best results, romanized as fallback)
export async function speakHindi(text, { rate = 0.85, pitch = 1.0 } = {}) {
  if (!('speechSynthesis' in window)) {
    throw new Error('Speech synthesis is not supported in this browser');
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const voice = await getHindiVoice();

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function getAvailableHindiVoices() {
  if (!cachedVoices) await loadVoices();
  const voices = cachedVoices || window.speechSynthesis.getVoices();
  return voices.filter(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
}

export function isTTSAvailable() {
  return 'speechSynthesis' in window;
}
