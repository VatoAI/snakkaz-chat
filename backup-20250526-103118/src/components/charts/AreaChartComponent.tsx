/**
 * Area Chart Component
 * 
 * A reusable area chart component for visualizing time series data.
 */
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface AreaChartProps {
  data: any[];
  dataKeys: string[];
  colors?: string[];
  xAxisDataKey?: string;
  height?: number;
  hideGrid?: boolean;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  areaType?: 'linear' | 'monotone' | 'step';
  stackId?: string;
}

const DEFAULT_COLORS = ['#1a9dff', '#d62828', '#90be6d', '#f9c74f', '#f8961e'];

const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  dataKeys,
  colors = DEFAULT_COLORS,
  xAxisDataKey = 'name',
  height = 300,
  hideGrid = false,
  hideLegend = false,
  hideTooltip = false,
  areaType = 'monotone',
  stackId
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
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
          <Area
            key={key}
            type={areaType}
            dataKey={key}
            stroke={colors[i % colors.length]}
            fill={colors[i % colors.length]}
            fillOpacity={0.3}
            stackId={stackId}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
