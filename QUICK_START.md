# 🚀 QUICK START GUIDE - After Updates
**Last Updated:** October 12, 2025

## ✅ What Was Fixed

1. **Security:** Routes now protected (no dashboard without login)
2. **Branding:** "Bitflow Nova" everywhere (no more "Admin Portal")
3. **API:** Standardized responses (`{data, message, meta}`)
4. **Data:** Frontend interfaces match database exactly
5. **Tenancy:** Working tenant switcher
6. **Roles:** 15 roles ready to seed
7. **Validation:** Backend validation complete

---

## 🏃 Quick Start

### 1. Pull Latest Changes
```bash
git pull origin master
```

### 2. Backend Setup
```bash
cd bitflow-core

# Seed roles (IMPORTANT - Run once)
php artisan db:seed --class=CompleteRoleHierarchySeeder

# Verify
php artisan tinker
>>> Role::count();  # Should be 15
>>> exit
```

### 3. Frontend Setup
```bash
cd bitflow-frontend
pnpm install  # If needed
```

### 4. Start Servers
```bash
# Terminal 1 - Backend
cd bitflow-core
php artisan serve

# Terminal 2 - Frontend  
cd bitflow-frontend
pnpm --filter admin dev
```

---

## 🧪 Testing Checklist

### Authentication ✅
- [ ] Visit http://localhost:3000/dashboard without login
  - Should redirect to /login
- [ ] Login with `bitflow_admin` / `gMAP@2025?`
  - Should redirect to dashboard
- [ ] Visit /login while authenticated
  - Should redirect to dashboard

### UI/Branding ✅
- [ ] Login page title says "Bitflow Nova"
- [ ] Browser tab says "Bitflow Nova"
- [ ] Sidebar shows "Bitflow Nova"

### Tenant Switcher ✅
- [ ] Click "Switch tenant" button
- [ ] Modal opens showing universities
- [ ] Can select a university
- [ ] Selection persists (reload page)

### API Responses ✅
- [ ] Dashboard loads
- [ ] Universities list works
- [ ] University detail page works
- [ ] Create university works

### Validation ✅
- [ ] Try creating university without name
  - Should show error
- [ ] Try invalid code format (uppercase, spaces)
  - Should show error

---

## 📂 New Files to Know About

### Backend
- `app/Http/Responses/ApiResponse.php` - Use for all API responses
- `app/Http/Requests/Admin/StoreUniversityRequest.php` - Create validation
- `app/Http/Requests/Admin/UpdateUniversityRequest.php` - Update validation
- `database/seeders/CompleteRoleHierarchySeeder.php` - 15 roles

### Frontend
- `apps/admin/middleware.ts` - Route protection
- `apps/admin/components/auth-guard.tsx` - Auth wrapper
- `apps/admin/components/tenant-switcher.tsx` - Tenant UI
- `packages/api-client/src/tenant/useTenant.ts` - Tenant store
- `packages/api-client/src/utils/apiResponse.ts` - Response helpers

---

## 🔑 Key Credentials

```
Username: bitflow_admin
Password: gMAP@2025?
Role: Bitflow Nova Owner (after seeding roles)
```

---

## 📋 Common Commands

### Backend
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Run migrations
php artisan migrate:fresh --seed

# Seed only roles
php artisan db:seed --class=CompleteRoleHierarchySeeder

# Check routes
php artisan route:list --path=admin
```

### Frontend
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm --filter admin dev

# Build for production
pnpm --filter admin build

# Type check
pnpm --filter admin type-check
```

---

## 🐛 Troubleshooting

### "Cannot access dashboard"
- Make sure you're logged in
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

### "Tenant switcher empty"
- Check backend is running
- Check universities exist in database
- Check browser console for API errors

### "Validation not working"
- Make sure FormRequests are imported
- Check Laravel logs: `tail -f storage/logs/laravel.log`

### "TypeScript errors"
- These are mostly warnings
- Run `pnpm install` in frontend
- Restart TypeScript server in VS Code

---

## 📖 Where to Look

### For API Responses
```php
// Old way (DON'T USE)
return response()->json($data);

// New way (USE THIS)
use App\Http\Responses\ApiResponse;
return ApiResponse::success($data);
return ApiResponse::created($data, 'Created!');
return ApiResponse::error('Error!', [], 400);
```

### For Frontend Auth
```tsx
// Check if authenticated
import { useAuthStore } from '@bitflow/api-client/auth/useAuth';
const { isAuthenticated, token } = useAuthStore();

// Get current tenant
import { useTenantStore } from '@bitflow/api-client/tenant/useTenant';
const { currentTenant } = useTenantStore();
```

### For Roles
```php
// Check user role
$user->hasRole('super-admin');
$user->hasRole(['super-admin', 'principal']);

// Check permission
$user->can('colleges:manage');
```

---

## 🎯 What's Next

### Phase 3 - Feature Completion (30-40 hours)
1. Student Portal pages (Library, Documents, Results)
2. Bulk upload templates with UI
3. Internal chat system
4. Frontend validation (Zod schemas)
5. Error toast notifications
6. Parent Portal features

### Optional Improvements
- Add data model diagram to README
- Create ARCHITECTURE.md
- Add more tests
- Performance optimization

---

## 📞 Need Help?

1. Check `COMPREHENSIVE_BUG_REPORT.md` for all issues
2. Check `PROGRESS_UPDATE.md` for detailed changes
3. Check `FINAL_SESSION_SUMMARY.md` for overview
4. Check Laravel logs: `storage/logs/laravel.log`
5. Check browser console for frontend errors

---

## ✨ Quick Wins

Want to see something work immediately?

1. **Login with new branding** ✅
   - Visit http://localhost:3000/login
   - See "Bitflow Nova" everywhere

2. **Try tenant switcher** ✅
   - Login → Click "Switch tenant"
   - See modal with universities

3. **Protected routes** ✅
   - Logout → Try to visit /dashboard
   - Automatically redirected to login

4. **Check roles** ✅
   ```bash
   php artisan tinker
   >>> Role::with('permissions')->get();
   ```

---

**Ready to Go!** 🚀

All critical fixes are in place. The system is secure, consistent, and ready for feature development.

Happy coding! 🎉
