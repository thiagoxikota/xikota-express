-- Supabase migration: create projects table for Xikota
-- Run with psql or supabase migrations

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  status text NOT NULL DEFAULT 'draft',
  form_data jsonb NOT NULL,
  design_tokens jsonb,
  figma_file_url text,
  figma_nodes jsonb,
  price_cents integer,
  stripe_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON projects;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
