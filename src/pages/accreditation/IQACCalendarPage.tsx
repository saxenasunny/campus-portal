import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, CheckCircle2, Clock, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function IQACCalendarPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const events = [
    { title: 'Quarterly IQAC Committee Review Meeting', date: '22 Sep 2026', type: 'Meeting', status: 'Upcoming' },
    { title: 'Annual Quality Assurance Report (AQAR) Draft Signoff', date: '05 Oct 2026', type: 'Deadline', status: 'Scheduled' },
    { title: 'Faculty OBE & Bloom Taxonomy Refresher Workshop', date: '12 Oct 2026', type: 'Workshop', status: 'Scheduled' },
    { title: 'Internal Departmental Academic & Administrative Audit (AAA)', date: '18 Oct 2026', type: 'Audit', status: 'Scheduled' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Quality Assurance Cell (IQAC) Calendar"
        description="NAAC Criterion 6.5 Quality Assurance Strategies & Institutional Audits"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'IQAC Calendar' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-2 text-xs">
            <Plus className="h-4 w-4" /> Schedule IQAC Event
          </button>
        }
      />

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" /> Scheduled Quality Assurance Initiatives
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {events.map((e, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {e.type}
                </span>
                <h3 className="text-sm font-bold text-foreground">{e.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {e.date}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
