# Hindi Learning App - Personal Edition

> A personal learning application for studying 100+ Hindi phrases and 100 vocabulary words using Flashcards, Quizzes, and Gemini-powered editing features.

## Features

| Feature | Description |
|---|---|
| **Flashcard (Japanese→Hindi)** | View Japanese and recall romanized Hindi |
| **Flashcard (Hindi→Japanese)** | View romanized Hindi and recall Japanese |
| **3-Choice Quiz** | Gemini dynamically generates confusing incorrect answers |
| **Vocabulary Flashcards** | Practice with 100 essential vocabulary words only |
| **Phrase Editor** | Edit phrases while getting Gemini suggestions |
| **History & Statistics** | Total attempts, accuracy rate, daily graphs, weak areas |
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

All records (study history, edits) are stored in **browser localStorage**:

- `hindi-app:attempts` — Study history
- `hindi-app:overrides` — Phrase edits
- `hindi-app:vocab-overrides` — Vocabulary edits

**Note**: localStorage is separate per browser. Data studied in Chrome won't appear in Safari.

### Using on Another Device

Export data as JSON from the History screen, then import it on another device.

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
│   │   ├── phrases.js        # 102 phrases
│   │   └── vocabulary.js     # 100 vocabulary words
│   ├── lib/
│   │   ├── storage.js        # localStorage wrapper
│   │   ├── gemini.js         # Gemini API client
│   │   ├── tts.js            # Web Speech API
│   │   └── studyEngine.js    # Quiz selection logic
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── FlashcardScreen.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── VocabScreen.jsx
│   │   ├── EditorScreen.jsx
│   │   └── HistoryScreen.jsx
│   └── components/
│       └── ExplanationPanel.jsx
└── README.md
```

## Customization & Extension

### Editing Phrases

- **In-app editing**: Use the "Phrase Editor" screen to edit directly (stored in localStorage). You can ask Gemini for suggestions.
- **Code-level edits**: Edit `src/data/phrases.js` directly for permanent changes.

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

- v0.1 — Initial prototype. 102 phrases + 100 vocabulary words
- Data source: `hindi_phrases_v3.md`

## Future Enhancement Ideas

- [ ] Spaced repetition scheduler (Anki-like)
- [ ] Recording mode (compare your pronunciation)
- [ ] Text-to-image (generate relevant images for phrases)
- [ ] Group learning (share scores with teammates)
- [ ] Mobile PWA support
