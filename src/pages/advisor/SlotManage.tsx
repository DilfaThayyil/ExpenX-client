import SlotCreationModal from '@/components/advisor/appointments/addSlotModal';
import SlotTable from '@/components/advisor/appointments/SlotTable';
import { createSlot, fetchSlots, updateSlot, deleteSlot } from '@/services/advisor/advisorService';
import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Layout from '@/layout/Sidebar';
import Store from '@/store/store';
import Pagination from "@/components/admin/Pagination"; 
import useShowToast from '@/customHook/showToaster'



interface Slot {
  _id: string;
  advisorId?:{
    id:string;
    username:string;
    email:string;
    profilePic:string
  },
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: 'Available' | 'Booked' | 'Cancelled';
  location: 'Virtual' | 'Physical';
  locationDetails?: string;
  description?: string;
}

const SlotManage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const advisor = Store(state=>state.user)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const Toaster = useShowToast()

  const fetchSlot = async () => {
    try {
      const response = await fetchSlots(advisor._id,currentPage,ITEMS_PER_PAGE)
      console.log("response : ", response.data)
      const {slots,totalPages} = response.data
      setSlots(slots)
      setTotalPages(totalPages)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSlot()
  }, [currentPage])

  const createNewSlot = async (newSlot: Slot) => {
    try {
      const id = advisor._id
      console.log("advisorId : ",id)
      console.log("newSlot-frontent: ", newSlot)
      const response = await createSlot(id,newSlot)
      console.log("newSlot : ", response.Slot)
      Toaster('Slot created successfully','success')
      setSlots([...slots, response.Slot]);    
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateSlot = async (updatedSlot: Slot) => {
    try {
      console.log("updatingId : ",updatedSlot._id)
      console.log("updatingSlot : ",updatedSlot)
      const response = await updateSlot(updatedSlot,updatedSlot._id);
      console.log("response-slot : ",response.slot)
      setSlots(slots.map(slot => (slot._id === updatedSlot._id ? response.slot : slot)));
      Toaster(response.message,'success')
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      Toaster('Failed to update slot','error')
    }
  };


  const handleDeleteSlot = async(slotId: string) => {
    try{
      console.log("deletingId: ",slotId)
      const response = await deleteSlot(slotId)
      setSlots(slots.filter(slot => slot._id !== slotId));
      console.log("response : ",response)
      Toaster('Slot deleted successfully','success')
    }catch(err){
      console.error(err)
      Toaster('Failed to delete slot','error')
    }
  };

  return (
    <Layout role='advisor'>

      <div className="container mx-auto   min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="mr-3 text-blue-600" /> Slot Management
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
        >
          <Plus className="mr-2" /> Create New Slot
        </button>

        {/* Slot Creation Modal */}
        {isCreateModalOpen && (
          <SlotCreationModal
            onClose={() => {
              setIsCreateModalOpen(false);
              setSelectedSlot(null);
            }}
            onCreate={createNewSlot}
            onUpdate={handleUpdateSlot}
            existingSlot={selectedSlot}
          />

        )}

        {/* Slots Table */}
          <div className="bg-white shadow-md rounded-lg">
            <SlotTable
              slots={slots}
              onEdit={(slot) => {
                setSelectedSlot(slot);
                setIsCreateModalOpen(true);
              }}              
              onDelete={handleDeleteSlot}
            />
          </div>

          <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Booked Appointments Table */}
        {/* <div className="mt-8 bg-white shadow-md rounded-lg">
          <BookedAppointmentsTable appointments={bookedAppointments} />
        </div> */}
      </div>
    </Layout>
  );

};


export default SlotManage;