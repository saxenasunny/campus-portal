import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Users, Plus, Download, Upload, Search, CheckCircle2, 
  AlertCircle, FileSpreadsheet, X, Sparkles, Filter, RefreshCw
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

export interface StudentRecord {
  roll: string
  name: string
  prog: string
  sem: number
  batch: string
  status: string
  email?: string
  phone?: string
  cgpa?: number
  category?: string
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  { roll: 'GDGU2023CSE001', name: 'Aarav Sharma', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active', email: 'aarav.sharma001@student.gdgu.edu', phone: '9810123456', cgpa: 8.85, category: 'GEN' },
  { roll: 'GDGU2023CSE002', name: 'Ananya Gupta', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active', email: 'ananya.gupta@student.gdgu.edu', phone: '9810123457', cgpa: 9.12, category: 'GEN' },
  { roll: 'GDGU2023CSE003', name: 'Aryan Varma', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active', email: 'aryan.varma@student.gdgu.edu', phone: '9810123458', cgpa: 8.45, category: 'OBC' },
  { roll: 'GDGU2023CSE004', name: 'Diya Patel', prog: 'B.Tech CSE', sem: 4, batch: '2023-27', status: 'Active', email: 'diya.patel@student.gdgu.edu', phone: '9810123459', cgpa: 8.70, category: 'GEN' },
  { roll: 'GDGU2022ME001', name: 'Rohan Joshi', prog: 'B.Tech ME', sem: 6, batch: '2022-26', status: 'Active', email: 'rohan.joshi@student.gdgu.edu', phone: '9810123460', cgpa: 7.92, category: 'GEN' },
  { roll: 'GDGU2024MBA012', name: 'Neha Singh', prog: 'MBA', sem: 2, batch: '2024-26', status: 'Active', email: 'neha.singh@student.gdgu.edu', phone: '9810123461', cgpa: 8.95, category: 'GEN' },
]

export default function StudentsPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProg, setSelectedProg] = useState('ALL')
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const cached = localStorage.getItem(`campus_students_${tenantCode}`)
      return cached ? JSON.parse(cached) : DEFAULT_STUDENTS
    } catch {
      return DEFAULT_STUDENTS
    }
  })

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [importedPreview, setImportedPreview] = useState<StudentRecord[]>([])
  const [detectedColumns, setDetectedColumns] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(`campus_students_${tenantCode}`, JSON.stringify(students))
    } catch (e) {
      console.error('Failed saving to localStorage', e)
    }
  }, [students, tenantCode])

  // Unique programmes for filtering
  const programmes = Array.from(new Set(students.map(s => s.prog)))

  const filtered = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesProg = selectedProg === 'ALL' || s.prog === selectedProg
    return matchesSearch && matchesProg
  })

  // Handle DigiiCampus Excel or CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsParsing(true)

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (!data || data.length === 0) {
          toast.error('The selected file contains no records.')
          setIsParsing(false)
          return
        }

        const headers = Object.keys(data[0])
        setDetectedColumns(headers)

        // Flexible column mapping matching DigiiCampus / CollPoll standards
        const parsed: StudentRecord[] = data.map((row) => {
          const findVal = (aliases: string[]) => {
            for (const alias of aliases) {
              const matchedKey = headers.find(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === alias.toLowerCase().replace(/[^a-z0-9]/g, ''))
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') {
                return String(row[matchedKey]).trim()
              }
            }
            return ''
          }

          const roll = findVal(['roll no', 'roll_no', 'roll number', 'registration no', 'enrollment no', 'student id', 'reg no']) || `TEMP-${Math.floor(1000 + Math.random() * 9000)}`
          const name = findVal(['student name', 'name', 'full name', 'first name']) || 'Unknown Student'
          const prog = findVal(['program', 'programme', 'course', 'degree', 'department']) || 'B.Tech CSE'
          const semVal = findVal(['current semester', 'semester', 'sem'])
          const semNum = semVal ? parseInt(semVal.replace(/\D/g, '')) || 1 : 1
          const batch = findVal(['batch', 'academic batch', 'admission batch', 'session']) || '2023-27'
          const email = findVal(['student email', 'email', 'official email', 'email id']) || `${roll.toLowerCase()}@student.gdgu.edu`
          const phone = findVal(['mobile', 'mobile no', 'phone', 'contact number']) || '9876543210'
          const cgpaStr = findVal(['cgpa', 'cumulative gpa', 'gpa'])
          const cgpa = cgpaStr ? parseFloat(cgpaStr) || 8.0 : 8.0
          const category = findVal(['category', 'caste category', 'quota']) || 'GEN'
          const status = findVal(['status', 'student status', 'academic status']) || 'Active'

          return {
            roll,
            name,
            prog,
            sem: semNum,
            batch,
            status: status.toLowerCase().includes('inactive') ? 'Inactive' : 'Active',
            email,
            phone,
            cgpa,
            category
          }
        }).filter(s => s.roll && s.name !== 'Unknown Student')

        setImportedPreview(parsed)
        toast.success(`Successfully parsed ${parsed.length} students from ${file.name}`)
      } catch (err) {
        console.error(err)
        toast.error('Failed to parse file. Please verify it is a valid Excel or CSV file.')
      } finally {
        setIsParsing(false)
      }
    }
    reader.readAsBinaryString(file)
  }

  // Commit imported records
  const handleCommitImport = () => {
    if (importedPreview.length === 0) return

    // Deduplicate by roll number
    const existingMap = new Map(students.map(s => [s.roll.toUpperCase(), s]))
    importedPreview.forEach(s => {
      existingMap.set(s.roll.toUpperCase(), s)
    })

    const merged = Array.from(existingMap.values())
    setStudents(merged)
    setIsModalOpen(false)
    setImportedPreview([])
    setFileName('')
    toast.success(`Successfully imported ${importedPreview.length} students into GDGU Registry!`)
  }

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(students.map(s => ({
      'Enrollment ID': s.roll,
      'Student Name': s.name,
      'Programme': s.prog,
      'Current Semester': s.sem,
      'Batch': s.batch,
      'Status': s.status,
      'Official Email': s.email || '',
      'Mobile Number': s.phone || '',
      'CGPA': s.cgpa || '',
      'Category': s.category || ''
    })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, `GDGU_Students_Roster_${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success('Downloaded student roster spreadsheet.')
  }

  // Download DigiiCampus Sample CSV
  const downloadSampleTemplate = () => {
    const sampleHeaders = "Roll No,Student Name,Official Email,Mobile No,Gender,Program,Current Semester,Batch,Category,CGPA,Father Name,Father Mobile\n"
    const sampleRows = 
      "GDGU2023CSE010,Kunal Verma,kunal.verma@student.gdgu.edu,9811223344,Male,B.Tech Computer Science and Engineering,4,2023-2027,GEN,8.42,Rajesh Verma,9811001122\n" +
      "GDGU2023CSE011,Simran Kaur,simran.kaur@student.gdgu.edu,9822334455,Female,B.Tech Computer Science and Engineering,4,2023-2027,GEN,9.15,Gurmeet Singh,9822002233\n" +
      "GDGU2024MBA020,Ritika Sen,ritika.sen@student.gdgu.edu,9877889900,Female,Master of Business Administration,2,2024-2026,GEN,8.90,Pradip Sen,9877007788\n"
    
    const blob = new Blob([sampleHeaders + sampleRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'DigiiCampus_Student_Export_Template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.info('DigiiCampus template downloaded.')
  }

  // Reset to default
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset to default sample data?')) {
      setStudents(DEFAULT_STUDENTS)
      localStorage.removeItem(`campus_students_${tenantCode}`)
      toast.info('Student registry reset to default.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Roster & Directory"
        description={`University Registry • ${students.length.toLocaleString()} Actively Registered Students`}
        breadcrumbs={[
          { label: 'Registrar', href: `/${tenantCode}` },
          { label: 'Students' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="h-4 w-4 text-slate-500" /> Export XLSX
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 flex items-center gap-1.5 shadow-sm transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
              <span>Import DigiiCampus Data</span>
              <span className="ml-1 rounded bg-indigo-200/80 px-1 py-0.2 text-[10px] uppercase font-bold text-indigo-800">New</span>
            </button>

            <button 
              onClick={() => toast.info('To add an individual student, you can also use the DigiiCampus bulk importer.')}
              className="btn-primary inline-flex items-center gap-1.5 text-xs shadow-sm"
            >
              <Plus className="h-4 w-4" /> Enroll Student
            </button>
          </div>
        }
      />

      {/* Filter and Stats Bar */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-4 w-4 text-slate-400 my-auto" />
              <input
                type="text"
                placeholder="Search by name, roll no, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedProg}
                onChange={e => setSelectedProg(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary focus:outline-none"
              >
                <option value="ALL">All Programmes ({programmes.length})</option>
                {programmes.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span> students shown
            {students.length > DEFAULT_STUDENTS.length && (
              <button 
                onClick={handleResetData}
                title="Reset to default seed data" 
                className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Students Table */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-border/80">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Enrollment ID</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Programme</th>
                <th className="px-4 py-3 text-center">Semester</th>
                <th className="px-4 py-3 text-center">Batch</th>
                <th className="px-4 py-3 text-center">CGPA</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    No students found matching your filters. Click <strong>"Import DigiiCampus Data"</strong> to import students from Excel or CSV.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.roll} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3.5 font-mono text-xs text-primary font-bold">
                      {s.roll}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-xs text-foreground">{s.name}</div>
                      {s.email && <div className="text-[11px] text-muted-foreground font-mono">{s.email}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{s.prog}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold">Sem {s.sem}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-muted-foreground">{s.batch}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs">
                      {s.cgpa ? (
                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {s.cgpa.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        s.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DigiiCampus Import Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Import Students from DigiiCampus / CollPoll</h3>
                  <p className="text-xs text-muted-foreground">Upload your exported student sheet (.xlsx, .xls, or .csv)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="my-5 space-y-4">
              {/* File Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center cursor-pointer hover:bg-indigo-50/80 transition"
              >
                <Upload className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm font-semibold text-indigo-950">
                  {fileName ? fileName : 'Click to browse or drop DigiiCampus student export'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports Excel (.xlsx, .xls) and CSV files</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".xlsx,.xls,.csv" 
                  className="hidden" 
                />
              </div>

              {/* Template Download & Field Info */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Auto-detects DigiiCampus column aliases (Roll No, Name, Program, Sem, CGPA, etc.)</span>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline shrink-0"
                >
                  Download Template CSV
                </button>
              </div>

              {/* Preview parsed data */}
              {importedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Ready to import {importedPreview.length} students
                    </span>
                    <span className="text-muted-foreground font-mono text-[11px]">Previewing first 4 rows</span>
                  </div>

                  <div className="max-h-44 overflow-y-auto rounded-lg border border-border text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Roll</th>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">Program</th>
                          <th className="px-3 py-2 text-center">Sem</th>
                          <th className="px-3 py-2 text-center">CGPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                        {importedPreview.slice(0, 4).map((s, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-primary font-bold">{s.roll}</td>
                            <td className="px-3 py-2 font-sans font-medium text-foreground">{s.name}</td>
                            <td className="px-3 py-2 font-sans text-slate-600">{s.prog}</td>
                            <td className="px-3 py-2 text-center">{s.sem}</td>
                            <td className="px-3 py-2 text-center text-indigo-600">{s.cgpa?.toFixed(2) || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={importedPreview.length === 0 || isParsing}
                onClick={handleCommitImport}
                className="btn-primary text-xs px-5 py-2 disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isParsing ? 'Parsing...' : `Confirm & Import ${importedPreview.length > 0 ? `(${importedPreview.length})` : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
