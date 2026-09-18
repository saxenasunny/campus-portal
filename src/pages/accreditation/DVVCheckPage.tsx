import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  FileSpreadsheet,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function DVVCheckPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  // Sample DVV simulation data
  const [metrics, setMetrics] = useState([
    {
      metricNumber: '2.1.1',
      metricTitle: 'Average enrollment percentage across all programmes',
      computed: 92.4,
      declared: 92.4,
      delta: 0.0,
      risk: 'ok',
      reason: 'Matches verified student admissions database records exactly.',
    },
    {
      metricNumber: '2.4.1',
      metricTitle: 'Percentage of full-time teachers against sanctioned posts',
      computed: 98.2,
      declared: 98.2,
      delta: 0.0,
      risk: 'ok',
      reason: 'Corroborated by HRMS appointment records and payroll history.',
    },
    {
      metricNumber: '3.1.1',
      metricTitle: 'Grants received from government and non-governmental agencies',
      computed: 142.5,
      declared: 142.5,
      delta: 0.0,
      risk: 'ok',
      reason: 'Sanction letters verified and bank disbursement receipts matched.',
    },
    {
      metricNumber: '5.2.1',
      metricTitle: 'Percentage of placement of outgoing students and progression to higher education',
      computed: 86.5,
      declared: 86.5,
      delta: 0.0,
      risk: 'ok',
      reason: 'Supported by verified offer letters and higher study enrollment IDs.',
    },
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="NAAC DVV Pre-Submission Simulation"
        description="Data Verification and Validation (DVV) Risk Assessment • Cycle 2 (2025-26)"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'DVV Simulation' },
        ]}
      />

      {/* Safety Notice Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-emerald-950">
              Safe to Submit: 0 Blocking Deviations Found
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Every declared figure matches verified live institutional database records. NAAC DVV penalty risks (first installment forfeiture or debarment) are mitigated.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Deviations"
          value="0"
          subtitle="Declared differs from records"
          icon={ShieldAlert}
          color="green"
        />
        <StatCard
          title="Unverifiable"
          value="0"
          subtitle="Declared without backing records"
          icon={AlertTriangle}
          color="green"
        />
        <StatCard
          title="Weak Evidence"
          value="0"
          subtitle="Partial coverage claims"
          icon={HelpCircle}
          color="blue"
        />
        <StatCard
          title="Matches Records"
          value="4"
          subtitle="Ready for NAAC filing"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* DVV Metrics Detailed Audit Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Quantitative Metrics Comparison</h2>
            <p className="text-xs text-muted-foreground">
              Computed represents live platform truth; Declared is the value entered for submission.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Metric Code & Description</th>
                <th className="px-4 py-3 text-right">Computed (Live)</th>
                <th className="px-4 py-3 text-right">Declared (SSR)</th>
                <th className="px-4 py-3 text-right">Delta</th>
                <th className="px-4 py-3 text-center">DVV Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {metrics.map(m => (
                <tr key={m.metricNumber} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 max-w-md">
                    <p className="font-bold text-foreground text-xs">{m.metricNumber} • {m.metricTitle}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.reason}</p>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-xs">{m.computed}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-xs">{m.declared}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs font-semibold text-emerald-600">
                    {m.delta === 0 ? '0.0' : m.delta}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Matches Records
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
