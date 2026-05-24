import { speakHindi, isTTSAvailable } from '../lib/tts.js';
import { useState } from 'react';

// Renders the rich markdown-like explanation from phrase.explanation
// Also provides a play button for Hindi audio
export default function ExplanationPanel({ phrase }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);

  const handlePlay = async () => {
    if (!isTTSAvailable()) {
      setError('Speech synthesis is not supported in this browser');
      return;
    }
    setError(null);
    setPlaying(true);
    try {
      // Use Devanagari for accurate pronunciation
      await speakHindi(phrase.devanagari);
    } catch (e) {
      setError('Playback error: ' + (e.message || e));
    } finally {
      setPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-50 rounded-md p-4 border border-paper-200">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="label mb-1">Hindi (Devanagari)</div>
            <div className="font-devanagari text-xl">{phrase.devanagari}</div>
          </div>
          <button
            onClick={handlePlay}
            disabled={playing}
            className="btn-secondary text-xs whitespace-nowrap"
            title="Play Hindi pronunciation"
          >
            {playing ? '♪ Playing...' : '🔊 Play pronunciation'}
          </button>
        </div>
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}

        <div className="mt-3">
          <div className="label mb-1">Romanized</div>
          <div className="font-mono text-base">{phrase.romanized}</div>
        </div>

        {phrase.katakana && (
          <div className="mt-3">
            <div className="label mb-1">Katakana (approx.)</div>
            <div className="text-sm">{phrase.katakana}</div>
          </div>
        )}

        <div className="mt-3">
          <div className="label mb-1">Japanese</div>
          <div className="text-base">{phrase.japanese}</div>
        </div>
      </div>

      {phrase.explanation && (
        <details open className="bg-paper-50 rounded-md p-4 border border-paper-200">
          <summary className="cursor-pointer label">
            Pronunciation, grammar & notes
          </summary>
          <div className="mt-3 prose-sm text-sm leading-relaxed whitespace-pre-wrap text-ink-800 font-mono">
            <ExplanationBody text={phrase.explanation} />
          </div>
        </details>
      )}
    </div>
  );
}

// Light renderer for markdown-ish content - handles bullets, bold, code
function ExplanationBody({ text }) {
  // Parse light markdown without external lib
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold via **text**, code via `text`
        const formatted = formatLine(line);
        return <div key={i}>{formatted}</div>;
      })}
    </div>
  );
}

function formatLine(line) {
  // Split by ** and ` markers
  // Simple approach: tokenize
  const tokens = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**');
    const codeStart = remaining.indexOf('`');
    const next = [boldStart, codeStart].filter(i => i >= 0);
    if (next.length === 0) {
      tokens.push(<span key={key++}>{remaining}</span>);
      break;
    }
    const idx = Math.min(...next);
    if (idx > 0) {
      tokens.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }
    if (remaining[idx] === '*') {
      // Bold **text**
      const endIdx = remaining.indexOf('**', idx + 2);
      if (endIdx > 0) {
        tokens.push(<strong key={key++}>{remaining.slice(idx + 2, endIdx)}</strong>);
        remaining = remaining.slice(endIdx + 2);
      } else {
        tokens.push(<span key={key++}>{remaining.slice(idx)}</span>);
        break;
      }
    } else {
      // Code `text`
      const endIdx = remaining.indexOf('`', idx + 1);
      if (endIdx > 0) {
        tokens.push(
          <code key={key++} className="bg-paper-200/50 px-1 rounded text-xs">
            {remaining.slice(idx + 1, endIdx)}
          </code>
        );
        remaining = remaining.slice(endIdx + 1);
      } else {
        tokens.push(<span key={key++}>{remaining.slice(idx)}</span>);
        break;
      }
    }
  }

  return tokens;
}
