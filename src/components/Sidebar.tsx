import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
    isActive
      ? 'bg-accent/15 text-accent border-l-2 border-accent'
      : 'text-surface-300 hover:text-surface-100 hover:bg-surface-600/50 border-l-2 border-transparent'
  }`;

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 flex-1" aria-label="Main navigation">
      <NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>
        <span className="text-base">📌</span>
        Board
      </NavLink>
      <NavLink to="/list" className={linkClass} onClick={() => setMobileOpen(false)}>
        <span className="text-base">📋</span>
        List
      </NavLink>
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 bg-surface-700 border border-surface-400 rounded-lg p-2 text-surface-300 hover:text-surface-100"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          {mobileOpen ? (
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          ) : (
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-56 shrink-0 bg-surface-800 border-r border-surface-400 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 py-5 border-b border-surface-400">
          <h1 className="text-base font-semibold text-surface-100 tracking-tight">
            📋 Kanban
          </h1>
          <p className="text-[11px] text-surface-400 mt-0.5">Project board</p>
        </div>

        {nav}

        <div className="px-4 py-3 border-t border-surface-400 text-[11px] text-surface-500">
          Kanban MVP &middot; v1.0
        </div>
      </aside>
    </>
  );
}
