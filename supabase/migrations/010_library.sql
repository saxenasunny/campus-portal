-- ============================================================
-- Migration 010: Library Management
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: library_materials
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_materials (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT         NOT NULL,
    title             TEXT         NOT NULL,
    authors           TEXT[]       NOT NULL DEFAULT '{}',
    isbn              TEXT,
    publisher         TEXT,
    publication_year  INT,
    category          TEXT,        -- Engineering, Computer Science, Law, Management, Humanities
    material_type     TEXT         NOT NULL DEFAULT 'book'
                                   CHECK (material_type IN ('book','journal','ebook','dvd','thesis')),
    total_copies      INT          NOT NULL DEFAULT 1,
    available_copies  INT          NOT NULL DEFAULT 1,
    location          TEXT,        -- Rack / Shelf identifier
    cover_url         TEXT,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lib_mat_tenant   ON library_materials (tenant_code);
CREATE INDEX IF NOT EXISTS idx_lib_mat_category ON library_materials (tenant_code, category);
CREATE INDEX IF NOT EXISTS idx_lib_mat_title    ON library_materials (tenant_code, title);

ALTER TABLE library_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON library_materials
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: library_members
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_members (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code         TEXT         NOT NULL,
    user_id             UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    member_type         TEXT         NOT NULL CHECK (member_type IN ('student','faculty','staff')),
    membership_expires  DATE,
    max_books           INT          NOT NULL DEFAULT 3,
    is_active           BOOLEAN      NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lib_mem_user ON library_members (tenant_code, user_id);
CREATE INDEX IF NOT EXISTS idx_lib_mem_tenant ON library_members (tenant_code);

ALTER TABLE library_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON library_members
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: library_circulation
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_circulation (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code    TEXT           NOT NULL,
    material_id    UUID           NOT NULL REFERENCES library_materials (id) ON DELETE CASCADE,
    member_id      UUID           NOT NULL REFERENCES library_members (id) ON DELETE CASCADE,
    issued_date    DATE           NOT NULL DEFAULT CURRENT_DATE,
    due_date       DATE           NOT NULL,
    returned_date  DATE,
    fine_amount    DECIMAL(8,2)   NOT NULL DEFAULT 0.00,
    status         TEXT           NOT NULL DEFAULT 'issued'
                                  CHECK (status IN ('issued','returned','overdue')),
    issued_by      UUID           REFERENCES user_profiles (id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lib_circ_tenant  ON library_circulation (tenant_code);
CREATE INDEX IF NOT EXISTS idx_lib_circ_member  ON library_circulation (tenant_code, member_id);
CREATE INDEX IF NOT EXISTS idx_lib_circ_status  ON library_circulation (tenant_code, status);

ALTER TABLE library_circulation ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON library_circulation
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: library_reservations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS library_reservations (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    material_id  UUID         NOT NULL REFERENCES library_materials (id) ON DELETE CASCADE,
    member_id    UUID         NOT NULL REFERENCES library_members (id) ON DELETE CASCADE,
    reserved_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    status       TEXT         NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','fulfilled','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_lib_res_tenant ON library_reservations (tenant_code);

ALTER TABLE library_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON library_reservations
    USING (tenant_code = current_setting('app.tenant_code', true));
