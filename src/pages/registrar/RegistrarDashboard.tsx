import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function RegistrarDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Office of the Registrar"
        description="Academic Registry, Student Lifecycle Management & Accreditation Reporting"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/accreditation/iiqa`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <CheckCircle2 className="h-4 w-4" /> Verify NAAC IIQA Eligibility
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Students"
          value="4,820"
          subtitle="All schools & departments"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Degree Programmes"
          value="34"
          subtitle="UG, PG, and Doctoral"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="NAAC IIQA Status"
          value="Ready"
          subtitle="AISHE Code Verified"
          icon={FileCheck2}
          color="green"
        />
        <StatCard
          title="DVV Pre-Audit"
          value="0 Deviations"
          subtitle="All declared data verified"
          icon={ShieldAlert}
          color="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground">Registry Operations Quick Access</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to={`/${tenantCode}/registrar/students`}
              className="rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors block"
            >
              <h3 className="text-xs font-bold text-foreground">Student Roster & Enrollments</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                View student directory, batch updates, lateral entries, and academic status.
              </p>
            </Link>

            <Link
              to={`/${tenantCode}/registrar/programmes`}
              className="rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors block"
            >
              <h3 className="text-xs font-bold text-foreground">Programmes & Degree Types</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Configure NEP 2020 4-year degree structures, multiple exit clearances.
              </p>
            </Link>

            <Link
              to={`/${tenantCode}/registrar/courses`}
              className="rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors block"
            >
              <h3 className="text-xs font-bold text-foreground">University Course Catalog</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                L-T-P structure, credit allocations, and course syllabus repository.
              </p>
            </Link>

            <Link
              to={`/${tenantCode}/registrar/academic-calendar`}
              className="rounded-lg border border-border p-3.5 hover:bg-muted/30 transition-colors block"
            >
              <h3 className="text-xs font-bold text-foreground">University Academic Calendar</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Define semester schedules, examination windows, and institutional holidays.
              </p>
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
            Accreditation Pre-Submission
          </h2>
          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
              <span className="font-bold text-emerald-800">AISHE Registered</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">Code: U-0174 (State Private University)</p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to={`/${tenantCode}/accreditation/dvv`}
                className="btn-primary flex items-center justify-center gap-1.5 w-full py-2 text-xs"
              >
                Run DVV Validation
              </Link>
              <Link
                to={`/${tenantCode}/accreditation/nirf`}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-border py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Export NIRF Quantities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
