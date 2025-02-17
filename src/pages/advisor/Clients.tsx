import React, { useState, useEffect } from "react";
import BookedAppointmentsTable from "@/components/advisor/appointments/bookedSlots";
import { getBookedSlotsForAdvisor } from "@/services/advisor/advisorService";
import { Calendar, MessageCircle, X } from "lucide-react";
import Layout from "@/layout/Sidebar";
import Store from "@/store/store";
import Pagination from "@/components/admin/Pagination";
import ChatWindow from "@/components/chat/chat";

interface Booking {
  date: string;
  endTime: string;
  startTime: string;
  bookedBy: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  _id: string;
  userName: string;
  userEmail: string;
  slotId: string;
  bookedDate: string;
  paymentStatus: "Paid" | "Pending";
  location: "Virtual" | "Physical";
  status: "Available" | "Booked" | "Cancelled";
  locationDetails: string;
  description: string;
}

const Clients: React.FC = () => {
  const [bookedAppointments, setBookedAppointments] = useState<Booking[]>([]);
  const [clientList, setClientsList] = useState<{ 
    _id: string; 
    username: string; 
    email: string; 
    profilePic: string;
  }[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const advisor = Store((state) => state.user);
  const advisorId = advisor?._id;
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (!advisorId) return;

    const fetchBookedSlots = async () => {
      try {
        const response = await getBookedSlotsForAdvisor(advisorId, currentPage, ITEMS_PER_PAGE);
        console.log("Fetched Booked Slots:", response.data);

        const { bookedSlots, totalPages } = response.data;
        setBookedAppointments(Array.isArray(bookedSlots) ? bookedSlots : bookedSlots ? [bookedSlots] : []);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedAppointments([]);
      }
    };

    fetchBookedSlots();
  }, [advisorId, currentPage]);


  const handleShowChat = () => {
    const uniqueClients = new Map();
    
    bookedAppointments.forEach((appointment) => {
      if (!uniqueClients.has(appointment.bookedBy._id)) {
        uniqueClients.set(appointment.bookedBy._id, appointment.bookedBy);
      }
    });
  
    const clientsArray = Array.from(uniqueClients.values());
    console.log("Unique Clients:", clientsArray);
  
    setClientsList(clientsArray);
    setShowChat(true)
  }

  return (
    <Layout role="advisor">
      {/* If showChat is true, show full-screen chat */}
      {showChat ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Close Button */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={20} />
          </button>
          {/* Full-Screen Chat Window */}
          <ChatWindow receivers={clientList} />
        </div>
      ) : (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-3 text-blue-600" /> Client Management
            </span>
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              title="Start Messaging"
              onClick={handleShowChat}
            >
              <MessageCircle size={20} />
            </button>
          </h1>

          <div className="bg-white shadow-md rounded-lg p-1">
            <BookedAppointmentsTable appointments={bookedAppointments} />
          </div>

          {/* Pagination Component */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </Layout>
  );
};

export default Clients;
