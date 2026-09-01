import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Card } from '../lib/db';

export function useFilteredTasks(cards: Card[]) {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const assignee = searchParams.get('assignee') || '';
  const tag = searchParams.get('tag') || '';
  const priority = searchParams.get('priority') || '';

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      if (query) {
        const q = query.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(q);
        const matchesDesc = card.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (assignee && card.assignee !== assignee) return false;
      if (tag && !card.tags.includes(tag)) return false;
      if (priority && card.priority !== priority) return false;
      return true;
    });
  }, [cards, query, assignee, tag, priority]);

  return filtered;
}

export function useUniqueAssignees(cards: Card[]): string[] {
  return useMemo(() => {
    const set = new Set(cards.map((c) => c.assignee).filter(Boolean));
    return [...set].sort();
  }, [cards]);
}

export function useUniqueTags(cards: Card[]): string[] {
  return useMemo(() => {
    const set = new Set(cards.flatMap((c) => c.tags));
    return [...set].sort();
  }, [cards]);
}
