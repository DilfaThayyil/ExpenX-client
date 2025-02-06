import BookedAppointmentsTable from "@/components/advisor/appointments/bookedSlots";
import { getBookedSlotsForAdvisor } from "@/services/advisor/advisorService";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Layout from "@/layout/Sidebar";
import Store from "@/store/store";


interface Booking {
  date: string;
  endTime: string;
  startTime: string;
  bookedBy: any;
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

const Clients: React.FC = () => {
  const [bookedAppointments, setBookedAppointments] = useState<Booking[]>([]);
  const advisor = Store((state) => state.user);
  const advisorId = advisor?._id;

  useEffect(() => {
    if (!advisorId) return;
  
    const fetchBookedSlots = async () => {
      try {
        const response = await getBookedSlotsForAdvisor(advisorId);
        console.log("Fetched Booked Slots:", response);
  
        const slots = response?.slots;
        setBookedAppointments(Array.isArray(slots) ? slots : slots ? [slots] : []);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedAppointments([]);
      }
    };
  
    fetchBookedSlots();
  }, [advisorId]);
  

  return (
    <Layout role="advisor">
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="mr-3 text-blue-600" /> Client Management
        </h1>

        <div className="bg-white shadow-md rounded-lg p-1">
          <div className="bg-white shadow-md rounded-lg">
            <BookedAppointmentsTable appointments={bookedAppointments} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
