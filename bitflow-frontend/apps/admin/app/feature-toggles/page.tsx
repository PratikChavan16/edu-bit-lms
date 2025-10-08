import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Switch } from "@bitflow/ui/switch";

const toggles = [
  {
    code: "LIBRARY_VIDEO_STREAMING",
    name: "Library video streaming",
    description: "Enable MediaConvert pipeline for hosted lectures.",
    state: true,
    scope: "University overrides allowed",
  },
  {
    code: "PAYROLL_MODULE",
    name: "Payroll module",
    description: "Expose payroll and reconciliation features.",
    state: false,
    scope: "Requires finance subscription",
  },
  {
    code: "ACCESSIBILITY_HIGH_CONTRAST",
    name: "High-contrast theme",
    description: "Allow tenants to enable AA+ contrast mode for users.",
    state: true,
    scope: "Global rollout",
  },
];

export default function FeatureTogglesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Feature toggles</h1>
          <p className="text-muted-foreground">Control module exposure and preview features across tenants.</p>
        </div>
        <Button variant="outline">Create feature</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {toggles.map((toggle) => (
          <Card key={toggle.code} className="bg-surface">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>{toggle.name}</CardTitle>
                <CardDescription>{toggle.description}</CardDescription>
              </div>
              <Switch checked={toggle.state} aria-readonly />
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{toggle.scope}</span>
              <Badge variant="outline">{toggle.code}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
