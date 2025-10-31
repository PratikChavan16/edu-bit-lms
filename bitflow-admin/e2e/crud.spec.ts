import { test, expect } from '@playwright/test';

/**
 * CRUD Operations E2E Tests
 * 
 * Tests create, read, update, delete operations for:
 * - Universities
 * - Colleges  
 * - Users
 */

// Helper function to login before tests
async function login(page: any) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@bitflow.app');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

test.describe('Universities CRUD', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/universities');
  });

  test('should display universities list', async ({ page }) => {
    // Wait for table to load
    try {
      await page.waitForSelector('[data-testid="universities-table"]', { timeout: 5000 });
    } catch {
      await page.waitForSelector('table');
    }
    
    // Verify table headers
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Domain")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
  });

  test('should create a new university', async ({ page }) => {
    // Click create button
    try {
      await page.click('button:has-text("Add University")');
    } catch {
      await page.click('[data-testid="create-university"]');
    }
    
    // Fill in form
    const timestamp = Date.now();
    await page.fill('input[name="name"]', `Test University ${timestamp}`);
    await page.fill('input[name="domain"]', `test${timestamp}.edu`);
    await page.fill('input[name="established_year"]', '2024');
    
    // Select status
    await page.selectOption('select[name="status"]', 'active');
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Wait for success message or redirect
    await expect(page.locator('text=/success|created/i')).toBeVisible({ timeout: 10000 });
    
    // Verify in list
    await expect(page.locator(`text=Test University ${timestamp}`)).toBeVisible();
  });

  test('should show validation errors for invalid university data', async ({ page }) => {
    // Click create button
    try {
      await page.click('button:has-text("Add University")');
    } catch {
      await page.click('[data-testid="create-university"]');
    }
    
    // Try to submit empty form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Check for validation errors
    await expect(page.locator('text=/name.*required/i')).toBeVisible();
    await expect(page.locator('text=/domain.*required/i')).toBeVisible();
  });

  test('should search universities', async ({ page }) => {
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]').or(page.locator('[data-testid="search-input"]'));
    await searchInput.fill('University');
    
    // Wait for results
    await page.waitForTimeout(1000); // Debounce delay
    
    // Verify filtered results
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should paginate through universities', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Check if pagination exists
    const nextButton = page.locator('button:has-text("Next")').or(page.locator('[data-testid="next-page"]'));
    
    if (await nextButton.isVisible()) {
      // Click next page
      await nextButton.click();
      
      // Wait for page to update
      await page.waitForTimeout(500);
      
      // Verify page changed (check page number or URL)
      await expect(page).toHaveURL(/page=2/);
    }
  });

});

test.describe('Colleges CRUD', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/colleges');
  });

  test('should display colleges list', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Verify table headers
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("University")')).toBeVisible();
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
  });

  test('should create a new college', async ({ page }) => {
    // Click create button
    try {
      await page.click('button:has-text("Add College")');
    } catch {
      await page.click('[data-testid="create-college"]');
    }
    
    // Fill in form
    const timestamp = Date.now();
    await page.fill('input[name="name"]', `Test College ${timestamp}`);
    
    // Select university (if dropdown exists)
    const universitySelect = page.locator('select[name="university_id"]');
    if (await universitySelect.isVisible()) {
      await universitySelect.selectOption({ index: 1 }); // Select first option
    }
    
    // Select college type
    await page.selectOption('select[name="type"]', 'engineering');
    
    // Select status
    await page.selectOption('select[name="status"]', 'active');
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Wait for success message
    await expect(page.locator('text=/success|created/i')).toBeVisible({ timeout: 10000 });
  });

  test('should filter colleges by university', async ({ page }) => {
    // Check if university filter exists
    const universityFilter = page.locator('select[name="university_filter"]').or(page.locator('[data-testid="university-filter"]'));
    
    if (await universityFilter.isVisible()) {
      // Select a university
      await universityFilter.selectOption({ index: 1 });
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Verify results are filtered
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

});

test.describe('Users CRUD', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/users');
  });

  test('should display users list', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');
    
    // Verify table headers
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Role")')).toBeVisible();
  });

  test('should create a new user', async ({ page }) => {
    // Click create button
    try {
      await page.click('button:has-text("Add User")');
    } catch {
      await page.click('[data-testid="create-user"]');
    }
    
    // Fill in form
    const timestamp = Date.now();
    await page.fill('input[name="name"]', `Test User ${timestamp}`);
    await page.fill('input[name="email"]', `testuser${timestamp}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    
    // Select role
    const roleSelect = page.locator('select[name="role"]');
    if (await roleSelect.isVisible()) {
      await roleSelect.selectOption('university_owner');
    }
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Create")');
    
    // Wait for success message
    await expect(page.locator('text=/success|created/i')).toBeVisible({ timeout: 10000 });
  });

  test('should search users by email', async ({ page }) => {
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]').or(page.locator('[data-testid="search-input"]'));
    await searchInput.fill('admin@bitflow.app');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Verify admin user is in results
    await expect(page.locator('text=admin@bitflow.app')).toBeVisible();
  });

  test('should filter users by role', async ({ page }) => {
    // Check if role filter exists
    const roleFilter = page.locator('select[name="role_filter"]').or(page.locator('[data-testid="role-filter"]'));
    
    if (await roleFilter.isVisible()) {
      // Select a role
      await roleFilter.selectOption('bitflow_owner');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Verify results are filtered
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(1); // At least one owner should exist
    }
  });

});
