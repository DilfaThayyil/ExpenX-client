import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import useShowToast from '@/customHook/showToaster'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { cancelSlot } from '@/services/advisor/advisorService'
import Store from '@/store/store'

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: 'Available' | 'Booked' | 'Cancelled';
    bookedBy?: {
        _id: string;
        username: string;
        email: string
    };
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
    const Toast = useShowToast()
    const advisorId = Store((state) => state.user._id)
    const handleCancel = async (slotId: string, userId: string | undefined) => {
        try {
            const response = await cancelSlot(slotId, advisorId, userId);
            console.log("res-cancelSlot : ", response)
            Toast(response.message, 'success');
        } catch (error) {
            Toast("Error cancelling slot.", "error");
        }
    };

    const getStatusColor = (status: Slot['status']) => {
        switch (status) {
            case 'Available':
                return 'bg-blue-100 text-blue-800';
            case 'Booked':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Time</th>
                        <th className="p-4 text-left">Fee</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Location</th>
                        <th className="p-4 text-left">Duration</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {slots.map(slot => (
                        <tr key={slot._id} className="border-b">
                            <td className="p-4">{slot.date}</td>
                            <td className="p-4">{slot.startTime}</td>
                            <td className="p-4">{slot.fee}</td>
                            <td className="p-4">
                                <Badge variant="secondary" className={getStatusColor(slot.status)}>
                                    {slot.status}
                                </Badge>
                            </td>
                            <td className="p-4">{slot.location}</td>
                            <td className="p-4">{slot.duration} minutes</td>
                            <td className="p-4 flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedSlot(slot)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                {slot.status === "Available" && (
                                    <Button variant="ghost" size="icon" onClick={() => setSlotToDelete(slot._id)}>
                                        <Trash2 className="text-red-500 h-4 w-4" />
                                    </Button>
                                )}
                                {slot.status === "Booked" && new Date(slot.date) >= new Date() && (
                                    <Button variant="ghost" onClick={() => handleCancel(slot._id, slot.bookedBy?._id)}>
                                        <Trash2 className="text-red-500 h-4 w-4" />
                                        Cancel
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Slot Details</DialogTitle>
                    </DialogHeader>
                    {selectedSlot && (
                        <div className="grid gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        <Badge className={getStatusColor(selectedSlot.status)}>
                                            {selectedSlot.status}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date</p>
                                            <p className="text-sm">{selectedSlot.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Duration</p>
                                            <p className="text-sm">{selectedSlot.duration} min</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Start Time</p>
                                            <p className="text-sm">{selectedSlot.startTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Fee</p>
                                            <p className="text-sm">{selectedSlot.fee}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p className="text-sm">
                                            {selectedSlot.location}
                                            {selectedSlot.locationDetails && ` - ${selectedSlot.locationDetails}`}
                                        </p>
                                    </div>

                                    {selectedSlot.status === 'Booked' && selectedSlot.bookedBy && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Booked By</p>
                                            <p className="text-sm">{selectedSlot.bookedBy.email}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Max Bookings</p>
                                        <p className="text-sm">{selectedSlot.maxBookings}</p>
                                    </div>

                                    {selectedSlot.description && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-sm">{selectedSlot.description}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!slotToDelete} onOpenChange={() => setSlotToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This slot will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (slotToDelete) {
                                    onDelete(slotToDelete);
                                    setSlotToDelete(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default SlotTable;