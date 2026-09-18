import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Award,
  Sparkles,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Calendar,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function AccreditationDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const frameworks = [
    {
      id: 'naac',
      name: 'NAAC Accreditation Suite',
      shortName: 'NAAC Cycle 2',
      status: 'Active Audit',
      completion: 84,
      criteriaCount: 7,
      dataPointsVerified: '142 / 168',
      link: `/${tenantCode}/accreditation/naac`,
      color: 'bg-indigo-600',
    },
    {
      id: 'nheqf',
      name: 'NHEQF 5-Domain Compliance',
      shortName: 'NEP 2020 OBE',
      status: 'Certified Compliant',
      completion: 96,
      criteriaCount: 5,
      dataPointsVerified: '420 / 420 Courses',
      link: `/${tenantCode}/accreditation/nheqf`,
      color: 'bg-emerald-600',
    },
    {
      id: 'nba',
      name: 'NBA Programme Evaluation',
      shortName: 'NBA Tier-1',
      status: 'Ready for Review',
      completion: 90,
      criteriaCount: 9,
      dataPointsVerified: '10 / 12 POs Met',
      link: `/${tenantCode}/accreditation/nba`,
      color: 'bg-blue-600',
    },
    {
      id: 'nirf',
      name: 'NIRF Ranking Data Pack',
      shortName: 'NIRF 2026',
      status: 'Data Prepared',
      completion: 88,
      criteriaCount: 5,
      dataPointsVerified: '5 Parameters Quantified',
      link: `/${tenantCode}/accreditation/nirf`,
      color: 'bg-amber-600',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accreditation & Institutional Quality Hub"
        description="Continuous Quality Monitoring & Regulatory Submissions • NAAC, NBA, NHEQF, NIRF"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/accreditation/dvv`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <ShieldCheck className="h-4 w-4" /> Run DVV Simulation
            </Link>
          </div>
        }
      />

      {/* Top Level Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Frameworks"
          value="4"
          subtitle="NAAC, NBA, NHEQF, NIRF"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Verified Data Points"
          value="92.4%"
          subtitle="Backed by live ERP records"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="DVV Risk Status"
          value="0 Deviations"
          subtitle="No unevidenced declarations"
          icon={ShieldCheck}
          color="green"
        />
        <StatCard
          title="IIQA Readiness"
          value="Approved"
          subtitle="AISHE Code U-0174 Verified"
          icon={Sparkles}
          color="blue"
        />
      </div>

      {/* Frameworks Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {frameworks.map(f => (
          <div key={f.id} className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {f.shortName}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {f.status}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-foreground">{f.name}</h2>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Readiness Completeness</span>
                  <span className="font-bold text-foreground">{f.completion}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.completion}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                <span>Verification Scope</span>
                <strong className="text-foreground">{f.dataPointsVerified}</strong>
              </div>
            </div>

            <div className="mt-6 pt-3">
              <Link
                to={f.link}
                className="btn-primary inline-flex w-full items-center justify-center gap-2 text-xs"
              >
                Launch Framework Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pre-Submission Audit Gates */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Regulatory Submission Pre-Audit Gates
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            to={`/${tenantCode}/accreditation/iiqa`}
            className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors block"
          >
            <h3 className="text-sm font-bold text-foreground">NAAC IIQA Gatekeeper</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Two-stage validation checking eligibility bars and 45-day SSR timeline requirements.
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-primary">
              Verify Eligibility →
            </span>
          </Link>

          <Link
            to={`/${tenantCode}/accreditation/dvv`}
            className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors block"
          >
            <h3 className="text-sm font-bold text-foreground">DVV Pre-Audit Simulation</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Compares declared figures against real computed records to prevent deviations and penalties.
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-primary">
              Simulate DVV →
            </span>
          </Link>

          <Link
            to={`/${tenantCode}/accreditation/po-attainment`}
            className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors block"
          >
            <h3 className="text-sm font-bold text-foreground">NBA Attainment Engine</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Computes L0-L3 achievement levels across all courses and exports formatted NBA SAR PDFs.
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-primary">
              View Attainment Heatmap →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
