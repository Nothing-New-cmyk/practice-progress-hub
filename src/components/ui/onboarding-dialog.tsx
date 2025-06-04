
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPreferencesService } from '@/services/userPreferences';
import { 
  CheckCircle, 
  Target, 
  Calendar, 
  BarChart3, 
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to DSA Tracker! 🎉",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Your personal companion for mastering Data Structures and Algorithms. 
            Let's take a quick tour of the main features to get you started.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Track Progress</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Set Goals</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard - Your Command Center",
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The dashboard gives you a complete overview of your coding journey:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Weekly progress and streak tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Interactive heatmap calendar</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Topic mastery breakdown</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Achievement badges and goals</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Daily & Contest Logs",
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Keep track of your daily practice and contest performances:
          </p>
          <div className="grid gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Daily Log</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Record problems solved, time spent, and topics covered each day.
              </p>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-sm">Contest Log</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Track contest rankings, problems solved, and performance insights.
              </p>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: "Goals & Analytics",
      icon: Target,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Set weekly goals and analyze your progress with detailed insights:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Set and track weekly coding goals</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">View performance analytics and trends</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Identify strengths and improvement areas</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              💡 Pro Tip: Use the Quick Log button in the navbar for fast daily entries!
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = async () => {
    try {
      await UserPreferencesService.setPreferences({ hasSeenOnboarding: true });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving onboarding preference:', error);
      onOpenChange(false);
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <currentStepData.icon className="h-5 w-5 text-primary" />
              {currentStepData.title}
            </DialogTitle>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {currentStepData.content}
        </div>

        {/* Progress Indicator */}
        <div className="flex space-x-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="flex items-center gap-2">
              {isLastStep ? (
                <>
                  Get Started
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
