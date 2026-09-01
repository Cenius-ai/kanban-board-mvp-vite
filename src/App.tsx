import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useKanbanStore } from './lib/store';
import { Sidebar } from './components/Sidebar';
import { BoardView } from './views/BoardView';
import { ListView } from './views/ListView';

function AppContent() {
  const { initialize, loading, error } = useKanbanStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-800 text-surface-300">
        <div className="text-center">
          <div className="text-2xl mb-3 animate-pulse">📋</div>
          <p className="text-sm">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-800 text-red-400">
        <div className="text-center">
          <p className="text-sm">Failed to load: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col lg:pt-0 pt-12">
        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/list" element={<ListView />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
