import { useMemo } from 'react';
import { phrases as rawPhrases } from '../data/phrases.js';
import { vocabulary as rawVocab } from '../data/vocabulary.js';
import {
  applyOverrides,
  applyVocabOverrides,
  getAttempts,
  getStatsForItems,
  clearAttempts,
  exportAllData,
  importAllData,
  getTrivia,
} from '../lib/storage.js';
import { getOverallStats } from '../lib/studyEngine.js';

export default function HistoryScreen({ onExit }) {
  const allPhrases = useMemo(() => applyOverrides(rawPhrases), []);
  const allVocab = useMemo(() => applyVocabOverrides(rawVocab), []);
  const allTrivia = useMemo(() => getTrivia(), []);

  const phraseStats = getOverallStats('phrase');
  const vocabStats = getOverallStats('vocab');
  const triviaStats = getOverallStats('trivia');
  const phraseStatsById = getStatsForItems(allPhrases, 'phrase');
  const vocabStatsById = getStatsForItems(allVocab, 'vocab');

  const attempts = getAttempts();
  const lastN = attempts.slice(-30).reverse();

  // Worst phrases (lowest accuracy, with at least 1 incorrect)
  const worstPhrases = allPhrases
    .map(p => ({ ...p, stats: phraseStatsById[p.id] }))
    .filter(p => p.stats.incorrect > 0)
    .sort((a, b) => {
      if (a.stats.accuracy !== b.stats.accuracy) return a.stats.accuracy - b.stats.accuracy;
      return b.stats.incorrect - a.stats.incorrect;
    })
    .slice(0, 10);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hindi-app-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importAllData(data);
        alert('Data imported. Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Import error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="font-display text-3xl">History & Stats</h2>

      <section className="grid md:grid-cols-3 gap-4">
        <StatCard
          title="Phrases"
          total={phraseStats.total}
          correct={phraseStats.correct}
          uniqueItems={phraseStats.uniqueItemsAttempted}
          itemsCount={allPhrases.length}
        />
        <StatCard
          title="Words"
          total={vocabStats.total}
          correct={vocabStats.correct}
          uniqueItems={vocabStats.uniqueItemsAttempted}
          itemsCount={allVocab.length}
        />
        <StatCard
          title="Trivia"
          total={triviaStats.total}
          correct={triviaStats.correct}
          uniqueItems={triviaStats.uniqueItemsAttempted}
          itemsCount={allTrivia.length}
        />
      </section>

      <section>
        <h3 className="font-display text-xl mb-3">Attempts by day</h3>
        <DailyChart
          phraseByDate={phraseStats.byDate}
          vocabByDate={vocabStats.byDate}
          triviaByDate={triviaStats.byDate}
        />
      </section>

      <section>
        <h3 className="font-display text-xl mb-3">Weakest phrases (worst 10 by accuracy)</h3>
        {worstPhrases.length === 0 ? (
          <div className="text-sm text-ink-700/60 p-4 bg-paper-50 rounded-md">
            No incorrect answers yet
          </div>
        ) : (
          <div className="space-y-1.5">
            {worstPhrases.map(p => (
              <div key={p.id} className="card p-3 flex items-center gap-3">
                <span className="font-mono text-xs text-ink-700/60 w-12">#{p.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm truncate">{p.romanized}</div>
                  <div className="text-xs text-ink-700/60 truncate">{p.japanese}</div>
                </div>
                <div className="text-right text-xs">
                  <div>{p.stats.correct} / {p.stats.total} correct</div>
                  <div className="text-red-600">
                    {(p.stats.accuracy * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-display text-xl mb-3">Recent attempts (latest 30)</h3>
        {lastN.length === 0 ? (
          <div className="text-sm text-ink-700/60 p-4 bg-paper-50 rounded-md">
            No attempts recorded yet
          </div>
        ) : (
          <div className="text-xs space-y-1 max-h-96 overflow-y-auto">
            {lastN.map((a, i) => (
              <div key={i} className="flex gap-3 px-3 py-1.5 bg-paper-50 rounded">
                <span className="text-ink-700/60 w-32">
                  {new Date(a.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span className="font-mono w-12">#{a.itemId}</span>
                <span className="text-ink-700/60 w-20">{a.mode}</span>
                <span className="text-ink-700/60 w-12">{a.direction}</span>
                <span className={a.correct ? 'text-emerald-600' : 'text-red-600'}>
                  {a.correct ? '✓ Correct' : '✕ Wrong'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-paper-200 pt-6 space-y-3">
        <h3 className="font-display text-xl">Data management</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm">
            📥 Export data (JSON)
          </button>
          <label className="btn-secondary text-sm cursor-pointer">
            📤 Import data
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={() => {
              if (confirm('Delete all attempt history. Are you sure?')) {
                clearAttempts();
                window.location.reload();
              }
            }}
            className="btn-ghost text-sm text-red-600"
          >
            Delete all history
          </button>
        </div>
        <p className="text-xs text-ink-700/60">
          History is stored in your browser's localStorage. To use it on another device or browser, export to JSON and import there.
        </p>
      </section>
    </div>
  );
}

function StatCard({ title, total, correct, uniqueItems, itemsCount }) {
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  return (
    <div className="card p-5">
      <h3 className="font-display text-xl mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="label">Total attempts</div>
          <div className="text-2xl font-display">{total}</div>
        </div>
        <div>
          <div className="label">Accuracy</div>
          <div className="text-2xl font-display">{accuracy.toFixed(0)}%</div>
        </div>
        <div>
          <div className="label">Correct / Wrong</div>
          <div>{correct} / {total - correct}</div>
        </div>
        <div>
          <div className="label">Items seen</div>
          <div>{uniqueItems} / {itemsCount}</div>
        </div>
      </div>
    </div>
  );
}

function DailyChart({ phraseByDate, vocabByDate, triviaByDate = {} }) {
  // Combine dates from all three, get last 30 days
  const allDates = new Set([
    ...Object.keys(phraseByDate),
    ...Object.keys(vocabByDate),
    ...Object.keys(triviaByDate),
  ]);
  const sorted = Array.from(allDates).sort();
  const last30 = sorted.slice(-30);

  if (last30.length === 0) {
    return (
      <div className="text-sm text-ink-700/60 p-4 bg-paper-50 rounded-md">
        No attempts recorded yet
      </div>
    );
  }

  const max = Math.max(
    1,
    ...last30.map(d => (phraseByDate[d] || 0) + (vocabByDate[d] || 0) + (triviaByDate[d] || 0))
  );

  return (
    <div className="card p-4">
      <div className="flex items-end gap-1 h-24">
        {last30.map(date => {
          const p = phraseByDate[date] || 0;
          const v = vocabByDate[date] || 0;
          const t = triviaByDate[date] || 0;
          const total = p + v + t;
          return (
            <div key={date} className="flex-1 flex flex-col justify-end relative group">
              <div
                className="bg-emerald-500 w-full"
                style={{ height: `${(t / max) * 100}%` }}
                title={`${date}: trivia ${t}`}
              />
              <div
                className="bg-indigo_dye-500 w-full"
                style={{ height: `${(v / max) * 100}%` }}
                title={`${date}: words ${v}`}
              />
              <div
                className="bg-saffron-500 w-full"
                style={{ height: `${(p / max) * 100}%` }}
                title={`${date}: phrases ${p}`}
              />
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-ink-900 text-paper-50 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                {date}: {total}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 text-xs mt-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-saffron-500 inline-block"></span> Phrases
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-indigo_dye-500 inline-block"></span> Words
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-emerald-500 inline-block"></span> Trivia
        </span>
      </div>
    </div>
  );
}
