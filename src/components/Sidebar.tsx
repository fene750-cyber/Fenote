import React, { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Sun,
  Moon,
  Pin,
  Star,
  Trash2,
  FileText,
  Download,
  Upload,
  FolderPlus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Note, CategoryInfo, ActiveFilter } from '../types.ts';
import { Logo } from './Logo.tsx';
import { stripHtml } from '../utils/storage.ts';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  activeFilter: ActiveFilter;
  onFilterChange: (filter: ActiveFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: CategoryInfo[];
  onAddCategory: (name: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onCloseMobileSidebar: () => void;
  onExportAll: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  categories,
  onAddCategory,
  isDarkMode,
  onToggleTheme,
  onCloseMobileSidebar,
  onExportAll,
  onImportBackup,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Counts
  const activeNotes = notes.filter((n) => !n.trashed);
  const pinnedNotes = activeNotes.filter((n) => n.pinned);
  const favoriteNotes = activeNotes.filter((n) => n.favorite);
  const trashedNotes = notes.filter((n) => n.trashed);

  // Filter notes according to active filter and search
  const filteredNotes = notes.filter((n) => {
    // Trash check
    if (activeFilter === 'trash') {
      if (!n.trashed) return false;
    } else {
      if (n.trashed) return false;

      if (activeFilter === 'pinned' && !n.pinned) return false;
      if (activeFilter === 'favorites' && !n.favorite) return false;
      if (
        activeFilter !== 'all' &&
        activeFilter !== 'pinned' &&
        activeFilter !== 'favorites' &&
        n.category.toLowerCase() !== activeFilter.toLowerCase()
      ) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesTitle = n.title.toLowerCase().includes(query);
    const matchesContent = stripHtml(n.content).toLowerCase().includes(query);
    const matchesCat = n.category.toLowerCase().includes(query);
    const matchesTags = n.tags.some((t) => t.toLowerCase().includes(query));
    return matchesTitle || matchesContent || matchesCat || matchesTags;
  });

  // Sort: pinned first (unless already in pinned/trash filter), then newest updated
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (activeFilter !== 'pinned' && activeFilter !== 'trash' && a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      onAddCategory(newCatName.trim());
      setNewCatName('');
      setIsAddingCategory(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24 && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffHours < 48) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-full lg:w-80 md:w-76 shrink-0 h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Fenote
            </h1>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Mobile close */}
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Action & Search */}
      <div className="p-4 space-y-3">
        <button
          onClick={onNewNote}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Note</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-auto text-indigo-50 font-mono hidden sm:inline">
            ⌘N
          </span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Navigation Filter Bar */}
      <div className="px-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="grid grid-cols-4 gap-1 text-xs">
          <button
            onClick={() => onFilterChange('all')}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
              activeFilter === 'all'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            All <span className="opacity-70 font-normal">({activeNotes.length})</span>
          </button>
          <button
            onClick={() => onFilterChange('pinned')}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
              activeFilter === 'pinned'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Pinned <span className="opacity-70 font-normal">({pinnedNotes.length})</span>
          </button>
          <button
            onClick={() => onFilterChange('favorites')}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
              activeFilter === 'favorites'
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Starred <span className="opacity-70 font-normal">({favoriteNotes.length})</span>
          </button>
          <button
            onClick={() => onFilterChange('trash')}
            className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
              activeFilter === 'trash'
                ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Trash <span className="opacity-70 font-normal">({trashedNotes.length})</span>
          </button>
        </div>

        {/* Categories Carousel/List */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Categories
          </span>
          <button
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition"
            title="Add category"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAddingCategory && (
          <form onSubmit={handleCreateCategory} className="mt-2 flex gap-1">
            <input
              type="text"
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category..."
              className="flex-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </form>
        )}

        <div className="mt-1.5 flex gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeFilter.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange(cat.name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        {sortedNotes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 px-4">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 stroke-[1.5]" />
            <p className="text-xs font-medium">No notes found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {activeFilter === 'trash'
                ? 'Your trash is currently empty.'
                : searchQuery
                ? 'Try a different search query or clear the filter.'
                : 'Click "New Note" above to write your first thought.'}
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            const plainSnippet = stripHtml(note.content) || 'Empty note...';
            const catObj = categories.find(
              (c) => c.name.toLowerCase() === note.category.toLowerCase()
            );

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-150 border text-left relative ${
                  isActive
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/70 shadow-xs'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/70'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                )}

                <div className="flex items-start justify-between gap-1.5 mb-1 pl-1">
                  <h4
                    className={`font-semibold text-sm line-clamp-1 ${
                      isActive
                        ? 'text-indigo-950 dark:text-indigo-200'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {note.title.trim() || 'Untitled Note'}
                  </h4>

                  <div className="flex items-center gap-1 shrink-0 text-slate-400">
                    {note.favorite && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    )}
                    {note.pinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                    )}
                  </div>
                </div>

                {/* Content snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2 pl-1">
                  {plainSnippet}
                </p>

                {/* Anti-slop clean metadata line */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pl-1">
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: catObj?.color || '#94a3b8' }}
                    />
                    {note.category || 'General'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 opacity-60" />
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info & Data Sync */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="font-medium">
          {activeNotes.length} {activeNotes.length === 1 ? 'Note' : 'Notes'}
        </span>

        <div className="flex items-center gap-2">
          {/* Export JSON backup */}
          <button
            onClick={onExportAll}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 transition text-[11px]"
            title="Export all notes to JSON backup"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>

          {/* Import JSON backup */}
          <label
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200/70 dark:hover:bg-slate-800 transition text-[11px] cursor-pointer"
            title="Import notes from JSON file"
          >
            <Upload className="w-3 h-3" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </aside>
  );
};
