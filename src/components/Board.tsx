import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './Column';
import { CardItem } from './Card';
import { TaskForm } from './TaskForm';
import type { Column, Card as CardType } from '../lib/db';
import type { CardInput } from '../lib/store';

interface BoardProps {
  columns: Column[];
  cards: CardType[];
  onCreateCard: (input: CardInput) => void;
  onUpdateCard: (id: string, updates: Partial<CardInput>) => void;
  onDeleteCard: (id: string) => void;
  onDeleteColumn: (id: string) => void;
  onCreateColumn: (title: string) => void;
  onMoveCard: (cardId: string, toColumnId: string, toOrder: number) => void;
}

export function Board({
  columns,
  cards,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onDeleteColumn,
  onCreateColumn,
  onMoveCard,
}: BoardProps) {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editCard, setEditCard] = useState<CardType | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>('');
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const getColumnCards = useCallback(
    (columnId: string) =>
      cards
        .filter((c) => c.columnId === columnId)
        .sort((a, b) => a.order - b.order),
    [cards]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback via droppable isOver
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    let toColumnId: string;
    let toOrder: number;

    const overData = over.data?.current;
    if (overData?.type === 'column') {
      toColumnId = String(over.id);
      const targetCards = cards.filter((c) => c.columnId === toColumnId && c.id !== cardId);
      toOrder = targetCards.length;
    } else if (overData?.type === 'card') {
      const overCard = cards.find((c) => c.id === over.id);
      if (!overCard) return;
      toColumnId = overCard.columnId;
      toOrder = overCard.order;
    } else {
      const col = columns.find((c) => c.id === over.id);
      if (col) {
        toColumnId = col.id;
        const targetCards = cards.filter((c) => c.columnId === toColumnId && c.id !== cardId);
        toOrder = targetCards.length;
      } else {
        return;
      }
    }

    if (card.columnId === toColumnId && card.order === toOrder) return;

    onMoveCard(cardId, toColumnId, toOrder);
  };

  const handleSaveCard = (input: CardInput) => {
    if (editCard) {
      onUpdateCard(editCard.id, input);
    } else {
      onCreateCard(input);
    }
  };

  const handleAddColumn = () => {
    const title = newColumnTitle.trim();
    if (!title) return;
    onCreateColumn(title);
    setNewColumnTitle('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Add column row */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-400">
        <input
          type="text"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
          placeholder="New column name..."
          aria-label="New column name"
          className="bg-surface-600 border border-surface-400 rounded-lg px-3 py-1.5 text-sm text-surface-100 placeholder-surface-400 focus:outline-none focus:border-accent transition-colors w-40 sm:w-48"
        />
        <button
          onClick={handleAddColumn}
          className="px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          + Column
        </button>
      </div>

      {/* Board: vertical stack on mobile, horizontal scroll on lg+ */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto lg:overflow-x-auto lg:overflow-y-hidden items-stretch lg:items-start"
          role="region"
          aria-label="Kanban board"
        >
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={getColumnCards(col.id)}
              onEditCard={(card) => {
                setEditCard(card);
                setFormOpen(true);
              }}
              onDeleteCard={onDeleteCard}
              onDeleteColumn={onDeleteColumn}
              onAddCard={(columnId) => {
                setEditCard(null);
                setTargetColumnId(columnId);
                setFormOpen(true);
              }}
            />
          ))}

          {columns.length === 0 && (
            <div className="flex items-center justify-center w-full h-full text-surface-400 text-sm">
              Create a column to get started
            </div>
          )}
        </div>

        <DragOverlay>
          {activeCard && (
            <div className="rotate-2 opacity-90">
              <CardItem card={activeCard} onEdit={() => {}} onDelete={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditCard(null);
        }}
        onSave={handleSaveCard}
        editCard={editCard}
        columnId={targetColumnId}
        columns={columns.map((c) => ({ id: c.id, title: c.title }))}
      />
    </div>
  );
}
