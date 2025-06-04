
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, Target, Calendar } from 'lucide-react';

interface QuickLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    problemsSolved: '',
    timeSpent: '',
    topic: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual data submission to backend
    console.log('Quick log entry:', formData);
    
    toast({
      title: "Daily log saved",
      description: "Your practice session has been logged successfully.",
    });

    // Reset form and close modal
    setFormData({
      problemsSolved: '',
      timeSpent: '',
      topic: '',
      notes: ''
    });
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Log Entry
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="problems" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Problems Solved
              </Label>
              <Input
                id="problems"
                type="number"
                min="0"
                placeholder="5"
                value={formData.problemsSolved}
                onChange={(e) => handleInputChange('problemsSolved', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time (minutes)
              </Label>
              <Input
                id="time"
                type="number"
                min="0"
                placeholder="120"
                value={formData.timeSpent}
                onChange={(e) => handleInputChange('timeSpent', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Main Topic</Label>
            <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrays">Arrays</SelectItem>
                <SelectItem value="strings">Strings</SelectItem>
                <SelectItem value="linked-lists">Linked Lists</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="graphs">Graphs</SelectItem>
                <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                <SelectItem value="sorting">Sorting</SelectItem>
                <SelectItem value="searching">Searching</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="What did you learn? Any challenges faced?"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Log Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
