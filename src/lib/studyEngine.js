// Study engine: determines which items to show based on selected mode
import {
  getAttempts,
  getStatsForItems,
  getItemsAttemptedOn,
  yesterdayDateString,
} from './storage.js';

// Modes:
//   'sequential' : Original order (1, 2, 3, ...)
//   'yesterday'  : Only items attempted yesterday
//   'worst'      : Lowest accuracy first; never-attempted items at the end
//   'random'     : Shuffled
//   'incorrect-only' : Only items with at least one incorrect attempt

export const STUDY_MODES = {
  sequential: 'In order (1, 2, 3, ...)',
  yesterday: 'Only items attempted yesterday',
  worst: 'Worst accuracy first',
  'incorrect-only': 'Only items I got wrong at least once',
  random: 'Random',
};

export function selectItems(items, mode, itemType) {
  switch (mode) {
    case 'sequential':
      return items;
    case 'yesterday': {
      const yIds = getItemsAttemptedOn(yesterdayDateString(), itemType);
      return items.filter(it => yIds.includes(it.id));
    }
    case 'worst': {
      const stats = getStatsForItems(items, itemType);
      // Sort: items with incorrect attempts first, lowest accuracy first.
      // Items never attempted go last.
      return [...items].sort((a, b) => {
        const sa = stats[a.id];
        const sb = stats[b.id];
        // Never attempted = bottom
        if (sa.total === 0 && sb.total === 0) return 0;
        if (sa.total === 0) return 1;
        if (sb.total === 0) return -1;
        // Sort by accuracy ascending (worst first)
        const accDiff = sa.accuracy - sb.accuracy;
        if (Math.abs(accDiff) > 0.001) return accDiff;
        // Tiebreak: more incorrect first
        return sb.incorrect - sa.incorrect;
      });
    }
    case 'incorrect-only': {
      const stats = getStatsForItems(items, itemType);
      return items.filter(it => (stats[it.id]?.incorrect || 0) > 0);
    }
    case 'random':
      return [...items].sort(() => Math.random() - 0.5);
    default:
      return items;
  }
}

// Get aggregate stats summary
export function getOverallStats(itemType) {
  const attempts = getAttempts().filter(a => a.itemType === itemType);
  const total = attempts.length;
  const correct = attempts.filter(a => a.correct).length;

  // Per-date counts
  const byDate = {};
  for (const a of attempts) {
    byDate[a.date] = (byDate[a.date] || 0) + 1;
  }

  return {
    total,
    correct,
    incorrect: total - correct,
    accuracy: total > 0 ? correct / total : 0,
    byDate,
    uniqueItemsAttempted: new Set(attempts.map(a => a.itemId)).size,
  };
}
