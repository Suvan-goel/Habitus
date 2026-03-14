// Supabase Edge Function: complete-quest
// Validates quest completion, calculates XP with class multiplier and debuff penalties,
// updates stats_live, daily_journal, profiles, and checks for loot awards.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CLASS_MULTIPLIERS: Record<string, Record<string, number>> = {
  warrior: { exercise: 2 },
  monk: { mental_health: 2, sleep: 2 },
  bard: { recreation: 2 },
};

const ATTRIBUTE_MAP: Record<string, { primary: string; secondary: string | null }> = {
  exercise: { primary: 'str', secondary: 'con' },
  diet: { primary: 'con', secondary: 'str' },
  sleep: { primary: 'sta', secondary: 'con' },
  mental_health: { primary: 'wis', secondary: null },
  recreation: { primary: 'cha', secondary: 'wis' },
};

const SECONDARY_XP_RATIO = 0.5;

const DEBUFF_AFFECTED: Record<string, string> = {
  exhausted: 'exercise',
  malnourished: 'all',
  stressed: 'recreation',
  isolated: 'mental_health',
  stagnant: 'diet',
};

const XP_BASE = 100;
const XP_SCALING_FACTOR = 1.5;

function getLevelFromTotalXp(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  let xpRequired = Math.floor(XP_BASE * Math.pow(level, XP_SCALING_FACTOR));
  while (remaining >= xpRequired) {
    remaining -= xpRequired;
    level++;
    xpRequired = Math.floor(XP_BASE * Math.pow(level, XP_SCALING_FACTOR));
  }
  return level;
}

const STREAK_LOOT = [
  { streak: 3, item: 'Bronze Shield', type: 'armor', rarity: 'common' },
  { streak: 7, item: 'Iron Sword', type: 'weapon', rarity: 'uncommon' },
  { streak: 14, item: 'Silver Helm', type: 'helmet', rarity: 'rare' },
  { streak: 21, item: 'Baby Dragon Companion', type: 'pet', rarity: 'rare' },
  { streak: 30, item: 'Golden Aura', type: 'aura', rarity: 'epic' },
  { streak: 60, item: 'Legendary Crown', type: 'helmet', rarity: 'legendary' },
];

Deno.serve(async (req) => {
  const { journalEntryId, value } = await req.json();

  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Get the JWT user
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  ).auth.getUser(token);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Fetch journal entry with quest definition
  const { data: entry } = await supabase
    .from('daily_journal')
    .select('*, quest_definitions(*)')
    .eq('id', journalEntryId)
    .eq('user_id', user.id)
    .single();

  if (!entry) {
    return new Response(JSON.stringify({ error: 'Quest not found' }), { status: 404 });
  }

  if (entry.completed) {
    return new Response(JSON.stringify({ error: 'Quest already completed' }), { status: 400 });
  }

  const questDef = entry.quest_definitions;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
  }

  // Fetch active debuffs
  const { data: debuffs } = await supabase
    .from('active_debuffs')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);

  // Calculate XP
  let xp = questDef.base_xp;
  const classMultiplier = CLASS_MULTIPLIERS[profile.class]?.[questDef.category] ?? 1;
  xp = xp * classMultiplier;

  // Apply debuff penalties
  for (const debuff of (debuffs ?? [])) {
    const affected = DEBUFF_AFFECTED[debuff.debuff_type];
    if (affected === 'all' || affected === questDef.category) {
      xp = Math.floor(xp / 2);
    }
  }
  xp = Math.max(1, xp);

  // Update daily_journal
  await supabase
    .from('daily_journal')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      xp_awarded: xp,
      value: value ?? null,
    })
    .eq('id', journalEntryId);

  // Update stats_live (primary + secondary attributes)
  const { primary: primaryAttr, secondary: secondaryAttr } = ATTRIBUTE_MAP[questDef.category];
  const { data: currentStats } = await supabase
    .from('stats_live')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const primaryGain = Math.ceil(xp / 10);
  const newStatValue = (currentStats?.[primaryAttr] ?? 0) + primaryGain;
  const statUpdate: Record<string, unknown> = {
    [primaryAttr]: newStatValue,
    updated_at: new Date().toISOString(),
  };

  let secondaryStatValue: number | undefined;
  if (secondaryAttr) {
    const secondaryGain = Math.ceil(xp * SECONDARY_XP_RATIO / 10);
    secondaryStatValue = (currentStats?.[secondaryAttr] ?? 0) + secondaryGain;
    statUpdate[secondaryAttr] = secondaryStatValue;
  }

  await supabase
    .from('stats_live')
    .update(statUpdate)
    .eq('user_id', user.id);

  // Update profile XP and level
  const newTotalXp = profile.total_xp + xp;
  const newLevel = getLevelFromTotalXp(newTotalXp);
  const leveledUp = newLevel > profile.level;

  await supabase
    .from('profiles')
    .update({ total_xp: newTotalXp, level: newLevel })
    .eq('id', user.id);

  // Campaign progression: advance the campaign if this was a campaign quest
  if (questDef.is_campaign) {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_complete', false)
      .limit(1)
      .single();

    if (campaign) {
      const newCurrentDay = campaign.current_day + 1;
      const newCompletedDays = campaign.completed_days + 1;
      const isComplete = newCurrentDay > 30;

      await supabase
        .from('campaigns')
        .update({
          current_day: newCurrentDay,
          completed_days: newCompletedDays,
          is_complete: isComplete,
        })
        .eq('id', campaign.id);
    }
  }

  // Check for streak-based loot
  let lootAwarded = null;
  const { count: streakCount } = await supabase
    .from('daily_journal')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('date', new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0]);

  const streak = streakCount ?? 0;
  for (const lootDef of STREAK_LOOT) {
    if (streak === lootDef.streak) {
      const { data: existingLoot } = await supabase
        .from('loot')
        .select('id')
        .eq('user_id', user.id)
        .eq('source', `streak_${lootDef.streak}`)
        .single();

      if (!existingLoot) {
        await supabase.from('loot').insert({
          user_id: user.id,
          item_name: lootDef.item,
          item_type: lootDef.type,
          rarity: lootDef.rarity,
          source: `streak_${lootDef.streak}`,
        });
        lootAwarded = { itemName: lootDef.item, itemType: lootDef.type, rarity: lootDef.rarity };
      }
      break;
    }
  }

  return new Response(JSON.stringify({
    success: true,
    xpAwarded: xp,
    newTotalXp,
    newLevel,
    statUpdated: primaryAttr,
    statNewValue: newStatValue,
    secondaryStatUpdated: secondaryAttr ?? undefined,
    secondaryStatNewValue: secondaryStatValue ?? undefined,
    lootAwarded,
    leveledUp,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
