import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Clock,
  ClipboardCheck,
  Award,
  CreditCard,
  BookOpen,
  Building,
  Bus,
  Briefcase,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { cn, getInitials, getRoleLabel } from '@/lib/utils'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isMobile?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ isOpen, onToggle, isMobile, onCloseMobile }: SidebarProps) {
  const { role, user, fullName } = useAuth()
  const { currentTenant, tenantCode = 'gdgu' } = useTenant()

  // Build navigation items based on current active role
  const getNavGroups = (currentRole: UserRole | null): NavGroup[] => {
    const base = `/${tenantCode}`

    const commonGroups: NavGroup[] = [
      {
        group: 'Main',
        items: [
          { label: 'Dashboard', href: base, icon: LayoutDashboard },
        ],
      },
    ]

    if (currentRole === 'student') {
      return [
        ...commonGroups,
        {
          group: 'Academics',
          items: [
            { label: 'My Courses', href: `${base}/student/courses`, icon: BookOpen },
            { label: 'Timetable', href: `${base}/student/timetable`, icon: Calendar },
            { label: 'Attendance', href: `${base}/student/attendance`, icon: Clock },
            { label: 'Assessments', href: `${base}/student/assessments`, icon: ClipboardCheck },
            { label: 'Grades & SGPA', href: `${base}/student/grades`, icon: Award },
          ],
        },
        {
          group: 'Services',
          items: [
            { label: 'Fee & Payments', href: `${base}/student/fee`, icon: CreditCard },
            { label: 'Library OPAC', href: `${base}/erp/library`, icon: BookOpen },
            { label: 'Hostel', href: `${base}/erp/hostel`, icon: Building },
            { label: 'Transport', href: `${base}/erp/transport`, icon: Bus },
            { label: 'Placement', href: `${base}/placement`, icon: Briefcase },
          ],
        },
      ]
    }

    if (currentRole === 'faculty') {
      return [
        ...commonGroups,
        {
          group: 'Teaching',
          items: [
            { label: 'My Courses', href: `${base}/faculty/courses`, icon: BookOpen },
            { label: 'Mark Attendance', href: `${base}/faculty/attendance`, icon: Clock },
            { label: 'Gradebook', href: `${base}/faculty/gradebook`, icon: Award },
            { label: 'CLO Management', href: `${base}/accreditation/clo`, icon: Layers },
          ],
        },
        {
          group: 'Accreditation',
          items: [
            { label: 'NBA Insights', href: `${base}/accreditation/nba`, icon: Award },
            { label: 'NHEQF Map', href: `${base}/accreditation/nheqf`, icon: Sparkles },
          ],
        },
      ]
    }

    if (currentRole === 'hod') {
      return [
        ...commonGroups,
        {
          group: 'Department',
          items: [
            { label: 'Overview', href: `${base}/hod/department`, icon: Building },
            { label: 'Faculty Workload', href: `${base}/hod/faculty`, icon: Users },
            { label: 'Program Outcomes', href: `${base}/accreditation/plo`, icon: Layers },
            { label: 'PO Attainment', href: `${base}/accreditation/po-attainment`, icon: BarChart3 },
          ],
        },
        {
          group: 'Accreditation',
          items: [
            { label: 'Accreditation Hub', href: `${base}/accreditation`, icon: FileCheck2 },
            { label: 'NBA SAR Audit', href: `${base}/accreditation/nba`, icon: ShieldAlert },
          ],
        },
      ]
    }

    if (currentRole === 'registrar') {
      return [
        ...commonGroups,
        {
          group: 'Academics Admin',
          items: [
            { label: 'Students', href: `${base}/registrar/students`, icon: Users },
            { label: 'Programmes', href: `${base}/registrar/programmes`, icon: GraduationCap },
            { label: 'Course Catalog', href: `${base}/registrar/courses`, icon: BookOpen },
            { label: 'Enrollments', href: `${base}/registrar/enrollments`, icon: CheckCircle2 },
            { label: 'Academic Calendar', href: `${base}/registrar/academic-calendar`, icon: Calendar },
          ],
        },
        {
          group: 'Accreditation',
          items: [
            { label: 'Accreditation Hub', href: `${base}/accreditation`, icon: FileCheck2 },
            { label: 'NAAC Dashboard', href: `${base}/accreditation/naac`, icon: Award },
            { label: 'DVV Simulation', href: `${base}/accreditation/dvv`, icon: ShieldAlert },
            { label: 'NIRF Data Export', href: `${base}/accreditation/nirf`, icon: BarChart3 },
          ],
        },
      ]
    }

    // Default admin / executive / full view
    return [
      ...commonGroups,
      {
        group: 'Academic Administration',
        items: [
          { label: 'Students', href: `${base}/registrar/students`, icon: Users },
          { label: 'Programmes', href: `${base}/registrar/programmes`, icon: GraduationCap },
          { label: 'Course Catalog', href: `${base}/registrar/courses`, icon: BookOpen },
          { label: 'Enrollments', href: `${base}/registrar/enrollments`, icon: CheckCircle2 },
        ],
      },
      {
        group: 'Accreditation & NEP',
        items: [
          { label: 'Accreditation Hub', href: `${base}/accreditation`, icon: FileCheck2 },
          { label: 'NHEQF Framework', href: `${base}/accreditation/nheqf`, icon: Sparkles },
          { label: 'NAAC SSR Suite', href: `${base}/accreditation/naac`, icon: Award },
          { label: 'IIQA Check', href: `${base}/accreditation/iiqa`, icon: CheckCircle2 },
          { label: 'DVV Pre-Audit', href: `${base}/accreditation/dvv`, icon: ShieldAlert },
          { label: 'NBA Programme Risk', href: `${base}/accreditation/nba`, icon: Award },
          { label: 'PO Attainment', href: `${base}/accreditation/po-attainment`, icon: BarChart3 },
          { label: 'NIRF Export', href: `${base}/accreditation/nirf`, icon: BarChart3 },
          { label: 'IQAC Calendar', href: `${base}/accreditation/iqac-calendar`, icon: Calendar },
        ],
      },
      {
        group: 'Campus ERP',
        items: [
          { label: 'Library OPAC', href: `${base}/erp/library`, icon: BookOpen },
          { label: 'Hostel System', href: `${base}/erp/hostel`, icon: Building },
          { label: 'Transport Fleet', href: `${base}/erp/transport`, icon: Bus },
          { label: 'Placement Cell', href: `${base}/placement`, icon: Briefcase },
        ],
      },
    ]
  }

  const navGroups = getNavGroups(role)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-20',
        isMobile && 'w-64 shadow-2xl'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-sm">
            {currentTenant?.name ? getInitials(currentTenant.name) : 'GD'}
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-bold text-foreground">
                {currentTenant?.name || 'GD Goenka University'}
              </h1>
              <p className="truncate text-xs text-muted-foreground">Campus ERP</p>
            </div>
          )}
        </div>

        {!isMobile && (
          <button
            onClick={onToggle}
            className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {isOpen && (
              <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.group}
              </h2>
            )}
            <nav className="space-y-1">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={iIdx}
                    to={item.href}
                    end={item.href === `/${tenantCode}`}
                    onClick={() => {
                      if (isMobile) onCloseMobile?.()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'sidebar-item group relative',
                        isActive && 'active font-semibold',
                        !isOpen && 'justify-center px-2'
                      )
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                    {isOpen && item.badge && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-3 hidden rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md group-hover:block z-50 whitespace-nowrap">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / User Profile summary */}
      <div className="border-t border-border p-3">
        <div className={cn('flex items-center gap-3', !isOpen && 'justify-center')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
            {user?.email ? getInitials(user.email) : 'US'}
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {fullName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="truncate text-[10px] text-muted-foreground uppercase font-medium">
                {role ? getRoleLabel(role) : 'Academic User'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
