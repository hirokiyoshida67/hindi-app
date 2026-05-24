import { useState } from 'react';

const MIN_CHOICES = 2;
const MAX_CHOICES = 6;

export default function TriviaEditor({ initial, onSave, onCancel }) {
  const [question, setQuestion] = useState(initial?.question ?? '');
  const [choices, setChoices] = useState(
    initial?.choices ?? ['', '', '', '']
  );
  const [correctIndex, setCorrectIndex] = useState(
    initial?.correctIndex ?? 0
  );
  const [explanation, setExplanation] = useState(initial?.explanation ?? '');
  const [image, setImage] = useState(initial?.image ?? '');

  const setChoice = (i, val) => {
    const next = [...choices];
    next[i] = val;
    setChoices(next);
  };

  const addChoice = () => {
    if (choices.length >= MAX_CHOICES) return;
    setChoices([...choices, '']);
  };

  const removeChoice = (i) => {
    if (choices.length <= MIN_CHOICES) return;
    const next = choices.filter((_, idx) => idx !== i);
    setChoices(next);
    if (correctIndex === i) setCorrectIndex(0);
    else if (correctIndex > i) setCorrectIndex(correctIndex - 1);
  };

  const filledChoices = choices.filter((c) => c.trim().length > 0).length;
  const correctIsFilled = (choices[correctIndex] || '').trim().length > 0;
  const canSave =
    question.trim().length > 0 &&
    filledChoices === choices.length &&
    filledChoices >= MIN_CHOICES &&
    correctIsFilled;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      question: question.trim(),
      choices: choices.map((c) => c.trim()),
      correctIndex,
      explanation: explanation.trim(),
      image: image.trim(),
    });
  };

  return (
    <div className="card p-5 space-y-4 border-l-4 border-l-saffron-500 animate-fade-in">
      <h3 className="font-display text-xl">
        {initial ? 'Edit trivia' : 'Add trivia'}
      </h3>

      <div>
        <div className="label mb-1">Question</div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What is the official currency of India?"
          className="textarea"
          rows={2}
        />
      </div>

      <div>
        <div className="label mb-1">Image URL (optional)</div>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="e.g., /Tamilnadu.png  or  https://..."
          className="input"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Preview"
              className="max-h-40 rounded border border-paper-200"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      <div>
        <div className="label mb-2">Choices (mark the correct one)</div>
        <div className="space-y-2">
          {choices.map((c, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                  className="accent-saffron-500"
                />
                <span className="text-xs text-ink-700/60 w-5">{letter}.</span>
                <input
                  type="text"
                  value={c}
                  onChange={(e) => setChoice(i, e.target.value)}
                  placeholder={`Choice ${letter}`}
                  className="input flex-1"
                />
                {choices.length > MIN_CHOICES && (
                  <button
                    onClick={() => removeChoice(i)}
                    type="button"
                    className="btn-ghost text-xs text-red-600"
                    title="Remove this choice"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {choices.length < MAX_CHOICES && (
          <button
            onClick={addChoice}
            type="button"
            className="btn-ghost text-xs mt-2"
          >
            + Add choice
          </button>
        )}
      </div>

      <div>
        <div className="label mb-1">Explanation (optional)</div>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Brief context shown after answering"
          className="textarea"
          rows={2}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} disabled={!canSave} className="btn-primary flex-1">
          {initial ? 'Save changes' : 'Add'}
        </button>
      </div>
    </div>
  );
}
