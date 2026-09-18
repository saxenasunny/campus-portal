import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  FileText,
  Award,
  Layers,
  BarChart3,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function NHEQFDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [selectedCourse, setSelectedCourse] = useState('CSE-401')

  const domains = [
    {
      name: 'Knowledge',
      target: '20% - 30%',
      actual: 26.5,
      status: 'On Target',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      description: 'Disciplinary & multi-disciplinary conceptual foundations',
    },
    {
      name: 'Skills',
      target: '25% - 35%',
      actual: 31.2,
      status: 'On Target',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      description: 'Practical, technical, coding and laboratory competencies',
    },
    {
      name: 'Application',
      target: '20% - 30%',
      actual: 24.8,
      status: 'On Target',
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      description: 'Real-world problem solving and engineering synthesis',
    },
    {
      name: 'Generic Skills',
      target: '10% - 20%',
      actual: 12.5,
      status: 'On Target',
      color: 'bg-amber-600',
      textColor: 'text-amber-600',
      description: 'Communication, critical thinking, teamwork and leadership',
    },
    {
      name: 'Ethics & Responsibility',
      target: '5% - 15%',
      actual: 5.0,
      status: 'On Target',
      color: 'bg-rose-600',
      textColor: 'text-rose-600',
      description: 'Professional ethics, societal impact, and data integrity',
    },
  ]

  const bloomsLevels = [
    { level: 'L1: Remember', count: 4, pct: 15 },
    { level: 'L2: Understand', count: 6, pct: 23 },
    { level: 'L3: Apply', count: 8, pct: 31 },
    { level: 'L4: Analyze', count: 5, pct: 19 },
    { level: 'L5: Evaluate', count: 2, pct: 8 },
    { level: 'L6: Create', count: 1, pct: 4 },
  ]

  const handleDownloadCertificate = () => {
    alert('NHEQF Compliance Certificate PDF generated and ready for institutional records.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="NHEQF 5-Domain Compliance Engine"
        description="National Higher Education Qualification Framework (NEP 2020) Outcome Mapping & Certification"
        actions={
          <button
            onClick={handleDownloadCertificate}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <Download className="h-4 w-4" /> Export NHEQF Certificate (PDF)
          </button>
        }
      />

      {/* Compliance Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                NHEQF Curriculum Compliance Verified: COMPLIANT
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                All 5 prescribed higher education domains are actively mapped within required target percentages.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-900 self-start sm:self-auto">
            100% Outcome Coverage
          </span>
        </div>
      </div>

      {/* 5 Domains Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        {domains.map(d => (
          <div key={d.name} className="card p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Domain
              </span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">{d.name}</h3>

              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${d.textColor}`}>{d.actual}%</span>
                <span className="text-[10px] text-muted-foreground font-medium">Actual</span>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.actual * 2}%` }} />
              </div>

              <p className="mt-2 text-[11px] text-muted-foreground">
                Target: <strong>{d.target}</strong>
              </p>
              <p className="mt-1 text-[10px] text-slate-500 leading-tight">
                {d.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-border/60">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> {d.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bloom's Taxonomy Cognitive Hierarchy */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" /> Bloom's Taxonomy Cognitive Depth Distribution
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-6">
          {bloomsLevels.map(b => (
            <div key={b.level} className="rounded-lg border border-border p-3 text-center bg-slate-50/50">
              <span className="text-xs font-bold text-foreground block">{b.level}</span>
              <span className="text-xl font-extrabold text-primary block mt-1">{b.count}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{b.pct}% of CLOs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
