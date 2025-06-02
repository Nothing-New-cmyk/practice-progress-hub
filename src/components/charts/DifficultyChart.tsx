
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DifficultyData {
  difficulty: string;
  count: number;
  color: string;
}

interface DifficultyChartProps {
  data: DifficultyData[];
}

export const DifficultyChart = ({ data }: DifficultyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problems by Difficulty</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
