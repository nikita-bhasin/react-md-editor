import React from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  placeholder = 'Write your markdown here...',
  className = '',
}) => {
  return (
    <div className={`h-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-400">Editor</h2>
      </div>
      <textarea
        className="w-full h-[calc(100%-2.5rem)] p-4 bg-gray-900 text-gray-100 font-mono text-sm focus:outline-none resize-none no-scrollbar"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};
