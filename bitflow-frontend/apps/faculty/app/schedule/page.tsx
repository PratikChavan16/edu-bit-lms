'use client';

import { useFacultyTimetable } from '@bitflow/api-client/faculty';
import { Button } from '@bitflow/ui/button';
import { Card } from '@bitflow/ui/card';
import { Badge } from '@bitflow/ui/badge';
import { Calendar, Clock, MapPin, Users, Download } from 'lucide-react';

export default function SchedulePage() {
  const { data: timetable, isLoading, error } = useFacultyTimetable();

  if (isLoading) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading schedule...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !timetable?.success) {
    return (
      <div className="p-8">
        <Card className="p-6">
          <p className="text-destructive">Failed to load schedule</p>
        </Card>
      </div>
    );
  }

  const { data } = timetable;
  const totalClasses = data.days.reduce((sum: number, day: any) => sum + day.blocks.length, 0);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Schedule</h1>
          <p className="text-muted-foreground">Your teaching timetable for {data.term}</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Export Schedule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-2xl font-bold">{totalClasses}</div>
          <p className="text-sm text-muted-foreground">Classes per Week</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{data.days.length}</div>
          <p className="text-sm text-muted-foreground">Teaching Days</p>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {new Set(data.days.flatMap((d: any) => d.blocks.map((b: any) => b.subject))).size}
          </div>
          <p className="text-sm text-muted-foreground">Subjects</p>
        </Card>
      </div>

      <div className="space-y-4">
        {data.days.map((day: any) => (
          <Card key={day.day_of_week} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{day.day_name}</h2>
              </div>
              <Badge>{day.blocks.length} classes</Badge>
            </div>

            {day.blocks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No classes scheduled</p>
            ) : (
              <div className="space-y-3">
                {day.blocks.map((block: any) => (
                  <div
                    key={block.id}
                    className="flex items-start justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-lg">{block.subject}</p>
                        <p className="text-sm text-muted-foreground">{block.section}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {block.start_time} - {block.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{block.room}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{block.students?.length || 0} students</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={block.type === 'lecture' ? 'default' : 'outline'}>
                        {block.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
