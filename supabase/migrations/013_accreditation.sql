-- ============================================================
-- Migration 013: Accreditation Suite (NAAC, NBA, NIRF, IQAC)
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: accreditation_frameworks
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_frameworks (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    name         TEXT         NOT NULL, -- e.g. NAAC University Manual 2022
    short_name   TEXT         NOT NULL, -- NAAC, NBA, NIRF
    family       TEXT         NOT NULL CHECK (family IN ('naac','nba','nirf','custom')),
    version      TEXT         DEFAULT '1.0',
    is_active    BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_fw_tenant ON accreditation_frameworks (tenant_code);
CREATE INDEX IF NOT EXISTS idx_accred_fw_family ON accreditation_frameworks (tenant_code, family);

ALTER TABLE accreditation_frameworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_frameworks
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_cycles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_cycles (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT         NOT NULL,
    framework_id       UUID         NOT NULL REFERENCES accreditation_frameworks (id) ON DELETE CASCADE,
    name               TEXT         NOT NULL, -- Cycle 2 (2024-2029)
    programme_id       UUID         REFERENCES programmes (id) ON DELETE SET NULL, -- for NBA (programme-specific)
    academic_year      TEXT         NOT NULL, -- 2025-26
    assessment_window  JSONB        DEFAULT '{}'::jsonb, -- CAY, CAYm1, CAYm2
    status             TEXT         NOT NULL DEFAULT 'in_progress'
                                    CHECK (status IN ('in_progress','submitted','completed')),
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_cycles_tenant ON accreditation_cycles (tenant_code);

ALTER TABLE accreditation_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_cycles
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_criteria
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_criteria (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT           NOT NULL,
    framework_id      UUID           NOT NULL REFERENCES accreditation_frameworks (id) ON DELETE CASCADE,
    criterion_number  TEXT           NOT NULL, -- '1', '1.1', '1.1.1'
    title             TEXT           NOT NULL,
    description       TEXT,
    max_score         DECIMAL(6,2),
    weightage         DECIMAL(5,2),
    parent_id         UUID           REFERENCES accreditation_criteria (id) ON DELETE CASCADE,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_crit_tenant ON accreditation_criteria (tenant_code);
CREATE INDEX IF NOT EXISTS idx_accred_crit_fw     ON accreditation_criteria (tenant_code, framework_id);

ALTER TABLE accreditation_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_criteria
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_data_points
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_data_points (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code    TEXT           NOT NULL,
    criterion_id   UUID           NOT NULL REFERENCES accreditation_criteria (id) ON DELETE CASCADE,
    cycle_id       UUID           NOT NULL REFERENCES accreditation_cycles (id) ON DELETE CASCADE,
    label          TEXT           NOT NULL,
    value_numeric  DECIMAL(12,4),
    value_text     TEXT,
    is_verified    BOOLEAN        NOT NULL DEFAULT false,
    evidence_urls  TEXT[]         DEFAULT '{}',
    updated_by     UUID           REFERENCES user_profiles (id) ON DELETE SET NULL,
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_dp_tenant ON accreditation_data_points (tenant_code);
CREATE INDEX IF NOT EXISTS idx_accred_dp_crit   ON accreditation_data_points (tenant_code, criterion_id, cycle_id);

ALTER TABLE accreditation_data_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_data_points
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_metric_values
-- Metric computation & declaration for DVV
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_metric_values (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT           NOT NULL,
    cycle_id        UUID           NOT NULL REFERENCES accreditation_cycles (id) ON DELETE CASCADE,
    metric_key      TEXT           NOT NULL,
    computed_value  DECIMAL(12,4),
    declared_value  DECIMAL(12,4),
    note            TEXT,
    declared_by     UUID           REFERENCES user_profiles (id) ON DELETE SET NULL,
    declared_at     TIMESTAMPTZ,
    UNIQUE(tenant_code, cycle_id, metric_key)
);

CREATE INDEX IF NOT EXISTS idx_accred_mv_tenant ON accreditation_metric_values (tenant_code);

ALTER TABLE accreditation_metric_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_metric_values
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_submissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_submissions (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code    TEXT           NOT NULL,
    framework_id   UUID           NOT NULL REFERENCES accreditation_frameworks (id) ON DELETE CASCADE,
    cycle_id       UUID           REFERENCES accreditation_cycles (id) ON DELETE SET NULL,
    title          TEXT           NOT NULL,
    academic_year  TEXT           NOT NULL,
    overall_score  DECIMAL(6,2),
    grade          TEXT,          -- A++, A+, A, B++, etc.
    status         TEXT           NOT NULL DEFAULT 'draft'
                                  CHECK (status IN ('draft','in_progress','submitted','approved')),
    submitted_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_sub_tenant ON accreditation_submissions (tenant_code);

ALTER TABLE accreditation_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_submissions
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: accreditation_evidence
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accreditation_evidence (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code   TEXT         NOT NULL,
    criterion_id  UUID         NOT NULL REFERENCES accreditation_criteria (id) ON DELETE CASCADE,
    cycle_id      UUID         NOT NULL REFERENCES accreditation_cycles (id) ON DELETE CASCADE,
    file_name     TEXT         NOT NULL,
    file_url      TEXT         NOT NULL,
    file_type     TEXT,
    uploaded_by   UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    uploaded_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accred_evid_tenant ON accreditation_evidence (tenant_code);

ALTER TABLE accreditation_evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON accreditation_evidence
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: iqac_calendar_events
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS iqac_calendar_events (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    title        TEXT         NOT NULL,
    description  TEXT,
    event_type   TEXT         NOT NULL CHECK (event_type IN ('meeting','deadline','workshop','audit','submission')),
    start_date   TIMESTAMPTZ  NOT NULL,
    end_date     TIMESTAMPTZ,
    created_by   UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_iqac_cal_tenant ON iqac_calendar_events (tenant_code);

ALTER TABLE iqac_calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON iqac_calendar_events
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: research_publications
-- NBA Criterion 5 & NAAC Criterion 3
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_publications (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT         NOT NULL,
    faculty_id        UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    title             TEXT         NOT NULL,
    journal_name      TEXT,
    publication_year  INT          NOT NULL,
    volume            TEXT,
    pages             TEXT,
    doi               TEXT,
    is_q1             BOOLEAN      NOT NULL DEFAULT false,
    citations         INT          NOT NULL DEFAULT 0,
    is_retracted      BOOLEAN      NOT NULL DEFAULT false,
    pub_type          TEXT         NOT NULL DEFAULT 'journal'
                                   CHECK (pub_type IN ('journal','conference','book','patent')),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_pub_tenant  ON research_publications (tenant_code);
CREATE INDEX IF NOT EXISTS idx_res_pub_faculty ON research_publications (tenant_code, faculty_id);

ALTER TABLE research_publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON research_publications
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: research_grants
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_grants (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT           NOT NULL,
    faculty_id      UUID           NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    project_title   TEXT           NOT NULL,
    funding_agency  TEXT           NOT NULL,
    amount          DECIMAL(12,2)  NOT NULL,
    start_date      DATE           NOT NULL,
    end_date        DATE,
    status          TEXT           NOT NULL DEFAULT 'ongoing'
                                   CHECK (status IN ('ongoing','completed','submitted','rejected')),
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_res_grants_tenant  ON research_grants (tenant_code);
CREATE INDEX IF NOT EXISTS idx_res_grants_faculty ON research_grants (tenant_code, faculty_id);

ALTER TABLE research_grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON research_grants
    USING (tenant_code = current_setting('app.tenant_code', true));
