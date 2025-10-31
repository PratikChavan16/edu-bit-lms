# Bitflow Owner Portal - Production Readiness Roadmap
**Step-by-Step Execution Plan to 100% Completion**

**Document Version:** 1.0  
**Created:** October 30, 2025  
**Target Completion:** 8-10 weeks (single dev) | 4 weeks (3 devs)  
**Current Status:** 42% → Target: 100%

---

## 📋 How to Use This Roadmap

This document provides **exact step-by-step instructions** to complete the Bitflow Owner Portal. Each task includes:
- ✅ Specific files to create/modify
- ✅ Code snippets and implementation details
- ✅ Testing steps
- ✅ Dependencies and prerequisites
- ✅ Estimated time
- ✅ Success criteria

**Work sequentially through each phase.** Do not skip ahead unless dependencies allow.

---

# PHASE 1: CRITICAL FIXES & INFRASTRUCTURE (Week 1-2)

**Goal:** Fix blocking issues and set up infrastructure for remaining work  
**Duration:** 10 days  
**Priority:** 🔴 CRITICAL - Nothing else can proceed without these

---

## Task 1.1: Fix God Mode Backend (Day 1)

### Problem
Bitflow Owners can only see data for ONE university. Backend applies `university_id` scoping to all roles.

### Solution
Modify Prisma middleware to bypass scoping for `bitflow_owner` role.

### Files to Modify

#### 1. `backend/app/Middleware/TenantScopingMiddleware.php` (Laravel)

**Current Code Pattern:**
```php
// Automatically adds university_id filter to all queries
public function handle($request, Closure $next)
{
    if (auth()->check()) {
        $universityId = auth()->user()->university_id;
        // Applies to ALL queries
        DB::table('*')->where('university_id', $universityId);
    }
    return $next($request);
}
```

**New Code (add before applying filter):**
```php
public function handle($request, Closure $next)
{
    if (auth()->check()) {
        $user = auth()->user();
        
        // BYPASS SCOPING FOR GOD MODE
        if ($user->hasRole('bitflow_owner')) {
            // Don't apply any university_id filter
            // Bitflow Owners see ALL data across ALL universities
            return $next($request);
        }
        
        // For all other roles, apply normal scoping
        $universityId = $user->university_id;
        
        // Apply university scoping
        Model::addGlobalScope('university', function ($builder) use ($universityId) {
            $builder->where('university_id', $universityId);
        });
    }
    
    return $next($request);
}
```

#### 2. `backend/app/Http/Controllers/UniversityController.php`

**Add method to support God Mode listing:**
```php
public function index(Request $request)
{
    $user = auth()->user();
    
    // God Mode: See all universities
    if ($user->hasRole('bitflow_owner')) {
        $universities = University::with(['colleges', 'users'])
            ->paginate(20);
    } 
    // University Admin: See only their university
    else if ($user->hasRole('university_admin')) {
        $universities = University::where('id', $user->university_id)
            ->with(['colleges', 'users'])
            ->paginate(20);
    }
    // College Admin: See only their university (read-only)
    else {
        $universities = University::where('id', $user->university_id)
            ->with(['colleges', 'users'])
            ->paginate(20);
    }
    
    return response()->json($universities);
}
```

#### 3. Repeat for ALL controllers

Update these controllers with God Mode logic:
- `backend/app/Http/Controllers/CollegeController.php`
- `backend/app/Http/Controllers/UserController.php`
- `backend/app/Http/Controllers/DepartmentController.php`
- `backend/app/Http/Controllers/FacultyController.php`
- `backend/app/Http/Controllers/StudentController.php`

**Pattern for all controllers:**
```php
public function index(Request $request)
{
    $user = auth()->user();
    $query = ModelName::query();
    
    // God Mode check
    if (!$user->hasRole('bitflow_owner')) {
        // Apply scoping for non-God Mode users
        $query->where('university_id', $user->university_id);
    }
    
    // Rest of your filtering logic...
    $results = $query->paginate(20);
    
    return response()->json($results);
}
```

### Testing Steps

1. **Test God Mode Access:**
```bash
# In terminal
cd backend
php artisan tinker

# Create a test Bitflow Owner if not exists
$user = User::where('email', 'admin@bitflow.com')->first();
$user->assignRole('bitflow_owner');

# Test API
curl -H "Authorization: Bearer {token}" http://localhost:8000/api/universities
# Should return ALL universities, not just one
```

2. **Test Regular User Scoping Still Works:**
```bash
# Login as University Admin
$user = User::where('email', 'uniadmin@example.com')->first();
$token = $user->createToken('test')->plainTextToken;

curl -H "Authorization: Bearer {token}" http://localhost:8000/api/universities
# Should return ONLY their university
```

### Success Criteria
- ✅ Bitflow Owner API returns ALL universities
- ✅ University Admin API returns ONLY their university
- ✅ College Admin API returns ONLY their university
- ✅ No errors in Laravel logs
- ✅ Existing tests still pass

**Estimated Time:** 6-8 hours

---

## Task 1.2: Fix God Mode Frontend (Day 2)

### Problem
Frontend doesn't show cross-university data or provide university selector.

### Solution
Add university context selector and update data fetching logic.

### Files to Create/Modify

#### 1. Create `bitflow-admin/stores/useGodModeStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface University {
  id: string;
  name: string;
  code: string;
}

interface GodModeStore {
  isGodMode: boolean;
  selectedUniversityId: string | null;
  universities: University[];
  
  setIsGodMode: (isGodMode: boolean) => void;
  setSelectedUniversity: (universityId: string | null) => void;
  setUniversities: (universities: University[]) => void;
  clearSelection: () => void;
}

export const useGodModeStore = create<GodModeStore>()(
  persist(
    (set) => ({
      isGodMode: false,
      selectedUniversityId: null,
      universities: [],
      
      setIsGodMode: (isGodMode) => set({ isGodMode }),
      
      setSelectedUniversity: (universityId) => 
        set({ selectedUniversityId: universityId }),
      
      setUniversities: (universities) => 
        set({ universities }),
      
      clearSelection: () => 
        set({ selectedUniversityId: null }),
    }),
    {
      name: 'god-mode-storage',
    }
  )
);
```

#### 2. Create `bitflow-admin/components/GodModeSelector.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useGodModeStore } from '@/stores/useGodModeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export function GodModeSelector() {
  const { user } = useAuthStore();
  const { 
    isGodMode, 
    selectedUniversityId, 
    universities,
    setSelectedUniversity,
    setUniversities,
    setIsGodMode,
  } = useGodModeStore();

  useEffect(() => {
    // Check if user has God Mode (bitflow_owner role)
    const hasGodMode = user?.role === 'bitflow_owner';
    setIsGodMode(hasGodMode);

    // Fetch universities if God Mode enabled
    if (hasGodMode) {
      fetchUniversities();
    }
  }, [user]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      setUniversities(data.data || []);
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    }
  };

  if (!isGodMode) {
    return null; // Don't show selector for non-God Mode users
  }

  return (
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="flex items-center gap-1">
        <Crown className="h-3 w-3" />
        God Mode
      </Badge>
      
      <Select
        value={selectedUniversityId || 'all'}
        onValueChange={(value) => {
          setSelectedUniversity(value === 'all' ? null : value);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="All Universities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Universities</SelectItem>
          {universities.map((uni) => (
            <SelectItem key={uni.id} value={uni.id}>
              {uni.name} ({uni.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

#### 3. Modify `bitflow-admin/components/layout/Header.tsx`

```typescript
import { GodModeSelector } from '@/components/GodModeSelector';

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          {/* Existing logo and navigation */}
        </div>
        
        {/* Add God Mode Selector */}
        <div className="flex items-center gap-4">
          <GodModeSelector />
          
          {/* Existing notifications, user menu, etc. */}
        </div>
      </div>
    </header>
  );
}
```

#### 4. Update API Utility `bitflow-admin/lib/api.ts`

```typescript
import { useGodModeStore } from '@/stores/useGodModeStore';

export async function fetchWithGodMode(url: string, options: RequestInit = {}) {
  const { isGodMode, selectedUniversityId } = useGodModeStore.getState();
  
  // Add university filter to URL if specific university selected
  const finalUrl = new URL(url, window.location.origin);
  
  if (isGodMode && selectedUniversityId) {
    finalUrl.searchParams.append('university_id', selectedUniversityId);
  }
  
  return fetch(finalUrl.toString(), options);
}

// Update existing API functions to use fetchWithGodMode
export const api = {
  universities: {
    list: () => fetchWithGodMode('/api/universities'),
    get: (id: string) => fetchWithGodMode(`/api/universities/${id}`),
    // ... other methods
  },
  
  colleges: {
    list: () => fetchWithGodMode('/api/colleges'),
    get: (id: string) => fetchWithGodMode(`/api/colleges/${id}`),
    // ... other methods
  },
  
  // Add for all resources...
};
```

#### 5. Update Data Fetching Hooks

**Example: `bitflow-admin/hooks/useUniversities.ts`**

```typescript
import useSWR from 'swr';
import { useGodModeStore } from '@/stores/useGodModeStore';
import { fetchWithGodMode } from '@/lib/api';

export function useUniversities() {
  const { selectedUniversityId } = useGodModeStore();
  
  // Re-fetch when university selection changes
  const { data, error, mutate } = useSWR(
    ['universities', selectedUniversityId],
    () => fetchWithGodMode('/api/universities').then(r => r.json()),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    universities: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
```

### Testing Steps

1. **Login as Bitflow Owner:**
   - Should see "God Mode" badge with crown icon
   - Should see university selector dropdown
   - Dropdown should show "All Universities" + list of all universities

2. **Test Cross-University Viewing:**
   - Select "All Universities" → Should show all data across all universities
   - Select specific university → Should filter to show only that university's data
   - Switch between universities → Data should update

3. **Test Regular User (Non-God Mode):**
   - Login as University Admin
   - Should NOT see God Mode badge
   - Should NOT see university selector
   - Should only see their university's data

### Success Criteria
- ✅ God Mode badge visible for Bitflow Owners
- ✅ University selector shows all universities
- ✅ Selecting university filters all data across portal
- ✅ "All Universities" shows aggregated data
- ✅ Regular users don't see God Mode UI
- ✅ Data updates when selection changes

**Estimated Time:** 6-8 hours

---

## Task 1.3: Implement WebSocket Infrastructure (Days 3-5)

### Problem
No real-time updates. Dashboard shows stale data. No live notifications.

### Solution
Set up Socket.io server and integrate with frontend.

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install socket.io redis ioredis
npm install --save-dev @types/socket.io
```

#### 2. Create `backend/src/socket/server.ts`

```typescript
import { Server } from 'socket.io';
import { createServer } from 'http';
import Redis from 'ioredis';
import { verifyJWT } from '../utils/auth';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

export function initializeWebSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = await verifyJWT(token);
      socket.data.user = decoded;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`User connected: ${user.id} (${user.role})`);

    // Join user-specific room
    socket.join(`user:${user.id}`);

    // Join role-specific room
    socket.join(`role:${user.role}`);

    // Join university room (if not God Mode)
    if (user.role !== 'bitflow_owner' && user.university_id) {
      socket.join(`university:${user.university_id}`);
    }

    // God Mode users join all-data room
    if (user.role === 'bitflow_owner') {
      socket.join('god-mode');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.id}`);
    });

    // Handle client-side events
    socket.on('mark-notification-read', async (notificationId) => {
      // Handle notification read
      // Emit back confirmation
      socket.emit('notification-marked-read', notificationId);
    });
  });

  return io;
}

// Export singleton instance
let ioInstance: Server;

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error('Socket.io not initialized');
  }
  return ioInstance;
}

export function setIO(io: Server) {
  ioInstance = io;
}
```

#### 3. Create `backend/src/socket/events.ts`

```typescript
import { getIO } from './server';

export class WebSocketEvents {
  // University events
  static universityCreated(university: any) {
    const io = getIO();
    io.to('god-mode').emit('university:created', university);
  }

  static universityUpdated(university: any) {
    const io = getIO();
    io.to('god-mode').emit('university:updated', university);
    io.to(`university:${university.id}`).emit('university:updated', university);
  }

  // College events
  static collegeCreated(college: any) {
    const io = getIO();
    io.to('god-mode').emit('college:created', college);
    io.to(`university:${college.university_id}`).emit('college:created', college);
  }

  static collegeUpdated(college: any) {
    const io = getIO();
    io.to('god-mode').emit('college:updated', college);
    io.to(`university:${college.university_id}`).emit('college:updated', college);
  }

  // User events
  static userCreated(user: any) {
    const io = getIO();
    io.to('god-mode').emit('user:created', user);
    if (user.university_id) {
      io.to(`university:${user.university_id}`).emit('user:created', user);
    }
  }

  // Notification events
  static sendNotification(userId: string, notification: any) {
    const io = getIO();
    io.to(`user:${userId}`).emit('notification:new', notification);
  }

  // Dashboard metrics update
  static dashboardMetricsUpdated(metrics: any, universityId?: string) {
    const io = getIO();
    
    if (universityId) {
      io.to(`university:${universityId}`).emit('dashboard:metrics-updated', metrics);
    } else {
      io.to('god-mode').emit('dashboard:metrics-updated', metrics);
    }
  }

  // Support ticket events
  static ticketCreated(ticket: any) {
    const io = getIO();
    io.to('role:bitflow_owner').emit('ticket:created', ticket);
  }

  static ticketUpdated(ticket: any) {
    const io = getIO();
    io.to(`user:${ticket.created_by}`).emit('ticket:updated', ticket);
    io.to('role:bitflow_owner').emit('ticket:updated', ticket);
  }
}
```

#### 4. Update `backend/src/index.ts`

```typescript
import express from 'express';
import { createServer } from 'http';
import { initializeWebSocket, setIO } from './socket/server';

const app = express();
const httpServer = createServer(app);

// Initialize WebSocket
const io = initializeWebSocket(httpServer);
setIO(io);

// ... rest of your Express setup

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});
```

#### 5. Update Controllers to Emit Events

**Example: `backend/src/controllers/UniversityController.ts`**

```typescript
import { WebSocketEvents } from '../socket/events';

export class UniversityController {
  async create(req: Request, res: Response) {
    try {
      const university = await University.create(req.body);
      
      // Emit WebSocket event
      WebSocketEvents.universityCreated(university);
      
      return res.json(university);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const university = await University.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      // Emit WebSocket event
      WebSocketEvents.universityUpdated(university);
      
      return res.json(university);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd bitflow-admin
npm install socket.io-client
```

#### 2. Create `bitflow-admin/lib/socket.ts`

```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSocket(token: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
```

#### 3. Create `bitflow-admin/hooks/useWebSocket.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { initializeSocket, getSocket, disconnectSocket } from '@/lib/socket';

export function useWebSocket() {
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (token && user) {
      initializeSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [token, user]);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    const socket = getSocket();
    if (socket) {
      socket.on(event, handler);
      
      // Return cleanup function
      return () => {
        socket.off(event, handler);
      };
    }
  }, []);

  const emit = useCallback((event: string, ...args: any[]) => {
    const socket = getSocket();
    if (socket) {
      socket.emit(event, ...args);
    }
  }, []);

  return { on, emit };
}
```

#### 4. Create `bitflow-admin/hooks/useRealtimeData.ts`

```typescript
import { useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import useSWR, { mutate } from 'swr';

export function useRealtimeUniversities() {
  const { on } = useWebSocket();
  const { data, error } = useSWR('/api/universities');

  useEffect(() => {
    const cleanup1 = on?.('university:created', (university) => {
      // Optimistically update local data
      mutate('/api/universities', (current: any) => {
        return {
          ...current,
          data: [university, ...(current?.data || [])],
        };
      }, false);
    });

    const cleanup2 = on?.('university:updated', (university) => {
      mutate('/api/universities', (current: any) => {
        return {
          ...current,
          data: current?.data?.map((u: any) => 
            u.id === university.id ? university : u
          ) || [],
        };
      }, false);
    });

    return () => {
      cleanup1?.();
      cleanup2?.();
    };
  }, [on]);

  return {
    universities: data?.data || [],
    isLoading: !error && !data,
    error,
  };
}

export function useRealtimeNotifications() {
  const { on } = useWebSocket();
  const { data, error } = useSWR('/api/notifications');

  useEffect(() => {
    const cleanup = on?.('notification:new', (notification) => {
      // Add new notification to list
      mutate('/api/notifications', (current: any) => {
        return {
          ...current,
          data: [notification, ...(current?.data || [])],
        };
      }, false);

      // Show toast notification
      toast.info(notification.message);
    });

    return () => {
      cleanup?.();
    };
  }, [on]);

  return {
    notifications: data?.data || [],
    isLoading: !error && !data,
    error,
  };
}
```

#### 5. Update `bitflow-admin/app/dashboard/page.tsx`

```typescript
'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { on } = useWebSocket();
  const [metrics, setMetrics] = useState({
    universities: 0,
    colleges: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Listen for real-time metric updates
    const cleanup = on?.('dashboard:metrics-updated', (newMetrics) => {
      setMetrics(newMetrics);
    });

    return () => {
      cleanup?.();
    };
  }, [on]);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Universities" value={metrics.universities} />
        <StatCard title="Colleges" value={metrics.colleges} />
        <StatCard title="Users" value={metrics.users} />
        <StatCard title="Revenue" value={`$${metrics.revenue}`} />
      </div>
    </div>
  );
}
```

### Testing Steps

1. **Backend Test:**
```bash
cd backend
npm run dev

# In separate terminal, test WebSocket connection
node -e "
const io = require('socket.io-client');
const socket = io('http://localhost:8000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
socket.on('connect', () => console.log('Connected!'));
"
```

2. **Frontend Test:**
   - Login to Bitflow Owner Portal
   - Open browser DevTools → Network → WS tab
   - Should see WebSocket connection established
   - Create a new university → Should see live update on dashboard
   - Open portal in 2 tabs → Update in one tab should reflect in other

3. **Multi-User Test:**
   - Login as Bitflow Owner in Tab 1
   - Login as University Admin in Tab 2
   - Create college in Tab 1 → Tab 2 should get real-time update

### Success Criteria
- ✅ WebSocket server starts without errors
- ✅ Frontend connects to WebSocket automatically
- ✅ Authentication works (invalid token rejected)
- ✅ Real-time updates work for universities/colleges/users
- ✅ Dashboard metrics update in real-time
- ✅ Notifications appear instantly
- ✅ Multiple users can connect simultaneously

**Estimated Time:** 2-3 days (16-24 hours)

---

## Task 1.4: Implement Session Management with Redis (Day 6)

### Problem
- Users not logged out after 2 hours (per specification)
- No session tracking
- Sessions not persisted

### Solution
Implement Redis-based session storage with 2-hour TTL.

### Backend Setup

#### 1. Install Dependencies

```bash
cd backend
npm install express-session connect-redis ioredis
npm install --save-dev @types/express-session @types/connect-redis
```

#### 2. Create `backend/src/config/redis.ts`

```typescript
import Redis from 'ioredis';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0, // Use database 0 for sessions
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redisClient;
```

#### 3. Create `backend/src/middleware/session.ts`

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { redisClient } from '../config/redis';

const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const sessionMiddleware = session({
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'bitflow:sess:',
    ttl: TWO_HOURS / 1000, // TTL in seconds
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'bitflow.sid', // Custom session cookie name
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: TWO_HOURS,
    sameSite: 'strict', // CSRF protection
  },
});
```

#### 4. Update `backend/src/index.ts`

```typescript
import express from 'express';
import { sessionMiddleware } from './middleware/session';

const app = express();

// Add session middleware BEFORE routes
app.use(sessionMiddleware);

// ... rest of your middleware and routes
```

#### 5. Create `backend/src/controllers/AuthController.ts`

```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { redisClient } from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const TOKEN_EXPIRY = '2h'; // 2 hours

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          university_id: user.university_id,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Store session in Redis
      const sessionKey = `bitflow:session:${user.id}`;
      await redisClient.setex(
        sessionKey,
        2 * 60 * 60, // 2 hours in seconds
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          loginAt: new Date().toISOString(),
        })
      );

      // Save session
      req.session.userId = user.id;
      req.session.token = token;

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          university_id: user.university_id,
        },
        expiresIn: TOKEN_EXPIRY,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = req.session.userId;

      if (userId) {
        // Remove session from Redis
        await redisClient.del(`bitflow:session:${userId}`);
      }

      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
      });

      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Check if session exists in Redis
      const sessionKey = `bitflow:session:${userId}`;
      const sessionData = await redisClient.get(sessionKey);

      if (!sessionData) {
        return res.status(401).json({ error: 'Session expired' });
      }

      // Get user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Generate new token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          university_id: user.university_id,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Extend session TTL
      await redisClient.expire(sessionKey, 2 * 60 * 60);

      // Update session
      req.session.token = token;

      return res.json({
        token,
        expiresIn: TOKEN_EXPIRY,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async validateSession(req: Request, res: Response) {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ valid: false });
      }

      // Check Redis session
      const sessionKey = `bitflow:session:${userId}`;
      const sessionData = await redisClient.get(sessionKey);

      if (!sessionData) {
        return res.status(401).json({ valid: false, reason: 'Session expired' });
      }

      return res.json({ valid: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
```

### Frontend Setup

#### 1. Update `bitflow-admin/lib/auth.ts`

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const TOKEN_REFRESH_BEFORE = 10 * 60 * 1000; // Refresh 10 min before expiry

export class SessionManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private tokenExpiresAt: Date | null = null;

  start(expiresIn: string) {
    // Parse expiry (e.g., "2h" → 2 hours)
    const hours = parseInt(expiresIn.replace('h', ''));
    this.tokenExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    // Start checking session
    this.checkInterval = setInterval(() => {
      this.checkSession();
    }, SESSION_CHECK_INTERVAL);

    // Also check token expiry
    this.scheduleTokenRefresh();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkSession() {
    try {
      const response = await fetch('/api/auth/validate-session');
      const data = await response.json();

      if (!data.valid) {
        // Session expired, log out user
        this.handleSessionExpired(data.reason);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  }

  private scheduleTokenRefresh() {
    if (!this.tokenExpiresAt) return;

    const timeUntilRefresh = this.tokenExpiresAt.getTime() - Date.now() - TOKEN_REFRESH_BEFORE;

    if (timeUntilRefresh > 0) {
      setTimeout(() => {
        this.refreshToken();
      }, timeUntilRefresh);
    }
  }

  private async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update token in store
        const { setToken } = useAuthStore.getState();
        setToken(data.token);

        // Update expiry time
        const hours = parseInt(data.expiresIn.replace('h', ''));
        this.tokenExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

        // Schedule next refresh
        this.scheduleTokenRefresh();
      } else {
        this.handleSessionExpired('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleSessionExpired('Network error');
    }
  }

  private handleSessionExpired(reason: string) {
    console.log('Session expired:', reason);
    
    this.stop();

    // Clear auth store
    const { logout } = useAuthStore.getState();
    logout();

    // Show notification
    toast.warning('Your session has expired. Please log in again.');

    // Redirect to login
    window.location.href = '/login';
  }
}

export const sessionManager = new SessionManager();
```

#### 2. Update `bitflow-admin/app/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { sessionManager } from '@/lib/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (token && user) {
      // Start session monitoring
      sessionManager.start('2h');
    }

    return () => {
      sessionManager.stop();
    };
  }, [token, user]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### 3. Create Session Warning Component

**`bitflow-admin/components/SessionWarning.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Show warning 5 minutes before session expires
    const WARNING_TIME = 5 * 60 * 1000; // 5 minutes
    const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

    const warningTimeout = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(5 * 60); // 5 minutes in seconds
    }, SESSION_DURATION - WARNING_TIME);

    return () => {
      clearTimeout(warningTimeout);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining]);

  const handleExtendSession = async () => {
    // Refresh token to extend session
    await fetch('/api/auth/refresh', { method: 'POST' });
    setShowWarning(false);
    setTimeRemaining(0);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}.
            Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleExtendSession}>
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### Testing Steps

1. **Test Session Creation:**
```bash
# Login via API
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bitflow.com", "password": "password"}'

# Check Redis
redis-cli
> KEYS bitflow:session:*
> TTL bitflow:session:{user_id}
# Should show ~7200 seconds (2 hours)
```

2. **Test Session Validation:**
```bash
# Call validate endpoint
curl http://localhost:8000/api/auth/validate-session \
  --cookie "bitflow.sid={session_cookie}"
# Should return {"valid": true}
```

3. **Test Session Expiry:**
   - Login to portal
   - Wait 2 hours (or manually delete session in Redis for faster test)
   - Try to access any page → Should redirect to login
   - Should show "Session expired" message

4. **Test Token Refresh:**
   - Login to portal
   - Keep portal open
   - After 1 hour 50 min, should auto-refresh token
   - Session should extend by another 2 hours

5. **Test Session Warning:**
   - Login to portal
   - After 1 hour 55 min, should show session warning dialog
   - Click "Extend Session" → Warning disappears, session extended

### Success Criteria
- ✅ Sessions stored in Redis with 2-hour TTL
- ✅ Users automatically logged out after 2 hours of inactivity
- ✅ Session warning shown 5 min before expiry
- ✅ Token auto-refreshes 10 min before expiry
- ✅ Manual session extension works
- ✅ Concurrent logins tracked
- ✅ Logout clears Redis session

**Estimated Time:** 1 day (6-8 hours)

---

## Task 1.5: Fix Circular Dependency (Department ↔ Faculty) (Day 7)

### Problem
- Cannot create department with HOD because faculty doesn't exist yet
- Cannot create faculty without department assignment

### Solution
Implement guided 3-step workflow: Create Department (no HOD) → Add Faculty → Assign HOD

### Files to Modify

#### 1. Backend: `backend/database/migrations/XXX_create_departments_table.php`

```php
Schema::create('departments', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('college_id');
    $table->string('name');
    $table->string('code')->unique();
    $table->text('description')->nullable();
    
    // Make HOD nullable to allow creation without HOD
    $table->uuid('hod_id')->nullable(); // Changed from required to nullable
    
    $table->enum('status', ['active', 'inactive'])->default('active');
    $table->timestamps();
    
    $table->foreign('college_id')->references('id')->on('colleges');
    $table->foreign('hod_id')->references('id')->on('faculty')->nullOnDelete();
});
```

#### 2. Backend: Add Validation

**`backend/app/Http/Requests/CreateDepartmentRequest.php`**

```php
class CreateDepartmentRequest extends FormRequest
{
    public function rules()
    {
        return [
            'college_id' => 'required|uuid|exists:colleges,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:departments',
            'description' => 'nullable|string',
            // HOD is optional during creation
            'hod_id' => 'nullable|uuid|exists:faculty,id',
        ];
    }
}
```

#### 3. Backend: Add HOD Assignment Endpoint

**`backend/app/Http/Controllers/DepartmentController.php`**

```php
class DepartmentController extends Controller
{
    public function assignHOD(Request $request, $departmentId)
    {
        $request->validate([
            'hod_id' => 'required|uuid|exists:faculty,id',
        ]);

        $department = Department::findOrFail($departmentId);
        $faculty = Faculty::findOrFail($request->hod_id);

        // Verify faculty belongs to same department
        if ($faculty->department_id !== $departmentId) {
            return response()->json([
                'error' => 'Faculty must belong to this department to be HOD'
            ], 422);
        }

        // Check if faculty is already HOD of another department
        $existingHOD = Department::where('hod_id', $request->hod_id)
            ->where('id', '!=', $departmentId)
            ->first();

        if ($existingHOD) {
            return response()->json([
                'error' => 'This faculty is already HOD of another department'
            ], 422);
        }

        $department->hod_id = $request->hod_id;
        $department->save();

        return response()->json($department->load('hod'));
    }

    public function removeHOD($departmentId)
    {
        $department = Department::findOrFail($departmentId);
        $department->hod_id = null;
        $department->save();

        return response()->json($department);
    }
}
```

**Add routes:**
```php
// routes/api.php
Route::post('/departments/{id}/assign-hod', [DepartmentController::class, 'assignHOD']);
Route::post('/departments/{id}/remove-hod', [DepartmentController::class, 'removeHOD']);
```

#### 4. Frontend: Create Guided Workflow Component

**`bitflow-admin/components/college-hub/DepartmentWorkflow.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export function DepartmentWorkflow({ departmentId }: { departmentId?: string }) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      title: 'Create Department',
      description: 'Add basic department information (name, code, description)',
      status: departmentId ? 'completed' : 'in-progress',
    },
    {
      id: 2,
      title: 'Add Faculty Members',
      description: 'Add at least one faculty member to this department',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Assign HOD (Optional)',
      description: 'Select Head of Department from faculty members',
      status: 'pending',
    },
  ]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-6 w-6 text-blue-500 fill-current" />;
      default:
        return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Department Setup Workflow</h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              {getStepIcon(step.status)}
              {index < steps.length - 1 && (
                <div className="h-12 w-0.5 bg-gray-200 my-2" />
              )}
            </div>

            <div className="flex-1 pb-4">
              <h4 className="font-medium text-sm">{step.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>

              {step.status === 'in-progress' && (
                <Button size="sm" className="mt-2">
                  {step.id === 1 && 'Create Department'}
                  {step.id === 2 && 'Add Faculty'}
                  {step.id === 3 && 'Assign HOD'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

#### 5. Frontend: Update Department List to Show Missing HOD

**`bitflow-admin/app/college-hub/[collegeId]/departments/page.tsx`**

```typescript
'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function DepartmentsPage() {
  const { departments } = useDepartments();

  return (
    <div>
      <Table>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.name}</TableCell>
              <TableCell>{dept.code}</TableCell>
              <TableCell>
                {dept.hod ? (
                  <div className="flex items-center gap-2">
                    <span>{dept.hod.name}</span>
                    <Badge variant="success">Assigned</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-500">No HOD Assigned</span>
                    <Badge variant="warning">Action Required</Badge>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {!dept.hod && dept.faculty_count > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAssignHODDialog(dept)}
                  >
                    Assign HOD
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

#### 6. Frontend: Create HOD Assignment Dialog

**`bitflow-admin/components/college-hub/AssignHODDialog.tsx`**

```typescript
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useFaculty } from '@/hooks/useFaculty';

interface AssignHODDialogProps {
  open: boolean;
  onClose: () => void;
  department: {
    id: string;
    name: string;
  };
}

export function AssignHODDialog({ open, onClose, department }: AssignHODDialogProps) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { faculty } = useFaculty({
    departmentId: department.id,
  });

  const handleAssign = async () => {
    if (!selectedFacultyId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/departments/${department.id}/assign-hod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hod_id: selectedFacultyId }),
      });

      if (response.ok) {
        toast.success('HOD assigned successfully');
        onClose();
        // Refresh department list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to assign HOD');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign HOD to {department.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {faculty.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No faculty members in this department yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add faculty members first, then assign HOD.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  // Navigate to add faculty
                  router.push(`/college-hub/${collegeId}/faculty?department=${department.id}`);
                }}
              >
                Add Faculty Member
              </Button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Select Faculty Member</label>
                <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a faculty member" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name} - {f.designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedFacultyId || isLoading}
                >
                  {isLoading ? 'Assigning...' : 'Assign as HOD'}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Testing Steps

1. **Test Creating Department without HOD:**
   - Navigate to Departments page
   - Click "Add Department"
   - Fill in name, code, description
   - Leave HOD field empty
   - Submit form
   - ✅ Should create successfully
   - ✅ Should show warning "No HOD Assigned"

2. **Test Adding Faculty:**
   - Click on department
   - Navigate to Faculty section
   - Add new faculty member
   - Select the department in dropdown
   - ✅ Faculty should be added successfully

3. **Test Assigning HOD:**
   - Go back to Departments list
   - Click "Assign HOD" button on department
   - ✅ Dialog should show list of faculty in that department
   - Select a faculty member
   - Click "Assign as HOD"
   - ✅ HOD should be assigned
   - ✅ Warning should disappear
   - ✅ HOD name should appear in department row

4. **Test Workflow Guidance:**
   - Create new department
   - ✅ Step 1 should show as completed
   - ✅ Step 2 should show "Add Faculty" button
   - Click "Add Faculty"
   - Add a faculty member
   - ✅ Step 2 should show as completed
   - ✅ Step 3 should show "Assign HOD" button

5. **Test Edge Cases:**
   - Try assigning non-department faculty as HOD → Should fail with error
   - Try assigning HOD who is already HOD of another department → Should fail
   - Remove HOD → Should set to null, show warning again

### Success Criteria
- ✅ Can create department without HOD
- ✅ Can add faculty to department
- ✅ Can assign HOD from department faculty
- ✅ Workflow guidance shows correct steps
- ✅ Warnings shown for departments without HOD
- ✅ One-click "Assign HOD" button available
- ✅ Cannot assign invalid faculty as HOD
- ✅ Can remove HOD

**Estimated Time:** 1 day (6-8 hours)

---

## PHASE 1 COMPLETION CHECKLIST

Before proceeding to Phase 2, verify:

- [ ] God Mode backend working (Bitflow Owners see all universities)
- [ ] God Mode frontend working (university selector appears)
- [ ] WebSocket server running and accepting connections
- [ ] Real-time updates working (dashboard, notifications)
- [ ] Redis session storage working
- [ ] 2-hour session timeout enforced
- [ ] Token auto-refresh working
- [ ] Session warning dialog appears
- [ ] Department creation without HOD working
- [ ] HOD assignment workflow complete
- [ ] All Phase 1 tests passing

**Total Phase 1 Time:** 7 days (56 hours)

---

# PHASE 2: COLLEGE HUB CORE MODULES (Week 3-4)

**Goal:** Complete the 6 most critical College Hub modules  
**Duration:** 10 days  
**Priority:** 🟠 HIGH - Core functionality needed for MVP

This is a long phase. I'll create a separate detailed breakdown.

---

**END OF PHASE 1 ROADMAP**

*Continue with Phase 2-5 in next sections or separate documents.*

**Next Steps:**
1. Complete Phase 1 tasks sequentially
2. Test each task before moving to next
3. Document any blockers or deviations
4. Update this roadmap as you progress

---

## 📚 Additional Resources Needed

### Documentation to Create
1. API documentation (OpenAPI/Swagger)
2. Database migration guide
3. Deployment guide
4. Testing guide
5. User manual

### Tools to Set Up
1. Redis server (local + production)
2. Monitoring (Sentry/LogRocket)
3. CI/CD pipeline
4. Staging environment

### Team Knowledge Sharing
1. God Mode architecture
2. WebSocket event patterns
3. Session management flow
4. Circular dependency solutions

