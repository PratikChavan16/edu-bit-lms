'use client';import {

  Card,

import { useLearnerDashboard } from '@bitflow/api-client/learner/dashboard';  CardContent,

import {  CardDescription,

  Card,  CardHeader,

  CardContent,  CardTitle,

  CardDescription,} from "@bitflow/ui/card";

  CardHeader,import { Badge } from "@bitflow/ui/badge";

  CardTitle,import { Button } from "@bitflow/ui/button";

} from "@bitflow/ui/card";import { Separator } from "@bitflow/ui/separator";

import { Badge } from "@bitflow/ui/badge";import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";

import { Button } from "@bitflow/ui/button";

import { Separator } from "@bitflow/ui/separator";const upcomingLectures = [

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@bitflow/ui/table";  {

import { Calendar, BookOpen, FileText, AlertCircle } from 'lucide-react';    subject: "Advanced Mathematics",

    time: "09:30 AM",

export default function DashboardPage() {    venue: "Room A104",

  const { data, isLoading, error } = useLearnerDashboard();    faculty: "Dr. Mehta",

  },

  if (isLoading) {  {

    return (    subject: "Thermodynamics",

      <div className="space-y-8">    time: "11:15 AM",

        <div className="h-48 animate-pulse rounded-3xl bg-muted" />    venue: "Lab 203",

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">    faculty: "Prof. Salvi",

          <div className="h-96 animate-pulse rounded-3xl bg-muted" />  },

          <div className="h-96 animate-pulse rounded-3xl bg-muted" />  {

        </div>    subject: "Materials Science",

      </div>    time: "02:00 PM",

    );    venue: "Room C402",

  }    faculty: "Dr. Iyer",

  },

  if (error) {];

    return (

      <div className="flex min-h-96 items-center justify-center">const libraryQuickLinks = [

        <div className="text-center">  { title: "Thermodynamics notes", subject: "Mechanical", updated: "2d ago" },

          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />  { title: "Lab safety checklist", subject: "Common", updated: "4d ago" },

          <h2 className="mt-4 text-lg font-semibold text-foreground">Failed to load dashboard</h2>  { title: "MATLAB shortcuts", subject: "Computer", updated: "1w ago" },

          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>];

          <Button onClick={() => window.location.reload()} className="mt-4">

            Retryconst recentResults = [

          </Button>  { assessment: "Mid-term Mechanics", subject: "Mechanical", score: "82%", status: "Pass" },

        </div>  { assessment: "Lab practical", subject: "Electronics", score: "Pending", status: "In review" },

      </div>  { assessment: "Quiz #5", subject: "Mathematics", score: "92%", status: "Pass" },

    );];

  }

export default function DashboardPage() {

  if (!data) return null;  return (

    <div className="space-y-8">

  return (      <section className="rounded-3xl border border-border bg-surface px-6 py-8 shadow-card">

    <div className="space-y-8">        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Header Section */}          <div>

      <section className="rounded-3xl border border-border bg-surface px-6 py-8 shadow-card">            <p className="text-sm text-muted-foreground">Tuesday, 7 October 2025</p>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">            <h1 className="text-3xl font-semibold">Hi Riya, welcome back!</h1>

          <div>            <p className="text-muted-foreground">You have 3 classes and 1 assignment due today.</p>

            <p className="text-sm text-muted-foreground">{data.date}</p>          </div>

            <h1 className="text-3xl font-semibold">{data.greeting}</h1>          <div className="flex gap-3">

          </div>            <Button variant="outline">View timetable</Button>

          <div className="flex gap-3">            <Button>Start assignment</Button>

            <Button variant="outline">View timetable</Button>          </div>

            <Button>Start assignment</Button>        </div>

          </div>        <Separator className="my-6" />

        </div>        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Separator className="my-6" />          <StatPill label="Attendance" value="92%" trend="On track" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">          <StatPill label="Assignments" value="1 due" trend="Submit by 8 PM" />

          {data.stats.map((stat, index) => (          <StatPill label="Library storage" value="240MB / 300MB" trend="80% used" />

            <StatPill key={index} label={stat.label} value={stat.value} trend={stat.trend} />          <StatPill label="Fee status" value="Paid" trend="Next due Jan 2026" />

          ))}        </div>

        </div>      </section>

      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">

      {/* Main Content Grid */}        <Card>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">          <CardHeader>

        {/* Upcoming Lectures */}            <CardTitle>Upcoming lectures</CardTitle>

        <Card>            <CardDescription>Your next three classes.</CardDescription>

          <CardHeader>          </CardHeader>

            <div className="flex items-center gap-2">          <CardContent className="space-y-4">

              <Calendar className="h-5 w-5 text-primary" />            {upcomingLectures.map((lecture) => (

              <CardTitle>Upcoming lectures</CardTitle>              <div key={lecture.subject} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">

            </div>                <div>

            <CardDescription>Your next classes today.</CardDescription>                  <p className="text-sm font-medium">{lecture.subject}</p>

          </CardHeader>                  <p className="text-xs text-muted-foreground">{lecture.faculty} · {lecture.venue}</p>

          <CardContent className="space-y-4">                </div>

            {data.upcomingLectures.length === 0 ? (                <Badge variant="outline">{lecture.time}</Badge>

              <p className="py-8 text-center text-sm text-muted-foreground">              </div>

                No lectures scheduled for today            ))}

              </p>            <Button variant="ghost" className="w-full">

            ) : (              View full timetable

              <>            </Button>

                {data.upcomingLectures.map((lecture, index) => (          </CardContent>

                  <div        </Card>

                    key={index}        <Card className="bg-gradient-to-br from-primary/10 to-surface">

                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 shadow-sm"          <CardHeader>

                  >            <CardTitle>Important notices</CardTitle>

                    <div>            <CardDescription>From your admin and faculty.</CardDescription>

                      <p className="text-sm font-medium">{lecture.subject}</p>          </CardHeader>

                      <p className="text-xs text-muted-foreground">          <CardContent className="space-y-3 text-sm text-foreground">

                        {lecture.faculty} · {lecture.venue}            <Notice text="Project showcase submissions due Friday." />

                      </p>            <Notice text="Upload internship letter in Documents." />

                    </div>            <Notice text="College fest registrations open now." />

                    <div className="text-right">          </CardContent>

                      <Badge variant="outline">{lecture.startAt}</Badge>        </Card>

                      <p className="mt-1 text-xs text-muted-foreground">to {lecture.endAt}</p>      </section>

                    </div>

                  </div>      <section className="grid gap-6 lg:grid-cols-2">

                ))}        <Card>

                <Button variant="ghost" className="w-full">          <CardHeader>

                  View full timetable            <CardTitle>Library quick links</CardTitle>

                </Button>            <CardDescription>Resources you’ve saved recently.</CardDescription>

              </>          </CardHeader>

            )}          <CardContent className="space-y-3">

          </CardContent>            {libraryQuickLinks.map((resource) => (

        </Card>              <div key={resource.title} className="rounded-xl border border-border bg-surface px-4 py-3">

                <p className="text-sm font-medium">{resource.title}</p>

        {/* Important Notices */}                <p className="text-xs text-muted-foreground">{resource.subject} · Updated {resource.updated}</p>

        <Card className="bg-gradient-to-br from-primary/10 to-surface">              </div>

          <CardHeader>            ))}

            <CardTitle>Important notices</CardTitle>            <Button variant="ghost" className="w-full">

            <CardDescription>From your admin and faculty.</CardDescription>              Open library

          </CardHeader>            </Button>

          <CardContent className="space-y-3">          </CardContent>

            {data.notices.length === 0 ? (        </Card>

              <p className="py-4 text-center text-sm text-muted-foreground">No new notices</p>        <Card>

            ) : (          <CardHeader>

              data.notices.map((notice) => (            <CardTitle>Recent results</CardTitle>

                <Notice            <CardDescription>Latest assessments released.</CardDescription>

                  key={notice.id}          </CardHeader>

                  text={notice.text}          <CardContent>

                  priority={notice.priority}            <Table>

                  category={notice.category}              <TableHeader>

                />                <TableRow>

              ))                  <TableHead>Assessment</TableHead>

            )}                  <TableHead>Subject</TableHead>

          </CardContent>                  <TableHead>Score</TableHead>

        </Card>                  <TableHead>Status</TableHead>

      </section>                </TableRow>

              </TableHeader>

      {/* Bottom Grid */}              <TableBody>

      <section className="grid gap-6 lg:grid-cols-2">                {recentResults.map((result) => (

        {/* Library Quick Links */}                  <TableRow key={result.assessment}>

        <Card>                    <TableCell>{result.assessment}</TableCell>

          <CardHeader>                    <TableCell>{result.subject}</TableCell>

            <div className="flex items-center gap-2">                    <TableCell>{result.score}</TableCell>

              <BookOpen className="h-5 w-5 text-primary" />                    <TableCell>

              <CardTitle>Library quick links</CardTitle>                      <Badge variant={result.status === "Pass" ? "success" : "secondary"}>{result.status}</Badge>

            </div>                    </TableCell>

            <CardDescription>Resources you've saved recently.</CardDescription>                  </TableRow>

          </CardHeader>                ))}

          <CardContent className="space-y-3">              </TableBody>

            {data.libraryQuickLinks.length === 0 ? (            </Table>

              <p className="py-4 text-center text-sm text-muted-foreground">          </CardContent>

                No resources available        </Card>

              </p>      </section>

            ) : (    </div>

              <>  );

                {data.libraryQuickLinks.map((resource) => (}

                  <div

                    key={resource.id}type StatPillProps = {

                    className="rounded-xl border border-border bg-surface px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors"  label: string;

                  >  value: string;

                    <p className="text-sm font-medium">{resource.title}</p>  trend: string;

                    <p className="text-xs text-muted-foreground">};

                      {resource.subject} · {resource.type} · Updated {resource.updatedAt}

                    </p>function StatPill({ label, value, trend }: StatPillProps) {

                  </div>  return (

                ))}    <div className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">

                <Button variant="ghost" className="w-full">      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>

                  Open library      <p className="text-xl font-semibold">{value}</p>

                </Button>      <p className="text-xs text-muted-foreground">{trend}</p>

              </>    </div>

            )}  );

          </CardContent>}

        </Card>

type NoticeProps = {

        {/* Recent Results */}  text: string;

        <Card>};

          <CardHeader>

            <div className="flex items-center gap-2">function Notice({ text }: NoticeProps) {

              <FileText className="h-5 w-5 text-primary" />  return <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">{text}</p>;

              <CardTitle>Recent results</CardTitle>}

            </div>
            <CardDescription>Latest assessments released.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentResults.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results available
              </p>
            ) : (
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
                  {data.recentResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.assessmentTitle}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.score}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.status === 'pass'
                              ? 'success'
                              : result.status === 'fail'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
  priority?: string;
  category?: string;
};

function Notice({ text, priority, category }: NoticeProps) {
  const isPriority = priority === 'high';
  
  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${
        isPriority ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary'
      }`}
    >
      {isPriority && <Badge className="mb-1 bg-destructive text-destructive-foreground text-xs">Urgent</Badge>}
      <p>{text}</p>
      {category && <p className="mt-1 text-xs opacity-70">{category}</p>}
    </div>
  );
}
