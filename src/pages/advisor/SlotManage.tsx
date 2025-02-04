import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus } from 'lucide-react';
// import BookedAppointmentsTable from '@/components/advisor/appointments/bookedSlots';
import SlotCreationModal from '@/components/advisor/appointments/addSlotModal';
import SlotTable from '@/components/advisor/appointments/SlotTable';
import Layout from '@/layout/Sidebar';
import { createSlot, fetchSlots, updateSlot } from '@/services/advisor/advisorService';
import { toast } from 'react-toastify';

// Types for Slot and Booking
interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: 'Active' | 'Inactive';
  location: 'Virtual' | 'Physical';
  locationDetails?: string;
  description?: string;
}

// interface Booking {
//   id: string;
//   userName: string;
//   userEmail: string;
//   slotId: string;
//   paymentStatus: 'Paid' | 'Pending';
// }

const SlotManage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  // const [bookedAppointments, setBookedAppointments] = useState<Booking[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

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

  const createNewSlot = async (newSlot: Slot) => {
    try {
      console.log("newSlot-frontent: ", newSlot)
      const response = await createSlot(newSlot)
      console.log("newSlot : ", response.slot)
      toast.success("Slot created succesfully")
      setSlots([...slots, response.slot]);
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
      toast.success("Slot updated successfully");
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update slot");
    }
  };


  const deleteSlot = (slotId: string) => {
    setSlots(slots.filter(slot => slot._id !== slotId));
  };

  return (
    <Layout role='advisor'>

      <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <Calendar className="mr-3 text-blue-600" /> Slot Management
        </h1>

        {/* Dashboard Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-green-600" /> Upcoming Appointments
            </h2>
            <p className="text-gray-500">{bookedAppointments.length} appointments</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-blue-600" /> Available Slots
            </h2>
            <p className="text-gray-500">{slots.length} slots</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
          </div>
        </div> */}
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
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="bg-white shadow-md rounded-lg">
            <SlotTable
              slots={slots}
              onEdit={(slot) => {
                setSelectedSlot(slot);
                setIsCreateModalOpen(true);
              }}              
              onDelete={deleteSlot}
            />
          </div>
        </div>

        {/* Booked Appointments Table */}
        {/* <div className="mt-8 bg-white shadow-md rounded-lg">
          <BookedAppointmentsTable appointments={bookedAppointments} />
        </div> */}
      </div>
    </Layout>
  );

};


export default SlotManage;