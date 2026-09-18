import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, CheckCircle2, ShieldAlert, Sparkles, Download, Layers } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function NAACADashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const criteria = [
    { num: '1', title: 'Curricular Aspects', weight: 150, score: '138 / 150', status: 'Ready' },
    { num: '2', title: 'Teaching-Learning and Evaluation', weight: 200, score: '184 / 200', status: 'Ready' },
    { num: '3', title: 'Research, Innovations and Extension', weight: 250, score: '228 / 250', status: 'Ready' },
    { num: '4', title: 'Infrastructure and Learning Resources', weight: 100, score: '94 / 100', status: 'Ready' },
    { num: '5', title: 'Student Support and Progression', weight: 100, score: '91 / 100', status: 'Ready' },
    { num: '6', title: 'Governance, Leadership and Management', weight: 100, score: '88 / 100', status: 'Ready' },
    { num: '7', title: 'Institutional Values and Best Practices', weight: 100, score: '92 / 100', status: 'Ready' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="NAAC Self-Study Report (SSR) Suite"
        description="University Manual 2022 Framework • 7 Criteria Institutional Telemetry"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'NAAC SSR Suite' },
        ]}
        actions={
          <Link
            to={`/${tenantCode}/accreditation/dvv`}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <ShieldAlert className="h-4 w-4" /> Run DVV Pre-Audit Simulation
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projected CGPA" value="3.65" subtitle="Estimated Grade A++" icon={Award} color="green" />
        <StatCard title="Total Criteria" value="7" subtitle="Fully populated from ERP" icon={Layers} color="indigo" />
        <StatCard title="Qualitative Metrics" value="100%" subtitle="Narratives & evidence ready" icon={CheckCircle2} color="blue" />
        <StatCard title="DVV Risk" value="Low" subtitle="0 blocking deviations" icon={Sparkles} color="green" />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Criteria Scorecard Breakdown
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Criterion</th>
                <th className="px-4 py-3 text-center">Weightage</th>
                <th className="px-4 py-3 text-right">Estimated Score</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {criteria.map(c => (
                <tr key={c.num} className="hover:bg-muted/10">
                  <td className="px-4 py-3">
                    <span className="font-bold text-xs text-primary mr-2">Criterion {c.num}:</span>
                    <span className="text-xs font-semibold text-foreground">{c.title}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">{c.weight}</td>
                  <td className="px-4 py-3 text-right text-xs font-mono font-bold text-emerald-600">{c.score}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
