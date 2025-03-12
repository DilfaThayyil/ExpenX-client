import { useEffect,useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {comingAppointments} from '@/services/advisor/advisorService'
import { moneyColors } from "@/style/theme";

interface Appointment {
  _id: string;
  bookedBy: {
    username: string;
  };
  date: string;
  startTime: string;
  description: string;
}

export default function AppointmentsList({advisorId}:{advisorId:string}) {
  const [appointments,setAppointments] = useState<Appointment[]>([])

  useEffect(()=>{
    const fetchAppointments = async()=>{
      try{
        const response = await comingAppointments(advisorId)
        setAppointments(response.upComingAppointments)
      }catch(err){
        console.error(err)
      }
    }
    fetchAppointments()
  },[])

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div style={{ background: moneyColors.money.primary }} className="h-1"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" style={{ color: moneyColors.money.primary }} />
          <span>Upcoming Appointments</span>
        </CardTitle>
        <CardDescription>Your scheduled client meetings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appt) => (
            <AppointmentItem key={appt._id} appointment={appt} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentItem({ appointment}:{appointment:Appointment}) {
  return (
    <div 
      className="flex justify-between items-center p-3 rounded-md transition-all duration-200 hover:translate-x-1"
      style={{ 
        backgroundColor: moneyColors.bg.muted,
        borderLeft: `3px solid ${moneyColors.money.primary}`
      }}
    >
      <div>
        <h4 className="font-medium">{appointment.bookedBy.username}</h4>
        <p className="text-sm" style={{ color: moneyColors.text.secondary }}>{appointment.description}</p>
      </div>
      <div 
        className="text-sm px-2 py-1 rounded" 
        style={{ 
          backgroundColor: moneyColors.bg.highlight,
          color: moneyColors.money.primary
        }}
      >
        {appointment.date}
      </div>
    </div>
  );
}