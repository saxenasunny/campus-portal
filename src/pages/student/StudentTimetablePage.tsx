import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function StudentTimetablePage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const schedule = [
    { day: 'Monday', time: '09:30 - 10:30', code: 'CSE-401', name: 'Design & Analysis of Algorithms', room: 'LT-302', faculty: 'Prof. Aditya Nair' },
    { day: 'Monday', time: '11:00 - 13:00', code: 'CSE-402P', name: 'DBMS Laboratory', room: 'Lab 4', faculty: 'Dr. Meenakshi' },
    { day: 'Tuesday', time: '10:30 - 11:30', code: 'MAT-401', name: 'Discrete Mathematics', room: 'LT-105', faculty: 'Dr. Rajesh Khanna' },
    { day: 'Wednesday', time: '09:30 - 10:30', code: 'CSE-401', name: 'Algorithms', room: 'LT-302', faculty: 'Prof. Aditya Nair' },
    { day: 'Thursday', time: '14:00 - 16:00', code: 'CSE-401P', name: 'Algorithms Lab', room: 'Lab 2', faculty: 'Prof. Aditya Nair' },
    { day: 'Friday', time: '11:30 - 12:30', code: 'CSE-604', name: 'Cloud Computing', room: 'LT-204', faculty: 'Prof. Aditya Nair' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Class Timetable"
        description="B.Tech Computer Science & Engineering • Semester 4"
        breadcrumbs={[
          { label: 'Dashboard', href: `/${tenantCode}` },
          { label: 'Timetable' },
        ]}
      />

      <div className="card p-6">
        <div className="space-y-6">
          {days.map(day => {
            const daySessions = schedule.filter(s => s.day === day)
            return (
              <div key={day} className="border-b border-border/60 pb-5 last:border-b-0 last:pb-0">
                <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {day}
                </h2>
                {daySessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No classes scheduled.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {daySessions.map((s, idx) => (
                      <div key={idx} className="rounded-lg border border-border p-3.5 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-primary">{s.code}</span>
                          <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {s.time}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-foreground mt-1.5">{s.name}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Room: <strong className="text-foreground">{s.room}</strong> • {s.faculty}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
