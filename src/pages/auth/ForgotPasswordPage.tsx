import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GraduationCap, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ForgotPasswordPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${tenantCode}/reset-password`,
    })

    setIsLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setIsSent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Reset your password
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Enter your institutional email to receive recovery instructions
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          {isSent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-900">Check your email</h3>
              <p className="mt-1 text-xs text-slate-500">
                We have sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link
                to={`/${tenantCode}/login`}
                className="btn-primary mt-6 inline-flex items-center gap-2 text-xs"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Institutional Email
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@gdgu.ac.in"
                    required
                    className="block w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to={`/${tenantCode}/login`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
