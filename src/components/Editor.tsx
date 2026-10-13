import React, { useEffect, useRef, useState } from 'react';
import {
  Pin,
  Star,
  Trash2,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  Menu,
  CheckCircle2,
  Loader2,
  FileDown,
  Sparkles,
  Eye,
  Edit3,
} from 'lucide-react';
import { Note, CategoryInfo, SaveState } from '../types.ts';
import { Toolbar } from './Toolbar.tsx';
import { stripHtml, exportFile, htmlToMarkdown } from '../utils/storage.ts';

interface EditorProps {
  note: Note | null;
  categories: CategoryInfo[];
  saveState: SaveState;
  onUpdateNote: (updated: Partial<Note>) => void;
  onDeleteNote: (id: string, permanent?: boolean) => void;
  onRestoreNote: (id: string) => void;
  onDuplicateNote: (note: Note) => void;
  onOpenMobileSidebar: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  categories,
  saveState,
  onUpdateNote,
  onDeleteNote,
  onRestoreNote,
  onDuplicateNote,
  onOpenMobileSidebar,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sync content with active note without breaking cursor focus
  useEffect(() => {
    if (editorRef.current && note) {
      if (editorRef.current.innerHTML !== note.content) {
        editorRef.current.innerHTML = note.content;
      }
    }
  }, [note?.id]);

  if (!note) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm border border-indigo-100 dark:border-indigo-900/40">
          <Edit3 className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">
          No Note Selected
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mb-6">
          Choose a note from the sidebar or click "New Note" to begin writing your thoughts.
        </p>
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
        >
          Open Notes List
        </button>
      </main>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNote({ title: e.target.value });
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      onUpdateNote({ content: editorRef.current.innerHTML });
    }
  };

  const handleFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onUpdateNote({ content: editorRef.current.innerHTML });
    }
  };

  const handleInsertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = selection.toString() || '// Write your code snippet here';
    pre.appendChild(code);
    range.deleteContents();
    range.insertNode(pre);
    if (editorRef.current) {
      onUpdateNote({ content: editorRef.current.innerHTML });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateNote({ category: e.target.value });
  };

  const handleTogglePin = () => {
    onUpdateNote({ pinned: !note.pinned });
  };

  const handleToggleFavorite = () => {
    onUpdateNote({ favorite: !note.favorite });
  };

  const handleExportMarkdown = () => {
    const md = htmlToMarkdown(note.content, note.title);
    const filename = `${(note.title || 'untitled').toLowerCase().replace(/\s+/g, '-')}.md`;
    exportFile(md, filename, 'text/markdown;charset=utf-8');
  };

  const handleExportTxt = () => {
    const plain = `${note.title}\n\n${stripHtml(note.content)}`;
    const filename = `${(note.title || 'untitled').toLowerCase().replace(/\s+/g, '-')}.txt`;
    exportFile(plain, filename, 'text/plain;charset=utf-8');
  };

  // Word & Character count calculation
  const plainText = stripHtml(note.content).trim();
  const charCount = plainText.length;
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden relative transition-colors">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile open sidebar */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Open Notes Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Auto-save Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            {saveState === 'saving' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {note.trashed ? (
            /* Restore from Trash controls */
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-500 font-medium hidden sm:inline">
                In Trash
              </span>
              <button
                onClick={() => onRestoreNote(note.id)}
                className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition flex items-center gap-1 font-medium"
                title="Restore note"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
              <button
                onClick={() => onDeleteNote(note.id, true)}
                className="px-2.5 py-1 text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900 transition flex items-center gap-1 font-medium"
                title="Delete permanently"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Forever</span>
              </button>
            </div>
          ) : (
            <>
              {/* Category Selector */}
              <select
                value={note.category}
                onChange={handleCategoryChange}
                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Pin Note */}
              <button
                onClick={handleTogglePin}
                className={`p-2 rounded-lg transition ${
                  note.pinned
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={note.pinned ? 'Unpin note' : 'Pin note to top'}
              >
                <Pin
                  className={`w-4 h-4 ${note.pinned ? 'fill-amber-500' : ''}`}
                />
              </button>

              {/* Favorite Note */}
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition ${
                  note.favorite
                    ? 'text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={note.favorite ? 'Remove from favorites' : 'Mark as favorite'}
              >
                <Star
                  className={`w-4 h-4 ${note.favorite ? 'fill-amber-400' : ''}`}
                />
              </button>

              {/* Duplicate Note */}
              <button
                onClick={() => onDuplicateNote(note)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-flex"
                title="Duplicate note"
              >
                <Copy className="w-4 h-4" />
              </button>

              {/* Export Dropdown / Markdown */}
              <button
                onClick={handleExportMarkdown}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Download as Markdown (.md)"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Preview Toggle */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-2 rounded-lg transition ${
                  isPreviewMode
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isPreviewMode ? 'Switch to Edit mode' : 'Preview Note'}
              >
                {isPreviewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Focus Mode */}
              <button
                onClick={onToggleFocusMode}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden md:inline-flex"
                title={isFocusMode ? 'Exit focus mode' : 'Distraction-free focus mode'}
              >
                {isFocusMode ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Delete Note */}
              <button
                onClick={() => onDeleteNote(note.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="Move to trash"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Formatting Toolbar (hidden when in preview mode) */}
      {!isPreviewMode && !note.trashed && (
        <Toolbar
          onFormat={handleFormat}
          onInsertCodeBlock={handleInsertCodeBlock}
        />
      )}

      {/* Main Writing Area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-12 md:px-16 lg:px-24 py-8 max-w-4xl mx-auto w-full flex flex-col">
        {/* Title Input */}
        <input
          ref={titleInputRef}
          type="text"
          value={note.title}
          disabled={note.trashed}
          onChange={handleTitleChange}
          placeholder="Untitled Note..."
          className="w-full text-3xl sm:text-4xl font-extrabold tracking-tight bg-transparent text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none border-none mb-6"
        />

        {/* Note Body: Editable or Preview */}
        {isPreviewMode ? (
          <div
            className="fenote-editor flex-1 text-slate-700 dark:text-slate-200 text-base leading-relaxed tracking-normal pb-24"
            dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-slate-400 italic">No content to preview.</p>' }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable={!note.trashed}
            suppressContentEditableWarning
            data-placeholder="Start typing your thoughts, ideas, or notes here..."
            onInput={handleEditorInput}
            className="fenote-editor flex-1 min-h-[420px] text-slate-700 dark:text-slate-200 text-base leading-relaxed tracking-normal focus:outline-none pb-24"
          />
        )}

        {/* Word Count & Stats Footer */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2 select-none">
          <div className="flex items-center gap-3">
            <span>
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{charCount} characters</span>
            <span aria-hidden="true">·</span>
            <span>{readingTimeMin} min read</span>
          </div>

          <div>
            <span>
              Updated {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
