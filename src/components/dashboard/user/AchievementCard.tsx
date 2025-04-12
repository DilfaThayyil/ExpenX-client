import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award } from 'lucide-react';
import {AchievementCardProps} from './types'


const AchievementCard: React.FC<AchievementCardProps> = ({ 
  title, 
  description, 
  icon: Icon = Award,
  loading = false 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;