import React, { lazy, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy load role-specific dashboards
const StudentDashboard   = lazy(() => import('@/pages/student/StudentDashboard'))
const FacultyDashboard   = lazy(() => import('@/pages/faculty/FacultyDashboard'))
const HODDashboard       = lazy(() => import('@/pages/hod/HODDashboard'))
const RegistrarDashboard = lazy(() => import('@/pages/registrar/RegistrarDashboard'))
const AdminDashboard     = lazy(() => import('@/pages/admin/AdminDashboard'))
const PlacementDashboard = lazy(() => import('@/pages/placement/PlacementDashboard'))
const EmployerDashboard  = lazy(() => import('@/pages/employer/EmployerDashboard'))

export default function DashboardRouter() {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      }
    >
      {(() => {
        switch (role) {
          case 'student':
            return <StudentDashboard />
          case 'faculty':
            return <FacultyDashboard />
          case 'hod':
            return <HODDashboard />
          case 'registrar':
            return <RegistrarDashboard />
          case 'placement_officer':
            return <PlacementDashboard />
          case 'employer':
            return <EmployerDashboard />
          case 'admin':
          case 'super_admin':
          case 'it_admin':
          case 'dean':
          default:
            return <AdminDashboard />
        }
      })()}
    </Suspense>
  )
}
