import { useEffect, useState, useRef } from 'react';
import { Search, Video, MoreVertical, Paperclip, Mic, Send } from 'lucide-react';
import Store from '@/store/store'
import { MessageBubble } from './MessageBubble';
import { ContactItem } from './ContactItem';
import { FilePreview, getFileType } from './FilePreview'
import { initializeSocket, socket } from '@/socket/socket'
import { fetchMessage, uploadChatFile } from '@/services/chat/chatServices'
import { debounce } from 'lodash'
import Loading from '@/style/loading'
import { NewMessageIndicator } from './MessageIndicator';
import notification from '@/assets/audio/mixkit-correct-answer-tone-2870.wav'
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  url?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
}

interface ChatProps {
  receivers: { _id: string; username: string; email: string; profilePic: string }[]
}


const ChatApp: React.FC<ChatProps> = ({ receivers }) => {
  const [activeContact, setActiveContact] = useState(receivers[0]);
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const sender = Store((state) => state.user)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = useState<Map<string, number>>(new Map());
  const notificationSound = useRef<HTMLAudioElement | null>(null);



  const filteredContacts = receivers.filter(contact =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // initialize socket
  useEffect(() => {
    initializeSocket();
    return () => {
      socket.disconnect();
    };
  }, [])

  useEffect(() => {
    if (!socket || !sender || !activeContact) return;
    const roomId = [sender._id, activeContact._id].sort().join('_')
    socket.emit("joinRoom", roomId)
    const messageListener = (message: Message) => {
      if (message.roomId === roomId) {
        setMessages((prev) => [...prev, message]);
        if (message.senderId !== sender._id) {
          if (!document.hasFocus() || activeContact._id !== message.senderId) {
            notificationSound.current?.play()
              .catch(err => console.log("Error playing notification:", err));
          }
          setUnreadMessages(prev => {
            const newUnreadMessages = new Map(prev);
            newUnreadMessages.set(
              message.senderId, 
              (newUnreadMessages.get(message.senderId) || 0) + 1
            );
            return newUnreadMessages;
          });
        }
      }
    };
    socket.on("receive_message", messageListener);
    return () => {
      socket.emit("leaveRoom", roomId);
      socket.off("receive_message", messageListener);
    };
  }, [activeContact, sender]);

  useEffect(() => {
    if (activeContact) {
      setUnreadMessages(prev => {
        const newUnreadMessages = new Map(prev);
        newUnreadMessages.set(activeContact._id, 0);
        return newUnreadMessages;
      });
    }
  }, [activeContact]);


  useEffect(() => {
    socket.on('display_typing', ({ senderId }) => {
      setTypingUser(senderId)
    });
    socket.on('hide_typing', () => {
      setTypingUser(null);
    });
    return () => {
      socket.off('display_typing');
      socket.off('hide_typing');
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetchMessage(sender._id, activeContact._id);
        setMessages(response.map((msg: Message) => ({
          ...msg,
          createdAt: msg.createdAt,
        })));
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }
    if (activeContact._id) {
      fetchMessages()
    }
  }, [activeContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  useEffect(() => {
    notificationSound.current = new Audio(notification)
    if (notificationSound.current) {
      notificationSound.current.volume = 0.4
    }
    return () => {
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, []);

  const handleSendMessage = (message: string, url?: string, fileInfo?: { type: string, name: string }) => {
    if ((!message.trim() && !url)) return;
    const roomId = [sender._id, activeContact._id].sort().join('_');
    const newMessage = {
      id: Date.now().toString(),
      senderId: sender._id,
      receiverId: activeContact._id,
      roomId,
      text: message,
      url,
      fileType: fileInfo?.type,
      fileName: fileInfo?.name,
      createdAt: new Date().toISOString(),
    }
    console.log("sendingMessage : ", newMessage)
    socket.emit("send_message", newMessage);
    setNewMessage('');
  };

  const handleTyping = () => {
    const roomId = [sender._id, activeContact._id].sort().join('_');
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { senderId: sender._id, roomId });
    }
    debounceStopTyping();
  };

  const debounceStopTyping = debounce(() => {
    const roomId = [sender._id, activeContact._id].sort().join('_');
    setIsTyping(false);
    socket.emit("stop_typing", { senderId: sender._id, roomId });
  }, 1500);

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return
    processFile(file);
  }

  const processFile = (file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 10MB limit.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024
  const MAX_OTHER_SIZE = 10 * 1024 * 1024;

  const uploadFile = async (file: File) => {
    setUploading(true)
    try {
      const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_OTHER_SIZE;
      if (file.size > maxSize) {
        alert(`File is too large! Max allowed: ${maxSize / (1024 * 1024)}MB`);
        setUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      console.log("formData : ", formData)
      const response = await uploadChatFile(formData)
      console.log("response : ", response)
      if (response.url) {
        handleSendMessage('', response.url, {
          type: getFileType(file),
          name: file.name
        })
        removeSelectedFile()
      } else {
        throw new Error('File upload failed')
      }
    } catch (err) {
      console.error('file upload error : ', err)
    }
    setUploading(false)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-full sm:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full p-2 pl-8 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => {
            const unreadCount = unreadMessages.get(contact._id) || 0;
            return (
              <ContactItem
                key={contact._id}
                contact={contact}
                active={activeContact._id === contact._id}
                onClick={() => setActiveContact(contact)}
              >
                <NewMessageIndicator count={unreadCount} />
              </ContactItem>
            );
          })}
        </div>

      </div>

      <div className="hidden sm:flex flex-1 flex-col">
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <img src={activeContact.profilePic} alt={activeContact.username} className="rounded-full w-10 h-10" />
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-semibold">{activeContact.username}</h2>
              {typingUser && typingUser === activeContact._id && <TypingIndicator />}
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="text-gray-600 hover:text-gray-800">
              <Video className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {messages.map((message, index) => (
            <MessageBubble key={message.id || index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div
          className={`bg-white border-t border-gray-200 p-3 ${dragActive ? 'bg-blue-50 border-blue-200' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFile && previewUrl && (
            <FilePreview
              file={selectedFile}
              previewUrl={previewUrl}
              onRemove={removeSelectedFile}
            />
          )}

          <div className="flex items-center">
            <button
              className="text-gray-500 hover:text-blue-600 mr-2 rounded-full p-2 hover:bg-blue-50 transition-colors"
              onClick={handleFileUpload}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
            />

            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); handleTyping() }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (newMessage.trim() || selectedFile)) {
                    if (selectedFile) {
                      uploadFile(selectedFile);
                    } else {
                      handleSendMessage(newMessage);
                    }
                  }
                }}
                placeholder={dragActive ? "Drop file here..." : "Type a message..."}
                className={`w-full border border-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 ${dragActive ? 'border-blue-300 bg-blue-50' : ''}`}
              />
              {selectedFile && (
                <button
                  onClick={() => uploadFile(selectedFile)}
                  disabled={uploading}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs"
                >
                  {uploading ? "Sending..." : "Send File"}
                </button>
              )}
            </div>

            {newMessage.trim() || selectedFile ? (
              <button
                className="ml-2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors flex items-center justify-center"
                onClick={() => {
                  if (selectedFile) {
                    uploadFile(selectedFile);
                  } else {
                    handleSendMessage(newMessage);
                  }
                }}
                disabled={uploading}
              >
                {uploading ? <Loading /> : <Send className="h-5 w-5" />}
              </button>
            ) : (
              <button className="ml-2 text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors">
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>

          {dragActive && (
            <div className="mt-2 text-center text-sm text-blue-600">
              Drop your file here to share
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;