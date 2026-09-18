import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Award, Layers, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function StudentCoursesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const courses = [
    { code: 'CSE-401', title: 'Design & Analysis of Algorithms', credits: 4, faculty: 'Prof. Aditya Nair', type: 'Core', attendance: '92%' },
    { code: 'CSE-402', title: 'Database Management Systems', credits: 4, faculty: 'Dr. Meenakshi Sundaram', type: 'Core', attendance: '88%' },
    { code: 'CSE-401P', title: 'Algorithms Laboratory', credits: 2, faculty: 'Prof. Aditya Nair', type: 'Practical', attendance: '95%' },
    { code: 'CSE-402P', title: 'DBMS Laboratory', credits: 2, faculty: 'Dr. Meenakshi Sundaram', type: 'Practical', attendance: '90%' },
    { code: 'MAT-401', title: 'Discrete Mathematics & Graph Theory', credits: 3, faculty: 'Dr. Rajesh Khanna', type: 'Core', attendance: '85%' },
    { code: 'CSE-604', title: 'Advanced Cloud Computing Systems', credits: 3, faculty: 'Prof. Aditya Nair', type: 'Elective', attendance: '91%' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Prescribed Courses"
        description="B.Tech Computer Science & Engineering • Semester 4 (2025-26)"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'My Courses' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c.code} className="card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary font-mono">
                {c.code}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {c.type}
              </span>
            </div>

            <h3 className="text-sm font-bold text-foreground mt-3">{c.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">Faculty: {c.faculty}</p>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Credits: <strong className="text-foreground">{c.credits}</strong></span>
              <span className="text-emerald-600 font-bold">Attendance: {c.attendance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
