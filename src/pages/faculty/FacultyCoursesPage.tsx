import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Users, Clock, Award, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function FacultyCoursesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const courses = [
    { code: 'CSE-401', title: 'Design & Analysis of Algorithms', batch: 'B.Tech CSE 2023 Sec A', students: 64, credits: 4 },
    { code: 'CSE-401P', title: 'Algorithms Laboratory', batch: 'B.Tech CSE 2023 Sec A', students: 64, credits: 2 },
    { code: 'CSE-604', title: 'Advanced Cloud Computing Systems', batch: 'B.Tech CSE 2022 Elective', students: 52, credits: 3 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Course Offerings"
        description="Academic Session 2025-26 • Department of Computer Science"
        breadcrumbs={[
          { label: 'Faculty Dashboard', href: `/${tenantCode}` },
          { label: 'My Courses' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map(c => (
          <div key={c.code} className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {c.code}
                </span>
                <span className="text-xs text-muted-foreground">{c.credits} Credits</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-2.5">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{c.batch}</p>
              <p className="text-xs font-semibold text-slate-700 mt-2 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" /> {c.students} Enrolled Students
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <Link
                to={`/${tenantCode}/faculty/attendance`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark Attendance
              </Link>
              <Link
                to={`/${tenantCode}/faculty/gradebook`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Open Gradebook →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
