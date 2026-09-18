import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Users, BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function EnrollmentsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const enrollments = [
    { course: 'CSE-401: Algorithms', batch: 'B.Tech CSE 2023 Sec A', enrolled: 64, max: 70, type: 'Core' },
    { course: 'CSE-402: DBMS', batch: 'B.Tech CSE 2023 Sec A', enrolled: 64, max: 70, type: 'Core' },
    { course: 'CSE-604: Cloud Systems', batch: 'B.Tech CSE 2022 Elective', enrolled: 52, max: 60, type: 'Elective' },
    { course: 'AIML-401: Deep Learning', batch: 'B.Tech AIML 2023 Sec A', enrolled: 58, max: 60, type: 'Core' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Offering & Enrollment Roster"
        description="Semester Registration Telemetry • Current Term Student Allocations"
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Enrollments' },
        ]}
      />

      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Course Offering</th>
                <th className="px-4 py-3">Batch / Cohort</th>
                <th className="px-4 py-3 text-center">Enrolled</th>
                <th className="px-4 py-3 text-center">Seat Capacity</th>
                <th className="px-4 py-3 text-center">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {enrollments.map((e, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{e.course}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{e.batch}</td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-xs text-emerald-600">{e.enrolled}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">{e.max}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {e.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
