/**
 * Bar Chart Component
 * 
 * A reusable bar chart component for visualizing categorical data.
 */
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface BarChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisDataKey?: string;
  height?: number;
  hideGrid?: boolean;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  barSize?: number;
  stacked?: boolean;
}

const DEFAULT_COLORS = ['#1a9dff', '#d62828', '#90be6d', '#f9c74f', '#f8961e'];

const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  dataKeys,
  colors = DEFAULT_COLORS,
  xAxisDataKey = 'name',
  height = 300,
  hideGrid = false,
  hideLegend = false,
  hideTooltip = false,
  barSize = 20,
  stacked = false
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        barSize={barSize}
      >
        {!hideGrid && <CartesianGrid strokeDasharray="3 3" stroke="#333" />}
        <XAxis 
          dataKey={xAxisDataKey} 
          stroke="#666"
          tick={{ fill: '#999' }}
        />
        <YAxis stroke="#666" tick={{ fill: '#999' }} />
        {!hideTooltip && <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111', 
            borderColor: '#333',
            color: '#eee'
          }} 
        />}
        {!hideLegend && <Legend />}
        
        {dataKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[i % colors.length]}
            stackId={stacked ? 'a' : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
