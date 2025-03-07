// src/components/dashboard/RecentActivity.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from 'lucide-react';

interface Activity {
  id: number | string;
  type: string;
  description: string;
  amount: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, loading = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p>Loading recent activities...</p>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-600">{activity.timestamp}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${activity.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p>No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;