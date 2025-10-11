'use client';

import React, { useState } from 'react';
import { Tabs, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@bitflow/ui';

export default function TabsDemo() {
  const [activeTab, setActiveTab] = useState<string>('');

  // Demo content for different tabs
  const profileContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="font-semibold text-gray-900 mb-2">Personal Information</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Name: John Doe</div>
            <div>Email: john.doe@example.com</div>
            <div>Phone: +1 234 567 8900</div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="font-semibold text-gray-900 mb-2">Account Details</div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>User ID: #12345</div>
            <div>Role: Administrator</div>
            <div>Joined: Jan 2024</div>
          </div>
        </div>
      </div>
    </div>
  );

  const settingsContent = (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <div className="font-semibold text-gray-900 mb-3">Preferences</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Notifications</span>
            <Badge variant="success">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Two-Factor Auth</span>
            <Badge variant="success">Enabled</Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const notificationsContent = (
    <div className="space-y-3">
      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <div className="font-semibold text-green-900 mb-1">New Assignment Posted</div>
        <div className="text-sm text-green-700">Math 101 - Calculus Assignment is now available</div>
        <div className="text-xs text-green-600 mt-2">2 hours ago</div>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="font-semibold text-blue-900 mb-1">Grade Published</div>
        <div className="text-sm text-blue-700">Your grade for Physics Exam is now available</div>
        <div className="text-xs text-blue-600 mt-2">5 hours ago</div>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
        <div className="font-semibold text-yellow-900 mb-1">Reminder: Deadline Approaching</div>
        <div className="text-sm text-yellow-700">Submit your project by tomorrow</div>
        <div className="text-xs text-yellow-600 mt-2">1 day ago</div>
      </div>
    </div>
  );

  const securityContent = (
    <div className="space-y-4">
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="font-semibold text-red-900 mb-2">🔒 Security Settings</div>
        <div className="space-y-2 text-sm text-gray-600">
          <div>Last password change: 30 days ago</div>
          <div>Active sessions: 2</div>
          <div>Failed login attempts: 0</div>
        </div>
        <Button variant="danger" size="sm" className="mt-3">Change Password</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            📑 Tabs Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Organize content with tabbed navigation - 3 beautiful variants
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">3</div>
              <div className="text-2xl font-bold text-gray-900">Variants</div>
              <div className="text-sm text-gray-600">UI Styles</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">🎨</div>
              <div className="text-2xl font-bold text-gray-900">Icons</div>
              <div className="text-sm text-gray-600">Supported</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">🚫</div>
              <div className="text-2xl font-bold text-gray-900">Disabled</div>
              <div className="text-sm text-gray-600">State Support</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">⚡</div>
              <div className="text-2xl font-bold text-gray-900">Active Tab</div>
              <div className="text-sm text-gray-600">{activeTab || 'None'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Underline Variant */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Underline Variant (Default)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              variant="underline"
              tabs={[
                {
                  id: 'profile',
                  label: 'Profile',
                  icon: <span>👤</span>,
                  content: profileContent,
                },
                {
                  id: 'settings',
                  label: 'Settings',
                  icon: <span>⚙️</span>,
                  content: settingsContent,
                },
                {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: <span>🔔</span>,
                  content: notificationsContent,
                },
                {
                  id: 'security',
                  label: 'Security',
                  icon: <span>🔒</span>,
                  content: securityContent,
                },
              ]}
              onChange={setActiveTab}
            />
            
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
              <strong>Use case:</strong> Dashboard navigation, settings pages, admin panels
            </div>
          </CardContent>
        </Card>

        {/* Pills Variant */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💊</span>
              Pills Variant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              variant="pills"
              tabs={[
                {
                  id: 'overview',
                  label: 'Overview',
                  icon: <span>📋</span>,
                  content: (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Overview</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">150</div>
                          <div className="text-sm text-gray-600">Total Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">12</div>
                          <div className="text-sm text-gray-600">Active Courses</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-pink-600">45</div>
                          <div className="text-sm text-gray-600">Assignments</div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'analytics',
                  label: 'Analytics',
                  icon: <span>📊</span>,
                  content: (
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Analytics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Average Grade</span>
                          <Badge variant="success">85%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Completion Rate</span>
                          <Badge variant="info">92%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Attendance</span>
                          <Badge variant="success">88%</Badge>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'reports',
                  label: 'Reports',
                  icon: <span>📈</span>,
                  content: (
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Available Reports</h3>
                      <div className="space-y-2">
                        <Button variant="secondary" className="w-full">📄 Student Progress Report</Button>
                        <Button variant="secondary" className="w-full">📊 Course Analytics Report</Button>
                        <Button variant="secondary" className="w-full">📈 Attendance Report</Button>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
            
            <div className="mt-4 p-3 bg-purple-50 rounded text-sm text-gray-600">
              <strong>Use case:</strong> Compact navigation, modern UI, mobile-friendly
            </div>
          </CardContent>
        </Card>

        {/* Bordered Variant */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔲</span>
              Bordered Variant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              variant="bordered"
              tabs={[
                {
                  id: 'courses',
                  label: 'My Courses',
                  icon: <span>📚</span>,
                  content: (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Mathematics 101</div>
                        <div className="text-sm text-gray-600">Instructor: Prof. Smith</div>
                        <Badge variant="info" className="mt-2">In Progress</Badge>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Physics 201</div>
                        <div className="text-sm text-gray-600">Instructor: Dr. Johnson</div>
                        <Badge variant="success" className="mt-2">Completed</Badge>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'assignments',
                  label: 'Assignments',
                  icon: <span>📝</span>,
                  content: (
                    <div className="space-y-3">
                      <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <div className="font-semibold text-yellow-900">Calculus Problem Set</div>
                        <div className="text-sm text-yellow-700">Due: Tomorrow</div>
                        <Badge variant="warning" className="mt-2">Pending</Badge>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="font-semibold text-green-900">Lab Report</div>
                        <div className="text-sm text-green-700">Submitted on time</div>
                        <Badge variant="success" className="mt-2">Submitted</Badge>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'grades',
                  label: 'Grades',
                  icon: <span>🎯</span>,
                  content: (
                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Current Grades</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded">
                          <span>Mathematics</span>
                          <Badge variant="success">A (92%)</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded">
                          <span>Physics</span>
                          <Badge variant="info">B+ (88%)</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded">
                          <span>Chemistry</span>
                          <Badge variant="success">A- (90%)</Badge>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'disabled',
                  label: 'Disabled',
                  icon: <span>🚫</span>,
                  content: <div>This tab is disabled</div>,
                  disabled: true,
                },
              ]}
            />
            
            <div className="mt-4 p-3 bg-pink-50 rounded text-sm text-gray-600">
              <strong>Use case:</strong> Traditional navigation, clear separation, business apps
            </div>
          </CardContent>
        </Card>

        {/* Full Width Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">↔️</span>
              Full Width Tabs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              variant="pills"
              fullWidth={true}
              tabs={[
                {
                  id: 'mon',
                  label: 'Monday',
                  content: (
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-2">📅</div>
                      <div className="font-semibold">Monday Schedule</div>
                      <div className="text-sm text-gray-600 mt-2">Math 9AM - Physics 2PM</div>
                    </div>
                  ),
                },
                {
                  id: 'tue',
                  label: 'Tuesday',
                  content: (
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-2xl mb-2">📅</div>
                      <div className="font-semibold">Tuesday Schedule</div>
                      <div className="text-sm text-gray-600 mt-2">Chemistry 10AM - Lab 3PM</div>
                    </div>
                  ),
                },
                {
                  id: 'wed',
                  label: 'Wednesday',
                  content: (
                    <div className="text-center p-6 bg-pink-50 rounded-lg">
                      <div className="text-2xl mb-2">📅</div>
                      <div className="font-semibold">Wednesday Schedule</div>
                      <div className="text-sm text-gray-600 mt-2">Biology 11AM - English 4PM</div>
                    </div>
                  ),
                },
              ]}
            />
            
            <div className="mt-4 p-3 bg-indigo-50 rounded text-sm text-gray-600">
              <strong>Use case:</strong> Calendars, schedulers, equal-width navigation
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Component Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-semibold text-gray-900">3 Variants</div>
                  <div className="text-sm text-gray-600">Underline, Pills, Bordered</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🖼️</div>
                <div>
                  <div className="font-semibold text-gray-900">Icon Support</div>
                  <div className="text-sm text-gray-600">Add icons to tabs</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🚫</div>
                <div>
                  <div className="font-semibold text-gray-900">Disabled Tabs</div>
                  <div className="text-sm text-gray-600">Prevent interaction</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">↔️</div>
                <div>
                  <div className="font-semibold text-gray-900">Full Width</div>
                  <div className="text-sm text-gray-600">Equal tab widths</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔄</div>
                <div>
                  <div className="font-semibold text-gray-900">onChange Callback</div>
                  <div className="text-sm text-gray-600">Track tab changes</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-gray-900">Fast Switching</div>
                  <div className="text-sm text-gray-600">Instant content change</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
