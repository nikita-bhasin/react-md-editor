import { useState, useEffect } from "react";
import type { FileType, FolderType } from "../types";

const STORAGE_KEY = "markdown-editor-data";

const initialFolders: FolderType[] = [
  {
    id: "dummy",
    name: "My Documents",
    parentId: null,
    type: "folder",
    isOpen: true,
  },
];

const initialFiles: FileType[] = [
  {
    id: "welcome",
    name: "welcome.md",
    content: `# Welcome to Markdown Editor\n\n## Start writing your markdown here...\n\n- This is a list item\n- Another item\n\n**Bold text** and *italic text*\n\n\`\`\`javascript\n// Code block\nconst hello = 'Hello, World!';\nconsole.log(hello);\n\`\`\``,
    parentId: "dummy",
    type: "file",
  },
];

export const useFileSystem = () => {
  const [folders, setFolders] = useState<FolderType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).folders : initialFolders;
  });

  const [files, setFiles] = useState<FileType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).files : initialFiles;
  });

  const [currentFile, setCurrentFile] = useState<FileType | null>(null);
  const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null);

  // Save to localStorage whenever folders or files change
  useEffect(() => {
    const data = { folders, files };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [folders, files]);

  // Set the first file as current on initial load
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
    }
  }, [files, currentFile]);

  const createFile = (name: string, parentId: string | null) => {
    const newFile: FileType = {
      id: Date.now().toString(),
      name: name.endsWith(".md") ? name : `${name}.md`,
      content: "# New Document\n\nStart writing here...",
      parentId,
      type: "file",
    };
    setFiles((prev) => [...prev, newFile]);
    setCurrentFile(newFile);
    return newFile;
  };

  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FolderType = {
      id: Date.now().toString(),
      name,
      parentId,
      type: "folder",
      isOpen: false,
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const updateFile = (id: string, updates: Partial<FileType>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    );
    if (currentFile?.id === id) {
      setCurrentFile({ ...currentFile, ...updates } as FileType);
    }
  };

  const updateFolder = (id: string, updates: Partial<FolderType>) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      )
    );
  };

  const deleteItem = (id: string, type: "file" | "folder") => {
    if (type === "file") {
      setFiles((prev) => prev.filter((file) => file.id !== id));
      if (currentFile?.id === id) {
        setCurrentFile(files.length > 1 ? files[0] : null);
      }
    } else {
      // Delete folder and all its contents
      const folderIds = [id];
      let i = 0;

      // Find all subfolders
      while (i < folderIds.length) {
        const currentId = folderIds[i];
        const subfolders = folders.filter((f) => f.parentId === currentId);
        subfolders.forEach((f) => folderIds.push(f.id));
        i++;
      }

      setFolders((prev) => prev.filter((f) => !folderIds.includes(f.id)));
      setFiles((prev) =>
        prev.filter((f) => !folderIds.includes(f.parentId || ""))
      );

      if (currentFolder?.id === id) {
        setCurrentFolder(null);
      }
    }
  };

  return {
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
  };
};
