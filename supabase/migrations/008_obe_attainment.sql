-- ============================================================
-- Migration 008: OBE Attainment
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: learning_outcomes
-- Course Learning Outcomes (CLOs) aligned to NHEQF.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_outcomes (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code         TEXT         NOT NULL,
    course_id           UUID         NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    clo_number          TEXT         NOT NULL,   -- e.g. 'CLO1'
    description         TEXT         NOT NULL,
    bloom_level         TEXT         NOT NULL
                                     CHECK (bloom_level IN
                                       ('remember','understand','apply','analyze','evaluate','create')),
    nheqf_category      TEXT         NOT NULL
                                     CHECK (nheqf_category IN
                                       ('knowledge','skills','application','generic_skills','ethics_responsibility')),
    nheqf_subcategory   TEXT,
    credit_weightage    DECIMAL(5,2) DEFAULT 0,
    assessment_methods  TEXT[],
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lo_tenant_clo  ON learning_outcomes (tenant_code, course_id, clo_number);
CREATE INDEX IF NOT EXISTS idx_lo_tenant_code        ON learning_outcomes (tenant_code);
CREATE INDEX IF NOT EXISTS idx_lo_course             ON learning_outcomes (tenant_code, course_id);
CREATE INDEX IF NOT EXISTS idx_lo_bloom              ON learning_outcomes (tenant_code, bloom_level);

ALTER TABLE learning_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON learning_outcomes
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: programme_outcomes
-- Programme Learning Outcomes (PLOs / POs) per programme.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programme_outcomes (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT        NOT NULL,
    programme_id UUID        NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    plo_number   TEXT        NOT NULL,   -- e.g. 'PO1'
    description  TEXT        NOT NULL,
    nheqf_domain TEXT,
    is_active    BOOLEAN     NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_po_tenant_plo  ON programme_outcomes (tenant_code, programme_id, plo_number);
CREATE INDEX IF NOT EXISTS idx_po_tenant_code        ON programme_outcomes (tenant_code);
CREATE INDEX IF NOT EXISTS idx_po_programme          ON programme_outcomes (tenant_code, programme_id);

ALTER TABLE programme_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON programme_outcomes
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: clo_plo_mappings
-- Correlation matrix between CLOs and PLOs.
-- strength: 1=Weak, 2=Moderate, 3=Strong
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clo_plo_mappings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code TEXT        NOT NULL,
    clo_id      UUID        NOT NULL REFERENCES learning_outcomes (id) ON DELETE CASCADE,
    plo_id      UUID        NOT NULL REFERENCES programme_outcomes (id) ON DELETE CASCADE,
    strength    INT         NOT NULL CHECK (strength BETWEEN 1 AND 3),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, clo_id, plo_id)
);

CREATE INDEX IF NOT EXISTS idx_cpm_tenant_code ON clo_plo_mappings (tenant_code);
CREATE INDEX IF NOT EXISTS idx_cpm_clo         ON clo_plo_mappings (tenant_code, clo_id);
CREATE INDEX IF NOT EXISTS idx_cpm_plo         ON clo_plo_mappings (tenant_code, plo_id);

ALTER TABLE clo_plo_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON clo_plo_mappings
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: student_clo_attainment
-- Computed CLO attainment per student per course offering.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_clo_attainment (
    id                     UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code            TEXT          NOT NULL,
    student_id             UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    clo_id                 UUID          NOT NULL REFERENCES learning_outcomes (id) ON DELETE CASCADE,
    course_offering_id     UUID          NOT NULL REFERENCES course_offerings (id) ON DELETE CASCADE,
    attainment_percentage  DECIMAL(5,2)  NOT NULL DEFAULT 0,
    attainment_level       INT           NOT NULL DEFAULT 0 CHECK (attainment_level BETWEEN 0 AND 3),
    computed_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sca_unique
    ON student_clo_attainment (tenant_code, student_id, clo_id, course_offering_id);
CREATE INDEX IF NOT EXISTS idx_sca_tenant_code ON student_clo_attainment (tenant_code);
CREATE INDEX IF NOT EXISTS idx_sca_student     ON student_clo_attainment (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_sca_clo         ON student_clo_attainment (tenant_code, clo_id);

ALTER TABLE student_clo_attainment ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON student_clo_attainment
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: student_plo_attainment
-- Aggregated PLO attainment per student per programme.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_plo_attainment (
    id                     UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code            TEXT          NOT NULL,
    student_id             UUID          NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    plo_id                 UUID          NOT NULL REFERENCES programme_outcomes (id) ON DELETE CASCADE,
    programme_id           UUID          NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    attainment_percentage  DECIMAL(5,2)  NOT NULL DEFAULT 0,
    attainment_level       INT           NOT NULL DEFAULT 0 CHECK (attainment_level BETWEEN 0 AND 3),
    computed_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_spa_unique
    ON student_plo_attainment (tenant_code, student_id, plo_id, programme_id);
CREATE INDEX IF NOT EXISTS idx_spa_tenant_code ON student_plo_attainment (tenant_code);
CREATE INDEX IF NOT EXISTS idx_spa_student     ON student_plo_attainment (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_spa_plo         ON student_plo_attainment (tenant_code, plo_id);

ALTER TABLE student_plo_attainment ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON student_plo_attainment
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: attainment_settings
-- Target levels and direct/indirect weightages per programme.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attainment_settings (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code         TEXT          NOT NULL,
    programme_id        UUID          NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    target_level        INT           NOT NULL DEFAULT 2,
    target_percentage   DECIMAL(5,2)  NOT NULL DEFAULT 60.00,
    direct_weightage    DECIMAL(5,2)  NOT NULL DEFAULT 80.00,
    indirect_weightage  DECIMAL(5,2)  NOT NULL DEFAULT 20.00,
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_code, programme_id)
);

CREATE INDEX IF NOT EXISTS idx_as_tenant_code ON attainment_settings (tenant_code);
CREATE INDEX IF NOT EXISTS idx_as_programme   ON attainment_settings (tenant_code, programme_id);

ALTER TABLE attainment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON attainment_settings
    USING (tenant_code = current_setting('app.tenant_code', true));
