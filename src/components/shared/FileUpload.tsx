import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, FileText, Image, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface FileUploadProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  onFilesAdded: (files: File[]) => void;
  fileType?: 'document' | 'image' | 'any';
  className?: string;
  isUploading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxFiles = 1,
  maxSize = 10485760, // 10MB default
  onFilesAdded,
  fileType = 'any',
  className = '',
  isUploading = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Default accepted file types by category
  const defaultAccept = {
    document: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    },
    image: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    any: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'application/json': ['.json']
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const firstRejection = rejectedFiles[0];
      if (firstRejection.errors[0].code === 'file-too-large') {
        setError(`File too large. Maximum size is ${maxSize / 1048576}MB.`);
      } else if (firstRejection.errors[0].code === 'file-invalid-type') {
        setError('Invalid file type. Please check accepted formats.');
      } else {
        setError(firstRejection.errors[0].message);
      }
      return;
    }

    setError(null);
    
    if (acceptedFiles.length > 0) {
      const newFiles = [...uploadedFiles];
      
      // Handle maxFiles limit
      if (newFiles.length + acceptedFiles.length > maxFiles) {
        if (maxFiles === 1) {
          // Replace the current file
          newFiles.splice(0, newFiles.length);
        } else {
          // Remove oldest files to make room
          newFiles.splice(0, (newFiles.length + acceptedFiles.length) - maxFiles);
        }
      }
      
      const updatedFiles = [...newFiles, ...acceptedFiles];
      setUploadedFiles(updatedFiles);
      onFilesAdded(updatedFiles);
    }
  }, [maxFiles, maxSize, onFilesAdded, uploadedFiles]);

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    onFilesAdded(newFiles);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: accept || defaultAccept[fileType]
  });

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      return <Image size={18} className="text-purple-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileSpreadsheet size={18} className="text-green-500" />;
    } else if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) {
      return <FileText size={18} className="text-blue-500" />;
    } else {
      return <File size={18} className="text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : uploadedFiles.length > 0 
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="text-center py-4">
            <RefreshCw size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600 font-medium">Uploading...</p>
            <p className="text-xs text-gray-500">Please wait while your files are being processed</p>
          </div>
        ) : uploadedFiles.length > 0 ? (
          <div>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center overflow-hidden">
                    {getFileIcon(file)}
                    <span className="ml-2 text-sm font-medium text-gray-700 truncate">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
            {maxFiles > uploadedFiles.length && (
              <div className="text-center mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
                  <Upload size={14} className="mr-1.5" />
                  Add more files
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload size={36} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">
                {isDragActive 
                  ? 'Drop files here' 
                  : 'Drag & drop files here or click to browse'
                }
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {fileType === 'document' && 'Supported formats: PDF, DOC, DOCX, PPT, TXT'}
              {fileType === 'image' && 'Supported formats: JPG, PNG, GIF, WebP'}
              {fileType === 'any' && 'Upload any files for processing'}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
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
