import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Briefcase, Calendar, MapPin, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function CampusDrivesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const drives = [
    { title: 'Microsoft India Virtual On-Campus Drive', date: '25 Sep 2026', venue: 'Online Assessment + Teams Interview', eligible: 'B.Tech CSE / IT (CGPA ≥ 7.5)', status: 'Registration Open' },
    { title: 'Deloitte USI Technology Day', date: '28 Sep 2026', venue: 'Auditorium Block A', eligible: 'B.Tech (All Branches), MCA', status: 'Shortlisting' },
    { title: 'TCS Digital National Qualifier Test Drive', date: '02 Oct 2026', venue: 'Central Computer Center Lab 1-4', eligible: 'All Engineering & Science Streams', status: 'Scheduled' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Campus Recruitment Drives"
        description="On-Campus & Virtual Recruitment Schedule • Placement Season 2025-26"
        breadcrumbs={[
          { label: 'Placement', href: `/${tenantCode}/placement` },
          { label: 'Campus Drives' },
        ]}
      />

      <div className="card p-6">
        <div className="divide-y divide-border/60">
          {drives.map((d, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {d.date}
                </span>
                <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {d.venue}
                </p>
                <p className="text-[11px] text-slate-600">
                  Eligibility: <strong>{d.eligible}</strong>
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 self-start sm:self-auto">
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
