
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface QuickLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ open, onOpenChange }) => {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [platform, setPlatform] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemName || !difficulty || !timeSpent || !platform) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Quick log entry:', {
        problemName,
        difficulty,
        timeSpent,
        platform,
        notes,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Problem logged!",
        description: `${problemName} has been added to your daily log.`
      });

      // Reset form
      setProblemName('');
      setDifficulty('');
      setTimeSpent('');
      setPlatform('');
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log problem. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Log Problem
          </DialogTitle>
          <DialogDescription>
            Quickly log a problem you just solved. This will be added to today's daily log.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="problem-name">Problem Name *</Label>
            <Input
              id="problem-name"
              placeholder="e.g., Two Sum, Binary Tree Inorder Traversal"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-spent">Time Spent (min) *</Label>
              <Input
                id="time-spent"
                type="number"
                placeholder="30"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                disabled={loading}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select value={platform} onValueChange={setPlatform} disabled={loading}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LeetCode">LeetCode</SelectItem>
                <SelectItem value="HackerRank">HackerRank</SelectItem>
                <SelectItem value="Codeforces">Codeforces</SelectItem>
                <SelectItem value="AtCoder">AtCoder</SelectItem>
                <SelectItem value="CodeChef">CodeChef</SelectItem>
                <SelectItem value="GeeksforGeeks">GeeksforGeeks</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your approach, learnings, or struggles..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Problem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
