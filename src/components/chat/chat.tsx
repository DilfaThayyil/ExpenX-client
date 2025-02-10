import React, { useState, useRef, useEffect } from 'react';
import { initializeSocket } from '../../socket/socket';
import Store from '@/store/store';
import Layout from '@/layout/Sidebar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Send, Video, Phone, Paperclip, Smile, Mic } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sendMessage, fetchMessage } from "@/services/chat/chatServices";
import useUserStore from "@/store/store";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: string;
}

const ChatWindow: React.FC = () => {
  const { user } = useUserStore(); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const advisor = Store((state) => state.user);
  const advisorId = advisor._id;

  // Fetch previous messages
  const fetchMessages = async () => {
    try {
      const res = await fetchMessage(advisorId,userId!);
      console.log("res : ",res)
      console.log("res-data :",res.data)
      setMessages(res.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  useEffect(() => {
    const socketInstance = initializeSocket();
    if(socketInstance){
      setSocket(socketInstance);
  
      socketInstance.on("newMessage", (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
  
      fetchMessages();
    }

    return () => {
      socketInstance?.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const msg: Message = {
        id: crypto.randomUUID(),
        sender: advisorId,
        receiver: userId!,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prevMessages) => [...prevMessages, msg]);
      sendMessage(msg);
      setNewMessage("");     
    }
  };

  return (
    <Layout role='advisor'>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 lg:pl-[250px] w-full h-full">
        <div className="w-full max-w-6xl h-full lg:h-[95vh] lg:rounded-2xl bg-white shadow-xl border overflow-hidden flex flex-col">
          
          {/* Chat Header */}
          <div className="bg-gray-50 p-4 md:p-6 flex items-center justify-between border-b">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 md:w-16 md:h-16">
                <AvatarImage src={user.profilePic} alt="User avatar" />
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-base md:text-xl">{name}</h2>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Video Call */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-gray-600">
                    <Video className="h-6 w-6 mr-2" />
                    <span className="hidden md:inline">Video Call</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Video Call</DialogTitle>
                  </DialogHeader>
                  <p>Video call functionality coming soon</p>
                </DialogContent>
              </Dialog>

              {/* Audio Call */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-gray-600">
                    <Phone className="h-6 w-6 mr-2" />
                    <span className="hidden md:inline">Audio Call</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Audio Call</DialogTitle>
                  </DialogHeader>
                  <p>Audio call functionality coming soon</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
            {messages?.length > 0 ? messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === advisorId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 md:p-4 rounded-xl shadow-sm text-base ${
                      msg.sender === advisorId
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-black rounded-bl-none border'
                    }`}
                  >
                    <p className="text-sm md:text-base">{msg.text}</p>
                    <span className="text-xs mt-1 opacity-70 block text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )): <p className="text-center text-gray-500">No messages yet</p>}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 md:p-6 bg-white border-t flex items-center space-x-4">
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Paperclip className="h-6 w-6" />
                </Button>

                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Mic className="h-6 w-6" />
                </Button>

                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Smile className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-grow mx-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full text-base py-2 px-4"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatWindow;
