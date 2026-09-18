import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy'): string {
  try {
    return format(new Date(date), fmt)
  } catch {
    return '—'
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    return format(new Date(date), 'dd MMM yyyy, hh:mm a')
  } catch {
    return '—'
  }
}

export function formatTimeAgo(date: string | Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatTime(time: string): string {
  // Convert "14:30:00" → "2:30 PM"
  try {
    const [hours, minutes] = time.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h = hours % 12 || 12
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`
  } catch {
    return time
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, maxLength: number): string {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function getDayLabel(date: Date | string): string {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEE, dd MMM')
}

export function getDayOfWeekLabel(day: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day] ?? '—'
}

export function calculatePercentage(value: number, total: number): number {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    'O': 'text-emerald-600',
    'A+': 'text-emerald-500',
    'A': 'text-green-600',
    'B+': 'text-blue-600',
    'B': 'text-blue-500',
    'C': 'text-amber-600',
    'F': 'text-red-600',
  }
  return colors[grade] ?? 'text-foreground'
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    student:           'Student',
    faculty:           'Faculty',
    hod:               'Head of Department',
    registrar:         'Registrar',
    admin:             'Administrator',
    advisor:           'Academic Advisor',
    placement_officer: 'Placement Officer',
    employer:          'Employer / Recruiter',
    dean:              'Dean',
    finance_officer:   'Finance Officer',
    librarian:         'Librarian',
    warden:            'Hostel Warden',
    hr_manager:        'HR Manager',
    it_admin:          'IT Administrator',
    super_admin:       'Super Administrator',
  }
  return labels[role] ?? role
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string): void {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const v = String(row[h] ?? '')
        return v.includes(',') ? `"${v}"` : v
      }).join(',')
    ),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename)
}
