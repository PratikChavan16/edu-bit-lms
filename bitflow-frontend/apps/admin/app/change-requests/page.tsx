import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";

const columns = ["Pending", "In review", "Approved", "Rejected"] as const;

const data = {
  Pending: [
    {
      title: "Enable payroll for MVP Engineering",
      requester: "N. Varma",
      impact: "₹1.2L / month",
    },
    {
      title: "Increase storage quota",
      requester: "S. Patel",
      impact: "₹25k / month",
    },
  ],
  "In review": [
    {
      title: "Launch student chatbot",
      requester: "Bitflow Labs",
      impact: "Preview"
    },
  ],
  Approved: [
    {
      title: "Switch billing cycle to quarterly",
      requester: "F. Rao",
      impact: "Completed",
    },
  ],
  Rejected: [],
};

export default function ChangeRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Change requests</h1>
          <p className="text-muted-foreground">Track provisioning, billing, and feature toggle requests.</p>
        </div>
        <Button variant="outline">Download report</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <Card key={column} className="bg-surface">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base font-semibold">
                <span>{column}</span>
                <Badge variant="secondary">{data[column].length}</Badge>
              </CardTitle>
              <CardDescription>Requests currently {column.toLowerCase()}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data[column].length === 0 ? (
                <p className="text-sm text-muted-foreground">No items right now.</p>
              ) : (
                data[column].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Requested by {item.requester}</p>
                    <p className="mt-2 text-xs text-primary">Impact: {item.impact}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
