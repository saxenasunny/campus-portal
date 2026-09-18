import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Briefcase, Plus, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function JobPostingsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const jobs = [
    { title: 'Software Engineer - Cloud & Backend', company: 'Amazon Web Services', ctc: '₹22 - 26 LPA', loc: 'Hyderabad / Gurugram', type: 'Full-Time', deadline: '25 Sep 2026' },
    { title: 'Associate Consultant - Data Analytics', company: 'PwC India', ctc: '₹11 - 14 LPA', loc: 'Gurugram', type: 'Full-Time', deadline: '30 Sep 2026' },
    { title: 'Machine Learning Research Intern', company: 'Google Research India', ctc: '₹60,000 / Month', loc: 'Bengaluru', type: 'Internship', deadline: '05 Oct 2026' },
    { title: 'Full-Stack Developer (React & Node.js)', company: 'Zomato', ctc: '₹16 - 20 LPA', loc: 'Gurugram', type: 'Full-Time', deadline: '10 Oct 2026' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Job & Internship Opportunities"
        description="Active Career Postings • Batch of 2026 Placement Season"
        breadcrumbs={[
          { label: 'Placement', href: `/${tenantCode}/placement` },
          { label: 'Job Postings' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Create New Posting
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {jobs.map((j, i) => (
          <div key={i} className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {j.company}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {j.type}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-3">{j.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {j.loc}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-base font-extrabold text-emerald-600 font-mono">{j.ctc}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Deadline: <strong>{j.deadline}</strong></span>
              <button className="btn-primary text-[11px] py-1 px-3">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
