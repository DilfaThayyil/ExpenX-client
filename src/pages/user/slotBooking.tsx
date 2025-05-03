import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, X } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import { bookSlot, paymentInitiate } from '@/services/user/userService';
import Store from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmationModal from '@/components/modals/confirmationModal';
import Pagination from "@/components/admin/Pagination";
import ChatWindow from '@/components/chat/chat';
import { message } from 'antd';
import ReportModal from '@/components/modals/reportModal';
import { IReportData } from '@/components/modals/types';
import { useSlotFiltering } from '@/hooks/use-slotFiltering';

import SlotFilters from '@/components/slot/slotFilter';
import SlotTable from '@/components/slot/slotTable';
import PaymentModal from '@/components/slot/paymentModal';

const ITEMS_PER_PAGE = 3;

const SlotBooking: React.FC = () => {
  const sender = Store((state) => state.user);
  const userId = sender._id;
  const [showChat, setShowChat] = useState<boolean>(false);
  const [advisorList, setAdvisorList] = useState<{
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  }[]>([]);
  
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<{
    clientSecret: string;
    paymentId: string;
  } | null>(null);
  
  const [advisorReport, setAdvisorReport] = useState<IReportData | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportAdvisorId, setReportAdvisorId] = useState<string>('');
  const [reportSlotId, setReportSlotId] = useState<string>('');

  const {
    slots,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    filterStatus,
    filterLocation,
    startDateFilter,
    endDateFilter,
    setCurrentPage,
    handleSearchChange,
    setFilterStatus,
    setFilterLocation,
    setStartDateFilter,
    setEndDateFilter,
    resetFilters,
    updateSlotStatus
  } = useSlotFiltering({ 
    userId, 
    itemsPerPage: ITEMS_PER_PAGE 
  });

  useEffect(() => {
    if (slots.length > 0) {
      const uniqueAdvisors = new Map();
      slots.forEach((slot: { advisorId: { _id: any; }; }) => {
        if (!uniqueAdvisors.has(slot.advisorId._id)) {
          uniqueAdvisors.set(slot.advisorId._id, slot.advisorId);
        }
      });
      const advisorArray = Array.from(uniqueAdvisors.values());
      setAdvisorList(advisorArray);
    }
  }, [slots]);

  const handleShowChat = () => {
    setShowChat(true);
  };

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
        const slot = slots.find((slot: { _id: string; }) => slot._id === selectedSlot);
        if (!slot) throw new Error("Slot not found");
        
        const advisorId = slot.advisorId._id;
        if (!advisorId) throw new Error("Advisor ID not found");
        
        const response = await paymentInitiate(
          selectedSlot,
          userId,
          advisorId,
          slot.fee 
        );
        setPaymentIntent(response);
        setIsModalOpen(false); 
      }
    } catch (error) {
      console.error('Error initiating payment', error);
      message.error('Error initiating payment');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (!selectedSlot) return;
      
      await bookSlot(selectedSlot, userId);
      updateSlotStatus(selectedSlot, 'Booked');
      
      message.success('Payment successful and slot booked!');
      setPaymentIntent(null);
    } catch (error: any) {
      console.error("Error during slot booking", error);
      setPaymentIntent(null);
      if (error.response && error.response.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("An unexpected error occurred while booking the slot.");
      }
    }
  };

  const handleOpenReportModal = (slotId: string, advisorId: string) => {
    setReportSlotId(slotId);
    setReportAdvisorId(advisorId);
    setIsReportModalOpen(true);
  };

  return (
    <Layout role="user">
      {showChat ? (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={20} />
          </button>
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
              <SlotFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterLocation={filterLocation}
                setFilterLocation={setFilterLocation}
                startDateFilter={startDateFilter}
                setStartDateFilter={setStartDateFilter}
                endDateFilter={endDateFilter}
                setEndDateFilter={setEndDateFilter}
                resetFilters={resetFilters}
                filteredCount={slots.length}
                totalCount={slots.length}
              />

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Loading slots...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 text-lg">{error}</p>
                </div>
              ) : (
                <SlotTable
                  slots={slots}
                  onBookSlot={handleBookSlot}
                  onOpenReportModal={handleOpenReportModal}
                />
              )}

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

          <PaymentModal
            isOpen={!!paymentIntent}
            onClose={() => setPaymentIntent(null)}
            clientSecret={paymentIntent?.clientSecret || null}
            paymentId={paymentIntent?.paymentId || null}
            onSuccess={handlePaymentSuccess}
          />

          {isReportModalOpen && (
            <ReportModal
              isOpen={isReportModalOpen}
              onClose={() => setIsReportModalOpen(false)}
              advisorId={reportAdvisorId}
              userId={userId}
              setReport={setAdvisorReport}
              slotId={reportSlotId}
              advisorReport={advisorReport}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default SlotBooking;