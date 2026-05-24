import { phrases as rawPhrases } from '../data/phrases.js';
import { vocabulary } from '../data/vocabulary.js';
import { getOverallStats } from '../lib/studyEngine.js';
import { isApiKeyConfigured } from '../lib/gemini.js';
import { isTTSAvailable } from '../lib/tts.js';
import { applyOverrides } from '../lib/storage.js';
import CachePanel from '../components/CachePanel.jsx';

const phrases = applyOverrides(rawPhrases);

export default function HomeScreen({ onNavigate }) {
  const phraseStats = getOverallStats('phrase');
  const vocabStats = getOverallStats('vocab');
  const apiOK = isApiKeyConfigured();
  const ttsOK = isTTSAvailable();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-6">
        <h1 className="font-display text-5xl mb-2">Hindi Learning</h1>
        <p className="text-ink-700/60 text-sm">
          {phrases.length} phrases · {vocabulary.length} words ·
          {' '}{phraseStats.total + vocabStats.total} attempts logged
        </p>
      </section>

      {/* Mode cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModeCard
          title="Typing Quiz"
          subtitle="Japanese → Hindi"
          desc="Type the romanized Hindi. Auto-judged at 90% similarity (case- and diacritic-insensitive)"
          accent="saffron"
          onClick={() => onNavigate('flashcard-j2h')}
        />
        <ModeCard
          title="Flashcards"
          subtitle="Hindi → Japanese"
          desc="See romanized Hindi and recall the Japanese meaning"
          accent="indigo"
          onClick={() => onNavigate('flashcard-h2j')}
        />
        <ModeCard
          title="Multiple Choice Quiz"
          subtitle="Japanese → Correct Hindi"
          desc="Pick the correct Hindi from 3 options. Best for beginners"
          accent="saffron"
          onClick={() => onNavigate('quiz')}
        />
        <ModeCard
          title="Vocabulary"
          subtitle={`${vocabulary.length} essential words`}
          desc="Type the Hindi (J→H, requires 100% match) or self-check (H→J)"
          accent="indigo"
          onClick={() => onNavigate('vocab')}
        />
        <ModeCard
          title="☕ Coffee Break"
          subtitle="India Trivia"
          desc="A break from grammar. Add your own trivia questions and quiz yourself"
          accent="saffron"
          onClick={() => onNavigate('trivia')}
        />
        <ModeCard
          title="Phrase Editor"
          subtitle={apiOK ? 'With Gemini suggestions' : 'API key not configured'}
          desc="Edit any phrase and ask the LLM for suggestions. Requires VITE_GEMINI_API_KEY in .env"
          accent="ink"
          onClick={() => onNavigate('editor')}
          disabled={!apiOK}
        />
        <ModeCard
          title="History & Stats"
          subtitle="Your learning record"
          desc="Daily activity, weakest items, accuracy trends, and data export"
          accent="ink"
          onClick={() => onNavigate('history')}
        />
      </section>

      {/* Quiz cache pre-generation */}
      {apiOK && (
        <section>
          <CachePanel allPhrases={phrases} />
        </section>
      )}

      {/* Status indicators */}
      <section className="text-xs text-ink-700/60 space-y-1 border-t border-paper-200 pt-4">
        <div className="flex gap-2 items-center">
          <span className={`inline-block w-2 h-2 rounded-full ${apiOK ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          Gemini API: {apiOK ? 'Configured' : 'Set VITE_GEMINI_API_KEY in .env'}
        </div>
        <div className="flex gap-2 items-center">
          <span className={`inline-block w-2 h-2 rounded-full ${ttsOK ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          Pronunciation (Web Speech API): {ttsOK ? 'Available' : 'Not supported in this browser'}
        </div>
      </section>
    </div>
  );
}

function ModeCard({ title, subtitle, desc, onClick, accent, disabled }) {
  const accentClasses = {
    saffron: 'border-l-saffron-500',
    indigo: 'border-l-indigo_dye-500',
    ink: 'border-l-ink-900',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card text-left p-5 border-l-4 ${accentClasses[accent]}
        hover:shadow-md hover:-translate-y-0.5 transition-all
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
    >
      <div className="font-display text-xl mb-0.5">{title}</div>
      <div className="text-sm text-ink-700 mb-2">{subtitle}</div>
      <div className="text-xs text-ink-700/60 leading-relaxed">{desc}</div>
    </button>
  );
}
