import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import Button from './Button';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { useAlert } from '../../hooks/useAlert'; // Corrected path
import { UploadedFile } from '../../types'; // Corrected path

interface FileInputProps {
  label: string;
  onFileChange: (file: UploadedFile | null) => void;
  currentFileUrl?: string | null; // Can be dataURL or remote URL for initial display
  acceptedFileTypes?: string; // e.g., "image/*,video/*"
  maxFileSizeMB?: number;
  id?: string;
  className?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  onFileChange,
  currentFileUrl = null,
  acceptedFileTypes = "image/*",
  maxFileSizeMB = 5,
  id = "file-upload",
  className = "",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAlert } = useAlert();

  useEffect(() => {
    setPreviewUrl(currentFileUrl);
    if (currentFileUrl && !currentFileUrl.startsWith('data:')) {
      setFileName("Current Image"); // Or try to derive from URL
    } else if (!currentFileUrl) {
      setFileName(null);
    }
  }, [currentFileUrl]);

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      addAlert(`File is too large. Max size: ${maxFileSizeMB}MB.`, 'error');
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      setFileName(file.name);
      onFileChange({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: dataUrl,
      });
    };
    reader.onerror = () => {
      addAlert('Failed to read file.', 'error');
      setPreviewUrl(null);
      setFileName(null);
      onFileChange(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setPreviewUrl(null);
    setFileName(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isImage = previewUrl && (previewUrl.startsWith('data:image/') || acceptedFileTypes.includes("image/*"));


  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1 flex items-center space-x-3">
        {previewUrl && isImage ? (
          <img src={previewUrl} alt="Preview" className="h-20 w-20 rounded-md object-cover shadow-sm" />
        ) : previewUrl && !isImage ? (
           <div className="h-20 w-20 rounded-md bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-center p-2 shadow-sm">
             <ImageIcon size={24} className="text-gray-400 dark:text-gray-500 mb-1"/>
             <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full" title={fileName || "File selected"}>{fileName || "File selected"}</span>
           </div>
        ) : (
          <div className="h-20 w-20 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
            <UploadCloud size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept={acceptedFileTypes}
          className="hidden"
        />
        <div className="flex flex-col space-y-1">
            <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={triggerFileInput}
                leftIcon={<UploadCloud size={16}/>}
            >
                {previewUrl ? 'Change File' : 'Select File'}
            </Button>
            {previewUrl && (
            <Button 
                type="button" 
                variant="danger_outline" 
                size="sm"
                onClick={handleRemoveFile}
                leftIcon={<X size={16}/>}
            >
                Remove
            </Button>
            )}
        </div>
      </div>
      {fileName && !previewUrl?.startsWith('data:') && (
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently using: {fileName}</p>
      )}
      {previewUrl?.startsWith('data:') && fileName && (
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">New file: {fileName}</p>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500">Max file size: {maxFileSizeMB}MB. Accepted: {acceptedFileTypes}</p>
    </div>
  );
};

export default FileInput;