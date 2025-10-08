import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";
import { Input } from "@bitflow/ui/input";

const logs = [
  {
    id: "LOG-98234",
    actor: "Aisha Khan",
    role: "Super Admin",
    action: "Enabled payroll module",
    timestamp: "07 Oct · 08:42",
    severity: "Medium",
  },
  {
    id: "LOG-98212",
    actor: "System",
    role: "Automation",
    action: "Ran nightly backup",
    timestamp: "07 Oct · 04:00",
    severity: "Low",
  },
  {
    id: "LOG-98177",
    actor: "Bitflow Ops",
    role: "Support",
    action: "Updated AWS credentials",
    timestamp: "06 Oct · 19:22",
    severity: "High",
  },
];

const severityVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  Low: "success",
  Medium: "warning",
  High: "destructive",
};

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Audit log</h1>
          <p className="text-muted-foreground">Immutable timeline of configuration changes and data operations.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search by actor or action" className="min-w-[260px]" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent entries</CardTitle>
          <CardDescription>Last 24 hours of activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.id}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={severityVariant[log.severity] ?? "secondary"}>{log.severity}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
