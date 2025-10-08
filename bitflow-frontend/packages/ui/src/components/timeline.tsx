import * as React from "react";
import { cn } from "../lib/cn";
import { Dot } from "lucide-react";
import { Badge } from "./badge";

export type TimelineItem = {
  time: string;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "destructive" | "info";
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

const variantMap: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-primary",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => (
        <li key={`${item.title}-${item.time}`} className="flex items-start gap-4">
          <div className="pt-1 text-xs font-medium text-muted-foreground">{item.time}</div>
          <div className="relative flex-1 rounded-lg border border-border bg-surface px-4 py-3">
            <Dot className={cn("absolute -left-3 top-3 h-6 w-6", variantMap[item.variant ?? "info"])}/>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.variant ? <Badge variant={item.variant === "destructive" ? "destructive" : item.variant === "warning" ? "warning" : item.variant === "success" ? "success" : "secondary"}> {item.variant}</Badge> : null}
            </div>
            {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
