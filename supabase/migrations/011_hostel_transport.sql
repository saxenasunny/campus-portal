-- ============================================================
-- Migration 011: Hostel & Transport Management
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: hostel_blocks
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_blocks (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    name         TEXT         NOT NULL, -- e.g. Block A, Shivalik Hostel
    type         TEXT         NOT NULL CHECK (type IN ('boys','girls','staff')),
    total_rooms  INT          NOT NULL DEFAULT 0,
    warden_id    UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hostel_blk_tenant ON hostel_blocks (tenant_code);

ALTER TABLE hostel_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hostel_blocks
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: hostel_rooms
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_rooms (
    id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT           NOT NULL,
    block_id           UUID           NOT NULL REFERENCES hostel_blocks (id) ON DELETE CASCADE,
    room_number        TEXT           NOT NULL,
    capacity           INT            NOT NULL DEFAULT 2,
    current_occupancy  INT            NOT NULL DEFAULT 0,
    room_type          TEXT           NOT NULL DEFAULT 'standard', -- ac, non_ac, deluxe
    monthly_fee        DECIMAL(8,2)   NOT NULL DEFAULT 0.00,
    floor_number       INT            NOT NULL DEFAULT 1,
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_blk_num ON hostel_rooms (tenant_code, block_id, room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_tenant        ON hostel_rooms (tenant_code);

ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hostel_rooms
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: hostel_allotments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_allotments (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT         NOT NULL,
    room_id         UUID         NOT NULL REFERENCES hostel_rooms (id) ON DELETE CASCADE,
    student_id      UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    allotment_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
    vacating_date   DATE,
    status          TEXT         NOT NULL DEFAULT 'active'
                                 CHECK (status IN ('active','vacated','pending')),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hostel_allot_tenant  ON hostel_allotments (tenant_code);
CREATE INDEX IF NOT EXISTS idx_hostel_allot_student ON hostel_allotments (tenant_code, student_id);

ALTER TABLE hostel_allotments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hostel_allotments
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: hostel_attendance
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel_attendance (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    student_id   UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    date         DATE         NOT NULL DEFAULT CURRENT_DATE,
    status       TEXT         NOT NULL CHECK (status IN ('in','out','absent')),
    recorded_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    recorded_by  UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    UNIQUE(tenant_code, student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_hostel_att_tenant ON hostel_attendance (tenant_code);

ALTER TABLE hostel_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON hostel_attendance
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: transport_routes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_routes (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code     TEXT           NOT NULL,
    route_number    TEXT           NOT NULL,
    route_name      TEXT           NOT NULL,
    stops           JSONB          NOT NULL DEFAULT '[]'::jsonb,
    departure_time  TIME,
    driver_name     TEXT,
    driver_phone    TEXT,
    vehicle_number  TEXT,
    monthly_fee     DECIMAL(8,2)   NOT NULL DEFAULT 0.00,
    is_active       BOOLEAN        NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_routes_tenant ON transport_routes (tenant_code);

ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON transport_routes
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: transport_passes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transport_passes (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    student_id   UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    route_id     UUID         NOT NULL REFERENCES transport_routes (id) ON DELETE CASCADE,
    pickup_stop  TEXT,
    issued_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
    valid_until  DATE         NOT NULL,
    status       TEXT         NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','expired','cancelled')),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trans_passes_tenant  ON transport_passes (tenant_code);
CREATE INDEX IF NOT EXISTS idx_trans_passes_student ON transport_passes (tenant_code, student_id);

ALTER TABLE transport_passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON transport_passes
    USING (tenant_code = current_setting('app.tenant_code', true));
