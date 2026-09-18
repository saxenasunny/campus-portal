import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, BarChart3, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function COAttainmentPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const cos = [
    { code: 'CO1', target: '60%', attained: '84%', level: 'L3', status: 'Exceeded' },
    { code: 'CO2', target: '60%', attained: '79%', level: 'L2', status: 'Attained' },
    { code: 'CO3', target: '60%', attained: '91%', level: 'L3', status: 'Exceeded' },
    { code: 'CO4', target: '60%', attained: '66%', level: 'L2', status: 'Attained' },
    { code: 'CO5', target: '60%', attained: '72%', level: 'L2', status: 'Attained' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Outcome (CO) Attainment Drilldown"
        description="CSE-401: Design & Analysis of Algorithms • Student Level Attainment Computation"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'CO Attainment' },
        ]}
      />

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> CO Attainment Status
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Course Outcome</th>
                <th className="px-4 py-3 text-center">Target Threshold</th>
                <th className="px-4 py-3 text-center">Actual Attainment</th>
                <th className="px-4 py-3 text-center">Level Achieved</th>
                <th className="px-4 py-3 text-center">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {cos.map(c => (
                <tr key={c.code} className="hover:bg-muted/10">
                  <td className="px-4 py-3 font-bold font-mono text-xs">{c.code}</td>
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">{c.target}</td>
                  <td className="px-4 py-3 text-center text-xs font-bold text-emerald-600 font-mono">{c.attained}</td>
                  <td className="px-4 py-3 text-center text-xs font-semibold">{c.level}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
