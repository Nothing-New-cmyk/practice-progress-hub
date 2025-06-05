
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPreferencesService } from '@/services/userPreferences';
import { BarChart3, Calendar, Target, TrendingUp, Clock, Trophy } from 'lucide-react';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ open, onOpenChange }) => {
  const handleComplete = async () => {
    try {
      await UserPreferencesService.markOnboardingComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      onOpenChange(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard',
      description: 'Track your progress with comprehensive analytics and visual charts'
    },
    {
      icon: Calendar,
      title: 'Daily Logs',
      description: 'Log your daily coding practice, problems solved, and time spent'
    },
    {
      icon: Target,
      title: 'Weekly Goals',
      description: 'Set and track weekly goals to stay motivated and consistent'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Analyze your performance trends and identify areas for improvement'
    }
  ];

  const quickTips = [
    {
      icon: Clock,
      tip: 'Use the Quick Log button in the navbar to quickly log problems you solve'
    },
    {
      icon: Trophy,
      tip: 'Check your dashboard daily to see your progress and maintain streaks'
    },
    {
      icon: Target,
      tip: 'Set realistic weekly goals to build consistent coding habits'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            Welcome to DSA Tracker!
          </DialogTitle>
          <DialogDescription className="text-base">
            Your personal companion for tracking Data Structures and Algorithms progress.
            Let's get you started with a quick overview of the main features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Main Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Tips</h3>
            <div className="space-y-2">
              {quickTips.map((tip, index) => {
                const IconComponent = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <IconComponent className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{tip.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Getting Started Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">1</span>
                <span>Visit your <strong>Dashboard</strong> to see your current progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">2</span>
                <span>Start logging your practice in <strong>Daily Log</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">3</span>
                <span>Set your first goal in <strong>Weekly Goals</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">4</span>
                <span>Track your improvement in <strong>Analytics</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Skip for now
          </Button>
          <Button onClick={handleComplete}>
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
