# Monitoring & Observability Guide

**Bitflow Owner Portal - Educational Institution Management System**

Version: 1.0  
Last Updated: October 31, 2025  
Status: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Application Logging](#application-logging)
3. [Performance Monitoring](#performance-monitoring)
4. [Error Tracking](#error-tracking)
5. [Health Checks](#health-checks)
6. [Database Monitoring](#database-monitoring)
7. [Redis Monitoring](#redis-monitoring)
8. [Queue Monitoring](#queue-monitoring)
9. [Uptime Monitoring](#uptime-monitoring)
10. [Alert Configuration](#alert-configuration)
11. [Log Aggregation](#log-aggregation)
12. [Metrics Dashboards](#metrics-dashboards)
13. [Incident Response](#incident-response)

---

## Overview

Effective monitoring ensures system reliability, performance, and quick incident response. This guide covers all monitoring aspects of the Bitflow Owner Portal.

**Monitoring Goals:**
- **Availability:** 99.9% uptime SLA
- **Performance:** API response time P95 < 200ms
- **Error Rate:** < 0.1% of total requests
- **Queue Processing:** < 5 minute lag
- **Database:** Query time P95 < 100ms

---

## Application Logging

### Laravel Logging Configuration

**Configuration File:** `backend/config/logging.php`

**Production Logging Channel:**

```php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'warning'),
        'days' => 14,
        'permission' => 0664,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Bitflow Monitor',
        'emoji' => ':boom:',
        'level' => 'error',
    ],
    
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
        'ignore_exceptions' => false,
    ],
],
```

**Environment Configuration (.env):**

```env
LOG_CHANNEL=stack
LOG_LEVEL=warning
LOG_DAYS=14
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| **EMERGENCY** | System is unusable | Database completely down |
| **ALERT** | Immediate action required | Redis connection lost |
| **CRITICAL** | Critical conditions | Payment gateway failure |
| **ERROR** | Runtime errors | Failed API request, unhandled exception |
| **WARNING** | Exceptional occurrences | Deprecated API usage, high memory |
| **NOTICE** | Normal but significant | User login from new location |
| **INFO** | Interesting events | User created, report generated |
| **DEBUG** | Detailed debug information | Variable dumps, query details |

### Log Locations

**Backend:**
- Application logs: `/var/www/bitflow-backend/backend/storage/logs/laravel.log`
- Queue worker logs: `/var/www/bitflow-backend/backend/storage/logs/worker.log`

**System:**
- Nginx access: `/var/log/nginx/bitflow-api-access.log`
- Nginx errors: `/var/log/nginx/bitflow-api-error.log`
- PHP-FPM: `/var/log/php8.2-fpm.log`
- MySQL: `/var/log/mysql/error.log`
- MySQL slow queries: `/var/log/mysql/slow-query.log`

### Log Retention Policy

| Log Type | Retention Period | Rotation |
|----------|-----------------|----------|
| Application | 14 days | Daily |
| Nginx access | 30 days | Daily |
| Nginx error | 90 days | Daily |
| MySQL error | 90 days | Weekly |
| MySQL slow query | 30 days | Daily |

### Log Rotation Configuration

Create `/etc/logrotate.d/bitflow`:

```
/var/www/bitflow-backend/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0664 www-data www-data
    sharedscripts
    postrotate
        [ -f /var/run/php/php8.2-fpm.pid ] && kill -USR1 $(cat /var/run/php/php8.2-fpm.pid)
    endscript
}
```

---

## Performance Monitoring

### Laravel Telescope (Development/Staging Only)

**Installation:**

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

**Configuration (.env):**

```env
TELESCOPE_ENABLED=false  # Disable in production for performance
TELESCOPE_ENABLED=true   # Enable in staging
```

**Access:** `https://staging.bitflow.com/telescope`

**Monitors:**
- All HTTP requests with response times
- Database queries with execution time
- Queue jobs
- Scheduled tasks
- Cache operations
- Redis commands
- Exceptions
- Email sending

### Application Performance Metrics

**Key Metrics to Track:**

1. **API Response Time**
   - Endpoint: All API routes
   - Target: P50 < 100ms, P95 < 200ms, P99 < 500ms

2. **Database Query Time**
   - All queries logged in slow query log (> 2 seconds)
   - Target: P95 < 100ms

3. **Queue Processing Time**
   - Job execution time
   - Target: P95 < 30 seconds

4. **Memory Usage**
   - PHP memory usage per request
   - Target: < 128MB per request

### Custom Performance Logging

Add to critical endpoints:

```php
use Illuminate\Support\Facades\Log;

$start = microtime(true);

// Your code here

$duration = (microtime(true) - $start) * 1000; // Convert to milliseconds

if ($duration > 200) {
    Log::warning('Slow API response', [
        'endpoint' => request()->path(),
        'method' => request()->method(),
        'duration_ms' => $duration,
        'user_id' => auth()->id(),
    ]);
}
```

---

## Error Tracking

### Laravel Exception Handler

**File:** `backend/app/Exceptions/Handler.php`

```php
<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;

class Handler extends ExceptionHandler
{
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            if (app()->environment('production')) {
                // Log to Slack for critical errors
                Log::channel('slack')->error($e->getMessage(), [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => request()->fullUrl(),
                    'user_id' => auth()->id(),
                ]);
            }
        });
    }
}
```

### Error Metrics

**Track:**
- Total errors per hour
- Error rate (errors / total requests)
- Unique errors
- Top 10 most frequent errors

**Thresholds:**
- Error rate > 1%: Warning
- Error rate > 5%: Critical alert

---

## Health Checks

### Backend Health Endpoint

**Route:** `GET /up`

**Implementation:** `backend/routes/web.php`

```php
Route::get('/up', function () {
    try {
        // Check database
        DB::connection()->getPdo();
        
        // Check Redis
        Redis::ping();
        
        // Check storage writable
        Storage::put('health-check.txt', 'OK');
        Storage::delete('health-check.txt');
        
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toISOString(),
            'services' => [
                'database' => 'ok',
                'redis' => 'ok',
                'storage' => 'ok',
            ]
        ], 200);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Service unhealthy',
            'error' => app()->environment('production') ? 'Internal error' : $e->getMessage(),
        ], 503);
    }
});
```

**Response (Success):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-31T12:00:00.000000Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "storage": "ok"
  }
}
```

### Health Check Monitoring Script

Create `/usr/local/bin/check-bitflow-health.sh`:

```bash
#!/bin/bash

API_URL="https://api.bitflow.com/up"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK"

response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$response" != "200" ]; then
    # Send alert to Slack
    curl -X POST $SLACK_WEBHOOK \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"🚨 Bitflow API health check failed! Status: $response\"}"
    
    echo "Health check failed: $response"
    exit 1
else
    echo "Health check passed"
    exit 0
fi
```

```bash
chmod +x /usr/local/bin/check-bitflow-health.sh

# Add to crontab (every 5 minutes)
*/5 * * * * /usr/local/bin/check-bitflow-health.sh
```

---

## Database Monitoring

### MySQL Slow Query Log

**Enable in MySQL configuration:**

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2
log_queries_not_using_indexes = 1
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

### Database Metrics to Monitor

1. **Query Performance**
   - Slow queries (> 2 seconds)
   - Queries not using indexes
   - Total query count per minute

2. **Connection Pool**
   - Active connections
   - Max connections reached events
   - Connection errors

3. **Storage**
   - Database size growth rate
   - Table sizes
   - Index sizes

4. **Replication Lag** (if using replication)
   - Seconds behind master
   - Replication errors

### Monitoring Queries

```sql
-- Show current processes
SHOW FULL PROCESSLIST;

-- Show slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Show connection stats
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- Show table sizes
SELECT 
    table_schema AS 'Database',
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'bitflow_production'
ORDER BY (data_length + index_length) DESC;

-- Show index usage
SELECT 
    table_schema,
    table_name,
    index_name,
    seq_in_index,
    column_name
FROM information_schema.STATISTICS
WHERE table_schema = 'bitflow_production'
ORDER BY table_name, index_name, seq_in_index;
```

---

## Redis Monitoring

### Redis Monitoring Commands

```bash
# Connect to Redis
redis-cli -h redis.bitflow.internal -a <PASSWORD>

# Monitor real-time commands
MONITOR

# Get server info
INFO

# Get memory usage
INFO memory

# Get stats
INFO stats

# Get keyspace stats
INFO keyspace

# Get slow log
SLOWLOG GET 10

# Get connected clients
CLIENT LIST
```

### Key Metrics

| Metric | Command | Target |
|--------|---------|--------|
| Memory usage | `INFO memory` → `used_memory_human` | < 80% of max |
| Hit rate | `INFO stats` → `keyspace_hits / (keyspace_hits + keyspace_misses)` | > 90% |
| Connected clients | `INFO clients` → `connected_clients` | Monitor trend |
| Evicted keys | `INFO stats` → `evicted_keys` | Should be 0 |
| Rejected connections | `INFO stats` → `rejected_connections` | Should be 0 |

### Redis Monitoring Script

Create `/usr/local/bin/monitor-redis.sh`:

```bash
#!/bin/bash

REDIS_HOST="redis.bitflow.internal"
REDIS_PASSWORD="<PASSWORD>"

# Get memory usage percentage
USED_MEMORY=$(redis-cli -h $REDIS_HOST -a $REDIS_PASSWORD INFO memory | grep "used_memory:" | cut -d: -f2 | tr -d '\r')
MAX_MEMORY=$(redis-cli -h $REDIS_HOST -a $REDIS_PASSWORD INFO memory | grep "maxmemory:" | cut -d: -f2 | tr -d '\r')

if [ "$MAX_MEMORY" -gt 0 ]; then
    USAGE_PERCENT=$((USED_MEMORY * 100 / MAX_MEMORY))
    
    if [ "$USAGE_PERCENT" -gt 80 ]; then
        echo "WARNING: Redis memory usage at ${USAGE_PERCENT}%"
        # Send alert
    fi
fi

# Check hit rate
HITS=$(redis-cli -h $REDIS_HOST -a $REDIS_PASSWORD INFO stats | grep "keyspace_hits:" | cut -d: -f2 | tr -d '\r')
MISSES=$(redis-cli -h $REDIS_HOST -a $REDIS_PASSWORD INFO stats | grep "keyspace_misses:" | cut -d: -f2 | tr -d '\r')

TOTAL=$((HITS + MISSES))
if [ "$TOTAL" -gt 0 ]; then
    HIT_RATE=$((HITS * 100 / TOTAL))
    
    if [ "$HIT_RATE" -lt 90 ]; then
        echo "WARNING: Redis hit rate at ${HIT_RATE}%"
        # Send alert
    fi
fi
```

---

## Queue Monitoring

### Queue Metrics

**Monitor:**
- Jobs processed per minute
- Failed jobs count
- Average job processing time
- Jobs waiting in queue

### Queue Monitoring Commands

```bash
# Check Supervisor status
sudo supervisorctl status bitflow-worker:*

# View queue stats
cd /var/www/bitflow-backend/backend
php artisan queue:monitor redis

# Restart failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush

# Horizon (recommended for production)
composer require laravel/horizon
php artisan horizon:install
```

### Laravel Horizon (Recommended)

**Installation:**

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan horizon:publish
```

**Access:** `https://api.bitflow.com/horizon`

**Features:**
- Real-time queue monitoring
- Job metrics and throughput
- Failed job management
- Worker configuration
- Queue balancing

---

## Uptime Monitoring

### External Monitoring Services

**Recommended Tools:**

1. **UptimeRobot** (Free tier available)
   - Monitor: `https://api.bitflow.com/up`
   - Check interval: 5 minutes
   - Alert channels: Email, Slack, SMS

2. **Pingdom**
   - Full page monitoring
   - Performance testing
   - Real user monitoring

3. **Better Uptime**
   - Status pages
   - Incident management
   - Multi-location checks

### Simple Uptime Monitor Script

Create `/usr/local/bin/uptime-check.sh`:

```bash
#!/bin/bash

ENDPOINTS=(
    "https://api.bitflow.com/up"
    "https://admin.bitflow.com"
)

SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK"

for endpoint in "${ENDPOINTS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    
    if [ "$status" != "200" ]; then
        curl -X POST $SLACK_WEBHOOK \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"🔴 $endpoint is DOWN! Status: $status\"}"
    fi
done
```

Run every 5 minutes via cron:

```bash
*/5 * * * * /usr/local/bin/uptime-check.sh
```

---

## Alert Configuration

### Alert Severity Levels

| Level | Response Time | Notification Channels | Examples |
|-------|---------------|---------------------|----------|
| **Critical** | Immediate (< 5 min) | SMS, Slack, Email, PagerDuty | API down, database connection lost |
| **High** | 15 minutes | Slack, Email | High error rate, slow response times |
| **Medium** | 1 hour | Email | Elevated memory usage, queue lag |
| **Low** | 4 hours | Email | Disk space warning, deprecated API usage |

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| API response time P95 | > 300ms | > 500ms |
| Error rate | > 1% | > 5% |
| Database connection pool | > 80% | > 95% |
| Redis memory | > 80% | > 95% |
| Disk usage | > 80% | > 90% |
| Queue processing lag | > 10 min | > 30 min |

### Slack Webhook Configuration

**Setup:**
1. Go to Slack → Your Workspace → Apps → Incoming Webhooks
2. Create new webhook for `#bitflow-alerts` channel
3. Copy webhook URL

**Add to .env:**

```env
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Email Alerts

Configure in `backend/config/mail.php`:

```php
'to' => [
    'address' => 'alerts@bitflow.com',
    'name' => 'Bitflow Alerts'
],
```

---

## Log Aggregation

### Recommended Tools

1. **ELK Stack (Elasticsearch, Logstash, Kibana)**
   - Centralized logging
   - Full-text search
   - Visualization dashboards

2. **Graylog**
   - Open-source log management
   - Alerting capabilities
   - Easy setup

3. **Papertrail**
   - Cloud-based log management
   - Real-time tail
   - Saved searches

### Filebeat Configuration for ELK

Install Filebeat:

```bash
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.10.0-amd64.deb
sudo dpkg -i filebeat-8.10.0-amd64.deb
```

Configure `/etc/filebeat/filebeat.yml`:

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/www/bitflow-backend/backend/storage/logs/*.log
    fields:
      app: bitflow
      environment: production
      type: application

  - type: log
    enabled: true
    paths:
      - /var/log/nginx/bitflow-*.log
    fields:
      app: bitflow
      environment: production
      type: nginx

output.elasticsearch:
  hosts: ["elasticsearch.bitflow.internal:9200"]
  username: "elastic"
  password: "changeme"
  index: "bitflow-logs-%{+yyyy.MM.dd}"

setup.kibana:
  host: "kibana.bitflow.internal:5601"
```

Start Filebeat:

```bash
sudo systemctl enable filebeat
sudo systemctl start filebeat
```

---

## Metrics Dashboards

### Recommended Dashboard Tools

1. **Grafana**
   - Beautiful dashboards
   - Alerting
   - Multiple data sources

2. **Laravel Nova** (Admin Panel)
   - Application-level metrics
   - User analytics
   - Resource management

### Key Dashboards to Create

**1. Application Overview Dashboard**
- Total requests per minute
- Error rate
- Response time P50, P95, P99
- Active users
- Queue jobs processed

**2. Infrastructure Dashboard**
- CPU usage
- Memory usage
- Disk usage
- Network I/O

**3. Database Dashboard**
- Query execution time
- Slow queries count
- Active connections
- Database size

**4. Business Metrics Dashboard**
- New user registrations
- Active universities
- Student enrollments
- Reports generated

---

## Incident Response

### Incident Response Procedure

**1. Detection (0-5 minutes)**
- Alert received via monitoring system
- Acknowledge alert
- Assess severity

**2. Assessment (5-15 minutes)**
- Check health endpoints
- Review recent logs
- Identify affected services
- Estimate impact

**3. Communication (15-30 minutes)**
- Notify stakeholders
- Update status page
- Assemble response team if needed

**4. Resolution (Variable)**
- Apply fix or rollback
- Verify resolution
- Monitor for recurrence

**5. Post-Incident (24-48 hours)**
- Conduct postmortem
- Document root cause
- Implement preventive measures
- Update runbooks

### Common Incidents & Responses

**Incident: High API Error Rate**

**Response:**
1. Check recent deployments (possible rollback)
2. Review error logs for patterns
3. Check database connectivity
4. Verify Redis connectivity
5. Check external service dependencies

**Commands:**
```bash
# Check recent deployments
git log -5 --oneline

# Tail error logs
tail -f /var/www/bitflow-backend/backend/storage/logs/laravel.log

# Check database
mysql -u bitflow_app -p -e "SELECT 1"

# Check Redis
redis-cli -h redis.bitflow.internal -a <PASSWORD> PING
```

---

**Incident: Slow API Response Times**

**Response:**
1. Check database slow query log
2. Review queue processing lag
3. Check Redis hit rate
4. Review recent code changes
5. Scale resources if needed

**Commands:**
```bash
# Check slow queries
sudo tail -100 /var/log/mysql/slow-query.log

# Check queue lag
php artisan queue:monitor redis

# Check Redis hit rate
redis-cli INFO stats | grep keyspace
```

---

**Incident: Database Connection Failures**

**Response:**
1. Check MySQL service status
2. Verify connection pool not exhausted
3. Check firewall rules
4. Review database logs
5. Restart MySQL if necessary

**Commands:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Check connections
mysql -u root -p -e "SHOW PROCESSLIST"
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected'"

# Check logs
sudo tail -100 /var/log/mysql/error.log

# Restart MySQL (last resort)
sudo systemctl restart mysql
```

---

### Incident Escalation Matrix

| Severity | Notify | Response Time |
|----------|--------|---------------|
| P1 (Critical) | On-call engineer, CTO, Stakeholders | < 15 min |
| P2 (High) | On-call engineer, Team Lead | < 1 hour |
| P3 (Medium) | On-call engineer | < 4 hours |
| P4 (Low) | Regular business hours | < 24 hours |

---

## Monitoring Checklist

### Daily Checks

- [ ] Review error rate dashboard
- [ ] Check queue processing lag
- [ ] Verify backup completion
- [ ] Review slow query log

### Weekly Checks

- [ ] Review performance trends
- [ ] Check disk usage growth
- [ ] Review security logs
- [ ] Update monitoring dashboards

### Monthly Checks

- [ ] Review and update alert thresholds
- [ ] Analyze capacity planning metrics
- [ ] Test incident response procedures
- [ ] Review and update documentation

---

## Recommended Monitoring Stack

**For Small/Medium Deployments:**
- **Logs:** Laravel daily logs + Slack alerts
- **Uptime:** UptimeRobot (free tier)
- **APM:** Laravel Telescope (staging only)
- **Metrics:** Simple custom scripts

**For Large/Enterprise Deployments:**
- **Logs:** ELK Stack or Graylog
- **Uptime:** Pingdom or Better Uptime
- **APM:** New Relic or Datadog
- **Metrics:** Grafana + Prometheus
- **Queue:** Laravel Horizon
- **Errors:** Sentry or Bugsnag

---

## Additional Resources

- [Laravel Logging Documentation](https://laravel.com/docs/logging)
- [Laravel Telescope Documentation](https://laravel.com/docs/telescope)
- [Laravel Horizon Documentation](https://laravel.com/docs/horizon)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Redis Monitoring Best Practices](https://redis.io/docs/management/optimization/)

---

**Document Version:** 1.0  
**Last Reviewed:** October 31, 2025  
**Next Review:** November 30, 2025

For deployment procedures, see **[DEPLOYMENT_PRODUCTION.md](DEPLOYMENT_PRODUCTION.md)**