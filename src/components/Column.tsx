import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Column as ColumnType, Card as CardType } from '../lib/db';
import { CardItem } from './Card';

export function KanbanColumn({
  column,
  cards,
  onEditCard,
  onDeleteCard,
  onDeleteColumn,
  onAddCard,
}: {
  column: ColumnType;
  cards: CardType[];
  onEditCard: (card: CardType) => void;
  onDeleteCard: (id: string) => void;
  onDeleteColumn: (id: string) => void;
  onAddCard: (columnId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column', column } });

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      className="flex flex-col bg-surface-700/50 border border-surface-400 rounded-lg w-full lg:min-w-[280px] lg:max-w-[340px] flex-shrink-0"
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-surface-400">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-surface-200">{column.title}</h3>
          <span className="text-[11px] text-surface-400 bg-surface-600 px-1.5 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddCard(column.id)}
            aria-label={`Add card to ${column.title}`}
            className="text-surface-400 hover:text-accent transition-colors text-sm leading-none px-1"
          >
            +
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            aria-label={`Delete column ${column.title}`}
            className="text-surface-400 hover:text-red-400 transition-colors text-xs leading-none px-1"
          >
            ×
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-3 flex-1 min-h-[120px] transition-colors rounded-b-lg ${
          isOver ? 'bg-accent/10' : ''
        }`}
        aria-label={`${column.title} column, ${cards.length} cards`}
        role="list"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="text-xs text-surface-400 text-center py-8 italic">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
