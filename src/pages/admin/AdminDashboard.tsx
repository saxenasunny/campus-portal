import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Users,
  GraduationCap,
  Building,
  Award,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Bus,
  CreditCard,
  Briefcase,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function AdminDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const metrics = {
    totalStudents: '4,820',
    totalFaculty: '248',
    activeProgrammes: '34',
    naacReadiness: '88%',
    activeAccreditationCycles: 2,
    feeCollectionRate: '92.4%',
    placementRate: '86.5%',
    libraryVolumes: '48,200',
  }

  const compliancePillars = [
    {
      title: 'NEP 2020 Compliance',
      score: '95%',
      status: 'Fully Operational',
      details: 'CBCS Credit Engine, Multidisciplinary Elective Pools, Multiple Entry/Exit clearance',
      link: `/${tenantCode}/accreditation/nheqf`,
      color: 'text-emerald-600',
    },
    {
      title: 'NHEQF 5-Domain Alignment',
      score: '92%',
      status: 'Certified',
      details: 'Course outcomes mapped across Knowledge, Skills, Application, Generic Skills, Ethics',
      link: `/${tenantCode}/accreditation/nheqf`,
      color: 'text-blue-600',
    },
    {
      title: 'NAAC SSR Readiness',
      score: '84%',
      status: 'In Progress (Cycle 2)',
      details: 'All 7 Criteria auto-populated from live ERP records with DVV pre-audit verification',
      link: `/${tenantCode}/accreditation/naac`,
      color: 'text-indigo-600',
    },
    {
      title: 'NBA Programme Risk Matrix',
      score: '90%',
      status: '4 Tier Tracked',
      details: 'PO Attainment L0-L3 calculation with automated NBA SAR PDF export capability',
      link: `/${tenantCode}/accreditation/nba`,
      color: 'text-amber-600',
    },
  ]

  const erpModules = [
    { title: 'Admissions & CRM', count: '1,240 Applications', link: `/${tenantCode}/registrar/students`, icon: Users },
    { title: 'Academic Catalog', count: '34 Programmes • 420 Courses', link: `/${tenantCode}/registrar/programmes`, icon: GraduationCap },
    { title: 'Library OPAC', count: '48,200 Titles', link: `/${tenantCode}/erp/library`, icon: BookOpen },
    { title: 'Hostel System', count: '1,850 Residents', link: `/${tenantCode}/erp/hostel`, icon: Building },
    { title: 'Transport Fleet', count: '28 Active Routes', link: `/${tenantCode}/erp/transport`, icon: Bus },
    { title: 'Career & Placement', count: '142 Recruiting Partners', link: `/${tenantCode}/placement`, icon: Briefcase },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Executive Dashboard"
        description="Comprehensive operational overview, NEP 2020 compliance telemetry, and accreditation readiness."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/accreditation`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Award className="h-4 w-4" /> Accreditation Command Hub
            </Link>
          </div>
        }
      />

      {/* University Wide Top KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Enrolled Students"
          value={metrics.totalStudents}
          subtitle="Across all schools"
          icon={Users}
          color="indigo"
          trend={{ value: 8.4, label: 'YoY Growth', isPositive: true }}
        />
        <StatCard
          title="Teaching Faculty"
          value={metrics.totalFaculty}
          subtitle="Student-to-Faculty 1:19.4"
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Accreditation Index"
          value={metrics.naacReadiness}
          subtitle="NAAC + NBA + NIRF Composite"
          icon={Sparkles}
          color="green"
        />
        <StatCard
          title="Fee Realization"
          value={metrics.feeCollectionRate}
          subtitle="Semester 2025-26"
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Regulatory & Accreditation Telemetry */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Accreditation & Regulatory Health
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live automated compliance tracking aligned with NAAC, NBA, NHEQF, and NEP 2020 guidelines
            </p>
          </div>
          <Link
            to={`/${tenantCode}/accreditation/dvv`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <ShieldAlert className="h-4 w-4" /> Run DVV Simulation
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compliancePillars.map((p, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-border p-4 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {p.title}
                  </span>
                  <span className={`text-lg font-extrabold ${p.color}`}>{p.score}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {p.status}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {p.details}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60">
                <Link
                  to={p.link}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Inspect Module <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus ERP Operations Grid */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" /> Integrated Campus ERP Services
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {erpModules.map((m, i) => {
            const Icon = m.icon
            return (
              <Link
                key={i}
                to={m.link}
                className="card p-4 hover:border-primary/50 hover:shadow-md transition-all flex items-start justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">{m.count}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-2" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
