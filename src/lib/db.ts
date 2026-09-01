import Dexie, { type Table } from 'dexie';

export interface Column {
  id: string;
  title: string;
  order: number;
  createdAt: number; // unix ms
}

export interface Card {
  id: string;
  title: string;
  description: string;
  assignee: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string | null; // ISO 8601 date string
  columnId: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export class KanbanDB extends Dexie {
  columns!: Table<Column, string>;
  cards!: Table<Card, string>;

  constructor() {
    super('KanbanBoardDB');
    this.version(1).stores({
      columns: 'id, order',
      cards: 'id, columnId, order, assignee, priority',
    });
  }
}

export const db = new KanbanDB();
