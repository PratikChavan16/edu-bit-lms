# Bitflow Admin Portal - Frontend

Next.js 16 frontend application for managing universities, colleges, and users in the Bitflow ERP system.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.0 (App Router)
- **React**: 19
- **TypeScript**: 5.6
- **Styling**: TailwindCSS 4.x
- **State Management**: Zustand 4.x
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Node.js**: v22.19.0

## 📁 Project Structure

```
bitflow-admin/
├── app/                      # Next.js App Router pages
│   ├── login/               # Login page
│   ├── page.tsx             # Dashboard (home page)
│   └── layout.tsx           # Root layout with sidebar
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx       # Button component
│   │   ├── input.tsx        # Input component
│   │   └── card.tsx         # Card component
│   └── layout/              # Layout components
│       ├── Sidebar.tsx      # Navigation sidebar
│       └── LayoutWrapper.tsx # Layout wrapper with auth
├── stores/                  # Zustand state stores
│   └── auth-store.ts        # Authentication store
├── lib/                     # Utilities and helpers
│   ├── api-client.ts        # Axios HTTP client
│   ├── constants.ts         # App constants
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript type definitions
│   └── index.ts             # Main types (User, University, etc.)
└── middleware.ts            # Route protection middleware
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js v22.19.0 or later
- Backend API running at http://127.0.0.1:8000

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

## 🔐 Authentication

The app uses JWT authentication with the Laravel backend:

- **Login**: POST `/api/v1/auth/login`
- **Logout**: POST `/api/v1/auth/logout`
- **Token Refresh**: POST `/api/v1/auth/refresh`

Tokens are stored in:
- **localStorage**: `bitflow_auth_token`, `bitflow_refresh_token`, `bitflow_user_data`
- **Cookies**: `bitflow_auth_token` (for middleware)

### Auto Token Refresh
The API client automatically refreshes expired tokens:
1. Request fails with 401
2. Calls `/auth/refresh` with refresh token
3. Updates tokens in storage
4. Retries original request

## 📄 Pages

### Login Page (`/login`)
- Email/password form
- Error handling
- Auto-redirect to dashboard on success
- Demo credentials shown

### Dashboard (`/`)
- Platform statistics (universities, colleges, users)
- Quick action cards
- Activity overview

### Protected Routes
All routes except `/login` require authentication. Middleware checks for token and redirects to login if missing.

## 🎨 UI Components

### Button
```tsx
<Button variant="default" size="default">Click me</Button>
```
Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`

### Input
```tsx
<Input label="Email" type="email" error="Invalid email" />
```

### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## 📡 API Integration

### Using API Client
```typescript
import { apiClient } from '@/lib/api-client'

// GET request
const response = await apiClient.get<University[]>('/universities')

// POST request
await apiClient.post('/universities', { name: 'MIT' })

// PUT request
await apiClient.put('/universities/1', { name: 'Updated Name' })

// DELETE request
await apiClient.delete('/universities/1')
```

### Using Auth Store
```typescript
import { useAuthStore } from '@/stores/auth-store'

function LoginForm() {
  const { login, logout, user, isAuthenticated } = useAuthStore()

  const handleLogin = async () => {
    await login('admin@bitflow.com', 'SecurePass123!')
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome {user?.full_name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

## 🔑 Demo Credentials

Use these credentials to login:
- **Email**: admin@bitflow.app
- **Password**: Bitflow@2025

Other test accounts:
- **University Owner**: owner@demo.bitflow.edu / University@2025
- **Super Admin**: superadmin@demo.bitflow.edu / SuperAdmin@2025
- **Faculty**: faculty@demo.bitflow.edu / Faculty@2025
- **Student**: student@demo.bitflow.edu / Student@2025

## 🚀 Next Steps

### Planned Features
- [ ] University Management UI (list, create, edit, delete)
- [ ] College Management UI
- [ ] User Management UI
- [ ] Role & Permission Management
- [ ] Department Management
- [ ] Student Enrollment
- [ ] Faculty Management
- [ ] Fee Management
- [ ] Reports & Analytics

### Upcoming Components
- [ ] Modal component
- [ ] Table component with pagination
- [ ] Loading spinner
- [ ] Toast notifications
- [ ] Form components (Select, Checkbox, Radio)

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)

## 🤝 Contributing

This project follows the architecture defined in the `brain/` folder. Review the brain documents before making changes:
- `brain/01-bitflow-admin/frontend_guide.md` - Frontend architecture
- `brain/master_theme_design.md` - Design system
- `brain/global_build_guide.md` - Build instructions

## 📄 License

Proprietary - Bitflow ERP System
