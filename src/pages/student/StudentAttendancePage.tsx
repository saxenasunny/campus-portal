import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function StudentAttendancePage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const courseAttendance = [
    { code: 'CSE-401', name: 'Design & Analysis of Algorithms', held: 36, attended: 33, pct: 92, status: 'Good' },
    { code: 'CSE-402', name: 'Database Management Systems', held: 34, attended: 30, pct: 88, status: 'Good' },
    { code: 'CSE-401P', name: 'Algorithms Laboratory', held: 12, attended: 12, pct: 100, status: 'Perfect' },
    { code: 'CSE-402P', name: 'DBMS Laboratory', held: 12, attended: 11, pct: 92, status: 'Good' },
    { code: 'MAT-401', name: 'Discrete Mathematics', held: 30, attended: 26, pct: 87, status: 'Good' },
    { code: 'CSE-604', name: 'Cloud Computing Systems', held: 28, attended: 25, pct: 89, status: 'Good' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance Records"
        description="B.Tech Computer Science • Current Semester Attendance Telemetry"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Attendance' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Cumulative Attendance" value="91.4%" subtitle="Across all 6 courses" icon={Clock} color="green" />
        <StatCard title="Classes Attended" value="137 / 152" subtitle="Conducted this semester" icon={CheckCircle2} color="blue" />
        <StatCard title="Exam Eligibility" value="Eligible" subtitle="Well above 75% statutory bar" icon={CheckCircle2} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Course-Wise Attendance Breakdown
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3 text-center">Sessions Held</th>
                <th className="px-4 py-3 text-center">Attended</th>
                <th className="px-4 py-3 text-center">Percentage</th>
                <th className="px-4 py-3 text-center">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {courseAttendance.map(c => (
                <tr key={c.code} className="hover:bg-muted/10">
                  <td className="px-4 py-3">
                    <p className="font-bold text-xs text-foreground">{c.name}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">{c.code}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{c.held}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-foreground">{c.attended}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-bold text-emerald-600">{c.pct}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      Eligible
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
