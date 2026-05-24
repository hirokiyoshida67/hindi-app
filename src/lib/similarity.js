// String similarity for auto-judging typed quiz answers.
// Uses Levenshtein distance; threshold 0.9 of max length.

export const CORRECT_THRESHOLD = 0.9;

// Normalize: trim, lowercase, strip diacritics, collapse internal whitespace.
export function normalize(s) {
  return (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

// Standard iterative Levenshtein distance.
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = new Array(b.length + 1);
  let curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,        // insertion
        prev[j] + 1,            // deletion
        prev[j - 1] + cost      // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

// Compute similarity 0..1 between two strings (after normalization).
export function similarity(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (na.length === 0 && nb.length === 0) return 1;
  const maxLen = Math.max(na.length, nb.length);
  const dist = levenshtein(na, nb);
  return 1 - dist / maxLen;
}

// Judge a user answer against the correct answer (or any of '/'-separated alternates).
// Returns { similarity, correct, matchedAnswer, normalizedUser, normalizedAnswer }.
export function judge(userAnswer, correctAnswer, threshold = CORRECT_THRESHOLD) {
  const alternates = String(correctAnswer || '')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
  const candidates = alternates.length > 0 ? alternates : [correctAnswer];

  let best = { similarity: 0, matchedAnswer: candidates[0] };
  for (const ans of candidates) {
    const sim = similarity(userAnswer, ans);
    if (sim > best.similarity) {
      best = { similarity: sim, matchedAnswer: ans };
    }
  }

  return {
    similarity: best.similarity,
    correct: best.similarity >= threshold,
    matchedAnswer: best.matchedAnswer,
    normalizedUser: normalize(userAnswer),
    normalizedAnswer: normalize(best.matchedAnswer),
  };
}
