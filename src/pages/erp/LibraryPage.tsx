import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Search, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function LibraryPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const materials = [
    { title: 'Introduction to Algorithms (4th Edition)', authors: 'Cormen, Leiserson, Rivest, Stein', isbn: '978-0262046305', type: 'Book', available: '6 / 8 Copies', rack: 'RACK-CS-04' },
    { title: 'Database System Concepts (7th Edition)', authors: 'Silberschatz, Korth, Sudarshan', isbn: '978-0078022159', type: 'Book', available: '4 / 6 Copies', rack: 'RACK-CS-02' },
    { title: 'IEEE Transactions on Software Engineering', authors: 'IEEE Computer Society', isbn: '0098-5589', type: 'Journal', available: 'Online Access', rack: 'E-RESOURCE' },
    { title: 'Computer Networks: A Systems Approach', authors: 'Peterson, Davie', isbn: '978-0123850591', type: 'Book', available: '3 / 5 Copies', rack: 'RACK-CS-06' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central University Library (OPAC)"
        description="Online Public Access Catalog & Digital Repository • GD Goenka University"
        breadcrumbs={[
          { label: 'Campus ERP', href: `/${tenantCode}` },
          { label: 'Library OPAC' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Printed Titles" value="48,200" subtitle="Volumes cataloged" icon={BookOpen} color="blue" />
        <StatCard title="E-Journals & Databases" value="8,500+" subtitle="IEEE, ScienceDirect, Scopus" icon={BookOpen} color="indigo" />
        <StatCard title="Circulation Status" value="Active" subtitle="RFID automated checkout" icon={CheckCircle2} color="green" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="relative w-80">
            <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-4 w-4 text-slate-400 my-auto" />
            <input
              type="text"
              placeholder="Search by title, author or ISBN..."
              className="block w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground">RFID Tracking Enabled</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Book Title / Material</th>
                <th className="px-4 py-3">Authors</th>
                <th className="px-4 py-3">ISBN / ISSN</th>
                <th className="px-4 py-3 text-center">Availability</th>
                <th className="px-4 py-3 text-center">Shelf Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {materials.map((m, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{m.title}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{m.authors}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{m.isbn}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-emerald-600">{m.available}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-primary font-semibold">{m.rack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
