"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "../lib/cn";

const defaultData = [
  { name: "Apr", revenue: 120, cost: 95 },
  { name: "May", revenue: 132, cost: 100 },
  { name: "Jun", revenue: 158, cost: 110 },
  { name: "Jul", revenue: 180, cost: 124 },
  { name: "Aug", revenue: 205, cost: 132 },
  { name: "Sep", revenue: 198, cost: 140 },
  { name: "Oct", revenue: 220, cost: 146 },
];

type ChartPreviewProps = {
  data?: Array<{ name: string; revenue: number; cost: number }>;
  className?: string;
  label?: string;
};

export function ChartPreview({ data = defaultData, className, label = "₹" }: ChartPreviewProps) {
  return (
    <div className={cn("h-64 w-full rounded-xl border border-border bg-surface px-4 py-6", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${label}${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--surface))",
              borderRadius: "16px",
              border: "1px solid hsl(var(--border))",
            }}
          />
          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#revenue)" />
          <Area type="monotone" dataKey="cost" stroke="hsl(var(--secondary))" fillOpacity={0.2} fill="hsl(var(--secondary))" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
