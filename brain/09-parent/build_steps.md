# Parent Portal - Build & Deployment Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Deployment Target**: Production (parent.institution.edu)

---

## 1. Prerequisites

### Development Tools
```bash
# Required
Node.js: v20.x LTS
PHP: 8.3+
Composer: 2.x
PostgreSQL: 16+
Redis: 7.x

# Mobile Development
React Native CLI: 0.73+
Xcode: 15+ (iOS)
Android Studio: Hedgehog+ (Android)
CocoaPods: 1.14+
```

### Environment Setup
```bash
# Install Node.js (Windows)
winget install OpenJS.NodeJS.LTS

# Install PHP (via Laragon or XAMPP)
# Download from: https://laragon.org/

# Install Composer
# Download from: https://getcomposer.org/

# Install PostgreSQL
winget install PostgreSQL.PostgreSQL

# Install Redis (Windows)
# Download from: https://github.com/microsoftarchive/redis/releases
```

---

## 2. Backend Setup (Laravel)

### Clone Repository
```bash
cd d:\LMS\edu-bit-lms
git checkout V.0.1
```

### Install Dependencies
```bash
cd backend/parent-service
composer install
```

### Environment Configuration
```bash
# Copy environment file
cp .env.example .env
```

**`.env` Configuration**:
```env
APP_NAME="Parent Portal"
APP_ENV=production
APP_KEY=base64:GENERATE_WITH_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://parent.institution.edu

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=edu_bit_lms
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_CLIENT=phpredis

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_TTL=120  # 2 hours
JWT_REFRESH_TTL=129600  # 90 days

# SMS Gateway (for OTP)
SMS_GATEWAY=twilio
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
PHONEPE_MERCHANT_ID=M123456789
PHONEPE_SALT_KEY=your_phonepe_salt_key

# Webhook Secrets
FEE_MANAGEMENT_WEBHOOK_SECRET=your_webhook_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# CORS
CORS_ALLOWED_ORIGINS=https://parent.institution.edu,https://parent-mobile.institution.edu

# External APIs
STUDENT_PORTAL_API=https://student.institution.edu/api/v1
FACULTY_PORTAL_API=https://faculty.institution.edu/api/v1
FEE_MANAGEMENT_API=https://fees.institution.edu/api/v1
```

### Generate Application Key
```bash
php artisan key:generate
```

### Database Migration & Seeding
```bash
# Run migrations
php artisan migrate

# Seed initial data
php artisan db:seed --class=ParentPortalSeeder

# Create RLS policies (custom command)
php artisan db:create-rls-policies
```

**RLS Policies** (Row-Level Security):
```sql
-- Policy: Parents can only access their linked children's data
CREATE POLICY parent_attendance_access ON attendance
  USING (student_id IN (
    SELECT student_id FROM parent_children
    WHERE parent_id = current_setting('app.current_parent_id')::uuid
  ));

CREATE POLICY parent_grades_access ON grades
  USING (student_id IN (
    SELECT student_id FROM parent_children
    WHERE parent_id = current_setting('app.current_parent_id')::uuid
    AND permissions @> '{"view_grades": true}'
  ));
```

### Start Backend Server
```bash
# Development
php artisan serve --port=8009

# Production (use Supervisor)
# See Section 6 for Supervisor config
```

---

## 3. Frontend Web Setup (Next.js)

### Install Dependencies
```bash
cd frontend/parent-portal
npm install
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.institution.edu/parent
NEXT_PUBLIC_WS_URL=wss://api.institution.edu/parent/ws
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
NEXT_PUBLIC_FCM_VAPID_KEY=your_fcm_vapid_key
```

### Build for Production
```bash
# Build optimized production bundle
npm run build

# Output: .next/ directory
```

### Test Production Build Locally
```bash
npm run start
# Access: http://localhost:3009
```

---

## 4. Mobile App Setup (React Native)

### Install Dependencies
```bash
cd mobile/parent-app
npm install
```

### iOS Setup
```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

**iOS Configuration**:
```ruby
# ios/Podfile
platform :ios, '13.0'

target 'ParentApp' do
  config = use_native_modules!
  use_react_native!(:path => config[:reactNativePath])
  
  # Firebase
  pod 'Firebase/Messaging'
  pod 'Firebase/Analytics'
  
  # Biometric
  pod 'RNBiometrics', :path => '../node_modules/react-native-biometrics'
end
```

**Info.plist Configuration**:
```xml
<key>NSFaceIDUsageDescription</key>
<string>Use Face ID to quickly login to your account</string>

<key>NSCameraUsageDescription</key>
<string>Upload documents for child linking verification</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Select photos for profile picture</string>
```

### Android Setup

**Android Configuration**:
```gradle
// android/app/build.gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "edu.institution.parent"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 10
        versionName "2.0.0"
        
        // Biometric
        missingDimensionStrategy 'react-native-camera', 'general'
    }
    
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.4.0'
    implementation 'androidx.biometric:biometric:1.1.0'
}
```

**AndroidManifest.xml**:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<application>
  <service
    android:name=".fcm.FCMService"
    android:exported="false">
    <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
  </service>
</application>
```

### Environment Configuration (Mobile)
```javascript
// .env
API_URL=https://api.institution.edu/parent
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
FCM_SENDER_ID=123456789012
SENTRY_DSN=https://your-sentry-dsn
```

---

## 5. Push Notification Setup (Firebase Cloud Messaging)

### Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create project: "EduBit Parent Portal"
3. Add iOS app: `edu.institution.parent`
4. Add Android app: `edu.institution.parent`
5. Download configuration files:
   - iOS: `GoogleService-Info.plist` → `ios/ParentApp/`
   - Android: `google-services.json` → `android/app/`

### iOS APNs Certificate Setup
```bash
# Generate CSR in Keychain Access
# Upload to Apple Developer Portal
# Download .p8 key file
# Upload to Firebase Console (Cloud Messaging → APNs)
```

### Web Push Setup (Frontend)
```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "your_api_key",
  projectId: "edubit-parent-portal",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

---

## 6. Build & Deploy

### Backend Deployment (Laravel on Ubuntu Server)

#### Supervisor Configuration
```ini
# /etc/supervisor/conf.d/parent-portal-worker.conf
[program:parent-portal-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/parent-portal/artisan queue:work redis --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/parent-portal/storage/logs/worker.log
```

```bash
# Start Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start parent-portal-worker:*
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name parent.institution.edu;
    
    ssl_certificate /etc/letsencrypt/live/parent.institution.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/parent.institution.edu/privkey.pem;
    
    root /var/www/parent-portal/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

### Frontend Deployment (Next.js on Vercel)

#### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.institution.edu/parent",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID": "@razorpay_key_id"
  }
}
```

#### Deploy Command
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

### Mobile App Deployment

#### iOS Build (Fastlane)
```ruby
# ios/fastlane/Fastfile
lane :release do
  increment_build_number
  build_app(
    scheme: "ParentApp",
    export_method: "app-store"
  )
  upload_to_app_store(
    skip_metadata: true,
    skip_screenshots: true
  )
end
```

**Build & Upload**:
```bash
cd ios
fastlane release
```

#### Android Build (Fastlane)
```ruby
# android/fastlane/Fastfile
lane :release do
  gradle(task: "clean assembleRelease")
  upload_to_play_store(
    track: 'production',
    aab: 'app/build/outputs/bundle/release/app-release.aab'
  )
end
```

**Build & Upload**:
```bash
cd android
fastlane release
```

---

## 7. CI/CD Pipeline (GitHub Actions)

### Backend Pipeline
```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - 'backend/parent-service/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      
      - name: Install Dependencies
        run: composer install --no-dev --optimize-autoloader
        working-directory: backend/parent-service
      
      - name: Run Tests
        run: php artisan test
        working-directory: backend/parent-service
      
      - name: Deploy to Production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/parent-portal
            git pull origin main
            composer install --no-dev
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo supervisorctl restart parent-portal-worker:*
```

### Frontend Pipeline
```yaml
# .github/workflows/frontend-deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths:
      - 'frontend/parent-portal/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
        working-directory: frontend/parent-portal
      
      - name: Run Tests
        run: npm test
        working-directory: frontend/parent-portal
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Mobile App Pipeline
```yaml
# .github/workflows/mobile-build.yml
name: Build Mobile App
on:
  push:
    branches: [main]
    paths:
      - 'mobile/parent-app/**'

jobs:
  ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: |
          npm ci
          cd ios && pod install
        working-directory: mobile/parent-app
      
      - name: Build iOS
        run: |
          cd ios
          fastlane release
        working-directory: mobile/parent-app
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APP_STORE_CONNECT_PASSWORD }}

  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
        working-directory: mobile/parent-app
      
      - name: Build Android
        run: |
          cd android
          fastlane release
        working-directory: mobile/parent-app
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
```

---

## 8. Health Checks & Monitoring

### Health Check Endpoint
```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'redis' => Redis::ping() === '+PONG' ? 'connected' : 'disconnected',
        'version' => '2.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});
```

### Monitoring (Sentry)
```bash
# Install Sentry SDK
composer require sentry/sentry-laravel
npm install --save @sentry/nextjs
npm install --save @sentry/react-native
```

---

## 9. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (backend, frontend, mobile)
- [ ] Environment variables configured
- [ ] Database migrations reviewed
- [ ] API rate limits configured
- [ ] SSL certificates valid
- [ ] Firebase configuration files in place
- [ ] Payment gateway keys verified (test mode OFF)

### Post-Deployment
- [ ] Health check endpoint returning 200
- [ ] Database RLS policies active
- [ ] Push notifications delivering successfully
- [ ] Payment flow tested (small test transaction)
- [ ] Mobile app approved (App Store/Play Store)
- [ ] Monitoring active (Sentry, logs)
- [ ] Rollback plan documented

---

## 10. Rollback Procedure

### Backend Rollback
```bash
# SSH into server
ssh user@parent.institution.edu

# Rollback to previous commit
cd /var/www/parent-portal
git reset --hard HEAD~1
composer install --no-dev
php artisan migrate:rollback
php artisan config:cache
sudo supervisorctl restart parent-portal-worker:*
```

### Frontend Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Mobile App Rollback
- **iOS**: Release previous version from App Store Connect
- **Android**: Rollback release in Play Console

---

**Build Status**: ✅ All Systems Operational  
**Last Deployment**: October 25, 2025, 11:00 AM  
**Next Scheduled Deployment**: October 30, 2025
