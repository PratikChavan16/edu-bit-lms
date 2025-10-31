<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Query Optimization Trait
 * 
 * Provides helper methods for optimizing database queries:
 * - Eager loading presets to prevent N+1 queries
 * - Query result caching
 * - Efficient batch operations
 * - Query performance monitoring
 */
trait OptimizesQueries
{
    /**
     * Load common relationships for universities
     * Prevents N+1 when listing universities with related data
     */
    public function scopeWithUniversityRelations(Builder $query): Builder
    {
        return $query->with([
            'colleges' => function ($q) {
                $q->select('id', 'university_id', 'name', 'status')
                  ->where('status', 'active');
            },
            'users' => function ($q) {
                $q->select('id', 'university_id', 'name', 'email', 'status')
                  ->where('status', 'active')
                  ->limit(10); // Limit to prevent loading thousands
            }
        ])->withCount([
            'colleges',
            'users',
            'colleges as active_colleges_count' => function ($q) {
                $q->where('status', 'active');
            },
            'users as active_users_count' => function ($q) {
                $q->where('status', 'active');
            }
        ]);
    }

    /**
     * Load common relationships for colleges
     * Prevents N+1 when listing colleges with related data
     */
    public function scopeWithCollegeRelations(Builder $query): Builder
    {
        return $query->with([
            'university:id,name,domain,status',
            'departments' => function ($q) {
                $q->select('id', 'college_id', 'name', 'status')
                  ->where('status', 'active');
            }
        ])->withCount([
            'departments',
            'students',
            'faculty',
            'departments as active_departments_count' => function ($q) {
                $q->where('status', 'active');
            }
        ]);
    }

    /**
     * Load common relationships for users
     * Prevents N+1 when listing users with roles and permissions
     */
    public function scopeWithUserRelations(Builder $query): Builder
    {
        return $query->with([
            'university:id,name,domain',
            'roles:id,name',
            'permissions:id,name'
        ]);
    }

    /**
     * Load relationships for report templates
     */
    public function scopeWithTemplateRelations(Builder $query): Builder
    {
        return $query->with([
            'creator:id,name,email',
            'university:id,name'
        ])->withCount('reports');
    }

    /**
     * Load relationships for report history
     */
    public function scopeWithHistoryRelations(Builder $query): Builder
    {
        return $query->with([
            'generator:id,name,email',
            'template:id,name,icon,color',
            'university:id,name'
        ]);
    }

    /**
     * Cache query results with automatic invalidation
     * 
     * @param string $cacheKey Unique cache key
     * @param int $ttl Time to live in seconds (default: 5 minutes)
     * @param callable $callback Query callback
     * @return mixed
     */
    public static function cacheQuery(string $cacheKey, callable $callback, int $ttl = 300)
    {
        return Cache::remember($cacheKey, $ttl, $callback);
    }

    /**
     * Invalidate cached queries for this model
     * Call this in observers when model is created/updated/deleted
     */
    public static function invalidateCache(string $pattern = null): void
    {
        $modelName = class_basename(static::class);
        $pattern = $pattern ?? strtolower($modelName) . ':*';
        
        // Clear all cache keys matching pattern
        // Note: This is a simple implementation. For Redis, use Redis::keys()
        Cache::flush(); // For now, flush all cache
    }

    /**
     * Chunk large datasets efficiently
     * Prevents memory issues when processing thousands of records
     * 
     * @param int $chunkSize Number of records per chunk
     * @param callable $callback Function to process each chunk
     */
    public static function processInChunks(int $chunkSize, callable $callback): void
    {
        static::query()->chunk($chunkSize, function ($items) use ($callback) {
            $callback($items);
        });
    }

    /**
     * Batch insert records efficiently
     * Much faster than creating records one by one
     * 
     * @param array $records Array of record data
     * @return bool
     */
    public static function batchInsert(array $records): bool
    {
        if (empty($records)) {
            return false;
        }

        // Add timestamps
        $now = now();
        $records = array_map(function ($record) use ($now) {
            return array_merge($record, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }, $records);

        return DB::table((new static)->getTable())->insert($records);
    }

    /**
     * Batch update records efficiently
     * 
     * @param array $updates Array of ['id' => $id, 'field' => $value]
     * @param string $field Field to update
     * @return int Number of affected rows
     */
    public static function batchUpdate(array $updates, string $field): int
    {
        if (empty($updates)) {
            return 0;
        }

        $table = (new static)->getTable();
        $cases = [];
        $ids = [];
        $params = [];

        foreach ($updates as $update) {
            $id = $update['id'];
            $value = $update[$field];
            
            $cases[] = "WHEN id = ? THEN ?";
            $params[] = $id;
            $params[] = $value;
            $ids[] = $id;
        }

        $params = array_merge($params, $ids);
        $casesString = implode(' ', $cases);

        return DB::update(
            "UPDATE {$table} SET {$field} = CASE " . $casesString . " END WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ")",
            $params
        );
    }

    /**
     * Get or cache count queries
     * Counting large tables is expensive, cache the result
     */
    public static function cachedCount(string $scope = null, int $ttl = 600): int
    {
        $modelName = class_basename(static::class);
        $cacheKey = strtolower($modelName) . ':count:' . ($scope ?? 'all');

        return Cache::remember($cacheKey, $ttl, function () use ($scope) {
            $query = static::query();
            
            if ($scope && method_exists(static::class, 'scope' . ucfirst($scope))) {
                $query->{$scope}();
            }
            
            return $query->count();
        });
    }

    /**
     * Monitor slow queries (development only)
     * Logs queries taking longer than threshold
     */
    public static function enableQueryMonitoring(float $thresholdMs = 100): void
    {
        if (!app()->environment('local', 'development')) {
            return;
        }

        DB::listen(function ($query) use ($thresholdMs) {
            if ($query->time > $thresholdMs) {
                logger()->warning('Slow Query Detected', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time . 'ms',
                    'connection' => $query->connectionName,
                ]);
            }
        });
    }

    /**
     * Get query execution plan (MySQL only)
     * Useful for debugging slow queries
     */
    public static function explainQuery(Builder $query): array
    {
        $sql = $query->toSql();
        $bindings = $query->getBindings();

        return DB::select('EXPLAIN ' . $sql, $bindings);
    }

    /**
     * Optimize query with proper select columns
     * Only select needed columns to reduce data transfer
     */
    public function scopeSelectOptimized(Builder $query, array $columns = ['*']): Builder
    {
        // If selecting all, use specific columns instead
        if ($columns === ['*']) {
            $table = $this->getTable();
            $columns = $this->getFillable();
            
            // Add primary key if not in fillable
            if (!in_array($this->getKeyName(), $columns)) {
                array_unshift($columns, $this->getKeyName());
            }
            
            // Add timestamps if timestamps are enabled
            if ($this->timestamps) {
                $columns[] = 'created_at';
                $columns[] = 'updated_at';
            }
        }

        return $query->select($columns);
    }

    /**
     * Paginate with count caching
     * Cache the total count for large datasets
     */
    public static function paginateWithCachedCount(int $perPage = 15, array $columns = ['*'], string $pageName = 'page', int $page = null)
    {
        $modelName = class_basename(static::class);
        $cacheKey = strtolower($modelName) . ':pagination:count';

        $total = Cache::remember($cacheKey, 300, function () {
            return static::count();
        });

        return static::query()
            ->select($columns)
            ->paginate($perPage, $columns, $pageName, $page)
            ->setTotal($total);
    }
}
