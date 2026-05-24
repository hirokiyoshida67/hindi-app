import { useState, useMemo } from 'react';
import { vocabulary as rawVocab, vocabularyCategories } from '../data/vocabulary.js';
import { applyVocabOverrides, recordAttempt } from '../lib/storage.js';
import { selectItems, STUDY_MODES } from '../lib/studyEngine.js';
import { speakHindi, isTTSAvailable } from '../lib/tts.js';
import { judge } from '../lib/similarity.js';
import { ProgressBar, EmptyState, DoneState } from './FlashcardScreen.jsx';

export default function VocabScreen({ onExit }) {
  const allVocab = useMemo(() => applyVocabOverrides(rawVocab), []);

  const [direction, setDirection] = useState('j2h');
  const [studyMode, setStudyMode] = useState('sequential');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [started, setStarted] = useState(false);

  const items = useMemo(() => {
    if (!started) return [];
    const filtered = categoryFilter === 'all'
      ? allVocab
      : allVocab.filter(v => v.category === categoryFilter);
    return selectItems(filtered, studyMode, 'vocab');
  }, [allVocab, studyMode, categoryFilter, started]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = items[index];

  const recordAndAdvance = (correct) => {
    if (!current) return;
    recordAttempt({
      itemId: current.id,
      itemType: 'vocab',
      mode: 'flashcard',
      direction,
      correct,
    });
    setRevealed(false);
    setIndex(i => i + 1);
  };

  if (!started) {
    return (
      <div className="card p-6 max-w-xl mx-auto space-y-5 animate-fade-in">
        <h2 className="font-display text-2xl">Vocabulary Flashcards</h2>

        <div>
          <div className="label mb-2">Direction</div>
          <div className="space-y-1.5 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={direction === 'j2h'}
                onChange={() => setDirection('j2h')}
                className="accent-saffron-500"
              />
              <span>Japanese → Hindi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={direction === 'h2j'}
                onChange={() => setDirection('h2j')}
                className="accent-saffron-500"
              />
              <span>Hindi (Romanized) → Japanese</span>
            </label>
          </div>
        </div>

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

        <div>
          <div className="label mb-2">Filter by category</div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            <option value="all">All</option>
            {vocabularyCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setStarted(true)} className="btn-primary w-full">
          Start
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No matching words"
        hint="Try different settings"
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
          {direction === 'j2h' ? 'Japanese' : 'Hindi'}
        </div>
        <div className={`text-3xl mb-6 ${direction === 'h2j' ? 'font-mono' : ''}`}>
          {direction === 'j2h' ? current.japanese : current.romanized}
        </div>

        {direction === 'j2h' ? (
          <VocabTypingAnswer
            key={current.id}
            vocab={current}
            onAdvance={recordAndAdvance}
          />
        ) : !revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary w-full">
            Show answer
          </button>
        ) : (
          <div className="space-y-4">
            <VocabRevealBlock vocab={current} />
            <div className="flex gap-2">
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
        <div>{current.id} · {current.category}</div>
        <button onClick={() => setStarted(false)} className="btn-ghost text-xs">
          Back to settings
        </button>
      </div>
    </div>
  );
}

function VocabRevealBlock({ vocab }) {
  return (
    <div className="bg-paper-50 rounded-md p-4 border border-paper-200">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="label mb-1">Romanized</div>
          <div className="font-mono text-lg">{vocab.romanized}</div>
        </div>
        <div>
          <div className="label mb-1">Devanagari</div>
          <div className="font-devanagari text-lg flex items-center gap-2">
            <span>{vocab.devanagari}</span>
            {isTTSAvailable() && (
              <button
                onClick={() => speakHindi(vocab.devanagari).catch(() => {})}
                className="text-xs btn-ghost"
                title="Play pronunciation"
              >
                🔊
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="label mb-1">Japanese</div>
        <div className="text-base">{vocab.japanese}</div>
      </div>
      {vocab.notes && (
        <div className="mt-3 pt-3 border-t border-paper-200">
          <div className="label mb-1">Notes</div>
          <div className="text-sm text-ink-700">{vocab.notes}</div>
        </div>
      )}
    </div>
  );
}

function VocabTypingAnswer({ vocab, onAdvance }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const submit = (e) => {
    e?.preventDefault();
    if (!input.trim() || result) return;
    // Threshold 1.0 = exact match after normalization (case/whitespace/diacritics)
    setResult(judge(input, vocab.romanized, 1.0));
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
            <div className="text-xs opacity-80">Match: {pct}% (100% required)</div>
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
          <VocabRevealBlock vocab={vocab} />
          <button onClick={next} className="btn-primary w-full">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
