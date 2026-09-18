import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building, Users, BookOpen, Award } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function HODDepartmentPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Academic Overview"
        description="Department of Computer Science & Engineering • Program Portfolio & Staffing"
        breadcrumbs={[
          { label: 'HOD', href: `/${tenantCode}` },
          { label: 'Department' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Degree Programmes" value="4" subtitle="B.Tech, M.Tech, Ph.D." icon={BookOpen} color="blue" />
        <StatCard title="Total Department Faculty" value="32" subtitle="Across 4 specializations" icon={Users} color="indigo" />
        <StatCard title="Student Strength" value="840" subtitle="Academic Year 2025-26" icon={Building} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Department Degree Programmes
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {[
            { name: 'B.Tech in Computer Science & Engineering', code: 'CSE-UG', duration: '4 Years', intake: 240, status: 'Active' },
            { name: 'B.Tech CSE (Artificial Intelligence & Machine Learning)', code: 'AIML-UG', duration: '4 Years', intake: 120, status: 'Active' },
            { name: 'M.Tech in Computer Science & Engineering', code: 'CSE-PG', duration: '2 Years', intake: 30, status: 'Active' },
            { name: 'Doctor of Philosophy (Ph.D.) in CSE', code: 'CSE-PHD', duration: '3-5 Years', intake: 15, status: 'Active' },
          ].map(p => (
            <div key={p.code} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.duration} • Annual Intake: {p.intake}</p>
              </div>
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {p.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
