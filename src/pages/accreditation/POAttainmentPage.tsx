import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Award,
  Download,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileSpreadsheet,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function POAttainmentPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const poList = [
    {
      number: 'PO1',
      title: 'Engineering Knowledge',
      description: 'Apply knowledge of mathematics, science, engineering fundamentals to solve complex engineering problems.',
      studentCount: 184,
      pctAtTarget: 88,
      avgAttainment: 82,
      distribution: { l0: 4, l1: 18, l2: 92, l3: 70 },
      isMet: true,
    },
    {
      number: 'PO2',
      title: 'Problem Analysis',
      description: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions.',
      studentCount: 184,
      pctAtTarget: 82,
      avgAttainment: 76,
      distribution: { l0: 6, l1: 27, l2: 95, l3: 56 },
      isMet: true,
    },
    {
      number: 'PO3',
      title: 'Design & Development of Solutions',
      description: 'Design solutions for complex engineering problems and design system components or processes that meet the specified needs.',
      studentCount: 184,
      pctAtTarget: 79,
      avgAttainment: 74,
      distribution: { l0: 8, l1: 30, l2: 98, l3: 48 },
      isMet: true,
    },
    {
      number: 'PO4',
      title: 'Conduct Investigations of Complex Problems',
      description: 'Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data.',
      studentCount: 184,
      pctAtTarget: 68,
      avgAttainment: 66,
      distribution: { l0: 12, l1: 46, l2: 84, l3: 42 },
      isMet: true,
    },
    {
      number: 'PO5',
      title: 'Modern Tool Usage',
      description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.',
      studentCount: 184,
      pctAtTarget: 91,
      avgAttainment: 85,
      distribution: { l0: 2, l1: 14, l2: 88, l3: 80 },
      isMet: true,
    },
    {
      number: 'PO6',
      title: 'The Engineer and Society',
      description: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues.',
      studentCount: 184,
      pctAtTarget: 54,
      avgAttainment: 52,
      distribution: { l0: 22, l1: 62, l2: 72, l3: 28 },
      isMet: false, // Target is 60%
    },
  ]

  const handleExportPDF = () => {
    alert('NBA Program Outcome Attainment Report PDF generated according to NBA SAR format.')
  }

  const handleExportExcel = () => {
    alert('PO Attainment dataset exported to XLSX.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="NBA Programme Outcome (PO) Attainment Engine"
        description="B.Tech Computer Science & Engineering • Assessment Window: CAY (2025-26)"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'PO Attainment' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export XLSX
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Download className="h-4 w-4" /> Generate NBA SAR PDF
            </button>
          </div>
        }
      />

      {/* Target Parameters Note */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="h-5 w-5 text-blue-700 shrink-0" />
          <p className="text-xs text-blue-950">
            <strong>Target Threshold:</strong> Minimum <strong>Level 2 (L2+)</strong> attainment by ≥ <strong>60% of students evaluated</strong>.
          </p>
        </div>
        <span className="rounded-md bg-blue-200/60 px-2.5 py-1 text-xs font-bold text-blue-900">
          5 / 6 POs Attained
        </span>
      </div>

      {/* Attainment Heatmap Cards */}
      <div className="space-y-4">
        {poList.map(po => (
          <div
            key={po.number}
            className={`card p-5 border-l-4 ${po.isMet ? 'border-l-emerald-500' : 'border-l-amber-500'}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary font-mono">
                    {po.number}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{po.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      po.isMet ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {po.isMet ? 'Target Met' : 'Below Target'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {po.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-foreground">{po.pctAtTarget}%</span>
                <p className="text-[10px] text-muted-foreground">Students at L2+ Target</p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded bg-slate-50 p-2 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500">L0 (No Attainment)</span>
                  <p className="text-sm font-bold text-slate-700">{po.distribution.l0} students</p>
                </div>
                <div className="rounded bg-amber-50 p-2 border border-amber-200">
                  <span className="text-[10px] font-semibold text-amber-600">L1 (Partial)</span>
                  <p className="text-sm font-bold text-amber-800">{po.distribution.l1} students</p>
                </div>
                <div className="rounded bg-emerald-50 p-2 border border-emerald-200">
                  <span className="text-[10px] font-semibold text-emerald-600">L2 (Target Met)</span>
                  <p className="text-sm font-bold text-emerald-800">{po.distribution.l2} students</p>
                </div>
                <div className="rounded bg-indigo-50 p-2 border border-indigo-200">
                  <span className="text-[10px] font-semibold text-indigo-600">L3 (Exceeded)</span>
                  <p className="text-sm font-bold text-indigo-800">{po.distribution.l3} students</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
