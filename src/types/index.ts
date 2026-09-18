// ─── User & Auth Types ─────────────────────────────────────────────────────

export type UserRole =
  | 'student'
  | 'faculty'
  | 'hod'
  | 'registrar'
  | 'admin'
  | 'advisor'
  | 'placement_officer'
  | 'employer'
  | 'dean'
  | 'finance_officer'
  | 'librarian'
  | 'warden'
  | 'hr_manager'
  | 'it_admin'
  | 'super_admin'

export interface Tenant {
  id: string
  code: string
  name: string
  domain?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  campus_bg_url?: string
  is_active: boolean
}

export interface TenantBrandingConfig {
  id: string
  tenant_code: string
  tagline?: string
  support_email?: string
  support_phone?: string
  address?: string
  established_year?: number
  website_url?: string
}

export interface UserProfile {
  id: string
  tenant_code: string
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  date_of_birth?: string
  gender?: string
  address?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface UserRoleRecord {
  id: string
  user_id: string
  tenant_code: string
  role: UserRole
  is_primary: boolean
  created_at: string
}

// ─── Academic Structure Types ───────────────────────────────────────────────

export type DegreeType = 'certificate' | 'diploma' | 'ug' | 'pg' | 'phd'
export type CourseType = 'theory' | 'practical' | 'project' | 'seminar'

export interface Department {
  id: string
  tenant_code: string
  name: string
  code: string
  hod_id?: string
  created_at: string
}

export interface Programme {
  id: string
  tenant_code: string
  name: string
  code: string
  department_id: string
  degree_type: DegreeType
  duration_years: number
  total_credits: number
  is_active: boolean
  created_at: string
  department?: Department
}

export interface Course {
  id: string
  tenant_code: string
  code: string
  title: string
  credits: number
  l_hours: number
  t_hours: number
  p_hours: number
  syllabus_url?: string
  course_type: CourseType
  is_active: boolean
  created_at: string
}

export interface AcademicYear {
  id: string
  tenant_code: string
  label: string
  start_date: string
  end_date: string
  is_current: boolean
}

export interface Semester {
  id: string
  tenant_code: string
  academic_year_id: string
  label: string
  semester_number: number
  start_date: string
  end_date: string
  is_current: boolean
  academic_year?: AcademicYear
}

export interface Batch {
  id: string
  tenant_code: string
  programme_id: string
  name: string
  start_year: number
  current_semester: number
  is_active: boolean
  programme?: Programme
}

export interface CourseOffering {
  id: string
  tenant_code: string
  course_id: string
  semester_id: string
  batch_id: string
  max_students: number
  is_elective: boolean
  course?: Course
  semester?: Semester
  batch?: Batch
}

// ─── Student Types ───────────────────────────────────────────────────────────

export interface Student {
  id: string
  tenant_code: string
  enrollment_number: string
  programme_id: string
  batch_id: string
  current_semester: number
  admission_year: number
  category?: string
  is_lateral: boolean
  guardian_name?: string
  guardian_phone?: string
  created_at: string
  user_profile?: UserProfile
  programme?: Programme
  batch?: Batch
}

export interface StudentAcademicProfile {
  id: string
  tenant_code: string
  student_id: string
  programme_id: string
  batch_id: string
  current_semester: number
  cgpa: number
  total_credits_earned: number
  academic_status: 'active' | 'detained' | 'graduated' | 'dropped'
}

export interface Enrollment {
  id: string
  tenant_code: string
  student_id: string
  course_offering_id: string
  enrolled_at: string
  is_elective: boolean
  status: 'enrolled' | 'dropped' | 'completed'
  course_offering?: CourseOffering
}

// ─── Faculty Types ───────────────────────────────────────────────────────────

export interface FacultyProfile {
  id: string
  tenant_code: string
  employee_id: string
  department_id: string
  designation: string
  qualification: string
  specialization?: string
  joining_date: string
  is_permanent: boolean
  user_profile?: UserProfile
  department?: Department
}

// ─── Timetable & Attendance Types ────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface TimetableSession {
  id: string
  tenant_code: string
  course_offering_id: string
  faculty_id: string
  day_of_week: number
  start_time: string
  end_time: string
  room: string
  session_type: 'lecture' | 'practical' | 'tutorial' | 'seminar'
  is_active: boolean
  course_offering?: CourseOffering
  faculty?: FacultyProfile
}

export interface ClassSession {
  id: string
  tenant_code: string
  timetable_session_id: string
  course_offering_id: string
  faculty_id: string
  session_date: string
  start_time: string
  end_time: string
  topic?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export interface AttendanceRecord {
  id: string
  tenant_code: string
  class_session_id: string
  student_id: string
  status: AttendanceStatus
  marked_at: string
  marked_by: string
}

export interface AttendanceSummary {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  percentage: number
}

// ─── Assessment & Grade Types ─────────────────────────────────────────────────

export type AssessmentType = 'exam' | 'quiz' | 'assignment' | 'practical' | 'viva' | 'project'
export type QuestionType = 'mcq' | 'multi_select' | 'short' | 'long' | 'true_false'
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'

export interface Assessment {
  id: string
  tenant_code: string
  course_offering_id: string
  title: string
  description?: string
  assessment_type: AssessmentType
  total_marks: number
  scheduled_at?: string
  duration_minutes?: number
  status: 'draft' | 'published' | 'ongoing' | 'completed'
}

export interface GradeResult {
  id: string
  tenant_code: string
  course_offering_id: string
  student_id: string
  total_marks: number
  grade: string
  grade_points: number
  sgpa: number
  cgpa: number
  is_published: boolean
  published_at?: string
  course_offering?: CourseOffering
}

export interface GradeScale {
  id: string
  tenant_code: string
  min_marks: number
  max_marks: number
  grade: string
  grade_points: number
}

// ─── OBE Types ───────────────────────────────────────────────────────────────

export type NHEQFCategory = 'knowledge' | 'skills' | 'application' | 'generic_skills' | 'ethics_responsibility'

export interface LearningOutcome {
  id: string
  tenant_code: string
  course_id: string
  clo_number: string
  description: string
  bloom_level: BloomLevel
  nheqf_category: NHEQFCategory
  nheqf_subcategory?: string
  credit_weightage: number
  assessment_methods: string[]
}

export interface ProgrammeOutcome {
  id: string
  tenant_code: string
  programme_id: string
  plo_number: string
  description: string
  nheqf_domain?: string
  is_active: boolean
}

export interface CLOPLOMapping {
  id: string
  tenant_code: string
  clo_id: string
  plo_id: string
  strength: 1 | 2 | 3
}

export interface StudentCLOAttainment {
  id: string
  tenant_code: string
  student_id: string
  clo_id: string
  course_offering_id: string
  attainment_percentage: number
  attainment_level: 0 | 1 | 2 | 3
  computed_at: string
}

// ─── Fee Types ───────────────────────────────────────────────────────────────

export interface FeeStructure {
  id: string
  tenant_code: string
  programme_id: string
  semester_number: number
  fee_head: string
  amount: number
  is_mandatory: boolean
  due_date?: string
  academic_year_id: string
}

export interface StudentFeeLedger {
  id: string
  tenant_code: string
  student_id: string
  fee_structure_id: string
  amount_due: number
  amount_paid: number
  due_date?: string
  status: 'pending' | 'partial' | 'paid' | 'waived' | 'overdue'
  fee_structure?: FeeStructure
}

export interface Payment {
  id: string
  tenant_code: string
  student_id: string
  amount: number
  payment_method: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paid_at?: string
  receipt_url?: string
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  id: string
  tenant_code: string
  user_id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface Announcement {
  id: string
  tenant_code: string
  title: string
  body: string
  announcement_type: 'institution' | 'programme' | 'course' | 'department'
  course_offering_id?: string
  programme_id?: string
  department_id?: string
  created_by: string
  is_published: boolean
  created_at: string
  creator?: UserProfile
}

// ─── Placement Types ─────────────────────────────────────────────────────────

export interface Company {
  id: string
  tenant_code: string
  name: string
  industry: string
  website?: string
  logo_url?: string
  hr_contact?: string
  hr_email?: string
  is_active: boolean
}

export interface JobPosting {
  id: string
  tenant_code: string
  company_id: string
  title: string
  description: string
  job_type: 'full_time' | 'internship' | 'contract'
  min_cgpa?: number
  ctc_lpa?: number
  location?: string
  application_deadline?: string
  status: 'open' | 'closed' | 'filled'
  created_at: string
  company?: Company
}

export interface PlacementRecord {
  id: string
  tenant_code: string
  student_id: string
  company_id: string
  job_title: string
  ctc_lpa: number
  placement_type: 'placement' | 'internship'
  placed_at: string
  company?: Company
}

// ─── Accreditation Types ─────────────────────────────────────────────────────

export type AccreditationFamily = 'naac' | 'nba' | 'nirf' | 'custom'

export interface AccreditationFramework {
  id: string
  tenant_code: string
  name: string
  short_name: string
  family: AccreditationFamily
  version?: string
  is_active: boolean
  created_at: string
}

export interface AccreditationCycle {
  id: string
  tenant_code: string
  framework_id: string
  name: string
  programme_id?: string
  academic_year: string
  status: 'in_progress' | 'submitted' | 'completed'
  created_at: string
  framework?: AccreditationFramework
}

export interface AccreditationSubmission {
  id: string
  tenant_code: string
  framework_id: string
  cycle_id: string
  title: string
  academic_year: string
  overall_score?: number
  grade?: string
  status: 'draft' | 'in_progress' | 'submitted' | 'approved'
  submitted_at?: string
}

// ─── Library Types ────────────────────────────────────────────────────────────

export interface LibraryMaterial {
  id: string
  tenant_code: string
  title: string
  authors: string[]
  isbn?: string
  publisher?: string
  publication_year?: number
  category: string
  material_type: 'book' | 'journal' | 'ebook' | 'dvd' | 'thesis'
  total_copies: number
  available_copies: number
  location?: string
  cover_url?: string
}

export interface LibraryCirculation {
  id: string
  tenant_code: string
  material_id: string
  member_id: string
  issued_date: string
  due_date: string
  returned_date?: string
  fine_amount: number
  status: 'issued' | 'returned' | 'overdue'
  material?: LibraryMaterial
}

// ─── Hostel Types ─────────────────────────────────────────────────────────────

export interface HostelRoom {
  id: string
  tenant_code: string
  block_id: string
  room_number: string
  capacity: number
  current_occupancy: number
  room_type: string
  monthly_fee: number
  floor_number: number
}

export interface HostelAllotment {
  id: string
  tenant_code: string
  room_id: string
  student_id: string
  allotment_date: string
  vacating_date?: string
  status: 'active' | 'vacated' | 'pending'
  room?: HostelRoom
}
