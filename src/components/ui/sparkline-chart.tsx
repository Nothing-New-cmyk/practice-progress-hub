
import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineChartProps {
  data: Array<{ value: number }>
  color?: string
  height?: number
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  color = '#3B82F6',
  height = 40
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
