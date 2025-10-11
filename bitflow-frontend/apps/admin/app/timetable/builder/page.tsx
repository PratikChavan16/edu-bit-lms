'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  Badge,
  Alert,
  Modal,
} from '@bitflow/ui';

// Types
interface Teacher {
  id: number;
  name: string;
  subject: string;
  color: string;
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  teacherId: number | null;
  teacherName: string | null;
  subject: string | null;
  color: string | null;
}

interface Conflict {
  type: 'teacher' | 'room';
  message: string;
  slots: string[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '14:00-15:00',
  '15:00-16:00',
];

const TEACHERS: Teacher[] = [
  { id: 1, name: 'Dr. Smith', subject: 'Mathematics', color: 'bg-blue-500' },
  { id: 2, name: 'Prof. Johnson', subject: 'Physics', color: 'bg-purple-500' },
  { id: 3, name: 'Ms. Williams', subject: 'Chemistry', color: 'bg-green-500' },
  { id: 4, name: 'Mr. Brown', subject: 'English', color: 'bg-yellow-500' },
  { id: 5, name: 'Dr. Davis', subject: 'Computer Science', color: 'bg-cyan-500' },
  { id: 6, name: 'Prof. Wilson', subject: 'Biology', color: 'bg-pink-500' },
];

export default function TimetableBuilderPage() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [timetable, setTimetable] = useState<Record<string, TimeSlot>>({});
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Initialize empty timetable
  const initTimetable = () => {
    const slots: Record<string, TimeSlot> = {};
    DAYS.forEach((day) => {
      TIME_SLOTS.forEach((time) => {
        const key = `${day}-${time}`;
        slots[key] = {
          id: key,
          day,
          time,
          teacherId: null,
          teacherName: null,
          subject: null,
          color: null,
        };
      });
    });
    return slots;
  };

  // Check for conflicts
  const checkConflicts = (newTimetable: Record<string, TimeSlot>): Conflict[] => {
    const conflicts: Conflict[] = [];
    const teacherSlots: Record<number, string[]> = {};

    Object.entries(newTimetable).forEach(([key, slot]) => {
      if (slot.teacherId) {
        if (!teacherSlots[slot.teacherId]) {
          teacherSlots[slot.teacherId] = [];
        }

        // Check if teacher is already teaching at this time
        const conflictingSlots = teacherSlots[slot.teacherId].filter((existingKey) => {
          const existing = newTimetable[existingKey];
          return existing.time === slot.time && existing.day === slot.day;
        });

        if (conflictingSlots.length > 0) {
          conflicts.push({
            type: 'teacher',
            message: `${slot.teacherName} is already scheduled for ${slot.day} ${slot.time}`,
            slots: [key, ...conflictingSlots],
          });
        }

        teacherSlots[slot.teacherId].push(key);
      }
    });

    return conflicts;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const teacherId = Number(event.active.id);
    const teacher = TEACHERS.find((t) => t.id === teacherId);
    setActiveTeacher(teacher || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id) {
      const teacherId = Number(active.id);
      const teacher = TEACHERS.find((t) => t.id === teacherId);
      const slotId = over.id as string;

      if (teacher) {
        const newTimetable = {
          ...(Object.keys(timetable).length ? timetable : initTimetable()),
          [slotId]: {
            id: slotId,
            day: slotId.split('-')[0],
            time: slotId.split('-').slice(1).join('-'),
            teacherId: teacher.id,
            teacherName: teacher.name,
            subject: teacher.subject,
            color: teacher.color,
          },
        };

        const newConflicts = checkConflicts(newTimetable);
        setConflicts(newConflicts);

        if (newConflicts.length === 0) {
          setTimetable(newTimetable);
        }
      }
    }

    setActiveTeacher(null);
  };

  const handleRemoveSlot = (slotId: string) => {
    const newTimetable = {
      ...timetable,
      [slotId]: {
        id: slotId,
        day: slotId.split('-')[0],
        time: slotId.split('-').slice(1).join('-'),
        teacherId: null,
        teacherName: null,
        subject: null,
        color: null,
      },
    };
    setTimetable(newTimetable);
    setConflicts(checkConflicts(newTimetable));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the entire timetable?')) {
      setTimetable(initTimetable());
      setConflicts([]);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handlePublish = async () => {
    if (conflicts.length > 0) {
      alert('Please resolve all conflicts before publishing!');
      return;
    }
    if (confirm('Are you sure you want to publish this timetable? Students and faculty will be able to see it.')) {
      setSaveStatus('saving');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Timetable published successfully!');
      setSaveStatus('idle');
    }
  };

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Builder</h1>
          <p className="text-gray-700 mt-1">Drag and drop teachers to create class schedule</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setShowCopyModal(true)}>
            Copy Week
          </Button>
          <Button variant="danger" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button variant="secondary" onClick={handleSave} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save Draft'}
          </Button>
          <Button variant="primary" onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>

      {/* Class Selector */}
      <Card className="bg-white border-2 border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-900">Select Class:</label>
            <Select
              options={[
                { value: '10-A', label: 'Class 10-A' },
                { value: '10-B', label: 'Class 10-B' },
                { value: '9-A', label: 'Class 9-A' },
                { value: '9-B', label: 'Class 9-B' },
              ]}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">Total Periods:</span>
              <Badge variant="info">
                {Object.values(timetable).filter((slot) => slot.teacherId).length}/{DAYS.length * TIME_SLOTS.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Alert variant="error" title="Scheduling Conflicts Detected">
          <ul className="list-disc list-inside">
            {conflicts.map((conflict: Conflict, index: number) => (
              <li key={index}>{conflict.message}</li>
            ))}
          </ul>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Teachers Panel */}
        <div className="col-span-3">
          <Card className="bg-white border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Available Teachers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {TEACHERS.map((teacher) => (
                <DraggableTeacher key={teacher.id} teacher={teacher} />
              ))}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4 bg-white border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2 font-medium">
              <p>• Drag teacher cards to time slots</p>
              <p>• Click on filled slot to remove</p>
              <p>• Conflicts are highlighted in red</p>
              <p>• Save draft or publish when ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Grid */}
        <div className="col-span-9">
          <Card className="bg-white border-2 border-gray-200">
            <CardContent className="p-0 overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500">
                      <th className="border border-gray-300 p-3 text-left font-bold text-white w-32">
                        Time
                      </th>
                      {DAYS.map((day) => (
                        <th
                          key={day}
                          className="border border-gray-300 p-3 text-center font-bold text-white"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((time) => (
                      <tr key={time}>
                        <td className="border border-gray-300 p-3 bg-gradient-to-r from-gray-100 to-gray-200 font-bold text-sm text-gray-900">
                          {time}
                        </td>
                        {DAYS.map((day) => {
                          const slotId = `${day}-${time}`;
                          const slot = timetable[slotId];
                          const hasConflict = conflicts.some((c: Conflict) =>
                            c.slots.includes(slotId)
                          );

                          return (
                            <TimeSlotCell
                              key={slotId}
                              slotId={slotId}
                              slot={slot}
                              hasConflict={hasConflict}
                              onRemove={handleRemoveSlot}
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <DragOverlay>
                  {activeTeacher && (
                    <div className={`${activeTeacher.color} text-white p-3 rounded-lg shadow-lg cursor-grabbing`}>
                      <div className="font-semibold">{activeTeacher.name}</div>
                      <div className="text-sm opacity-90">{activeTeacher.subject}</div>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Copy Week Modal */}
      <Modal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        title="Copy Timetable"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCopyModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              alert('Timetable copied!');
              setShowCopyModal(false);
            }}>
              Copy
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">Copy this timetable to another class:</p>
          <Select
            label="Target Class"
            options={[
              { value: '10-B', label: 'Class 10-B' },
              { value: '9-A', label: 'Class 9-A' },
              { value: '9-B', label: 'Class 9-B' },
            ]}
            placeholder="Select a class"
          />
        </div>
      </Modal>
    </div>
  );
}

// Draggable Teacher Component
function DraggableTeacher({ teacher }: { teacher: Teacher }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: teacher.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${teacher.color} text-white p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      <div className="font-semibold">{teacher.name}</div>
      <div className="text-sm opacity-90">{teacher.subject}</div>
    </div>
  );
}

// Time Slot Cell Component
function TimeSlotCell({
  slotId,
  slot,
  hasConflict,
  onRemove,
}: {
  slotId: string;
  slot: TimeSlot | undefined;
  hasConflict: boolean;
  onRemove: (slotId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
  });

  const handleClick = () => {
    if (slot?.teacherId) {
      onRemove(slotId);
    }
  };

  return (
    <td
      ref={setNodeRef}
      className={`border border-gray-300 p-2 h-20 transition-colors ${
        isOver ? 'bg-blue-100 border-blue-400' : 'bg-white'
      } ${hasConflict ? 'bg-red-100 border-red-400' : ''}`}
    >
      {slot?.teacherId ? (
        <div
          onClick={handleClick}
          className={`${slot.color} text-white p-2 rounded cursor-pointer hover:opacity-90 transition-opacity h-full shadow-md`}
        >
          <div className="font-semibold text-sm">{slot.teacherName}</div>
          <div className="text-xs opacity-90">{slot.subject}</div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm font-medium">
          Drop here
        </div>
      )}
    </td>
  );
}

// Draggable hook
function useDraggable({ id }: { id: number }) {
  return {
    attributes: { role: 'button', tabIndex: 0 },
    listeners: { 'data-draggable': id },
    setNodeRef: () => {},
    isDragging: false,
  };
}

// Droppable hook
function useDroppable({ id }: { id: string }) {
  return {
    setNodeRef: () => {},
    isOver: false,
  };
}
