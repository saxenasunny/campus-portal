import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, Download, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function StudentGradesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const semesters = [
    { sem: 'Semester 3', sgpa: '8.92', credits: 24, status: 'Published' },
    { sem: 'Semester 2', sgpa: '8.80', credits: 22, status: 'Published' },
    { sem: 'Semester 1', sgpa: '8.80', credits: 22, status: 'Published' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grade Card & Transcript"
        description="Official Cumulative Academic Performance • B.Tech CSE (2023-27)"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Grades' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-2 text-xs">
            <Download className="h-4 w-4" /> Download Official Grade Card (PDF)
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Cumulative GPA (CGPA)" value="8.84" subtitle="Scale of 10.0" icon={Award} color="indigo" />
        <StatCard title="Total Credits Earned" value="68" subtitle="Towards 160 required" icon={Award} color="blue" />
        <StatCard title="Academic Standing" value="First Class with Distinction" subtitle="Verified by Registrar" icon={Award} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Semester-Wise SGPA History
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {semesters.map(s => (
            <div key={s.sem} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <h3 className="text-sm font-bold text-foreground">{s.sem}</h3>
                <p className="text-xs text-muted-foreground">{s.credits} Credits Registered & Cleared</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-base font-extrabold text-primary font-mono">SGPA: {s.sgpa}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
