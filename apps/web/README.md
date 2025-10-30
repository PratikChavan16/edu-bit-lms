# Bitflow Owner Portal - Frontend

> Next.js 14 application for Bitflow LMS platform administration

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.0 (Dark theme)
- **State Management:** Zustand 5.0
- **Forms:** React Hook Form 7.65 + Zod validation
- **HTTP Client:** Axios 1.7
- **Icons:** Lucide React 0.548
- **Charts:** Recharts 3.3
- **Real-time:** Socket.io Client 4.8

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard
│   ├── login/             # Auth pages
│   ├── universities/      # University management
│   ├── colleges/          # Colleges management
│   ├── users/             # User management
│   ├── support/           # Support tickets
│   ├── billing/           # Billing & subscriptions
│   ├── analytics/         # Analytics
│   ├── system-logs/       # System logs
│   ├── audit-logs/        # Audit logs
│   └── settings/          # Settings
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities
├── types/                # TypeScript types
└── public/               # Static assets
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## Backend API

Make sure the backend API is running on `http://localhost:3000`

## Features

- 🎨 Dark theme with Slate color palette
- 📱 Responsive design (Desktop, Tablet, Mobile)
- ♿ Accessible (WCAG 2.1 AA compliant)
- 🔐 JWT authentication
- 💬 Real-time chat with WebSocket
- 📊 Analytics dashboards
- 🔍 Advanced search & filtering
- 📥 Bulk operations & exports
- 🌐 God Mode for platform owner

## Development Phases

### Phase 1: Foundation ✅
- [x] Next.js setup
- [ ] Type definitions & API client
- [ ] Authentication system
- [ ] Layout (Sidebar + Header)
- [ ] Base UI components

### Phase 2: Core Pages
- [ ] Dashboard
- [ ] Universities management
- [ ] Colleges management

### Phase 3: College Hub (11 Modules)
- [ ] Leadership, Departments, Faculty
- [ ] Admin & Non-teaching staff
- [ ] Students, Curriculum, Library
- [ ] Transport, Hostel, Attendance, Fees

### Phase 4: Platform Management
- [ ] Users, Support Tickets
- [ ] Billing, Analytics
- [ ] System & Audit Logs, Settings

### Phase 5: Advanced Features
- [ ] Real-time Chat
- [ ] Toast notifications
- [ ] Loading states & error handling
- [ ] Search, Filters, Pagination
- [ ] Bulk operations & exports

### Phase 6: Polish & Deploy
- [ ] Responsive design
- [ ] Accessibility
- [ ] Environment config
- [ ] E2E testing & documentation

## License

Private - Bitflow LMS Platform
