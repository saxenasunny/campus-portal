-- ============================================================
-- Migration 004: Students
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: students
-- Core student record linked to user_profiles.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id                UUID        PRIMARY KEY REFERENCES user_profiles (id) ON DELETE CASCADE,
    tenant_code       TEXT        NOT NULL,
    enrollment_number TEXT        UNIQUE NOT NULL,
    programme_id      UUID        NOT NULL REFERENCES programmes (id) ON DELETE RESTRICT,
    batch_id          UUID        NOT NULL REFERENCES batches (id) ON DELETE RESTRICT,
    current_semester  INT         NOT NULL DEFAULT 1,
    admission_year    INT         NOT NULL,
    category          TEXT,                          -- GEN / OBC / SC / ST / EWS
    is_lateral        BOOLEAN     NOT NULL DEFAULT false,
    guardian_name     TEXT,
    guardian_phone    TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stu_tenant_code       ON students (tenant_code);
CREATE INDEX IF NOT EXISTS idx_stu_programme         ON students (tenant_code, programme_id);
CREATE INDEX IF NOT EXISTS idx_stu_batch             ON students (tenant_code, batch_id);
CREATE INDEX IF NOT EXISTS idx_stu_enrollment_number ON students (tenant_code, enrollment_number);
CREATE INDEX IF NOT EXISTS idx_stu_semester          ON students (tenant_code, current_semester);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON students
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: student_academic_profiles
-- Running academic snapshot (CGPA, credits, status).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_academic_profiles (
    id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code          TEXT          NOT NULL,
    student_id           UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    programme_id         UUID          NOT NULL REFERENCES programmes (id) ON DELETE RESTRICT,
    batch_id             UUID          NOT NULL REFERENCES batches (id) ON DELETE RESTRICT,
    current_semester     INT           NOT NULL DEFAULT 1,
    cgpa                 DECIMAL(4,2)  NOT NULL DEFAULT 0.00,
    total_credits_earned INT           NOT NULL DEFAULT 0,
    academic_status      TEXT          NOT NULL DEFAULT 'active'
                                       CHECK (academic_status IN ('active','detained','graduated','dropped')),
    updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sap_student ON student_academic_profiles (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_sap_tenant_code    ON student_academic_profiles (tenant_code);
CREATE INDEX IF NOT EXISTS idx_sap_status         ON student_academic_profiles (tenant_code, academic_status);

ALTER TABLE student_academic_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON student_academic_profiles
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: enrollments
-- Maps students to specific course offerings.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enrollments (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT        NOT NULL,
    student_id        UUID        NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    course_offering_id UUID       NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    enrolled_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_elective       BOOLEAN     NOT NULL DEFAULT false,
    status            TEXT        NOT NULL DEFAULT 'enrolled'
                                  CHECK (status IN ('enrolled','dropped','completed')),
    UNIQUE (tenant_code, student_id, course_offering_id)
);

CREATE INDEX IF NOT EXISTS idx_enr_tenant_code        ON enrollments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_enr_student            ON enrollments (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_enr_course_offering    ON enrollments (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_enr_status             ON enrollments (tenant_code, status);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON enrollments
    USING (tenant_code = current_setting('app.tenant_code', true));
