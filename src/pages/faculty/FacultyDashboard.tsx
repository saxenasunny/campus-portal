import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function FacultyDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const facultyData = {
    name: 'Prof. Aditya Nair',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    coursesAssigned: 3,
    totalStudents: 184,
    pendingSubmissions: 38,
    cloMappingProgress: 100, // 100% compliant with NHEQF
  }

  const todaySessions = [
    {
      time: '09:30 AM - 10:30 AM',
      courseCode: 'CSE-401',
      courseName: 'Design & Analysis of Algorithms',
      batch: 'B.Tech CSE 2023 - Sec A',
      room: 'LT-302',
      enrolled: 64,
    },
    {
      time: '01:30 PM - 02:30 PM',
      courseCode: 'CSE-604',
      courseName: 'Advanced Cloud Computing Systems',
      batch: 'B.Tech CSE 2022 - Elective',
      room: 'LT-204',
      enrolled: 52,
    },
  ]

  const activeCourses = [
    {
      code: 'CSE-401',
      title: 'Design & Analysis of Algorithms',
      students: 64,
      attendanceRate: 92,
      closCount: 5,
      nheqfStatus: 'Verified Compliant',
    },
    {
      code: 'CSE-604',
      title: 'Advanced Cloud Computing Systems',
      students: 52,
      attendanceRate: 88,
      closCount: 4,
      nheqfStatus: 'Verified Compliant',
    },
    {
      code: 'CSE-401P',
      title: 'Algorithms Laboratory',
      students: 68,
      attendanceRate: 95,
      closCount: 4,
      nheqfStatus: 'Verified Compliant',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${facultyData.name}`}
        description={`${facultyData.designation} • Dept. of ${facultyData.department}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/faculty/attendance`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Clock className="h-4 w-4" /> Mark Today's Attendance
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Course Offerings"
          value={facultyData.coursesAssigned}
          subtitle="Current semester"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Students"
          value={facultyData.totalStudents}
          subtitle="Across all assigned batches"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Evaluation"
          value={facultyData.pendingSubmissions}
          subtitle="Submissions awaiting marks"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="NHEQF CLO Mapping"
          value={`${facultyData.cloMappingProgress}%`}
          subtitle="All 5 domains verified"
          icon={Sparkles}
          color="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Lectures */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Today's Class Sessions</h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Academic Session 2025-26
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {todaySessions.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {s.courseCode}
                      </span>
                      <span className="text-xs text-muted-foreground">• {s.batch}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{s.courseName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Room: <strong>{s.room}</strong> • Enrolled: {s.enrolled} Students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {s.time}
                    </span>
                    <Link
                      to={`/${tenantCode}/faculty/attendance`}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                    >
                      Mark Attendance
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Course Offerings Table */}
          <div className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-foreground">My Active Courses & OBE Compliance</h2>
              <Link
                to={`/${tenantCode}/accreditation/clo`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Manage CLOs <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Course</th>
                    <th className="px-3 py-2 text-center">Students</th>
                    <th className="px-3 py-2 text-center">Attendance Avg</th>
                    <th className="px-3 py-2 text-center">CLOs Defined</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {activeCourses.map((c, i) => (
                    <tr key={i} className="hover:bg-muted/10">
                      <td className="px-3 py-3">
                        <p className="font-semibold text-foreground text-xs">{c.title}</p>
                        <span className="text-[10px] text-muted-foreground font-mono">{c.code}</span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-medium">{c.students}</td>
                      <td className="px-3 py-3 text-center text-xs font-bold text-emerald-600">
                        {c.attendanceRate}%
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          {c.closCount} CLOs ({c.nheqfStatus})
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link
                          to={`/${tenantCode}/faculty/gradebook`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Gradebook →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: OBE & NBA Tools */}
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
            <div className="flex items-center gap-2 text-blue-900">
              <Layers className="h-5 w-5 text-blue-700" />
              <h3 className="text-sm font-bold">OBE & NBA Readiness</h3>
            </div>
            <p className="mt-2 text-xs text-blue-800 leading-relaxed">
              Your courses are mapped with all 5 NHEQF domains (Knowledge, Skills, Application, Generic, Ethics).
            </p>
            <div className="mt-4 space-y-2">
              <Link
                to={`/${tenantCode}/accreditation/clo`}
                className="block w-full rounded-lg bg-white py-2 text-center text-xs font-bold text-blue-700 border border-blue-300 hover:bg-blue-100 transition-colors"
              >
                Review Course Outcomes (CO)
              </Link>
              <Link
                to={`/${tenantCode}/accreditation/nba`}
                className="block w-full rounded-lg bg-blue-700 py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
              >
                NBA Faculty Scorecard
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
              Upcoming Deadlines
            </h3>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-border p-3">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Urgent</span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  Mid-Term Question Paper Submission
                </p>
                <p className="text-[10px] text-muted-foreground">Due: 22 Sep 2026</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Next Week</span>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  Continuous Internal Assessment 1 Marks Entry
                </p>
                <p className="text-[10px] text-muted-foreground">Due: 30 Sep 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
