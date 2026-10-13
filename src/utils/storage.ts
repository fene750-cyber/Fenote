import { Note, CategoryInfo } from '../types.ts';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Personal',
    name: 'Personal',
    color: '#0284c7', // Sky
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    textLight: 'text-sky-700',
    textDark: 'dark:text-sky-300',
  },
  {
    id: 'Work',
    name: 'Work',
    color: '#4f46e5', // Indigo
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/40',
    textLight: 'text-indigo-700',
    textDark: 'dark:text-indigo-300',
  },
  {
    id: 'Ideas',
    name: 'Ideas',
    color: '#d97706', // Amber
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/40',
    textLight: 'text-amber-700',
    textDark: 'dark:text-amber-300',
  },
  {
    id: 'Study',
    name: 'Study',
    color: '#059669', // Emerald
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/40',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
  },
  {
    id: 'Journal',
    name: 'Journal',
    color: '#9333ea', // Purple
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/40',
    textLight: 'text-purple-700',
    textDark: 'dark:text-purple-300',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: 'Welcome to Fenote ✨',
    content: `<h1>Getting Started with Fenote</h1>
<p>Welcome to <strong>Fenote</strong>, your elegant workspace for capturing thoughts, organizing projects, and writing with clarity.</p>
<h2>✨ Key Features at a Glance</h2>
<ul>
  <li><strong>Instant Auto-save:</strong> Every keystroke is saved locally in your browser so you never lose your progress.</li>
  <li><strong>Rich Text Formatting:</strong> Headings, bold, italics, quotes, numbered lists, and bullet points.</li>
  <li><strong>Categories & Organization:</strong> Sort notes by Personal, Work, Ideas, Study, or custom categories.</li>
  <li><strong>Pinning:</strong> Keep your top priorities anchored right at the top of your list.</li>
  <li><strong>Search & Filter:</strong> Instantly search by title, content, or category filter.</li>
  <li><strong>Data Portability:</strong> Export notes anytime to JSON, Markdown (.md), or plain text.</li>
</ul>
<blockquote>"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</blockquote>
<p>Feel free to edit this note or press <strong>+ New Note</strong> to start fresh!</p>`,
    category: 'Ideas',
    tags: ['welcome', 'guide'],
    pinned: true,
    favorite: true,
    trashed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-project-roadmap',
    title: 'Product Roadmap & Architecture 🚀',
    content: `<h2>Q4 Strategic Goals</h2>
<p>High-level priorities for the upcoming milestone release:</p>
<ol>
  <li><strong>Modern Design Polish:</strong> Seamless dark & light themes with warm slate and indigo accents.</li>
  <li><strong>Responsive Workspace:</strong> Mobile drawer navigation with smooth gestures and clean desktop sidebar.</li>
  <li><strong>Keyboard Shortcuts:</strong> Fast actions for power users (Ctrl/Cmd+N for new note, Ctrl/Cmd+S to save).</li>
  <li><strong>Safe Recovery:</strong> Soft-delete with trash bin and 1-click restore.</li>
</ol>
<p>Review timeline with design and engineering partners before next sprint.</p>`,
    category: 'Work',
    tags: ['product', 'roadmap', 'q4'],
    pinned: true,
    favorite: false,
    trashed: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'note-creative-ideas',
    title: 'Creative Sparks & Reading List 📚',
    content: `<h2>Book Recommendations</h2>
<ul>
  <li><em>Designing Data-Intensive Applications</em> — Martin Kleppmann</li>
  <li><em>The Design of Everyday Things</em> — Don Norman</li>
  <li><em>Atomic Habits</em> — James Clear</li>
</ul>
<h2>Inspirational Quotation</h2>
<blockquote>"A wealth of information creates a poverty of attention." — Herbert A. Simon</blockquote>
<p>Take 20 minutes every morning to write down 3 creative thoughts before checking notifications.</p>`,
    category: 'Personal',
    tags: ['reading', 'habits'],
    pinned: false,
    favorite: true,
    trashed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'note-daily-log',
    title: 'Morning Reflections & Routine ☕',
    content: `<h2>Daily Habit Tracker</h2>
<ul>
  <li>Hydration (500ml water upon waking)</li>
  <li>15 min brisk morning walk in fresh air</li>
  <li>Review 3 priority tasks for today</li>
</ul>
<p>Key focus: deep work blocks of 90 minutes without distraction.</p>`,
    category: 'Journal',
    tags: ['routine', 'focus'],
    pinned: false,
    favorite: false,
    trashed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const STORAGE_KEY = 'fenote_notes_store_v1';
const CATEGORIES_KEY = 'fenote_categories_store_v1';

export function loadNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveNotesToStorage(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_NOTES;
  } catch (err) {
    console.error('Failed to load notes from localStorage', err);
    return INITIAL_NOTES;
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage', err);
  }
}

export function loadCategoriesFromStorage(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      saveCategoriesToStorage(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategoriesToStorage(cats: CategoryInfo[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  } catch (err) {
    console.error('Failed to save categories', err);
  }
}

// Strip HTML tags for clean preview snippet
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Convert HTML content into clean Markdown for export
export function htmlToMarkdown(html: string, title: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;

  let md = `# ${title || 'Untitled'}\n\n`;

  container.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const text = el.innerText.trim();

      if (tag === 'h1') md += `# ${text}\n\n`;
      else if (tag === 'h2') md += `## ${text}\n\n`;
      else if (tag === 'h3') md += `### ${text}\n\n`;
      else if (tag === 'p') md += `${text}\n\n`;
      else if (tag === 'blockquote') md += `> ${text}\n\n`;
      else if (tag === 'ul') {
        el.querySelectorAll('li').forEach((li) => {
          md += `- ${li.innerText.trim()}\n`;
        });
        md += '\n';
      } else if (tag === 'ol') {
        let i = 1;
        el.querySelectorAll('li').forEach((li) => {
          md += `${i}. ${li.innerText.trim()}\n`;
          i++;
        });
        md += '\n';
      } else if (tag === 'pre') {
        md += `\`\`\`\n${text}\n\`\`\`\n\n`;
      } else {
        if (text) md += `${text}\n\n`;
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) md += `${t}\n\n`;
    }
  });

  return md.trim();
}

// Export single note or all notes
export function exportFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
