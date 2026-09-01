import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../lib/db';

const priorityColors: Record<string, string> = {
  critical: 'bg-red-600/20 text-red-300 border-red-600/30',
  high: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
  medium: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
  low: 'bg-green-600/20 text-green-300 border-green-600/30',
};

export function CardItem({
  card,
  onEdit,
  onDelete,
}: {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: 'card', card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="listitem"
      aria-label={`Card: ${card.title}`}
      className="group bg-surface-600 border border-surface-400 rounded-lg p-3 cursor-grab active:cursor-grabbing touch-manipulation select-none hover:border-accent/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-surface-100 leading-snug flex-1 min-w-0">
          {card.title}
        </h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            aria-label={`Edit ${card.title}`}
            className="text-surface-300 hover:text-accent p-0.5 text-xs"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            aria-label={`Delete ${card.title}`}
            className="text-surface-300 hover:text-red-400 p-0.5 text-xs"
          >
            🗑
          </button>
        </div>
      </div>

      {card.description && (
        <p className="text-xs text-surface-300 mt-1.5 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-2.5">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityColors[card.priority] || priorityColors.medium}`}
        >
          {card.priority}
        </span>

        {card.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
        {card.tags.length > 2 && (
          <span className="text-[10px] text-surface-400">+{card.tags.length - 2}</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2.5 text-[10px] text-surface-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-accent/30 text-[8px] text-center leading-3">
            {card.assignee.charAt(0).toUpperCase()}
          </span>
          {card.assignee}
        </span>
        {card.dueDate && (
          <span>{new Date(card.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        )}
      </div>
    </div>
  );
}
