-- ============================================================
-- Migration 014: Communication, Grievances & Digital Requests
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: announcements
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code         TEXT         NOT NULL,
    title               TEXT         NOT NULL,
    body                TEXT         NOT NULL,
    announcement_type   TEXT         NOT NULL DEFAULT 'institution'
                                     CHECK (announcement_type IN ('institution','programme','course','department')),
    course_offering_id  UUID         REFERENCES course_offerings (id) ON DELETE CASCADE,
    programme_id        UUID         REFERENCES programmes (id) ON DELETE CASCADE,
    department_id       UUID         REFERENCES departments (id) ON DELETE CASCADE,
    created_by          UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    is_published        BOOLEAN      NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ann_tenant ON announcements (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ann_type   ON announcements (tenant_code, announcement_type);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON announcements
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: notifications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code        TEXT         NOT NULL,
    user_id            UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    title              TEXT         NOT NULL,
    message            TEXT         NOT NULL,
    notification_type  TEXT         NOT NULL DEFAULT 'general',
    is_read            BOOLEAN      NOT NULL DEFAULT false,
    action_url         TEXT,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_tenant ON notifications (tenant_code);
CREATE INDEX IF NOT EXISTS idx_notif_user   ON notifications (tenant_code, user_id, is_read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON notifications
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: direct_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS direct_messages (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code  TEXT         NOT NULL,
    sender_id    UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    receiver_id  UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    message      TEXT         NOT NULL,
    is_read      BOOLEAN      NOT NULL DEFAULT false,
    sent_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dm_tenant ON direct_messages (tenant_code);
CREATE INDEX IF NOT EXISTS idx_dm_users  ON direct_messages (tenant_code, sender_id, receiver_id);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON direct_messages
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: grievances
-- NAAC Criterion 5.1.5 Redressal of Student Grievances
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grievances (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code   TEXT         NOT NULL,
    submitted_by  UUID         NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    category      TEXT         NOT NULL, -- academic, administrative, hostel, ragging, harassment
    title         TEXT         NOT NULL,
    description   TEXT         NOT NULL,
    status        TEXT         NOT NULL DEFAULT 'open'
                               CHECK (status IN ('open','in_review','resolved','closed')),
    assigned_to   UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    resolution    TEXT,
    submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolved_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_griev_tenant ON grievances (tenant_code);
CREATE INDEX IF NOT EXISTS idx_griev_user   ON grievances (tenant_code, submitted_by);
CREATE INDEX IF NOT EXISTS idx_griev_status ON grievances (tenant_code, status);

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON grievances
    USING (tenant_code = current_setting('app.tenant_code', true));

-- ------------------------------------------------------------
-- TABLE: certificate_requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificate_requests (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT         NOT NULL,
    student_id        UUID         NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    certificate_type  TEXT         NOT NULL
                                   CHECK (certificate_type IN
                                     ('bonafide','tc','migration','character','provisional_degree')),
    purpose           TEXT,
    status            TEXT         NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending','processing','ready','delivered')),
    requested_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    processed_by      UUID         REFERENCES user_profiles (id) ON DELETE SET NULL,
    document_url      TEXT
);

CREATE INDEX IF NOT EXISTS idx_cert_req_tenant  ON certificate_requests (tenant_code);
CREATE INDEX IF NOT EXISTS idx_cert_req_student ON certificate_requests (tenant_code, student_id);

ALTER TABLE certificate_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON certificate_requests
    USING (tenant_code = current_setting('app.tenant_code', true));
