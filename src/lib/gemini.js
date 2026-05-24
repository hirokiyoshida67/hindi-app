// Gemini API client - calls Gemini Flash for editing suggestions
// Reads API key from VITE_GEMINI_API_KEY in .env

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export function isApiKeyConfigured() {
  return !!API_KEY && API_KEY !== 'your_gemini_api_key_here';
}

async function callGemini(prompt, { temperature = 0.4, maxOutputTokens = 2048 } = {}) {
  if (!isApiKeyConfigured()) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
  }

  const url = `${BASE_URL}/${MODEL}:generateContent?key=${API_KEY}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature, maxOutputTokens },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

// Ask Gemini to suggest improvements to a phrase
export async function suggestPhraseImprovement(phrase, userQuestion) {
  const prompt = `あなたはヒンディー語のネイティブ感覚を持つ言語の専門家です。日本人学習者 HIROKI さん（デリーに10回以上訪問経験あり、Transformation Manager）に対して、以下のヒンディー語フレーズについて提案・回答してください。

【現在のフレーズデータ】
- ID: ${phrase.id}
- カテゴリ: ${phrase.category}
- デーヴァナーガリー: ${phrase.devanagari}
- ローマ字: ${phrase.romanized}
- 日本語: ${phrase.japanese}
- 既存の解説:
${phrase.explanation}

【HIROKI さんからの質問・要望】
${userQuestion}

【回答ガイドライン】
- 日本語で回答してください
- デリーの実際の口語使用を重視してください（教科書的表現より実用優先）
- 修正案を提示する場合は、変更後の各フィールド（devanagari, romanized, katakana, japanese, explanation）を明確にしてください
- 文法的な注意点や、混同しやすい類似表現があれば指摘してください
- 必要に応じてマークダウン形式で構造化してください`;

  return await callGemini(prompt);
}

// Generate 3-choice options (2 wrong, 1 correct) for a phrase quiz
export async function generateQuizDistractors(phrase, otherPhrases = []) {
  const otherList = otherPhrases
    .slice(0, 20)
    .map(p => `- ${p.romanized} (${p.japanese})`)
    .join('\n');

  const prompt = `日本人ヒンディー語学習者のための3択問題のダミー選択肢を作ってください。

【正解】
- ヒンディー語（ローマ字）: ${phrase.romanized}
- 日本語訳: ${phrase.japanese}

【リスト上の他のフレーズ（参考）】
${otherList}

【依頼】
日本語「${phrase.japanese}」に対する正解は「${phrase.romanized}」です。
これに対する **誤答候補を 2 つ** ローマ字ヒンディー語で生成してください。誤答は:
- 文法的に成立する自然なヒンディー語であること
- 正解と似た構造・近い意味で、初学者が間違えやすいもの
- 上記リストの他フレーズと重複しないこと

【出力形式】
JSON 配列のみを出力してください。説明やマークダウンは不要です。
例: ["wrong option 1", "wrong option 2"]`;

  const text = await callGemini(prompt, { temperature: 0.6 });

  // Try to parse JSON array from response
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr) && arr.length >= 2) {
      return arr.slice(0, 2);
    }
  } catch (e) {
    // Fallback: try to extract quoted strings
    const matches = text.match(/"([^"]+)"/g);
    if (matches && matches.length >= 2) {
      return matches.slice(0, 2).map(s => s.replace(/"/g, ''));
    }
  }

  throw new Error('Could not parse distractors from Gemini response');
}

// Generate distractors for many phrases in parallel.
// Calls onProgress(done, total) after each phrase finishes (success or fail).
// Returns { results: { [phraseId]: [d1, d2] }, failed: [{ id, error }] }.
export async function generateDistractorsForBatch(
  targetPhrases,
  contextPhrases = [],
  onProgress = null
) {
  let done = 0;
  const total = targetPhrases.length;
  const results = {};
  const failed = [];

  const tasks = targetPhrases.map(async (phrase) => {
    try {
      const sample = contextPhrases
        .filter((p) => p.id !== phrase.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
      const distractors = await generateQuizDistractors(phrase, sample);
      results[phrase.id] = distractors;
    } catch (e) {
      failed.push({ id: phrase.id, error: e.message || String(e) });
    } finally {
      done += 1;
      if (onProgress) onProgress(done, total);
    }
  });

  await Promise.all(tasks);
  return { results, failed };
}

// Ask a free-form question about Hindi
export async function askGeneral(question, context = '') {
  const prompt = `あなたはヒンディー語のネイティブ感覚を持つ言語の専門家です。
日本人学習者（デリー駐在経験豊富、Transformation Manager）からの以下の質問に、日本語で実用的に答えてください。
デリーの実際の口語使用を重視してください。

${context ? `【参考文脈】\n${context}\n\n` : ''}【質問】
${question}`;

  return await callGemini(prompt, { temperature: 0.5 });
}
