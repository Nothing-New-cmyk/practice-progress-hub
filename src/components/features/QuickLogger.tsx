
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QuickLogger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName || !difficulty || !topic) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to database
    toast({
      title: "Problem logged!",
      description: `${problemName} has been added to your progress.`
    });

    // Reset form
    setProblemName('');
    setDifficulty('');
    setTopic('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button onClick={() => setIsOpen(true)} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Quick Log Problem
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Quick Log Problem</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Problem name"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arrays">Arrays</SelectItem>
                <SelectItem value="Strings">Strings</SelectItem>
                <SelectItem value="Trees">Trees</SelectItem>
                <SelectItem value="Graphs">Graphs</SelectItem>
                <SelectItem value="DP">Dynamic Programming</SelectItem>
                <SelectItem value="Two Pointers">Two Pointers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Log Problem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
