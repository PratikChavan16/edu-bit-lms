'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{
    key: string;
    color?: string;
    name?: string;
  }>;
  height?: number;
  title?: string;
  loading?: boolean;
  stacked?: boolean;
}

export function BarChart({
  data,
  xKey,
  yKeys,
  height = 300,
  title,
  loading = false,
  stacked = false,
}: BarChartProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {title && (
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        )}
        <div
          className="animate-pulse rounded bg-gray-200"
          style={{ height }}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-2">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        <div
          className="flex items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50"
          style={{ height }}
        >
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((yKey, index) => (
            <Bar
              key={yKey.key}
              dataKey={yKey.key}
              fill={yKey.color || `hsl(${index * 60}, 70%, 50%)`}
              name={yKey.name || yKey.key}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
