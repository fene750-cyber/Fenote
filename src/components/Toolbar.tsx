import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  RemoveFormatting,
} from 'lucide-react';

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertCodeBlock: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onFormat, onInsertCodeBlock }) => {
  const handleCommand = (e: React.MouseEvent, command: string, value: string = '') => {
    e.preventDefault();
    onFormat(command, value);
  };

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 overflow-x-auto text-slate-600 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-sm select-none">
      {/* Inline Formatting */}
      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'bold')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'italic')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'underline')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'strikeThrough')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4 stroke-[2.2]" />
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700/80 mx-1.5 shrink-0" />

      {/* Headings */}
      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'formatBlock', '<h1>')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'formatBlock', '<h2>')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'formatBlock', '<h3>')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'formatBlock', '<p>')}
        className="px-2 py-1 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition"
        title="Regular Paragraph"
      >
        Body
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700/80 mx-1.5 shrink-0" />

      {/* Lists */}
      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'insertUnorderedList')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Bullet List"
      >
        <List className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'insertOrderedList')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'formatBlock', '<blockquote>')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Quote Block"
      >
        <Quote className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsertCodeBlock();
        }}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Code Block"
      >
        <Code className="w-4 h-4 stroke-[2.2]" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'insertHorizontalRule')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
        title="Horizontal Line"
      >
        <Minus className="w-4 h-4 stroke-[2.2]" />
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700/80 mx-1.5 shrink-0" />

      {/* Clear Formatting */}
      <button
        type="button"
        onMouseDown={(e) => handleCommand(e, 'removeFormat')}
        className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition text-slate-500"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4 stroke-[2.2]" />
      </button>
    </div>
  );
};
