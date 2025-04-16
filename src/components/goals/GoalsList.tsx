import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getGoals,createGoal,updateGoal,deleteGoal,updateGoalProgress, Goal } from '@/services/goals/goalsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import GoalForm from './GoalForm';
import Store from '@/store/store'
import useShowToast from '@/customHook/showToaster'

const GoalsList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const user = Store((state)=>state.user)
  const Toaster = useShowToast()

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals(user._id);
      setGoals(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (goalData: Omit<Goal, '_id'>) => {
    try {
      await createGoal(user._id,goalData);
      Toaster('Goal created successfully','success')
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      setError('Failed to create goal');
      console.error(err);
    }
  };

  const handleUpdateGoal = async (id: string, goalData: Partial<Goal>) => {
    try {
      await updateGoal(id, goalData);
      Toaster('Goal updated successfully','success')
      setShowForm(false)
      setEditingGoal(null);
      fetchGoals();
    } catch (err) {
      setError('Failed to update goal');
      console.error(err);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this goal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await deleteGoal(id);
        fetchGoals();
        Swal.fire('Deleted!', 'The goal has been deleted.', 'success');
      } catch (err) {
        setError('Failed to delete goal');
        console.error(err);
        Swal.fire('Error!', 'Failed to delete goal.', 'error');
      }
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleUpdateProgress = async (id: string, amount: number) => {
    try {
      await updateGoalProgress(id, amount);
      Toaster('Goal updated successfully','success')
      fetchGoals();
    } catch (err) {
      setError('Failed to update progress');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-100 p-3 rounded text-red-700">{error}</div>}
      
      {showForm ? (
        <GoalForm 
          onSubmit={editingGoal ? 
            (data) => handleUpdateGoal(editingGoal._id!, data) :
            handleCreateGoal
          }
          onCancel={() => {
            setShowForm(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal || undefined}
        />
      ) : (
        <Button onClick={() => setShowForm(true)}>Add New Goal</Button>
      )}

      {loading ? (
        <div>Loading goals...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No financial goals yet. Click 'Add New Goal' to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={(goal.current / goal.target) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>₹{goal.current.toLocaleString()}</span>
                        <span>₹{goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateProgress(goal._id!, 100)}
                      >
                        Add ₹100
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteGoal(goal._id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsList;