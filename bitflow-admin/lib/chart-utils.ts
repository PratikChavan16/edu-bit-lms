/**
 * Chart Utilities
 * Helper functions for formatting and transforming data for charts
 */

import { ChartDataPoint } from '@/components/ui/Charts'

// ============================================================================
// Formatters
// ============================================================================

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString()
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Format date for chart axis
 */
export function formatChartDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    case 'long':
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    default:
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}

// ============================================================================
// Data Transformers
// ============================================================================

/**
 * Transform key-value object to chart data points
 */
export function objectToChartData(obj: Record<string, number>): ChartDataPoint[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value,
  }))
}

/**
 * Group data by time period (day, week, month)
 */
export function groupByTimePeriod<T extends { created_at?: string }>(
  data: T[],
  period: 'day' | 'week' | 'month' = 'month',
  valueKey?: keyof T
): ChartDataPoint[] {
  const grouped: Record<string, number> = {}

  data.forEach((item) => {
    if (!item.created_at) return

    const date = new Date(item.created_at)
    let key: string

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - date.getDay())
        key = startOfWeek.toISOString().split('T')[0]
        break
      case 'month':
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
    }

    if (!grouped[key]) grouped[key] = 0
    
    if (valueKey && typeof item[valueKey] === 'number') {
      grouped[key] += item[valueKey] as number
    } else {
      grouped[key] += 1
    }
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({
      name: formatChartDate(name, 'medium'),
      value,
    }))
}

/**
 * Calculate trend data (growth/decline over time)
 */
export function calculateTrend(data: ChartDataPoint[]): {
  data: ChartDataPoint[]
  trend: 'up' | 'down' | 'stable'
  change: number
  changePercent: number
} {
  if (data.length < 2) {
    return { data, trend: 'stable', change: 0, changePercent: 0 }
  }

  const first = data[0].value
  const last = data[data.length - 1].value
  const change = last - first
  const changePercent = first !== 0 ? (change / first) * 100 : 0

  const trend = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable'

  return {
    data,
    trend,
    change,
    changePercent,
  }
}

/**
 * Get top N items from data
 */
export function getTopN(data: ChartDataPoint[], n: number = 5): ChartDataPoint[] {
  return [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, n)
}

/**
 * Calculate cumulative values
 */
export function calculateCumulative(data: ChartDataPoint[]): ChartDataPoint[] {
  let cumulative = 0
  return data.map((item) => {
    cumulative += item.value
    return {
      ...item,
      cumulative,
    }
  })
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: ChartDataPoint[],
  window: number = 3
): ChartDataPoint[] {
  return data.map((item, index) => {
    const start = Math.max(0, index - Math.floor(window / 2))
    const end = Math.min(data.length, index + Math.ceil(window / 2))
    const slice = data.slice(start, end)
    const average = slice.reduce((sum, d) => sum + d.value, 0) / slice.length

    return {
      ...item,
      movingAverage: Math.round(average),
    }
  })
}

// ============================================================================
// Chart Color Utilities
// ============================================================================

/**
 * Get color based on value (red for low, yellow for medium, green for high)
 */
export function getColorByValue(
  value: number,
  thresholds: { low: number; medium: number; high: number }
): string {
  if (value >= thresholds.high) return '#10B981' // green-500
  if (value >= thresholds.medium) return '#F59E0B' // amber-500
  return '#EF4444' // red-500
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#10B981', // green-500
    inactive: '#6B7280', // gray-500
    suspended: '#EF4444', // red-500
    pending: '#F59E0B', // amber-500
    locked: '#DC2626', // red-600
  }
  return colors[status.toLowerCase()] || '#6B7280'
}

/**
 * Generate gradient colors
 */
export function generateGradientColors(baseColor: string, count: number): string[] {
  // This is a simplified version - in production you'd use a color library
  const colors = [
    '#3B82F6', // blue-500
    '#60A5FA', // blue-400
    '#93C5FD', // blue-300
    '#BFDBFE', // blue-200
  ]
  return colors.slice(0, count)
}

// ============================================================================
// Data Validation
// ============================================================================

/**
 * Validate chart data
 */
export function validateChartData(data: any[]): data is ChartDataPoint[] {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return false
  
  return data.every(
    (item) =>
      typeof item === 'object' &&
      'name' in item &&
      'value' in item &&
      typeof item.value === 'number'
  )
}

/**
 * Fill missing data points (for time series)
 */
export function fillMissingDataPoints(
  data: ChartDataPoint[],
  dateRange: { start: Date; end: Date },
  period: 'day' | 'month' = 'month'
): ChartDataPoint[] {
  const filled: ChartDataPoint[] = []
  const dataMap = new Map(data.map((d) => [d.name, d.value]))

  let current = new Date(dateRange.start)
  const end = new Date(dateRange.end)

  while (current <= end) {
    const key = formatChartDate(current, 'medium')
    filled.push({
      name: key,
      value: dataMap.get(key) || 0,
    })

    if (period === 'day') {
      current.setDate(current.getDate() + 1)
    } else {
      current.setMonth(current.getMonth() + 1)
    }
  }

  return filled
}

// ============================================================================
// Export Utilities
// ============================================================================

/**
 * Convert chart data to CSV
 */
export function chartDataToCSV(data: ChartDataPoint[], headers?: string[]): string {
  const keys = headers || Object.keys(data[0] || {})
  const headerRow = keys.join(',')
  const dataRows = data.map((item) => 
    keys.map((key) => item[key] || '').join(',')
  )
  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download chart data as CSV
 */
export function downloadChartAsCSV(
  data: ChartDataPoint[],
  filename: string = 'chart-data.csv'
): void {
  const csv = chartDataToCSV(data)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
