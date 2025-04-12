import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';
import {SpendingInsightsProps} from './types'


const SpendingInsights: React.FC<SpendingInsightsProps> = ({ insights, loading = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <p>Loading insights...</p>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`h-10 w-10 ${insight.iconBgColor || 'bg-emerald-100'} rounded-full flex items-center justify-center`}>
                  <insight.icon className={`h-5 w-5 ${insight.iconColor || 'text-emerald-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <span className="font-bold">
                      {loading ? '...' : insight.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  {insight.trend && insight.trendValue && (
                    <div className={`flex items-center gap-1 mt-2 ${
                      insight.trend === 'up' ? 'text-emerald-600' : 
                      insight.trend === 'down' ? 'text-red-600' : ''
                    }`}>
                      {insight.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                       insight.trend === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
                      <span className="text-sm font-medium">{insight.trendValue}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingInsights;