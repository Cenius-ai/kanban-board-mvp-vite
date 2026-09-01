import { useState, useEffect } from 'react';
import type { Card } from '../lib/db';
import type { Priority } from '../lib/store';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: {
    title: string;
    description: string;
    assignee: string;
    tags: string[];
    priority: Priority;
    dueDate: string | null;
    columnId: string;
  }) => void;
  editCard?: Card | null;
  columnId?: string;
  columns: { id: string; title: string }[];
}

export function TaskForm({ open, onClose, onSave, editCard, columnId, columns }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [colId, setColId] = useState('');

  useEffect(() => {
    if (editCard) {
      setTitle(editCard.title);
      setDescription(editCard.description);
      setAssignee(editCard.assignee);
      setTagsStr(editCard.tags.join(', '));
      setPriority(editCard.priority);
      setDueDate(editCard.dueDate || '');
      setColId(editCard.columnId);
    } else {
      setTitle('');
      setDescription('');
      setAssignee('');
      setTagsStr('');
      setPriority('medium');
      setDueDate('');
      setColId(columnId || columns[0]?.id || '');
    }
  }, [editCard, columnId, columns, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      description: description.trim(),
      assignee: assignee.trim() || 'Unassigned',
      tags,
      priority,
      dueDate: dueDate || null,
      columnId: colId,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={editCard ? 'Edit task' : 'New task'}
    >
      <div
        className="bg-surface-700 border border-surface-400 rounded-lg w-full max-w-md mx-4 p-6 shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-surface-100 mb-4">
          {editCard ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="task-title" className="block text-xs font-medium text-surface-300 mb-1">
              Title *
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors"
              placeholder="Task title"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-xs font-medium text-surface-300 mb-1">
              Description
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors resize-none"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-assignee" className="block text-xs font-medium text-surface-300 mb-1">
                Assignee
              </label>
              <input
                id="task-assignee"
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Alex"
              />
            </div>
            <div>
              <label htmlFor="task-priority" className="block text-xs font-medium text-surface-300 mb-1">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="task-tags" className="block text-xs font-medium text-surface-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              id="task-tags"
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors"
              placeholder="e.g. bug, frontend"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-due" className="block text-xs font-medium text-surface-300 mb-1">
                Due Date
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="task-column" className="block text-xs font-medium text-surface-300 mb-1">
                Column
              </label>
              <select
                id="task-column"
                value={colId}
                onChange={(e) => setColId(e.target.value)}
                className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
              >
                {columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-surface-400">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-surface-300 hover:text-surface-100 transition-colors rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              {editCard ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
