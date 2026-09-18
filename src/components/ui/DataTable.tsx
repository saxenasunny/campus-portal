import React from 'react'
import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  className?: string
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map(col => (
                <th key={col.key} className={cn('px-4 py-3', col.className)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                  <Inbox className="mx-auto h-8 w-8 opacity-40 mb-2" />
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id ?? index}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors hover:bg-muted/20',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-4 py-3 text-foreground', col.className)}>
                      {col.render
                        ? col.render(item, index)
                        : String((item as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
