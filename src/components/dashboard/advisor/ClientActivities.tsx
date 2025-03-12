import { Briefcase, ArrowUpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { fetchRecentClients } from "@/services/advisor/advisorService";
import { moneyColors } from "@/style/theme";
import { useEffect, useState } from "react";
import moment from "moment"

export default function ClientActivities({ advisorId }: { advisorId: string }) {
  const [recentActivity, setRecentActivity] = useState<
    { id: string; client: string; action: string; amount: string; time: string }[]
  >([]);

  useEffect(() => {
    const fetchRecentAppointments = async () => {
      try {
        const response = await fetchRecentClients(advisorId);
        const formattedActivities = response.map((slot: any) => ({
          id: slot._id,
          client: slot.bookedBy?.username || "Unknown",
          action: `Booked a slot at ${slot.startTime}`, 
          amount: "N/A",
          time: moment(slot.createdAt).fromNow(), 
        }));

        setRecentActivity(formattedActivities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchRecentAppointments();
  }, [advisorId]);

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div style={{ background: moneyColors.money.secondary }} className="h-1"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" style={{ color: moneyColors.money.secondary }} />
          <span>Recent Client Activities</span>
        </CardTitle>
        <CardDescription>Latest client financial milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
          ) : (
            <p className="text-center text-sm text-gray-500">No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: { client: string; action: string; amount: string; time: string } }) {
  return (
    <div
      className="flex justify-between items-center p-3 rounded-md transition-all duration-200 hover:translate-x-1"
      style={{
        backgroundColor: moneyColors.bg.muted,
        borderLeft: `3px solid ${moneyColors.money.secondary}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-full mt-1"
          style={{ backgroundColor: `${moneyColors.money.secondary}20` }} 
        >
          <ArrowUpCircle className="h-4 w-4" style={{ color: moneyColors.money.secondary }} />
        </div>
        <div>
          <h4 className="font-medium">{activity.client}</h4>
          <p className="text-sm" style={{ color: moneyColors.text.secondary }}>
            {activity.action}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium" style={{ color: moneyColors.money.secondary }}>
          {activity.amount}
        </div>
        <p className="text-xs" style={{ color: moneyColors.text.muted }}>
          {activity.time}
        </p>
      </div>
    </div>
  );
}
