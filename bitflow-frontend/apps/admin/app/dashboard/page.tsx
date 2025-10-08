import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";

const metrics = [
  {
    label: "Active universities",
    value: "18",
    delta: "+2 this month",
  },
  {
    label: "Pending approvals",
    value: "7",
    delta: "3 over SLA",
  },
  {
    label: "Sandbox spend",
    value: "₹4.2L",
    delta: "down 8%",
  },
  {
    label: "Support tickets",
    value: "12",
    delta: "5 high priority",
  },
];

const activities = [
  {
    title: "Payroll module enabled",
    description: "MVP Engineering College · 08:42",
  },
  {
    title: "Backup completed",
    description: "Stellar University · 07:30",
  },
  {
    title: "Invoice approved",
    description: "Greenfield Group · 07:05",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Aisha</h1>
          <p className="text-muted-foreground">You have 3 provisioning tasks awaiting review.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">View backlog</Button>
          <Button>Provision university</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-surface">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Real-time operational log</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.title} className="space-y-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Infra alerts</CardTitle>
            <CardDescription>Integrations monitored 24/7</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertRow title="MediaConvert" description="Encoding queue empty" variant="success" />
            <AlertRow title="Aurora" description="CPU usage 82%" variant="warning" />
            <AlertRow title="Redis" description="Failover preferred" variant="info" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type AlertRowProps = {
  title: string;
  description: string;
  variant?: "success" | "warning" | "danger" | "info";
};

function AlertRow({ title, description, variant = "info" }: AlertRowProps) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant={variant === "danger" ? "destructive" : variant === "warning" ? "warning" : variant === "success" ? "success" : "secondary"}>
          {variant}
        </Badge>
      </div>
    </div>
  );
}
