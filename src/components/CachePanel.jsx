import { useState } from 'react';
import {
  getCachedDistractors,
  setCachedDistractorsBulk,
  clearCachedDistractors,
} from '../lib/storage.js';
import { generateDistractorsForBatch, isApiKeyConfigured } from '../lib/gemini.js';

const BATCH_SIZE = 20;

export default function CachePanel({ allPhrases, compact = false }) {
  const [cacheVersion, setCacheVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState(null);
  const [lastFailed, setLastFailed] = useState([]);

  const cached = getCachedDistractors();
  const cachedCount = Object.keys(cached).length;
  const total = allPhrases.length;
  const uncached = allPhrases.filter((p) => !cached[p.id]);
  const apiOK = isApiKeyConfigured();

  const handleGenerate = async () => {
    if (!apiOK || busy) return;
    const targets = uncached.slice(0, BATCH_SIZE);
    if (targets.length === 0) return;

    setBusy(true);
    setError(null);
    setLastFailed([]);
    setProgress({ done: 0, total: targets.length });

    try {
      const { results, failed } = await generateDistractorsForBatch(
        targets,
        allPhrases,
        (done, t) => setProgress({ done, total: t })
      );
      setCachedDistractorsBulk(results);
      setLastFailed(failed);
      setCacheVersion((v) => v + 1);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const handleClear = () => {
    if (busy) return;
    if (!confirm('Clear all cached quiz distractors?')) return;
    clearCachedDistractors();
    setCacheVersion((v) => v + 1);
    setLastFailed([]);
  };

  const batchSize = Math.min(BATCH_SIZE, uncached.length);
  const allDone = uncached.length === 0;

  return (
    <div className={`card ${compact ? 'p-3' : 'p-5'} space-y-3 border-l-4 border-l-saffron-500`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`font-display ${compact ? 'text-base' : 'text-lg'}`}>
          🤖 Quiz distractor cache
        </h3>
        <span className="text-xs text-ink-700/60">
          {cachedCount} / {total} cached
        </span>
      </div>

      <ProgressBar value={cachedCount} max={total} />

      {!apiOK && (
        <div className="text-xs text-amber-700">
          Set VITE_GEMINI_API_KEY in .env to enable pre-generation
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleGenerate}
          disabled={!apiOK || busy || allDone}
          className="btn-primary text-sm"
        >
          {busy
            ? `Generating ${progress.done}/${progress.total}...`
            : allDone
            ? 'All phrases cached'
            : `Generate next ${batchSize} with Gemini`}
        </button>
        {cachedCount > 0 && !busy && (
          <button onClick={handleClear} className="btn-ghost text-xs text-red-600">
            Clear cache
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-600">Error: {error}</div>
      )}
      {lastFailed.length > 0 && (
        <div className="text-xs text-amber-700">
          {lastFailed.length} phrase{lastFailed.length === 1 ? '' : 's'} failed (will retry on next batch)
        </div>
      )}
      {!compact && (
        <p className="text-xs text-ink-700/60">
          Pre-generating distractors makes the quiz instant — no waiting for Gemini per question.
          Click again any time to cache the next {BATCH_SIZE} phrases.
        </p>
      )}
    </div>
  );
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-1.5 bg-paper-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-saffron-500 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
