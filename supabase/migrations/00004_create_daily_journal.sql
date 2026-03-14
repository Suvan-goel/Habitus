CREATE TABLE daily_journal (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_def_id UUID NOT NULL REFERENCES quest_definitions(id),
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  xp_awarded   INTEGER NOT NULL DEFAULT 0,
  value        JSONB,
  UNIQUE(user_id, quest_def_id, date)
);

ALTER TABLE daily_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal"
  ON daily_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal"
  ON daily_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal"
  ON daily_journal FOR UPDATE
  USING (auth.uid() = user_id);
