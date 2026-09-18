-- ============================================================
-- Migration 002: Users & Roles
-- Campus ERP + LMS - GD Goenka University
-- ============================================================

-- Ensure pgcrypto extension is available for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- TABLE: user_profiles
-- One row per user, linked to Supabase auth.users.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id             UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    tenant_code    TEXT        NOT NULL,
    full_name      TEXT        NOT NULL,
    email          TEXT        NOT NULL,
    phone          TEXT,
    avatar_url     TEXT,
    date_of_birth  DATE,
    gender         TEXT,
    address        TEXT,
    is_active      BOOLEAN     NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_up_tenant_code ON user_profiles (tenant_code);
CREATE INDEX IF NOT EXISTS idx_up_email       ON user_profiles (tenant_code, email);
CREATE INDEX IF NOT EXISTS idx_up_active      ON user_profiles (tenant_code, is_active);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON user_profiles
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: user_roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
    tenant_code TEXT        NOT NULL,
    role        TEXT        NOT NULL CHECK (role IN (
                    'student','faculty','hod','registrar','admin',
                    'advisor','placement_officer','employer','dean',
                    'finance_officer','librarian','warden','hr_manager',
                    'it_admin','super_admin'
                )),
    is_primary  BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ur_tenant_code ON user_roles (tenant_code);
CREATE INDEX IF NOT EXISTS idx_ur_user_id     ON user_roles (tenant_code, user_id);
CREATE INDEX IF NOT EXISTS idx_ur_role        ON user_roles (tenant_code, role);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON user_roles
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- TABLE: role_permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code TEXT        NOT NULL,
    role        TEXT        NOT NULL,
    permission  TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rp_unique      ON role_permissions (tenant_code, role, permission);
CREATE INDEX IF NOT EXISTS idx_rp_tenant_role        ON role_permissions (tenant_code, role);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON role_permissions
    USING (tenant_code = current_setting('app.tenant_code', true));


-- ------------------------------------------------------------
-- SEED DATA: Demo users for GDGU in auth.users, user_profiles, user_roles
-- Safe against missing users or FK constraints.
-- ------------------------------------------------------------
DO $$
DECLARE
    v_aarav   UUID := '11111111-0001-0001-0001-000000000001';
    v_aditya  UUID := '11111111-0001-0001-0001-000000000002';
    v_advisor UUID := '11111111-0001-0001-0001-000000000003';
    v_vijay   UUID := '11111111-0001-0001-0001-000000000004';
    v_priya   UUID := '11111111-0001-0001-0001-000000000005';
    v_kavya   UUID := '11111111-0001-0001-0001-000000000006';
    v_arjun   UUID := '11111111-0001-0001-0001-000000000007';
    v_admin   UUID := '11111111-0001-0001-0001-000000000008';
    
    v_pw_hash TEXT;
BEGIN
    -- Compute or fallback bcrypt hash for 'Demo@123'
    BEGIN
        v_pw_hash := crypt('Demo@123', gen_salt('bf'));
    EXCEPTION WHEN OTHERS THEN
        v_pw_hash := '$2a$10$wN1fD1cEw5vS1oR2B3X6u.e7sFhZpYm8K2jL4nPqRsTuVwXyZaBc.';
    END;

    -- 1. Insert into auth.users (enables real Supabase email+password login with 'Demo@123')
    BEGIN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES
        (v_aarav,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aarav.sharma001@student.techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Aarav Sharma","role":"student"}'::jsonb, NOW(), NOW()),
        (v_aditya,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aditya.nair0@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Prof. Aditya Nair","role":"faculty"}'::jsonb, NOW(), NOW()),
        (v_advisor, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'advisor.one@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Advisor One","role":"advisor"}'::jsonb, NOW(), NOW()),
        (v_vijay,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hod.cse@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Vijay Kumar","role":"hod"}'::jsonb, NOW(), NOW()),
        (v_priya,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'registrar@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Priya Sharma","role":"registrar"}'::jsonb, NOW(), NOW()),
        (v_kavya,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'placement@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Ms. Kavya Iyer","role":"placement_officer"}'::jsonb, NOW(), NOW()),
        (v_arjun,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'recruiter@techcorpdemo.com', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Mr. Arjun Mehta","role":"employer"}'::jsonb, NOW(), NOW()),
        (v_admin,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@techademydemo.edu', v_pw_hash, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"System Administrator","role":"admin"}'::jsonb, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Notice: Skipping direct auth.users insert (triggers or permissions): %', SQLERRM;
    END;

    -- 2. Insert into auth.identities (required by GoTrue for email auth provider)
    BEGIN
        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
        ) VALUES
        (v_aarav,   v_aarav,   '{"sub":"11111111-0001-0001-0001-000000000001","email":"aarav.sharma001@student.techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_aditya,  v_aditya,  '{"sub":"11111111-0001-0001-0001-000000000002","email":"aditya.nair0@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_advisor, v_advisor, '{"sub":"11111111-0001-0001-0001-000000000003","email":"advisor.one@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_vijay,   v_vijay,   '{"sub":"11111111-0001-0001-0001-000000000004","email":"hod.cse@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_priya,   v_priya,   '{"sub":"11111111-0001-0001-0001-000000000005","email":"registrar@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_kavya,   v_kavya,   '{"sub":"11111111-0001-0001-0001-000000000006","email":"placement@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_arjun,   v_arjun,   '{"sub":"11111111-0001-0001-0001-000000000007","email":"recruiter@techcorpdemo.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
        (v_admin,   v_admin,   '{"sub":"11111111-0001-0001-0001-000000000008","email":"admin@techademydemo.edu"}'::jsonb, 'email', NOW(), NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Notice: Skipping direct auth.identities insert: %', SQLERRM;
    END;

    -- 3. Insert user_profiles ONLY for users present in auth.users
    INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender)
    SELECT u.id, 'gdgu', 
        COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
        u.email,
        '+919876543200',
        'other'
    FROM auth.users u
    WHERE u.id IN (v_aarav, v_aditya, v_advisor, v_vijay, v_priya, v_kavya, v_arjun, v_admin)
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;

    -- 4. Insert user_roles ONLY where the user profile exists in user_profiles
    -- (Inner JOIN guarantees user_roles_user_id_fkey can NEVER be violated)
    INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
    SELECT p.id, 'gdgu', v.role_name, true
    FROM (
      VALUES
        (v_aarav,   'student'),
        (v_aditya,  'faculty'),
        (v_advisor, 'advisor'),
        (v_vijay,   'hod'),
        (v_priya,   'registrar'),
        (v_kavya,   'placement_officer'),
        (v_arjun,   'employer'),
        (v_admin,   'admin')
    ) AS v(uid, role_name)
    JOIN user_profiles p ON p.id = v.uid
    ON CONFLICT DO NOTHING;
END $$;


-- ------------------------------------------------------------
-- SEED: Default role permissions
-- ------------------------------------------------------------
INSERT INTO role_permissions (tenant_code, role, permission)
VALUES
    ('gdgu','student','view_own_grades'),
    ('gdgu','student','view_timetable'),
    ('gdgu','student','view_attendance'),
    ('gdgu','student','submit_assignment'),
    ('gdgu','student','view_fee_ledger'),
    ('gdgu','student','apply_placement'),
    ('gdgu','faculty','mark_attendance'),
    ('gdgu','faculty','enter_grades'),
    ('gdgu','faculty','create_assessment'),
    ('gdgu','faculty','view_gradebook'),
    ('gdgu','hod','view_department_reports'),
    ('gdgu','hod','approve_timetable'),
    ('gdgu','hod','assign_courses'),
    ('gdgu','registrar','publish_results'),
    ('gdgu','registrar','manage_enrollments'),
    ('gdgu','registrar','generate_transcripts'),
    ('gdgu','admin','manage_users'),
    ('gdgu','admin','manage_tenants'),
    ('gdgu','admin','view_all_reports'),
    ('gdgu','super_admin','all')
ON CONFLICT DO NOTHING;
