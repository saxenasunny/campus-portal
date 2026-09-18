import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building, Globe, Mail, Phone, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function CompaniesPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const companies = [
    { name: 'Microsoft India', industry: 'Software & Cloud Computing', website: 'https://careers.microsoft.com', hr: 'Anjali Menon (Campus Lead)', hires: 18 },
    { name: 'Amazon Web Services', industry: 'Cloud & Internet Services', website: 'https://amazon.jobs', hr: 'Vikram Sethi', hires: 14 },
    { name: 'Deloitte USI', industry: 'Management & Tech Consulting', website: 'https://deloitte.com', hr: 'Pooja Nair', hires: 32 },
    { name: 'Tata Consultancy Services', industry: 'IT Services & Consulting', website: 'https://tcs.com', hr: 'Ramesh Sundaram', hires: 64 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Recruiting Partners"
        description="Partner Companies, Industry Tie-ups & Historical Campus Hiring"
        breadcrumbs={[
          { label: 'Placement', href: `/${tenantCode}/placement` },
          { label: 'Recruiting Partners' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add Partner Company
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {companies.map((c, i) => (
          <div key={i} className="card p-5">
            <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
            <p className="text-xs text-muted-foreground">{c.industry}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <p>HR Contact: <strong>{c.hr}</strong></p>
              <p>Historical Hires: <strong className="text-emerald-700">{c.hires} GDGU Alumni</strong></p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <Globe className="h-3.5 w-3.5" /> Company Portal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
