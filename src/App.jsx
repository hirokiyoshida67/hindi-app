import { useState } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import FlashcardScreen from './screens/FlashcardScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import VocabScreen from './screens/VocabScreen.jsx';
import EditorScreen from './screens/EditorScreen.jsx';
import HistoryScreen from './screens/HistoryScreen.jsx';
import TriviaScreen from './screens/TriviaScreen.jsx';

export default function App() {
  const [screen, setScreen] = useState('home');
  // screen states: 'home' | 'flashcard-j2h' | 'flashcard-h2j' | 'quiz' | 'vocab' | 'editor' | 'history'

  const goHome = () => setScreen('home');

  return (
    <div className="min-h-screen text-ink-900">
      <Header screen={screen} goHome={goHome} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
        {screen === 'flashcard-j2h' && <FlashcardScreen direction="j2h" onExit={goHome} />}
        {screen === 'flashcard-h2j' && <FlashcardScreen direction="h2j" onExit={goHome} />}
        {screen === 'quiz' && <QuizScreen onExit={goHome} />}
        {screen === 'vocab' && <VocabScreen onExit={goHome} />}
        {screen === 'editor' && <EditorScreen onExit={goHome} />}
        {screen === 'trivia' && <TriviaScreen onExit={goHome} />}
        {screen === 'history' && <HistoryScreen onExit={goHome} />}
      </main>
      <footer className="text-center text-xs text-ink-700/40 py-6">
        HIROKI's Hindi Learning Prototype · v0.1
      </footer>
    </div>
  );
}

function Header({ screen, goHome }) {
  return (
    <header className="border-b border-paper-200 bg-paper-50/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={goHome}
          className="flex items-baseline gap-3 hover:opacity-70 transition-opacity"
        >
          <span className="font-display text-2xl text-ink-900">हिंदी</span>
          <span className="text-xs uppercase tracking-widest text-ink-700/60">
            Learning · HIROKI
          </span>
        </button>
        {screen !== 'home' && (
          <button onClick={goHome} className="btn-ghost">
            ← Home
          </button>
        )}
      </div>
    </header>
  );
}
