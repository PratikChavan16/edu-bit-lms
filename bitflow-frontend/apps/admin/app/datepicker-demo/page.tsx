'use client';

import React, { useState } from 'react';
import { DatePicker, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@bitflow/ui';

export default function DatePickerDemo() {
  // Different date picker states
  const [basicDate, setBasicDate] = useState<Date | null>(null);
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [disabledDate, setDisabledDate] = useState<Date | null>(null);
  const [formatDate1, setFormatDate1] = useState<Date | null>(null);
  const [formatDate2, setFormatDate2] = useState<Date | null>(null);
  const [formatDate3, setFormatDate3] = useState<Date | null>(null);

  // Date constraints
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📅 DatePicker Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive date selection with calendar UI, constraints, and formatting options
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">📆</div>
              <div className="text-2xl font-bold text-gray-900">Calendar</div>
              <div className="text-sm text-gray-600">Month/Year Nav</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">🔒</div>
              <div className="text-2xl font-bold text-gray-900">Min/Max</div>
              <div className="text-sm text-gray-600">Date Constraints</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">🎨</div>
              <div className="text-2xl font-bold text-gray-900">3 Formats</div>
              <div className="text-sm text-gray-600">DD/MM/YY, etc.</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">⚡</div>
              <div className="text-2xl font-bold text-gray-900">Fast Nav</div>
              <div className="text-sm text-gray-600">Quick Selection</div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Dates Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">📊 Selected Dates Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Basic Date</div>
                <div className="font-bold text-lg text-gray-900">
                  {basicDate ? basicDate.toLocaleDateString() : 'Not selected'}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Min/Max Date</div>
                <div className="font-bold text-lg text-gray-900">
                  {minMaxDate ? minMaxDate.toLocaleDateString() : 'Not selected'}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-pink-200">
                <div className="text-sm text-gray-600 mb-1">Formatted Date</div>
                <div className="font-bold text-lg text-gray-900">
                  {formatDate1 ? formatDate1.toLocaleDateString() : 'Not selected'}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setBasicDate(null);
                  setMinMaxDate(null);
                  setDisabledDate(null);
                  setFormatDate1(null);
                  setFormatDate2(null);
                  setFormatDate3(null);
                }}
              >
                Clear All Dates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic DatePicker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Basic DatePicker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a date
                  </label>
                  <DatePicker
                    value={basicDate || undefined}
                    onChange={setBasicDate}
                    placeholder="Pick a date"
                  />
                </div>

                {basicDate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Selected:</div>
                    <div className="font-bold text-blue-600">
                      {basicDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Click input to open calendar</li>
                    <li>Navigate months/years</li>
                    <li>Today button for quick selection</li>
                    <li>Clear button to reset</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DatePicker with Min/Max Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                With Min/Max Constraints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select date (between last month and next month)
                  </label>
                  <DatePicker
                    value={minMaxDate || undefined}
                    onChange={setMinMaxDate}
                    minDate={lastMonth}
                    maxDate={nextMonth}
                    placeholder="Pick a date in range"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-600">Min Date</div>
                    <div className="font-semibold text-red-600 text-sm">
                      {lastMonth.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-gray-600">Max Date</div>
                    <div className="font-semibold text-green-600 text-sm">
                      {nextMonth.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {minMaxDate && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600">Selected:</div>
                    <div className="font-bold text-purple-600">
                      {minMaxDate.toLocaleDateString()}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <strong>Use Case:</strong> Booking systems, event scheduling, date ranges
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disabled DatePicker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                Disabled State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disabled date picker
                  </label>
                  <DatePicker
                    value={disabledDate || undefined}
                    onChange={setDisabledDate}
                    disabled={true}
                    placeholder="This is disabled"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>When to use:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Form is in read-only mode</li>
                      <li>Date is auto-calculated</li>
                      <li>User lacks permissions</li>
                      <li>Loading state</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Different Formats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Date Format Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DD/MM/YYYY Format
                  </label>
                  <DatePicker
                    value={formatDate1 || undefined}
                    onChange={setFormatDate1}
                    format="dd/mm/yyyy"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MM/DD/YYYY Format (US)
                  </label>
                  <DatePicker
                    value={formatDate2 || undefined}
                    onChange={setFormatDate2}
                    format="mm/dd/yyyy"
                    placeholder="MM/DD/YYYY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YYYY-MM-DD Format (ISO)
                  </label>
                  <DatePicker
                    value={formatDate3 || undefined}
                    onChange={setFormatDate3}
                    format="yyyy-mm-dd"
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>Format Examples:</strong>
                    <div className="mt-2 space-y-1 font-mono text-xs">
                      <div>🇬🇧 DD/MM/YYYY: 25/12/2024</div>
                      <div>🇺🇸 MM/DD/YYYY: 12/25/2024</div>
                      <div>📄 YYYY-MM-DD: 2024-12-25</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Component Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📆</div>
                <div>
                  <div className="font-semibold text-gray-900">Calendar UI</div>
                  <div className="text-sm text-gray-600">Visual month grid with day selection</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⬅️➡️</div>
                <div>
                  <div className="font-semibold text-gray-900">Month/Year Navigation</div>
                  <div className="text-sm text-gray-600">Quick navigation controls</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <div className="font-semibold text-gray-900">Date Constraints</div>
                  <div className="text-sm text-gray-600">Min/max date restrictions</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-gray-900">Today Highlight</div>
                  <div className="text-sm text-gray-600">Current date indicator</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-semibold text-gray-900">Multiple Formats</div>
                  <div className="text-sm text-gray-600">DD/MM/YY, MM/DD/YY, YYYY-MM-DD</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-gray-900">Quick Actions</div>
                  <div className="text-sm text-gray-600">Today & Clear buttons</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🚫</div>
                <div>
                  <div className="font-semibold text-gray-900">Disabled State</div>
                  <div className="text-sm text-gray-600">Prevents interaction when needed</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-semibold text-gray-900">Responsive</div>
                  <div className="text-sm text-gray-600">Works on all screen sizes</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎭</div>
                <div>
                  <div className="font-semibold text-gray-900">Dropdown UI</div>
                  <div className="text-sm text-gray-600">Clean popup interface</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">💼 Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🎓 Educational Platform</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Exam</Badge>
                    <span>Schedule exam dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Assignment</Badge>
                    <span>Set assignment deadlines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">Attendance</Badge>
                    <span>Mark attendance by date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Event</Badge>
                    <span>Plan academic events</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🏢 Business Applications</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Booking</Badge>
                    <span>Room/resource reservations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Report</Badge>
                    <span>Date range reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">Leave</Badge>
                    <span>Leave request dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="error">Deadline</Badge>
                    <span>Project milestones</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
