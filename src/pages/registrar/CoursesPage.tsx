import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function CoursesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const courses = [
    { code: 'CSE-401', title: 'Design & Analysis of Algorithms', credits: 4, ltp: '3-1-0', type: 'Theory' },
    { code: 'CSE-401P', title: 'Algorithms Laboratory', credits: 2, ltp: '0-0-4', type: 'Practical' },
    { code: 'CSE-402', title: 'Database Management Systems', credits: 4, ltp: '3-1-0', type: 'Theory' },
    { code: 'CSE-402P', title: 'DBMS Laboratory', credits: 2, ltp: '0-0-4', type: 'Practical' },
    { code: 'MAT-401', title: 'Discrete Mathematics & Graph Theory', credits: 3, ltp: '3-0-0', type: 'Theory' },
    { code: 'CSE-604', title: 'Advanced Cloud Computing Systems', credits: 3, ltp: '3-0-0', type: 'Elective' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="University Course Catalog"
        description="L-T-P Structures, Credit Schemes & Course Type Classification"
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Courses' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Define New Course
          </button>
        }
      />

      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3 text-center">L-T-P</th>
                <th className="px-4 py-3 text-center">Credits</th>
                <th className="px-4 py-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {courses.map(c => (
                <tr key={c.code} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-primary">{c.code}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{c.title}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">{c.ltp}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold">{c.credits}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{c.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
