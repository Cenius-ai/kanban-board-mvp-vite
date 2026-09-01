import { v4 as uuid } from 'uuid';
import type { Column, Card } from './db';

const now = Date.now();

export function generateSeedData(): { columns: Column[]; cards: Card[] } {
  const col1Id = uuid();
  const col2Id = uuid();
  const col3Id = uuid();

  const columns: Column[] = [
    { id: col1Id, title: 'To Do', order: 0, createdAt: now },
    { id: col2Id, title: 'In Progress', order: 1, createdAt: now },
    { id: col3Id, title: 'Done', order: 2, createdAt: now },
  ];

  const cards: Card[] = [
    {
      id: uuid(), title: 'Set up project infrastructure',
      description: 'Initialize the repository, configure Vite, TypeScript, Tailwind, and establish the component architecture.',
      assignee: 'Alex',
      tags: ['setup', 'devops'],
      priority: 'high',
      dueDate: '2025-06-20',
      columnId: col3Id,
      order: 0,
      createdAt: now - 86400000 * 5,
      updatedAt: now - 86400000 * 2,
    },
    {
      id: uuid(), title: 'Design database schema',
      description: 'Define the IndexedDB schema using Dexie.js for columns, cards, and any future entities.',
      assignee: 'Jordan',
      tags: ['design', 'data'],
      priority: 'high',
      dueDate: '2025-06-18',
      columnId: col3Id,
      order: 1,
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000 * 1,
    },
    {
      id: uuid(), title: 'Implement drag-and-drop',
      description: 'Integrate dnd-kit for card dragging between columns and reordering within columns. Ensure touch support.',
      assignee: 'Alex',
      tags: ['feature', 'ux'],
      priority: 'critical',
      dueDate: '2025-06-22',
      columnId: col2Id,
      order: 0,
      createdAt: now - 86400000 * 3,
      updatedAt: now - 86400000 * 1,
    },
    {
      id: uuid(), title: 'Build filter bar component',
      description: 'Create a global filter bar with text search, assignee dropdown, and tag selector. Persist filters in URL params.',
      assignee: 'Sam',
      tags: ['feature', 'ux'],
      priority: 'medium',
      dueDate: '2025-06-25',
      columnId: col2Id,
      order: 1,
      createdAt: now - 86400000 * 2,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Write unit tests for store',
      description: 'Cover Zustand store actions with unit tests: CRUD, move, reorder, and filter selectors.',
      assignee: 'Jordan',
      tags: ['testing'],
      priority: 'medium',
      dueDate: '2025-06-28',
      columnId: col1Id,
      order: 0,
      createdAt: now - 86400000 * 2,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Add list/table view',
      description: 'Build a sortable table view as an alternative to the board. Columns: title, assignee, priority, due date, status.',
      assignee: 'Sam',
      tags: ['feature'],
      priority: 'medium',
      dueDate: '2025-06-27',
      columnId: col1Id,
      order: 1,
      createdAt: now - 86400000,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Responsive polish',
      description: 'Test and refine layout on viewports from 320px to 2560px. Ensure mobile columns stack vertically, touch drag works.',
      assignee: 'Alex',
      tags: ['ux', 'polish'],
      priority: 'low',
      dueDate: '2025-07-02',
      columnId: col1Id,
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Accessibility audit',
      description: 'Add ARIA labels, focus management for drag-and-drop, keyboard navigation, and screen-reader announcements.',
      assignee: 'Taylor',
      tags: ['a11y', 'polish'],
      priority: 'high',
      dueDate: '2025-07-01',
      columnId: col1Id,
      order: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Deploy to Vercel',
      description: 'Configure Vercel deployment with SPA fallback. Set up custom domain and verify all routes work.',
      assignee: 'Alex',
      tags: ['devops', 'deploy'],
      priority: 'low',
      dueDate: '2025-07-05',
      columnId: col1Id,
      order: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuid(), title: 'Write README and docs',
      description: 'Document architecture, setup instructions, demo accounts, and development guidelines.',
      assignee: 'Taylor',
      tags: ['docs'],
      priority: 'low',
      dueDate: '2025-07-04',
      columnId: col1Id,
      order: 5,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return { columns, cards };
}
