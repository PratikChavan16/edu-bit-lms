# =============================================================================
# BITFLOW LMS - INSTALLATION SCRIPT (Windows PowerShell)
# =============================================================================
# Run this script after installing Composer, Node.js, and PostgreSQL
# Last Updated: October 26, 2025
# =============================================================================

Write-Host "🚀 Bitflow LMS - Installation Script" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Composer
try {
    $composerVersion = composer --version 2>&1
    Write-Host "✅ Composer: $composerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Composer not found. Please install from: https://getcomposer.org/" -ForegroundColor Red
    exit 1
}

# Check PHP
try {
    $phpVersion = php -v 2>&1 | Select-Object -First 1
    Write-Host "✅ PHP: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PHP not found. Please install PHP 8.3+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
try {
    $psqlVersion = psql --version 2>&1
    Write-Host "✅ PostgreSQL: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL not found in PATH. Make sure it's installed." -ForegroundColor Yellow
}

Write-Host "`n" -ForegroundColor White

# =============================================================================
# BACKEND SETUP
# =============================================================================
Write-Host "🔧 Setting up Laravel Backend..." -ForegroundColor Yellow

cd backend

# Install Composer dependencies
Write-Host "📦 Installing Composer dependencies (this may take a few minutes)..." -ForegroundColor Cyan
composer install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Composer install failed!" -ForegroundColor Red
    exit 1
}

# Copy environment file
if (!(Test-Path ".env")) {
    Write-Host "📄 Creating .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
}

# Generate application key
Write-Host "🔑 Generating application key..." -ForegroundColor Cyan
php artisan key:generate

# Create storage directories
Write-Host "📁 Creating storage directories..." -ForegroundColor Cyan
if (!(Test-Path "storage\keys")) {
    New-Item -ItemType Directory -Path "storage\keys" -Force | Out-Null
}

# Generate JWT keys
Write-Host "🔐 Generating JWT RSA keys..." -ForegroundColor Cyan
if (!(Test-Path "storage\keys\private.pem")) {
    openssl genrsa -out storage\keys\private.pem 4096 2>&1 | Out-Null
    openssl rsa -in storage\keys\private.pem -pubout -out storage\keys\public.pem 2>&1 | Out-Null
    Write-Host "✅ JWT keys generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  JWT keys already exist, skipping..." -ForegroundColor Yellow
}

# Check database connection
Write-Host "`n📊 Checking database connection..." -ForegroundColor Cyan
$dbCheck = php artisan db:show 2>&1

if ($?) {
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
    
    # Run migrations
    Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
    php artisan migrate --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
        
        # Seed database
        Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
        php artisan db:seed --force
    }
} else {
    Write-Host "⚠️  Database connection failed. Please check your .env configuration." -ForegroundColor Yellow
    Write-Host "   Make sure PostgreSQL is running and database credentials are correct." -ForegroundColor Yellow
}

# Create storage link
Write-Host "🔗 Creating storage symlink..." -ForegroundColor Cyan
php artisan storage:link

Write-Host "`n✅ Backend setup complete!" -ForegroundColor Green

cd ..

# =============================================================================
# FRONTEND SETUP (Optional - if frontend exists)
# =============================================================================
if (Test-Path "frontend") {
    Write-Host "`n🎨 Setting up Next.js Frontend..." -ForegroundColor Yellow
    
    cd frontend
    
    # Check if pnpm is installed
    try {
        $pnpmVersion = pnpm --version 2>&1
        Write-Host "✅ pnpm: $pnpmVersion" -ForegroundColor Green
        
        # Install dependencies
        Write-Host "📦 Installing frontend dependencies (this may take 5-10 minutes)..." -ForegroundColor Cyan
        pnpm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  pnpm not found. Install with: npm install -g pnpm" -ForegroundColor Yellow
    }
    
    cd ..
}

# =============================================================================
# DOCKER SETUP (Optional)
# =============================================================================
Write-Host "`n🐳 Docker Setup" -ForegroundColor Yellow

try {
    $dockerVersion = docker --version 2>&1
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
    
    $choice = Read-Host "Do you want to start Docker containers? (y/n)"
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Write-Host "🚀 Starting Docker containers..." -ForegroundColor Cyan
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Docker containers started!" -ForegroundColor Green
            Write-Host "`n📊 Running containers:" -ForegroundColor Cyan
            docker-compose ps
        }
    }
} catch {
    Write-Host "⚠️  Docker not found. Install Docker Desktop for containerized development." -ForegroundColor Yellow
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host "`n" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Configure your .env file with correct database credentials" -ForegroundColor White
Write-Host "   2. Run: php artisan serve (in backend directory)" -ForegroundColor White
Write-Host "   3. Run: pnpm dev (in frontend directory, if exists)" -ForegroundColor White
Write-Host "   4. Access API: http://localhost:8000" -ForegroundColor White
Write-Host "   5. Access Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "`n" -ForegroundColor White

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - Setup Guide: .\SETUP_GUIDE.md" -ForegroundColor White
Write-Host "   - Progress Tracker: .\PROGRESS_WEEK1.md" -ForegroundColor White
Write-Host "   - Brain Folder: .\brain\" -ForegroundColor White
Write-Host "`n" -ForegroundColor White

Write-Host "✅ Happy Coding! 🚀" -ForegroundColor Green
