import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Settings, Bell, Shield, Moon, Palette } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preferences & System Settings"
        description="Notification Controls, Security Policies & Display Customization"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Settings' },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notifications & Alerts
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between">
              <span className="font-medium text-foreground">Examination Schedule Alerts</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-medium text-foreground">Attendance Deficit Warnings (&lt; 75%)</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-medium text-foreground">Fee Installment Reminders</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-medium text-foreground">Campus Placement Announcements</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
            </label>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Security & Session
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Two-Factor Authentication (2FA)</p>
                <p className="text-muted-foreground text-[11px]">Enforce OTP on mobile for login</p>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                Enabled
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <p className="font-semibold text-foreground">Session Inactivity Timeout</p>
                <p className="text-muted-foreground text-[11px]">Auto logout after 30 minutes</p>
              </div>
              <span className="text-xs font-mono text-slate-700">30 Mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
