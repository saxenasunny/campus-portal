import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layers, Plus, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function PLOManagementPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const pos = [
    { code: 'PO1', title: 'Engineering Knowledge', domain: 'Knowledge' },
    { code: 'PO2', title: 'Problem Analysis', domain: 'Application' },
    { code: 'PO3', title: 'Design/Development of Solutions', domain: 'Skills' },
    { code: 'PO4', title: 'Conduct Investigations of Complex Problems', domain: 'Application' },
    { code: 'PO5', title: 'Modern Tool Usage', domain: 'Skills' },
    { code: 'PO6', title: 'The Engineer and Society', domain: 'Ethics & Responsibility' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programme Outcome (PO / PLO) Management"
        description="B.Tech Computer Science & Engineering • Graduate Attribute Mapping"
        breadcrumbs={[
          { label: 'Accreditation', href: `/${tenantCode}/accreditation` },
          { label: 'PLO Management' },
        ]}
      />

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" /> Graduate Attributes & Programme Outcomes
        </h2>
        <div className="mt-4 divide-y divide-border/60">
          {pos.map(p => (
            <div key={p.code} className="flex items-center justify-between py-3">
              <div>
                <span className="font-mono text-xs font-bold text-primary mr-2">[{p.code}]</span>
                <span className="text-xs font-semibold text-foreground">{p.title}</span>
              </div>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {p.domain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
