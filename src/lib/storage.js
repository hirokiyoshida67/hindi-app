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
  // Validate inputs
  if (!itemId || !itemType || !mode) {
    console.warn('recordAttempt: missing required fields', { itemId, itemType, mode });
    return null;
  }

  try {
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
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable (quota exceeded or private mode):', e.message);
      return null;
    }
    throw e;
  }
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
  try {
    const all = getOverrides();
    all[id] = { ...(all[id] || {}), ...fields };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
}

export function clearOverride(id) {
  try {
    const all = getOverrides();
    delete all[id];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
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
  try {
    const all = getVocabOverrides();
    all[id] = { ...(all[id] || {}), ...fields };
    localStorage.setItem(VOCAB_OVERRIDES_KEY, JSON.stringify(all));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
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
  try {
    const all = getCachedDistractors();
    all[phraseId] = options;
    localStorage.setItem(DISTRACTORS_KEY, JSON.stringify(all));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
}

export function setCachedDistractorsBulk(map) {
  try {
    const all = getCachedDistractors();
    Object.assign(all, map);
    localStorage.setItem(DISTRACTORS_KEY, JSON.stringify(all));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
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
  try {
    const items = getTrivia();
    const id = `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const item = { id, question, choices, correctIndex, explanation, createdAt: Date.now() };
    items.push(item);
    localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
    return item;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return null;
    }
    throw e;
  }
}

export function updateTrivia(id, fields) {
  try {
    const items = getTrivia();
    const idx = items.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...fields };
    localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
    return items[idx];
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return null;
    }
    throw e;
  }
}

export function deleteTrivia(id) {
  try {
    const items = getTrivia().filter((t) => t.id !== id);
    localStorage.setItem(TRIVIA_KEY, JSON.stringify(items));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return;
    }
    throw e;
  }
}

// One-time seed: writes the given trivia array to localStorage if the
// flag has never been set. The user owns the store afterwards — deleting
// items will not cause them to reappear, even if the seed is called again.
export function seedTriviaOnce(seedItems, flagKey) {
  try {
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
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage unavailable:', e.message);
      return false;
    }
    throw e;
  }
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

// Validate an imported data object. Returns { data, issues }.
// - data: sanitized object containing only well-formed top-level sections
// - issues: array of human-readable strings describing skipped/dropped entries
// Throws Error if the top-level shape is fundamentally wrong (not an object, or
// a required section has the wrong outer type).
export function validateImportData(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('File is not a valid JSON object');
  }

  const out = {};
  const issues = [];
  const isPlainObject = (v) =>
    v !== null && typeof v === 'object' && !Array.isArray(v);
  const isSafeKey = (k) =>
    k !== '__proto__' && k !== 'constructor' && k !== 'prototype';

  // attempts: array of attempt records
  if ('attempts' in input) {
    if (!Array.isArray(input.attempts)) {
      throw new Error('"attempts" must be an array');
    }
    let dropped = 0;
    out.attempts = input.attempts.filter((a) => {
      const ok =
        a &&
        typeof a === 'object' &&
        !Array.isArray(a) &&
        typeof a.itemId === 'string' &&
        typeof a.itemType === 'string' &&
        typeof a.mode === 'string' &&
        typeof a.correct === 'boolean' &&
        typeof a.timestamp === 'number' &&
        Number.isFinite(a.timestamp);
      if (!ok) dropped += 1;
      return ok;
    });
    if (dropped > 0) issues.push(`${dropped} malformed attempt record(s) skipped`);
  }

  // overrides / vocabOverrides: object whose values are field objects
  for (const key of ['overrides', 'vocabOverrides']) {
    if (key in input) {
      if (!isPlainObject(input[key])) {
        throw new Error(`"${key}" must be an object`);
      }
      const cleaned = {};
      let dropped = 0;
      for (const [id, fields] of Object.entries(input[key])) {
        if (!isSafeKey(id)) { dropped += 1; continue; }
        if (isPlainObject(fields)) cleaned[id] = fields;
        else dropped += 1;
      }
      out[key] = cleaned;
      if (dropped > 0) issues.push(`${dropped} malformed ${key} entry(ies) skipped`);
    }
  }

  // cachedDistractors: object whose values are arrays of strings
  if ('cachedDistractors' in input) {
    if (!isPlainObject(input.cachedDistractors)) {
      throw new Error('"cachedDistractors" must be an object');
    }
    const cleaned = {};
    let dropped = 0;
    for (const [id, options] of Object.entries(input.cachedDistractors)) {
      if (!isSafeKey(id)) { dropped += 1; continue; }
      if (Array.isArray(options) && options.every((o) => typeof o === 'string')) {
        cleaned[id] = options;
      } else {
        dropped += 1;
      }
    }
    out.cachedDistractors = cleaned;
    if (dropped > 0) issues.push(`${dropped} malformed distractor entry(ies) skipped`);
  }

  // trivia: array of trivia question objects
  if ('trivia' in input) {
    if (!Array.isArray(input.trivia)) {
      throw new Error('"trivia" must be an array');
    }
    let dropped = 0;
    out.trivia = input.trivia.filter((t) => {
      const ok =
        t &&
        typeof t === 'object' &&
        !Array.isArray(t) &&
        typeof t.id === 'string' &&
        typeof t.question === 'string' &&
        Array.isArray(t.choices) &&
        t.choices.length >= 2 &&
        t.choices.every((c) => typeof c === 'string') &&
        Number.isInteger(t.correctIndex) &&
        t.correctIndex >= 0 &&
        t.correctIndex < t.choices.length &&
        (t.explanation === undefined || typeof t.explanation === 'string') &&
        (t.image === undefined || typeof t.image === 'string');
      if (!ok) dropped += 1;
      return ok;
    });
    if (dropped > 0) issues.push(`${dropped} malformed trivia question(s) skipped`);
  }

  return { data: out, issues };
}

export function importAllData(data) {
  try {
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
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.name === 'SecurityError') {
      console.warn('Storage import failed - storage unavailable:', e.message);
      throw new Error('Could not import data: Storage is unavailable');
    }
    throw e;
  }
}
