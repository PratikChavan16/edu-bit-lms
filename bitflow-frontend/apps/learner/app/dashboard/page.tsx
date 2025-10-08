import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { Button } from "@bitflow/ui/button";
import { Separator } from "@bitflow/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

const upcomingLectures = [
  {
    subject: "Advanced Mathematics",
    time: "09:30 AM",
    venue: "Room A104",
    faculty: "Dr. Mehta",
  },
  {
    subject: "Thermodynamics",
    time: "11:15 AM",
    venue: "Lab 203",
    faculty: "Prof. Salvi",
  },
  {
    subject: "Materials Science",
    time: "02:00 PM",
    venue: "Room C402",
    faculty: "Dr. Iyer",
  },
];

const libraryQuickLinks = [
  { title: "Thermodynamics notes", subject: "Mechanical", updated: "2d ago" },
  { title: "Lab safety checklist", subject: "Common", updated: "4d ago" },
  { title: "MATLAB shortcuts", subject: "Computer", updated: "1w ago" },
];

const recentResults = [
  { assessment: "Mid-term Mechanics", subject: "Mechanical", score: "82%", status: "Pass" },
  { assessment: "Lab practical", subject: "Electronics", score: "Pending", status: "In review" },
  { assessment: "Quiz #5", subject: "Mathematics", score: "92%", status: "Pass" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-surface px-6 py-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tuesday, 7 October 2025</p>
            <h1 className="text-3xl font-semibold">Hi Riya, welcome back!</h1>
            <p className="text-muted-foreground">You have 3 classes and 1 assignment due today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">View timetable</Button>
            <Button>Start assignment</Button>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Attendance" value="92%" trend="On track" />
          <StatPill label="Assignments" value="1 due" trend="Submit by 8 PM" />
          <StatPill label="Library storage" value="240MB / 300MB" trend="80% used" />
          <StatPill label="Fee status" value="Paid" trend="Next due Jan 2026" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming lectures</CardTitle>
            <CardDescription>Your next three classes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLectures.map((lecture) => (
              <div key={lecture.subject} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
                <div>
                  <p className="text-sm font-medium">{lecture.subject}</p>
                  <p className="text-xs text-muted-foreground">{lecture.faculty} · {lecture.venue}</p>
                </div>
                <Badge variant="outline">{lecture.time}</Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full">
              View full timetable
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-surface">
          <CardHeader>
            <CardTitle>Important notices</CardTitle>
            <CardDescription>From your admin and faculty.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground">
            <Notice text="Project showcase submissions due Friday." />
            <Notice text="Upload internship letter in Documents." />
            <Notice text="College fest registrations open now." />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Library quick links</CardTitle>
            <CardDescription>Resources you’ve saved recently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {libraryQuickLinks.map((resource) => (
              <div key={resource.title} className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-sm font-medium">{resource.title}</p>
                <p className="text-xs text-muted-foreground">{resource.subject} · Updated {resource.updated}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full">
              Open library
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent results</CardTitle>
            <CardDescription>Latest assessments released.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResults.map((result) => (
                  <TableRow key={result.assessment}>
                    <TableCell>{result.assessment}</TableCell>
                    <TableCell>{result.subject}</TableCell>
                    <TableCell>{result.score}</TableCell>
                    <TableCell>
                      <Badge variant={result.status === "Pass" ? "success" : "secondary"}>{result.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

type StatPillProps = {
  label: string;
  value: string;
  trend: string;
};

function StatPill({ label, value, trend }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </div>
  );
}

type NoticeProps = {
  text: string;
};

function Notice({ text }: NoticeProps) {
  return <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{text}</p>;
}
