
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Circle, Clock } from 'lucide-react';

interface StudyWeek {
  week: number;
  topic: string;
  problems: number;
  completed: number;
  difficulty: string;
  estimatedHours: number;
}

const studyPlan: StudyWeek[] = [
  { week: 1, topic: "Arrays & Strings", problems: 15, completed: 12, difficulty: "Easy-Medium", estimatedHours: 10 },
  { week: 2, topic: "Two Pointers", problems: 12, completed: 8, difficulty: "Easy-Medium", estimatedHours: 8 },
  { week: 3, topic: "Sliding Window", problems: 10, completed: 3, difficulty: "Medium", estimatedHours: 12 },
  { week: 4, topic: "Stack & Queue", problems: 8, completed: 0, difficulty: "Easy-Medium", estimatedHours: 6 },
];

export const StudyPlan = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          4-Week Study Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studyPlan.map((week) => {
            const progress = (week.completed / week.problems) * 100;
            const isCompleted = week.completed === week.problems;
            const isCurrent = week.completed > 0 && !isCompleted;
            
            return (
              <div key={week.week} className="p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-medium">Week {week.week}: {week.topic}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {week.problems} problems
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {week.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {week.estimatedHours}h
                        </div>
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge className="bg-blue-100 text-blue-800 w-fit">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{week.completed}/{week.problems}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
        <Button className="w-full mt-4" variant="outline">
          Generate New Plan
        </Button>
      </CardContent>
    </Card>
  );
};
