import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building, Users, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function HostelPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const blocks = [
    { name: 'Aravali Hostel (Boys)', rooms: 180, occupied: 172, warden: 'Dr. S. K. Sharma', type: 'Boys' },
    { name: 'Shivalik Hostel (Boys)', rooms: 160, occupied: 154, warden: 'Prof. Ankit Verma', type: 'Boys' },
    { name: 'Nilgiri Hostel (Girls)', rooms: 220, occupied: 210, warden: 'Dr. Rekha Kumari', type: 'Girls' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hostel & Residential Life Management"
        description="Campus Housing, Room Allotment & Biometric Attendance Telemetry"
        breadcrumbs={[
          { label: 'Campus ERP', href: `/${tenantCode}` },
          { label: 'Hostel' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Resident Students" value="1,850" subtitle="94% Occupancy Rate" icon={Users} color="blue" />
        <StatCard title="Residential Blocks" value="3 Active" subtitle="Aravali, Shivalik, Nilgiri" icon={Building} color="indigo" />
        <StatCard title="Security Gate Status" value="Online" subtitle="Biometric in/out logging" icon={CheckCircle2} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Hostel Residential Blocks
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {blocks.map(b => (
            <div key={b.name} className="rounded-xl border border-border p-4 bg-slate-50/50">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {b.type}
              </span>
              <h3 className="text-sm font-bold text-foreground mt-2">{b.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Chief Warden: {b.warden}</p>
              <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span>Occupancy:</span>
                <strong className="text-emerald-700">{b.occupied} / {b.rooms} Rooms</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
