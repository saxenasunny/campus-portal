-- ============================================================
-- Migration 012: Placement & Training
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: companies
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    name         TEXT         NOT NULL,
    industry     TEXT,
    website      TEXT,
    logo_url     TEXT,
    hr_contact   TEXT,
    hr_email     TEXT,
    is_active    BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_tenant ON companies (tenant_code);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON companies
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: job_postings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_postings (
    id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code           TEXT           NOT NULL,
    company_id            UUID           NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    title                 TEXT           NOT NULL,
    description           TEXT           NOT NULL,
    job_type              TEXT           NOT NULL DEFAULT 'full_time'
                                         CHECK (job_type IN ('full_time','internship','contract')),
    eligible_programmes   UUID[]         DEFAULT '{}',
    min_cgpa              DECIMAL(4,2)   DEFAULT 0.00,
    ctc_lpa               DECIMAL(6,2),
    location              TEXT,
    application_deadline  DATE,
    status                TEXT           NOT NULL DEFAULT 'open'
                                         CHECK (status IN ('open','closed','filled')),
    created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_post_tenant  ON job_postings (tenant_code);
CREATE INDEX IF NOT EXISTS idx_job_post_company ON job_postings (tenant_code, company_id);
CREATE INDEX IF NOT EXISTS idx_job_post_status  ON job_postings (tenant_code, status);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON job_postings
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: placement_applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_applications (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT         NOT NULL,
    job_posting_id  UUID         NOT NULL REFERENCES job_postings (id) ON DELETE CASCADE,
    student_id      UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    status          TEXT         NOT NULL DEFAULT 'applied'
                                 CHECK (status IN ('applied','shortlisted','interview','selected','rejected','offered')),
    applied_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resume_url      TEXT,
    remarks         TEXT,
    UNIQUE(tenant_code, job_posting_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_place_app_tenant  ON placement_applications (tenant_code);
CREATE INDEX IF NOT EXISTS idx_place_app_student ON placement_applications (tenant_code, student_id);

ALTER TABLE placement_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON placement_applications
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: campus_drives
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campus_drives (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code          TEXT         NOT NULL,
    company_id           UUID         NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    title                TEXT         NOT NULL,
    drive_date           DATE         NOT NULL,
    venue                TEXT,
    eligible_programmes  UUID[]       DEFAULT '{}',
    status               TEXT         NOT NULL DEFAULT 'scheduled'
                                      CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drives_tenant ON campus_drives (tenant_code);

ALTER TABLE campus_drives ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON campus_drives
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: placement_records
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_records (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT           NOT NULL,
    student_id      UUID           NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    company_id      UUID           NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    job_title       TEXT           NOT NULL,
    ctc_lpa         DECIMAL(6,2)   NOT NULL,
    placement_type  TEXT           NOT NULL DEFAULT 'placement'
                                   CHECK (placement_type IN ('placement','internship')),
    placed_at       DATE           NOT NULL DEFAULT CURRENT_DATE,
    offer_letter_url TEXT,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_place_rec_tenant  ON placement_records (tenant_code);
CREATE INDEX IF NOT EXISTS idx_place_rec_student ON placement_records (tenant_code, student_id);

ALTER TABLE placement_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON placement_records
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: interview_schedules
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_schedules (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code   TEXT         NOT NULL,
    drive_id      UUID         NOT NULL REFERENCES campus_drives (id) ON DELETE CASCADE,
    student_id    UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    scheduled_at  TIMESTAMPTZ  NOT NULL,
    round         INT          NOT NULL DEFAULT 1,
    status        TEXT         NOT NULL DEFAULT 'scheduled'
                               CHECK (status IN ('scheduled','completed','absent','rescheduled')),
    feedback      TEXT
);

CREATE INDEX IF NOT EXISTS idx_intv_tenant  ON interview_schedules (tenant_code);
CREATE INDEX IF NOT EXISTS idx_intv_student ON interview_schedules (tenant_code, student_id);

ALTER TABLE interview_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON interview_schedules
    USING (tenant_code = current_setting('app.tenant_code', true));
