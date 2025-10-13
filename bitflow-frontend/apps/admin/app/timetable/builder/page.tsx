'use client';

import { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  useDraggable, 
  useDroppable,
  DragOverlay,
  closestCenter
} from '@dnd-kit/core';
import { Button, Card, CardContent } from '@bitflow/ui';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  color: string;
}

interface TimeSlot {
  id: string;
  teacherId: number | null;
  teacherName: string | null;
  subject: string | null;
  color: string | null;
}

const TEACHERS: Teacher[] = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics', color: 'bg-blue-500' },
  { id: 2, name: 'Prof. Johnson', subject: 'Physics', color: 'bg-purple-500' },
  { id: 3, name: 'Ms. Williams', subject: 'Chemistry', color: 'bg-green-500' },
  { id: 4, name: 'Mr. Brown', subject: 'English', color: 'bg-yellow-500' },
  { id: 5, name: 'Dr. Davis', subject: 'Computer Science', color: 'bg-cyan-500' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'];

export default function TimetableBuilderPage() {
  const [timetable, setTimetable] = useState<Record<string, TimeSlot>>({});
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  // Check for teacher conflicts across the same time slot
  const checkConflicts = (newTimetable: Record<string, TimeSlot>) => {
    const conflictedSlots: string[] = [];
    const teacherTimeMap: Record<string, string[]> = {};

    // Group slots by time and track teachers
    Object.entries(newTimetable).forEach(([slotId, slot]) => {
      if (slot.teacherId) {
        const [day, time] = slotId.split('-');
        const timeKey = time;
        
        if (!teacherTimeMap[timeKey]) {
          teacherTimeMap[timeKey] = [];
        }
        
        // Check if teacher is already scheduled at this time
        const existingSlots = teacherTimeMap[timeKey];
        const teacherAlreadyScheduled = existingSlots.some(existingSlotId => {
          const existingSlot = newTimetable[existingSlotId];
          return existingSlot?.teacherId === slot.teacherId;
        });

        if (teacherAlreadyScheduled) {
          // Mark both slots as conflicted
          conflictedSlots.push(slotId);
          existingSlots.forEach(existingSlotId => {
            const existingSlot = newTimetable[existingSlotId];
            if (existingSlot?.teacherId === slot.teacherId) {
              conflictedSlots.push(existingSlotId);
            }
          });
        }
        
        teacherTimeMap[timeKey].push(slotId);
      }
    });

    setConflicts([...new Set(conflictedSlots)]);
    return conflictedSlots;
  };

  const handleDragStart = (event: any) => {
    console.log('Drag started:', event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag ended:', { activeId: active.id, overId: over?.id });
    setActiveId(null);
    
    if (over && over.id) {
      const teacherId = Number(active.id);
      const teacher = TEACHERS.find((t) => t.id === teacherId);
      const slotId = over.id as string;
      
      console.log('Dropping teacher:', teacher?.name, 'to slot:', slotId);

      if (teacher) {
        const newTimetable = {
          ...timetable,
          [slotId]: {
            id: slotId,
            teacherId: teacher.id,
            teacherName: teacher.name,
            subject: teacher.subject,
            color: teacher.color,
          },
        };
        
        setTimetable(newTimetable);
        checkConflicts(newTimetable);
        console.log('Timetable updated successfully');
      }
    } else {
      console.log('No valid drop target');
    }
  };

  const handleClearSlot = (slotId: string) => {
    const newTimetable = { ...timetable };
    delete newTimetable[slotId];
    setTimetable(newTimetable);
    checkConflicts(newTimetable);
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Builder</h1>
          <p className="text-gray-600 mt-1">Drag and drop teachers to create class schedule</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Save Draft</Button>
          <Button variant="primary">Publish</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Teachers Panel */}
        <div className="col-span-3">
          <Card className="bg-white">
            <CardContent className="p-6">
              <h2 className="font-bold text-gray-900 mb-4">Available Teachers</h2>
              <div className="space-y-3">
                {TEACHERS.map((teacher) => (
                  <DraggableTeacher key={teacher.id} teacher={teacher} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white mt-4">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Instructions</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Drag teacher cards to time slots</p>
                <p>• Click on filled slots to remove</p>
                <p>• Save draft or publish when ready</p>
              </div>
            </CardContent>
          </Card>

          {/* Conflicts Panel */}
          {conflicts.length > 0 && (
            <Card className="bg-red-50 border-red-200 mt-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <h3 className="font-bold text-red-900">Scheduling Conflicts</h3>
                </div>
                <div className="text-sm text-red-700">
                  <p className="mb-2">⚠️ {conflicts.length} conflict(s) detected:</p>
                  <div className="space-y-1">
                    {conflicts.map((conflictId: string) => {
                      const slot = timetable[conflictId];
                      const [day, time] = conflictId.split('-');
                      return (
                        <p key={conflictId} className="text-xs bg-red-100 p-2 rounded">
                          <strong>{slot?.teacherName}</strong> on {day} at {time}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timetable Grid */}
        <div className="col-span-9">
          <Card className="bg-white">
            <CardContent className="p-0">
              <DndContext 
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-indigo-500">
                        <th className="border border-gray-300 p-4 text-white font-bold text-left w-32">
                          Time
                        </th>
                        {DAYS.map((day) => (
                          <th key={day} className="border border-gray-300 p-4 text-white font-bold text-center">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((time) => (
                        <tr key={time}>
                          <td className="border border-gray-300 p-4 bg-gray-50 font-bold text-gray-900">
                            {time}
                          </td>
                          {DAYS.map((day) => {
                            const slotId = `${day}-${time}`;
                            const slot = timetable[slotId];
                            return (
                              <TimeSlotCell 
                                key={slotId} 
                                slotId={slotId} 
                                slot={slot}
                                onClear={handleClearSlot}
                                hasConflict={conflicts.includes(slotId)}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <DragOverlay>
                  {activeId ? (
                    <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg opacity-90">
                      {(() => {
                        const teacher = TEACHERS.find(t => t.id === activeId);
                        return teacher ? (
                          <>
                            <div className="font-semibold">{teacher.name}</div>
                            <div className="text-sm opacity-90">{teacher.subject}</div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DraggableTeacher({ teacher }: { teacher: Teacher }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: teacher.id,
    data: {
      type: 'teacher',
      teacher: teacher,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${teacher.color} text-white p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all select-none touch-none ${
        isDragging ? 'opacity-30 scale-95' : 'hover:scale-105 hover:shadow-lg'
      }`}
    >
      <div className="font-semibold">{teacher.name}</div>
      <div className="text-sm opacity-90">{teacher.subject}</div>
    </div>
  );
}

function TimeSlotCell({ 
  slotId, 
  slot,
  onClear,
  hasConflict = false
}: { 
  slotId: string; 
  slot?: TimeSlot;
  onClear: (slotId: string) => void;
  hasConflict?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: {
      type: 'timeslot',
      slotId: slotId,
    },
  });

  const handleClick = () => {
    if (slot) {
      onClear(slotId);
    }
  };

  return (
    <td
      ref={setNodeRef}
      className={`border p-2 h-20 transition-colors ${
        hasConflict 
          ? 'border-red-500 border-2' 
          : isOver 
          ? 'bg-blue-100 border-blue-400 border-gray-300' 
          : 'bg-white border-gray-300'
      }`}
    >
      {slot ? (
        <div
          onClick={handleClick}
          className={`${slot.color} text-white p-2 rounded cursor-pointer hover:opacity-90 transition-opacity h-full shadow-md flex flex-col justify-center relative`}
        >
          {hasConflict && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
          <div className="font-semibold text-sm">{slot.teacherName}</div>
          <div className="text-xs opacity-90">{slot.subject}</div>
          {hasConflict && (
            <div className="text-xs bg-red-600 px-1 rounded mt-1">
              CONFLICT
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
          {isOver ? 'Drop here' : ''}
        </div>
      )}
    </td>
  );
}
