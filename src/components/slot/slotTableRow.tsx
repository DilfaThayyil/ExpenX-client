import React from 'react';
import { Slot } from '@/pages/user/types';

interface SlotTableRowProps {
  slot: Slot;
  onBookSlot: (slotId: string) => void;
  onOpenReportModal: (slotId: string, advisorId: string) => void;
}

const SlotTableRow: React.FC<SlotTableRowProps> = ({ slot, onBookSlot, onOpenReportModal }) => {
  const handleAction = () => {
    if (slot.status === "Available") {
      onBookSlot(slot._id);
    } else if (slot.status === "Booked") {
      onOpenReportModal(slot._id, slot.advisorId._id);
    }
  };

  return (
    <tr className="hover:shadow-md transition-shadow bg-white rounded-lg border border-gray-200 my-3">
      <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">{slot.advisorId.username.charAt(0)}</span>
        </div>
        {slot.advisorId.username}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{slot.date}</td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {slot.startTime}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
        <span className="px-3 py-1 rounded-md bg-green-100 text-green-800">
          ₹{slot.fee}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <span className="px-3 py-1 rounded-md bg-purple-100 text-purple-800">
          {slot.duration} m
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">{slot.location}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold
          ${slot.status === "Available" ? "bg-green-100 text-green-800" :
           slot.status === "Booked" ? "bg-blue-100 text-blue-800" :
           "bg-red-100 text-red-800"}
        `}>
          {slot.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors 
          ${slot.status === "Available"
            ? "bg-green-600 text-white hover:bg-green-700"
            : slot.status === "Booked"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
          onClick={handleAction}
          disabled={slot.status === "Cancelled"}
        >
          {slot.status === "Available"
            ? "Book Now"
            : slot.status === "Booked"
              ? "Report"
              : "Cancelled"}
        </button>
      </td>
    </tr>
  );
};

export default SlotTableRow;