import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, Mail, Phone, Shield, Building, Award, Calendar, GraduationCap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { PageHeader } from '@/components/ui/PageHeader'
import { getRoleLabel } from '@/lib/utils'

export default function ProfilePage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const { user, role, fullName } = useAuth()
  const { currentTenant } = useTenant()

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile & Credentials"
        description="Institutional Identity, Security & Academic Details"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Profile' },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-md">
            {fullName ? fullName[0] : (user?.email ? user.email[0].toUpperCase() : 'U')}
          </div>
          <h2 className="mt-4 text-base font-bold text-foreground">
            {fullName || user?.email?.split('@')[0] || 'Academic User'}
          </h2>
          <span className="mt-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary uppercase">
            {role ? getRoleLabel(role) : 'Student'}
          </span>
          <p className="mt-3 text-xs text-muted-foreground">
            {currentTenant?.name || 'GD Goenka University'}
          </p>
        </div>

        {/* Detailed Info Card */}
        <div className="card p-6 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Personal & Account Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-muted-foreground block">Full Name</span>
              <strong className="text-foreground text-sm font-semibold">
                {fullName || user?.email?.split('@')[0]}
              </strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Institutional Email</span>
              <strong className="text-foreground text-sm font-semibold">{user?.email}</strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Assigned Role</span>
              <strong className="text-foreground text-sm font-semibold uppercase">{role || 'Student'}</strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Authentication Mode</span>
              <strong className="text-emerald-700 text-sm font-semibold">
                Verified Single Sign-On (Active)
              </strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Institution Code</span>
              <strong className="text-foreground font-mono text-xs">{tenantCode.toUpperCase()}</strong>
            </div>

            <div>
              <span className="text-muted-foreground block">Account Status</span>
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Active & Enrolled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
