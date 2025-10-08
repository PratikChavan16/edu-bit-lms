import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitflow/ui/card";
import { Button } from "@bitflow/ui/button";
import { Input } from "@bitflow/ui/input";
import { Switch } from "@bitflow/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Update preferences for notifications, accessibility, and language.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Make sure your contact details are correct.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Full name
            <Input defaultValue="Riya Sharma" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            Contact number
            <Input defaultValue="+91 98765 43210" />
          </label>
          <label className="space-y-2 text-sm font-medium sm:col-span-2">
            Email address
            <Input defaultValue="riya.sharma@mvpec.edu" type="email" />
          </label>
          <div className="sm:col-span-2">
            <Button>Save profile</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>These settings sync across devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PreferenceRow title="Push notifications" description="Receive alerts for notices and results." defaultChecked />
          <PreferenceRow title="Email summaries" description="Get weekly digest of updates." />
          <PreferenceRow title="Dark mode" description="Use system preference by default." />
          <PreferenceRow title="High contrast" description="Increase contrast for better readability." />
        </CardContent>
      </Card>
    </div>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  defaultChecked?: boolean;
};

function PreferenceRow({ title, description, defaultChecked }: PreferenceRowProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} aria-readonly />
    </label>
  );
}
