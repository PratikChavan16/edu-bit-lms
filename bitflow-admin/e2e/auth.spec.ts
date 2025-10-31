import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * 
 * Tests the complete authentication flow including:
 * - Login with valid credentials
 * - Login with invalid credentials
 * - Logout
 * - Session persistence across page refresh
 */

test.describe('Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in login form
    await page.fill('input[name="email"]', 'admin@bitflow.app');
    await page.fill('input[name="password"]', 'password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify dashboard loaded
    await expect(page).toHaveTitle(/Dashboard/i);
    
    // Verify user is authenticated (check for logout button or user menu)
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in login form with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    const errorMessage = page.locator('[data-testid="error-message"]').or(page.locator('text=/invalid credentials/i'));
    await expect(errorMessage).toBeVisible();
    
    // Verify still on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    const emailError = page.locator('text=/email.*required/i').or(page.locator('[data-testid="email-error"]'));
    const passwordError = page.locator('text=/password.*required/i').or(page.locator('[data-testid="password-error"]'));
    
    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.fill('input[name="email"]', 'admin@bitflow.app');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Click user menu
    await page.click('[data-testid="user-menu"]');
    
    // Click logout button
    const logoutButton = page.locator('button:has-text("Logout")').or(page.locator('[data-testid="logout-button"]'));
    await logoutButton.click();
    
    // Wait for redirect to login
    await page.waitForURL('/login');
    
    // Verify on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should persist session across page refresh', async ({ page, context }) => {
    // Login
    await page.fill('input[name="email"]', 'admin@bitflow.app');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Refresh the page
    await page.reload();
    
    // Verify still on dashboard (not redirected to login)
    await expect(page).toHaveURL(/dashboard/);
    
    // Verify user menu still visible
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access protected route directly
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await page.waitForURL('/login');
    await expect(page).toHaveURL(/login/);
  });

  test('should handle session expiration gracefully', async ({ page, context }) => {
    // Login
    await page.fill('input[name="email"]', 'admin@bitflow.app');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Clear cookies to simulate session expiration
    await context.clearCookies();
    
    // Try to navigate to another page
    await page.goto('/universities');
    
    // Should be redirected to login
    await page.waitForURL('/login');
    await expect(page).toHaveURL(/login/);
  });

  test('should prevent access to login page when already authenticated', async ({ page }) => {
    // Login
    await page.fill('input[name="email"]', 'admin@bitflow.app');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Try to access login page
    await page.goto('/login');
    
    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL(/dashboard/);
  });

});
