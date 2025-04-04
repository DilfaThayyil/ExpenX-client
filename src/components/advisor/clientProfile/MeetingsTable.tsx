import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { EmptyComponent } from '@/components/empty/Empty';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react'

export interface IUser {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
}

export interface IMeeting {
    _id: string;
    advisorId: IUser;
    bookedBy: IUser | null;
    date: string;
    startTime: string;
    endTime: string;
    fee: number;
    duration: number;
    maxBookings: number;
    status: "Available" | "Booked" | "Cancelled";
    location: "Virtual" | "Physical";
    locationDetails: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const getStatusColor = (status: IMeeting['status']) => {
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

interface MeetingsTableProps {
    meetings: IMeeting[]
}

const MeetingsTable: React.FC<MeetingsTableProps> = ({ meetings }) => {
    const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | null>(null)
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Scheduled Meetings</CardTitle>
                    {/* <Button variant="outline" size="sm" className="text-sm">
                        <Plus size={16} className="mr-1" />
                        New Meeting
                    </Button> */}
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-slate-500 text-sm">
                                <th className="text-left py-3 px-4 font-medium">Date</th>
                                <th className="text-left py-3 px-4 font-medium">Time</th>
                                <th className="text-left py-3 px-4 font-medium">Topic</th>
                                <th className="text-left py-3 px-4 font-medium">Notes</th>
                                <th className="text-left py-3 px-4 font-medium">Location</th>
                                <th className="text-right py-3 px-4 font-medium">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.length > 0 ? (
                                meetings.map((meeting) => {
                                    const meetingDateTime = new Date(`${meeting.date}T${meeting.endTime}`);
                                    const isCompleted = meetingDateTime < new Date();
                                    return (
                                        <tr key={meeting._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="py-3 px-4">{meeting.date}</td>
                                            <td className="py-3 px-4">{meeting.startTime}</td>
                                            <td className="py-3 px-4 font-medium">{meeting.description}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                                                    {isCompleted ? "Completed" : "Not completed"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{meeting.location}</td>
                                            <td className="py-3 px-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedMeeting(meeting)}>
                                                    <MoreHorizontal size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} >
                                        <EmptyComponent />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Slot Details</DialogTitle>
                            </DialogHeader>
                            {selectedMeeting && (
                                <div className="grid gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                <Badge className={getStatusColor(selectedMeeting.status)}>
                                                    {selectedMeeting.status}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Date</p>
                                                    <p className="text-sm">{selectedMeeting.date}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Duration</p>
                                                    <p className="text-sm">{selectedMeeting.duration} min</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Start Time</p>
                                                    <p className="text-sm">{selectedMeeting.startTime}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Fee</p>
                                                    <p className="text-sm">{selectedMeeting.fee}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Location</p>
                                                <p className="text-sm">
                                                    {selectedMeeting.location}
                                                    {selectedMeeting.locationDetails && ` - ${selectedMeeting.locationDetails}`}
                                                </p>
                                            </div>

                                            {selectedMeeting.status === 'Booked' && selectedMeeting.bookedBy && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Booked By</p>
                                                    <p className="text-sm">{selectedMeeting.bookedBy.username}</p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Max Bookings</p>
                                                <p className="text-sm">{selectedMeeting.maxBookings}</p>
                                            </div>

                                            {selectedMeeting.description && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                                    <p className="text-sm">{selectedMeeting.description}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
                {/* <div className="mt-4">
                    <Button variant="outline" size="sm" className="text-sm">View All Meetings</Button>
                </div> */}
            </CardContent>
        </Card>
    );
};

export default MeetingsTable;