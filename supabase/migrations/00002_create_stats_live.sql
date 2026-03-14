CREATE TABLE stats_live (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  str        INTEGER NOT NULL DEFAULT 0,
  con        INTEGER NOT NULL DEFAULT 0,
  sta        INTEGER NOT NULL DEFAULT 0,
  wis        INTEGER NOT NULL DEFAULT 0,
  cha        INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stats_live ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON stats_live FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON stats_live FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON stats_live FOR UPDATE
  USING (auth.uid() = user_id);
