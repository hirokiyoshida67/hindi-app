import { useState, useMemo } from 'react';
import {
  getTrivia,
  addTrivia,
  updateTrivia,
  deleteTrivia,
  recordAttempt,
} from '../lib/storage.js';
import { selectItems, STUDY_MODES } from '../lib/studyEngine.js';
import TriviaEditor from '../components/TriviaEditor.jsx';
import { ProgressBar, EmptyState, DoneState } from './FlashcardScreen.jsx';

export default function TriviaScreen({ onExit }) {
  const [version, setVersion] = useState(0);
  const trivia = useMemo(() => getTrivia(), [version]);

  // Default landing: jump into the quiz if there are questions; otherwise show
  // the manage view so the user can add some first.
  const initialTrivia = useMemo(() => getTrivia(), []);
  const [mode, setMode] = useState(initialTrivia.length > 0 ? 'play' : 'manage');
  const [editing, setEditing] = useState(null); // null | 'new' | item

  const bump = () => setVersion((v) => v + 1);

  if (mode === 'play') {
    return (
      <PlayMode
        trivia={trivia}
        onExit={onExit}
        onManage={() => setMode('manage')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-3xl">☕ Coffee Break</h2>
          <p className="text-sm text-ink-700/60">India Trivia · {trivia.length} question{trivia.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex gap-2">
          {trivia.length > 0 && (
            <button onClick={() => setMode('play')} className="btn-primary">
              ← Back to quiz
            </button>
          )}
          <button onClick={() => setEditing('new')} className="btn-accent">
            + Add trivia
          </button>
        </div>
      </div>

      {editing && (
        <TriviaEditor
          initial={editing === 'new' ? null : editing}
          onSave={(fields) => {
            if (editing === 'new') addTrivia(fields);
            else updateTrivia(editing.id, fields);
            setEditing(null);
            bump();
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {trivia.length === 0 && !editing ? (
        <div className="card p-8 text-center space-y-3">
          <div className="text-4xl">☕</div>
          <div className="font-display text-xl">No trivia yet</div>
          <div className="text-sm text-ink-700/60">
            Click "+ Add trivia" to create your first question
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {trivia.map((t, i) => (
            <TriviaListItem
              key={t.id}
              index={i}
              trivia={t}
              onEdit={() => setEditing(t)}
              onDelete={() => {
                if (confirm(`Delete this trivia?\n\n"${t.question.slice(0, 60)}${t.question.length > 60 ? '...' : ''}"`)) {
                  deleteTrivia(t.id);
                  bump();
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TriviaListItem({ index, trivia, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-ink-700/60 w-6 pt-0.5">{index + 1}.</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm flex items-center gap-2">
            {trivia.image && <span title="Includes image">🖼️</span>}
            <span>{trivia.question}</span>
          </div>
          {expanded && (
            <div className="mt-2 space-y-1 text-xs">
              {trivia.image && (
                <img
                  src={trivia.image}
                  alt=""
                  className="max-h-32 rounded border border-paper-200 mb-2"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              {trivia.choices.map((c, i) => (
                <div
                  key={i}
                  className={i === trivia.correctIndex ? 'text-emerald-700 font-medium' : 'text-ink-700/60'}
                >
                  {String.fromCharCode(65 + i)}. {c} {i === trivia.correctIndex && '✓'}
                </div>
              ))}
              {trivia.explanation && (
                <div className="mt-2 pt-2 border-t border-paper-200 text-ink-700/70">
                  {trivia.explanation}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 items-end">
          <button onClick={() => setExpanded((e) => !e)} className="btn-ghost text-xs">
            {expanded ? 'Hide' : 'Show'}
          </button>
          <button onClick={onEdit} className="btn-ghost text-xs">
            Edit
          </button>
          <button onClick={onDelete} className="btn-ghost text-xs text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayMode({ trivia, onExit, onManage }) {
  const [studyMode, setStudyMode] = useState('sequential');
  const [started, setStarted] = useState(false);

  const items = useMemo(() => {
    if (!started) return [];
    return selectItems(trivia, studyMode, 'trivia');
  }, [trivia, studyMode, started]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [recorded, setRecorded] = useState(false);

  const current = items[index];

  if (!started) {
    return (
      <div className="card p-6 max-w-xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl">☕ Coffee Break · Trivia Quiz</h2>
          <button onClick={onManage} className="btn-ghost text-xs">
            📋 Manage questions
          </button>
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
        <div className="flex gap-2">
          <button onClick={onExit} className="btn-secondary">
            ← Home
          </button>
          <button onClick={() => setStarted(true)} className="btn-primary flex-1">
            Start
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="No matching trivia"
        hint="Try a different order setting"
        onBack={() => setStarted(false)}
      />
    );
  }

  if (index >= items.length) {
    return (
      <DoneState
        count={items.length}
        onRestart={() => {
          setIndex(0);
          setSelected(null);
          setRecorded(false);
        }}
        onChangeSettings={() => {
          setStarted(false);
          setIndex(0);
          setSelected(null);
          setRecorded(false);
        }}
        onExit={onExit}
      />
    );
  }

  const showResult = selected !== null;
  const handleSelect = (i) => {
    if (showResult) return;
    setSelected(i);
    const correct = i === current.correctIndex;
    if (!recorded) {
      recordAttempt({
        itemId: current.id,
        itemType: 'trivia',
        mode: 'quiz',
        direction: 'n/a',
        correct,
      });
      setRecorded(true);
    }
  };

  const next = () => {
    setSelected(null);
    setRecorded(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ProgressBar index={index} total={items.length} />

      <div className="card p-6">
        <div className="label mb-3">Question {index + 1}</div>
        {current.image && (
          <div className="mb-4 flex justify-center">
            <img
              src={current.image}
              alt=""
              className="max-h-64 rounded border border-paper-200"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="text-xl mb-6 min-h-[3rem]">{current.question}</div>

        <div className="space-y-2 mb-4">
          {current.choices.map((opt, i) => {
            const isCorrect = i === current.correctIndex;
            const isSelected = i === selected;
            let cls = 'w-full text-left p-3 rounded-md border transition-colors text-sm';
            if (showResult) {
              if (isCorrect) cls += ' bg-emerald-50 border-emerald-400 text-emerald-900';
              else if (isSelected) cls += ' bg-red-50 border-red-400 text-red-900';
              else cls += ' bg-paper-50 border-paper-200 text-ink-700/60';
            } else {
              cls += ' bg-paper-50 border-paper-200 hover:bg-paper-100';
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={showResult}>
                <span className="mr-2 text-ink-700/60">{String.fromCharCode(65 + i)}.</span>
                {opt}
                {showResult && isCorrect && <span className="ml-2">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="ml-2">✕</span>}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="space-y-3 pt-2">
            {current.explanation && (
              <div className="bg-paper-50 rounded-md p-3 border border-paper-200 text-sm leading-relaxed">
                {current.explanation}
              </div>
            )}
            <button onClick={next} className="btn-primary w-full">
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-ink-700/60">
        <div>Question {index + 1} / {items.length}</div>
        <div className="flex gap-2">
          <button onClick={onManage} className="btn-ghost text-xs">
            📋 Manage questions
          </button>
          <button onClick={() => setStarted(false)} className="btn-ghost text-xs">
            Back to settings
          </button>
        </div>
      </div>
    </div>
  );
}
