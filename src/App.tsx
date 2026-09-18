import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { TenantProvider } from '@/contexts/TenantContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// ─── Lazy page imports ────────────────────────────────────────────────────────
const TenantLoginPage     = lazy(() => import('@/pages/auth/TenantLoginPage'))
const ForgotPasswordPage  = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage   = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const AppShell            = lazy(() => import('@/components/layout/AppShell'))
const DashboardRouter     = lazy(() => import('@/pages/DashboardRouter'))
const NotFoundPage        = lazy(() => import('@/pages/NotFoundPage'))

// Student pages
const StudentCoursesPage   = lazy(() => import('@/pages/student/StudentCoursesPage'))
const StudentTimetablePage = lazy(() => import('@/pages/student/StudentTimetablePage'))
const StudentAttendancePage= lazy(() => import('@/pages/student/StudentAttendancePage'))
const StudentGradesPage    = lazy(() => import('@/pages/student/StudentGradesPage'))
const StudentFeePage       = lazy(() => import('@/pages/student/StudentFeePage'))
const StudentAssessmentsPage = lazy(() => import('@/pages/student/StudentAssessmentsPage'))

// Faculty pages
const FacultyCoursesPage   = lazy(() => import('@/pages/faculty/FacultyCoursesPage'))
const FacultyAttendancePage= lazy(() => import('@/pages/faculty/FacultyAttendancePage'))
const FacultyGradebookPage = lazy(() => import('@/pages/faculty/FacultyGradebookPage'))

// HOD pages
const HODDepartmentPage    = lazy(() => import('@/pages/hod/HODDepartmentPage'))
const HODFacultyPage       = lazy(() => import('@/pages/hod/HODFacultyPage'))

// Registrar pages
const StudentsPage         = lazy(() => import('@/pages/registrar/StudentsPage'))
const ProgrammesPage       = lazy(() => import('@/pages/registrar/ProgrammesPage'))
const CoursesPage          = lazy(() => import('@/pages/registrar/CoursesPage'))
const EnrollmentsPage      = lazy(() => import('@/pages/registrar/EnrollmentsPage'))
const AcademicCalendarPage = lazy(() => import('@/pages/registrar/AcademicCalendarPage'))

// Accreditation pages
const AccreditationDashboard   = lazy(() => import('@/pages/accreditation/AccreditationDashboard'))
const NHEQFDashboard           = lazy(() => import('@/pages/accreditation/NHEQFDashboard'))
const NAACADashboard           = lazy(() => import('@/pages/accreditation/NAACADashboard'))
const NBAInsightsPage          = lazy(() => import('@/pages/accreditation/NBAInsightsPage'))
const NIRFExportPage           = lazy(() => import('@/pages/accreditation/NIRFExportPage'))
const IIQACheckPage            = lazy(() => import('@/pages/accreditation/IIQACheckPage'))
const DVVCheckPage             = lazy(() => import('@/pages/accreditation/DVVCheckPage'))
const IQACCalendarPage         = lazy(() => import('@/pages/accreditation/IQACCalendarPage'))
const CLOManagementPage        = lazy(() => import('@/pages/accreditation/CLOManagementPage'))
const PLOManagementPage        = lazy(() => import('@/pages/accreditation/PLOManagementPage'))
const POAttainmentPage         = lazy(() => import('@/pages/accreditation/POAttainmentPage'))
const COAttainmentPage         = lazy(() => import('@/pages/accreditation/COAttainmentPage'))

// ERP pages
const LibraryPage          = lazy(() => import('@/pages/erp/LibraryPage'))
const HostelPage           = lazy(() => import('@/pages/erp/HostelPage'))
const TransportPage        = lazy(() => import('@/pages/erp/TransportPage'))

// Placement pages
const PlacementDashboard   = lazy(() => import('@/pages/placement/PlacementDashboard'))
const JobPostingsPage      = lazy(() => import('@/pages/placement/JobPostingsPage'))
const CampusDrivesPage     = lazy(() => import('@/pages/placement/CampusDrivesPage'))
const CompaniesPage        = lazy(() => import('@/pages/placement/CompaniesPage'))

// Employer pages
const EmployerDashboard    = lazy(() => import('@/pages/employer/EmployerDashboard'))

// Common user pages
const ProfilePage          = lazy(() => import('@/pages/common/ProfilePage'))
const SettingsPage         = lazy(() => import('@/pages/common/SettingsPage'))

// ─── Query client ─────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// ─── Suspense fallback ────────────────────────────────────────────────────────
function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-muted/20">
      <LoadingSpinner size="lg" />
    </div>
  )
}

// ─── Tenant-wrapped routes (inside :tenantCode param) ─────────────────────────
function TenantRoutes() {
  return (
    <TenantProvider>
      <Routes>
        <Route path="login"           element={<TenantLoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password"  element={<ResetPasswordPage />} />

        {/* Protected app shell */}
        <Route element={<AppShell />}>
          <Route index element={<DashboardRouter />} />

          {/* Student routes */}
          <Route path="student/courses"     element={<StudentCoursesPage />} />
          <Route path="student/timetable"   element={<StudentTimetablePage />} />
          <Route path="student/attendance"  element={<StudentAttendancePage />} />
          <Route path="student/grades"      element={<StudentGradesPage />} />
          <Route path="student/fee"         element={<StudentFeePage />} />
          <Route path="student/assessments" element={<StudentAssessmentsPage />} />

          {/* Faculty routes */}
          <Route path="faculty/courses"     element={<FacultyCoursesPage />} />
          <Route path="faculty/attendance"  element={<FacultyAttendancePage />} />
          <Route path="faculty/gradebook"   element={<FacultyGradebookPage />} />

          {/* HOD routes */}
          <Route path="hod/department" element={<HODDepartmentPage />} />
          <Route path="hod/faculty"    element={<HODFacultyPage />} />

          {/* Registrar routes */}
          <Route path="registrar/students"          element={<StudentsPage />} />
          <Route path="registrar/programmes"        element={<ProgrammesPage />} />
          <Route path="registrar/courses"           element={<CoursesPage />} />
          <Route path="registrar/enrollments"       element={<EnrollmentsPage />} />
          <Route path="registrar/academic-calendar" element={<AcademicCalendarPage />} />

          {/* Accreditation routes */}
          <Route path="accreditation"                    element={<AccreditationDashboard />} />
          <Route path="accreditation/nheqf"              element={<NHEQFDashboard />} />
          <Route path="accreditation/naac"               element={<NAACADashboard />} />
          <Route path="accreditation/nba"                element={<NBAInsightsPage />} />
          <Route path="accreditation/nirf"               element={<NIRFExportPage />} />
          <Route path="accreditation/iiqa"               element={<IIQACheckPage />} />
          <Route path="accreditation/dvv"                element={<DVVCheckPage />} />
          <Route path="accreditation/iqac-calendar"      element={<IQACCalendarPage />} />
          <Route path="accreditation/clo"                element={<CLOManagementPage />} />
          <Route path="accreditation/plo"                element={<PLOManagementPage />} />
          <Route path="accreditation/po-attainment"      element={<POAttainmentPage />} />
          <Route path="accreditation/co-attainment"      element={<COAttainmentPage />} />

          {/* ERP routes */}
          <Route path="erp/library"   element={<LibraryPage />} />
          <Route path="erp/hostel"    element={<HostelPage />} />
          <Route path="erp/transport" element={<TransportPage />} />

          {/* Placement routes */}
          <Route path="placement"            element={<PlacementDashboard />} />
          <Route path="placement/jobs"       element={<JobPostingsPage />} />
          <Route path="placement/drives"     element={<CampusDrivesPage />} />
          <Route path="placement/companies"  element={<CompaniesPage />} />

          {/* Employer routes */}
          <Route path="employer" element={<EmployerDashboard />} />

          {/* Common routes */}
          <Route path="profile"  element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TenantProvider>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/"                    element={<Navigate to="/gdgu" replace />} />
              <Route path="/login"               element={<Navigate to="/gdgu/login" replace />} />
              <Route path="/:tenantCode/*"       element={<TenantRoutes />} />
              <Route path="*"                    element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
