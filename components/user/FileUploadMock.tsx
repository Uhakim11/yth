
import React, { useState, useRef, ChangeEvent } from 'react';
import Button from '../shared/Button';
import { ArrowUpTrayIcon, DocumentIcon, PhotoIcon, VideoCameraIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAlert } from '../../hooks/useAlert';

interface MockFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string; // e.g., "2.5 MB"
}

const getFileIcon = (type: MockFile['type']) => {
  switch (type) {
    case 'image': return <PhotoIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
    case 'video': return <VideoCameraIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
    case 'document': return <DocumentIcon className="h-6 w-6 text-green-500 dark:text-green-400" />;
    default: return <DocumentIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />;
  }
};

const FileUploadMock: React.FC = () => {
  const [mockFiles, setMockFiles] = useState<MockFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAlert } = useAlert();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: MockFile[] = Array.from(files).map((file: File) => { // Explicitly type 'file' as 'File'
        let type: MockFile['type'] = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        if (file.type.startsWith('video/')) type = 'video';
        
        return {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        };
      });
      setMockFiles(prev => [...prev, ...newFiles]);
      addAlert(`${newFiles.length} file(s) "selected" for mock upload.`, 'info');
      
      // Reset file input to allow selecting the same file again
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    setMockFiles(prev => prev.filter(file => file.id !== id));
    addAlert('Mock file removed.', 'success');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload files"
      />
      <Button 
        onClick={triggerFileInput} 
        variant="secondary" 
        leftIcon={<ArrowUpTrayIcon className="h-5 w-5"/>}
        className="w-full md:w-auto"
      >
        Select Files to Upload (Mock)
      </Button>

      {mockFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Mock Uploaded Files:</h3>
          <ul className="space-y-3">
            {mockFiles.map(file => (
              <li 
                key={file.id} 
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-xs" title={file.name}>{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{file.size} - Type: {file.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveFile(file.id)} 
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800/50"
                  title={`Remove ${file.name}`}
                  aria-label={`Remove ${file.name}`}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mockFiles.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            No files selected for mock upload. Click the button above to add some.
        </p>
      )}
    </div>
  );
};

export default FileUploadMock;