'use client';

import React from 'react';
import { ToastProvider, useToast, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@bitflow/ui';

function ToastDemoContent() {
  const { showToast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🔔 Toast Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Beautiful notification system with auto-dismiss and manual control
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-2xl font-bold text-gray-900">Types</div>
              <div className="text-sm text-gray-600">Variants</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600 mb-2">⏱️</div>
              <div className="text-2xl font-bold text-gray-900">Auto-dismiss</div>
              <div className="text-sm text-gray-600">Configurable</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-teal-600 mb-2">✖️</div>
              <div className="text-2xl font-bold text-gray-900">Manual Close</div>
              <div className="text-sm text-gray-600">User Control</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-900">Stack</div>
              <div className="text-sm text-gray-600">Multiple Toasts</div>
            </CardContent>
          </Card>
        </div>

        {/* Toast Type Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Toast Types - Click to Show
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Success Toast */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 text-center">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-semibold text-gray-900 mb-2">Success</div>
                <div className="text-sm text-gray-600 mb-4">Positive feedback</div>
                <Button
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => showToast('Operation completed successfully! 🎉', 'success', 3000)}
                >
                  Show Success
                </Button>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('File uploaded successfully', 'success', 2000)}
                  >
                    Upload Success
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Changes saved!', 'success', 2000)}
                  >
                    Save Success
                  </Button>
                </div>
              </div>

              {/* Error Toast */}
              <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border-2 border-red-200 text-center">
                <div className="text-4xl mb-3">❌</div>
                <div className="font-semibold text-gray-900 mb-2">Error</div>
                <div className="text-sm text-gray-600 mb-4">Error messages</div>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => showToast('Failed to process request. Please try again.', 'error', 4000)}
                >
                  Show Error
                </Button>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Network connection failed', 'error', 3000)}
                  >
                    Network Error
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Invalid credentials', 'error', 3000)}
                  >
                    Auth Error
                  </Button>
                </div>
              </div>

              {/* Warning Toast */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-200 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <div className="font-semibold text-gray-900 mb-2">Warning</div>
                <div className="text-sm text-gray-600 mb-4">Important notices</div>
                <Button
                  variant="primary"
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => showToast('Your session will expire in 5 minutes ⏰', 'warning', 3000)}
                >
                  Show Warning
                </Button>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Unsaved changes detected', 'warning', 2000)}
                  >
                    Unsaved Warning
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Low storage space', 'warning', 2000)}
                  >
                    Storage Warning
                  </Button>
                </div>
              </div>

              {/* Info Toast */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 text-center">
                <div className="text-4xl mb-3">ℹ️</div>
                <div className="font-semibold text-gray-900 mb-2">Info</div>
                <div className="text-sm text-gray-600 mb-4">Informational</div>
                <Button
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => showToast('New updates are available for download 📦', 'info', 3000)}
                >
                  Show Info
                </Button>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Scheduled maintenance tonight', 'info', 2000)}
                  >
                    Maintenance Info
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('New feature released!', 'info', 2000)}
                  >
                    Feature Info
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              Auto-dismiss Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Quick (2s)</div>
                <div className="text-sm text-gray-600 mb-3">For simple confirmations</div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => showToast('Quick notification!', 'info', 2000)}
                >
                  Show 2s Toast
                </Button>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Standard (3s)</div>
                <div className="text-sm text-gray-600 mb-3">Default duration</div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => showToast('Standard duration toast', 'success', 3000)}
                >
                  Show 3s Toast
                </Button>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Long (5s)</div>
                <div className="text-sm text-gray-600 mb-3">For important messages</div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => showToast('This toast stays longer for important info', 'warning', 5000)}
                >
                  Show 5s Toast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multiple Toasts Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Multiple Toasts (Stack)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">Trigger Multiple Notifications</div>
                <div className="text-sm text-gray-600 mb-4">
                  Click to show multiple toasts stacked vertically
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      showToast('First notification', 'info', 3000);
                      setTimeout(() => showToast('Second notification', 'success', 3000), 500);
                      setTimeout(() => showToast('Third notification', 'warning', 3000), 1000);
                    }}
                  >
                    Show 3 Toasts
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      showToast('Processing started...', 'info', 2000);
                      setTimeout(() => showToast('Step 1 completed', 'success', 2000), 600);
                      setTimeout(() => showToast('Step 2 completed', 'success', 2000), 1200);
                      setTimeout(() => showToast('All steps completed!', 'success', 2000), 1800);
                    }}
                  >
                    Show Process Flow
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Case Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💼</span>
              Common Use Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🎓 Educational Platform</h3>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Assignment submitted successfully!', 'success', 3000)}
                  >
                    Assignment Submitted
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('New grade available for Math 101', 'info', 3000)}
                  >
                    Grade Published
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Deadline approaching! Submit by tomorrow', 'warning', 4000)}
                  >
                    Deadline Reminder
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Failed to upload file. File size too large', 'error', 3000)}
                  >
                    Upload Failed
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">🏢 Business Applications</h3>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Profile updated successfully', 'success', 3000)}
                  >
                    Profile Updated
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('New message from John Doe', 'info', 3000)}
                  >
                    New Message
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Password will expire in 3 days', 'warning', 4000)}
                  >
                    Password Expiring
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => showToast('Session expired. Please login again', 'error', 3000)}
                  >
                    Session Expired
                  </Button>
                </div>
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
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-semibold text-gray-900">4 Variants</div>
                  <div className="text-sm text-gray-600">Success, Error, Warning, Info</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⏱️</div>
                <div>
                  <div className="font-semibold text-gray-900">Auto-dismiss</div>
                  <div className="text-sm text-gray-600">Configurable duration</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">✖️</div>
                <div>
                  <div className="font-semibold text-gray-900">Manual Close</div>
                  <div className="text-sm text-gray-600">Close button included</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <div className="font-semibold text-gray-900">Stack Multiple</div>
                  <div className="text-sm text-gray-600">Show multiple toasts</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎭</div>
                <div>
                  <div className="font-semibold text-gray-900">Gradient Design</div>
                  <div className="text-sm text-gray-600">Beautiful backgrounds</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🖼️</div>
                <div>
                  <div className="font-semibold text-gray-900">Icons</div>
                  <div className="text-sm text-gray-600">Type-specific icons</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-semibold text-gray-900">Fixed Position</div>
                  <div className="text-sm text-gray-600">Top-right corner</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-gray-900">Slide Animation</div>
                  <div className="text-sm text-gray-600">Smooth entrance</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-gray-900">Easy API</div>
                  <div className="text-sm text-gray-600">Simple hook usage</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">💻 Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 font-mono text-sm">
              <div className="text-green-400">// Wrap your app with ToastProvider</div>
              <div className="mt-2">
                <span className="text-blue-400">import</span> {`{ ToastProvider } `}
                <span className="text-blue-400">from</span> <span className="text-yellow-400">'@bitflow/ui'</span>;
              </div>
              <div className="mt-4">
                <span className="text-purple-400">function</span> <span className="text-yellow-400">App</span>() {`{`}
              </div>
              <div className="ml-4">
                <span className="text-blue-400">return</span> (
              </div>
              <div className="ml-8">
                {`<ToastProvider>`}
              </div>
              <div className="ml-12 text-gray-500">{`{/* Your app content */}`}</div>
              <div className="ml-8">
                {`</ToastProvider>`}
              </div>
              <div className="ml-4">);{`}`}</div>
              <div>{`}`}</div>
              
              <div className="mt-6 text-green-400">// Use in your components</div>
              <div className="mt-2">
                <span className="text-blue-400">const</span> {`{ showToast } = `}
                <span className="text-yellow-400">useToast</span>();
              </div>
              <div className="mt-2">
                <span className="text-yellow-400">showToast</span>
                (<span className="text-green-400">'Success!'</span>, 
                <span className="text-green-400">'success'</span>, 
                <span className="text-orange-400">3000</span>);
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ToastDemo() {
  return (
    <ToastProvider>
      <ToastDemoContent />
    </ToastProvider>
  );
}
