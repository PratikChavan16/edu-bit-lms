import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

const data = [
  {
    name: "MVP Engineering University",
    domain: "mvp.edu.in",
    status: "Live",
    colleges: 7,
    storage: "420 GB",
    lastBackup: "2 hours ago",
  },
  {
    name: "Stellar Arts College",
    domain: "stellararts.edu",
    status: "Staging",
    colleges: 3,
    storage: "112 GB",
    lastBackup: "6 hours ago",
  },
  {
    name: "Greenfield Business School",
    domain: "greenfield.edu",
    status: "Live",
    colleges: 2,
    storage: "86 GB",
    lastBackup: "1 day ago",
  },
];

const statusMap: Record<string, "success" | "warning" | "secondary"> = {
  Live: "success",
  Staging: "warning",
  Suspended: "secondary",
};

export default function UniversitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Universities</h1>
          <p className="text-muted-foreground">Manage tenants, feature toggles, quotas, and provisioning.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import CSV</Button>
          <Button>Add university</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tenant overview</CardTitle>
          <CardDescription>Snapshot of all active and staging universities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Colleges</TableHead>
                <TableHead className="text-right">Storage</TableHead>
                <TableHead>Last backup</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.domain} className="hover:bg-muted/40">
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.domain}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[row.status] ?? "secondary"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{row.colleges}</TableCell>
                  <TableCell className="text-right">{row.storage}</TableCell>
                  <TableCell>{row.lastBackup}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
