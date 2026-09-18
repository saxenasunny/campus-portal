import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  Bell,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency } from '@/lib/utils'

export default function StudentDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  // Representative data for fast preview & demonstration
  const studentData = {
    name: 'Aarav Sharma',
    enrollmentNumber: 'GDGU2023CSE001',
    programme: 'B.Tech Computer Science & Engineering',
    semester: 4,
    cgpa: 8.84,
    creditsEarned: 86,
    totalCreditsRequired: 160,
    attendanceRate: 91,
    pendingFee: 24500,
  }

  const todayClasses = [
    {
      time: '09:30 AM - 10:30 AM',
      courseCode: 'CSE-401',
      courseName: 'Design & Analysis of Algorithms',
      room: 'LT-302',
      faculty: 'Prof. Aditya Nair',
      status: 'upcoming',
    },
    {
      time: '11:00 AM - 01:00 PM',
      courseCode: 'CSE-402P',
      courseName: 'Database Management Systems Lab',
      room: 'Lab 4',
      faculty: 'Dr. Meenakshi Sundaram',
      status: 'upcoming',
    },
    {
      time: '02:30 PM - 03:30 PM',
      courseCode: 'MAT-401',
      courseName: 'Discrete Mathematics & Graph Theory',
      room: 'LT-105',
      faculty: 'Dr. Rajesh Khanna',
      status: 'upcoming',
    },
  ]

  const upcomingAssessments = [
    {
      title: 'Algorithms Mid-Term Evaluation',
      course: 'CSE-401',
      date: '24 Sep 2026',
      type: 'Internal Exam',
      weightage: '25%',
    },
    {
      title: 'DBMS Normalization Assignment',
      course: 'CSE-402',
      date: '28 Sep 2026',
      type: 'Assignment',
      weightage: '10%',
    },
  ]

  const recentGrades = [
    { course: 'Operating Systems (CSE-301)', grade: 'A+', points: 9.0, credits: 4 },
    { course: 'Computer Networks (CSE-302)', grade: 'O', points: 10.0, credits: 4 },
    { course: 'Software Engineering (CSE-303)', grade: 'A', points: 8.0, credits: 3 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${studentData.name}`}
        description={`${studentData.programme} • Semester ${studentData.semester} • Enrollment ID: ${studentData.enrollmentNumber}`}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" /> Academic Standing: Good
            </span>
          </div>
        }
      />

      {/* Primary KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current CGPA"
          value={studentData.cgpa}
          subtitle="Out of 10.0 Scale"
          icon={Award}
          color="indigo"
          trend={{ value: 4.2, label: 'vs last sem', isPositive: true }}
        />
        <StatCard
          title="Attendance"
          value={`${studentData.attendanceRate}%`}
          subtitle="Above 75% threshold"
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Credits Completed"
          value={`${studentData.creditsEarned} / ${studentData.totalCreditsRequired}`}
          subtitle={`${Math.round((studentData.creditsEarned / studentData.totalCreditsRequired) * 100)}% degree progress`}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(studentData.pendingFee)}
          subtitle="Due by 30 Sep 2026"
          icon={CreditCard}
          color={studentData.pendingFee > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Main Content Grid: Today's Schedule & Academic Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Schedule & Deadlines */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Schedule Card */}
          <div className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Today's Academic Schedule</h2>
              </div>
              <Link
                to={`/${tenantCode}/student/timetable`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Full Timetable <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-border/60">
              {todayClasses.map((c, i) => (
                <div key={i} className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {c.courseCode}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">{c.courseName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Faculty: {c.faculty} • Room: <strong className="text-foreground">{c.room}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {c.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assessments */}
          <div className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Upcoming Assessments & Tasks</h2>
              </div>
              <Link
                to={`/${tenantCode}/student/assessments`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingAssessments.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {a.course} • {a.type}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                    <p className="text-xs text-muted-foreground">Due: {a.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                      Weight: {a.weightage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions, Recent Grades, Fee Alert */}
        <div className="space-y-6">
          {/* Quick Pay / Fee Notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="text-sm font-bold">Semester Fee Due</h3>
            </div>
            <p className="mt-2 text-xs text-amber-900 leading-relaxed">
              Semester 4 installment of <strong>{formatCurrency(studentData.pendingFee)}</strong> is scheduled for payment.
            </p>
            <Link
              to={`/${tenantCode}/student/fee`}
              className="mt-4 block w-full rounded-lg bg-amber-600 py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition-colors"
            >
              Pay via Razorpay
            </Link>
          </div>

          {/* Recent Course Results */}
          <div className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground">Recent Semester Results</h2>
              <Link to={`/${tenantCode}/student/grades`} className="text-xs text-primary hover:underline">
                Grade Card
              </Link>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {recentGrades.map((g, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 first:pt-0">
                  <div className="max-w-[70%]">
                    <p className="text-xs font-medium text-foreground truncate">{g.course}</p>
                    <span className="text-[10px] text-muted-foreground">{g.credits} Credits</span>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {g.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Portal Navigation Links */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
              Campus Quick Links
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to={`/${tenantCode}/erp/library`}
                className="rounded-lg border border-border p-2.5 text-center text-xs font-medium hover:bg-muted transition-colors"
              >
                📚 Library Catalog
              </Link>
              <Link
                to={`/${tenantCode}/erp/hostel`}
                className="rounded-lg border border-border p-2.5 text-center text-xs font-medium hover:bg-muted transition-colors"
              >
                🏢 Hostel Pass
              </Link>
              <Link
                to={`/${tenantCode}/erp/transport`}
                className="rounded-lg border border-border p-2.5 text-center text-xs font-medium hover:bg-muted transition-colors"
              >
                🚌 Bus Routes
              </Link>
              <Link
                to={`/${tenantCode}/placement`}
                className="rounded-lg border border-border p-2.5 text-center text-xs font-medium hover:bg-muted transition-colors"
              >
                💼 Career Drives
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
