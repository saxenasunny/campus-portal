import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Award, Save, Download } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function FacultyGradebookPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const [grades, setGrades] = useState([
    { roll: 'GDGU2023CSE001', name: 'Aarav Sharma', cia1: 28, cia2: 27, assignment: 19, total: 74, grade: 'A' },
    { roll: 'GDGU2023CSE002', name: 'Ananya Gupta', cia1: 30, cia2: 29, assignment: 20, total: 79, grade: 'A+' },
    { roll: 'GDGU2023CSE003', name: 'Aryan Varma', cia1: 22, cia2: 24, assignment: 16, total: 62, grade: 'B+' },
    { roll: 'GDGU2023CSE004', name: 'Diya Patel', cia1: 29, cia2: 28, assignment: 19, total: 76, grade: 'A+' },
    { roll: 'GDGU2023CSE005', name: 'Kabir Singh', cia1: 24, cia2: 25, assignment: 17, total: 66, grade: 'B+' },
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Continuous Internal Assessment (CIA) Gradebook"
        description="CSE-401: Design & Analysis of Algorithms • Component Marks & Grade Computation"
        breadcrumbs={[
          { label: 'Faculty', href: `/${tenantCode}` },
          { label: 'Gradebook' },
        ]}
        actions={
          <button className="btn-primary inline-flex items-center gap-1.5 text-xs">
            <Save className="h-4 w-4" /> Save & Submit to Registrar
          </button>
        }
      />

      <div className="card p-6">
        <h2 className="text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Internal Marks Roster (Max Marks: 80 CIA)
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3 text-center">CIA-1 (30)</th>
                <th className="px-4 py-3 text-center">CIA-2 (30)</th>
                <th className="px-4 py-3 text-center">Assignment (20)</th>
                <th className="px-4 py-3 text-center">Total (80)</th>
                <th className="px-4 py-3 text-center">Calculated Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {grades.map(g => (
                <tr key={g.roll} className="hover:bg-muted/10">
                  <td className="px-4 py-3 font-mono text-xs">{g.roll}</td>
                  <td className="px-4 py-3 text-xs font-bold text-foreground">{g.name}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{g.cia1}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{g.cia2}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{g.assignment}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-primary text-xs">{g.total}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {g.grade}
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
