// localStorage wrapper for tracking attempts and user customizations
// Keys:
//   - 'hindi-app:attempts'      → Array of attempt records
//   - 'hindi-app:overrides'     → Object of phrase id -> overridden fields
//   - 'hindi-app:vocab-overrides' → Object of vocab id -> overridden fields

const ATTEMPTS_KEY = 'hindi-app:attempts';
const OVERRIDES_KEY = 'hindi-app:overrides';
const VOCAB_OVERRIDES_KEY = 'hindi-app:vocab-overrides';
const DISTRACTORS_KEY = 'hindi-app:quiz-distractors';
const TRIVIA_KEY = 'hindi-app:trivia';

// --- Attempts ---

export function recordAttempt({ itemId, itemType, mode, direction, correct }) {
  const attempts = getAttempts();
  const record = {
    itemId,           // e.g. "27" or "v15"
    itemType,         // 'phrase' | 'vocab'
    mode,             // 'flashcard' | 'quiz'
    direction,        // 'j2h' | 'h2j'
    correct,          // bool (for flashcard: self-marked; for quiz: actual)
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  };
  attempts.push(record);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  return record;
}

export function getAttempts() {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearAttempts() {
  localStorage.removeItem(ATTEMPTS_KEY);
}

// Compute stats per item
export function getStatsForItems(items, itemType) {
  const attempts = getAttempts().filter(a => a.itemType === itemType);
  const statsById = {};

  for (const item of items) {
    const itemAttempts = attempts.filter(a => a.itemId === item.id);
    const correctCount = itemAttempts.filter(a => a.correct).length;
    const totalCount = itemAttempts.length;
    const lastAttempt = itemAttempts.length
      ? Math.max(...itemAttempts.map(a => a.timestamp))
      : null;

    statsById[item.id] = {
      total: totalCount,
      correct: correctCount,
      incorrect: totalCount - correctCount,
      accuracy: totalCount > 0 ? correctCount / totalCount : null,
      lastAttempt,
    };
  }

  return statsById;
}

// Get items attempted on a specific date (YYYY-MM-DD)
export function getItemsAttemptedOn(date, itemType) {
  const attempts = getAttempts().filter(
    a => a.itemType === itemType && a.date === date
  );
  return Array.from(new Set(attempts.map(a => a.itemId)));
}

// Get yesterday's date string
export function yesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// --- User Overrides (edits to phrases/vocab) ---

export function getOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setOverride(id, fields) {
  const all = getOverrides();
  all[id] = { ...(all[id] || {}), ...fields };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}

export function clearOverride(id) {
  const all = getOverrides();
  delete all[id];
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
}

export function applyOverrides(phrases) {
  const overrides = getOverrides();
  return phrases.map(p =>
    overrides[p.id] ? { ...p, ...overrides[p.id] } : p
  );
}

// Same for vocab
export function getVocabOverrides() {
  try {
    const raw = localStorage.getItem(VOCAB_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setVocabOverride(id, fields) {
  const all = getVocabOverrides();
  all[id] = { ...(all[id] || {}), ...fields };
  localStorage.setItem(VOCAB_OVERRIDES_KEY, JSON.stringify(all));
}

export function applyVocabOverrides(vocab) {
  const overrides = getVocabOverrides();
  return vocab.map(v =>
    overrides[v.id] ? { ...v, ...overrides[v.id] } : v
  );
}

// --- Quiz distractor cache ---
// Stored as { [phraseId]: [option1, option2] }

export function getCachedDistractors() {
  try {
    const raw = localStorage.getItem(DISTRACTORS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setCachedDistractors(phraseId, options) {
  const all = getCachedDistractors();
  all[phraseId] = options;
  localStorage.setItem(DISTRACTORS_KEY, JSON.stringify(all));
}

export function setCachedDistractorsBulk(map) {
  const all = getCachedDistractors();
  Object.assign(all, map);
  localStorage.setItem(DISTRACTORS_KEY, JSON.stringify(all));
}

export function clearCachedDistractors() {
  localStorage.removeItem(DISTRACTORS_KEY);
}

// --- Trivia (user-managed questions, e.g., Coffee Break India Trivia) ---
// Stored as array of { id, question, choices: [s,s,s,s], correctIndex, explanation }

export function getTrivia() {
  try {
    const raw = localStorage.getItem(TRIVIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTrivia({ question, choices, correctIndex, explanation = '' }) {
  const items = getTrivia();
  const id = `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const item = { id, question, choices, correctIndex, explanation, createdAt: Date.now() };
  items.push(item);
  localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
  return item;
}

export function updateTrivia(id, fields) {
  const items = getTrivia();
  const idx = items.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...fields };
  localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
  return items[idx];
}

export function deleteTrivia(id) {
  const items = getTrivia().filter((t) => t.id !== id);
  localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
}

// One-time seed: writes the given trivia array to localStorage if the
// flag has never been set. The user owns the store afterwards — deleting
// items will not cause them to reappear, even if the seed is called again.
export function seedTriviaOnce(seedItems, flagKey) {
  if (localStorage.getItem(flagKey)) return false;
  const existing = getTrivia();
  const baseTs = Date.now();
  const newItems = seedItems.map((s, i) => ({
    id: `seed-${flagKey}-${i}`,
    createdAt: baseTs + i,
    explanation: '',
    ...s,
  }));
  localStorage.setItem(TRIVIA_KEY, JSON.stringify([...existing, ...newItems]));
  localStorage.setItem(flagKey, '1');
  return true;
}

// --- Export / Import ---

export function exportAllData() {
  return {
    exported_at: new Date().toISOString(),
    attempts: getAttempts(),
    overrides: getOverrides(),
    vocabOverrides: getVocabOverrides(),
    cachedDistractors: getCachedDistractors(),
    trivia: getTrivia(),
  };
}

export function importAllData(data) {
  if (data.attempts) {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data.attempts));
  }
  if (data.overrides) {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(data.overrides));
  }
  if (data.vocabOverrides) {
    localStorage.setItem(VOCAB_OVERRIDES_KEY, JSON.stringify(data.vocabOverrides));
  }
  if (data.cachedDistractors) {
    localStorage.setItem(DISTRACTORS_KEY, JSON.stringify(data.cachedDistractors));
  }
  if (data.trivia) {
    localStorage.setItem(TRIVIA_KEY, JSON.stringify(data.trivia));
  }
}
