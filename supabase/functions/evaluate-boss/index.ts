// Supabase Edge Function: evaluate-boss
// Aggregates the week's completed tasks, applies class multipliers, debuff penalties,
// and sleep bonus, then writes to boss_raids.
// Supports two modes:
//   - Cron mode (no Authorization header): evaluates all users for the current week
//   - Client mode (with Authorization header): evaluates only the authenticated user

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CLASS_MULTIPLIERS: Record<string, Record<string, number>> = {
  warrior: { exercise: 2 },
  monk: { mental_health: 2, sleep: 2 },
  bard: { recreation: 2 },
};

const BOSS_TEMPLATES = [
  { name: 'The Burnout Behemoth', maxHp: 50 },
  { name: 'Sloth Dragon', maxHp: 60 },
  { name: 'Procrastination Hydra', maxHp: 70 },
  { name: 'Anxiety Specter', maxHp: 55 },
  { name: 'The Couch Potato Golem', maxHp: 65 },
  { name: 'Sugar Fiend', maxHp: 45 },
  { name: 'Doom Scroller', maxHp: 50 },
  { name: 'Insomnia Wraith', maxHp: 60 },
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

async function evaluateUserBoss(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  weekStart: string,
  profile: any
) {
  const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 86400000)
    .toISOString().split('T')[0];

  // Fetch completed journal entries for the week
  const { data: entries } = await supabase
    .from('daily_journal')
    .select('*, quest_definitions(*)')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('date', weekStart)
    .lt('date', weekEnd);

  // Fetch active debuffs
  const { data: debuffs } = await supabase
    .from('active_debuffs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  // Calculate damage
  const breakdown: Record<string, number> = {};
  let totalDamage = 0;

  for (const entry of (entries ?? [])) {
    const category = entry.quest_definitions.category;
    const classMultiplier = CLASS_MULTIPLIERS[profile.class]?.[category] ?? 1;
    const damage = 1 * classMultiplier;
    totalDamage += damage;
    breakdown[category] = (breakdown[category] ?? 0) + damage;
  }

  // Debuff penalty
  const debuffPenalty = (debuffs ?? []).length * 5;
  totalDamage = Math.max(0, totalDamage - debuffPenalty);
  if (debuffPenalty > 0) {
    breakdown['debuff_penalty'] = -debuffPenalty;
  }

  // Sleep bonus: check if sleep >= 7hrs for 5+ days
  const sleepEntries = (entries ?? []).filter(
    (e) => e.quest_definitions.category === 'sleep' && (e.value as any)?.hours_slept >= 7
  );
  const sleepBonus = sleepEntries.length >= 5;
  if (sleepBonus) {
    const bonusDamage = Math.floor(totalDamage * 0.5);
    totalDamage = Math.floor(totalDamage * 1.5);
    breakdown['sleep_bonus'] = bonusDamage;
  }

  // Pick a boss template
  const bossIndex = Math.abs(hashCode(weekStart + userId)) % BOSS_TEMPLATES.length;
  const boss = BOSS_TEMPLATES[bossIndex];
  const isDefeated = totalDamage >= boss.maxHp;

  // Upsert boss raid
  const { data: raid } = await supabase
    .from('boss_raids')
    .upsert({
      user_id: userId,
      week_start: weekStart,
      boss_name: boss.name,
      boss_max_hp: boss.maxHp,
      damage_dealt: totalDamage,
      is_defeated: isDefeated,
      sleep_bonus: sleepBonus,
      breakdown,
      evaluated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,week_start' })
    .select()
    .single();

  // Award loot for boss defeat
  if (isDefeated) {
    const { data: existingLoot } = await supabase
      .from('loot')
      .select('id')
      .eq('user_id', userId)
      .eq('source', `boss_${weekStart}`)
      .single();

    if (!existingLoot) {
      await supabase.from('loot').insert({
        user_id: userId,
        item_name: `${boss.name} Trophy`,
        item_type: 'title',
        rarity: 'rare',
        source: `boss_${weekStart}`,
      });
    }
  }

  return {
    id: raid?.id,
    weekStart,
    bossName: boss.name,
    bossMaxHp: boss.maxHp,
    damageDealt: totalDamage,
    isDefeated,
    sleepBonus,
    breakdown,
    evaluatedAt: raid?.evaluated_at,
  };
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    // Cron mode: evaluate all users for the current week
    const weekStart = getWeekStart(new Date());
    const { data: profiles } = await supabase.from('profiles').select('*');

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: 'No profiles found' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    for (const profile of profiles) {
      const result = await evaluateUserBoss(supabase, profile.id, weekStart, profile);
      results.push(result);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Evaluated ${results.length} users for week ${weekStart}`,
      results,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Client mode: evaluate only the authenticated user
  const body = await req.json();
  const { weekStart } = body;
  const token = authHeader.replace('Bearer ', '');

  const { data: { user } } = await createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  ).auth.getUser(token);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
  }

  const result = await evaluateUserBoss(supabase, user.id, weekStart, profile);

  return new Response(JSON.stringify({
    success: true,
    ...result,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
