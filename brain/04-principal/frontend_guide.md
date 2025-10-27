# Principal Portal - Frontend Guide (Next.js 16 + TS)

Version: 2.0
Last Updated: October 25, 2025

Stack
- Next.js 16 (app router), React 19, TypeScript 5.6
- State: Zustand (slices per domain), React Query optional
- Styling: Tailwind CSS (or CSS Modules) – choose one and stay consistent
- Networking: axios with interceptors, JWT in Authorization header, college headers

Routing (app router)
```
app/principal/
	layout.tsx
	page.tsx                # Dashboard
	faculty/
		page.tsx              # Directory
		[id]/page.tsx         # Profile
		recruitment/page.tsx  # Recruitment kanban
		assignments/page.tsx  # Course assignments
		leave/page.tsx        # Leave approvals
		evaluations/page.tsx  # Performance cycles
	students/page.tsx
	departments/page.tsx
	programs/page.tsx
	admissions/page.tsx
	exams/page.tsx
	reports/page.tsx
	infra/page.tsx
	finance/page.tsx
	comms/page.tsx
	settings/page.tsx
```

API Client
```ts
// lib/api.ts
import axios from 'axios';

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE + '/principal' });

api.interceptors.request.use((config) => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : undefined;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	const uni = localStorage.getItem('university_id');
	const col = localStorage.getItem('college_id');
	if (uni) config.headers['X-University-Id'] = uni;
	if (col) config.headers['X-College-Id'] = col;
	return config;
});

api.interceptors.response.use(undefined, (err) => {
	if (err.response?.status === 401) {
		// trigger signout or token refresh
	}
	return Promise.reject(err);
});
```

Types
```ts
// types/principal.ts
export type Faculty = {
	id: number; department_id: number; name: string; email: string;
	designation: string; workload_hours_per_week: number; status: 'active'|'on_leave'|'resigned';
};
export type FacultyLeave = { id: number; faculty_id: number; type: 'annual'|'medical'|'emergency'|'sabbatical'; from_date: string; to_date: string; days: number; status: 'pending'|'approved'|'rejected'; remarks?: string };
export type Student = { id: number; program_id: number; roll_no: string; name: string; email: string; year: number; section: string; cgpa: number; attendance_pct: number };
export type Department = { id:number; name:string; hod_id?:number|null; faculty_count:number; student_count:number; budget_allocated:number; score:number };
export type ExpenseRequest = { id:number; department_id:number; amount:number; category:string; status:'pending'|'approved'|'escalated'|'rejected'; remarks?:string };
```

State (Zustand)
```ts
// stores/faculty.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Faculty, FacultyLeave } from '@/types/principal';

type FacultyState = {
	items: Faculty[];
	leaves: FacultyLeave[];
	loading: boolean;
	fetch: (q?: string) => Promise<void>;
	fetchLeaves: (status?: string) => Promise<void>;
	approveLeave: (id: number, remarks?: string) => Promise<void>;
	rejectLeave: (id: number, remarks: string) => Promise<void>;
};

export const useFacultyStore = create<FacultyState>((set, get) => ({
	items: [], leaves: [], loading: false,
	async fetch(q) {
		set({ loading: true });
		const res = await api.get('/faculty', { params: { search: q }});
		set({ items: res.data, loading: false });
	},
	async fetchLeaves(status) {
		const res = await api.get('/faculty-leaves', { params: { status }});
		set({ leaves: res.data });
	},
	async approveLeave(id, remarks) {
		await api.post(`/faculty-leaves/${id}/approve`, { remarks });
		await get().fetchLeaves('pending');
	},
	async rejectLeave(id, remarks) {
		await api.post(`/faculty-leaves/${id}/reject`, { remarks });
		await get().fetchLeaves('pending');
	},
}));
```

Hooks
```ts
// hooks/useDashboard.ts
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useDashboard() {
	const [data, setData] = useState<any>();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let timer: any;
		const fetch = async () => {
			setLoading(true);
			const res = await api.get('/dashboard/summary');
			setData(res.data); setLoading(false);
		};
		fetch();
		timer = setInterval(fetch, 60000); // 60s
		return () => clearInterval(timer);
	}, []);
	return { data, loading };
}
```

UI Composition
- Layout: top nav (role, notifications), side nav (pages), content area.
- Reusable components: MetricCard, DataTable, ApprovalModal, AuditDrawer, EmptyState.
- Forms: react-hook-form + zod for validation (optional), standardize error banners.

Access Control
- Permission gates at component level (e.g., `has('finance.expense.approve')`).
- Mask PII in list views; unmask requires purpose prompt and permission.

Error Handling
- API errors mapped to toast + inline messages; 401 triggers sign-out/refresh.
- Retry lightweight GETs via React Query or exponential backoff helper.

Performance
- Code-split heavy pages (reports, admissions console).
- Virtualize large tables (react-virtualized) when >500 rows.
- Memoize selector-heavy components; avoid re-render storms in Zustand (use slice selectors).

Example Page (Finance)
```tsx
// app/principal/finance/page.tsx
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function FinancePage() {
	const [rows, setRows] = useState<any[]>([]);
	useEffect(() => { api.get('/finance/expenses').then(r => setRows(r.data)); }, []);
	async function approve(id: number) {
		await api.post(`/finance/expenses/${id}/approve`, { remarks: 'OK' });
		setRows(prev => prev.map(x => x.id===id? { ...x, status: 'approved'} : x));
	}
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold mb-4">Financial Overview</h1>
			<table className="w-full text-sm">
				<thead><tr><th>Req#</th><th>Dept</th><th>Amount</th><th>Status</th><th/></tr></thead>
				<tbody>
					{rows.map(r => (
						<tr key={r.id} className="border-b">
							<td>{r.id}</td><td>{r.department_id}</td><td>₹{r.amount.toLocaleString()}</td><td>{r.status}</td>
							<td>{r.amount < 500000 ? <button onClick={() => approve(r.id)}>Approve</button> : <span>Escalate</span>}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
```

Security
- Store tokens in memory (preferred) or localStorage with strict domain; never in cookies.
- CSRF not required for pure API JWT; ensure SameSite on any support pages.
- Sanitize HTML in announcements, escape user content everywhere.

Testing
- Unit: store actions, permission gates, utility helpers.
- Integration: page-level flows for approvals and admissions funnel with Playwright.
- Contract: compare client types vs OpenAPI (openapi-typescript suggestion) for type drift.
