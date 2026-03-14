-- Add 'pet' to the allowed loot item_type values
ALTER TABLE loot DROP CONSTRAINT loot_item_type_check;
ALTER TABLE loot ADD CONSTRAINT loot_item_type_check CHECK (item_type IN ('helmet','armor','weapon','aura','title','pet'));
