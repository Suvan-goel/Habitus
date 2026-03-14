CREATE TABLE boss_raids (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start   DATE NOT NULL,
  boss_name    TEXT NOT NULL,
  boss_max_hp  INTEGER NOT NULL,
  damage_dealt INTEGER NOT NULL DEFAULT 0,
  is_defeated  BOOLEAN NOT NULL DEFAULT false,
  sleep_bonus  BOOLEAN NOT NULL DEFAULT false,
  breakdown    JSONB NOT NULL DEFAULT '{}'::jsonb,
  evaluated_at TIMESTAMPTZ,
  UNIQUE(user_id, week_start)
);

ALTER TABLE boss_raids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own boss raids"
  ON boss_raids FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own boss raids"
  ON boss_raids FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boss raids"
  ON boss_raids FOR UPDATE
  USING (auth.uid() = user_id);
