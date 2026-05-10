-- ============================================================
-- BLOOD NET — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- IMPORTANT BEFORE RUNNING:
--   1. Go to Authentication → Settings → disable "Enable email confirmations"
--      (so hospital accounts created by admin work immediately)
--   2. Then paste this whole file and click Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- TABLES
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role    TEXT NOT NULL CHECK (role IN ('donor', 'hospital'))
);

CREATE TABLE IF NOT EXISTS donor_profiles (
  id                 UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name          TEXT        NOT NULL,
  phone              TEXT,
  blood_group        TEXT        NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  age                INT,
  address            TEXT,
  latitude           FLOAT8,
  longitude          FLOAT8,
  last_donation_date DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hospital_profiles (
  id             UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  hospital_name  TEXT        NOT NULL,
  username       TEXT        UNIQUE NOT NULL,
  phone          TEXT,
  address        TEXT,
  latitude       FLOAT8,
  longitude      FLOAT8,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_requests (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id  UUID        NOT NULL REFERENCES hospital_profiles(id) ON DELETE CASCADE,
  blood_group  TEXT        NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  units_needed INT         NOT NULL DEFAULT 1 CHECK (units_needed > 0),
  urgency      TEXT        NOT NULL CHECK (urgency IN ('urgent','scheduled')),
  scheduled_at TIMESTAMPTZ,
  notes        TEXT,
  status       TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','fulfilled','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS request_commitments (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id          UUID        NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id            UUID        NOT NULL REFERENCES donor_profiles(id)  ON DELETE CASCADE,
  status              TEXT        NOT NULL DEFAULT 'committed' CHECK (status IN ('committed','cancelled','completed')),
  committed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_latitude    FLOAT8,
  current_longitude   FLOAT8,
  location_updated_at TIMESTAMPTZ,
  UNIQUE (request_id, donor_id)
);

-- ────────────────────────────────────────────────────────────
-- TRIGGER: auto-create profile rows after signup
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF new.raw_user_meta_data->>'role' = 'donor' THEN
    INSERT INTO user_roles (user_id, role) VALUES (new.id, 'donor');
    INSERT INTO donor_profiles (id, full_name, phone, blood_group, age)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'Donor'),
      new.raw_user_meta_data->>'phone',
      COALESCE(new.raw_user_meta_data->>'blood_group', 'O+'),
      NULLIF(new.raw_user_meta_data->>'age', '')::INT
    );

  ELSIF new.raw_user_meta_data->>'role' = 'hospital' THEN
    INSERT INTO user_roles (user_id, role) VALUES (new.id, 'hospital');
    INSERT INTO hospital_profiles (id, hospital_name, username)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'hospital_name', 'Hospital'),
      COALESCE(new.raw_user_meta_data->>'username', new.id::TEXT)
    );
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE user_roles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_commitments ENABLE ROW LEVEL SECURITY;

-- user_roles
CREATE POLICY "own role"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- donor_profiles
CREATE POLICY "donor own profile"
  ON donor_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "hospital reads donors"
  ON donor_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'hospital'));
-- Hospitals and system can read donor profiles for committed donations
CREATE POLICY "Donor profiles readable for commitments"
  ON donor_profiles FOR SELECT
  TO authenticated
  USING (true);

-- hospital_profiles
CREATE POLICY "hospital own profile"
  ON hospital_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "donor reads hospitals"
  ON hospital_profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
-- Anyone can read hospital profiles (needed for donor app and admin panel)
CREATE POLICY "Hospital profiles public read"
  ON hospital_profiles FOR SELECT
  USING (true);
-- Admin panel uses anon/hospital session to manage all profiles
CREATE POLICY "admin can update hospital profiles"
  ON hospital_profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);
CREATE POLICY "admin can delete hospital profiles"
  ON hospital_profiles FOR DELETE
  USING (true);

-- blood_requests
CREATE POLICY "hospital manages requests"
  ON blood_requests FOR ALL USING (hospital_id = auth.uid());
CREATE POLICY "anyone reads active requests"
  ON blood_requests FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'active');

-- request_commitments
CREATE POLICY "donor manages commitments"
  ON request_commitments FOR ALL USING (donor_id = auth.uid());
CREATE POLICY "hospital reads commitments"
  ON request_commitments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blood_requests br
      WHERE br.id = request_commitments.request_id AND br.hospital_id = auth.uid()
    )
  );
CREATE POLICY "hospital updates commitment status"
  ON request_commitments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blood_requests br
      WHERE br.id = request_commitments.request_id AND br.hospital_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- REALTIME
-- ────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE request_commitments;
