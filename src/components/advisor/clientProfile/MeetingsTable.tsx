import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';

const MeetingsTable = ({meetings}) => {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Scheduled Meetings</CardTitle>
                    <Button variant="outline" size="sm" className="text-sm">
                        <Plus size={16} className="mr-1" />
                        New Meeting
                    </Button>
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
                                <th className="text-left py-3 px-4 font-medium">Status</th>
                                <th className="text-right py-3 px-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.map((meeting) => {
                                const meetingDateTime = new Date(`${meeting.date}T${meeting.endTime}`);
                                const isCompleted = meetingDateTime < new Date();
                                return ( 
                                    <tr key={meeting._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="py-3 px-4">{meeting.date}</td>
                                        <td className="py-3 px-4">{meeting.startTime}</td>
                                        <td className="py-3 px-4 font-medium">{meeting.description}</td>
                                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{meeting.status}</td>
                                        <td className="py-3 px-4">
                                            <Badge className={isCompleted ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                                                {isCompleted ? "Completed" : "Upcoming"}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <Button variant="outline" size="sm" className="text-sm">View All Meetings</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MeetingsTable;