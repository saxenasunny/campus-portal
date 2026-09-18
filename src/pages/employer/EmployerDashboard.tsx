import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Briefcase, Users, Calendar, Award } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function EmployerDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employer Partner Portal"
        description="Recruitment, Talent Discovery & Interview Scheduling • GD Goenka University"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/employer/jobs/new`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Briefcase className="h-4 w-4" /> Post New Job / Internship
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Listings"
          value="4"
          subtitle="Open for applications"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Total Applicants"
          value="248"
          subtitle="GDGU verified students"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Shortlisted"
          value="42"
          subtitle="Ready for technical rounds"
          icon={Award}
          color="green"
        />
        <StatCard
          title="Upcoming Drive"
          value="25 Sep"
          subtitle="On-Campus / Virtual"
          icon={Calendar}
          color="purple"
        />
      </div>

      <div className="card p-5">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
          Your Active Job Postings
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {[
            { title: 'Software Development Engineer - I', type: 'Full-Time', ctc: '₹14-18 LPA', applicants: 114, status: 'Open' },
            { title: 'Cloud Infrastructure Intern', type: 'Internship', ctc: '₹35,000/mo', applicants: 86, status: 'Open' },
            { title: 'Data Analyst Graduate Trainee', type: 'Full-Time', ctc: '₹10-12 LPA', applicants: 48, status: 'Reviewing' },
          ].map((j, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <h3 className="text-xs font-bold text-foreground">{j.title}</h3>
                <p className="text-xs text-muted-foreground">{j.type} • Package: <strong className="text-foreground">{j.ctc}</strong></p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary">{j.applicants} Applicants</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  {j.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
