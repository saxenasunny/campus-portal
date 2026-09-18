-- ============================================================
-- Migration 007: Assessments & Grades
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: assessment_categories
-- e.g. "Internal Assessment 1", "Mid-Term", "End-Term"
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessment_categories (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT          NOT NULL,
    course_offering_id UUID          NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    name               TEXT          NOT NULL,
    weightage          DECIMAL(5,2)  NOT NULL DEFAULT 0,
    max_marks          DECIMAL(6,2)  NOT NULL DEFAULT 100,
    is_internal        BOOLEAN       NOT NULL DEFAULT true,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ac_tenant_code        ON assessment_categories (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ac_course_offering    ON assessment_categories (tenant_code, course_offering_id);

ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON assessment_categories
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: assessments
-- Individual assessment events.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT          NOT NULL,
    course_offering_id UUID          NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    category_id        UUID          REFERENCES assessment_categories (id) ON DELETE SET NULL,
    title              TEXT          NOT NULL,
    description        TEXT,
    assessment_type    TEXT          NOT NULL
                                     CHECK (assessment_type IN ('exam','quiz','assignment','practical','viva','project')),
    total_marks        DECIMAL(6,2)  NOT NULL DEFAULT 100,
    scheduled_at       TIMESTAMPTZ,
    duration_minutes   INT,
    status             TEXT          NOT NULL DEFAULT 'draft'
                                     CHECK (status IN ('draft','published','ongoing','completed')),
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asmt_tenant_code      ON assessments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_asmt_course_offering  ON assessments (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_asmt_category         ON assessments (tenant_code, category_id);
CREATE INDEX IF NOT EXISTS idx_asmt_status           ON assessments (tenant_code, status);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON assessments
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: questions
-- Question bank for assessments.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT          NOT NULL,
    assessment_id   UUID          NOT NULL REFERENCES assessments (id) ON DELETE CASCADE,
    question_text   TEXT          NOT NULL,
    question_type   TEXT          NOT NULL
                                  CHECK (question_type IN ('mcq','multi_select','short','long','true_false')),
    options         JSONB,        -- Array of choices for MCQ / multi_select
    correct_answer  JSONB,        -- Flexible: string, array, or object
    marks           DECIMAL(5,2)  NOT NULL DEFAULT 1,
    bloom_level     TEXT,         -- remember / understand / apply / analyze / evaluate / create
    difficulty      TEXT          NOT NULL DEFAULT 'medium'
                                  CHECK (difficulty IN ('easy','medium','hard')),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_q_tenant_code   ON questions (tenant_code);
CREATE INDEX IF NOT EXISTS idx_q_assessment    ON questions (tenant_code, assessment_id);
CREATE INDEX IF NOT EXISTS idx_q_bloom         ON questions (tenant_code, bloom_level);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON questions
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: student_submissions
-- Student responses to assessments.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_submissions (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code   TEXT          NOT NULL,
    assessment_id UUID          NOT NULL REFERENCES assessments (id) ON DELETE CASCADE,
    student_id    UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    answers       JSONB,
    submitted_at  TIMESTAMPTZ   DEFAULT NOW(),
    score         DECIMAL(6,2),
    graded_by     UUID          REFERENCES user_profiles (id) ON DELETE SET NULL,
    graded_at     TIMESTAMPTZ,
    status        TEXT          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','submitted','graded')),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_ss_tenant_code  ON student_submissions (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ss_assessment   ON student_submissions (tenant_code, assessment_id);
CREATE INDEX IF NOT EXISTS idx_ss_student      ON student_submissions (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_ss_status       ON student_submissions (tenant_code, status);

ALTER TABLE student_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON student_submissions
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: gradebook_entries
-- Marks per student per category (internal continuous assessment).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gradebook_entries (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT          NOT NULL,
    course_offering_id UUID          NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    student_id         UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    category_id        UUID          NOT NULL REFERENCES assessment_categories (id) ON DELETE CASCADE,
    marks_obtained     DECIMAL(6,2)  NOT NULL DEFAULT 0,
    max_marks          DECIMAL(6,2)  NOT NULL DEFAULT 100,
    remarks            TEXT,
    entered_by         UUID          REFERENCES user_profiles (id) ON DELETE SET NULL,
    entered_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, student_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_ge_tenant_code        ON gradebook_entries (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ge_course_offering    ON gradebook_entries (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_ge_student            ON gradebook_entries (tenant_code, student_id);

ALTER TABLE gradebook_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON gradebook_entries
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: grade_results
-- Final course-level result per student.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grade_results (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT          NOT NULL,
    course_offering_id UUID          NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    student_id         UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    total_marks        DECIMAL(6,2)  NOT NULL DEFAULT 0,
    grade              TEXT,
    grade_points       DECIMAL(3,1),
    sgpa               DECIMAL(4,2),
    cgpa               DECIMAL(4,2),
    is_published       BOOLEAN       NOT NULL DEFAULT false,
    published_at       TIMESTAMPTZ,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, course_offering_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_gr_tenant_code        ON grade_results (tenant_code);
CREATE INDEX IF NOT EXISTS idx_gr_course_offering    ON grade_results (tenant_code, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_gr_student            ON grade_results (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_gr_published          ON grade_results (tenant_code, is_published);

ALTER TABLE grade_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON grade_results
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: grade_scales
-- Grading scale configuration per tenant.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grade_scales (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT          NOT NULL,
    min_marks    DECIMAL(5,2)  NOT NULL,
    max_marks    DECIMAL(5,2)  NOT NULL,
    grade        TEXT          NOT NULL,
    grade_points DECIMAL(3,1)  NOT NULL,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gs_tenant_code ON grade_scales (tenant_code);

ALTER TABLE grade_scales ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON grade_scales
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- SEED: GDGU 10-Point Grade Scale (UGC / NAAC standard)
-- ------------------------------------------------------------
INSERT INTO grade_scales (tenant_code, min_marks, max_marks, grade, grade_points) VALUES
    ('gdgu',  90, 100, 'O',  10),
    ('gdgu',  80,  89, 'A+',  9),
    ('gdgu',  70,  79, 'A',   8),
    ('gdgu',  60,  69, 'B+',  7),
    ('gdgu',  50,  59, 'B',   6),
    ('gdgu',  40,  49, 'C',   5),
    ('gdgu',   0,  39, 'F',   0)
ON CONFLICT DO NOTHING;
