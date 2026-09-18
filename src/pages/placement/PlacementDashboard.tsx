import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Briefcase,
  Building,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function PlacementDashboard() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corporate Resource Centre (Placement)"
        description="Campus Placements, Internships & Industry Partnerships • Batch of 2026"
        actions={
          <div className="flex items-center gap-2">
            <Link
              to={`/${tenantCode}/placement/jobs`}
              className="btn-primary inline-flex items-center gap-2 text-xs"
            >
              <Briefcase className="h-4 w-4" /> Post New Opportunity
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Placement Rate"
          value="86.5%"
          subtitle="412 of 476 eligible placed"
          icon={Award}
          color="green"
        />
        <StatCard
          title="Highest Package"
          value="₹32.5 LPA"
          subtitle="TechCorp Global (Product)"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Average CTC"
          value="₹8.4 LPA"
          subtitle="+14% YoY increase"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Partner Companies"
          value="142"
          subtitle="Actively recruiting on campus"
          icon={Building}
          color="purple"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground">Active Campus Drives This Month</h2>
            <Link to={`/${tenantCode}/placement/drives`} className="text-xs text-primary font-semibold hover:underline">
              All Drives →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { company: 'Microsoft India', role: 'Software Development Engineer', ctc: '₹28 LPA', date: '25 Sep 2026', applicants: 84 },
              { company: 'Deloitte USI', role: 'Technology Consultant', ctc: '₹12 LPA', date: '28 Sep 2026', applicants: 142 },
              { company: 'Tata Consultancy Services', role: 'Digital Innovator', ctc: '₹9 LPA', date: '02 Oct 2026', applicants: 210 },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{d.company}</h3>
                  <p className="text-xs text-muted-foreground">{d.role} • CTC: <strong className="text-foreground">{d.ctc}</strong></p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {d.date}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">{d.applicants} Applied</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
            Quick Actions
          </h2>
          <div className="mt-3 space-y-2">
            <Link
              to={`/${tenantCode}/placement/companies`}
              className="flex items-center justify-between rounded-lg border border-border p-2.5 text-xs font-medium hover:bg-muted"
            >
              <span>Manage Recruiting Partners</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to={`/${tenantCode}/placement/jobs`}
              className="flex items-center justify-between rounded-lg border border-border p-2.5 text-xs font-medium hover:bg-muted"
            >
              <span>View All Job Postings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
