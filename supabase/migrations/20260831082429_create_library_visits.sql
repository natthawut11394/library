/*
# Create library_visits table (single-tenant, no auth)

1. New Tables
- `library_visits`
  - `id` (uuid, primary key)
  - `nickname` (text, not null) — ชื่อเล่นของผู้ใช้
  - `class_level` (text, not null) — ระดับชั้น (อนุบาล 1..3, ป.1..ป.6, ครู/บุคลากร)
  - `student_number` (int, nullable) — เลขที่ (null สำหรับครู/บุคลากร)
  - `activities` (text[], not null default '{}') — กิจกรรมที่เลือก (checkbox หลายค่า)
  - `created_at` (timestamptz, default now()) — วันเวลาที่ลงทะเบียน
2. Security
- Enable RLS on `library_visits`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (kiosk-style app, no sign-in).
3. Indexes
- `idx_library_visits_created_at` on `created_at DESC` for newest-first listing performance.
*/

CREATE TABLE IF NOT EXISTS library_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  class_level text NOT NULL,
  student_number int,
  activities text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_library_visits_created_at ON library_visits (created_at DESC);

ALTER TABLE library_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_library_visits" ON library_visits;
CREATE POLICY "anon_select_library_visits" ON library_visits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_library_visits" ON library_visits;
CREATE POLICY "anon_insert_library_visits" ON library_visits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_library_visits" ON library_visits;
CREATE POLICY "anon_update_library_visits" ON library_visits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_library_visits" ON library_visits;
CREATE POLICY "anon_delete_library_visits" ON library_visits FOR DELETE
  TO anon, authenticated USING (true);
