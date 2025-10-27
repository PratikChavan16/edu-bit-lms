# Bitflow LMS - Global Observability & Monitoring

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Status**: Production Ready

---

## Table of Contents

1. [Observability Overview](#observability-overview)
2. [Logging Strategy](#logging-strategy)
3. [Metrics & Monitoring](#metrics--monitoring)
4. [Tracing](#tracing)
5. [Alerting](#alerting)
6. [Dashboards](#dashboards)
7. [Health Checks](#health-checks)
8. [Performance Monitoring](#performance-monitoring)

---

## Observability Overview

### The Three Pillars

1. **Logs**: Discrete events with context
2. **Metrics**: Numerical measurements over time
3. **Traces**: Request flow across services

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized log aggregation |
| **Metrics** | Prometheus + Grafana | Time-series metrics |
| **Tracing** | Jaeger / OpenTelemetry | Distributed tracing |
| **APM** | New Relic / Datadog | Application performance |
| **Uptime** | UptimeRobot / Pingdom | Service availability |

---

## Logging Strategy

### Log Levels

```php
// Laravel logging levels
Log::emergency('System is unusable'); // 0 - Highest
Log::alert('Action must be taken immediately'); // 1
Log::critical('Critical conditions'); // 2
Log::error('Error conditions'); // 3
Log::warning('Warning conditions'); // 4
Log::notice('Normal but significant'); // 5
Log::info('Informational messages'); // 6
Log::debug('Debug-level messages'); // 7 - Lowest
```

### Structured Logging

```php
// app/Logging/StructuredLogger.php
class StructuredLogger {
    public static function logRequest() {
        Log::info('API_REQUEST', [
            'method' => request()->method(),
            'url' => request()->fullUrl(),
            'ip' => request()->ip(),
            'user_id' => auth()->id(),
            'university_id' => auth()->user()?->university_id,
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toIso8601String(),
            'request_id' => request()->header('X-Request-ID'),
        ]);
    }
    
    public static function logResponse($response, $duration) {
        Log::info('API_RESPONSE', [
            'status' => $response->status(),
            'duration_ms' => $duration,
            'request_id' => request()->header('X-Request-ID'),
            'memory_usage_mb' => memory_get_peak_usage(true) / 1024 / 1024,
        ]);
    }
    
    public static function logError(\Throwable $e) {
        Log::error('EXCEPTION', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'user_id' => auth()->id(),
            'url' => request()->fullUrl(),
            'request_id' => request()->header('X-Request-ID'),
        ]);
    }
}

// Middleware to log all requests
class LogRequests {
    public function handle($request, Closure $next) {
        $start = microtime(true);
        
        StructuredLogger::logRequest();
        
        $response = $next($request);
        
        $duration = (microtime(true) - $start) * 1000;
        StructuredLogger::logResponse($response, $duration);
        
        return $response;
    }
}
```

### Log Contexts

```php
// User context
Log::withContext([
    'user_id' => auth()->id(),
    'university_id' => auth()->user()->university_id,
    'role' => auth()->user()->roles->first()->slug,
]);

// Then all subsequent logs include this context
Log::info('Student enrolled', ['student_id' => $student->id]);
```

### Log Rotation

```php
// config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => storage_path('logs/laravel.log'),
    'level' => env('LOG_LEVEL', 'info'),
    'days' => 30, // Keep logs for 30 days
],

'production' => [
    'driver' => 'stack',
    'channels' => ['daily', 'elk'],
    'ignore_exceptions' => false,
],
```

### ELK Stack Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

---

## Metrics & Monitoring

### Application Metrics

```php
// app/Metrics/MetricsCollector.php
use Prometheus\CollectorRegistry;
use Prometheus\Storage\Redis;

class MetricsCollector {
    private CollectorRegistry $registry;
    
    public function __construct() {
        Redis::setDefaultOptions(['host' => config('database.redis.host')]);
        $this->registry = CollectorRegistry::getDefault();
    }
    
    // Counter: Monotonically increasing value
    public function incrementLoginAttempts() {
        $counter = $this->registry->getOrRegisterCounter(
            'bitflow',
            'login_attempts_total',
            'Total login attempts',
            ['status'] // Labels
        );
        $counter->inc(['success']);
    }
    
    // Gauge: Value that can go up or down
    public function setActiveUsers(int $count) {
        $gauge = $this->registry->getOrRegisterGauge(
            'bitflow',
            'active_users',
            'Number of currently active users'
        );
        $gauge->set($count);
    }
    
    // Histogram: Distribution of values
    public function recordRequestDuration(float $duration) {
        $histogram = $this->registry->getOrRegisterHistogram(
            'bitflow',
            'http_request_duration_seconds',
            'HTTP request duration',
            ['method', 'endpoint', 'status'],
            [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
        );
        $histogram->observe($duration, [
            request()->method(),
            request()->path(),
            response()->status()
        ]);
    }
}

// Usage in middleware
class MetricsMiddleware {
    public function handle($request, Closure $next) {
        $start = microtime(true);
        
        $response = $next($request);
        
        $duration = microtime(true) - $start;
        app(MetricsCollector::class)->recordRequestDuration($duration);
        
        return $response;
    }
}
```

### Key Metrics to Track

```yaml
# Business Metrics
- total_students
- total_faculty
- total_enrollments
- fee_payments_total
- fee_payments_pending

# Application Metrics
- http_requests_total
- http_request_duration_seconds
- http_request_size_bytes
- http_response_size_bytes
- active_sessions_count
- database_query_duration_seconds
- cache_hit_rate
- queue_jobs_processed_total
- queue_jobs_failed_total

# Infrastructure Metrics
- cpu_usage_percent
- memory_usage_bytes
- disk_usage_bytes
- network_received_bytes
- network_transmitted_bytes
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'bitflow-backend'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'

  - job_name: 'bitflow-frontend'
    static_configs:
      - targets: ['localhost:3001', 'localhost:3002', 'localhost:3003']
    metrics_path: '/__metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093']
```

---

## Tracing

### Distributed Tracing with Jaeger

```php
// composer require open-telemetry/sdk

use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SDK\Trace\SpanProcessor\SimpleSpanProcessor;
use OpenTelemetry\Contrib\Jaeger\Exporter as JaegerExporter;

class TracingService {
    private $tracer;
    
    public function __construct() {
        $exporter = new JaegerExporter(
            'bitflow-lms',
            'http://jaeger:14268/api/traces'
        );
        
        $tracerProvider = new TracerProvider(
            new SimpleSpanProcessor($exporter)
        );
        
        $this->tracer = $tracerProvider->getTracer('bitflow');
    }
    
    public function traceStudentEnrollment($studentId, $courseId) {
        $span = $this->tracer->spanBuilder('enroll_student')
            ->setAttribute('student.id', $studentId)
            ->setAttribute('course.id', $courseId)
            ->startSpan();
        
        try {
            // Business logic
            $enrollment = $this->enrollStudent($studentId, $courseId);
            
            $span->setAttribute('enrollment.id', $enrollment->id);
            $span->setStatus(StatusCode::STATUS_OK);
            
            return $enrollment;
        } catch (\Exception $e) {
            $span->recordException($e);
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            throw $e;
        } finally {
            $span->end();
        }
    }
}
```

---

## Alerting

### Alert Rules (Prometheus)

```yaml
# alerts.yml
groups:
  - name: bitflow_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/second"

      # Slow response time
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time is high"
          description: "P95 latency is {{ $value }} seconds"

      # Database connection issues
      - alert: DatabaseConnectionFailure
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL is unreachable"

      # High memory usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      # Disk space low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space low"
          description: "Only {{ $value | humanizePercentage }} disk space remaining"

      # Failed login attempts
      - alert: HighFailedLoginRate
        expr: rate(login_attempts_total{status="failed"}[5m]) > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High failed login rate"
          description: "{{ $value }} failed logins per second - possible brute force attack"
```

### Notification Channels

```yaml
# alertmanager.yml
global:
  slack_api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

route:
  receiver: 'default'
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      continue: true
    
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        title: 'Bitflow LMS Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'

  - name: 'critical-alerts'
    slack_configs:
      - channel: '#critical-alerts'
        title: '🚨 CRITICAL ALERT'
    email_configs:
      - to: 'oncall@bitflow.edu'
        from: 'alerts@bitflow.edu'
        smarthost: 'smtp.gmail.com:587'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'

  - name: 'warning-alerts'
    slack_configs:
      - channel: '#alerts'
        title: '⚠️ Warning'
```

---

## Dashboards

### Grafana Dashboard (JSON)

```json
{
  "dashboard": {
    "title": "Bitflow LMS - System Overview",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time (P95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)",
            "legendFormat": "P95 Latency"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx Errors"
          }
        ]
      },
      {
        "id": 4,
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "active_users"
          }
        ]
      },
      {
        "id": 5,
        "title": "Database Query Duration",
        "type": "heatmap",
        "targets": [
          {
            "expr": "rate(database_query_duration_seconds_bucket[5m])"
          }
        ]
      },
      {
        "id": 6,
        "title": "Cache Hit Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## Health Checks

### Endpoint Implementation

```php
// routes/api.php
Route::get('/health', [HealthCheckController::class, 'check'])
    ->withoutMiddleware(['auth', 'throttle']);

// app/Http/Controllers/HealthCheckController.php
class HealthCheckController extends Controller {
    public function check() {
        $checks = [
            'database' => $this->checkDatabase(),
            'redis' => $this->checkRedis(),
            'storage' => $this->checkStorage(),
            'queue' => $this->checkQueue(),
        ];
        
        $healthy = collect($checks)->every(fn($check) => $check['status'] === 'ok');
        
        return response()->json([
            'status' => $healthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ], $healthy ? 200 : 503);
    }
    
    private function checkDatabase(): array {
        try {
            DB::connection()->getPdo();
            $latency = $this->measureLatency(fn() => DB::select('SELECT 1'));
            
            return [
                'status' => 'ok',
                'latency_ms' => round($latency, 2),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }
    
    private function checkRedis(): array {
        try {
            Redis::ping();
            return ['status' => 'ok'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    private function checkStorage(): array {
        $path = storage_path('logs');
        $total = disk_total_space($path);
        $free = disk_free_space($path);
        $used = $total - $free;
        $usedPercent = ($used / $total) * 100;
        
        return [
            'status' => $usedPercent < 90 ? 'ok' : 'warning',
            'used_percent' => round($usedPercent, 2),
            'free_gb' => round($free / 1024 / 1024 / 1024, 2),
        ];
    }
    
    private function checkQueue(): array {
        try {
            $size = Redis::llen('queues:default');
            return [
                'status' => $size < 1000 ? 'ok' : 'warning',
                'size' => $size,
            ];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    private function measureLatency(callable $fn): float {
        $start = microtime(true);
        $fn();
        return (microtime(true) - $start) * 1000;
    }
}
```

### Kubernetes Liveness & Readiness Probes

```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bitflow-backend
spec:
  template:
    spec:
      containers:
        - name: backend
          image: bitflow/backend:latest
          ports:
            - containerPort: 8000
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            successThreshold: 1
```

---

## Performance Monitoring

### APM Integration (New Relic)

```php
// config/newrelic.php
return [
    'enabled' => env('NEW_RELIC_ENABLED', false),
    'app_name' => env('NEW_RELIC_APP_NAME', 'Bitflow LMS'),
    'license_key' => env('NEW_RELIC_LICENSE_KEY'),
];

// Automatic transaction naming
class NewRelicMiddleware {
    public function handle($request, Closure $next) {
        if (extension_loaded('newrelic')) {
            newrelic_name_transaction($request->route()->getName());
            newrelic_add_custom_parameter('user_id', auth()->id());
            newrelic_add_custom_parameter('university_id', auth()->user()?->university_id);
        }
        
        return $next($request);
    }
}
```

### Frontend Performance Monitoring

```typescript
// app/lib/monitoring.ts
export function trackPageLoad() {
  if (typeof window !== 'undefined' && window.performance) {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstPaintTime = timing.responseStart - timing.navigationStart;
    
    // Send to analytics
    fetch('/api/metrics/page-load', {
      method: 'POST',
      body: JSON.stringify({
        page_load_time: pageLoadTime,
        dom_ready_time: domReadyTime,
        first_paint_time: firstPaintTime,
        url: window.location.href,
      }),
    });
  }
}

// Usage in Next.js
export default function App({ Component, pageProps }) {
  useEffect(() => {
    trackPageLoad();
  }, []);
  
  return <Component {...pageProps} />;
}
```

---

**📊 Observability is essential for maintaining system reliability and user experience.**
