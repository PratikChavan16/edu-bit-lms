/**
 * Export Utilities for Analytics Data
 * Handles CSV, Excel, and PDF exports
 */

import { ChartDataPoint } from '@/components/ui/Charts'

// ============================================================================
// CSV Export
// ============================================================================

/**
 * Convert data to CSV format
 */
export function dataToCSV(
  data: any[],
  columns: { key: string; label: string }[]
): string {
  const headers = columns.map((col) => col.label).join(',')
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = item[col.key]
        // Escape values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      })
      .join(',')
  )
  return [headers, ...rows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string = 'export.csv'): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export analytics data as CSV
 */
export function exportAnalyticsAsCSV(
  data: any,
  filename: string = 'analytics-export.csv'
): void {
  // Flatten overview stats
  const overview = data.overview
  const overviewData = [
    { metric: 'Total Universities', value: overview.total_universities },
    { metric: 'Active Universities', value: overview.active_universities },
    { metric: 'Total Colleges', value: overview.total_colleges },
    { metric: 'Active Colleges', value: overview.active_colleges },
    { metric: 'Total Users', value: overview.total_users },
    { metric: 'Active Users', value: overview.active_users },
  ]

  const csv = dataToCSV(overviewData, [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' },
  ])

  downloadCSV(csv, filename)
}

/**
 * Export universities data as CSV
 */
export function exportUniversitiesAsCSV(
  universities: any[],
  filename: string = 'universities.csv'
): void {
  const csv = dataToCSV(universities, [
    { key: 'name', label: 'University Name' },
    { key: 'domain', label: 'Domain' },
    { key: 'status', label: 'Status' },
    { key: 'colleges_count', label: 'Colleges' },
    { key: 'users_count', label: 'Users' },
    { key: 'storage_used_gb', label: 'Storage Used (GB)' },
    { key: 'storage_quota_gb', label: 'Storage Quota (GB)' },
    { key: 'established_year', label: 'Established' },
  ])

  downloadCSV(csv, filename)
}

// ============================================================================
// Excel Export (via browser - simple TSV format)
// ============================================================================

/**
 * Download data as Excel-compatible file (TSV)
 */
export function downloadAsExcel(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string = 'export.xlsx'
): void {
  // Create tab-separated values (TSV) which Excel can open
  const headers = columns.map((col) => col.label).join('\t')
  const rows = data.map((item) =>
    columns.map((col) => item[col.key] ?? '').join('\t')
  )
  const tsv = [headers, ...rows].join('\n')

  const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export analytics as Excel
 */
export function exportAnalyticsAsExcel(
  data: any,
  filename: string = 'analytics-export.xlsx'
): void {
  const overview = data.overview
  const overviewData = [
    { metric: 'Total Universities', value: overview.total_universities },
    { metric: 'Active Universities', value: overview.active_universities },
    { metric: 'Total Colleges', value: overview.total_colleges },
    { metric: 'Active Colleges', value: overview.active_colleges },
    { metric: 'Total Users', value: overview.total_users },
    { metric: 'Active Users', value: overview.active_users },
  ]

  downloadAsExcel(
    overviewData,
    [
      { key: 'metric', label: 'Metric' },
      { key: 'value', label: 'Value' },
    ],
    filename
  )
}

// ============================================================================
// JSON Export
// ============================================================================

/**
 * Download data as JSON
 */
export function downloadAsJSON(data: any, filename: string = 'export.json'): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// ============================================================================
// Print / PDF Export
// ============================================================================

/**
 * Prepare data for print (triggers browser print dialog which can save as PDF)
 */
export function printAnalytics(data: any): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Analytics Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #1f2937;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
          }
          h2 {
            color: #374151;
            margin-top: 30px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            border: 1px solid #e5e7eb;
            font-weight: 600;
          }
          td {
            padding: 10px;
            border: 1px solid #e5e7eb;
          }
          .metric {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            margin: 5px 0;
            background-color: #f9fafb;
            border-left: 3px solid #3b82f6;
          }
          .metric-label {
            font-weight: 500;
          }
          .metric-value {
            font-weight: 700;
            color: #3b82f6;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>God Mode Analytics Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        
        <h2>Platform Overview</h2>
        <div class="metric">
          <span class="metric-label">Total Universities:</span>
          <span class="metric-value">${data.overview.total_universities}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Active Universities:</span>
          <span class="metric-value">${data.overview.active_universities}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total Colleges:</span>
          <span class="metric-value">${data.overview.total_colleges}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Active Colleges:</span>
          <span class="metric-value">${data.overview.active_colleges}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total Users:</span>
          <span class="metric-value">${data.overview.total_users}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Active Users:</span>
          <span class="metric-value">${data.overview.active_users}</span>
        </div>

        <h2>Storage</h2>
        <div class="metric">
          <span class="metric-label">Total Quota:</span>
          <span class="metric-value">${data.storage.total_quota_gb} GB</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total Used:</span>
          <span class="metric-value">${data.storage.total_used_gb.toFixed(1)} GB</span>
        </div>
        <div class="metric">
          <span class="metric-label">Usage:</span>
          <span class="metric-value">${data.storage.usage_percent.toFixed(1)}%</span>
        </div>

        <h2>Top Universities by Colleges</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>University</th>
              <th>Colleges</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            ${data.universities.top_by_colleges
              .map(
                (uni: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${uni.name}</td>
                <td>${uni.colleges_count}</td>
                <td>${uni.users_count}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <h2>Top Universities by Users</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>University</th>
              <th>Users</th>
              <th>Colleges</th>
            </tr>
          </thead>
          <tbody>
            ${data.universities.top_by_users
              .map(
                (uni: any, idx: number) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${uni.name}</td>
                <td>${uni.users_count}</td>
                <td>${uni.colleges_count}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        ${
          data.universities.storage_critical.length > 0
            ? `
        <h2>Storage Alerts</h2>
        <table>
          <thead>
            <tr>
              <th>University</th>
              <th>Used (GB)</th>
              <th>Quota (GB)</th>
              <th>Usage %</th>
            </tr>
          </thead>
          <tbody>
            ${data.universities.storage_critical
              .map(
                (uni: any) => `
              <tr>
                <td>${uni.name}</td>
                <td>${uni.storage_used_gb.toFixed(1)}</td>
                <td>${uni.storage_quota_gb}</td>
                <td>${uni.usage_percent.toFixed(1)}%</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        `
            : ''
        }
      </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
  
  // Wait for content to load before printing
  printWindow.onload = () => {
    printWindow.print()
  }
}

// ============================================================================
// Export Chart Data
// ============================================================================

/**
 * Export chart data as CSV
 */
export function exportChartAsCSV(
  data: ChartDataPoint[],
  filename: string = 'chart-data.csv'
): void {
  if (data.length === 0) return

  const keys = Object.keys(data[0])
  const csv = dataToCSV(
    data,
    keys.map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }))
  )

  downloadCSV(csv, filename)
}
