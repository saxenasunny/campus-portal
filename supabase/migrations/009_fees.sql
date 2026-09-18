-- ============================================================
-- Migration 009: Fees & Finance
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: fee_structures
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_structures (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT           NOT NULL,
    programme_id      UUID           NOT NULL REFERENCES programmes (id) ON DELETE CASCADE,
    semester_number   INT            NOT NULL,
    fee_head          TEXT           NOT NULL, -- Tuition, Examination, Library, Hostel, etc.
    amount            DECIMAL(10,2)  NOT NULL,
    is_mandatory      BOOLEAN        NOT NULL DEFAULT true,
    due_date          DATE,
    academic_year_id  UUID           REFERENCES academic_years (id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fee_struct_tenant ON fee_structures (tenant_code);
CREATE INDEX IF NOT EXISTS idx_fee_struct_prog   ON fee_structures (tenant_code, programme_id, semester_number);

ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON fee_structures
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: student_fee_ledger
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_fee_ledger (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT           NOT NULL,
    student_id        UUID           NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    fee_structure_id  UUID           NOT NULL REFERENCES fee_structures (id) ON DELETE CASCADE,
    amount_due        DECIMAL(10,2)  NOT NULL,
    amount_paid       DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    due_date          DATE,
    status            TEXT           NOT NULL DEFAULT 'pending'
                                     CHECK (status IN ('pending', 'partial', 'paid', 'waived', 'overdue')),
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fee_ledger_tenant  ON student_fee_ledger (tenant_code);
CREATE INDEX IF NOT EXISTS idx_fee_ledger_student ON student_fee_ledger (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_fee_ledger_status  ON student_fee_ledger (tenant_code, status);

ALTER TABLE student_fee_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON student_fee_ledger
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: payments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id                   UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code          TEXT           NOT NULL,
    student_id           UUID           NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    amount               DECIMAL(10,2)  NOT NULL,
    payment_method       TEXT           NOT NULL DEFAULT 'online', -- razorpay, netbanking, upi, challan, cash
    razorpay_order_id    TEXT,
    razorpay_payment_id  TEXT,
    status               TEXT           NOT NULL DEFAULT 'pending'
                                        CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    paid_at              TIMESTAMPTZ,
    receipt_url          TEXT,
    created_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_tenant  ON payments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments (tenant_code, student_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp     ON payments (tenant_code, razorpay_payment_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON payments
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: fee_receipts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_receipts (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code    TEXT           NOT NULL,
    student_id     UUID           NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    payment_id     UUID           NOT NULL REFERENCES payments (id) ON DELETE CASCADE,
    receipt_number TEXT           NOT NULL,
    total_amount   DECIMAL(10,2)  NOT NULL,
    generated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_receipts_num    ON fee_receipts (tenant_code, receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_tenant ON fee_receipts (tenant_code);
CREATE INDEX IF NOT EXISTS idx_receipts_student ON fee_receipts (tenant_code, student_id);

ALTER TABLE fee_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON fee_receipts
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: scholarships
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scholarships (
    id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code           TEXT           NOT NULL,
    name                  TEXT           NOT NULL,
    description           TEXT,
    amount                DECIMAL(10,2)  DEFAULT 0.00,
    percentage            DECIMAL(5,2)   DEFAULT 0.00,
    eligibility_criteria  JSONB          DEFAULT '{}'::jsonb,
    is_active             BOOLEAN        NOT NULL DEFAULT true,
    created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scholarships_tenant ON scholarships (tenant_code);

ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON scholarships
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: scholarship_applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scholarship_applications (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT           NOT NULL,
    scholarship_id  UUID           NOT NULL REFERENCES scholarships (id) ON DELETE CASCADE,
    student_id      UUID           NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    status          TEXT           NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending', 'approved', 'rejected', 'disbursed')),
    applied_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    reviewed_by     UUID           REFERENCES user_profiles (id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    remarks         TEXT
);

CREATE INDEX IF NOT EXISTS idx_schol_apps_tenant  ON scholarship_applications (tenant_code);
CREATE INDEX IF NOT EXISTS idx_schol_apps_student ON scholarship_applications (tenant_code, student_id);

ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON scholarship_applications
    USING (tenant_code = current_setting('app.tenant_code', true));
