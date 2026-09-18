import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
  Building,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function IIQACheckPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const eligibilityChecks = [
    { title: 'AISHE Code Registered', status: 'Passed', detail: 'AISHE ID: U-0174 verified with MHRD portal.' },
    { title: 'HEI Statutory Status', status: 'Passed', detail: 'State Private University established under Haryana Act.' },
    { title: 'UGC 2(f) Recognition', status: 'Passed', detail: 'University Grants Commission Gazette recognition verified.' },
    { title: 'Graduated Batches Requirement', status: 'Passed', detail: 'Minimum 2 batches have completed full degree programmes.' },
    { title: 'IQAC Cell Formally Constituted', status: 'Passed', detail: 'IQAC committee active with external stakeholders & regular minutes.' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="NAAC IIQA Eligibility & Readiness Check"
        description="Institutional Information for Quality Assessment Gatekeeper • NAAC 2022 Manual Guidelines"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'IIQA Check' },
        ]}
      />

      {/* Primary Status Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-emerald-950">
              Institution Status: READY TO FILE IIQA
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed">
              All 5 statutory eligibility conditions mandated by NAAC are fully satisfied. The institution can file the formal IIQA online without risk of immediate administrative rejection.
            </p>
          </div>
        </div>
      </div>

      {/* 45-Day SSR Window Calculator */}
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              45-Day Self Study Report (SSR) Statutory Deadline Calculator
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              If the IIQA were submitted and accepted today (18 Sep 2026), the final SSR submission window closes on:
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Calculated SSR Filing Deadline:</span>
          <span className="text-sm font-extrabold text-primary font-mono">02 November 2026 (45 Days)</span>
        </div>
      </div>

      {/* Detailed Check Items */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Statutory Eligibility Checklist (Stage 1)
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {eligibilityChecks.map((c, i) => (
            <div key={i} className="flex items-start justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <h3 className="text-xs font-bold text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
