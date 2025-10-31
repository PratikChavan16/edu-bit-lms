# Testing Infrastructure Setup Script
# Run this to install all testing dependencies

Write-Host "Installing testing dependencies..." -ForegroundColor Green

# Unit testing dependencies
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom

# Testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Mock Service Worker for API mocking
npm install --save-dev msw

# Playwright for E2E testing
npm install --save-dev @playwright/test

# Additional utilities
npm install --save-dev @types/node

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run 'npm test' for unit tests" -ForegroundColor Cyan
Write-Host "2. Run 'npm run test:e2e' for E2E tests" -ForegroundColor Cyan
Write-Host "3. Run 'npm run test:coverage' for coverage report" -ForegroundColor Cyan
Write-Host "4. Run 'npx playwright install' to install browsers" -ForegroundColor Cyan
