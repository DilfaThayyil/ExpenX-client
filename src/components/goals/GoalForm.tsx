import React, { useState } from 'react';
import { Goal } from '@/services/goals/goalsService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, '_id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Goal;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Goal, '_id'>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    target: initialData?.target || 0,
    current: initialData?.current || 0,
    deadline: initialData?.deadline ? 
      new Date(initialData.deadline).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    category: initialData?.category || 'savings'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (formData.target <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
      setError(null);
    } catch (err) {
      setError('Error saving goal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Goal' : 'Create New Goal'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <div className="bg-red-100 p-3 rounded text-red-700">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., New Car, Emergency Fund"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Details about your financial goal"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Amount ($)</Label>
              <Input
                id="target"
                name="target"
                type="number"
                min="0"
                step="0.01"
                value={formData.target}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current">Current Amount ($)</Label>
              <Input
                id="current"
                name="current"
                type="number"
                min="0"
                step="0.01"
                value={formData.current}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="debt">Debt Repayment</SelectItem>
                  <SelectItem value="purchase">Major Purchase</SelectItem>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Goal' : 'Create Goal'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GoalForm;