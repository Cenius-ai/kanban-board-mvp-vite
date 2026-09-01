import { useSearchParams } from 'react-router-dom';

interface FilterBarProps {
  assignees: string[];
  tags: string[];
}

export function FilterBar({ assignees, tags }: FilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const assignee = searchParams.get('assignee') || '';
  const tag = searchParams.get('tag') || '';
  const priority = searchParams.get('priority') || '';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const hasFilters = query || assignee || tag || priority;

  const clearAll = () => setSearchParams({}, { replace: true });

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-surface-700/60 border-b border-surface-400">
      {/* Search */}
      <div className="flex-1 min-w-[160px] max-w-xs">
        <input
          type="text"
          value={query}
          onChange={(e) => updateParam('q', e.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className="w-full bg-surface-600 border border-surface-400 rounded-lg px-3 py-1.5 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Assignee filter */}
      <select
        value={assignee}
        onChange={(e) => updateParam('assignee', e.target.value)}
        aria-label="Filter by assignee"
        className="bg-surface-600 border border-surface-400 rounded-lg px-3 py-1.5 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
      >
        <option value="">All assignees</option>
        {assignees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      {/* Tag filter */}
      <select
        value={tag}
        onChange={(e) => updateParam('tag', e.target.value)}
        aria-label="Filter by tag"
        className="bg-surface-600 border border-surface-400 rounded-lg px-3 py-1.5 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
      >
        <option value="">All tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={priority}
        onChange={(e) => updateParam('priority', e.target.value)}
        aria-label="Filter by priority"
        className="bg-surface-600 border border-surface-400 rounded-lg px-3 py-1.5 text-sm text-surface-100 focus:outline-none focus:border-accent transition-colors"
      >
        <option value="">All priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-accent hover:text-accent-300 transition-colors px-2 py-1"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
