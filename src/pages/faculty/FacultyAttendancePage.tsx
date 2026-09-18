import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, CheckCircle2, QrCode, Save } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function FacultyAttendancePage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const [students, setStudents] = useState([
    { id: '1', roll: 'GDGU2023CSE001', name: 'Aarav Sharma', status: 'present' },
    { id: '2', roll: 'GDGU2023CSE002', name: 'Ananya Gupta', status: 'present' },
    { id: '3', roll: 'GDGU2023CSE003', name: 'Aryan Varma', status: 'absent' },
    { id: '4', roll: 'GDGU2023CSE004', name: 'Diya Patel', status: 'present' },
    { id: '5', roll: 'GDGU2023CSE005', name: 'Kabir Singh', status: 'present' },
  ])

  const toggleStatus = (id: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
      )
    )
  }

  const handleSave = () => {
    alert('Attendance successfully recorded and saved to institutional database.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Attendance Marking"
        description="CSE-401: Design & Analysis of Algorithms • Date: Today (18 Sep 2026)"
        breadcrumbs={[
          { label: 'Faculty', href: `/${tenantCode}` },
          { label: 'Attendance' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
              <QrCode className="h-4 w-4" /> Generate QR Code
            </button>
            <button onClick={handleSave} className="btn-primary inline-flex items-center gap-1.5 text-xs">
              <Save className="h-4 w-4" /> Save Attendance
            </button>
          </div>
        }
      />

      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground">Student Roster (CSE 2023 Sec A)</h2>
          <span className="text-xs font-semibold text-emerald-600">
            {students.filter(s => s.status === 'present').length} Present / {students.length} Total
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs">{s.roll}</td>
                  <td className="px-4 py-3 text-xs font-bold text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        s.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(s.id)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Toggle
                    </button>
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
