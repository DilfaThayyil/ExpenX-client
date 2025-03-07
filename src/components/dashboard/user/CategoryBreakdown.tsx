import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ExpenseCategory {
  category: string;
  amount: number;
  color: string;
}

interface CategoryBreakdownProps {
  categories: ExpenseCategory[];
  loading?: boolean;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories, loading = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p>Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="60%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
            {/* ✅ Scrollable list for categories */}
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.category}</span>
                  </div>
                  <span className="font-medium">${category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p>No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
