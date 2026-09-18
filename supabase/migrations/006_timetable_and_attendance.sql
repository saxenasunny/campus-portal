-- ============================================================
-- Migration 006: Timetable & Attendance
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: timetable_sessions
-- Recurring weekly schedule entries.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable_sessions (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT        NOT NULL,
    course_offering_id UUID        NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    faculty_id         UUID        REFERENCES faculty_profiles (id) ON DELETE SET NULL,
    day_of_week        INT         NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
                                            -- 0=Sunday ... 6=Saturday
    start_time         TIME        NOT NULL,
    end_time           TIME        NOT NULL,
    room               TEXT,
    session_type       TEXT        NOT NULL DEFAULT 'lecture'
                                   CHECK (session_type IN ('lecture','practical','tutorial','seminar')),
    is_active          BOOLEAN     NOT NULL DEFAULT true,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tt_tenant_code        ON timetable_sessions (tenant_code);
CREATE INDEX IF NOT EXISTS idx_tt_course_offering    ON timetable_sessions (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_tt_faculty            ON timetable_sessions (tenant_code, faculty_id);
CREATE INDEX IF NOT EXISTS idx_tt_day                ON timetable_sessions (tenant_code, day_of_week);

ALTER TABLE timetable_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON timetable_sessions
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: class_sessions
-- Actual (possibly ad-hoc) class sessions derived from timetable.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS class_sessions (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code          TEXT        NOT NULL,
    timetable_session_id UUID        REFERENCES timetable_sessions (id) ON DELETE SET NULL,
    course_offering_id   UUID        NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    faculty_id           UUID        REFERENCES faculty_profiles (id) ON DELETE SET NULL,
    session_date         DATE        NOT NULL,
    start_time           TIME        NOT NULL,
    end_time             TIME        NOT NULL,
    topic                TEXT,
    status               TEXT        NOT NULL DEFAULT 'scheduled'
                                     CHECK (status IN ('scheduled','completed','cancelled')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cs_tenant_code        ON class_sessions (tenant_code);
CREATE INDEX IF NOT EXISTS idx_cs_course_offering    ON class_sessions (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_cs_faculty            ON class_sessions (tenant_code, faculty_id);
CREATE INDEX IF NOT EXISTS idx_cs_date               ON class_sessions (tenant_code, session_date);
CREATE INDEX IF NOT EXISTS idx_cs_status             ON class_sessions (tenant_code, status);

ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON class_sessions
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: attendance_records
-- Per-student attendance for each class session.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code      TEXT        NOT NULL,
    class_session_id UUID        NOT NULL REFERENCES class_sessions (id) ON DELETE CASCADE,
    student_id       UUID        NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    status           TEXT        NOT NULL CHECK (status IN ('present','absent','late','excused')),
    marked_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    marked_by        UUID        REFERENCES user_profiles (id) ON DELETE SET NULL,
    UNIQUE (tenant_code, class_session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_ar_tenant_code        ON attendance_records (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ar_student_session    ON attendance_records (tenant_code, student_id, class_session_id);
CREATE INDEX IF NOT EXISTS idx_ar_course_lookup      ON attendance_records (tenant_code, class_session_id);
CREATE INDEX IF NOT EXISTS idx_ar_student            ON attendance_records (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_ar_status             ON attendance_records (tenant_code, status);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON attendance_records
    USING (tenant_code = current_setting('app.tenant_code', true));
