import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { db } from './db';
import type { Column, Card } from './db';
import { generateSeedData } from './seed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface CardInput {
  title: string;
  description: string;
  assignee: string;
  tags: string[];
  priority: Priority;
  dueDate: string | null;
  columnId: string;
}

export interface KanbanState {
  columns: Column[];
  cards: Card[];
  loading: boolean;
  error: string | null;

  initialize: () => Promise<void>;

  createColumn: (title: string) => Promise<void>;
  updateColumn: (id: string, title: string) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;

  createCard: (input: CardInput) => Promise<void>;
  updateCard: (id: string, updates: Partial<CardInput>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;

  moveCard: (cardId: string, toColumnId: string, toOrder: number) => Promise<void>;
  reorderColumn: (columnId: string, cardIds: string[]) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  columns: [],
  cards: [],
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const colCount = await db.columns.count();
      if (colCount === 0) {
        const seed = generateSeedData();
        await db.columns.bulkAdd(seed.columns);
        await db.cards.bulkAdd(seed.cards);
      }
      const columns = await db.columns.orderBy('order').toArray();
      const cards = await db.cards.orderBy('order').toArray();
      set({ columns, cards, loading: false, error: null });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  createColumn: async (title: string) => {
    const { columns } = get();
    const maxOrder = columns.reduce((m, c) => Math.max(m, c.order), -1);
    const col: Column = {
      id: uuid(),
      title,
      order: maxOrder + 1,
      createdAt: Date.now(),
    };
    await db.columns.add(col);
    set((s) => ({ columns: [...s.columns, col].sort((a, b) => a.order - b.order) }));
  },

  updateColumn: async (id: string, title: string) => {
    await db.columns.update(id, { title });
    set((s) => ({
      columns: s.columns.map((c) => (c.id === id ? { ...c, title } : c)),
    }));
  },

  deleteColumn: async (id: string) => {
    await db.columns.delete(id);
    await db.cards.where({ columnId: id }).delete();
    set((s) => ({
      columns: s.columns.filter((c) => c.id !== id),
      cards: s.cards.filter((c) => c.columnId !== id),
    }));
  },

  createCard: async (input: CardInput) => {
    const { cards } = get();
    const colCards = cards.filter((c) => c.columnId === input.columnId);
    const maxOrder = colCards.reduce((m, c) => Math.max(m, c.order), -1);
    const now = Date.now();
    const card: Card = {
      id: uuid(),
      title: input.title,
      description: input.description,
      assignee: input.assignee,
      tags: input.tags,
      priority: input.priority,
      dueDate: input.dueDate,
      columnId: input.columnId,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    await db.cards.add(card);
    set((s) => ({ cards: [...s.cards, card] }));
  },

  updateCard: async (id: string, updates: Partial<CardInput>) => {
    const now = Date.now();
    const patch = { ...updates, updatedAt: now } as Partial<Card>;
    await db.cards.update(id, patch);
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  },

  deleteCard: async (id: string) => {
    await db.cards.delete(id);
    set((s) => ({ cards: s.cards.filter((c) => c.id !== id) }));
  },

  moveCard: async (cardId: string, toColumnId: string, toOrder: number) => {
    const { cards } = get();
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const oldColumnId = card.columnId;

    // Update the moved card
    await db.cards.update(cardId, { columnId: toColumnId, order: toOrder, updatedAt: Date.now() });

    // Reorder cards in the target column
    const targetCards = cards
      .filter((c) => c.columnId === toColumnId && c.id !== cardId)
      .sort((a, b) => a.order - b.order);

    const allTarget = [
      ...targetCards.map((c, i) => ({ id: c.id, order: i < toOrder ? i : i + 1 })),
    ];
    // The moved card takes position toOrder; push others up
    const reordered = allTarget.map((c) => c.order);
    const final: { id: string; order: number }[] = [];
    let offset = 0;
    for (let i = 0; i < targetCards.length + 1; i++) {
      if (i === toOrder) {
        // This is where the moved card goes (but we handle it separately)
        offset = 1;
      }
      if (i - offset >= 0 && i - offset < targetCards.length) {
        final.push({ id: targetCards[i - offset].id, order: i + (i >= toOrder ? 0 : 0) });
      }
    }

    // Simpler approach: renumber all target column cards
    const targetColCards = cards
      .filter((c) => c.columnId === toColumnId && c.id !== cardId)
      .sort((a, b) => a.order - b.order);

    let idx = 0;
    for (const tc of targetColCards) {
      const newOrder = idx >= toOrder ? idx + 1 : idx;
      if (tc.order !== newOrder) {
        await db.cards.update(tc.id, { order: newOrder });
      }
      idx++;
    }

    // Reorder source column if different
    if (oldColumnId !== toColumnId) {
      const sourceCards = cards
        .filter((c) => c.columnId === oldColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);
      for (let i = 0; i < sourceCards.length; i++) {
        if (sourceCards[i].order !== i) {
          await db.cards.update(sourceCards[i].id, { order: i });
        }
      }
    }

    // Reload all cards
    const freshCards = await db.cards.orderBy('order').toArray();
    set({ cards: freshCards });
  },

  reorderColumn: async (columnId: string, cardIds: string[]) => {
    for (let i = 0; i < cardIds.length; i++) {
      await db.cards.update(cardIds[i], { order: i, updatedAt: Date.now() });
    }
    const freshCards = await db.cards.orderBy('order').toArray();
    set({ cards: freshCards });
  },
}));
