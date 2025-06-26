export type FileType = {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  type: 'file';
};

export type FolderType = {
  id: string;
  name: string;
  parentId: string | null;
  type: 'folder';
  isOpen: boolean;
};

export type ItemType = FileType | FolderType;

export type AddItemType = {
  type: 'file' | 'folder' | null;
  parentId: string | null;
};

export type EditingItemType = {
  id: string;
  name: string;
} | null;
