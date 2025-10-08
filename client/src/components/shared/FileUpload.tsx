import React, { useCallback } from 'react';
import { Upload, X, File } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  accept?: string;
  maxSize?: number;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = '*/*',
  maxSize = 10485760,
  className = ''
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size <= maxSize) {
        onFileSelect(file);
      } else {
        alert(`File size must be less than ${maxSize / 1048576}MB`);
      }
    }
  }, [maxSize, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size <= maxSize) {
        onFileSelect(file);
      } else {
        alert(`File size must be less than ${maxSize / 1048576}MB`);
      }
    }
  }, [maxSize, onFileSelect]);

  return (
    <div className={`file-upload ${className}`}>
      {selectedFile ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <File className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          {onFileRemove && (
            <button
              onClick={onFileRemove}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop a file here, or click to select
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Maximum file size: {maxSize / 1048576}MB
          </p>
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload-input"
          />
          <label
            htmlFor="file-upload-input"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Choose File
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
