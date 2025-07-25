// File Upload Component - Reusable file upload with drag and drop
import React, { useState, useCallback, DragEvent } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = [],
  maxSize = 10,
  multiple = false,
  disabled = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    if (acceptedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.some(type => 
        type.includes(fileExtension || '') || 
        file.type.includes(type)
      );
      
      if (!isValidType) {
        setError(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
        return false;
      }
    }

    setError('');
    return true;
  }, [acceptedTypes, maxSize]);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      if (multiple) {
        setUploadedFiles(prev => [...prev, ...validFiles]);
        onFileSelect([...uploadedFiles, ...validFiles]);
      } else {
        setUploadedFiles(validFiles);
        onFileSelect(validFiles);
      }
    }
  }, [validateFile, multiple, uploadedFiles, onFileSelect]);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFileSelect(newFiles);
  }, [uploadedFiles, onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
        
        <Upload className={`w-12 h-12 mx-auto mb-4 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
        
        <div className="space-y-2">
          <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            {acceptedTypes.length > 0 && `Accepted formats: ${acceptedTypes.join(', ')}`}
            {maxSize && ` • Max size: ${maxSize}MB`}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <File className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
