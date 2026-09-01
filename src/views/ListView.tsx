import { useState, useMemo } from 'react';
import { useKanbanStore } from '../lib/store';
import { FilterBar } from '../components/FilterBar';
import { TaskForm } from '../components/TaskForm';
import { useFilteredTasks, useUniqueAssignees, useUniqueTags } from '../hooks/useFilteredTasks';
import type { Card, Column } from '../lib/db';
import type { CardInput } from '../lib/store';

type SortKey = 'title' | 'assignee' | 'priority' | 'dueDate' | 'column';

const priorityRank: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function ListView() {
  const { columns, cards, createCard, updateCard, deleteCard } = useKanbanStore();
  const filtered = useFilteredTasks(cards);
  const assignees = useUniqueAssignees(cards);
  const tags = useUniqueTags(cards);

  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [formOpen, setFormOpen] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);

  const columnMap = useMemo(() => {
    const m = new Map<string, Column>();
    columns.forEach((c) => m.set(c.id, c));
    return m;
  }, [columns]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      switch (sortKey) {
        case 'title':
          va = a.title.toLowerCase();
          vb = b.title.toLowerCase();
          break;
        case 'assignee':
          va = a.assignee.toLowerCase();
          vb = b.assignee.toLowerCase();
          break;
        case 'priority':
          va = priorityRank[a.priority] ?? 99;
          vb = priorityRank[b.priority] ?? 99;
          break;
        case 'dueDate':
          va = a.dueDate || '9999';
          vb = b.dueDate || '9999';
          break;
        case 'column':
          va = columnMap.get(a.columnId)?.title || '';
          vb = columnMap.get(b.columnId)?.title || '';
          break;
        default:
          return 0;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir, columnMap]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortKey }) => {
    if (sortKey !== field) return <span className="text-surface-500 ml-1">↕</span>;
    return <span className="text-accent ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const thClass =
    'px-3 py-2.5 text-left text-xs font-semibold text-surface-300 uppercase tracking-wide cursor-pointer select-none hover:text-surface-100 transition-colors whitespace-nowrap';

  return (
    <div className="flex flex-col h-full">
      <FilterBar assignees={assignees} tags={tags} />

      {/* Add button */}
      <div className="px-4 py-2.5 border-b border-surface-400 flex items-center">
        <button
          onClick={() => {
            setEditCard(null);
            setFormOpen(true);
          }}
          className="px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm" role="table" aria-label="Task list">
          <thead className="sticky top-0 bg-surface-700 border-b border-surface-400">
            <tr>
              <th className={thClass} onClick={() => handleSort('title')}>
                Title <SortIcon field="title" />
              </th>
              <th className={thClass} onClick={() => handleSort('column')}>
                Status <SortIcon field="column" />
              </th>
              <th className={thClass} onClick={() => handleSort('assignee')}>
                Assignee <SortIcon field="assignee" />
              </th>
              <th className={thClass} onClick={() => handleSort('priority')}>
                Priority <SortIcon field="priority" />
              </th>
              <th className={thClass} onClick={() => handleSort('dueDate')}>
                Due Date <SortIcon field="dueDate" />
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-surface-300 uppercase tracking-wide">
                Tags
              </th>
              <th className="px-3 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-400/50">
            {sorted.map((card) => (
              <tr
                key={card.id}
                className="hover:bg-surface-600/30 transition-colors cursor-pointer"
                onClick={() => {
                  setEditCard(card);
                  setFormOpen(true);
                }}
                role="row"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditCard(card);
                    setFormOpen(true);
                  }
                }}
              >
                <td className="px-3 py-2.5">
                  <span className="font-medium text-surface-100">{card.title}</span>
                  {card.description && (
                    <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">{card.description}</p>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-xs bg-surface-600 px-2 py-0.5 rounded text-surface-300">
                    {columnMap.get(card.columnId)?.title || '—'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-surface-300">{card.assignee}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                      card.priority === 'critical'
                        ? 'bg-red-600/20 text-red-300'
                        : card.priority === 'high'
                        ? 'bg-orange-600/20 text-orange-300'
                        : card.priority === 'medium'
                        ? 'bg-yellow-600/20 text-yellow-300'
                        : 'bg-green-600/20 text-green-300'
                    }`}
                  >
                    {card.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-surface-400 text-xs">
                  {card.dueDate
                    ? new Date(card.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                    {card.tags.length > 3 && (
                      <span className="text-[10px] text-surface-500">+{card.tags.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this task?')) deleteCard(card.id);
                    }}
                    className="text-surface-400 hover:text-red-400 transition-colors text-xs"
                    aria-label={`Delete ${card.title}`}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-12 text-center text-surface-400 text-sm">
                  No tasks match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditCard(null);
        }}
        onSave={(input: CardInput) => {
          if (editCard) {
            updateCard(editCard.id, input);
          } else {
            createCard(input);
          }
        }}
        editCard={editCard}
        columns={columns.map((c) => ({ id: c.id, title: c.title }))}
      />
    </div>
  );
}
