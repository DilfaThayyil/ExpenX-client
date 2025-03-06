import { useEffect, useState } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { fetchSlotsByUser } from '@/services/user/userService';
import Store from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmationModal from '@/components/modals/confirmationModal';
import Pagination from "@/components/admin/Pagination";
import ChatWindow from '@/components/chat/chat';
import { message } from 'antd'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/user/PaymentForm'
import { bookSlot, paymentInitiate } from '@/services/user/userService'
import { STRIPE_PUBLISHABLE_KEY } from '@/utility/env'
import ReportModal, { IReportData } from '@/components/modals/reportModal';


const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface Slot {
  advisorId: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
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
  const [advisorReport, setAdvisorReport] = useState<IReportData | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<{
    clientSecret: string;
    paymentId: string;
  } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [advisorList, setAdvisorList] = useState<{
    _id: string;
    username: string;
    email: string;
    profilePic: string
  }[]>([])
  const [showChat, setShowChat] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isPayModal, setIsPayModal] = useState<boolean>(false)
  const sender = Store((state) => state.user);
  const ITEMS_PER_PAGE = 5;
  const userId = sender._id;

  const fetchSlot = async () => {
    try {
      const response = await fetchSlotsByUser(userId, currentPage, ITEMS_PER_PAGE);
      console.log("response : ",response)
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
      message.error('Slot and user are required for booking');
      return;
    }
    setSelectedSlot(slotId);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (selectedSlot) {
        const advisorId = slots.find(slot => slot._id === selectedSlot)?.advisorId._id;
        console.log("1 paymentInitiate - parameters : ", selectedSlot, userId, advisorId, 100)
        if (!advisorId) throw new Error("Advisor ID not found");
        console.log("2 paymentInitiate - parameters : ", selectedSlot, userId, advisorId, 100)
        const response = await paymentInitiate(
          selectedSlot,
          userId,
          advisorId,
          100
        )
        console.log("response : ", response)
        setPaymentIntent(response);
        setIsPayModal(false)
      }
    } catch (error) {
      console.error('Error initiating payment', error);
      message.error('Error initiating payment');
    }
  };

  const handleShowChat = () => {
    const uniqueAdvisors = new Map()
    slots.forEach((slot) => {
      if (!uniqueAdvisors.has(slot.advisorId._id)) {
        uniqueAdvisors.set(slot.advisorId._id, slot.advisorId)
      }
    })
    const advisorArray = Array.from(uniqueAdvisors.values())
    console.log("Unique Advisors : ", advisorArray)
    setAdvisorList(advisorArray)
    setShowChat(true)
  }

  const handlePaymentSuccess = async () => {
    await bookSlot(selectedSlot!, userId)
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot._id === selectedSlot
          ? { ...slot, status: 'Booked', bookedBy: userId }
          : slot
      )
    )
    message.success('Payment successful and slot booked!');
    setPaymentIntent(null);
  }


  return (
    <Layout role="user">
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
          <ChatWindow receivers={advisorList} />
        </div>
      ) : (
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-3xl font-bold text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-3 text-blue-600" /> Slot Booking
                  </span>
                  <button
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                    title="Start Messaging"
                    onClick={handleShowChat}
                  >
                    <MessageCircle size={20} />
                  </button>
                </h1>
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
                              {slot.startTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slot.duration} mins</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slot.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                  ${slot.status === 'Available'
                                    ? 'bg-green-100 text-green-800'
                                    : slot.status === 'Booked'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'}`}>
                                  {slot.status}
                                </span>
                                {/* {slot.status === 'Booked' && (
                                  <button
                                    className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    title='Start Messaging'
                                    onClick={() => {
                                      const advisorId = slot.advisorId;
                                      console.log("**advisorId** : ", advisorId)
                                      setChatReceiverId(advisorId);
                                      setIsChatOpen(true);
                                    }}>
                                    <MessageCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
                                  </button>
                                )} */}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
    ${slot.status === 'Available'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : slot.status === 'Booked'
                                      ? 'bg-red-600 text-white hover:bg-red-700'
                                      : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                                onClick={() =>
                                  slot.status === 'Available'
                                    ? handleBookSlot(slot._id)
                                    : advisorReport?.status === 'pending'
                                      ? null
                                      : setIsReportModalOpen(true)
                                }
                                disabled={slot.status === 'Cancelled'}
                              >
                                {slot.status === 'Available'
                                  ? 'Book Now'
                                  : slot.status === 'Booked'
                                    ? 'Report'
                                    : 'Cancelled'}
                              </button>
                              {isReportModalOpen && (
                                <ReportModal
                                  isOpen={isReportModalOpen}
                                  onClose={() => setIsReportModalOpen(false)}
                                  advisorId={slot.advisorId._id}
                                  userId={userId}
                                  setReport={setAdvisorReport}
                                  slotId={slot._id}
                                />
                              )}
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
          <ConfirmationModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmBooking}
            slot={selectedSlot || ''}
          />
          {paymentIntent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Complete Payment</h2>
                  <button
                    onClick={() => setPaymentIntent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.clientSecret }}>
                  <PaymentForm
                    clientSecret={paymentIntent.clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            </div>
          )}
        </div>
      )}

    </Layout>
  );
};

export default SlotBooking;