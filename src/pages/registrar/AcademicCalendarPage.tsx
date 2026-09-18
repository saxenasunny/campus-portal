import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function AcademicCalendarPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const dates = [
    { title: 'Commencement of Classes (Odd Semester)', date: '01 Aug 2026', type: 'Academic' },
    { title: 'Continuous Internal Assessment 1 (CIA-1)', date: '22 Sep 2026 - 26 Sep 2026', type: 'Examination' },
    { title: 'Gandhi Jayanti (Holiday)', date: '02 Oct 2026', type: 'Holiday' },
    { title: 'Dussehra Break', date: '19 Oct 2026 - 22 Oct 2026', type: 'Holiday' },
    { title: 'Continuous Internal Assessment 2 (CIA-2)', date: '10 Nov 2026 - 15 Nov 2026', type: 'Examination' },
    { title: 'End-Term Practical Examinations', date: '01 Dec 2026 - 08 Dec 2026', type: 'Examination' },
    { title: 'End-Term Theory Examinations', date: '12 Dec 2026 - 28 Dec 2026', type: 'Examination' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="University Academic Calendar"
        description="Academic Year 2025-26 • Approved Institutional Key Dates"
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Academic Calendar' },
        ]}
      />

      <div className="card p-6">
        <div className="divide-y divide-border/60">
          {dates.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    d.type === 'Examination'
                      ? 'bg-rose-50 text-rose-700'
                      : d.type === 'Holiday'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {d.type}
                </span>
                <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
              </div>
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {d.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
