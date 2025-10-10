'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@bitflow/ui';

export default function UIDemoPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }, 2000);
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
          
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Login</h2>
          <p className="text-white/80 mb-8 text-center">Welcome back!</p>
          
          <div className="space-y-6">
            <Input
              label="Login ID"
              type="email"
              variant="glass"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <Input
              label="Login Password"
              type="password"
              variant="glass"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center text-white/90 text-sm cursor-pointer">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <a href="#" className="text-white/90 hover:text-white text-sm">
                Forgot Password?
              </a>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              onClick={handleLogin}
            >
              LOGIN
            </Button>

            {showAlert && (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 text-green-100 p-4 rounded-2xl">
                ✅ Login successful! (Demo)
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
