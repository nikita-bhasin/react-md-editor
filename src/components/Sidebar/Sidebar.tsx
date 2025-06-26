import React, { useState } from 'react';
import { 
  Folder as FiFolder, 
  File as FiFile, 
  Plus as FiPlus 
} from 'lucide-react';
import { FileExplorer } from '../FileExplorer/FileExplorer';
import type { FileType, FolderType } from '../../types';
import { Button } from '../UI/Button';

interface SidebarProps {
  folders: FolderType[];
  files: FileType[];
  currentFile: FileType | null;
  currentFolder: FolderType | null;
  onFileClick: (file: FileType) => void;
  onFolderClick: (folder: FolderType) => void;
  onToggleFolder: (id: string) => void;
  onDeleteItem: (id: string, type: 'file' | 'folder') => void;
  onEditItem: (id: string, name: string) => void;
  onAddItem: (name: string, type: 'file' | 'folder', parentId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  files,
  currentFile,
  currentFolder,
  onFileClick,
  onFolderClick,
  onToggleFolder,
  onDeleteItem,
  onEditItem,
  onAddItem,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addType, setAddType] = useState<'file' | 'folder'>('file');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Files</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAddType('folder');
              setIsAdding(!isAdding);
            }}
            title="Add Folder"
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <FiFolder size={18} className="text-gray-600 hover:text-gray-900" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAddType('file');
              setIsAdding(!isAdding);
            }}
            title="Add File"
            className="p-1.5 hover:bg-gray-100 rounded-md"
          >
            <FiFile size={18} className="text-gray-600 hover:text-gray-900" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        {isAdding && (
          <div className="mb-3 p-2 bg-white rounded-lg border border-gray-200">
            <input
              type="text"
              autoFocus
              placeholder={`New ${addType} name...`}
              className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  const value = target.value.trim();
                  if (value) {
                    onAddItem(value, addType, null);
                    setIsAdding(false);
                  }
                } else if (e.key === 'Escape') {
                  setIsAdding(false);
                }
              }}
              onBlur={(e) => {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  onAddItem(value, addType, null);
                }
                setIsAdding(false);
              }}
            />
          </div>
        )}
        
        <FileExplorer
          folders={folders}
          files={files}
          currentFile={currentFile}
          currentFolder={currentFolder}
          onFileClick={onFileClick}
          onFolderClick={onFolderClick}
          onToggleFolder={onToggleFolder}
          onDeleteItem={onDeleteItem}
          onEditItem={onEditItem}
          onAddItem={onAddItem}
        />
      </div>
    </div>
  );
};
