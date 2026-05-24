import { useState, useMemo } from 'react';
import { phrases as rawPhrases, categories } from '../data/phrases.js';
import { applyOverrides, recordAttempt } from '../lib/storage.js';
import { selectItems, STUDY_MODES } from '../lib/studyEngine.js';
import { judge } from '../lib/similarity.js';
import ExplanationPanel from '../components/ExplanationPanel.jsx';

export default function FlashcardScreen({ direction, onExit }) {
  // direction: 'j2h' (Japanese → Hindi) or 'h2j' (Hindi → Japanese)
  const allPhrases = useMemo(() => applyOverrides(rawPhrases), [rawPhrases]);

  const [studyMode, setStudyMode] = useState('sequential');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [started, setStarted] = useState(false);

  // Filter and select items
  const items = useMemo(() => {
    if (!started) return [];
    const filtered = categoryFilter === 'all'
      ? allPhrases
      : allPhrases.filter(p => p.section === categoryFilter);
    return selectItems(filtered, studyMode, 'phrase');
  }, [allPhrases, studyMode, categoryFilter, started]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = items[index];

  const next = () => {
    setRevealed(false);
    setIndex(i => i + 1);
  };

  const recordAndAdvance = (correct) => {
    if (!current) return;
    recordAttempt({
      itemId: current.id,
      itemType: 'phrase',
      mode: 'flashcard',
      direction,
      correct,
    });
    next();
  };

  if (!started) {
    return (
      <SetupPanel
        title={direction === 'j2h' ? 'Typing Quiz: Japanese → Hindi' : 'Flashcards: Hindi → Japanese'}
        studyMode={studyMode}
        setStudyMode={setStudyMode}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onStart={() => setStarted(true)}
        onExit={onExit}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No matching items"
        hint={
          studyMode === 'yesterday'
            ? 'No items of this type were attempted yesterday'
            : studyMode === 'incorrect-only'
            ? 'No incorrect answers recorded yet'
            : 'No phrases match the current filter'
        }
        onBack={() => setStarted(false)}
      />
    );
  }

  if (index >= items.length) {
    return (
      <DoneState
        count={items.length}
        onRestart={() => { setIndex(0); setRevealed(false); }}
        onChangeSettings={() => { setStarted(false); setIndex(0); setRevealed(false); }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ProgressBar index={index} total={items.length} />

      <div className="card p-6">
        <div className="label mb-3">
          {direction === 'j2h' ? 'Japanese' : 'Hindi (Romanized)'}
        </div>
        <div className={`text-2xl mb-6 min-h-[3rem] ${direction === 'h2j' ? 'font-mono' : ''}`}>
          {direction === 'j2h' ? current.japanese : current.romanized}
        </div>

        {direction === 'j2h' ? (
          <TypingAnswer
            key={current.id}
            phrase={current}
            onAdvance={recordAndAdvance}
          />
        ) : !revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary w-full">
            Show answer
          </button>
        ) : (
          <div className="space-y-4">
            <ExplanationPanel phrase={current} />
            <div className="flex gap-2 pt-2">
              <button onClick={() => recordAndAdvance(false)} className="btn-secondary flex-1">
                ✕ Got it wrong
              </button>
              <button onClick={() => recordAndAdvance(true)} className="btn-accent flex-1">
                ✓ Got it right
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-ink-700/60">
        <div>#{current.id} · {current.category}</div>
        <button onClick={() => setStarted(false)} className="btn-ghost text-xs">
          Back to settings
        </button>
      </div>
    </div>
  );
}

export function SetupPanel({ title, studyMode, setStudyMode, categoryFilter, setCategoryFilter, onStart, extraOptions }) {
  return (
    <div className="card p-6 max-w-xl mx-auto space-y-5 animate-fade-in">
      <h2 className="font-display text-2xl">{title}</h2>

      <div>
        <div className="label mb-2">Order</div>
        <div className="space-y-1.5">
          {Object.entries(STUDY_MODES).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="studyMode"
                value={key}
                checked={studyMode === key}
                onChange={(e) => setStudyMode(e.target.value)}
                className="accent-saffron-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {categoryFilter !== undefined && (
        <div>
          <div className="label mb-2">Filter by category</div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            <option value="all">All</option>
            {Object.entries(categories).map(([key, name]) => (
              <option key={key} value={key}>
                {key}. {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {extraOptions}

      <button onClick={onStart} className="btn-primary w-full">
        Start
      </button>
    </div>
  );
}

export function ProgressBar({ index, total }) {
  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-ink-700/60 mb-1.5">
        <span>{index + 1} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1 bg-paper-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-saffron-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function EmptyState({ message, hint, onBack }) {
  return (
    <div className="card p-8 text-center space-y-3 animate-fade-in">
      <div className="text-3xl">📭</div>
      <div className="font-display text-xl">{message}</div>
      <div className="text-sm text-ink-700/60">{hint}</div>
      <button onClick={onBack} className="btn-primary mt-3">
        Back to settings
      </button>
    </div>
  );
}

function TypingAnswer({ phrase, onAdvance }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // { similarity, correct, matchedAnswer }

  const submit = (e) => {
    e?.preventDefault();
    if (!input.trim() || result) return;
    setResult(judge(input, phrase.romanized));
  };

  const next = () => {
    onAdvance(result.correct);
    setInput('');
    setResult(null);
  };

  const pct = result ? Math.round(result.similarity * 100) : 0;

  return (
    <div className="space-y-4">
      {!result ? (
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            placeholder="Type the Hindi (romanized)..."
            className="input font-mono"
          />
          <button type="submit" disabled={!input.trim()} className="btn-primary w-full">
            Submit
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-md border ${
              result.correct
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : 'bg-red-50 border-red-400 text-red-900'
            }`}
          >
            <div className="font-display text-xl mb-1">
              {result.correct ? '✓ Correct!' : '✕ Incorrect'}
            </div>
            <div className="text-xs opacity-80">Match: {pct}%</div>
            <div className="mt-2 text-sm">
              <span className="opacity-70">Your answer: </span>
              <span className="font-mono">{input}</span>
            </div>
            {!result.correct && (
              <div className="text-sm">
                <span className="opacity-70">Correct answer: </span>
                <span className="font-mono font-semibold">{result.matchedAnswer}</span>
              </div>
            )}
          </div>
          <ExplanationPanel phrase={phrase} />
          <button onClick={next} className="btn-primary w-full">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export function DoneState({ count, onRestart, onChangeSettings, onExit }) {
  return (
    <div className="card p-8 text-center space-y-4 animate-fade-in">
      <div className="text-3xl">🎉</div>
      <div className="font-display text-2xl">Nice work!</div>
      <div className="text-sm text-ink-700/60">{count} items completed</div>
      <div className="flex gap-2 justify-center pt-2">
        <button onClick={onRestart} className="btn-secondary">Restart</button>
        <button onClick={onChangeSettings} className="btn-secondary">Change settings</button>
        <button onClick={onExit} className="btn-primary">Home</button>
      </div>
    </div>
  );
}
