import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth()
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/${tenantCode}/login`} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Role not authorized for this specific section, redirect to tenant dashboard
    return <Navigate to={`/${tenantCode}`} replace />
  }

  return <>{children}</>
}
