import React, { useEffect, useState } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { fetchSlots } from '@/services/advisor/advisorService';
import { bookSlot } from '@/services/user/userService';
import Store from '@/store/store';
import { toast } from 'react-toastify';
import ConfirmationModal from '@/components/modals/confirmationModal';
import Pagination from "@/components/admin/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {useNavigate} from 'react-router-dom'


interface Slot {
  advisorId: any;
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
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const user = Store((state) => state.user);
  const userId = user._id;
  const navigate = useNavigate()

  const fetchSlot = async () => {
    try {
      const response = await fetchSlots(currentPage, ITEMS_PER_PAGE);
      setSlots(response.data.slots);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlot();
  }, [currentPage]);

  const handleBookSlot = (slotId: string) => {
    if (!slotId || !userId) {
      toast.error('Slot and user are required for booking');
      return;
    }
    setSelectedSlot(slotId);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (selectedSlot) {
        await bookSlot(selectedSlot, userId);
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === selectedSlot
              ? { ...slot, status: 'Booked', bookedBy: userId }
              : slot
          )
        );
        toast.success('Slot booked successfully');
      }
    } catch (error) {
      console.error('Error booking slot', error);
      toast.error('Error booking slot');
    }
  };

  return (
    <Layout role="user">
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-3xl font-bold text-gray-800">
              <Calendar className="text-blue-600 h-8 w-8" />
              <span>Slot Booking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              {slots.length > 0 ? (
                <div className="min-w-full">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {slots.map((slot) => (
                        <tr key={slot._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slot.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slot.duration} mins</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slot.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                ${slot.status === 'Available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'}`}>
                                {slot.status}
                              </span>
                              {slot.status === 'Booked' && (
                                <button 
                                className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                title='Start Messaging'
                                  onClick={() =>{
                                    const advisorId = slot.advisorId
                                    navigate(`/chat?userId=${advisorId}`)}}>
                                  <MessageCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${slot.status === 'Available'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                              onClick={() => handleBookSlot(slot._id)}
                              disabled={slot.status !== 'Available'}
                            >
                              {slot.status === 'Available' ? 'Book Now' : 'Booked'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No slots available</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        slot={selectedSlot || ''}
      />
    </Layout>
  );
};

export default SlotBooking;