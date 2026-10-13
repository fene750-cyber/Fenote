/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Note,
  CategoryInfo,
  ActiveFilter,
  SaveState,
} from './types.ts';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
  loadCategoriesFromStorage,
  saveCategoriesToStorage,
  exportFile,
} from './utils/storage.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Editor } from './components/Editor.tsx';
import { ShortcutsModal } from './components/ShortcutsModal.tsx';
import { Keyboard, Undo2 } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => loadCategoriesFromStorage());
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    const initial = loadNotesFromStorage();
    const firstActive = initial.find((n) => !n.trashed);
    return firstActive ? firstActive.id : initial[0]?.id || null;
  });

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fenote_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fenote_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fenote_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist notes with debounce auto-save
  const triggerAutoSave = (updatedNotes: Note[]) => {
    setSaveState('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveNotesToStorage(updatedNotes);
      setSaveState('saved');
    }, 400);
  };

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now();
    setToast({ id, message, actionLabel, onAction });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  // Create new note
  const handleNewNote = () => {
    const targetCategory =
      activeFilter !== 'all' &&
      activeFilter !== 'pinned' &&
      activeFilter !== 'favorites' &&
      activeFilter !== 'trash'
        ? activeFilter
        : 'Personal';

    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: '',
      content: '',
      category: targetCategory,
      tags: [],
      pinned: false,
      favorite: false,
      trashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextNotes = [newNote, ...notes];
    setNotes(nextNotes);
    setActiveNoteId(newNote.id);
    if (activeFilter === 'trash') {
      setActiveFilter('all');
    }
    triggerAutoSave(nextNotes);
    setIsMobileSidebarOpen(false);
  };

  // Update existing note
  const handleUpdateNote = (updatedFields: Partial<Note>) => {
    if (!activeNoteId) return;

    const nextNotes = notes.map((n) => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          ...updatedFields,
          updatedAt: new Date().toISOString(),
        };
      }
      return n;
    });

    setNotes(nextNotes);
    triggerAutoSave(nextNotes);
  };

  // Delete note (soft move to trash or permanent)
  const handleDeleteNote = (id: string, permanent: boolean = false) => {
    if (permanent) {
      const confirmed = window.confirm('Are you sure you want to permanently delete this note?');
      if (!confirmed) return;
      const nextNotes = notes.filter((n) => n.id !== id);
      setNotes(nextNotes);
      saveNotesToStorage(nextNotes);
      if (activeNoteId === id) {
        const remaining = nextNotes.filter((n) => (activeFilter === 'trash' ? n.trashed : !n.trashed));
        setActiveNoteId(remaining[0]?.id || null);
      }
      showToast('Note permanently deleted');
      return;
    }

    // Soft delete to trash
    const noteToDelete = notes.find((n) => n.id === id);
    const nextNotes = notes.map((n) => (n.id === id ? { ...n, trashed: true } : n));
    setNotes(nextNotes);
    triggerAutoSave(nextNotes);

    if (activeNoteId === id) {
      const activeRemaining = nextNotes.filter((n) => !n.trashed);
      setActiveNoteId(activeRemaining[0]?.id || null);
    }

    showToast('Note moved to trash', 'Undo', () => {
      if (noteToDelete) {
        handleRestoreNote(id);
      }
    });
  };

  // Restore note from trash
  const handleRestoreNote = (id: string) => {
    const nextNotes = notes.map((n) => (n.id === id ? { ...n, trashed: false } : n));
    setNotes(nextNotes);
    triggerAutoSave(nextNotes);
    setActiveNoteId(id);
    showToast('Note restored successfully');
  };

  // Duplicate note
  const handleDuplicateNote = (sourceNote: Note) => {
    const duplicate: Note = {
      ...sourceNote,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${sourceNote.title || 'Untitled'} (Copy)`,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextNotes = [duplicate, ...notes];
    setNotes(nextNotes);
    setActiveNoteId(duplicate.id);
    triggerAutoSave(nextNotes);
    showToast('Note duplicated');
  };

  // Add custom category
  const handleAddCategory = (name: string) => {
    const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setActiveFilter(existing.name);
      return;
    }

    const palette = ['#0284c7', '#059669', '#d97706', '#9333ea', '#e11d48', '#2563eb'];
    const chosenColor = palette[categories.length % palette.length];

    const newCategory: CategoryInfo = {
      id: name,
      name,
      color: chosenColor,
      bgLight: 'bg-slate-50',
      bgDark: 'dark:bg-slate-800',
      textLight: 'text-slate-800',
      textDark: 'dark:text-slate-200',
    };

    const nextCategories = [...categories, newCategory];
    setCategories(nextCategories);
    saveCategoriesToStorage(nextCategories);
    setActiveFilter(name);
    showToast(`Category "${name}" created`);
  };

  // Export full JSON backup
  const handleExportAll = () => {
    const data = JSON.stringify(notes, null, 2);
    const dateStr = new Date().toISOString().split('T')[0];
    exportFile(data, `fenote-backup-${dateStr}.json`, 'application/json');
    showToast('Backup downloaded successfully');
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge imported notes without duplicate IDs
          const existingIds = new Set(notes.map((n) => n.id));
          const newNotes = [...notes];
          parsed.forEach((importedNote: any) => {
            if (importedNote.id && !existingIds.has(importedNote.id)) {
              newNotes.push(importedNote);
            }
          });
          setNotes(newNotes);
          saveNotesToStorage(newNotes);
          if (newNotes.length > 0 && !activeNoteId) {
            setActiveNoteId(newNotes[0].id);
          }
          showToast(`Successfully imported ${parsed.length} notes`);
        } else {
          showToast('Invalid backup file format');
        }
      } catch (err) {
        showToast('Failed to import notes file');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  // Global Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      if (isMeta && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewNote();
      } else if (isMeta && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notes, activeFilter]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar: Static on Desktop (unless focus mode), Drawer on Mobile */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ${
          isFocusMode ? 'lg:hidden' : ''
        } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={(id) => {
            setActiveNoteId(id);
            setIsMobileSidebarOpen(false);
          }}
          onNewNote={handleNewNote}
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            const matching = notes.filter((n) => {
              if (filter === 'trash') return n.trashed;
              if (n.trashed) return false;
              if (filter === 'pinned') return n.pinned;
              if (filter === 'favorites') return n.favorite;
              if (filter === 'all') return true;
              return n.category.toLowerCase() === filter.toLowerCase();
            });
            if (matching.length > 0 && (!activeNote || !matching.some((m) => m.id === activeNote.id))) {
              setActiveNoteId(matching[0].id);
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          onAddCategory={handleAddCategory}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          onExportAll={handleExportAll}
          onImportBackup={handleImportBackup}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Editor
          note={activeNote}
          categories={categories}
          saveState={saveState}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onRestoreNote={handleRestoreNote}
          onDuplicateNote={handleDuplicateNote}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        />
      </div>

      {/* Floating Keyboard Shortcuts Trigger Button */}
      <button
        onClick={() => setIsShortcutsOpen(true)}
        className="fixed bottom-4 right-4 z-20 p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-md border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition flex items-center justify-center"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border border-white/10 dark:border-black/10">
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                setToast(null);
              }}
              className="flex items-center gap-1 text-indigo-400 dark:text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              <Undo2 className="w-3 h-3" />
              <span>{toast.actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
