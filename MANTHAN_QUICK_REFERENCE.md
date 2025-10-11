# 🎯 MANTHAN'S QUICK REFERENCE CARD

## 🚀 QUICK START COMMANDS

```powershell
# Navigate to project
cd d:\bitflow_lms\edu-bit-lms\bitflow-frontend

# Start Admin Portal (Port 3000)
pnpm --filter @bitflow/admin-app dev

# Start Learner Portal (Port 3001) 
pnpm --filter @bitflow/learner-app dev

# Run linter
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test
```

---

## 📚 YOUR CRUD PATTERN CHEATSHEET

### **1. List Page Template**
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@bitflow/ui';

export default function ListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await fetch('/api/items');
      return res.json();
    },
  });

  return (
    <DataTable
      data={data}
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ]}
    />
  );
}
```

### **2. Create Form Template**
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export default function CreatePage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data) => fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit">Create</button>
    </form>
  );
}
```

### **3. Edit Form Template**
```typescript
'use client';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';

export default function EditPage() {
  const params = useParams();
  const id = params.id;

  // Fetch existing data
  const { data } = useQuery({
    queryKey: ['item', id],
    queryFn: () => fetch(`/api/items/${id}`).then(r => r.json()),
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (data) => fetch(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  });

  // Same form as create, but with pre-filled values
}
```

---

## 🎨 COMMON COMPONENTS

```typescript
// Button
import { Button } from '@bitflow/ui';
<Button variant="primary" onClick={handleClick}>Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Cancel</Button>

// Input
import { Input } from '@bitflow/ui';
<Input
  label="Name"
  {...register('name')}
  error={errors.name?.message}
  required
/>

// Modal
import { Modal } from '@bitflow/ui';
<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  <p>Are you sure?</p>
</Modal>

// DataTable
import { DataTable } from '@bitflow/ui';
<DataTable
  data={items}
  columns={columns}
  pagination={{ currentPage: 1, totalPages: 5 }}
/>

// Card
import { Card } from '@bitflow/ui';
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// Alert
import { Alert } from '@bitflow/ui';
<Alert variant="success">Success message</Alert>
<Alert variant="error">Error message</Alert>
```

---

## 🔌 API CALL PATTERNS

### **GET Request**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['universities'],
  queryFn: async () => {
    const response = await fetch('/api/universities');
    return response.json();
  },
});
```

### **POST Request**
```typescript
const mutation = useMutation({
  mutationFn: (data) => fetch('/api/universities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['universities'] });
    router.push('/universities');
  },
});
```

### **PUT Request**
```typescript
const mutation = useMutation({
  mutationFn: (data) => fetch(`/api/universities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
});
```

### **DELETE Request**
```typescript
const mutation = useMutation({
  mutationFn: (id) => fetch(`/api/universities/${id}`, {
    method: 'DELETE',
  }),
});
```

---

## 🧪 ZOD VALIDATION PATTERNS

```typescript
import { z } from 'zod';

// String validation
z.string()
z.string().min(3)
z.string().max(100)
z.string().email()
z.string().url()

// Number validation
z.number()
z.number().min(0)
z.number().max(100)
z.number().positive()

// Boolean
z.boolean()

// Enum
z.enum(['active', 'inactive'])

// Optional
z.string().optional()

// Object
z.object({
  name: z.string(),
  age: z.number(),
})

// Array
z.array(z.string())
```

---

## 🗂️ FILE STRUCTURE

```
apps/admin/src/app/
├── dashboard/page.tsx              ← Dashboard
├── universities/
│   ├── page.tsx                    ← List
│   ├── create/page.tsx             ← Create
│   └── [id]/edit/page.tsx          ← Edit
├── colleges/
├── students/
└── ...
```

---

## 💡 TROUBLESHOOTING

### **Issue: Module not found**
```powershell
pnpm install
```

### **Issue: Port already in use**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Issue: ESLint errors**
```powershell
pnpm lint --fix
```

### **Issue: Type errors**
- Check TypeScript types
- Ensure imports are correct
- Run `pnpm build` to see all errors

---

## 📖 USEFUL LINKS

- React Hook Form: https://react-hook-form.com
- TanStack Query: https://tanstack.com/query
- Zod: https://zod.dev
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs

---

## 🎯 YOUR FIRST 3 TASKS

1. **Dashboard** (1-2 days)
   - File: `apps/admin/src/app/dashboard/page.tsx`
   - API: `GET /api/super-admin/stats`
   
2. **Universities List** (1 day)
   - File: `apps/admin/src/app/universities/page.tsx`
   - API: `GET /api/universities`

3. **Create University** (1 day)
   - File: `apps/admin/src/app/universities/create/page.tsx`
   - API: `POST /api/universities`

---

**Keep this card open while coding! 📌**
