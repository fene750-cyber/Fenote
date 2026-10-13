import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ + N / Ctrl + N', description: 'Create a new note' },
    { key: '⌘ + K / Ctrl + K', description: 'Focus search bar' },
    { key: '⌘ + B / Ctrl + B', description: 'Bold selected text' },
    { key: '⌘ + I / Ctrl + I', description: 'Italic selected text' },
    { key: '⌘ + U / Ctrl + U', description: 'Underline selected text' },
    { key: '⌘ + Shift + F', description: 'Toggle distraction-free focus mode' },
    { key: 'Esc', description: 'Close dialogs or clear search' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">{sc.description}</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200/60 dark:border-slate-700/60">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
