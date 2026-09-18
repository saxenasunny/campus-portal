-- ============================================================
-- Migration 003: Academic Structure
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: departments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code TEXT        NOT NULL,
    name        TEXT        NOT NULL,
    code        TEXT        NOT NULL,
    hod_id      UUID        REFERENCES user_profiles (id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_dept_tenant_code ON departments (tenant_code, code);
CREATE INDEX IF NOT EXISTS idx_dept_tenant            ON departments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_dept_hod               ON departments (hod_id);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON departments
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: programmes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programmes (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code    TEXT        NOT NULL,
    name           TEXT        NOT NULL,
    code           TEXT        NOT NULL,
    department_id  UUID        REFERENCES departments (id) ON DELETE SET NULL,
    degree_type    TEXT        NOT NULL CHECK (degree_type IN ('certificate','diploma','ug','pg','phd')),
    duration_years INT         NOT NULL DEFAULT 4,
    total_credits  INT,
    is_active      BOOLEAN     NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_prog_tenant_code ON programmes (tenant_code, code);
CREATE INDEX IF NOT EXISTS idx_prog_tenant            ON programmes (tenant_code);
CREATE INDEX IF NOT EXISTS idx_prog_dept              ON programmes (tenant_code, department_id);
CREATE INDEX IF NOT EXISTS idx_prog_active            ON programmes (tenant_code, is_active);

ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON programmes
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: courses
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT        NOT NULL,
    code         TEXT        NOT NULL,
    title        TEXT        NOT NULL,
    credits      INT         NOT NULL DEFAULT 3,
    l_hours      INT         NOT NULL DEFAULT 3,
    t_hours      INT         NOT NULL DEFAULT 0,
    p_hours      INT         NOT NULL DEFAULT 0,
    syllabus_url TEXT,
    course_type  TEXT        NOT NULL DEFAULT 'theory'
                             CHECK (course_type IN ('theory','practical','project','seminar')),
    is_active    BOOLEAN     NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_course_tenant_code ON courses (tenant_code, code);
CREATE INDEX IF NOT EXISTS idx_course_tenant            ON courses (tenant_code);
CREATE INDEX IF NOT EXISTS idx_course_active            ON courses (tenant_code, is_active);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON courses
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: academic_years
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_years (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code TEXT        NOT NULL,
    label       TEXT        NOT NULL,
    start_date  DATE        NOT NULL,
    end_date    DATE        NOT NULL,
    is_current  BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ay_tenant_code ON academic_years (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ay_current     ON academic_years (tenant_code, is_current);

ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON academic_years
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: semesters
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS semesters (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code      TEXT        NOT NULL,
    academic_year_id UUID        NOT NULL REFERENCES academic_years (id) ON DELETE CASCADE,
    label            TEXT        NOT NULL,
    semester_number  INT         NOT NULL,
    start_date       DATE        NOT NULL,
    end_date         DATE        NOT NULL,
    is_current       BOOLEAN     NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sem_tenant_code ON semesters (tenant_code);
CREATE INDEX IF NOT EXISTS idx_sem_ay          ON semesters (tenant_code, academic_year_id);
CREATE INDEX IF NOT EXISTS idx_sem_current     ON semesters (tenant_code, is_current);

ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON semesters
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: batches
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batches (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code      TEXT        NOT NULL,
    programme_id     UUID        NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    name             TEXT        NOT NULL,
    start_year       INT         NOT NULL,
    current_semester INT         NOT NULL DEFAULT 1,
    is_active        BOOLEAN     NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batch_tenant_code ON batches (tenant_code);
CREATE INDEX IF NOT EXISTS idx_batch_programme   ON batches (tenant_code, programme_id);
CREATE INDEX IF NOT EXISTS idx_batch_active      ON batches (tenant_code, is_active);

ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON batches
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: course_offerings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_offerings (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT        NOT NULL,
    course_id    UUID        NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    semester_id  UUID        NOT NULL REFERENCES semesters (id) ON DELETE CASCADE,
    batch_id     UUID        NOT NULL REFERENCES batches (id) ON DELETE CASCADE,
    max_students INT         NOT NULL DEFAULT 60,
    is_elective  BOOLEAN     NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_co_unique
    ON course_offerings (tenant_code, course_id, semester_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_co_tenant_code ON course_offerings (tenant_code);
CREATE INDEX IF NOT EXISTS idx_co_course      ON course_offerings (tenant_code, course_id);
CREATE INDEX IF NOT EXISTS idx_co_semester    ON course_offerings (tenant_code, semester_id);
CREATE INDEX IF NOT EXISTS idx_co_batch       ON course_offerings (tenant_code, batch_id);

ALTER TABLE course_offerings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON course_offerings
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- SEED DATA: Departments for GDGU
-- ------------------------------------------------------------
INSERT INTO departments (tenant_code, name, code) VALUES
    ('gdgu', 'Computer Science & Engineering',           'CSE'),
    ('gdgu', 'Electronics & Communication Engineering', 'ECE'),
    ('gdgu', 'Mechanical Engineering',                  'ME'),
    ('gdgu', 'Civil Engineering',                       'CE'),
    ('gdgu', 'School of Management',                    'SOM'),
    ('gdgu', 'School of Law',                           'LAW'),
    ('gdgu', 'School of Design',                        'DES'),
    ('gdgu', 'School of Liberal Arts',                  'LAS')
ON CONFLICT DO NOTHING;


-- SEED: Academic Year 2024-25
INSERT INTO academic_years (tenant_code, label, start_date, end_date, is_current)
VALUES ('gdgu', '2024-25', '2024-07-01', '2025-06-30', true)
ON CONFLICT DO NOTHING;


-- SEED: Semesters
DO $$
DECLARE v_ay UUID;
BEGIN
    SELECT id INTO v_ay FROM academic_years
    WHERE tenant_code = 'gdgu' AND label = '2024-25';

    INSERT INTO semesters
        (tenant_code, academic_year_id, label, semester_number, start_date, end_date, is_current)
    VALUES
        ('gdgu', v_ay, 'Odd Semester 2024-25',  1, '2024-07-15', '2024-11-30', false),
        ('gdgu', v_ay, 'Even Semester 2024-25', 2, '2025-01-01', '2025-05-31', true)
    ON CONFLICT DO NOTHING;
END $$;
