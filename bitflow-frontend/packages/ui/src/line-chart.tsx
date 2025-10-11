'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  height?: number;
  title?: string;
  loading?: boolean;
}

export function LineChart({
  data,
  xKey,
  yKeys,
  height = 300,
  title,
  loading = false,
}: LineChartProps) {
  if (loading) {
    return (
      <div className="w-full" style={{ height }}>
        <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: '#e5e7eb' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {yKeys.map((yKey) => (
            <Line
              key={yKey.key}
              type="monotone"
              dataKey={yKey.key}
              stroke={yKey.color}
              strokeWidth={2}
              name={yKey.label}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
