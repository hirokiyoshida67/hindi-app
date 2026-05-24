import { useState, useMemo } from 'react';
import { phrases as rawPhrases, categories } from '../data/phrases.js';
import { applyOverrides, setOverride, clearOverride, getOverrides } from '../lib/storage.js';
import { suggestPhraseImprovement, isApiKeyConfigured } from '../lib/gemini.js';
import ExplanationPanel from '../components/ExplanationPanel.jsx';

export default function EditorScreen({ onExit }) {
  const [overridesVersion, setOverridesVersion] = useState(0);
  const allPhrases = useMemo(
    () => applyOverrides(rawPhrases),
    [overridesVersion] // re-apply when overrides change
  );
  const overriddenIds = useMemo(() => Object.keys(getOverrides()), [overridesVersion]);

  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = allPhrases.filter(p => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.romanized.toLowerCase().includes(q) ||
      p.japanese.toLowerCase().includes(q) ||
      p.devanagari.includes(filter) ||
      p.category.includes(filter)
    );
  });

  const selected = allPhrases.find(p => p.id === selectedId);

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6 animate-fade-in">
      {/* Sidebar */}
      <aside className="space-y-2">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by id or keyword"
          className="input"
        />
        <div className="text-xs text-ink-700/60 px-1">
          {filtered.length} / {allPhrases.length} shown · {overriddenIds.length} edited
        </div>
        <div className="max-h-[60vh] overflow-y-auto space-y-1 pr-1">
          {filtered.map(p => {
            const isEdited = overriddenIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left p-2 rounded text-xs border
                  ${selectedId === p.id ? 'bg-saffron-500/10 border-saffron-400' : 'bg-paper-50 border-paper-200 hover:bg-paper-100'}`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-mono">#{p.id}</span>
                  {isEdited && <span className="text-saffron-600 text-[10px]">edited</span>}
                </div>
                <div className="font-mono text-xs truncate">{p.romanized}</div>
                <div className="text-ink-700/60 truncate">{p.japanese}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main edit panel */}
      <section>
        {selected ? (
          <PhraseEditor
            key={selected.id}
            phrase={selected}
            isOverridden={overriddenIds.includes(selected.id)}
            onSave={(fields) => {
              setOverride(selected.id, fields);
              setOverridesVersion(v => v + 1);
            }}
            onReset={() => {
              clearOverride(selected.id);
              setOverridesVersion(v => v + 1);
            }}
          />
        ) : (
          <div className="text-center text-ink-700/60 py-16">
            ← Select a phrase from the list on the left to edit
          </div>
        )}
      </section>
    </div>
  );
}

function PhraseEditor({ phrase, isOverridden, onSave, onReset }) {
  const [devanagari, setDevanagari] = useState(phrase.devanagari);
  const [romanized, setRomanized] = useState(phrase.romanized);
  const [katakana, setKatakana] = useState(phrase.katakana);
  const [japanese, setJapanese] = useState(phrase.japanese);
  const [explanation, setExplanation] = useState(phrase.explanation);

  const dirty = (
    devanagari !== phrase.devanagari ||
    romanized !== phrase.romanized ||
    katakana !== phrase.katakana ||
    japanese !== phrase.japanese ||
    explanation !== phrase.explanation
  );

  const handleSave = () => {
    onSave({ devanagari, romanized, katakana, japanese, explanation });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl">
          #{phrase.id} · {phrase.category}
        </h2>
        <div className="flex gap-2">
          {isOverridden && (
            <button onClick={onReset} className="btn-ghost text-xs">
              Revert
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="btn-primary"
          >
            {dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Devanagari" value={devanagari} onChange={setDevanagari} mono="devanagari" />
        <Field label="Romanized" value={romanized} onChange={setRomanized} mono />
        <Field label="Katakana" value={katakana} onChange={setKatakana} />
        <Field label="Japanese" value={japanese} onChange={setJapanese} />
      </div>
      <Field label="Explanation" value={explanation} onChange={setExplanation} textarea />

      <div className="card p-4 bg-paper-50">
        <h3 className="label mb-3">Preview</h3>
        <ExplanationPanel phrase={{ devanagari, romanized, katakana, japanese, explanation }} />
      </div>

      {isApiKeyConfigured() && <LLMSuggestionPanel phrase={phrase} />}
    </div>
  );
}

function Field({ label, value, onChange, textarea, mono }) {
  return (
    <div>
      <div className="label mb-1">{label}</div>
      {textarea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="textarea"
          rows={12}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`input ${mono === 'devanagari' ? 'font-devanagari' : mono ? 'font-mono' : ''}`}
        />
      )}
    </div>
  );
}

function LLMSuggestionPanel({ phrase }) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResponse('');
    try {
      const text = await suggestPhraseImprovement(phrase, question);
      setResponse(text);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    'Does this phrase sound natural in Delhi?',
    'Give me a more casual version',
    'Give me a more formal version',
    'Any similar expressions that are easy to confuse?',
    'When should I use this vs. alternatives?',
  ];

  return (
    <div className="card p-4 space-y-3 border-l-4 border-l-saffron-500">
      <h3 className="font-display text-lg flex items-center gap-2">
        🤖 Ask Gemini
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => setQuestion(p)}
            className="text-xs px-2 py-1 bg-paper-100 hover:bg-paper-200 rounded border border-paper-200"
          >
            {p}
          </button>
        ))}
      </div>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask Gemini a question or request a suggestion about this phrase..."
        className="textarea min-h-[5rem]"
        rows={3}
      />
      <button onClick={ask} disabled={loading || !question.trim()} className="btn-accent">
        {loading ? '🤔 Thinking...' : 'Ask'}
      </button>
      {error && <div className="text-sm text-red-600">Error: {error}</div>}
      {response && (
        <div className="bg-paper-50 border border-paper-200 rounded-md p-3 text-sm whitespace-pre-wrap leading-relaxed">
          {response}
        </div>
      )}
    </div>
  );
}
