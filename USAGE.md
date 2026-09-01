# Usage Guide

Once the development server is running (see [INSTALL.md](INSTALL.md)), open your browser to the provided address (usually `http://localhost:5173`).

## Board View (Default Route `/`)

- The board displays columns for different task statuses (e.g., “To Do”, “In Progress”, “Done”).
- Each column contains draggable task cards. You can:
  - Drag a card from one column to another to change its status.
  - Reorder cards within a column by dragging.
- **Creating a task**: Use the “Add Task” button (visible in the board header) to open the `TaskForm` and fill in title, description, status, and priority.
- **Filtering**: Use the `FilterBar` above the board to filter tasks by title (search), status, or priority. The board updates in real time.

## List View (Route `/list`)

- Switch to the list view by clicking the “List” item in the sidebar (`Sidebar` component).
- This view displays all tasks in a sortable table/list. You can sort by columns like title, status, priority, or due date.
- The `FilterBar` is also available here to narrow down the displayed tasks.
- Click on a task row to edit its details (opens the `TaskForm`).

## Data Persistence

All tasks are automatically saved to the browser’s IndexedDB database (via Dexie). Refreshing the page or reopening the app will restore your board exactly as you left it. On the very first visit, a set of seed tasks is automatically inserted so you can see the board in action.

**Clearing data**: To reset the board, clear the IndexedDB database `kanban-app` in your browser’s developer tools (Application → IndexedDB).