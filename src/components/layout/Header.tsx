import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { getRoleLabel } from '@/lib/utils'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, role, signOut, fullName } = useAuth()
  const { currentTenant, tenantCode = 'gdgu' } = useTenant()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate(`/${tenantCode}/login`)
  }

  // Demo notifications for quick preview
  const demoNotifications = [
    { id: '1', title: 'Mid-Term Exam Schedule', time: '10m ago', unread: true },
    { id: '2', title: 'NHEQF Course Mapping Verified', time: '1h ago', unread: true },
    { id: '3', title: 'Fee Receipt #REC-2026-089 Generated', time: '1d ago', unread: false },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Institution Badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {currentTenant?.name || 'GD Goenka University'}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <Sparkles className="h-3 w-3" /> NEP 2020 Compliant
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen)
              setIsProfileOpen(false)
            }}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white p-4 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  2 new
                </span>
              </div>
              <div className="mt-2 divide-y divide-border/60 space-y-2">
                {demoNotifications.map(n => (
                  <div key={n.id} className="pt-2">
                    <p className="text-xs font-medium text-foreground">{n.title}</p>
                    <p className="text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsNotifOpen(false)
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-foreground leading-none">
                {fullName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-1">
                {role ? getRoleLabel(role) : 'Academic'}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white p-2 shadow-xl z-50">
              <div className="border-b border-border px-3 py-2">
                <p className="text-xs font-semibold text-foreground truncate">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                  Role: {role || 'Student'}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to={`/${tenantCode}/profile`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  My Profile
                </Link>
                <Link
                  to={`/${tenantCode}/settings`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
