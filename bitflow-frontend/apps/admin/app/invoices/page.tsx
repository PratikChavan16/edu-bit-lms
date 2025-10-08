import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

const drafts = [
  {
    title: "Invoice #INV-2045",
    client: "Aurora Trust",
    amount: "₹8,20,000",
    due: "24 Oct 2025",
  },
  {
    title: "Invoice #INV-2046",
    client: "Bright Future Network",
    amount: "₹6,10,000",
    due: "01 Nov 2025",
  },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground">Draft, send, and track invoices for each university tenant.</p>
        </div>
        <Button>Create invoice</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Draft invoices</CardTitle>
          <CardDescription>Review before sending to finance approvers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((draft) => (
                <TableRow key={draft.title}>
                  <TableCell className="font-medium">{draft.title}</TableCell>
                  <TableCell>{draft.client}</TableCell>
                  <TableCell>{draft.amount}</TableCell>
                  <TableCell>{draft.due}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">Send</Button>
                    </div>
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
