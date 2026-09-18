#!/usr/bin/env python3
"""
DigiiCampus / CollPoll to GDGU Campus Portal Student Migration Script
=====================================================================
Usage:
    python scripts/migrate_digiicampus.py --file path/to/DigiiCampus_Students.xlsx
    python scripts/migrate_digiicampus.py --file path/to/DigiiCampus_Students.csv --tenant gdgu --output digiicampus_import.sql

Features:
- Handles standard DigiiCampus / CollPoll export columns (flexible aliases)
- Resolves / creates missing academic programmes and batches
- Generates clean, idempotent SQL statements (ON CONFLICT DO NOTHING / UPDATE)
- Populates user_profiles, user_roles, students, and student_academic_profiles
"""

import sys
import os
import argparse
import csv
import uuid
import re

# Standard column mappings for DigiiCampus / CollPoll exports
COLUMN_ALIASES = {
    'roll_no': ['roll no', 'roll_no', 'roll number', 'registration no', 'reg no', 'enrollment no', 'enrollment number', 'student id'],
    'full_name': ['student name', 'name', 'full name', 'student_name', 'first name'],
    'email': ['student email', 'email', 'official email', 'email id', 'email_id', 'institute email'],
    'phone': ['mobile', 'mobile no', 'phone', 'contact number', 'student mobile', 'phone no'],
    'gender': ['gender', 'sex'],
    'dob': ['dob', 'date of birth', 'birth date'],
    'programme': ['program', 'programme', 'course', 'degree', 'programme name', 'program name'],
    'batch': ['batch', 'admission batch', 'academic batch', 'year of admission', 'session'],
    'semester': ['current semester', 'semester', 'sem', 'current sem'],
    'category': ['category', 'caste category', 'social category', 'quota'],
    'cgpa': ['cgpa', 'cumulative gpa', 'current cgpa', 'gpa'],
    'guardian_name': ['father name', 'father_name', 'guardian name', 'parent name'],
    'guardian_phone': ['father mobile', 'parent mobile', 'guardian phone', 'emergency contact']
}

def normalize_key(k: str) -> str:
    return re.sub(r'[^a-z0-9]', '', str(k).strip().lower())

def match_column(col_name: str):
    norm = normalize_key(col_name)
    for target_field, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if normalize_key(alias) == norm:
                return target_field
    return None

def parse_data_file(file_path: str):
    rows = []
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext in ['.xlsx', '.xls']:
        try:
            import openpyxl
            wb = openpyxl.load_workbook(file_path, data_only=True)
            sheet = wb.active
            header_row = None
            for row in sheet.iter_rows(values_only=True):
                if any(row):
                    if header_row is None:
                        header_row = [str(c or '').strip() for c in row]
                    else:
                        row_dict = {}
                        for h, val in zip(header_row, row):
                            if h:
                                row_dict[h] = str(val or '').strip()
                        rows.append(row_dict)
        except ImportError:
            print("[!] openpyxl is not installed. Run: pip install openpyxl or export DigiiCampus data as .CSV")
            sys.exit(1)
    else:
        # Standard CSV
        with open(file_path, mode='r', encoding='utf-8-sig', errors='ignore') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append({k.strip(): str(v).strip() for k, v in row.items() if k})
    return rows

def generate_sql(rows, tenant_code='gdgu'):
    if not rows:
        print("[!] No rows found in input file.")
        return ""

    # Map headers to canonical fields
    first_row = rows[0]
    mapping = {}
    for col in first_row.keys():
        matched = match_column(col)
        if matched:
            mapping[col] = matched

    print(f"[*] Detected {len(mapping)} matched columns out of {len(first_row)} headers:")
    for orig, canon in mapping.items():
        print(f"    - '{orig}' -> {canon}")

    sql_statements = [
        "-- ============================================================",
        f"-- DigiiCampus Data Migration for Tenant: {tenant_code.upper()}",
        f"-- Total Records: {len(rows)}",
        "-- Generated automatically by migrate_digiicampus.py",
        "-- ============================================================\n",
        "BEGIN;\n",
        f"SET LOCAL app.tenant_code = '{tenant_code}';\n"
    ]

    # Pre-populate default department and programmes if not exist
    sql_statements.append("""
-- Ensure baseline default department exists
INSERT INTO departments (id, tenant_code, name, code)
VALUES ('d1111111-0000-0000-0000-000000000001', '""" + tenant_code + """', 'School of Engineering and Technology', 'SOET')
ON CONFLICT (tenant_code, code) DO NOTHING;

-- Ensure standard B.Tech programme exists
INSERT INTO programmes (id, tenant_code, name, code, department_id, degree_type, duration_years, total_credits)
VALUES ('p1111111-0000-0000-0000-000000000001', '""" + tenant_code + """', 'B.Tech Computer Science and Engineering', 'BT-CSE', 'd1111111-0000-0000-0000-000000000001', 'ug', 4, 160)
ON CONFLICT (tenant_code, code) DO NOTHING;

-- Ensure standard batch exists
INSERT INTO batches (id, tenant_code, programme_id, name, start_year, current_semester, is_active)
VALUES ('b1111111-0000-0000-0000-000000000001', '""" + tenant_code + """', 'p1111111-0000-0000-0000-000000000001', '2023-2027', 2023, 4, true)
ON CONFLICT (tenant_code, programme_id, name) DO NOTHING;
""")

    for idx, raw_row in enumerate(rows, start=1):
        mapped = {}
        for k, v in raw_row.items():
            if k in mapping and v:
                mapped[mapping[k]] = v

        roll = mapped.get('roll_no')
        if not roll:
            continue
        
        name = mapped.get('full_name', f"Student {roll}").replace("'", "''")
        email = mapped.get('email', f"{roll.lower()}@student.{tenant_code}.edu").replace("'", "''")
        phone = mapped.get('phone', '9876543210')
        gender = mapped.get('gender', 'Other').lower()
        if gender not in ['male', 'female', 'other']:
            gender = 'other'
            
        sem_str = mapped.get('semester', '1')
        sem_digits = re.findall(r'\d+', sem_str)
        semester = int(sem_digits[0]) if sem_digits else 1
        
        category = mapped.get('category', 'GEN')
        guardian_name = mapped.get('guardian_name', '').replace("'", "''")
        guardian_phone = mapped.get('guardian_phone', '')
        cgpa_str = mapped.get('cgpa', '8.00')
        try:
            cgpa = float(re.findall(r'\d+\.?\d*', cgpa_str)[0])
        except Exception:
            cgpa = 8.00

        # Deterministic UUID per student roll to ensure idempotence across repeated imports
        user_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{tenant_code}.student.{roll.upper()}"))

        block = f"""
-- Student Record #{idx}: {roll} - {name}
INSERT INTO user_profiles (id, tenant_code, full_name, email, phone, gender, is_active)
VALUES ('{user_uuid}', '{tenant_code}', '{name}', '{email}', '{phone}', '{gender}', true)
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, phone = EXCLUDED.phone;

INSERT INTO user_roles (user_id, tenant_code, role, is_primary)
VALUES ('{user_uuid}', '{tenant_code}', 'student', true)
ON CONFLICT DO NOTHING;

INSERT INTO students (id, tenant_code, enrollment_number, programme_id, batch_id, current_semester, admission_year, category, guardian_name, guardian_phone)
VALUES (
    '{user_uuid}', 
    '{tenant_code}', 
    '{roll}', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    {semester}, 
    2023, 
    '{category}', 
    '{guardian_name}', 
    '{guardian_phone}'
)
ON CONFLICT (enrollment_number) DO UPDATE
SET current_semester = EXCLUDED.current_semester, category = EXCLUDED.category;

INSERT INTO student_academic_profiles (tenant_code, student_id, programme_id, batch_id, current_semester, cgpa, total_credits_earned, academic_status)
VALUES (
    '{tenant_code}', 
    '{user_uuid}', 
    'p1111111-0000-0000-0000-000000000001', 
    'b1111111-0000-0000-0000-000000000001', 
    {semester}, 
    {cgpa:.2f}, 
    {semester * 20}, 
    'active'
)
ON CONFLICT (tenant_code, student_id) DO UPDATE
SET cgpa = EXCLUDED.cgpa, current_semester = EXCLUDED.current_semester;
"""
        sql_statements.append(block)

    sql_statements.append("COMMIT;\n")
    return "\n".join(sql_statements)

def main():
    parser = argparse.ArgumentParser(description="Migrate student records from DigiiCampus / CollPoll to Campus Portal")
    parser.add_argument('--file', required=True, help="Path to DigiiCampus CSV or XLSX export file")
    parser.add_argument('--tenant', default='gdgu', help="Tenant code (default: gdgu)")
    parser.add_argument('--output', default='digiicampus_import.sql', help="Output SQL script file name")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"[!] File not found: {args.file}")
        sys.exit(1)
        
    print(f"[*] Reading DigiiCampus export: {args.file} ...")
    rows = parse_data_file(args.file)
    print(f"[*] Successfully parsed {len(rows)} student records.")
    
    sql_content = generate_sql(rows, tenant_code=args.tenant)
    with open(args.output, 'w', encoding='utf-8') as f:
        f.write(sql_content)
        
    print(f"[OK] Migration SQL generated successfully: {args.output}")
    print(f"[OK] Ready to execute in Supabase SQL Editor or via psql.")

if __name__ == '__main__':
    main()
