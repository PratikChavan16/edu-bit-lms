# API Routes Setup Guide

## 📋 Routes to Add to `bitflow-core/routes/api.php`

Add the following routes to your `routes/api.php` file:

```php
<?php

use App\Http\Controllers\Admin\CollegeController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes (Colleges & Users Management)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    
    // Colleges Management
    Route::get('/colleges', [CollegeController::class, 'index']);
    Route::post('/colleges', [CollegeController::class, 'store']);
    Route::get('/colleges/{id}', [CollegeController::class, 'show']);
    Route::patch('/colleges/{id}', [CollegeController::class, 'update']);
    Route::delete('/colleges/{id}', [CollegeController::class, 'destroy']);
    Route::patch('/colleges/{id}/approve', [CollegeController::class, 'approve']);
    Route::get('/colleges/{id}/statistics', [CollegeController::class, 'statistics']);

    // Users Management
    Route::get('/users/roles', [UserController::class, 'getRoles']); // Must be before {id}
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::patch('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/users/{id}/roles', [UserController::class, 'updateRoles']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword']);
});
```

---

## 🔍 Route Details

### Colleges Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| GET | `/api/admin/colleges` | `index()` | List colleges with filters |
| POST | `/api/admin/colleges` | `store()` | Create new college |
| GET | `/api/admin/colleges/{id}` | `show()` | Get college details |
| PATCH | `/api/admin/colleges/{id}` | `update()` | Update college |
| DELETE | `/api/admin/colleges/{id}` | `destroy()` | Delete college (soft delete) |
| PATCH | `/api/admin/colleges/{id}/approve` | `approve()` | Approve pending college |
| GET | `/api/admin/colleges/{id}/statistics` | `statistics()` | Get college statistics |

### Users Routes

| Method | Endpoint | Controller Method | Description |
|--------|----------|-------------------|-------------|
| GET | `/api/admin/users` | `index()` | List users with filters |
| POST | `/api/admin/users` | `store()` | Create new user |
| GET | `/api/admin/users/{id}` | `show()` | Get user details |
| PATCH | `/api/admin/users/{id}` | `update()` | Update user |
| DELETE | `/api/admin/users/{id}` | `destroy()` | Delete user (soft delete) |
| PATCH | `/api/admin/users/{id}/roles` | `updateRoles()` | Update user roles |
| POST | `/api/admin/users/{id}/restore` | `restore()` | Restore deleted user |
| POST | `/api/admin/users/{id}/reset-password` | `resetPassword()` | Reset user password |
| GET | `/api/admin/users/roles` | `getRoles()` | Get available roles list |

---

## ⚠️ Important Notes

1. **Route Order Matters**: The `/users/roles` route MUST come before `/users/{id}` to avoid route conflicts
2. **Middleware**: All routes require `auth:sanctum` and `role:admin` middleware
3. **Controllers**: Ensure controllers are imported at the top of the file
4. **Testing**: Run tests after adding routes to verify everything works

---

## 🧪 Testing Routes

After adding the routes, test them:

```bash
# Run all feature tests
php artisan test

# Run specific test files
php artisan test tests/Feature/Admin/CollegeControllerTest.php
php artisan test tests/Feature/Admin/UserControllerTest.php

# Check route list
php artisan route:list --path=admin
```

---

## 📝 Expected Output

After running `php artisan route:list --path=admin`, you should see:

```
GET|HEAD   api/admin/colleges ..................... admin.colleges.index
POST       api/admin/colleges ..................... admin.colleges.store
GET|HEAD   api/admin/colleges/{id} ................ admin.colleges.show
PATCH      api/admin/colleges/{id} ................ admin.colleges.update
DELETE     api/admin/colleges/{id} ................ admin.colleges.destroy
PATCH      api/admin/colleges/{id}/approve ........ admin.colleges.approve
GET|HEAD   api/admin/colleges/{id}/statistics ..... admin.colleges.statistics

GET|HEAD   api/admin/users/roles .................. admin.users.roles
GET|HEAD   api/admin/users ........................ admin.users.index
POST       api/admin/users ........................ admin.users.store
GET|HEAD   api/admin/users/{id} ................... admin.users.show
PATCH      api/admin/users/{id} ................... admin.users.update
DELETE     api/admin/users/{id} ................... admin.users.destroy
PATCH      api/admin/users/{id}/roles ............. admin.users.updateRoles
POST       api/admin/users/{id}/restore ........... admin.users.restore
POST       api/admin/users/{id}/reset-password .... admin.users.resetPassword
```

---

## ✅ Verification Checklist

- [ ] Routes added to `routes/api.php`
- [ ] Controllers imported at top of file
- [ ] Middleware applied correctly
- [ ] Route order verified (`/users/roles` before `/users/{id}`)
- [ ] Tests run successfully (`php artisan test`)
- [ ] Route list checked (`php artisan route:list`)
- [ ] Frontend can access endpoints
- [ ] Authentication works correctly
- [ ] Role middleware enforced

---

## 🚨 Common Issues

### Issue: Route not found (404)
**Solution**: Check route list with `php artisan route:list` to verify routes are registered

### Issue: Middleware error
**Solution**: Ensure RoleMiddleware is registered in `bootstrap/app.php` or `app/Http/Kernel.php`

### Issue: Controller not found
**Solution**: Check namespace and import statement at top of routes file

### Issue: Tests failing
**Solution**: Run `php artisan config:clear` and `php artisan route:clear` then retry

---

## 📞 Need Help?

If routes are not working:
1. Clear caches: `php artisan config:clear && php artisan route:clear`
2. Check controller namespace matches imports
3. Verify middleware is registered
4. Check test output for specific errors
5. Review logs in `storage/logs/laravel.log`
