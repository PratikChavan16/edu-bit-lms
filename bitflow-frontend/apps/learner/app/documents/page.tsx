import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Badge } from "@bitflow/ui/badge";

const folders = [
  {
    name: "Admin requested",
    description: "Upload documents requested by your college.",
    storage: "120MB / 150MB",
    due: "2 pending",
  },
  {
    name: "Personal",
    description: "Keep personal notes and certificates here.",
    storage: "80MB / 300MB",
    due: "All clear",
  },
];

const pending = [
  {
    document: "Aadhaar card",
    due: "Due in 3 days",
    instructions: "Upload PDF, max 2 MB",
  },
  {
    document: "Internship letter",
    due: "Due in 7 days",
    instructions: "Upload scanned copy",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-muted-foreground">Manage uploads requested by admins and keep your personal records.</p>
        </div>
        <Button>Upload document</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {folders.map((folder) => (
          <Card key={folder.name}>
            <CardHeader>
              <CardTitle>{folder.name}</CardTitle>
              <CardDescription>{folder.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Storage: {folder.storage}</p>
              <Badge variant={folder.due === "All clear" ? "success" : "warning"}>{folder.due}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending uploads</CardTitle>
          <CardDescription>Complete these to avoid escalations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.map((item) => (
            <div key={item.document} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-sm font-medium">{item.document}</p>
              <p className="text-xs text-muted-foreground">{item.instructions}</p>
              <Badge variant="warning" className="mt-2 w-fit">{item.due}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
