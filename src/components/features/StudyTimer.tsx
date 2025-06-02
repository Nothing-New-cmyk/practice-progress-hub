
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Clock } from 'lucide-react';

export const StudyTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    if (time > 0) {
      setSessionCount(count => count + 1);
    }
    setTime(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-500" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-mono font-bold text-indigo-600">
            {formatTime(time)}
          </div>
          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} size="sm" className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} size="sm" variant="outline" className="flex items-center gap-1">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={handleStop} size="sm" variant="outline" className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Sessions today: {sessionCount}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
