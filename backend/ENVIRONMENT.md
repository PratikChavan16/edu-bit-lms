# BitFlow Admin Portal - Environment Configuration Guide

This document outlines all environment variables required for the BitFlow Admin Portal in production.

## Application Configuration

### Core Settings
```env
APP_NAME="BitFlow Admin Portal"
APP_ENV=production
APP_KEY=                          # Generate with: php artisan key:generate
APP_DEBUG=false                   # MUST be false in production
APP_URL=https://your-domain.com   # Your production domain
```

### Frontend Configuration
```env
FRONTEND_URL=https://app.your-domain.com
CORS_ALLOWED_ORIGINS=https://app.your-domain.com
```

## Database Configuration

### PostgreSQL (Production)
```env
DB_CONNECTION=pgsql
DB_HOST=your-db-host.com
DB_PORT=5432
DB_DATABASE=bitflow_admin
DB_USERNAME=bitflow_user
DB_PASSWORD=                      # Strong password required
DB_SSL_MODE=require              # Required for production databases
```

### SQLite (Development/Testing Only)
```env
# DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite
```

## JWT Authentication

```env
JWT_SECRET=                       # Generate with: php artisan jwt:secret
JWT_TTL=60                       # Token lifetime in minutes (60 = 1 hour)
JWT_REFRESH_TTL=20160            # Refresh token lifetime in minutes (14 days)
JWT_ALGO=HS256                   # Encryption algorithm
JWT_BLACKLIST_ENABLED=true       # Enable token blacklist
JWT_BLACKLIST_GRACE_PERIOD=30    # Grace period in seconds
```

## Mail Configuration

### SMTP Settings
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io       # Or your SMTP provider
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Alternative Providers
#### Mailgun
```env
MAILGUN_DOMAIN=mg.your-domain.com
MAILGUN_SECRET=
MAILGUN_ENDPOINT=api.mailgun.net
```

#### Amazon SES
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_SES_CONFIGURATION_SET=
```

## Logging Configuration

```env
LOG_CHANNEL=stack               # Use 'stack' for multiple channels
LOG_LEVEL=warning              # production: warning, error, critical
LOG_DEPRECATIONS_CHANNEL=null  # Deprecation warnings channel
LOG_SLACK_WEBHOOK_URL=         # Optional: Slack notifications for errors
```

### Recommended Production Log Levels
- `debug` - Development only
- `info` - Staging
- `warning` - Production (default)
- `error` - Production (stricter)
- `critical` - Production (critical only)

## Cache Configuration

### Redis (Recommended for Production)
```env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
REDIS_CACHE_DB=1
```

### File Cache (Alternative)
```env
CACHE_DRIVER=file
```

## Session Configuration

```env
SESSION_DRIVER=redis            # redis, database, or file
SESSION_LIFETIME=120            # Session lifetime in minutes
SESSION_ENCRYPT=true            # Encrypt session data
SESSION_DOMAIN=.your-domain.com # Cookie domain
SESSION_SECURE_COOKIE=true      # HTTPS only cookies
```

## Queue Configuration

### Redis Queue (Recommended)
```env
QUEUE_CONNECTION=redis
REDIS_QUEUE_HOST=127.0.0.1
REDIS_QUEUE_PORT=6379
REDIS_QUEUE_PASSWORD=null
REDIS_QUEUE_DB=2
```

### Database Queue (Alternative)
```env
QUEUE_CONNECTION=database
```

### Supervisor Configuration
Remember to configure supervisor for queue workers:
```bash
php artisan queue:work --queue=high,default,low --tries=3
```

## File Storage

### Local Storage
```env
FILESYSTEM_DISK=local
```

### Amazon S3
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bitflow-uploads
AWS_URL=https://s3.amazonaws.com
AWS_ENDPOINT=
AWS_USE_PATH_STYLE_ENDPOINT=false
```

### DigitalOcean Spaces
```env
FILESYSTEM_DISK=spaces
DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_ENDPOINT=
DO_SPACES_REGION=
DO_SPACES_BUCKET=
```

## Rate Limiting

```env
# API rate limits (requests per minute)
RATE_LIMIT_AUTH=10              # Auth endpoints (login, register)
RATE_LIMIT_API=60               # Protected API endpoints
```

## Security

### Encryption
```env
ENCRYPTION_KEY=${APP_KEY}        # Uses APP_KEY by default
```

### CORS
```env
CORS_ALLOWED_ORIGINS=https://app.your-domain.com,https://admin.your-domain.com
CORS_ALLOWED_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With
CORS_EXPOSED_HEADERS=
CORS_MAX_AGE=3600
CORS_SUPPORTS_CREDENTIALS=true
```

## Third-Party Services

### Error Tracking (Sentry)
```env
SENTRY_LARAVEL_DSN=
SENTRY_TRACES_SAMPLE_RATE=0.1   # 10% of transactions
```

### Analytics
```env
GOOGLE_ANALYTICS_ID=
```

### Payment Gateway (if applicable)
```env
STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```

## Performance

### Optimization
```env
OPTIMIZE_ENABLE=true            # Enable route/config caching
TELESCOPE_ENABLED=false         # Disable debug tools in production
DEBUGBAR_ENABLED=false          # Disable debug bar
```

### Broadcasting (Real-time features)
```env
BROADCAST_DRIVER=redis          # or pusher, log, null
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
```

## Backup Configuration

```env
BACKUP_DISK=s3                  # Where to store backups
BACKUP_SCHEDULE=daily           # Backup frequency
BACKUP_RETENTION_DAYS=30        # How long to keep backups
```

## Maintenance Mode

```env
MAINTENANCE_MODE=false
MAINTENANCE_SECRET=              # Secret to bypass maintenance mode
```

## Example Production .env File

```env
# Application
APP_NAME="BitFlow Admin Portal"
APP_ENV=production
APP_KEY=base64:GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.bitflow.edu

# Frontend
FRONTEND_URL=https://app.bitflow.edu
CORS_ALLOWED_ORIGINS=https://app.bitflow.edu

# Database
DB_CONNECTION=pgsql
DB_HOST=db.bitflow.internal
DB_PORT=5432
DB_DATABASE=bitflow_production
DB_USERNAME=bitflow_admin
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_SSL_MODE=require

# JWT
JWT_SECRET=GENERATED_JWT_SECRET
JWT_TTL=60
JWT_REFRESH_TTL=20160

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.bitflow.edu
MAIL_PASSWORD=MAILGUN_PASSWORD
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@bitflow.edu
MAIL_FROM_NAME="BitFlow Admin"

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=warning
LOG_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=redis.bitflow.internal
REDIS_PASSWORD=REDIS_PASSWORD
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bitflow-uploads

# Security
SESSION_SECURE_COOKIE=true
RATE_LIMIT_AUTH=10
RATE_LIMIT_API=60

# Error Tracking
SENTRY_LARAVEL_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Security Checklist

- [ ] APP_DEBUG is false
- [ ] APP_KEY is generated and unique
- [ ] JWT_SECRET is generated and unique
- [ ] All database passwords are strong (16+ characters)
- [ ] HTTPS is enforced (SESSION_SECURE_COOKIE=true)
- [ ] CORS is configured with specific domains (not *)
- [ ] Rate limiting is enabled
- [ ] Error tracking is configured (Sentry)
- [ ] Logs are monitored regularly
- [ ] Backups are scheduled and tested
- [ ] SSL certificates are valid and auto-renewing
- [ ] All secrets are stored securely (not in version control)

## Deployment Steps

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Generate application key**
   ```bash
   php artisan key:generate
   ```

3. **Generate JWT secret**
   ```bash
   php artisan jwt:secret
   ```

4. **Run migrations**
   ```bash
   php artisan migrate --force
   ```

5. **Cache configuration**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

6. **Set permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

7. **Start queue workers**
   ```bash
   php artisan queue:work --daemon
   ```

8. **Schedule cron job**
   ```bash
   * * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
   ```

## Monitoring & Maintenance

- Monitor error logs: `storage/logs/laravel.log`
- Check queue status: `php artisan queue:monitor`
- Clear caches: `php artisan cache:clear`
- Monitor performance: Use APM tools (New Relic, Datadog)
- Database backups: Schedule daily backups
- Update dependencies: `composer update` (test in staging first)
