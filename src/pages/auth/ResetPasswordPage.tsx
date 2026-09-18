import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GraduationCap, Lock, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ResetPasswordPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (err) {
      setError(err.message)
    } else {
      setIsDone(true)
      setTimeout(() => navigate(`/${tenantCode}/login`), 2500)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create new password
        </h2>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          {isDone ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-900">Password Updated!</h3>
              <p className="mt-1 text-xs text-slate-500">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700">New Password</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="block w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Confirm Password</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="block w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Set New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
