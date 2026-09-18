import React, { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Tenant } from '@/types'

interface TenantContextValue {
  currentTenant: Tenant | null
  tenantCode: string
  isLoading: boolean
  error: string | null
}

const DEFAULT_TENANTS: Record<string, Partial<Tenant>> = {
  gdgu: {
    code: 'gdgu',
    name: 'GD Goenka University',
    domain: 'campus.gdgu.ac.in',
    primary_color: '#1A376C',
    secondary_color: '#0D9488',
    is_active: true,
  },
  techademydemo: {
    code: 'techademydemo',
    name: 'Techademy University Demo',
    domain: 'hexp.techademy.com',
    primary_color: '#1A376C',
    secondary_color: '#0D9488',
    is_active: true,
  },
}

const TenantContext = createContext<TenantContextValue>({
  currentTenant: null,
  tenantCode: 'gdgu',
  isLoading: true,
  error: null,
})

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenantCode = 'gdgu' } = useParams<{ tenantCode: string }>()
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = tenantCode || 'gdgu'
    setIsLoading(true)

    // Default institutional metadata
    const fallback: Tenant = {
      id: `tenant-${code}`,
      code,
      name: DEFAULT_TENANTS[code]?.name || (code.toUpperCase() + ' Campus'),
      domain: DEFAULT_TENANTS[code]?.domain || `${code}.ac.in`,
      primary_color: DEFAULT_TENANTS[code]?.primary_color || '#1A376C',
      secondary_color: DEFAULT_TENANTS[code]?.secondary_color || '#0D9488',
      is_active: true,
    }

    // Set initial fallback immediately to ensure zero UI flash or block
    setCurrentTenant(fallback)
    document.title = `${fallback.name} — Campus Portal`
    document.documentElement.style.setProperty('--tenant-primary', fallback.primary_color || '#1A376C')

    // Try fetching live tenant data if database is connected
    try {
      supabase
        .from('tenants')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single()
        .then(({ data, error: err }) => {
          if (!err && data) {
            const t = data as Tenant
            setCurrentTenant(t)
            document.title = `${t.name} — Campus Portal`
            if (t.primary_color) {
              document.documentElement.style.setProperty('--tenant-primary', t.primary_color)
            }
          }
          setIsLoading(false)
        })
        .catch(() => {
          // Keep fallback
          setIsLoading(false)
        })
    } catch {
      setIsLoading(false)
    }
  }, [tenantCode])

  return (
    <TenantContext.Provider value={{ currentTenant, tenantCode: tenantCode || 'gdgu', isLoading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
