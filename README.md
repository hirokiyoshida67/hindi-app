# Hindi Learning App - Personal Edition

> A personal learning application for studying 100+ Hindi phrases and 100 vocabulary words using Flashcards, Quizzes, and Gemini-powered editing features.

## Features

| Feature | Description |
|---|---|
| **Typing Quiz (Japanese→Hindi)** | Type the romanized Hindi answer. Auto-judged at 90% similarity (case- and diacritic-insensitive) |
| **Flashcards (Hindi→Japanese)** | View romanized Hindi and recall the Japanese meaning |
| **Multiple Choice Quiz** | Pick the correct Hindi from 3 options. Gemini dynamically generates confusing incorrect answers |
| **Vocabulary Flashcards** | Practice with 100 essential vocabulary words (100% match required for typing, optional for recall) |
| **☕ Coffee Break (India Trivia)** | Learn interesting facts about India. Add, edit, and manage your own trivia questions with multiple-choice answers and explanations |
| **Phrase Editor** | Edit phrases and ask Gemini for suggestions to improve or contextualize content |
| **History & Statistics** | Track total attempts, accuracy rate, daily activity graphs, and identify weak areas |
| **Quiz Modes** | Sequential / Yesterday's problems / Lowest accuracy / Mistakes only / Random |
| **Pronunciation Audio** | Hindi pronunciation via Web Speech API (free, browser-native) |

## Setup

### 1. Requirements

- **Node.js** (v18 or higher)
- **npm** (bundled with Node.js)
- **Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/app/apikey))
- Modern browser (Chrome / Edge / Safari recommended for Hindi speech synthesis)

### 2. Project Setup and Install Dependencies

```bash
# Navigate to the project folder
cd hindi-app

# Install dependencies
npm install
```

### 3. Configure Gemini API Key

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and paste your API key
# VITE_GEMINI_API_KEY=your_actual_key_here
```

Open `.env` in VS Code and replace the placeholder with your actual API key.

### 4. Start Development Server

```bash
npm run dev
```

Your browser will automatically open `http://localhost:5173`.

### 5. Production Build (Optional)

```bash
npm run build      # Static files generated in dist/
npm run preview    # Preview the production build locally
```

## Data Storage

All records (study history, edits, and trivia questions) are stored in **browser localStorage**:

- `hindi-app:attempts` — Study history and statistics
- `hindi-app:overrides` — Phrase edits
- `hindi-app:vocab-overrides` — Vocabulary edits
- `hindi-app:trivia` — Custom trivia questions and attempts

**Note**: localStorage is separate per browser. Data studied in Chrome won't appear in Safari.

### Using on Another Device

Export data as JSON from the History screen, then import it on another device. (Trivia is included in the export/import).

## Project Structure

```
hindi-app/
├── .env.example              # API key template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main component (screen routing)
│   ├── index.css             # Tailwind + global styles
│   ├── data/
│   │   ├── phrases.js        # 102 Hindi phrases
│   │   ├── vocabulary.js     # 100 vocabulary words
│   │   └── indiaTrivia.js    # Seed trivia questions
│   ├── lib/
│   │   ├── storage.js        # localStorage wrapper (phrases, vocab, trivia, history)
│   │   ├── gemini.js         # Gemini API client
│   │   ├── tts.js            # Web Speech API for pronunciation
│   │   ├── similarity.js     # String similarity matching for typing quiz
│   │   └── studyEngine.js    # Quiz selection logic and statistics
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── FlashcardScreen.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── VocabScreen.jsx
│   │   ├── TriviaScreen.jsx  # India Trivia quiz and management
│   │   ├── EditorScreen.jsx
│   │   └── HistoryScreen.jsx
│   └── components/
│       ├── ExplanationPanel.jsx
│       ├── CachePanel.jsx    # Gemini response cache manager
│       └── TriviaEditor.jsx  # Trivia question editor
└── README.md
```

## Customization & Extension

### India Trivia (Coffee Break)

The trivia feature is designed for casual learning breaks with interesting facts about India. 

**Adding custom trivia:**
1. Navigate to the Coffee Break screen
2. Click "+ Add trivia"
3. Fill in:
   - **Question**: Your trivia question
   - **Choices**: 3-5 multiple choice options
   - **Correct Index**: The index (0-based) of the correct answer
   - **Explanation**: Context or fun fact about the answer
4. Save and quiz yourself

Trivia data is stored in localStorage and persists across sessions. Default questions are seeded from `src/data/indiaTrivia.js`.

### Editing Phrases

- **In-app editing**: Use the "Phrase Editor" screen to edit directly (stored in localStorage). You can ask Gemini for suggestions.
- **Code-level edits**: Edit `src/data/phrases.js` directly for permanent changes.

**Note on typing quiz accuracy**: The typing quiz uses similarity matching at 90% threshold, so minor typos and case differences are forgiven. This makes it more forgiving than vocabulary flashcards which require 100% match.

### Adding New Vocabulary

Add entries to the array in `src/data/vocabulary.js`:

```js
{
  id: 'v101',
  romanized: 'new_word',
  devanagari: 'नया शब्द',
  japanese: 'new word',
  notes: 'Additional notes',
  category: 'Category Name'
}
```

### Improving Pronunciation Audio

Currently using Web Speech API (browser-native). For higher quality:

1. **Google Cloud TTS** — Replace `src/lib/tts.js` with Cloud TTS API calls
2. **ElevenLabs** — Similar replacement with voice selection
3. **Pre-recorded audio** — Add `public/audio/{id}.mp3` files and use `<audio>` element

## Troubleshooting

### Hindi Audio Not Playing

- Your browser may not have Hindi (hi-IN) voice installed.
- **Windows**: Settings → Time & Language → Language & region → Download Hindi voice
- **macOS**: System Settings → Accessibility → Spoken Content → System Voice → Customize → Download Hindi
- Chrome-based browsers use Google's cloud voices, so audio should work reliably.

### Gemini API Error

- Verify `VITE_GEMINI_API_KEY` in `.env` is correct
- Stop dev server (`Ctrl+C`) and restart (`npm run dev`) — changes to `.env` require restart
- Confirm API key is valid at [aistudio.google.com](https://aistudio.google.com/app/apikey)

### "No Questions Available"

This appears when selecting "Yesterday's problems only" or "Mistakes only" with no matching data. Switch to "Sequential" quiz mode.

## Version

- v0.2 — Added India Trivia (Coffee Break), improved phrase editor, refined typing quiz similarity matching
- v0.1 — Initial prototype. 102 phrases + 100 vocabulary words
- Data source: `hindi_phrases_v3.md`

## Future Enhancement Ideas

- [ ] Spaced repetition scheduler (Anki-like)
- [ ] Recording mode (compare your pronunciation with native speaker)
- [ ] Text-to-image (generate relevant images for phrases)
- [ ] Group learning (share scores with teammates)
- [ ] Mobile PWA support
- [ ] Gemini-powered trivia generation (auto-create India facts)
