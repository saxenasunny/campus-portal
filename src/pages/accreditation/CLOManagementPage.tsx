import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layers, Plus, Sparkles, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function CLOManagementPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const clos = [
    { code: 'CO1', text: 'Analyze asymptotic performance of algorithms using standard notations.', bloom: 'Analyze (L4)', domain: 'Knowledge (25%)', methods: 'Internal Exam, Quiz' },
    { code: 'CO2', text: 'Apply divide-and-conquer and dynamic programming paradigms to computational problems.', bloom: 'Apply (L3)', domain: 'Application (25%)', methods: 'Lab Exam, Assignments' },
    { code: 'CO3', text: 'Synthesize graph algorithms for minimum spanning trees and shortest path discovery.', bloom: 'Create (L6)', domain: 'Skills (30%)', methods: 'Project Evaluation, Lab' },
    { code: 'CO4', text: 'Evaluate NP-complete and intractable problems using reduction techniques.', bloom: 'Evaluate (L5)', domain: 'Generic Skills (10%)', methods: 'Viva-Voce, End-Term Exam' },
    { code: 'CO5', text: 'Demonstrate ethical computing standards and intellectual property integrity in software synthesis.', bloom: 'Understand (L2)', domain: 'Ethics (10%)', methods: 'Case Study, Seminar' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Learning Outcome (CLO / CO) Management"
        description="CSE-401: Design & Analysis of Algorithms • NHEQF & Bloom's Taxonomy Mapping"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'CLO Management' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="btn-primary inline-flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4" /> AI CLO Generator
            </button>
            <button className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add CO
            </button>
          </div>
        }
      />

      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Defined Course Learning Outcomes
          </h2>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            5 / 5 NHEQF Domains Covered
          </span>
        </div>

        <div className="mt-4 divide-y divide-border/60">
          {clos.map(c => (
            <div key={c.code} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary font-mono">
                  {c.code}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {c.bloom}
                  </span>
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
                    {c.domain}
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-foreground leading-relaxed">{c.text}</p>
              <p className="text-[11px] text-muted-foreground">
                Assessment Tools: <strong className="text-slate-700">{c.methods}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
