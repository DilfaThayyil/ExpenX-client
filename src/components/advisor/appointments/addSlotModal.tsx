import React, { useState, useEffect } from "react";
import FormInput from "@/components/InputField";
import { toast } from "react-toastify";

interface Slot {
  _id: string ;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: "Available" | "Booked" | "Cancelled";
  location: "Virtual" | "Physical";
  locationDetails?: string;
  description?: string;
}

const SlotCreationModal: React.FC<{
  onClose: () => void;
  onCreate: (id:string,slot: Slot) => void;
  onUpdate: (slot: Slot) => void;
  existingSlot: Slot | null
}> = ({ onClose, onCreate, onUpdate, existingSlot }) => {
  const [slotData, setSlotData] = useState<Slot>({
    _id: existingSlot?._id || "", 
    date: existingSlot?.date || "",
    startTime: existingSlot?.startTime || "",
    endTime: existingSlot?.endTime || "",
    duration: existingSlot?.duration || 30,
    maxBookings: existingSlot?.maxBookings || 1,
    status: existingSlot?.status || "Available",
    location: existingSlot?.location || "Virtual",
    locationDetails: existingSlot?.locationDetails || "",
    description: existingSlot?.description || "",
});


  useEffect(() => {
    if (existingSlot) {
      setSlotData(existingSlot);
    }
  }, [existingSlot]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setSlotData({ ...slotData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Basic validation
    if (!slotData.date || !slotData.startTime || !slotData.endTime) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    // Validate time
    const start = new Date(`1970-01-01T${slotData.startTime}:00`);
    const end = new Date(`1970-01-01T${slotData.endTime}:00`);
    if (start >= end) {
      toast.error("Start time must be before end time.");
      return;
    }
  
    if (slotData.location === "Physical" && !slotData.locationDetails) {
      toast.error("Please provide location details for a physical session.");
      return;
    }

    if(existingSlot){
      onUpdate(slotData)
    }else{
      onCreate('',slotData);
    }
    
    onClose();
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg overflow-auto max-h-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {existingSlot ? "Edit Slot" : "Create New Slot"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="date"
              name="date"
              type="date"
              label="Date"
              value={slotData.date}
              onChange={handleChange}
              required
            />
            <FormInput
              id="startTime"
              name="startTime"
              type="time"
              label="Start Time"
              value={slotData.startTime}
              onChange={handleChange}
              required
            />
            <FormInput
              id="endTime"
              name="endTime"
              type="time"
              label="End Time"
              value={slotData.endTime}
              onChange={handleChange}
              required
            />
            <select
              name="duration"
              value={slotData.duration}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value={30}>30 min</option>
              <option value={60}>1 hour</option>
            </select>
            <FormInput
              id="maxBookings"
              name="maxBookings"
              type="number"
              label="Max Bookings"
              value={slotData.maxBookings.toString()}
              onChange={handleChange}
              required
            />
            <select
              name="status"
              value={slotData.status}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="Available">Available</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              name="location"
              value={slotData.location}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="Virtual">Virtual</option>
              <option value="Physical">Physical</option>
            </select>
            {slotData.location === "Physical" && (
              <FormInput
                id="locationDetails"
                name="locationDetails"
                type="text"
                label="Location Details"
                value={slotData.locationDetails || ""}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <textarea
            name="description"
            placeholder="Session Notes"
            value={slotData.description}
            onChange={handleChange}
            className="w-full border p-2"
          ></textarea>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {existingSlot ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotCreationModal;
