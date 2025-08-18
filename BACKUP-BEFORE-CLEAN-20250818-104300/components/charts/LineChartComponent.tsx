/**
 * Line Chart Component
 * 
 * A reusable line chart component for visualizing trend data.
 */
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface LineChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisDataKey?: string;
  height?: number;
  hideGrid?: boolean;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  lineType?: 'linear' | 'monotone' | 'step' | 'basis';
  dotSize?: number;
  hideDots?: boolean;
}

const DEFAULT_COLORS = ['#1a9dff', '#d62828', '#90be6d', '#f9c74f', '#f8961e'];

const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  dataKeys,
  colors = DEFAULT_COLORS,
  xAxisDataKey = 'name',
  height = 300,
  hideGrid = false,
  hideLegend = false,
  hideTooltip = false,
  lineType = 'monotone',
  dotSize = 4,
  hideDots = false
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
          <Line
            key={key}
            type={lineType}
            dataKey={key}
            stroke={colors[i % colors.length]}
            activeDot={{ r: dotSize + 2 }}
            dot={hideDots ? false : { r: dotSize }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
