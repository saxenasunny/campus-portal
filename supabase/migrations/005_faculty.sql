-- ============================================================
-- Migration 005: Faculty
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: faculty_profiles
-- Extended profile for teaching staff.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty_profiles (
    id              UUID        PRIMARY KEY REFERENCES user_profiles (id) ON DELETE CASCADE,
    tenant_code     TEXT        NOT NULL,
    employee_id     TEXT        NOT NULL,
    department_id   UUID        REFERENCES departments (id) ON DELETE SET NULL,
    designation     TEXT,       -- e.g. 'Assistant Professor'
    qualification   TEXT,       -- e.g. 'PhD (Computer Science)'
    specialization  TEXT,
    joining_date    DATE,
    is_permanent    BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fp_tenant_emp  ON faculty_profiles (tenant_code, employee_id);
CREATE INDEX IF NOT EXISTS idx_fp_tenant_code        ON faculty_profiles (tenant_code);
CREATE INDEX IF NOT EXISTS idx_fp_department         ON faculty_profiles (tenant_code, department_id);

ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON faculty_profiles
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: faculty_course_assignments
-- Which faculty member teaches which course offering.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty_course_assignments (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT        NOT NULL,
    faculty_id         UUID        NOT NULL REFERENCES faculty_profiles (id) ON DELETE CASCADE,
    course_offering_id UUID        NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    assigned_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, faculty_id, course_offering_id)
);

CREATE INDEX IF NOT EXISTS idx_fca_tenant_code        ON faculty_course_assignments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_fca_faculty            ON faculty_course_assignments (tenant_code, faculty_id);
CREATE INDEX IF NOT EXISTS idx_fca_course_offering    ON faculty_course_assignments (tenant_code, course_offering_id);

ALTER TABLE faculty_course_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON faculty_course_assignments
    USING (tenant_code = current_setting('app.tenant_code', true));
