// import { XCircle, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Store from '@/store/store'
import ChatWindow from '@/components/chat/chat'
import { createChat, fetchChats } from "@/services/chat/chatServices";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";




interface Booking {
    date: string;
    endTime: string;
    startTime: string;
    bookedBy: {
        _id: string; username: string; email: string
    };
    _id: string;
    userName: string;
    userEmail: string;
    slotId: string;
    bookedDate: string;
    paymentStatus: "Paid" | "Pending";
    location: "Virtual" | "Physical";
    locationDetails: string;
    status: 'Available' | 'Booked' | 'Cancelled';
    description: string;
}

interface BookedAppointmentsTableProps {
    appointments?: Booking | Booking[];
}

const BookedAppointmentsTable: React.FC<BookedAppointmentsTableProps> = ({ appointments }) => {
    const navigate = useNavigate();
    const sender = Store((state) => state.user)
    const  senderId = sender._id
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatReceiverId, setChatReceiverId] = useState('');

    const handleAddChat = async (chatReceiverId: string) => {
        try {
            console.log("senderId : ", sender._id)
            console.log("chatReceiverId : ", chatReceiverId)
            const allChats = await fetchChats(chatReceiverId);
            console.log("fetchChatss : ", allChats)
            const existingChat = allChats.find(
                (chat: { user1: string; user2: string; _id: string }) =>
                    (chat.user1 === sender._id && chat.user2 === chatReceiverId) ||
                    (chat.user1 === chatReceiverId && chat.user2 === sender._id)
            );
            console.log("existingChat : ", existingChat)
            if (existingChat) {
                handleSelectChat(existingChat);
            } else {
                const chatDetails = {
                    user1: sender._id,
                    user2: chatReceiverId,
                    lastMessage: '',
                };

                const res = await createChat(chatDetails);
                console.log("res-createChat : ", res)
                if (res?.data?.result) {
                    setSelectedChat(res.data.result);
                }

            }
        } catch (error) {
            console.error("Error handling chat creation:", error);
        }
    };

    const handleSelectChat = (chat: any) => {
        setSelectedChat(chat);
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Available':
                return 'bg-blue-100 text-blue-800';
            case 'Booked':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    const normalizedAppointments: Booking[] = Array.isArray(appointments) ? appointments : appointments ? [appointments] : [];

    console.log("**receiverId** : ", chatReceiverId)


    return (
        <div>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-3 border-b">Client</th>
                            <th className="px-6 py-3 border-b">Date</th>
                            <th className="px-6 py-3 border-b">Time</th>
                            <th className="px-6 py-3 border-b">Location</th>
                            <th className="px-6 py-3 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        {normalizedAppointments.length > 0 && Array.isArray(normalizedAppointments) ? (
                            normalizedAppointments.map((appointment, index) => (
                                <tr key={appointment._id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                                    <td className="px-6 py-3">{appointment.bookedBy.username}</td>
                                    <td className="px-6 py-3">{appointment.date}</td>
                                    <td className="px-6 py-3">{appointment.startTime}</td>
                                    <td className="px-6 py-3">{appointment.location}</td>
                                    <td className="px-6 py-3 flex gap-3">
                                        <Badge variant="secondary" className={getStatusColor(appointment.status)}>
                                            {appointment.status}
                                        </Badge>


                                        {/* Join Call Button */}
                                        {/* <button
                                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                            title="Join Call"
                                            onClick={() => navigate(`/videoCall?roomID=${appointment._id}`)}
                                        >
                                            <Video size={20} />
                                        </button> */}

                                        {/* Cancel Booking Button */}
                                        {/* <button
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                            title="Cancel Booking"
                                        >
                                            <XCircle size={20} />
                                        </button> */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-600">
                                    No booked appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* {isChatOpen && (
                <ChatWindow handleChat={handleAddChat} receiverId={chatReceiverId} />
            )} */}
        </div>
    );
};

export default BookedAppointmentsTable;
