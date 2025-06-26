import { Sidebar } from './components/Sidebar/Sidebar';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { useFileSystem } from './hooks/useFileSystem';
import type { FileType, FolderType } from './types';
import './App.css';

function App() {
  const {
    folders,
    files,
    currentFile,
    currentFolder,
    setCurrentFile,
    setCurrentFolder,
    createFile,
    createFolder,
    updateFile,
    updateFolder,
    deleteItem,
  } = useFileSystem();

  const handleFileClick = (file: FileType) => setCurrentFile(file);

  const handleFolderClick = (folder: FolderType) => setCurrentFolder(folder);

  const handleToggleFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    if (folder) {
      updateFolder(id, { isOpen: !folder.isOpen });
    }
  };

  const handleDeleteItem = (id: string, type: 'file' | 'folder') => {
    deleteItem(id, type);
  };

  const handleEditItem = (id: string, name: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      updateFile(id, { name });
    } else {
      updateFolder(id, { name });
    }
  };

  const handleAddItem = (
    name: string,
    type: 'file' | 'folder',
    parentId: string | null,
  ) => {
    if (!name.trim()) return;

    if (type === 'file') {
      createFile(name, parentId);
    } else {
      const newFolder = createFolder(name, parentId);
      // Ensure the parent folder is open so the new item is visible
      if (parentId) {
        updateFolder(parentId, { isOpen: true });
      }
      // Optionally open the newly created folder
      updateFolder(newFolder.id, { isOpen: true });
    }
  };

  const handleContentChange = (content: string) => {
    if (currentFile) {
      updateFile(currentFile.id, { content });
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
        <Sidebar
          folders={folders}
          files={files}
          currentFile={currentFile}
          currentFolder={currentFolder}
          onFileClick={handleFileClick}
          onFolderClick={handleFolderClick}
          onToggleFolder={handleToggleFolder}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          onAddItem={handleAddItem}
        />
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {currentFile ? (
          <div className="grid grid-cols-2 gap-6 p-6 h-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Editor
                content={currentFile.content}
                onChange={handleContentChange}
                className="h-full"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <Preview content={currentFile.content} className="h-full" />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-2 text-gray-900">No File Selected</h3>
              <p className="text-gray-500">Select or create a markdown file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
