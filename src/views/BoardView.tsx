import { useKanbanStore } from '../lib/store';
import type { CardInput } from '../lib/store';
import { Board } from '../components/Board';
import { FilterBar } from '../components/FilterBar';
import { useFilteredTasks, useUniqueAssignees, useUniqueTags } from '../hooks/useFilteredTasks';

export function BoardView() {
  const {
    columns,
    cards,
    createCard,
    updateCard,
    deleteCard,
    deleteColumn,
    createColumn,
    moveCard,
  } = useKanbanStore();

  const filteredCards = useFilteredTasks(cards);
  const assignees = useUniqueAssignees(cards);
  const tags = useUniqueTags(cards);

  return (
    <div className="flex flex-col h-full">
      <FilterBar assignees={assignees} tags={tags} />
      <Board
        columns={columns}
        cards={filteredCards}
        onCreateCard={(input: CardInput) => createCard(input)}
        onUpdateCard={(id, updates) => updateCard(id, updates)}
        onDeleteCard={deleteCard}
        onDeleteColumn={deleteColumn}
        onCreateColumn={createColumn}
        onMoveCard={moveCard}
      />
    </div>
  );
}
