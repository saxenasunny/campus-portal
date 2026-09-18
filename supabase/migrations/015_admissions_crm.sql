-- ============================================================
-- Migration 015: Admissions & CRM
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: enquiries
-- Prospective student lead tracking
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
    id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code           TEXT         NOT NULL,
    name                  TEXT         NOT NULL,
    email                 TEXT,
    phone                 TEXT         NOT NULL,
    programme_interested  UUID         REFERENCES programmes (id) ON DELETE SET NULL,
    source                TEXT         DEFAULT 'website', -- website, walk_in, education_fair, social_media, referral
    status                TEXT         NOT NULL DEFAULT 'new'
                                       CHECK (status IN ('new','contacted','interested','converted','lost')),
    notes                 TEXT,
    enquiry_date          DATE         NOT NULL DEFAULT CURRENT_DATE,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enq_tenant ON enquiries (tenant_code);
CREATE INDEX IF NOT EXISTS idx_enq_status ON enquiries (tenant_code, status);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON enquiries
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: applications
-- Formal student admission applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code         TEXT         NOT NULL,
    applicant_name      TEXT         NOT NULL,
    email               TEXT         NOT NULL,
    phone               TEXT         NOT NULL,
    programme_id        UUID         NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    academic_year_id    UUID         REFERENCES academic_years (id) ON DELETE SET NULL,
    status              TEXT         NOT NULL DEFAULT 'submitted'
                                     CHECK (status IN ('submitted','under_review','shortlisted','offer_issued','admitted','rejected')),
    application_number  TEXT         NOT NULL,
    date_of_birth       DATE,
    gender              TEXT,
    category            TEXT,        -- General, SC, ST, OBC, EWS
    qualifying_exam     TEXT,        -- 10+2, Graduation, JEE, CUET
    qualifying_marks    DECIMAL(5,2),
    documents           JSONB        DEFAULT '{}'::jsonb,
    submitted_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_apps_num    ON applications (tenant_code, application_number);
CREATE INDEX IF NOT EXISTS idx_apps_tenant ON applications (tenant_code);
CREATE INDEX IF NOT EXISTS idx_apps_prog   ON applications (tenant_code, programme_id, status);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON applications
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: merit_lists
-- Generated merit lists per programme
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS merit_lists (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT           NOT NULL,
    programme_id      UUID           NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    academic_year_id  UUID           REFERENCES academic_years (id) ON DELETE SET NULL,
    application_id    UUID           NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    merit_score       DECIMAL(6,2)   NOT NULL,
    rank              INT            NOT NULL,
    category          TEXT           DEFAULT 'General',
    status            TEXT           NOT NULL DEFAULT 'draft'
                                     CHECK (status IN ('draft','published','archived')),
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merit_tenant ON merit_lists (tenant_code);
CREATE INDEX IF NOT EXISTS idx_merit_prog   ON merit_lists (tenant_code, programme_id, rank);

ALTER TABLE merit_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON merit_lists
    USING (tenant_code = current_setting('app.tenant_code', true));
