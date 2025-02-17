import { useEffect, useState, useRef } from 'react';
import { Search, Video, MoreVertical, Paperclip, Mic, Send } from 'lucide-react';
import Store from '@/store/store'
import { MessageBubble } from './MessageBubble';
import { ContactItem } from './ContactItem';
import {initializeSocket,socket} from '@/socket/socket'
import {fetchMessage} from '@/services/chat/chatServices'



interface Message{
  id: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  text: string;
  createdAt: string;
}


interface ChatProps{
  receivers:{_id:string;username:string;email:string;profilePic:string}[]
}


// Main Chat App Component
const ChatApp:React.FC<ChatProps> = ({receivers}) => {
  const [activeContact, setActiveContact] = useState(receivers[0]);
  const [messages , setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const sender = Store((state)=>state.user)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const filteredContacts = receivers.filter(contact => 
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  console.log("receivers : ",receivers)

  // initialize socket
  useEffect(() => {
    initializeSocket();
    return () => {
      socket.disconnect();
    };
  }, [])
  

  useEffect(() => {
    if (!socket || !sender || !activeContact) return;
  
    console.log("Socket connected:", socket)
    console.log("Sender ID:", sender._id)
    console.log("Receiver ID:", activeContact._id)
  
    const roomId = [sender._id, activeContact._id].sort().join('_')
    console.log("Joining Room ID:", roomId)
  
    socket.emit("joinRoom", roomId)
  
    const messageListener = (message:Message) => {
      if (message.roomId === roomId) {
        console.log("newMsg-listening : ",message)
        setMessages((prev) => [...prev, message]);
      }
    }
  
    socket.on("receive_message", messageListener);
  
    return () => {
      console.log("Leaving Room ID:", roomId);
      socket.emit("leaveRoom", roomId); 
      socket.off("receive_message", messageListener); 
    };
  }, [activeContact, sender]); 
  
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetchMessage(sender._id, activeContact._id);
        console.log("fetchMessage : ",response)
        setMessages(response.map((msg: Message) => ({
          ...msg,
          createdAt: msg.createdAt, 
        })));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    if (activeContact._id) {
      fetchMessages();
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    const roomId = [sender._id, activeContact._id].sort().join('_');
    const newMessage = {
      id: Date.now().toString(), 
      senderId: sender._id,
      receiverId: activeContact._id,
      roomId,
      text: message,
      createdAt: new Date().toISOString(),
    };
    console.log("Sending message:", {
      senderId: sender._id,
      receiverId: activeContact._id,
      roomId,
      text: message,
      createdAt: new Date().toISOString(),    
    });
    
    socket.emit("send_message", newMessage);
    setNewMessage('');
  };
  




  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full sm:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
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
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <ContactItem 
              key={contact._id} 
              contact={contact} 
              active={activeContact._id === contact._id}
              onClick={() => setActiveContact(contact)}
            />
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="hidden sm:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <img src={activeContact.profilePic} alt={activeContact.username} className="rounded-full w-10 h-10" />
              {activeContact.status === 'online' && 
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              }
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-semibold">{activeContact.username}</h2>
              <p className="text-xs text-gray-500">{activeContact.status === 'online' ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex space-x-3">    
            <button className="text-gray-600 hover:text-gray-800">
              <Video className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              {/* <Video className="h-5 w-5" /> */}
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {messages.map((message,index) => (
            <MessageBubble key={message.id || index} message={message} />
          ))}
           <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input Area */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex items-center">
            <button className="text-gray-500 hover:text-gray-700 mr-2">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newMessage.trim()) {
                  handleSendMessage(newMessage);
                }
              }}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {newMessage.trim() ? (
              <button 
                className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
                onClick={()=>handleSendMessage(newMessage)}
              >
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button className="text-gray-500 hover:text-gray-700">
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile view - show message when no chat is selected */}
      {/* <div className="flex-1 flex items-center justify-center sm:hidden">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold text-gray-700">Welcome to Chat</h2>
          <p className="text-gray-500 mt-2">Select a conversation to start messaging</p>
        </div>
      </div> */}
    </div>
  );
}

export default ChatApp;