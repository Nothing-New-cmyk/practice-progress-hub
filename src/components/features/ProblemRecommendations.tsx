
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Clock, ExternalLink } from 'lucide-react';

interface Problem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
  reason: string;
}

const mockProblems: Problem[] = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    url: "https://leetcode.com/problems/two-sum/",
    reason: "Build confidence with fundamentals"
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    url: "https://leetcode.com/problems/valid-parentheses/",
    reason: "Strengthen stack concepts"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Two Pointers",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    reason: "Improve sliding window technique"
  }
];

export const ProblemRecommendations = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Recommended Problems
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProblems.map((problem, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm sm:text-base">{problem.title}</h4>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {problem.topic}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{problem.reason}</p>
                </div>
                <Button asChild size="sm" className="w-full sm:w-auto">
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Solve
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
