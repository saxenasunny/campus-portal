import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Users, Mail, Phone, BookOpen } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function HODFacultyPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const facultyList = [
    { name: 'Prof. Aditya Nair', designation: 'Associate Professor', email: 'aditya.nair@gdgu.ac.in', qualification: 'Ph.D. (IIT Delhi)', exp: '12 Years', courses: 'Algorithms, Cloud Computing' },
    { name: 'Dr. Meenakshi Sundaram', designation: 'Professor', email: 'meenakshi.s@gdgu.ac.in', qualification: 'Ph.D. (IISc Bangalore)', exp: '18 Years', courses: 'DBMS, Distributed Systems' },
    { name: 'Dr. Rajesh Khanna', designation: 'Assistant Professor', email: 'rajesh.k@gdgu.ac.in', qualification: 'Ph.D. (BITS Pilani)', exp: '7 Years', courses: 'Discrete Math, Automata' },
    { name: 'Prof. Sunita Rao', designation: 'Assistant Professor', email: 'sunita.rao@gdgu.ac.in', qualification: 'M.Tech, Ph.D. Pursuing', exp: '9 Years', courses: 'Computer Networks' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Faculty Directory"
        description="Department of Computer Science & Engineering • Faculty Profiles & Workload"
        breadcrumbs={[
          { label: 'HOD', href: `/${tenantCode}` },
          { label: 'Faculty Workload' },
        ]}
      />

      <div className="card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Faculty Member</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Active Teaching Assignments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {facultyList.map((f, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-xs text-foreground">{f.name}</p>
                    <span className="text-[11px] text-muted-foreground">{f.email}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{f.designation}</td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{f.qualification}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{f.exp}</td>
                  <td className="px-4 py-3.5 text-xs text-primary font-medium">{f.courses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
