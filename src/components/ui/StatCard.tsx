import React from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo'
  className?: string
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 text-blue-700',
    iconBg: 'bg-blue-100 text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  green: {
    bg: 'bg-emerald-50 text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-700',
    iconBg: 'bg-amber-100 text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  red: {
    bg: 'bg-rose-50 text-rose-700',
    iconBg: 'bg-rose-100 text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  purple: {
    bg: 'bg-purple-50 text-purple-700',
    iconBg: 'bg-purple-100 text-purple-600',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  indigo: {
    bg: 'bg-indigo-50 text-indigo-700',
    iconBg: 'bg-indigo-100 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}: StatCardProps) {
  const c = colorMap[color]

  return (
    <div className={cn('stat-card transition-all duration-200 hover:shadow-md', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', c.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium',
              trend.isPositive !== false ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {trend.isPositive !== false ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
