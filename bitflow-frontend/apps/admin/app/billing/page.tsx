import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { ChartPreview } from "@bitflow/ui/chart-preview";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

const invoices = [
  { client: "MVP Engineering", amount: "₹3,45,000", status: "Paid", issued: "01 Oct 2025" },
  { client: "Stellar Group", amount: "₹2,10,000", status: "Pending", issued: "04 Oct 2025" },
  { client: "Greenfield", amount: "₹5,80,000", status: "Overdue", issued: "12 Sep 2025" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Billing overview</h1>
          <p className="text-muted-foreground">Track subscription revenue vs infrastructure spend.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download statement</Button>
          <Button>Create invoice</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs spend</CardTitle>
            <CardDescription>Past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartPreview label="₹" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Manual comments for finance team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Review AWS reserved instances before Q4.</p>
            <p>• Confirm tax compliance for Gulf region rollout.</p>
            <p>• Pending manual payment from Aurora Trust.</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice status</CardTitle>
          <CardDescription>High-level view of outbound invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued on</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.client}>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.issued}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
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
