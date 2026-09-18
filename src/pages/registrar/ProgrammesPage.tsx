import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { GraduationCap, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ProgrammesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const programmes = [
    { code: 'B.TECH-CSE', name: 'Bachelor of Technology in Computer Science & Engineering', level: 'UG (NEP 4-Yr)', credits: 160, dept: 'CSE' },
    { code: 'B.TECH-AIML', name: 'B.Tech in Artificial Intelligence & Machine Learning', level: 'UG (NEP 4-Yr)', credits: 160, dept: 'CSE' },
    { code: 'B.TECH-ME', name: 'Bachelor of Technology in Mechanical Engineering', level: 'UG (NEP 4-Yr)', credits: 160, dept: 'Mechanical' },
    { code: 'B.TECH-CE', name: 'Bachelor of Technology in Civil Engineering', level: 'UG (NEP 4-Yr)', credits: 160, dept: 'Civil' },
    { code: 'MBA', name: 'Master of Business Administration', level: 'PG (2-Yr)', credits: 96, dept: 'Management' },
    { code: 'LL.B', name: 'Bachelor of Laws', level: 'UG Professional (3-Yr)', credits: 120, dept: 'Law' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="University Degree Programmes"
        description="Approved Degree Offerings, Curricular Structures & Credit Mandates"
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Programmes' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add New Programme
          </button>
        }
      />

      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Programme Name</th>
                <th className="px-4 py-3">Degree Level</th>
                <th className="px-4 py-3 text-center">Mandatory Credits</th>
                <th className="px-4 py-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {programmes.map(p => (
                <tr key={p.code} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-primary">{p.code}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{p.name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{p.level}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold">{p.credits}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{p.dept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
