'use client';

import React, { useState } from 'react';
import { Breadcrumbs, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@bitflow/ui';

export default function BreadcrumbsDemo() {
  const [currentPath, setCurrentPath] = useState<string>('');

  const handleNavigate = (href: string) => {
    setCurrentPath(href);
    alert(`Navigating to: ${href}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🧭 Breadcrumbs Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Navigation paths with hierarchical structure and custom separators
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">🔗</div>
              <div className="text-2xl font-bold text-gray-900">Clickable</div>
              <div className="text-sm text-gray-600">Links</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600 mb-2">🎨</div>
              <div className="text-2xl font-bold text-gray-900">Custom</div>
              <div className="text-sm text-gray-600">Separators</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">📦</div>
              <div className="text-2xl font-bold text-gray-900">Collapse</div>
              <div className="text-sm text-gray-600">Long Paths</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">🖼️</div>
              <div className="text-2xl font-bold text-gray-900">Icons</div>
              <div className="text-sm text-gray-600">Support</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Path Display */}
        {currentPath && (
          <Card className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Last Clicked Path:</div>
                  <div className="font-bold text-orange-600">{currentPath}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setCurrentPath('')}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Basic Breadcrumbs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              Basic Breadcrumbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Simple navigation path:</div>
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Settings', href: '/dashboard/settings' },
                    { label: 'Profile' },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">With icons:</div>
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/', icon: <span>🏠</span> },
                    { label: 'Courses', href: '/courses', icon: <span>📚</span> },
                    { label: 'Mathematics', href: '/courses/math', icon: <span>🔢</span> },
                    { label: 'Calculus', icon: <span>📊</span> },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="text-sm text-gray-600">
                <strong>Use case:</strong> Dashboard navigation, settings pages, multi-level menus
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Separators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">➡️</span>
              Custom Separators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Arrow separator:</div>
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: 'Electronics', href: '/products/electronics' },
                    { label: 'Laptops' },
                  ]}
                  separator={<span className="text-gray-400 mx-2">→</span>}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Slash separator:</div>
                <Breadcrumbs
                  items={[
                    { label: 'Root', href: '/root' },
                    { label: 'Folder1', href: '/root/folder1' },
                    { label: 'Folder2', href: '/root/folder1/folder2' },
                    { label: 'Document.pdf' },
                  ]}
                  separator={<span className="text-gray-400 mx-2">/</span>}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Bullet separator:</div>
                <Breadcrumbs
                  items={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Users', href: '/admin/users' },
                    { label: 'John Doe', href: '/admin/users/john' },
                    { label: 'Edit Profile' },
                  ]}
                  separator={<span className="text-gray-400 mx-2">•</span>}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collapsed Long Paths */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              Collapsed Long Paths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Full path (10 items):</div>
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Level 1', href: '/level1' },
                    { label: 'Level 2', href: '/level1/level2' },
                    { label: 'Level 3', href: '/level1/level2/level3' },
                    { label: 'Level 4', href: '/level1/level2/level3/level4' },
                    { label: 'Level 5', href: '/level1/level2/level3/level4/level5' },
                    { label: 'Level 6', href: '/level1/level2/level3/level4/level5/level6' },
                    { label: 'Level 7', href: '/level1/level2/level3/level4/level5/level6/level7' },
                    { label: 'Level 8', href: '/level1/level2/level3/level4/level5/level6/level7/level8' },
                    { label: 'Current Page' },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Collapsed to 5 items (shows first + ... + last 3):</div>
                <Breadcrumbs
                  items={[
                    { label: 'Home', href: '/' },
                    { label: 'Level 1', href: '/level1' },
                    { label: 'Level 2', href: '/level1/level2' },
                    { label: 'Level 3', href: '/level1/level2/level3' },
                    { label: 'Level 4', href: '/level1/level2/level3/level4' },
                    { label: 'Level 5', href: '/level1/level2/level3/level4/level5' },
                    { label: 'Level 6', href: '/level1/level2/level3/level4/level5/level6' },
                    { label: 'Level 7', href: '/level1/level2/level3/level4/level5/level6/level7' },
                    { label: 'Level 8', href: '/level1/level2/level3/level4/level5/level6/level7/level8' },
                    { label: 'Current Page' },
                  ]}
                  maxItems={5}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="text-sm text-gray-600">
                <strong>Tip:</strong> Use maxItems prop to prevent extremely long breadcrumb trails
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Platform Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Educational Platform Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <Badge variant="info" className="mb-3">Course Navigation</Badge>
                <Breadcrumbs
                  items={[
                    { label: 'Dashboard', href: '/dashboard', icon: <span>📊</span> },
                    { label: 'My Courses', href: '/courses', icon: <span>📚</span> },
                    { label: 'Computer Science', href: '/courses/cs', icon: <span>💻</span> },
                    { label: 'Data Structures', href: '/courses/cs/ds', icon: <span>🔢</span> },
                    { label: 'Assignment 3', icon: <span>📝</span> },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <Badge variant="success" className="mb-3">Student Profile</Badge>
                <Breadcrumbs
                  items={[
                    { label: 'Admin', href: '/admin', icon: <span>⚙️</span> },
                    { label: 'Students', href: '/admin/students', icon: <span>👥</span> },
                    { label: 'Class 10A', href: '/admin/students/10a', icon: <span>🎓</span> },
                    { label: 'John Doe', href: '/admin/students/10a/john', icon: <span>👤</span> },
                    { label: 'Academic Records', icon: <span>📊</span> },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <Badge variant="warning" className="mb-3">Assessment Builder</Badge>
                <Breadcrumbs
                  items={[
                    { label: 'Faculty', href: '/faculty', icon: <span>👨‍🏫</span> },
                    { label: 'Assessments', href: '/faculty/assessments', icon: <span>📋</span> },
                    { label: 'Midterm Exams', href: '/faculty/assessments/midterm', icon: <span>📝</span> },
                    { label: 'Math 101', href: '/faculty/assessments/midterm/math', icon: <span>🔢</span> },
                    { label: 'Question Bank', icon: <span>❓</span> },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <Badge variant="error" className="mb-3">Library Resources</Badge>
                <Breadcrumbs
                  items={[
                    { label: 'Library', href: '/library', icon: <span>📚</span> },
                    { label: 'Digital Resources', href: '/library/digital', icon: <span>💾</span> },
                    { label: 'E-Books', href: '/library/digital/ebooks', icon: <span>📖</span> },
                    { label: 'Science', href: '/library/digital/ebooks/science', icon: <span>🔬</span> },
                    { label: 'Physics Textbook', icon: <span>⚛️</span> },
                  ]}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File System Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📁</span>
              File System Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 font-mono text-sm">
                <Breadcrumbs
                  items={[
                    { label: 'root', href: '/root', icon: <span>🖥️</span> },
                    { label: 'home', href: '/root/home', icon: <span>🏠</span> },
                    { label: 'user', href: '/root/home/user', icon: <span>👤</span> },
                    { label: 'documents', href: '/root/home/user/documents', icon: <span>📄</span> },
                    { label: 'projects', href: '/root/home/user/documents/projects', icon: <span>📂</span> },
                    { label: 'edu-bit-lms', icon: <span>📦</span> },
                  ]}
                  separator={<span className="text-gray-400 mx-1">/</span>}
                  onNavigate={handleNavigate}
                />
              </div>

              <div className="text-sm text-gray-600">
                <strong>Use case:</strong> File managers, document browsers, folder navigation
              </div>
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
                <div className="text-2xl">🔗</div>
                <div>
                  <div className="font-semibold text-gray-900">Clickable Links</div>
                  <div className="text-sm text-gray-600">Navigate through path</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-semibold text-gray-900">Custom Separators</div>
                  <div className="text-sm text-gray-600">Arrows, slashes, bullets</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📦</div>
                <div>
                  <div className="font-semibold text-gray-900">Path Collapse</div>
                  <div className="text-sm text-gray-600">Handle long paths</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🖼️</div>
                <div>
                  <div className="font-semibold text-gray-900">Icon Support</div>
                  <div className="text-sm text-gray-600">Add icons to items</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-gray-900">Current Page</div>
                  <div className="text-sm text-gray-600">Last item highlighted</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🔄</div>
                <div>
                  <div className="font-semibold text-gray-900">onNavigate</div>
                  <div className="text-sm text-gray-600">Custom navigation handler</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">♿</div>
                <div>
                  <div className="font-semibold text-gray-900">Accessible</div>
                  <div className="text-sm text-gray-600">Proper ARIA labels</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-semibold text-gray-900">Responsive</div>
                  <div className="text-sm text-gray-600">Works on all screens</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-gray-900">Lightweight</div>
                  <div className="text-sm text-gray-600">Minimal code</div>
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
                    <Badge variant="info">Course</Badge>
                    <span>Course → Module → Lesson → Topic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Student</Badge>
                    <span>Admin → Students → Class → Profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">Assessment</Badge>
                    <span>Assessments → Exam → Questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Library</Badge>
                    <span>Library → Category → Subcategory</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🏢 Business Applications</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="success">Files</Badge>
                    <span>File system navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="info">Settings</Badge>
                    <span>Multi-level settings pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="warning">E-commerce</Badge>
                    <span>Category → Product navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="error">Admin</Badge>
                    <span>Admin panel hierarchy</span>
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
