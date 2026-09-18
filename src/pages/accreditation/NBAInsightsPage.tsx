import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Award,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Building,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function NBAInsightsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [activeTab, setActiveTab] = useState<'programmes' | 'faculty'>('programmes')

  const programmes = [
    {
      name: 'B.Tech Computer Science & Engineering',
      code: 'CSE-UG',
      posMet: '10 / 12 (83%)',
      cosMet: '94%',
      placementRate: '88.5%',
      sfr: '1:18.2',
      tier: 'on_track',
      statusLabel: 'On Track',
    },
    {
      name: 'B.Tech Mechanical Engineering',
      code: 'ME-UG',
      posMet: '8 / 12 (66%)',
      cosMet: '82%',
      placementRate: '74.0%',
      sfr: '1:16.4',
      tier: 'at_risk',
      statusLabel: 'At Risk',
    },
    {
      name: 'B.Tech Civil Engineering',
      code: 'CE-UG',
      posMet: '5 / 12 (41%)',
      cosMet: '68%',
      placementRate: '62.5%',
      sfr: '1:15.0',
      tier: 'critical',
      statusLabel: 'Critical',
    },
  ]

  const facultyScorecard = [
    {
      name: 'Prof. Aditya Nair',
      designation: 'Assoc. Professor',
      department: 'CSE',
      publications: 14,
      citations: 284,
      q1Journals: 5,
      retracted: 0,
      grantsCount: 2,
      grantsAmount: '₹24.5 Lakh',
    },
    {
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Professor & HOD',
      department: 'CSE',
      publications: 28,
      citations: 642,
      q1Journals: 11,
      retracted: 0,
      grantsCount: 3,
      grantsAmount: '₹58.0 Lakh',
    },
    {
      name: 'Dr. Rajesh Khanna',
      designation: 'Assistant Professor',
      department: 'CSE',
      publications: 8,
      citations: 112,
      q1Journals: 2,
      retracted: 0,
      grantsCount: 1,
      grantsAmount: '₹8.0 Lakh',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="NBA Programme Risk & Faculty Scorecard"
        description="National Board of Accreditation Self-Assessment Readiness • Criterion 5 & Criterion 3 Telemetry"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'NBA Insights' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'programmes'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Programmes Risk Assessment
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'faculty'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Faculty Scorecard (Criterion 5)
        </button>
      </div>

      {activeTab === 'programmes' ? (
        <div className="card p-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
            Programmes Ranked by Evidence Readiness
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Degree Programme</th>
                  <th className="px-4 py-3 text-center">POs Met</th>
                  <th className="px-4 py-3 text-center">COs Attained</th>
                  <th className="px-4 py-3 text-center">Placement Rate</th>
                  <th className="px-4 py-3 text-center">S:F Ratio</th>
                  <th className="px-4 py-3 text-center">NBA Status Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {programmes.map(p => (
                  <tr key={p.code} className="hover:bg-muted/10">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-foreground text-xs">{p.name}</p>
                      <span className="font-mono text-[10px] text-muted-foreground">{p.code}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-xs">{p.posMet}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-xs text-emerald-600">{p.cosMet}</td>
                    <td className="px-4 py-3.5 text-center font-medium text-xs">{p.placementRate}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">{p.sfr}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.tier === 'on_track'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.tier === 'at_risk'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">
            Faculty Contributions, Citations & Research Grants (Criterion 5.4)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Faculty Member</th>
                  <th className="px-4 py-3 text-center">Publications</th>
                  <th className="px-4 py-3 text-center">Citations</th>
                  <th className="px-4 py-3 text-center">Q1 Indexed</th>
                  <th className="px-4 py-3 text-center">Funded Projects</th>
                  <th className="px-4 py-3 text-right">Grant Value (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {facultyScorecard.map((f, i) => (
                  <tr key={i} className="hover:bg-muted/10">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-foreground text-xs">{f.name}</p>
                      <span className="text-[10px] text-muted-foreground">{f.designation} • Dept. of {f.department}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-xs">{f.publications}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-xs text-blue-600">{f.citations}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                        {f.q1Journals}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-xs">{f.grantsCount}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-xs text-emerald-600">
                      {f.grantsAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
