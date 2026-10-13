export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  trashed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
}

export type ActiveFilter = 'all' | 'pinned' | 'favorites' | 'trash' | string;

export type SortMode = 'updated-desc' | 'updated-asc' | 'title-asc' | 'created-desc';

export type SaveState = 'saved' | 'saving' | 'synced';
