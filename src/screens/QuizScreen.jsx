import { useState, useMemo, useEffect } from 'react';
import { phrases as rawPhrases } from '../data/phrases.js';
import {
  applyOverrides,
  recordAttempt,
  getCachedDistractors,
} from '../lib/storage.js';
import { selectItems } from '../lib/studyEngine.js';
import { generateQuizDistractors, isApiKeyConfigured } from '../lib/gemini.js';
import ExplanationPanel from '../components/ExplanationPanel.jsx';
import CachePanel from '../components/CachePanel.jsx';
import { SetupPanel, ProgressBar, EmptyState, DoneState } from './FlashcardScreen.jsx';

export default function QuizScreen({ onExit }) {
  const allPhrases = useMemo(() => applyOverrides(rawPhrases), []);

  const [studyMode, setStudyMode] = useState('sequential');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [useAI, setUseAI] = useState(isApiKeyConfigured());
  const [started, setStarted] = useState(false);

  const items = useMemo(() => {
    if (!started) return [];
    const filtered = categoryFilter === 'all'
      ? allPhrases
      : allPhrases.filter(p => p.section === categoryFilter);
    return selectItems(filtered, studyMode, 'phrase');
  }, [allPhrases, studyMode, categoryFilter, started]);

  const [index, setIndex] = useState(0);
  const current = items[index];

  if (!started) {
    return (
      <SetupPanel
        title="Multiple Choice Quiz: Japanese → Correct Hindi"
        studyMode={studyMode}
        setStudyMode={setStudyMode}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onStart={() => setStarted(true)}
        extraOptions={
          <div>
            <div className="label mb-2">How to generate wrong answers</div>
            <div className="space-y-1.5 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useAI}
                  onChange={() => setUseAI(true)}
                  disabled={!isApiKeyConfigured()}
                  className="accent-saffron-500"
                />
                <span>Generate with Gemini (more confusable distractors){!isApiKeyConfigured() && ' — API key not configured'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useAI}
                  onChange={() => setUseAI(false)}
                  className="accent-saffron-500"
                />
                <span>Random from other phrases (fast, offline)</span>
              </label>
            </div>
          </div>
        }
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No matching items"
        hint="Try different settings"
        onBack={() => setStarted(false)}
      />
    );
  }

  if (index >= items.length) {
    return (
      <DoneState
        count={items.length}
        onRestart={() => setIndex(0)}
        onChangeSettings={() => { setStarted(false); setIndex(0); }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ProgressBar index={index} total={items.length} />
      <CachePanel allPhrases={allPhrases} compact />
      <QuizQuestion
        key={current.id}
        phrase={current}
        allPhrases={allPhrases}
        useAI={useAI}
        onAnswered={(correct) => {
          recordAttempt({
            itemId: current.id,
            itemType: 'phrase',
            mode: 'quiz',
            direction: 'j2h',
            correct,
          });
        }}
        onNext={() => setIndex(i => i + 1)}
      />
      <div className="flex justify-between text-xs text-ink-700/60">
        <div>#{current.id} · {current.category}</div>
        <button onClick={() => setStarted(false)} className="btn-ghost text-xs">
          Back to settings
        </button>
      </div>
    </div>
  );
}

function QuizQuestion({ phrase, allPhrases, useAI, onAnswered, onNext }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [recorded, setRecorded] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function build() {
      setLoading(true);
      setError(null);
      setSelected(null);
      setRecorded(false);
      setFromCache(false);
      try {
        let distractors;
        const cached = getCachedDistractors()[phrase.id];
        if (cached && cached.length >= 2) {
          distractors = cached.slice(0, 2);
          setFromCache(true);
        } else if (useAI && isApiKeyConfigured()) {
          // Pick a few sample other phrases as context
          const sample = allPhrases
            .filter(p => p.id !== phrase.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 15);
          distractors = await generateQuizDistractors(phrase, sample);
        } else {
          // Random selection from other phrases
          const others = allPhrases.filter(p => p.id !== phrase.id);
          const shuffled = others.sort(() => Math.random() - 0.5);
          distractors = [shuffled[0].romanized, shuffled[1].romanized];
        }

        const opts = [phrase.romanized, ...distractors];
        // Shuffle
        opts.sort(() => Math.random() - 0.5);
        if (!cancelled) setOptions(opts);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || String(e));
          // Fallback to random
          const others = allPhrases.filter(p => p.id !== phrase.id);
          const shuffled = others.sort(() => Math.random() - 0.5);
          const opts = [phrase.romanized, shuffled[0].romanized, shuffled[1].romanized];
          opts.sort(() => Math.random() - 0.5);
          setOptions(opts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    build();
    return () => { cancelled = true; };
  }, [phrase, useAI, allPhrases]);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === phrase.romanized;
    if (!recorded) {
      onAnswered(correct);
      setRecorded(true);
    }
  };

  return (
    <div className="card p-6">
      <div className="label mb-3">Japanese</div>
      <div className="text-2xl mb-6 min-h-[3rem]">{phrase.japanese}</div>

      {error && (
        <div className="text-xs text-amber-700 mb-2">
          AI generation failed (showing fallback): {error}
        </div>
      )}

      {loading && (
        <div className="text-sm text-ink-700/60 py-4 text-center">
          {useAI ? '🤖 Generating options with Gemini...' : 'Preparing options...'}
        </div>
      )}

      {!loading && fromCache && (
        <div className="text-[10px] text-emerald-700/70 mb-2">⚡ From cache</div>
      )}

      {options && !loading && (
        <div className="space-y-2 mb-4">
          {options.map((opt, i) => {
            const isCorrect = opt === phrase.romanized;
            const showResult = !!selected;
            const isSelected = opt === selected;
            let cls = 'w-full text-left p-3 rounded-md border transition-colors font-mono text-sm';
            if (showResult) {
              if (isCorrect) cls += ' bg-emerald-50 border-emerald-400 text-emerald-900';
              else if (isSelected) cls += ' bg-red-50 border-red-400 text-red-900';
              else cls += ' bg-paper-50 border-paper-200 text-ink-700/60';
            } else {
              cls += ' bg-paper-50 border-paper-200 hover:bg-paper-100';
            }
            return (
              <button key={i} onClick={() => handleSelect(opt)} className={cls} disabled={!!selected}>
                <span className="mr-2 text-ink-700/60">{['A', 'B', 'C'][i]}.</span>
                {opt}
                {showResult && isCorrect && <span className="ml-2">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="ml-2">✕</span>}
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="space-y-4 pt-2">
          <ExplanationPanel phrase={phrase} />
          <button onClick={onNext} className="btn-primary w-full">
            Next question →
          </button>
        </div>
      )}
    </div>
  );
}
