// ═══════════════════════════════════════════════════════════════
// Fair Feed Algorithm with Anti-Repeat
// ═══════════════════════════════════════════════════════════════

import type { Edit, FilterState } from './types';

export function filterEdits(edits: Edit[], filters: FilterState): Edit[] {
  let filtered = [...edits];

  // Filter by tier
  if (filters.tier !== 'all') {
    filtered = filtered.filter(e => e.tier === filters.tier);
  }

  // Filter by style
  if (filters.style !== 'all') {
    filtered = filtered.filter(e => e.style === filters.style);
  }

  // Filter by search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.editorName.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export function sortEdits(edits: Edit[], sortMode: string): Edit[] {
  const sorted = [...edits];

  // Pinned items always come first
  const pinned = sorted.filter(e => e.isPinned);
  const unpinned = sorted.filter(e => !e.isPinned);

  switch (sortMode) {
    case 'newest':
      unpinned.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'popular':
      unpinned.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'random':
      // Anti-repeat: shuffle but avoid same editor back-to-back
      shuffleWithAntiRepeat(unpinned);
      break;
    default:
      unpinned.sort((a, b) => b.createdAt - a.createdAt);
  }

  return [...pinned, ...unpinned];
}

function shuffleWithAntiRepeat(edits: Edit[]): void {
  // Fisher-Yates shuffle
  for (let i = edits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [edits[i], edits[j]] = [edits[j], edits[i]];
  }

  // Anti-repeat pass: avoid same editor back-to-back
  for (let i = 1; i < edits.length; i++) {
    if (edits[i].editorId === edits[i - 1].editorId) {
      // Find next different editor and swap
      for (let j = i + 1; j < edits.length; j++) {
        if (edits[j].editorId !== edits[i - 1].editorId) {
          [edits[i], edits[j]] = [edits[j], edits[i]];
          break;
        }
      }
    }
  }
}

export function applyFeed(edits: Edit[], filters: FilterState): Edit[] {
  const filtered = filterEdits(edits, filters);
  return sortEdits(filtered, filters.sort);
}
