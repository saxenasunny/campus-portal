import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Building,
  Users,
  Award,
  Layers,
  BarChart3,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function HODDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Leadership Portal"
        description="Department of Computer Science & Engineering • Academic Session 2025-26"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/accreditation/po-attainment`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <BarChart3 className="h-4 w-4" /> View PO Attainment
            </Link>
          </div>
        }
      />

      {/* Department Top KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Department Faculty"
          value="32"
          subtitle="24 Ph.D. holders"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Enrolled Students"
          value="840"
          subtitle="Across B.Tech & M.Tech"
          icon={Building}
          color="indigo"
        />
        <StatCard
          title="NBA Compliance Tier"
          value="On Track"
          subtitle="10 of 12 POs achieved"
          icon={ShieldCheck}
          color="green"
        />
        <StatCard
          title="Avg Attendance Rate"
          value="89.4%"
          subtitle="Department-wide this month"
          icon={Award}
          color="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Programme Outcomes Health Card */}
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> NBA Programme Outcomes (PO 1 - PO 12)
            </h2>
            <Link to={`/${tenantCode}/accreditation/po-attainment`} className="text-xs text-primary font-semibold hover:underline">
              Detailed Heatmap →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { po: 'PO1: Engineering Knowledge', attainment: '88%', status: 'Target Met' },
              { po: 'PO2: Problem Analysis', attainment: '82%', status: 'Target Met' },
              { po: 'PO3: Design & Development', attainment: '79%', status: 'Target Met' },
              { po: 'PO4: Complex Investigations', attainment: '68%', status: 'Target Met' },
              { po: 'PO5: Modern Tool Usage', attainment: '91%', status: 'Target Met' },
              { po: 'PO6: The Engineer & Society', attainment: '54%', status: 'Review Needed' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">{p.po}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono">{p.attainment}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.status === 'Target Met'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Workload Summary */}
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Faculty Workload & Course Allocation
            </h2>
            <Link to={`/${tenantCode}/hod/faculty`} className="text-xs text-primary font-semibold hover:underline">
              Manage Faculty →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Prof. Aditya Nair', designation: 'Assoc. Prof', hours: '16 hrs/wk', courses: 3 },
              { name: 'Dr. Meenakshi Sundaram', designation: 'Professor', hours: '14 hrs/wk', courses: 2 },
              { name: 'Dr. Rajesh Khanna', designation: 'Asst. Prof', hours: '18 hrs/wk', courses: 3 },
              { name: 'Prof. Sunita Rao', designation: 'Asst. Prof', hours: '16 hrs/wk', courses: 3 },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/40 pb-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">{f.name}</p>
                  <span className="text-[10px] text-muted-foreground">{f.designation}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{f.hours}</p>
                  <span className="text-[10px] text-muted-foreground">{f.courses} Courses Assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
