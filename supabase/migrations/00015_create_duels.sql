CREATE TABLE duels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  defender_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  winner_id       UUID REFERENCES profiles(id),
  challenger_score INTEGER NOT NULL DEFAULT 0,
  defender_score   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at     TIMESTAMPTZ
);

ALTER TABLE duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own duels"
  ON duels FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = defender_id);

CREATE POLICY "Users can create duels"
  ON duels FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update own duels"
  ON duels FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = defender_id);
