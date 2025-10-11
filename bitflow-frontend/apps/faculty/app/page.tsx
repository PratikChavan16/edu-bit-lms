'use client';

export default function FacultyHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Faculty Portal</h1>
        <p className="text-xl text-gray-600 mb-8">Welcome to BitFlow LMS Faculty Dashboard</p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
