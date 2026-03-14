CREATE TABLE campaigns (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_name  TEXT NOT NULL,
  started_at     DATE NOT NULL DEFAULT CURRENT_DATE,
  current_day    INTEGER NOT NULL DEFAULT 1,
  is_complete    BOOLEAN NOT NULL DEFAULT false,
  completed_days INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);
