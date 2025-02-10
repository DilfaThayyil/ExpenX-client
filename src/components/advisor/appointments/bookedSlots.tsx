import { XCircle, Video, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Store from '@/store/store'


interface Booking {
    date: string;
    endTime: string;
    startTime: string;
    bookedBy: {
        _id: any; username: string; email: string 
};
    _id: string;
    userName: string;
    userEmail: string;
    slotId: string;
    bookedDate: string;
    paymentStatus: "Paid" | "Pending";
    location: "Virtual" | "Physical";
    locationDetails: string;
    description: string;
}

interface BookedAppointmentsTableProps {
    appointments?: Booking | Booking[];
}

const BookedAppointmentsTable: React.FC<BookedAppointmentsTableProps> = ({ appointments }) => {
    const navigate = useNavigate();
    const advisor = Store((state)=>state.user)
    // const advisorId = advisor._id

    const normalizedAppointments: Booking[] = Array.isArray(appointments) ? appointments : appointments ? [appointments] : [];


    return (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-6 py-3 border-b">Name</th>
                        <th className="px-6 py-3 border-b">Date</th>
                        <th className="px-6 py-3 border-b">Time</th>
                        <th className="px-6 py-3 border-b">Location</th>
                        <th className="px-6 py-3 border-b">Actions</th>
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
                                    {/* Chat Button */}
                                    <button
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                        title="Start Messaging"
                                        onClick={()=>{
                                            // const chatId = appointment._id
                                            // const userId = appointment.bookedBy._id
                                            navigate(`/chat`)}}
                                    >
                                        <MessageCircle size={20} />
                                    </button>

                                    {/* Join Call Button */}
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                        title="Join Call"
                                        onClick={() => navigate(`/videoCall?roomID=${appointment._id}`)}
                                    >
                                        <Video size={20} />
                                    </button>

                                    {/* Cancel Booking Button */}
                                    <button
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                        title="Cancel Booking"
                                    >
                                        <XCircle size={20} />
                                    </button>
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
    );
};

export default BookedAppointmentsTable;
