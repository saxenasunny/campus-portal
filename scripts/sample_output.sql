-- ============================================================
-- DigiiCampus Data Migration for Tenant: GDGU
-- Total Records: 7
-- Generated automatically by migrate_digiicampus.py
-- ============================================================

BEGIN;

SET LOCAL app.tenant_code = 'gdgu';


-- Ensure baseline default department exists
INSERT INTO departments (id, tenant_code, name, code)
VALUES ('d1111111-0000-0000-0000-000000000001', 'gdgu', 'School of Engineering and Technology', 'SOET')
ON CONFLICT (tenant_code, code) DO NOTHING;

-- Ensure standard B.Tech programme exists
INSERT INTO programmes (id, tenant_code, name, code, department_id, degree_type, duration_years, total_credits)
VALUES ('p1111111-0000-0000-0000-000000000001', 'gdgu', 'B.Tech Computer Science and Engineering', 'BT-CSE', 'd1111111-0000-0000-0000-000000000001', 'ug', 4, 160)
ON CONFLICT (tenant_code, code) DO NOTHING;

-- Ensure standard batch exists
INSERT INTO batches (id, tenant_code, programme_id, name, start_year, current_semester, is_active)
VALUES ('b1111111-0000-0000-0000-000000000001', 'gdgu', 'p1111111-0000-0000-0000-000000000001', '2023-2027', 2023, 4, true)
ON CONFLICT (tenant_code, programme_id, name) DO NOTHING;


-- Student Record #1: GDGU2023CSE010 - Kunal Verma
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('437524f7-34ff-5b76-b279-5ac3278f65cc', 'gdgu', 'Kunal Verma', 'kunal.verma@student.gdgu.edu', '9811223344', 'male', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('437524f7-34ff-5b76-b279-5ac3278f65cc', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    '437524f7-34ff-5b76-b279-5ac3278f65cc', 
    'gdgu', 
    'GDGU2023CSE010', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    2023, 
    'GEN', 
    'Rajesh Verma', 
    '9811001122'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    '437524f7-34ff-5b76-b279-5ac3278f65cc', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    8.42, 
    80, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #2: GDGU2023CSE011 - Simran Kaur
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('83938589-7d1b-5b3c-918a-6e3d1fd571b6', 'gdgu', 'Simran Kaur', 'simran.kaur@student.gdgu.edu', '9822334455', 'female', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('83938589-7d1b-5b3c-918a-6e3d1fd571b6', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    '83938589-7d1b-5b3c-918a-6e3d1fd571b6', 
    'gdgu', 
    'GDGU2023CSE011', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    2023, 
    'GEN', 
    'Gurmeet Singh', 
    '9822002233'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    '83938589-7d1b-5b3c-918a-6e3d1fd571b6', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    9.15, 
    80, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #3: GDGU2023CSE012 - Tushar Saxena
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('afc2b13a-64dc-5a2f-a566-e158b35b0332', 'gdgu', 'Tushar Saxena', 'tushar.saxena@student.gdgu.edu', '9833445566', 'male', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('afc2b13a-64dc-5a2f-a566-e158b35b0332', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    'afc2b13a-64dc-5a2f-a566-e158b35b0332', 
    'gdgu', 
    'GDGU2023CSE012', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    2023, 
    'OBC', 
    'Manoj Saxena', 
    '9833003344'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    'afc2b13a-64dc-5a2f-a566-e158b35b0332', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    7.88, 
    80, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #4: GDGU2023CSE013 - Pooja Hegde
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('a50d24e9-28ac-5fd3-bbe5-0ab698eae06a', 'gdgu', 'Pooja Hegde', 'pooja.hegde@student.gdgu.edu', '9844556677', 'female', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('a50d24e9-28ac-5fd3-bbe5-0ab698eae06a', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    'a50d24e9-28ac-5fd3-bbe5-0ab698eae06a', 
    'gdgu', 
    'GDGU2023CSE013', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    2023, 
    'GEN', 
    'Ramesh Hegde', 
    '9844004455'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    'a50d24e9-28ac-5fd3-bbe5-0ab698eae06a', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    8.60, 
    80, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #5: GDGU2023CSE014 - Devendra Yadav
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('f610ee62-184b-51e1-85a0-a165a7c5d894', 'gdgu', 'Devendra Yadav', 'devendra.yadav@student.gdgu.edu', '9855667788', 'male', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('f610ee62-184b-51e1-85a0-a165a7c5d894', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    'f610ee62-184b-51e1-85a0-a165a7c5d894', 
    'gdgu', 
    'GDGU2023CSE014', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    2023, 
    'OBC', 
    'Suresh Yadav', 
    '9855005566'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    'f610ee62-184b-51e1-85a0-a165a7c5d894', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    4, 
    8.12, 
    80, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #6: GDGU2022ME005 - Aman Mehra
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('d892f40c-0c80-5aef-9f20-e1cfd5f0408b', 'gdgu', 'Aman Mehra', 'aman.mehra@student.gdgu.edu', '9866778899', 'male', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('d892f40c-0c80-5aef-9f20-e1cfd5f0408b', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    'd892f40c-0c80-5aef-9f20-e1cfd5f0408b', 
    'gdgu', 
    'GDGU2022ME005', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    6, 
    2023, 
    'GEN', 
    'Sunil Mehra', 
    '9866006677'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    'd892f40c-0c80-5aef-9f20-e1cfd5f0408b', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    6, 
    7.45, 
    120, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;


-- Student Record #7: GDGU2024MBA020 - Ritika Sen
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('08b4e8f2-f79f-532c-8c32-cb8f15a93db0', 'gdgu', 'Ritika Sen', 'ritika.sen@student.gdgu.edu', '9877889900', 'female', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('08b4e8f2-f79f-532c-8c32-cb8f15a93db0', 'gdgu', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    '08b4e8f2-f79f-532c-8c32-cb8f15a93db0', 
    'gdgu', 
    'GDGU2024MBA020', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    2, 
    2023, 
    'GEN', 
    'Pradip Sen', 
    '9877007788'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    'gdgu', 
    '08b4e8f2-f79f-532c-8c32-cb8f15a93db0', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    2, 
    8.90, 
    40, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;

COMMIT;
