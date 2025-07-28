/**
 * Pie Chart Component
 * 
 * A reusable pie chart component for visualizing proportional data.
 */
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  colors?: string[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  startAngle?: number;
  endAngle?: number;
  labelLine?: boolean;
  label?: boolean | React.ReactElement | ((props: any) => React.ReactNode);
}

const DEFAULT_COLORS = ['#1a9dff', '#d62828', '#90be6d', '#f9c74f', '#f8961e'];

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  hideLegend = false,
  hideTooltip = false,
  startAngle = 0,
  endAngle = 360,
  labelLine = true,
  label = true
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={labelLine}
          label={label}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        {!hideTooltip && <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111', 
            borderColor: '#333',
            color: '#eee'
          }} 
        />}
        {!hideLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
