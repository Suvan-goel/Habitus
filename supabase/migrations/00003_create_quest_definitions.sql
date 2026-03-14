CREATE TABLE quest_definitions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_plain  TEXT NOT NULL,
  title_rpg    TEXT NOT NULL,
  description  TEXT,
  attribute    TEXT NOT NULL CHECK (attribute IN ('str','con','sta','wis','cha')),
  base_xp      INTEGER NOT NULL DEFAULT 10,
  priority     TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical','high','normal')),
  is_campaign  BOOLEAN NOT NULL DEFAULT false,
  campaign_day INTEGER,
  category     TEXT NOT NULL CHECK (category IN ('exercise','diet','sleep','mental_health','recreation'))
);

ALTER TABLE quest_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read quest definitions"
  ON quest_definitions FOR SELECT
  TO authenticated
  USING (true);
