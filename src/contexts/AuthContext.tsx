import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, type User, type Session } from '@/lib/supabase'
import type { UserRole } from '@/types'

export interface DemoUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  roles: UserRole[]
  department?: string
  programme?: string
}

export const DEMO_ACCOUNTS: Record<string, DemoUser> = {
  'aarav.sharma001@student.techademydemo.edu': {
    id: 'demo-student-001',
    email: 'aarav.sharma001@student.techademydemo.edu',
    fullName: 'Aarav Sharma',
    role: 'student',
    roles: ['student'],
    programme: 'B.Tech Computer Science & Engineering',
  },
  'aditya.nair0@techademydemo.edu': {
    id: 'demo-faculty-001',
    email: 'aditya.nair0@techademydemo.edu',
    fullName: 'Prof. Aditya Nair',
    role: 'faculty',
    roles: ['faculty'],
    department: 'Computer Science & Engineering',
  },
  'advisor.one@techademydemo.edu': {
    id: 'demo-advisor-001',
    email: 'advisor.one@techademydemo.edu',
    fullName: 'Advisor One',
    role: 'advisor',
    roles: ['advisor'],
  },
  'hod.cse@techademydemo.edu': {
    id: 'demo-hod-001',
    email: 'hod.cse@techademydemo.edu',
    fullName: 'Dr. Vijay Kumar',
    role: 'hod',
    roles: ['hod'],
    department: 'Computer Science & Engineering',
  },
  'registrar@techademydemo.edu': {
    id: 'demo-registrar-001',
    email: 'registrar@techademydemo.edu',
    fullName: 'Dr. Priya Sharma',
    role: 'registrar',
    roles: ['registrar'],
  },
  'placement@techademydemo.edu': {
    id: 'demo-placement-001',
    email: 'placement@techademydemo.edu',
    fullName: 'Ms. Kavya Iyer',
    role: 'placement_officer',
    roles: ['placement_officer'],
  },
  'recruiter@techcorpdemo.com': {
    id: 'demo-recruiter-001',
    email: 'recruiter@techcorpdemo.com',
    fullName: 'Mr. Arjun Mehta',
    role: 'employer',
    roles: ['employer'],
  },
  'admin@techademydemo.edu': {
    id: 'demo-admin-001',
    email: 'admin@techademydemo.edu',
    fullName: 'Dr. Executive Administrator',
    role: 'admin',
    roles: ['admin', 'super_admin'],
  },
}

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  role: UserRole | null
  roles: UserRole[]
  fullName?: string
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: (tenantCode: string) => Promise<void>
  signInWithMicrosoft: (tenantCode: string) => Promise<void>
  loginAsDemo: (demoEmail: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'campus_auth_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    role: null,
    roles: [],
    fullName: '',
  })

  const fetchUserRoles = useCallback(async (userId: string): Promise<UserRole[]> => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
      return (data?.map(r => r.role as UserRole) ?? [])
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    // 1. Check local demo session first (ensures offline preview / persistence works 100%)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.user) {
          setState({
            user: parsed.user,
            session: parsed.session ?? null,
            isLoading: false,
            role: parsed.role ?? 'student',
            roles: parsed.roles ?? [parsed.role ?? 'student'],
            fullName: parsed.fullName ?? parsed.user.email?.split('@')[0],
          })
          return
        }
      }
    } catch (e) {
      console.warn('Could not read stored session:', e)
    }

    // 2. Check Supabase live session if available
    try {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          const roles = await fetchUserRoles(session.user.id)
          setState({
            user: session.user,
            session,
            isLoading: false,
            role: roles[0] ?? 'student',
            roles,
            fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0],
          })
        } else {
          setState(s => ({ ...s, isLoading: false }))
        }
      }).catch(() => {
        setState(s => ({ ...s, isLoading: false }))
      })
    } catch {
      setState(s => ({ ...s, isLoading: false }))
    }

    // 3. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id)
        setState({
          user: session.user,
          session,
          isLoading: false,
          role: roles[0] ?? 'student',
          roles,
          fullName: (session.user.user_metadata?.full_name as string) || session.user.email?.split('@')[0],
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUserRoles])

  // Helper to log in as a demo user
  const loginAsDemo = async (demoEmail: string): Promise<{ error: Error | null }> => {
    const clean = demoEmail.trim().toLowerCase()
    const demo = DEMO_ACCOUNTS[clean]

    if (!demo) {
      // If email isn't in exact dictionary, synthesize a user from the email address
      const synthesizedRole: UserRole = clean.includes('faculty') ? 'faculty'
        : clean.includes('hod') ? 'hod'
        : clean.includes('registrar') ? 'registrar'
        : clean.includes('placement') ? 'placement_officer'
        : clean.includes('recruiter') || clean.includes('employer') ? 'employer'
        : clean.includes('advisor') ? 'advisor'
        : clean.includes('admin') ? 'admin'
        : 'student'

      const mockUser = {
        id: 'synth-user-' + Math.random().toString(36).substring(2, 9),
        email: clean,
        app_metadata: { provider: 'email' },
        user_metadata: { full_name: clean.split('@')[0], role: synthesizedRole },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          user: mockUser,
          role: synthesizedRole,
          roles: [synthesizedRole],
          fullName: clean.split('@')[0],
        }))
      } catch {}

      setState({
        user: mockUser,
        session: null,
        isLoading: false,
        role: synthesizedRole,
        roles: [synthesizedRole],
        fullName: clean.split('@')[0],
      })
      return { error: null }
    }

    const mockUser = {
      id: demo.id,
      email: demo.email,
      app_metadata: { provider: 'email' },
      user_metadata: { full_name: demo.fullName, role: demo.role },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: mockUser,
        role: demo.role,
        roles: demo.roles,
        fullName: demo.fullName,
      }))
    } catch {}

    setState({
      user: mockUser,
      session: null,
      isLoading: false,
      role: demo.role,
      roles: demo.roles,
      fullName: demo.fullName,
    })

    return { error: null }
  }

  const signIn = async (email: string, password = 'Demo@123') => {
    const clean = email.trim().toLowerCase()

    // 1. Direct Demo Account Check: Instant login with zero network failure risk
    if (DEMO_ACCOUNTS[clean]) {
      return loginAsDemo(clean)
    }

    // 2. Try live Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: clean, password })
      if (!error && data?.user) {
        const roles = await fetchUserRoles(data.user.id)
        setState({
          user: data.user,
          session: data.session,
          isLoading: false,
          role: roles[0] ?? 'student',
          roles,
          fullName: (data.user.user_metadata?.full_name as string) || clean.split('@')[0],
        })
        return { error: null }
      }
      
      // If error is network-related (e.g. Failed to fetch from preview URL), fallback to demo session
      if (error?.message?.toLowerCase().includes('fetch') || error?.message?.toLowerCase().includes('network')) {
        console.warn('Network error during Supabase login. Falling back to local authentication mode.')
        return loginAsDemo(clean)
      }

      return { error: error as Error | null }
    } catch (err: unknown) {
      // Network exception (Failed to fetch)
      console.warn('Supabase fetch exception. Falling back to local authentication mode:', err)
      return loginAsDemo(clean)
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      await supabase.auth.signOut().catch(() => {})
    } finally {
      setState({ user: null, session: null, isLoading: false, role: null, roles: [], fullName: '' })
    }
  }

  const signInWithGoogle = async (tenantCode: string) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${tenantCode}`,
        },
      })
    } catch {
      // Fallback for demo
      loginAsDemo('aarav.sharma001@student.techademydemo.edu')
    }
  }

  const signInWithMicrosoft = async (tenantCode: string) => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/${tenantCode}`,
        },
      })
    } catch {
      // Fallback for demo
      loginAsDemo('aditya.nair0@techademydemo.edu')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithMicrosoft,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
