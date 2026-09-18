-- ============================================================
-- Migration 001: Tenants & Branding
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- ------------------------------------------------------------
-- TABLE: tenants
-- Central registry of all university tenants.
-- No RLS - publicly readable so login pages can resolve domain.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    code             TEXT        UNIQUE NOT NULL,
    name             TEXT        NOT NULL,
    domain           TEXT,
    logo_url         TEXT,
    primary_color    TEXT,
    secondary_color  TEXT,
    campus_bg_url    TEXT,
    is_active        BOOLEAN     NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_code   ON tenants (code);
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants (domain);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants (is_active);

-- No RLS on tenants (intentional - public read for domain resolution)


-- ------------------------------------------------------------
-- TABLE: tenant_branding_config
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenant_branding_config (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code       TEXT        NOT NULL REFERENCES tenants (code) ON DELETE CASCADE,
    tagline           TEXT,
    support_email     TEXT,
    support_phone     TEXT,
    address           TEXT,
    established_year  INT,
    website_url       TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tbc_tenant_code ON tenant_branding_config (tenant_code);

ALTER TABLE tenant_branding_config ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation ON tenant_branding_config
    USING (tenant_code = current_setting('app.tenant_code', true));

-- Public SELECT for login / landing pages
CREATE POLICY tenant_branding_public_read ON tenant_branding_config
    FOR SELECT USING (true);


-- ------------------------------------------------------------
-- SEED DATA: GD Goenka University
-- ------------------------------------------------------------
INSERT INTO tenants (code, name, domain, logo_url, primary_color, secondary_color, is_active)
VALUES (
    'gdgu',
    'GD Goenka University',
    'campus.gdgu.ac.in',
    'https://assets.gdgu.ac.in/logo/gdgu-logo.png',
    '#1A376C',
    '#F5A623',
    true
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO tenant_branding_config (
    tenant_code, tagline, support_email, support_phone,
    address, established_year, website_url
)
VALUES (
    'gdgu',
    'Transforming Education, Shaping Futures',
    'support@gdgu.ac.in',
    '+91-124-3318888',
    'GD Goenka University, Sohna, Gurugram, Haryana - 122103',
    2013,
    'https://www.gdgu.ac.in'
)
ON CONFLICT DO NOTHING;
