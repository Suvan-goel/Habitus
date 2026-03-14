CREATE TABLE active_debuffs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  debuff_type TEXT NOT NULL,
  cause       TEXT NOT NULL,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE active_debuffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debuffs"
  ON active_debuffs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debuffs"
  ON active_debuffs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debuffs"
  ON active_debuffs FOR UPDATE
  USING (auth.uid() = user_id);
