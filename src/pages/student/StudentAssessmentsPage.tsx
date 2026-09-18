import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ClipboardCheck, Clock, Award, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function StudentAssessmentsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const assessments = [
    { title: 'Algorithms Mid-Term Evaluation', course: 'CSE-401', date: '24 Sep 2026', duration: '90 Mins', type: 'Exam', status: 'Scheduled' },
    { title: 'DBMS Normalization & ER Modeling', course: 'CSE-402', date: '28 Sep 2026', duration: 'Assignment', type: 'Assignment', status: 'Open' },
    { title: 'Discrete Graph Coloring Quiz', course: 'MAT-401', date: '04 Oct 2026', duration: '30 Mins', type: 'Quiz', status: 'Upcoming' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations & Assessments"
        description="Continuous Internal Assessment (CIA) & Semester Examinations"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Assessments' },
        ]}
      />

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" /> Active Assessment Schedule
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {assessments.map((a, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 first:pt-0 last:pb-0 gap-3">
              <div className="space-y-1">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {a.course} • {a.type}
                </span>
                <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> Date: <strong>{a.date}</strong> • Duration: {a.duration}
                </p>
              </div>
              <button className="btn-primary text-xs self-start sm:self-auto">
                Launch Assessment Portal
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
