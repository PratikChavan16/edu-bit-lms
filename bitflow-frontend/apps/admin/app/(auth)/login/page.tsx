'use client';

import { useState } from 'react';
import { Button, Input, Card, useAuth } from '@bitflow/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({
        email,
        password,
        portal: 'college-admin',
      });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center p-8">
      {/* Background Blur Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <Card variant="glass" padding="lg">
          <div className="mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Admin Login</h2>
          <p className="text-white/80 mb-8 text-center">Welcome back to EduBit LMS!</p>
          
          {error && (
            <div className="mb-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-100 p-4 rounded-2xl">
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              variant="glass"
              placeholder="admin@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="glass"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/70 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white/90 text-sm cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-white/90 hover:text-white text-sm">
                Forgot Password?
              </a>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              LOGIN
            </Button>
          </form>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/50 rounded-2xl">
            <p className="text-yellow-100 text-sm font-semibold mb-2">🔑 Demo Credentials:</p>
            <div className="text-yellow-100/90 text-xs space-y-1">
              <p><strong>Admin:</strong> admin@college.edu / admin123</p>
              <p><strong>Faculty:</strong> faculty@college.edu / faculty123</p>
              <p><strong>Student:</strong> student@college.edu / student123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
