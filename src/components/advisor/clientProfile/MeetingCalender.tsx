import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MeetingCalendar = ({ meetings }) => {
    const [viewMode, setViewMode] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get days in the current month
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Move between day, week, and month
    const handlePrev = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (viewMode === "day") newDate.setDate(newDate.getDate() - 1);
            else if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
            else newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNext = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (viewMode === "day") newDate.setDate(newDate.getDate() + 1);
            else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
            else newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const renderCalendarDays = () => {
        if (viewMode === "day") {
            // Render a single day
            const meetingsForDay = meetings.filter(meeting => 
                new Date(meeting.date).toDateString() === currentDate.toDateString()
            );

            return (
                <div className="p-4 text-center border rounded-lg bg-blue-100 text-blue-800">
                    {currentDate.toDateString()} <br />
                    {meetingsForDay.length > 0 ? meetingsForDay.map(m => <p key={m.id}>{m.description}</p>) : "No meetings"}
                </div>
            );
        } else if (viewMode === "week") {
            // Get current week's start date (Sunday)
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

            return Array.from({ length: 7 }, (_, i) => {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                const meetingsForDay = meetings.filter(meeting => 
                    new Date(meeting.date).toDateString() === day.toDateString()
                );

                return (
                    <div key={i} className="p-2 border rounded-md text-center">
                        {day.toLocaleDateString("default", { weekday: "short", day: "numeric" })} <br />
                        {meetingsForDay.length > 0 ? <span className="text-blue-800 font-bold">{meetingsForDay.length} Meeting(s)</span> : "No meetings"}
                    </div>
                );
            });
        } else {
            // Default to month view
            const totalDays = getDaysInMonth(currentDate);
            const meetingsByDate = meetings.reduce((acc, meeting) => {
                const meetingDate = new Date(meeting.date);
                if (
                    meetingDate.getMonth() === currentDate.getMonth() &&
                    meetingDate.getFullYear() === currentDate.getFullYear()
                ) {
                    const day = meetingDate.getDate();
                    acc[day] = (acc[day] || []).concat(meeting);
                }
                return acc;
            }, {});

            return Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const hasMeeting = meetingsByDate[day]?.length > 0;

                return (
                    <div
                        key={day}
                        className={`py-2 rounded-full text-center cursor-pointer ${
                            hasMeeting ? "bg-blue-100 text-blue-800 font-bold" : "hover:bg-slate-100"
                        }`}
                        title={hasMeeting ? `Meetings: ${meetingsByDate[day]?.length}` : ""}
                    >
                        {day}
                    </div>
                );
            });
        }
    };

    return (
        <Card className="mt-6 overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Meeting Calendar</CardTitle>
                    <Select defaultValue={viewMode} onValueChange={setViewMode}>
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center text-sm mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <Button variant="ghost" size="sm" onClick={handlePrev}>
                            <ChevronLeft size={16} />
                        </Button>
                        <div className="font-medium">
                            {viewMode === "day" && currentDate.toDateString()}
                            {viewMode === "week" &&
                                `Week of ${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString()}`
                            }
                            {viewMode === "month" && currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleNext}>
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {viewMode === "month" && (
                            <>
                                <div className="py-1 text-slate-500">Sun</div>
                                <div className="py-1 text-slate-500">Mon</div>
                                <div className="py-1 text-slate-500">Tue</div>
                                <div className="py-1 text-slate-500">Wed</div>
                                <div className="py-1 text-slate-500">Thu</div>
                                <div className="py-1 text-slate-500">Fri</div>
                                <div className="py-1 text-slate-500">Sat</div>
                            </>
                        )}
                    </div>
                    <div className={viewMode === "month" ? "grid grid-cols-7 gap-1" : "grid grid-cols-1 gap-2"}>
                        {renderCalendarDays()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MeetingCalendar;
