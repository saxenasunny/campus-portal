import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building,
  Briefcase,
  Users,
  Award,
} from 'lucide-react'
import { useAuth, DEMO_ACCOUNTS } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function TenantLoginPage() {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const { signIn, signInWithGoogle, signInWithMicrosoft, loginAsDemo } = useAuth()
  const { currentTenant } = useTenant()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Complete list of demo accounts matching the exact credentials provided
  const demoList = [
    {
      role: 'Student',
      name: 'Aarav Sharma',
      email: 'aarav.sharma001@student.techademydemo.edu',
      icon: GraduationCap,
      badge: 'B.Tech CSE',
      color: 'hover:border-blue-400 hover:bg-blue-50/50',
    },
    {
      role: 'Faculty',
      name: 'Prof. Aditya Nair',
      email: 'aditya.nair0@techademydemo.edu',
      icon: Award,
      badge: 'Assoc. Professor',
      color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
    },
    {
      role: 'HOD',
      name: 'Dr. Vijay Kumar',
      email: 'hod.cse@techademydemo.edu',
      icon: Building,
      badge: 'Head of CSE',
      color: 'hover:border-purple-400 hover:bg-purple-50/50',
    },
    {
      role: 'Registrar',
      name: 'Dr. Priya Sharma',
      email: 'registrar@techademydemo.edu',
      icon: UserCheck,
      badge: 'Academic Registry',
      color: 'hover:border-indigo-400 hover:bg-indigo-50/50',
    },
    {
      role: 'Placement',
      name: 'Ms. Kavya Iyer',
      email: 'placement@techademydemo.edu',
      icon: Briefcase,
      badge: 'Placement Officer',
      color: 'hover:border-amber-400 hover:bg-amber-50/50',
    },
    {
      role: 'Employer',
      name: 'Mr. Arjun Mehta',
      email: 'recruiter@techcorpdemo.com',
      icon: Users,
      badge: 'TechCorp Recruiter',
      color: 'hover:border-rose-400 hover:bg-rose-50/50',
    },
    {
      role: 'Advisor',
      name: 'Advisor One',
      email: 'advisor.one@techademydemo.edu',
      icon: Sparkles,
      badge: 'Student Mentor',
      color: 'hover:border-sky-400 hover:bg-sky-50/50',
    },
  ]

  // One-click instant login for any demo account
  const handleDirectDemoLogin = async (demoEmail: string) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const { error } = await loginAsDemo(demoEmail)
      if (error) {
        setErrorMessage(error.message)
      } else {
        navigate(`/${tenantCode}`)
      }
    } catch {
      setErrorMessage('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMessage(error.message || 'Invalid credentials.')
      } else {
        navigate(`/${tenantCode}`)
      }
    } catch (err: unknown) {
      // If error occurs, attempt demo login for seamless experience
      try {
        await loginAsDemo(email)
        navigate(`/${tenantCode}`)
      } catch {
        setErrorMessage('Failed to connect to authentication service.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Graphic Decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-600 blur-3xl" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* University Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {currentTenant?.name || 'GD Goenka University'}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Unified Campus ERP & Learning Management System • NEP 2020 Compliant
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <p className="text-xs font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* ⚡ Instant One-Click Role Switcher */}
          <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" /> One-Click Role Logins (Password: Demo@123)
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 rounded-full px-2 py-0.5">
                Instant Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {demoList.map(d => {
                const Icon = d.icon
                return (
                  <button
                    key={d.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleDirectDemoLogin(d.email)}
                    className={`flex flex-col items-start rounded-lg border border-slate-200 bg-white p-2 text-left shadow-xs transition-all ${d.color} group`}
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-primary">
                        {d.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate mt-0.5 w-full">
                      {d.name}
                    </span>
                    <span className="mt-1 inline-block text-[9px] font-mono text-muted-foreground bg-slate-100 rounded px-1 py-0.2">
                      {d.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or Sign In with Credentials</span>
            </div>
          </div>

          {/* Traditional Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@gdgu.ac.in or demo email"
                  required
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to={`/${tenantCode}/forgot-password`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-2.5 shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signInWithGoogle(tenantCode)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => signInWithMicrosoft(tenantCode)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H1z" />
              </svg>
              Microsoft
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>© 2026 {currentTenant?.name || 'GD Goenka University'}. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
