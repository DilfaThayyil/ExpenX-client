import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {BudgetOverviewProps} from './types'


const BudgetOverview: React.FC<BudgetOverviewProps> = ({ 
  totalSpent, 
//   budget, 
//   progress, 
  loading = false 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expense Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-emerald-600">
              ₹{loading ? '...' : totalSpent.toFixed(2)}
              </p>
            </div>
            {/* <div className="text-right">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-xl font-semibold">
                ${loading ? '...' : budget.toFixed(2)}
              </p>
            </div> */}
          </div>
          {/* <Progress 
            value={loading ? 0 : progress} 
            className="h-2" 
          /> */}
          {/* <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${progress}% of monthly budget used`}
          </p> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;