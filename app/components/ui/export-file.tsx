import { Button } from "@/components/ui/button";
import React, { useState } from "react"

interface ExportFileProps {
  files: Array<{
    fileName: string;
    content: string | Blob;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportFile({ files, isOpen, onClose }: ExportFileProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(files.length / itemsPerPage);

  // 获取当前页的文件
  const getCurrentPageFiles = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return files.slice(start, end);
  };

  const handleExport = async () => {
    for (const file of files) {
      const blob = file.content instanceof Blob
        ? file.content
        : new Blob([file.content], { type: 'application/octet-stream' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    onClose();
  };

  // 点击外层关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        <h2 className="text-xl font-semibold mb-4">导出文件</h2>
        <ul className="max-h-[60vh] overflow-y-auto">
          {getCurrentPageFiles().map((file) => (
            <li key={file.fileName} className="mb-2 flex justify-between">
              {file.fileName}
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(file.content instanceof Blob ? '' : file.content)}`}
                download={file.fileName}
                className="text-primary hover:underline"
              >
                <Button size="sm">下载</Button>
              </a>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}

        <button
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
}