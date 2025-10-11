"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Plus, Calendar, Clock, Users, MapPin, AlertCircle } from "lucide-react";

// Mock data
const mockTimetableEntries = [
  {
    id: "1",
    dayOfWeek: "monday",
    timeSlot: "09:00-10:00",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-TH",
    facultyId: "1",
    facultyName: "Dr. Rajesh Sharma",
    room: "Room 301",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lecture",
    semester: 3,
  },
  {
    id: "2",
    dayOfWeek: "monday",
    timeSlot: "10:00-11:00",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-TH",
    facultyId: "2",
    facultyName: "Prof. Anita Patel",
    room: "Room 302",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lecture",
    semester: 3,
  },
  {
    id: "3",
    dayOfWeek: "monday",
    timeSlot: "11:00-12:00",
    subjectId: "1",
    subjectName: "Data Structures & Algorithms",
    subjectCode: "CS201-PR",
    facultyId: "1",
    facultyName: "Dr. Rajesh Sharma",
    room: "Computer Lab 1",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lab",
    semester: 3,
  },
  {
    id: "4",
    dayOfWeek: "tuesday",
    timeSlot: "09:00-10:00",
    subjectId: "3",
    subjectName: "Operating Systems",
    subjectCode: "CS203-TH",
    facultyId: "3",
    facultyName: "Dr. Kumar Reddy",
    room: "Room 303",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lecture",
    semester: 3,
  },
  {
    id: "5",
    dayOfWeek: "tuesday",
    timeSlot: "10:00-11:00",
    subjectId: "4",
    subjectName: "Computer Networks",
    subjectCode: "CS204-TH",
    facultyId: "4",
    facultyName: "Dr. Priya Singh",
    room: "Room 304",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lecture",
    semester: 3,
  },
  {
    id: "6",
    dayOfWeek: "wednesday",
    timeSlot: "14:00-15:00",
    subjectId: "2",
    subjectName: "Database Management Systems",
    subjectCode: "CS202-PR",
    facultyId: "2",
    facultyName: "Prof. Anita Patel",
    room: "Computer Lab 2",
    batchId: "1",
    batchName: "CS 2021-2025 Batch A",
    type: "lab",
    semester: 3,
  },
];

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

export default function TimetablePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("1");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Mock query - replace with real API call
  const { data: timetableEntries = mockTimetableEntries, isLoading } = useQuery({
    queryKey: ["timetable", searchQuery, batchFilter, facultyFilter, roomFilter, dayFilter],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockTimetableEntries.filter((entry) => {
        const matchesSearch =
          entry.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.room.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBatch = batchFilter === "all" || entry.batchId === batchFilter;
        const matchesFaculty = facultyFilter === "all" || entry.facultyId === facultyFilter;
        const matchesRoom = roomFilter === "all" || entry.room === roomFilter;
        const matchesDay = dayFilter === "all" || entry.dayOfWeek === dayFilter;
        return matchesSearch && matchesBatch && matchesFaculty && matchesRoom && matchesDay;
      });
    },
  });

  const getTypeBadge = (type: string) => {
    const badges = {
      lecture: "bg-blue-100 text-blue-700",
      lab: "bg-purple-100 text-purple-700",
      tutorial: "bg-green-100 text-green-700",
      seminar: "bg-orange-100 text-orange-700",
    };
    return badges[type as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  // Build calendar grid
  const calendarGrid = daysOfWeek.map((day) => {
    return {
      day,
      slots: timeSlots.map((slot) => {
        const entry = timetableEntries.find(
          (e) => e.dayOfWeek === day && e.timeSlot === slot
        );
        return entry || null;
      }),
    };
  });

  // Statistics
  const stats = {
    total: timetableEntries.length,
    lectures: timetableEntries.filter((e) => e.type === "lecture").length,
    labs: timetableEntries.filter((e) => e.type === "lab").length,
    tutorials: timetableEntries.filter((e) => e.type === "tutorial").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage class schedules and room allocations
          </p>
        </div>
        <Link
          href="/timetable/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lectures</p>
              <p className="text-2xl font-bold text-blue-600">{stats.lectures}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Labs</p>
              <p className="text-2xl font-bold text-purple-600">{stats.labs}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tutorials</p>
              <p className="text-2xl font-bold text-green-600">{stats.tutorials}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Batches</option>
            <option value="1">CS 2021-2025 A</option>
            <option value="2">CS 2021-2025 B</option>
          </select>
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Faculty</option>
            <option value="1">Dr. Sharma</option>
            <option value="2">Prof. Patel</option>
            <option value="3">Dr. Reddy</option>
          </select>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Rooms</option>
            <option value="Room 301">Room 301</option>
            <option value="Room 302">Room 302</option>
            <option value="Computer Lab 1">Computer Lab 1</option>
          </select>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Days</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          Loading timetable...
        </div>
      ) : viewMode === "calendar" ? (
        /* Calendar View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r border-gray-200 w-32">
                    Time
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200 last:border-r-0"
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slot} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                      {slot}
                    </td>
                    {calendarGrid.map((dayData) => {
                      const entry = dayData.slots[slotIndex];
                      return (
                        <td
                          key={`${dayData.day}-${slot}`}
                          className="px-2 py-2 border-r border-gray-200 last:border-r-0 align-top"
                        >
                          {entry ? (
                            <Link
                              href={`/timetable/${entry.id}/edit`}
                              className="block p-2 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                            >
                              <div className="text-xs font-semibold text-blue-900 mb-1">
                                {entry.subjectCode}
                              </div>
                              <div className="text-xs text-blue-700 mb-1">
                                {entry.facultyName}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-blue-600">
                                <MapPin className="w-3 h-3" />
                                {entry.room}
                              </div>
                              <span
                                className={`inline-block px-2 py-0.5 mt-1 text-xs font-semibold rounded ${getTypeBadge(
                                  entry.type
                                )}`}
                              >
                                {entry.type}
                              </span>
                            </Link>
                          ) : (
                            <div className="h-24 flex items-center justify-center text-gray-300">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {timetableEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No classes scheduled</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faculty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timetableEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.dayOfWeek.charAt(0).toUpperCase() + entry.dayOfWeek.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.timeSlot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.subjectName}</div>
                        <div className="text-xs text-gray-500">{entry.subjectCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.facultyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {entry.room}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.batchName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(
                            entry.type
                          )}`}
                        >
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/timetable/${entry.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
