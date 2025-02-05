import { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    maxBookings: number;
    status: 'Available' | 'Booked' | 'Cancelled';
    bookedBy?: string;
    location: 'Virtual' | 'Physical';
    locationDetails?: string;
    description?: string;
}

const SlotTable: React.FC<{
    slots: Slot[];
    onEdit: (slot: Slot) => void;
    onDelete: (slotId: string) => void;
}> = ({ slots, onEdit, onDelete }) => {
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Start Time</th>
                        <th className="p-4 text-left">End Time</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map(slot => (
                        <tr key={slot._id} className="border-b">
                            <td className="p-4">{slot.date}</td>
                            <td className="p-4">{slot.startTime}</td>
                            <td className="p-4">{slot.endTime}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded ${slot.status === 'Available' ? 'bg-blue-100 text-blue-800' : slot.status === 'Booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {slot.status}
                                </span>
                            </td>
                            <td className="p-4 flex space-x-2">
                                <button onClick={() => setSelectedSlot(slot)} className="text-gray-600 hover:text-gray-800">
                                    <Eye size={20} />
                                </button>
                                <button onClick={() => onEdit(slot)} className="text-blue-600 hover:text-blue-800">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => setSlotToDelete(slot._id)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Slot Details</h2>
                        <p><strong>Date:</strong> {selectedSlot.date}</p>
                        <p><strong>Start Time:</strong> {selectedSlot.startTime}</p>
                        <p><strong>End Time:</strong> {selectedSlot.endTime}</p>
                        <p><strong>Duration:</strong> {selectedSlot.duration} min</p>
                        <p><strong>Max Bookings:</strong> {selectedSlot.maxBookings}</p>
                        <p><strong>Status:</strong> {selectedSlot.status}</p>
                        {selectedSlot.status === 'Booked' && selectedSlot.bookedBy && (
                        <p><strong>Booked By:</strong> {selectedSlot.bookedBy}</p>
                        )}
                        <p><strong>Location:</strong> {selectedSlot.location} {selectedSlot.locationDetails ? `- ${selectedSlot.locationDetails}` : ''}</p>
                        <p><strong>Description:</strong> {selectedSlot.description || 'N/A'}</p>
                        <button onClick={() => setSelectedSlot(null)} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                    </div>
                </div>
            )}

            {slotToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this slot? This action cannot be undone.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    onDelete(slotToDelete);
                                    setSlotToDelete(null);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setSlotToDelete(null)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SlotTable;
