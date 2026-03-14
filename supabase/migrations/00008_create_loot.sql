CREATE TABLE loot (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('helmet','armor','weapon','aura','title')),
  rarity    TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source    TEXT NOT NULL,
  equipped  BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE loot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loot"
  ON loot FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loot"
  ON loot FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loot"
  ON loot FOR UPDATE
  USING (auth.uid() = user_id);
