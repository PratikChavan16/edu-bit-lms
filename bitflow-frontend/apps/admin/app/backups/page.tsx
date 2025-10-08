import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Timeline } from "@bitflow/ui/timeline";

const timeline = [
  {
    time: "08:00",
    title: "Aurora University",
    description: "Snapshot completed in 12m",
    variant: "success" as const,
  },
  {
    time: "06:00",
    title: "MVP Engineering",
    description: "Snapshot completed in 9m",
    variant: "success" as const,
  },
  {
    time: "02:00",
    title: "Stellar Arts (retry)",
    description: "First attempt failed · auto retry scheduled",
    variant: "warning" as const,
  },
];

export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Backups</h1>
          <p className="text-muted-foreground">Monitor automated snapshots and trigger manual backups.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download latest</Button>
          <Button variant="destructive">Trigger backup</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent snapshots</CardTitle>
          <CardDescription>Timeline from the last 12 hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline items={timeline} />
        </CardContent>
      </Card>
    </div>
  );
}
