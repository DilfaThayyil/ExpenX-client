import React from 'react';
import { Slot } from '@/pages/user/types';
import SlotTableRow from './slotTableRow';

interface SlotTableProps {
  slots: Slot[];
  onBookSlot: (slotId: string) => void;
  onOpenReportModal: (slotId: string, advisorId: string) => void;
}

const SlotTable: React.FC<SlotTableProps> = ({ slots, onBookSlot, onOpenReportModal }) => {
  const tableHeaders = ["Advisor", "Date", "Time", "Fee", "Duration", "Location", "Status", "Action"];

  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No slots available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <div className="min-w-full">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slots.map((slot) => (
              <SlotTableRow 
                key={slot._id} 
                slot={slot} 
                onBookSlot={onBookSlot} 
                onOpenReportModal={onOpenReportModal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotTable;