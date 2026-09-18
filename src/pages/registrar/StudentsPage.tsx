import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Users, Plus, Download, Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function StudentsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [searchTerm, setSearchTerm] = useState('')

  const students = [
    { roll: 'GDGU2023CSE001', name: 'Aarav Sharma', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active' },
    { roll: 'GDGU2023CSE002', name: 'Ananya Gupta', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active' },
    { roll: 'GDGU2023CSE003', name: 'Aryan Varma', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active' },
    { roll: 'GDGU2023CSE004', name: 'Diya Patel', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active' },
    { roll: 'GDGU2022ME001', name: 'Rohan Joshi', prog: 'B.Tech ME', sem: 6, batch: '2022-26', status: 'Active' },
    { roll: 'GDGU2024MBA012', name: 'Neha Singh', prog: 'MBA', sem: 2, batch: '2024-26', status: 'Active' },
  ]

  const filtered = students.filter(
    s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Roster & Directory"
        description="University Registry • 4,820 Actively Enrolled Students"
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Students' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
              <Plus className="h-4 w-4" /> Enroll New Student
            </button>
          </div>
        }
      />

      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="relative w-72">
            <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-4 w-4 text-slate-400 my-auto" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} Students Listed</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Enrollment ID</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3 text-center">Semester</th>
                <th className="px-4 py-3 text-center">Batch</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(s => (
                <tr key={s.roll} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5 font-mono text-xs text-primary font-semibold">{s.roll}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-foreground">{s.name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{s.prog}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs">{s.sem}</td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">{s.batch}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      {s.status}
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
