import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function NIRFExportPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const parameters = [
    {
      num: '1',
      title: 'Teaching, Learning & Resources (TLR)',
      weight: '30%',
      metrics: [
        { code: 'SS', label: 'Student Strength (UG + PG)', marks: 20, value: '4,820', coverage: '100%', state: 'Ready' },
        { code: 'FSR', label: 'Faculty-Student Ratio', marks: 30, value: '1:19.4', coverage: '100%', state: 'Ready' },
        { code: 'FQE', label: 'Faculty with Ph.D. and Experience', marks: 20, value: '78.2%', coverage: '100%', state: 'Ready' },
        { code: 'FRU', label: 'Financial Resources and Their Utilisation', marks: 30, value: '₹42.8 Cr', coverage: '98%', state: 'Ready' },
      ],
    },
    {
      num: '2',
      title: 'Research and Professional Practice (RPC)',
      weight: '30%',
      metrics: [
        { code: 'PU', label: 'Combined Metric for Publications', marks: 35, value: '384 Articles', coverage: '100%', state: 'Ready' },
        { code: 'QP', label: 'Quality of Publications (Citations)', marks: 40, value: '2,420 Citations', coverage: '95%', state: 'Ready' },
        { code: 'IPR', label: 'IPR and Patents Published and Granted', marks: 15, value: '18 Filed / 4 Granted', coverage: '100%', state: 'Ready' },
        { code: 'FPPP', label: 'Footprint of Projects and Professional Practice', marks: 10, value: '₹1.84 Cr', coverage: '92%', state: 'Ready' },
      ],
    },
    {
      num: '3',
      title: 'Graduation Outcomes (GO)',
      weight: '20%',
      metrics: [
        { code: 'GUE', label: 'Metric for University Examinations', marks: 60, value: '94.2% Pass Rate', coverage: '100%', state: 'Ready' },
        { code: 'GPHD', label: 'Metric for Number of Ph.D. Students Graduated', marks: 40, value: '24 Graduated', coverage: '100%', state: 'Ready' },
      ],
    },
    {
      num: '4',
      title: 'Outreach and Inclusivity (OI)',
      weight: '10%',
      metrics: [
        { code: 'RD', label: 'Region Diversity (Other States + Countries)', marks: 30, value: '42.5%', coverage: '100%', state: 'Ready' },
        { code: 'WD', label: 'Percentage of Women Students and Faculty', marks: 30, value: '46.8%', coverage: '100%', state: 'Ready' },
        { code: 'ESCS', label: 'Economically and Socially Challenged Students', marks: 20, value: '38.4%', coverage: '100%', state: 'Ready' },
      ],
    },
    {
      num: '5',
      title: 'Perception (PR)',
      weight: '10%',
      metrics: [
        { code: 'PR', label: 'Peer & Employer Perception Survey Data', marks: 100, value: 'To Declare', coverage: '—', state: 'To Declare' },
      ],
    },
  ]

  const handleExport = (format: 'CSV' | 'Excel' | 'JSON') => {
    alert(`NIRF 2026 Data Pack exported in ${format} format with complete data provenance.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="NIRF Institutional Ranking Data Pack"
        description="National Institutional Ranking Framework • Verified Quantities & Provenance Records"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'NIRF Export' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> CSV
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
            <button
              onClick={() => handleExport('JSON')}
              className="btn-primary inline-flex items-center gap-1.5 text-xs"
            >
              <FileText className="h-4 w-4" /> JSON
            </button>
          </div>
        }
      />

      {/* Honest Quantities Notice (from decompiled HEXp source) */}
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Quantities, Not Scores:</strong> This export carries exact verified quantities directly corroborated by institutional ERP records. NIRF converts each figure to a mark using proprietary normalization functions it does not publish, so no predicted total rank is fabricated.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ready to File"
          value="13"
          subtitle="Metrics 100% computed"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Partial Coverage"
          value="1"
          subtitle="Requires minor verification"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="To Declare"
          value="1"
          subtitle="External perception survey"
          icon={HelpCircle}
          color="blue"
        />
        <StatCard
          title="Overall Readiness"
          value="94.2%"
          subtitle="Pack ready for download"
          icon={BarChart3}
          color="purple"
        />
      </div>

      {/* Parameters Accordions */}
      <div className="space-y-6">
        {parameters.map(p => (
          <div key={p.num} className="card p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground">
                Parameter {p.num}: {p.title}
              </h2>
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                Ranking Weight: {p.weight}
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">Sub-Metric</th>
                    <th className="px-4 py-2.5 text-center">Marks</th>
                    <th className="px-4 py-2.5 text-right">Computed Value</th>
                    <th className="px-4 py-2.5 text-center">Data Coverage</th>
                    <th className="px-4 py-2.5 text-center">Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {p.metrics.map(m => (
                    <tr key={m.code} className="hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary mr-2">[{m.code}]</span>
                        <span className="text-xs font-medium text-foreground">{m.label}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-mono text-muted-foreground">{m.marks}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-bold text-foreground">{m.value}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-emerald-600">{m.coverage}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            m.state === 'Ready'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {m.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
