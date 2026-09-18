import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFoundPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-full bg-slate-100 p-4 mb-4">
        <FileQuestion className="h-12 w-12 text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">404</h1>
      <p className="mt-2 text-base text-slate-600">Page not found in this campus portal.</p>
      <Link
        to={`/${tenantCode}`}
        className="btn-primary mt-6 inline-flex items-center gap-2 text-sm"
      >
        <Home className="h-4 w-4" /> Return to Dashboard
      </Link>
    </div>
  )
}
