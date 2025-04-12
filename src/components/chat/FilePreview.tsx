import { X, File, Play } from 'lucide-react'

export const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    return 'document';
  };
  
export const FilePreview = ({ file, previewUrl, onRemove }: { file: File, previewUrl: string, onRemove: () => void }) => {
    const fileType = getFileType(file);
    
    return (
      <div className="relative p-2 bg-gray-100 rounded-md flex items-center justify-between w-full md:w-72 mb-2">
        <div className="flex items-center space-x-2 overflow-hidden">
          {fileType === 'image' && (
            <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center overflow-hidden">
              <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
            </div>
          )}
          {fileType === 'video' && (
            <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center">
              <Play className="h-5 w-5 text-red-500" />
            </div>
          )}
          {fileType === 'pdf' && (
            <div className="h-10 w-10 rounded bg-red-100 flex items-center justify-center">
              <File className="h-5 w-5 text-red-500" />
            </div>
          )}
          {fileType === 'document' && (
            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
              <File className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button 
          onClick={onRemove} 
          className="ml-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-200 transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
    );
  };
  