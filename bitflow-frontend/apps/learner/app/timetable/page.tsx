'use client';

import { useLearnerTimetable } from '@bitflow/api-client/learner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bitflow/ui/card";
import { Badge } from "@bitflow/ui/badge";
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { Button } from "@bitflow/ui/button";

interface TimetableBlock {
  id: string;
  subject: string;
  faculty: string;
  start_time: string;
  end_time: string;
  room_number: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function TimetablePage() {
  const { data, isLoading, error } = useLearnerTimetable();

  // Get today's day for highlighting
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">Failed to load timetable</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Weekly Timetable</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Your class schedule for this week • {data.total_classes} total classes
              </CardDescription>
            </div>
            <Badge variant="outline" className="h-fit">
              {new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Desktop View - Grid */}
      <Card className="hidden lg:block">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-4 border-b pb-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className={`text-center font-semibold ${
                      day === today
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day}
                    {day === today && (
                      <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Timetable Grid */}
              <div className="mt-4 space-y-4">
                {TIME_SLOTS.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-6 gap-4">
                    {DAYS_OF_WEEK.map((day) => {
                      const dayIndex = DAYS_OF_WEEK.indexOf(day) + 1; // 1-6 for Mon-Sat
                      const classes = data.current_week[dayIndex] || [];
                      const classInSlot = classes.find((c: TimetableBlock) =>
                        c.start_time.startsWith(timeSlot.slice(0, 2))
                      );

                      if (!classInSlot) {
                        return (
                          <div
                            key={`${day}-${timeSlot}`}
                            className="rounded-lg border border-dashed border-gray-200 p-3 text-center"
                          >
                            <p className="text-xs text-muted-foreground">{timeSlot}</p>
                          </div>
                        );
                      }

                      const typeColors: Record<string, string> = {
                        lecture: 'bg-blue-50 border-blue-200 text-blue-900',
                        lab: 'bg-green-50 border-green-200 text-green-900',
                        tutorial: 'bg-purple-50 border-purple-200 text-purple-900',
                      };

                      return (
                        <div
                          key={`${day}-${timeSlot}`}
                          className={`rounded-lg border-2 p-3 ${
                            typeColors[classInSlot.type] || typeColors.lecture
                          } ${day === today ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {classInSlot.type}
                              </Badge>
                              <span className="text-xs font-medium">
                                {classInSlot.start_time} - {classInSlot.end_time}
                              </span>
                            </div>
                            <p className="font-semibold text-sm">
                              {classInSlot.subject}
                            </p>
                            <p className="text-xs">{classInSlot.faculty}</p>
                            <p className="text-xs font-medium">
                              Room: {classInSlot.room_number}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile View - List by Day */}
      <div className="space-y-4 lg:hidden">
        {DAYS_OF_WEEK.map((day) => {
          const dayIndex = DAYS_OF_WEEK.indexOf(day) + 1;
          const classes = data.current_week[dayIndex] || [];

          return (
            <Card key={day} className={day === today ? 'border-l-4 border-l-primary' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{day}</span>
                  {day === today && (
                    <Badge className="bg-primary text-primary-foreground">Today</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {classes.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No classes scheduled
                  </p>
                ) : (
                  classes.map((classItem: TimetableBlock) => {
                    const typeColors: Record<string, string> = {
                      lecture: 'bg-blue-50 border-blue-200',
                      lab: 'bg-green-50 border-green-200',
                      tutorial: 'bg-purple-50 border-purple-200',
                    };

                    return (
                      <div
                        key={classItem.id}
                        className={`rounded-lg border-2 p-4 ${typeColors[classItem.type] || typeColors.lecture}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <Badge variant="outline" className="capitalize">
                              {classItem.type}
                            </Badge>
                            <h3 className="font-semibold">{classItem.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {classItem.faculty}
                            </p>
                            <p className="text-sm font-medium">
                              Room: {classItem.room_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Clock className="h-4 w-4" />
                              {classItem.start_time}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              to {classItem.end_time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-surface">
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{data.total_classes}</p>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {Object.values(data.current_week).filter((d: unknown) => Array.isArray(d) && d.length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Active Days</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {Math.round(data.total_classes / 6)}
              </p>
              <p className="text-sm text-muted-foreground">Avg/Day</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
