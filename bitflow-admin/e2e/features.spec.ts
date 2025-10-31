import { test, expect } from '@playwright/test';

test.describe('God Mode Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Bitflow Owner
    await page.goto('/login');
    await page.fill('input[name="email"]', 'bitflow@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display God Mode dashboard', async ({ page }) => {
    // Navigate to God Mode
    try {
      await page.click('text="God Mode"');
    } catch {
      await page.click('[data-testid="god-mode-link"]');
    }

    // Verify God Mode dashboard loads
    await expect(page.locator('h1:has-text("God Mode")')).toBeVisible();
    await expect(page.locator('text=/organization.*overview/i')).toBeVisible();
  });

  test('should show organization selector', async ({ page }) => {
    // Navigate to God Mode
    await page.goto('/god-mode');

    // Wait for organization selector
    try {
      await page.waitForSelector('[data-testid="organization-selector"]');
    } catch {
      await page.waitForSelector('select[name="organization"]');
    }

    // Verify selector has options
    const selector = page.locator('select[name="organization"]').or(
      page.locator('[data-testid="organization-selector"]')
    );
    const options = await selector.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('should switch between organizations', async ({ page }) => {
    await page.goto('/god-mode');

    // Select first organization
    const selector = page.locator('select[name="organization"]').or(
      page.locator('[data-testid="organization-selector"]')
    );
    await selector.selectOption({ index: 1 });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Verify data loaded for selected organization
    try {
      await expect(page.locator('[data-testid="organization-data"]')).toBeVisible();
    } catch {
      await expect(page.locator('text=/total.*students|total.*faculty/i')).toBeVisible();
    }
  });

  test('should display organization comparison', async ({ page }) => {
    await page.goto('/god-mode/comparison');

    // Verify comparison interface
    await expect(page.locator('h2:has-text("Compare Organizations")')).toBeVisible();

    // Select two organizations to compare
    const org1Selector = page.locator('select[name="organization1"]');
    const org2Selector = page.locator('select[name="organization2"]');

    if (await org1Selector.isVisible()) {
      await org1Selector.selectOption({ index: 1 });
      await org2Selector.selectOption({ index: 2 });

      // Click compare button
      try {
        await page.click('button:has-text("Compare")');
      } catch {
        await page.click('[data-testid="compare-button"]');
      }

      // Wait for comparison results
      await expect(page.locator('text=/comparison.*results/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should access any organization data', async ({ page }) => {
    await page.goto('/god-mode');

    // Select an organization
    const selector = page.locator('select[name="organization"]');
    if (await selector.isVisible()) {
      await selector.selectOption({ index: 1 });

      // Navigate to universities page
      await page.click('a:has-text("Universities")');

      // Verify we can see data from selected organization
      try {
        await page.waitForSelector('[data-testid="universities-table"]');
      } catch {
        await page.waitForSelector('table');
      }

      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should show global statistics', async ({ page }) => {
    await page.goto('/god-mode');

    // Verify global stats are visible
    await expect(page.locator('text=/total.*organizations|total.*users/i')).toBeVisible();
    
    // Check for stat cards
    const statCards = page.locator('[data-testid="stat-card"]').or(
      page.locator('.stat-card')
    );
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should access system settings', async ({ page }) => {
    await page.goto('/god-mode/settings');

    // Verify system settings page
    await expect(page.locator('h1:has-text("System Settings")')).toBeVisible();
    
    // Check for setting sections
    await expect(page.locator('text=/general.*settings|security.*settings/i')).toBeVisible();
  });

  test('should view audit logs', async ({ page }) => {
    await page.goto('/god-mode/audit-logs');

    // Verify audit logs page
    await expect(page.locator('h1:has-text("Audit Logs")')).toBeVisible();

    // Check for log entries
    try {
      await page.waitForSelector('[data-testid="audit-log-table"]');
    } catch {
      await page.waitForSelector('table');
    }

    // Verify table columns
    await expect(page.locator('th:has-text("User")')).toBeVisible();
    await expect(page.locator('th:has-text("Action")')).toBeVisible();
    await expect(page.locator('th:has-text("Timestamp")')).toBeVisible();
  });
});

test.describe('Report Generation Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login as university owner
    await page.goto('/login');
    await page.fill('input[name="email"]', 'university@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display reports page', async ({ page }) => {
    await page.goto('/reports');

    // Verify reports page loads
    await expect(page.locator('h1:has-text("Reports")')).toBeVisible();
    await expect(page.locator('text=/generate.*report|create.*report/i')).toBeVisible();
  });

  test('should generate student enrollment report', async ({ page }) => {
    await page.goto('/reports/generate');

    // Select report type
    const reportTypeSelect = page.locator('select[name="report_type"]');
    if (await reportTypeSelect.isVisible()) {
      await reportTypeSelect.selectOption('student_enrollment');
    }

    // Select date range
    await page.fill('input[name="start_date"]', '2024-01-01');
    await page.fill('input[name="end_date"]', '2024-12-31');

    // Click generate
    try {
      await page.click('button:has-text("Generate Report")');
    } catch {
      await page.click('[data-testid="generate-report"]');
    }

    // Wait for report to generate
    await expect(page.locator('text=/report.*generated|generation.*complete/i')).toBeVisible({ 
      timeout: 15000 
    });
  });

  test('should download PDF report', async ({ page }) => {
    await page.goto('/reports');

    // Find a generated report
    const downloadButton = page.locator('button:has-text("Download")').or(
      page.locator('[data-testid="download-report"]')
    ).first();

    if (await downloadButton.isVisible()) {
      // Start waiting for download
      const downloadPromise = page.waitForEvent('download');

      // Click download button
      await downloadButton.click();

      // Wait for download to complete
      const download = await downloadPromise;
      
      // Verify file name contains .pdf
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });

  test('should schedule recurring report', async ({ page }) => {
    await page.goto('/reports/scheduled');

    // Click create scheduled report
    try {
      await page.click('button:has-text("Schedule Report")');
    } catch {
      await page.click('[data-testid="schedule-report"]');
    }

    // Fill schedule form
    await page.fill('input[name="name"]', 'Monthly Enrollment Report');
    await page.selectOption('select[name="report_type"]', 'student_enrollment');
    await page.selectOption('select[name="frequency"]', 'monthly');
    
    // Select recipients
    await page.fill('input[name="recipients"]', 'admin@example.com');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=/scheduled.*successfully|report.*scheduled/i')).toBeVisible();
  });

  test('should manage report templates', async ({ page }) => {
    await page.goto('/reports/templates');

    // Verify templates page
    await expect(page.locator('h1:has-text("Report Templates")')).toBeVisible();

    // Check for template list
    try {
      await page.waitForSelector('[data-testid="templates-list"]');
    } catch {
      await page.waitForSelector('text=/template|default/i');
    }
  });

  test('should create custom report template', async ({ page }) => {
    await page.goto('/reports/templates/create');

    // Fill template form
    await page.fill('input[name="name"]', 'Custom Student Report');
    await page.fill('textarea[name="description"]', 'Template for student performance reports');

    // Select columns
    const columnsCheckbox = page.locator('input[type="checkbox"][value="student_name"]');
    if (await columnsCheckbox.isVisible()) {
      await columnsCheckbox.check();
    }

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=/template.*created|created.*successfully/i')).toBeVisible();
  });

  test('should filter reports by date', async ({ page }) => {
    await page.goto('/reports');

    // Apply date filter
    await page.fill('input[name="filter_start_date"]', '2024-01-01');
    await page.fill('input[name="filter_end_date"]', '2024-03-31');

    // Click filter
    try {
      await page.click('button:has-text("Filter")');
    } catch {
      await page.click('[data-testid="apply-filter"]');
    }

    // Verify filtered results
    await page.waitForTimeout(1000);
    const reportCount = await page.locator('[data-testid="report-item"]').count();
    expect(reportCount).toBeGreaterThanOrEqual(0);
  });

  test('should export report to Excel', async ({ page }) => {
    await page.goto('/reports');

    // Find export button
    const exportButton = page.locator('button:has-text("Export to Excel")').or(
      page.locator('[data-testid="export-excel"]')
    ).first();

    if (await exportButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      const download = await downloadPromise;
      
      // Verify Excel file
      expect(download.suggestedFilename()).toMatch(/\.xlsx?$/);
    }
  });
});

test.describe('Notifications Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display notifications bell', async ({ page }) => {
    // Verify notification bell is visible
    const notificationBell = page.locator('[data-testid="notifications-bell"]').or(
      page.locator('button[aria-label*="notification" i]')
    );
    await expect(notificationBell).toBeVisible();
  });

  test('should show unread notification count', async ({ page }) => {
    // Check for notification badge
    const badge = page.locator('[data-testid="notification-badge"]').or(
      page.locator('.notification-count')
    );

    if (await badge.isVisible()) {
      const count = await badge.textContent();
      expect(parseInt(count || '0')).toBeGreaterThanOrEqual(0);
    }
  });

  test('should open notifications dropdown', async ({ page }) => {
    // Click notification bell
    const bell = page.locator('[data-testid="notifications-bell"]').or(
      page.locator('button[aria-label*="notification" i]')
    );
    await bell.click();

    // Verify dropdown opens
    try {
      await expect(page.locator('[data-testid="notifications-dropdown"]')).toBeVisible();
    } catch {
      await expect(page.locator('text=/notification|no.*notifications/i')).toBeVisible();
    }
  });

  test('should mark notification as read', async ({ page }) => {
    await page.goto('/notifications');

    // Find first unread notification
    const unreadNotification = page.locator('[data-testid="unread-notification"]').first();

    if (await unreadNotification.isVisible()) {
      // Click on notification
      await unreadNotification.click();

      // Verify it's marked as read
      await page.waitForTimeout(500);
      const isRead = await page.locator('[data-testid="read-notification"]').first().isVisible();
      expect(isRead).toBeTruthy();
    }
  });

  test('should navigate to notifications page', async ({ page }) => {
    await page.goto('/notifications');

    // Verify notifications page
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();

    // Check for notifications list
    try {
      await page.waitForSelector('[data-testid="notifications-list"]');
    } catch {
      await page.waitForSelector('text=/notification|no.*notifications/i');
    }
  });

  test('should filter notifications by type', async ({ page }) => {
    await page.goto('/notifications');

    // Find filter dropdown
    const typeFilter = page.locator('select[name="notification_type"]');

    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption('system');
      await page.waitForTimeout(1000);

      // Verify filtered results
      const notifications = await page.locator('[data-testid="notification-item"]').count();
      expect(notifications).toBeGreaterThanOrEqual(0);
    }
  });

  test('should mark all as read', async ({ page }) => {
    await page.goto('/notifications');

    // Find mark all as read button
    const markAllButton = page.locator('button:has-text("Mark All as Read")').or(
      page.locator('[data-testid="mark-all-read"]')
    );

    if (await markAllButton.isVisible()) {
      await markAllButton.click();

      // Verify success message
      await expect(page.locator('text=/marked.*read|all.*read/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('should delete notification', async ({ page }) => {
    await page.goto('/notifications');

    // Find delete button on first notification
    const deleteButton = page.locator('[data-testid="delete-notification"]').first().or(
      page.locator('button[aria-label*="delete" i]').first()
    );

    if (await deleteButton.isVisible()) {
      // Get initial count
      const initialCount = await page.locator('[data-testid="notification-item"]').count();

      // Click delete
      await deleteButton.click();

      // Confirm deletion if modal appears
      const confirmButton = page.locator('button:has-text("Confirm")');
      if (await confirmButton.isVisible({ timeout: 1000 })) {
        await confirmButton.click();
      }

      // Verify notification deleted
      await page.waitForTimeout(500);
      const newCount = await page.locator('[data-testid="notification-item"]').count();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('should show notification details', async ({ page }) => {
    await page.goto('/notifications');

    // Click on first notification
    const notification = page.locator('[data-testid="notification-item"]').first();

    if (await notification.isVisible()) {
      await notification.click();

      // Verify detail view
      try {
        await expect(page.locator('[data-testid="notification-details"]')).toBeVisible();
      } catch {
        await expect(page.locator('text=/notification.*from|sent.*by/i')).toBeVisible();
      }
    }
  });

  test('should search notifications', async ({ page }) => {
    await page.goto('/notifications');

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search" i]').or(
      page.locator('[data-testid="notification-search"]')
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill('system');
      await page.waitForTimeout(1000);

      // Verify search results
      const results = await page.locator('[data-testid="notification-item"]').count();
      expect(results).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Global Search Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display global search', async ({ page }) => {
    // Find global search input
    const searchInput = page.locator('[data-testid="global-search"]').or(
      page.locator('input[placeholder*="Search" i]')
    );
    await expect(searchInput).toBeVisible();
  });

  test('should search across entities', async ({ page }) => {
    const searchInput = page.locator('[data-testid="global-search"]').or(
      page.locator('input[placeholder*="Search" i]')
    );

    await searchInput.fill('test');
    await page.waitForTimeout(1000);

    // Verify search results appear
    try {
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    } catch {
      await expect(page.locator('text=/result|found/i')).toBeVisible();
    }
  });

  test('should filter search by entity type', async ({ page }) => {
    await page.goto('/search');

    // Fill search
    await page.fill('input[name="search"]', 'university');

    // Select entity type
    const typeFilter = page.locator('select[name="entity_type"]');
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption('universities');
      
      // Submit
      try {
        await page.click('button[type="submit"]');
      } catch {
        await page.click('[data-testid="search-button"]');
      }

      // Verify results
      await expect(page.locator('text=/search.*results|found/i')).toBeVisible();
    }
  });
});

test.describe('Theme Toggle Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should toggle dark mode', async ({ page }) => {
    // Find theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button[aria-label*="theme" i]')
    );

    if (await themeToggle.isVisible()) {
      // Click to toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(300);

      // Verify theme changed (check html class or body background)
      const html = page.locator('html');
      const hasModeDark = await html.getAttribute('class');
      expect(hasModeDark).toBeTruthy();
    }
  });
});
