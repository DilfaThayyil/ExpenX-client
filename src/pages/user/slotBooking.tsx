import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import {fetchSlots} from '@/services/advisor/advisorService';
import {bookSlot} from '@/services/user/userService'
import Store from '@/store/store';
import { toast } from 'react-toastify';


interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  bookedBy: string;
  location: 'Virtual' | 'Physical';
  locationDetails?: string;
  description?: string;
}

const SlotBooking: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([])
  const user = Store(state=>state.user)
  const userId = user._id

  const fetchSlot = async () => {
    try {
      const data = await fetchSlots()
      console.log("slots : ", data.slots)
      setSlots(data.slots)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSlot()
  }, [])

  const handleBookSlot = async (slotId: string) => {
    try {
      if(!slotId || !userId){
        toast.error('slot and user are required for booking')
      }
      const response = await bookSlot(slotId, userId)
      console.log("response : ",response)
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === slotId ? { ...slot, status: "Booked", bookedBy: userId } : slot
        )
      );
    } catch (error) {
      console.error("Error booking slot", error);
    }
  };

  return (
    <Layout role="user">
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="mr-3 text-blue-600" /> Slot Booking
        </h1>

        {/* Slots Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {slots.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Time</th>
                  <th className="border p-3">Duration</th>
                  <th className="border p-3">Location</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id} className="text-center">
                    <td className="border p-3">{slot.date}</td>
                    <td className="border p-3">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="border p-3">{slot.duration} mins</td>
                    <td className="border p-3">{slot.location}</td>
                    <td
                      className={`border p-3 ${
                        slot.status === "Available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {slot.status}
                    </td>
                    <td className="border p-3">
                      <button
                        className={`px-4 py-2 rounded ${
                          slot.status === "Available"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                        onClick={() => handleBookSlot(slot._id)}
                        disabled={slot.status !== "Available"}
                      >
                        {slot.status === "Available" ? "Book Now" : "Booked"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 text-center">No slots available</p>
          )}
        </div>
      </div>
    </Layout>
  );

};


export default SlotBooking;