import  { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface PreviewProps {
  content: string;
  className?: string;
}

export const Preview = ({
  content,
  className = '',
}: PreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!previewRef.current) return;

    const element = previewRef.current;
    const opt = {
      margin: [10, 10],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={`h-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-medium text-gray-700">Preview</h2>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors"
          title="Download as PDF"
        >
          <Download size={14} />
          <span>PDF</span>
        </button>
      </div>
      <div ref={previewRef} className="prose max-w-none p-4 h-[calc(100%-2.5rem)] overflow-auto no-scrollbar">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
