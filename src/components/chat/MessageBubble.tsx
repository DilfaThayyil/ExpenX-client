import Store from '@/store/store';
import { format } from 'date-fns';
import { File, Download } from 'lucide-react';
import {MessageBubbleProps} from './types'


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const sender = Store((state) => state.user);
  const isSender = message.senderId === sender._id;
  const fileUrl = message.url || message.fileUrl;
  
  const getFileType = () => {
    if (message.fileType) return message.fileType;
    if (!fileUrl) return null;
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) return 'video';
    if (extension === 'pdf') return 'pdf';
    return 'document';
  };
  
  const getFileName = () => {
    if (message.fileName) return message.fileName;
    if (!fileUrl) return 'File';
    
    const urlParts = fileUrl.split('/');
    return urlParts[urlParts.length - 1];
  };
  
  const fileType = getFileType();
  const fileName = getFileName();
  
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`p-3 max-w-xs rounded-lg shadow-md ${
          isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message.text && <p className="mb-2">{message.text}</p>}
        
        {fileUrl && (
          <div className="mt-2">
            {fileType === 'image' && (
              <div className="relative">
                <img 
                  src={fileUrl} 
                  alt={fileName}
                  className="max-w-full rounded-md" 
                  style={{ maxHeight: '150px' }}
                />
                <a 
                  href={fileUrl} 
                  download={fileName}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`absolute bottom-1 right-1 p-1 rounded-full ${
                    isSender ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  <Download size={14} className={isSender ? 'text-white' : 'text-gray-700'} />
                </a>
              </div>
            )}
            
            {fileType === 'video' && (
              <div>
                <video 
                  src={fileUrl} 
                  controls 
                  className="max-w-full rounded-md"
                  style={{ maxHeight: '150px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {(fileType === 'pdf' || fileType === 'document') && (
              <div className={`flex items-center space-x-2 py-1 px-2 rounded-md ${
                isSender ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <File size={18} className={isSender ? 'text-white' : 'text-gray-700'} />
                <span className={`text-sm truncate ${isSender ? 'text-white' : 'text-gray-800'}`}>
                  {fileName}
                </span>
                <a 
                  href={fileUrl} 
                  download={fileName}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`ml-auto ${isSender ? 'text-blue-100' : 'text-gray-600'}`}
                >
                  <Download size={16} />
                </a>
              </div>
            )}
          </div>
        )}
        
        <span className={`text-xs block mt-1 text-right ${
          isSender ? 'text-blue-100' : 'text-gray-600'
        }`}>
          {format(new Date(message.createdAt), 'hh:mm a')}
        </span>
      </div>
    </div>
  );
};