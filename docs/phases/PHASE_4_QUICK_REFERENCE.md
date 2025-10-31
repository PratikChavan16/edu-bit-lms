# Phase 4 Quick Reference Guide

Quick reference for using the new production polish features.

---

## 🚀 Query Optimization

### Eager Loading Scopes

```php
// ❌ Bad (N+1 queries)
$universities = University::all();
foreach ($universities as $uni) {
    echo $uni->colleges->count(); // +1 query per university
    echo $uni->users->count();     // +1 query per university
}
// Result: 201 queries for 100 universities

// ✅ Good (2-3 queries total)
$universities = University::withUniversityRelations()->get();
foreach ($universities as $uni) {
    echo $uni->colleges_count; // Already loaded
    echo $uni->users_count;    // Already loaded
}
// Result: 3 queries total
```

**Available Scopes**:
- `withUniversityRelations()` - Universities with colleges, users, counts
- `withCollegeRelations()` - Colleges with university, departments, counts
- `withUserRelations()` - Users with university, roles, permissions
- `withTemplateRelations()` - Templates with creator, university, reports_count
- `withHistoryRelations()` - History with generator, template, university

### Query Caching

```php
// Cache query results for 5 minutes
$activeUniversities = University::cacheQuery(
    'universities:active',
    fn() => University::where('status', 'active')->get()
);

// Custom cache duration (10 minutes)
$stats = University::cacheQuery(
    'universities:stats',
    fn() => University::withCount('colleges', 'users')->get(),
    600
);

// Invalidate cache when data changes
University::invalidateCache(); // Clear all university caches
```

### Cached Counts

```php
// ❌ Bad (runs COUNT query every time)
$total = University::count();

// ✅ Good (cached for 10 minutes)
$total = University::cachedCount(); // Default 600s TTL
$active = University::cachedCount('active', 300); // Custom 5 min TTL
```

### Batch Operations

```php
// Batch insert (10x faster than loop)
University::batchInsert([
    ['name' => 'University A', 'domain' => 'a.edu'],
    ['name' => 'University B', 'domain' => 'b.edu'],
    // ... thousands more
]);

// Batch update
University::batchUpdate([
    ['id' => 'uuid-1', 'status' => 'active'],
    ['id' => 'uuid-2', 'status' => 'inactive'],
], 'status');

// Process in chunks (prevents memory issues)
University::processInChunks(100, function($chunk) {
    foreach ($chunk as $university) {
        // Process each university
    }
});
```

---

## ⚠️ Error Handling

### Throwing Errors

```php
use App\Exceptions\ApiException;

// Not Found (404)
throw ApiException::notFound('University');

// Unauthorized (401)
throw ApiException::unauthorized();

// Forbidden (403)
throw ApiException::forbidden('You cannot delete this university');

// Validation (422)
throw ApiException::validation([
    'email' => ['Email is required'],
    'name' => ['Name must be at least 3 characters']
]);

// Conflict (409)
throw ApiException::conflict('University with this domain already exists');

// Bad Request (400)
throw ApiException::badRequest('Invalid report type');

// Server Error (500)
throw ApiException::serverError();

// Custom
throw ApiException::custom('Custom message', 418, 'CUSTOM_CODE');
```

### Returning Responses

```php
use App\Http\Responses\ApiResponse;

// Success
return ApiResponse::success($data, 'Success message');

// Created (201)
return ApiResponse::created($university, 'University created');

// Updated
return ApiResponse::updated($university);

// Deleted
return ApiResponse::deleted('University deleted');

// Collection
return ApiResponse::collection($universities);

// Paginated
return ApiResponse::paginated($paginatedData);

// Errors
return ApiResponse::notFound();
return ApiResponse::unauthorized();
return ApiResponse::forbidden();
return ApiResponse::validationError($errors);
return ApiResponse::serverError();
```

**Response Format**:
```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "meta": { ... }
}
```

---

## 💫 Loading States (Frontend)

### Spinners

```tsx
import { Spinner } from '@/components/ui/LoadingStates';

// Sizes
<Spinner size="sm" />  // Small
<Spinner size="md" />  // Medium (default)
<Spinner size="lg" />  // Large
<Spinner size="xl" />  // Extra large

// Colors
<Spinner color="primary" /> // Blue
<Spinner color="white" />   // White (dark backgrounds)
<Spinner color="gray" />    // Gray
```

### Loading Overlay

```tsx
import { LoadingOverlay } from '@/components/ui/LoadingStates';

<div className="relative">
  {isLoading && <LoadingOverlay message="Loading universities..." />}
  {/* Your content */}
</div>
```

### Progress Bars

```tsx
import { ProgressBar, IndeterminateProgressBar } from '@/components/ui/LoadingStates';

// Known progress
<ProgressBar progress={uploadProgress} color="success" showLabel />

// Unknown progress
<IndeterminateProgressBar color="primary" />
```

### Button Loading

```tsx
import { ButtonLoading } from '@/components/ui/LoadingStates';

<ButtonLoading
  isLoading={isSubmitting}
  loadingText="Saving..."
  onClick={handleSubmit}
  variant="primary"
  size="md"
>
  Save Changes
</ButtonLoading>
```

---

## 🎨 Skeleton Screens (Frontend)

### Pre-built Layouts

```tsx
import {
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  DashboardSkeleton,
  PageSkeleton,
  FormSkeleton
} from '@/components/ui/SkeletonLayouts';

// Card
if (isLoading) return <CardSkeleton />;

// Table
if (isLoading) return <TableSkeleton rows={10} columns={5} />;

// List
if (isLoading) return <ListSkeleton items={8} />;

// Dashboard
if (isLoading) return <DashboardSkeleton />;

// Page
if (isLoading) return <PageSkeleton />;

// Form
if (isLoading) return <FormSkeleton fields={6} />;
```

### Custom Skeleton

```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-4 w-full" />
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-64 w-full rounded" />
```

---

## 🔍 Query Monitoring (Development)

### Enable Slow Query Logging

```php
// In a controller or service provider
use App\Models\University;

University::enableQueryMonitoring(100); // Log queries > 100ms
```

**Output** (in Laravel log):
```
[WARNING] Slow Query Detected
SQL: SELECT * FROM universities WHERE status = ? AND created_at > ?
Bindings: ["active", "2024-01-01"]
Time: 234ms
Connection: mysql
```

### Explain Query

```php
$query = University::where('status', 'active')
    ->with('colleges');

$explain = University::explainQuery($query);
dd($explain); // Shows MySQL EXPLAIN output
```

---

## 📊 Common Patterns

### API Endpoint with Caching

```php
public function index(Request $request)
{
    $universities = University::cacheQuery('universities:list', function() {
        return University::withUniversityRelations()
            ->orderBy('name')
            ->get();
    }, 300); // 5 minutes

    return ApiResponse::collection($universities);
}
```

### Paginated List with Optimization

```php
public function index(Request $request)
{
    $perPage = $request->get('per_page', 15);
    
    $universities = University::withUniversityRelations()
        ->paginateWithCachedCount($perPage);

    return ApiResponse::paginated($universities);
}
```

### Create with Validation

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|min:3',
        'domain' => 'required|unique:universities',
        'email' => 'required|email',
    ]);

    try {
        $university = University::create($validated);
        University::invalidateCache(); // Clear cache
        
        return ApiResponse::created($university);
    } catch (\Exception $e) {
        throw ApiException::serverError('Failed to create university');
    }
}
```

### Update with Optimistic Response

```php
public function update(Request $request, string $id)
{
    $university = University::findOrFail($id);
    
    $validated = $request->validate([
        'name' => 'sometimes|min:3',
        'status' => 'sometimes|in:active,inactive,suspended',
    ]);

    $university->update($validated);
    University::invalidateCache();

    return ApiResponse::updated($university->fresh());
}
```

### Delete with Error Handling

```php
public function destroy(string $id)
{
    $university = University::findOrFail($id);

    // Check if can delete
    if ($university->colleges()->exists()) {
        throw ApiException::conflict(
            'Cannot delete university with existing colleges'
        );
    }

    $university->delete();
    University::invalidateCache();

    return ApiResponse::deleted('University deleted successfully');
}
```

### Frontend: API Call with Loading

```tsx
const [isLoading, setIsLoading] = useState(true);
const [universities, setUniversities] = useState([]);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/universities');
      const data = await response.json();
      
      if (data.success) {
        setUniversities(data.data);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to load universities');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

if (isLoading) return <TableSkeleton rows={10} columns={5} />;
if (error) return <div className="text-red-600">{error}</div>;

return <UniversityTable data={universities} />;
```

### Frontend: Form Submission

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (formData) => {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/v1/universities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success(data.message);
      router.push('/universities');
    } else {
      // Handle validation errors
      if (data.error.details) {
        setErrors(data.error.details);
      } else {
        toast.error(data.error.message);
      }
    }
  } catch (error) {
    toast.error('Network error');
  } finally {
    setIsSubmitting(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    {/* Form fields */}
    <ButtonLoading
      type="submit"
      isLoading={isSubmitting}
      loadingText="Creating..."
      variant="primary"
    >
      Create University
    </ButtonLoading>
  </form>
);
```

---

## 📈 Performance Tips

1. **Always use eager loading** for relationships you'll access
2. **Cache expensive queries** (analytics, aggregations)
3. **Use batch operations** for bulk inserts/updates
4. **Process large datasets in chunks** to avoid memory issues
5. **Monitor slow queries** in development
6. **Invalidate caches** when data changes
7. **Use skeleton screens** instead of loading text
8. **Show progress** for long operations
9. **Disable buttons** during submission
10. **Handle errors gracefully** with user-friendly messages

---

## 🐛 Debugging

### Check Query Count (Development)

```php
// In a controller method
\DB::enableQueryLog();

$universities = University::withUniversityRelations()->get();

$queries = \DB::getQueryLog();
dd(count($queries)); // Should be 2-3, not 100+
```

### Test Cache

```php
// Clear all cache
php artisan cache:clear

// Test caching
$start = microtime(true);
University::cacheQuery('test', fn() => University::all());
$firstCall = microtime(true) - $start;

$start = microtime(true);
University::cacheQuery('test', fn() => University::all());
$secondCall = microtime(true) - $start;

// Second call should be much faster (cached)
```

### Verify Indexes

```bash
# MySQL
php artisan db:show

# Or directly
mysql> SHOW INDEX FROM universities;
```

---

## ✅ Checklist

Before deploying:

- [ ] All indexes created (`php artisan migrate`)
- [ ] Controllers use eager loading scopes
- [ ] Expensive queries are cached
- [ ] All API responses use `ApiResponse`
- [ ] All errors use `ApiException` or standard exceptions
- [ ] Loading states replace "Loading..." text
- [ ] Buttons show loading spinners
- [ ] Long operations show progress
- [ ] Forms are disabled during submission
- [ ] Errors display user-friendly messages
- [ ] Slow query monitoring enabled in development
- [ ] Cache invalidation on data changes

---

**See `PHASE_4_PRODUCTION_POLISH_SUMMARY.md` for complete documentation.**
