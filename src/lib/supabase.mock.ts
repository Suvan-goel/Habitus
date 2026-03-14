/**
 * In-memory mock of the Supabase client.
 * Allows the full app to run without a Supabase project.
 * Data resets on every app reload.
 */

// ── helpers ──────────────────────────────────────────────────────────
let _idCounter = 0;
const uid = () => `mock-${++_idCounter}-${Date.now()}`;
const today = () => new Date().toISOString().split('T')[0];

// ── in-memory tables ─────────────────────────────────────────────────
const tables: Record<string, any[]> = {
  profiles: [],
  stats_live: [],
  quest_definitions: [],
  daily_journal: [],
  boss_raids: [],
  active_debuffs: [],
  campaigns: [],
  loot: [],
  friendships: [],
  duels: [],
};

// ── seed quest definitions ───────────────────────────────────────────
const SEED_QUESTS = [
  { title_plain: 'Go for a 30-minute walk', title_rpg: 'Scout the Perimeter', description: 'Walk for at least 30 minutes', attribute: 'str', base_xp: 15, priority: 'normal', category: 'exercise', is_campaign: false, campaign_day: null },
  { title_plain: 'Do a workout session', title_rpg: 'Train at the Arena', description: 'Complete a workout of any kind', attribute: 'str', base_xp: 20, priority: 'high', category: 'exercise', is_campaign: false, campaign_day: null },
  { title_plain: 'Take the stairs', title_rpg: 'Climb the Tower', description: 'Use stairs instead of the elevator', attribute: 'str', base_xp: 10, priority: 'normal', category: 'exercise', is_campaign: false, campaign_day: null },
  { title_plain: 'Stretch for 10 minutes', title_rpg: 'Limber Up for Battle', description: 'Do a stretching routine', attribute: 'str', base_xp: 10, priority: 'normal', category: 'exercise', is_campaign: false, campaign_day: null },
  { title_plain: 'Drink 2L of water', title_rpg: 'Consume Potion of Hydration', description: 'Stay hydrated throughout the day', attribute: 'con', base_xp: 15, priority: 'high', category: 'diet', is_campaign: false, campaign_day: null },
  { title_plain: 'Eat a serving of vegetables', title_rpg: 'Forage for Herbs', description: 'Include vegetables in a meal', attribute: 'con', base_xp: 10, priority: 'normal', category: 'diet', is_campaign: false, campaign_day: null },
  { title_plain: 'Avoid processed sugar', title_rpg: 'Resist the Sugar Fiend', description: 'Go without sweets or sugary drinks', attribute: 'con', base_xp: 15, priority: 'normal', category: 'diet', is_campaign: false, campaign_day: null },
  { title_plain: 'Eat a balanced meal', title_rpg: 'Prepare a Feast', description: 'Have a meal with protein, carbs, and vegetables', attribute: 'con', base_xp: 10, priority: 'normal', category: 'diet', is_campaign: false, campaign_day: null },
  { title_plain: 'Sleep 7+ hours', title_rpg: 'Rest at the Inn', description: 'Get at least 7 hours of sleep', attribute: 'sta', base_xp: 20, priority: 'high', category: 'sleep', is_campaign: false, campaign_day: null },
  { title_plain: 'No screens 30min before bed', title_rpg: 'Ward Off the Blue Light Curse', description: 'Avoid screens before sleeping', attribute: 'sta', base_xp: 15, priority: 'normal', category: 'sleep', is_campaign: false, campaign_day: null },
  { title_plain: 'Wake up at a consistent time', title_rpg: 'Honor the Dawn Ritual', description: 'Wake within 30 minutes of your target time', attribute: 'sta', base_xp: 10, priority: 'normal', category: 'sleep', is_campaign: false, campaign_day: null },
  { title_plain: 'Meditate for 10 minutes', title_rpg: 'Enter the Mindscape', description: 'Practice mindfulness or meditation', attribute: 'wis', base_xp: 15, priority: 'high', category: 'mental_health', is_campaign: false, campaign_day: null },
  { title_plain: 'Write in a journal', title_rpg: 'Record Your Chronicles', description: 'Spend time journaling thoughts or feelings', attribute: 'wis', base_xp: 15, priority: 'normal', category: 'mental_health', is_campaign: false, campaign_day: null },
  { title_plain: 'Read for 20 minutes', title_rpg: 'Study the Ancient Tomes', description: 'Read a book (not social media)', attribute: 'wis', base_xp: 10, priority: 'normal', category: 'mental_health', is_campaign: false, campaign_day: null },
  { title_plain: 'Practice deep breathing', title_rpg: 'Channel Inner Energy', description: 'Do a breathing exercise', attribute: 'wis', base_xp: 10, priority: 'normal', category: 'mental_health', is_campaign: false, campaign_day: null },
  { title_plain: 'Spend time with friends/family', title_rpg: 'Join the Fellowship', description: 'Socialise for at least 30 minutes', attribute: 'cha', base_xp: 15, priority: 'high', category: 'recreation', is_campaign: false, campaign_day: null },
  { title_plain: 'Do a hobby for 30 minutes', title_rpg: 'Pursue Your Craft', description: 'Engage in a hobby you enjoy', attribute: 'cha', base_xp: 15, priority: 'normal', category: 'recreation', is_campaign: false, campaign_day: null },
  { title_plain: 'Go outside for leisure', title_rpg: 'Explore the Overworld', description: 'Spend time outdoors for fun', attribute: 'cha', base_xp: 10, priority: 'normal', category: 'recreation', is_campaign: false, campaign_day: null },
  { title_plain: 'Listen to music or a podcast', title_rpg: "Attend the Bard's Concert", description: 'Enjoy audio entertainment', attribute: 'cha', base_xp: 10, priority: 'normal', category: 'recreation', is_campaign: false, campaign_day: null },
  // Campaign: The Sugar Swamp
  { title_plain: 'No processed sugar - Day 1', title_rpg: 'Enter The Sugar Swamp - Day 1', description: 'Begin your journey through the Sugar Swamp', attribute: 'con', base_xp: 20, priority: 'high', category: 'diet', is_campaign: true, campaign_day: 1 },
  { title_plain: 'No processed sugar - Day 7', title_rpg: 'Sugar Swamp - The First Trial', description: 'One week without processed sugar', attribute: 'con', base_xp: 30, priority: 'high', category: 'diet', is_campaign: true, campaign_day: 7 },
  { title_plain: 'No processed sugar - Day 14', title_rpg: 'Sugar Swamp - Halfway Point', description: 'Two weeks without processed sugar', attribute: 'con', base_xp: 40, priority: 'high', category: 'diet', is_campaign: true, campaign_day: 14 },
  { title_plain: 'No processed sugar - Day 21', title_rpg: 'Sugar Swamp - The Final Stretch', description: 'Three weeks without processed sugar', attribute: 'con', base_xp: 50, priority: 'high', category: 'diet', is_campaign: true, campaign_day: 21 },
  { title_plain: 'No processed sugar - Day 30', title_rpg: 'Escape The Sugar Swamp!', description: 'Complete! 30 days without processed sugar', attribute: 'con', base_xp: 100, priority: 'critical', category: 'diet', is_campaign: true, campaign_day: 30 },
];

// Initialise quest_definitions with IDs
for (const q of SEED_QUESTS) {
  tables.quest_definitions.push({ id: uid(), ...q });
}

// ── date helpers ──────────────────────────────────────────────────────
/** Returns the Monday of the week containing `date` as YYYY-MM-DD. */
function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/** Returns the Monday `weeksAgo` weeks before the current week's Monday. */
function pastMonday(weeksAgo: number): string {
  const now = new Date();
  now.setDate(now.getDate() - weeksAgo * 7);
  return getMonday(now);
}

const THIS_MONDAY = getMonday(new Date());

// ── seed fake leaderboard profiles ────────────────────────────────────
const FAKE_PROFILES = [
  { id: 'npc-1', username: 'Ironclad Rex',     class: 'warrior', level: 16, total_xp: 4200, created_at: '2025-12-01T00:00:00Z' },
  { id: 'npc-2', username: 'Silent Lotus',     class: 'monk',    level: 14, total_xp: 3400, created_at: '2025-12-05T00:00:00Z' },
  { id: 'npc-3', username: 'Melody Dusk',      class: 'bard',    level: 11, total_xp: 2100, created_at: '2025-12-10T00:00:00Z' },
  { id: 'npc-4', username: 'Boulder Fist',     class: 'warrior', level: 9,  total_xp: 1500, created_at: '2026-01-02T00:00:00Z' },
  { id: 'npc-5', username: 'Moonwhisper',      class: 'monk',    level: 7,  total_xp: 950,  created_at: '2026-01-10T00:00:00Z' },
  { id: 'npc-6', username: 'Jester Spark',     class: 'bard',    level: 5,  total_xp: 520,  created_at: '2026-01-18T00:00:00Z' },
  { id: 'npc-7', username: 'Crimson Vanguard', class: 'warrior', level: 18, total_xp: 5600, created_at: '2025-11-20T00:00:00Z' },
  { id: 'npc-8', username: 'Ember Sage',       class: 'monk',    level: 3,  total_xp: 180,  created_at: '2026-02-01T00:00:00Z' },
];

for (const p of FAKE_PROFILES) {
  tables.profiles.push({ ...p, avatar_config: {}, updated_at: p.created_at });
  tables.stats_live.push({
    id: uid(), user_id: p.id,
    str: Math.floor(p.total_xp * 0.25 / 10),
    con: Math.floor(p.total_xp * 0.20 / 10),
    sta: Math.floor(p.total_xp * 0.20 / 10),
    wis: Math.floor(p.total_xp * 0.18 / 10),
    cha: Math.floor(p.total_xp * 0.17 / 10),
    updated_at: p.created_at,
  });
}

// ── seed boss raids for mock-user-1 ──────────────────────────────────
// Current week — in-progress fight against "Procrastination Hydra"
tables.boss_raids.push({
  id: uid(), user_id: 'mock-user-1', week_start: THIS_MONDAY,
  boss_name: 'Procrastination Hydra', boss_max_hp: 70,
  damage_dealt: 32, is_defeated: false, sleep_bonus: false,
  breakdown: { exercise: 8, diet: 6, sleep: 6, mental_health: 5, recreation: 7 },
  evaluated_at: new Date().toISOString(),
});

// Past weeks — mix of victories and defeats
tables.boss_raids.push({
  id: uid(), user_id: 'mock-user-1', week_start: pastMonday(1),
  boss_name: 'The Burnout Behemoth', boss_max_hp: 50,
  damage_dealt: 54, is_defeated: true, sleep_bonus: false,
  breakdown: { exercise: 14, diet: 12, sleep: 10, mental_health: 9, recreation: 9 },
  evaluated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
});

tables.boss_raids.push({
  id: uid(), user_id: 'mock-user-1', week_start: pastMonday(2),
  boss_name: 'Anxiety Specter', boss_max_hp: 55,
  damage_dealt: 41, is_defeated: false, sleep_bonus: false,
  breakdown: { exercise: 10, diet: 8, sleep: 7, mental_health: 6, recreation: 10 },
  evaluated_at: new Date(Date.now() - 14 * 86400000).toISOString(),
});

tables.boss_raids.push({
  id: uid(), user_id: 'mock-user-1', week_start: pastMonday(3),
  boss_name: 'Sloth Dragon', boss_max_hp: 60,
  damage_dealt: 72, is_defeated: true, sleep_bonus: true,
  breakdown: { exercise: 12, diet: 10, sleep: 14, mental_health: 8, recreation: 4, sleep_bonus: 24 },
  evaluated_at: new Date(Date.now() - 21 * 86400000).toISOString(),
});

tables.boss_raids.push({
  id: uid(), user_id: 'mock-user-1', week_start: pastMonday(4),
  boss_name: 'Sugar Fiend', boss_max_hp: 45,
  damage_dealt: 38, is_defeated: false, sleep_bonus: false,
  breakdown: { exercise: 9, diet: 5, sleep: 8, mental_health: 7, recreation: 9 },
  evaluated_at: new Date(Date.now() - 28 * 86400000).toISOString(),
});

// ── current mock user state (auto-signed-in, no login needed) ────────
let mockUser: { id: string; email: string } | null = { id: 'mock-user-1', email: 'player@habitus.local' };
let mockSession: any = { user: mockUser, access_token: 'mock-token' };
let authListener: ((event: string, session: any) => void) | null = null;

// ── CLASS_MULTIPLIERS & ATTRIBUTE_MAP (duplicated here for edge fn logic) ─
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
const STREAK_LOOT = [
  { streak: 3, item: 'Bronze Shield', type: 'armor', rarity: 'common' },
  { streak: 7, item: 'Iron Sword', type: 'weapon', rarity: 'uncommon' },
  { streak: 14, item: 'Silver Helm', type: 'helmet', rarity: 'rare' },
  { streak: 21, item: 'Baby Dragon Companion', type: 'pet', rarity: 'rare' },
  { streak: 30, item: 'Golden Aura', type: 'aura', rarity: 'epic' },
  { streak: 60, item: 'Legendary Crown', type: 'helmet', rarity: 'legendary' },
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getLevelFromTotalXp(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  let xpRequired = Math.floor(100 * Math.pow(level, 1.5));
  while (remaining >= xpRequired) {
    remaining -= xpRequired;
    level++;
    xpRequired = Math.floor(100 * Math.pow(level, 1.5));
  }
  return level;
}

// ── seed daily quests for a user ─────────────────────────────────────
function seedQuestsForUser(userId: string) {
  const todayStr = today();
  const dailyDefs = tables.quest_definitions.filter((q: any) => !q.is_campaign);
  for (const qd of dailyDefs) {
    const exists = tables.daily_journal.find(
      (j: any) => j.user_id === userId && j.quest_def_id === qd.id && j.date === todayStr
    );
    if (!exists) {
      tables.daily_journal.push({
        id: uid(), user_id: userId, quest_def_id: qd.id, date: todayStr,
        completed: false, completed_at: null, xp_awarded: 0, value: null,
      });
    }
  }

  // Campaign quest
  let campaign = tables.campaigns.find((c: any) => c.user_id === userId && !c.is_complete);
  if (!campaign) {
    campaign = {
      id: uid(), user_id: userId, campaign_name: 'The Sugar Swamp',
      started_at: todayStr, current_day: 1, is_complete: false, completed_days: 0,
    };
    tables.campaigns.push(campaign);
  }
  const campaignQuest = tables.quest_definitions.find(
    (q: any) => q.is_campaign && q.campaign_day === campaign.current_day
  );
  if (campaignQuest) {
    const exists = tables.daily_journal.find(
      (j: any) => j.user_id === userId && j.quest_def_id === campaignQuest.id && j.date === todayStr
    );
    if (!exists) {
      tables.daily_journal.push({
        id: uid(), user_id: userId, quest_def_id: campaignQuest.id, date: todayStr,
        completed: false, completed_at: null, xp_awarded: 0, value: null,
      });
    }
  }
}

// ── edge function implementations ────────────────────────────────────
function completeQuestFn(body: any) {
  const userId = mockUser?.id;
  if (!userId) return { data: null, error: { message: 'Unauthorized' } };

  const { journalEntryId, value } = body;
  const entry = tables.daily_journal.find((j: any) => j.id === journalEntryId && j.user_id === userId);
  if (!entry) return { data: null, error: { message: 'Quest not found' } };
  if (entry.completed) return { data: null, error: { message: 'Already completed' } };

  const questDef = tables.quest_definitions.find((q: any) => q.id === entry.quest_def_id);
  const profile = tables.profiles.find((p: any) => p.id === userId);
  const stats = tables.stats_live.find((s: any) => s.user_id === userId);
  const debuffs = tables.active_debuffs.filter((d: any) => d.user_id === userId && d.is_active);

  // Calculate XP
  let xp = questDef.base_xp;
  const classMultiplier = CLASS_MULTIPLIERS[profile.class]?.[questDef.category] ?? 1;
  xp = xp * classMultiplier;
  for (const debuff of debuffs) {
    const affected = ({ exhausted: 'exercise', malnourished: 'all', stressed: 'recreation', isolated: 'mental_health', stagnant: 'diet' } as any)[debuff.debuff_type];
    if (affected === 'all' || affected === questDef.category) xp = Math.floor(xp / 2);
  }
  xp = Math.max(1, xp);

  // Update journal
  entry.completed = true;
  entry.completed_at = new Date().toISOString();
  entry.xp_awarded = xp;
  entry.value = value ?? null;

  // Update stats (primary + secondary)
  const { primary: primaryAttr, secondary: secondaryAttr } = ATTRIBUTE_MAP[questDef.category];
  const statInc = Math.ceil(xp / 10);
  if (stats) {
    stats[primaryAttr] = (stats[primaryAttr] ?? 0) + statInc;
    if (secondaryAttr) {
      const secondaryInc = Math.ceil(xp * SECONDARY_XP_RATIO / 10);
      stats[secondaryAttr] = (stats[secondaryAttr] ?? 0) + secondaryInc;
    }
    stats.updated_at = new Date().toISOString();
  }

  // Update profile
  const newTotalXp = profile.total_xp + xp;
  const newLevel = getLevelFromTotalXp(newTotalXp);
  const leveledUp = newLevel > profile.level;
  profile.total_xp = newTotalXp;
  profile.level = newLevel;

  // Campaign progression
  if (questDef.is_campaign) {
    const campaign = tables.campaigns.find((c: any) => c.user_id === userId && !c.is_complete);
    if (campaign) {
      campaign.completed_days += 1;
      campaign.current_day += 1;
      if (campaign.current_day > 30) campaign.is_complete = true;
    }
  }

  // Streak loot
  let lootAwarded = null;
  const recentCompleted = tables.daily_journal.filter((j: any) => j.user_id === userId && j.completed).length;
  for (const lootDef of STREAK_LOOT) {
    if (recentCompleted === lootDef.streak) {
      const exists = tables.loot.find((l: any) => l.user_id === userId && l.source === `streak_${lootDef.streak}`);
      if (!exists) {
        const lootItem = {
          id: uid(), user_id: userId, item_name: lootDef.item, item_type: lootDef.type,
          rarity: lootDef.rarity, earned_at: new Date().toISOString(), source: `streak_${lootDef.streak}`, equipped: false,
        };
        tables.loot.push(lootItem);
        lootAwarded = { itemName: lootDef.item, itemType: lootDef.type, rarity: lootDef.rarity };
      }
      break;
    }
  }

  return {
    data: {
      success: true, xpAwarded: xp, newTotalXp, newLevel,
      statUpdated: primaryAttr, statNewValue: stats?.[primaryAttr] ?? 0,
      secondaryStatUpdated: secondaryAttr ?? undefined,
      secondaryStatNewValue: secondaryAttr ? (stats?.[secondaryAttr] ?? 0) : undefined,
      lootAwarded, leveledUp,
    },
    error: null,
  };
}

function evaluateBossFn(body: any) {
  const userId = mockUser?.id;
  if (!userId) return { data: null, error: { message: 'Unauthorized' } };

  const { weekStart } = body;
  const profile = tables.profiles.find((p: any) => p.id === userId);
  if (!profile) return { data: null, error: { message: 'No profile' } };

  const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 86400000).toISOString().split('T')[0];
  const entries = tables.daily_journal.filter(
    (j: any) => j.user_id === userId && j.completed && j.date >= weekStart && j.date < weekEnd
  );
  const debuffs = tables.active_debuffs.filter((d: any) => d.user_id === userId && d.is_active);

  const breakdown: Record<string, number> = {};
  let totalDamage = 0;
  for (const entry of entries) {
    const questDef = tables.quest_definitions.find((q: any) => q.id === entry.quest_def_id);
    if (!questDef) continue;
    const classMultiplier = CLASS_MULTIPLIERS[profile.class]?.[questDef.category] ?? 1;
    const damage = 1 * classMultiplier;
    totalDamage += damage;
    breakdown[questDef.category] = (breakdown[questDef.category] ?? 0) + damage;
  }

  const debuffPenalty = debuffs.length * 5;
  totalDamage = Math.max(0, totalDamage - debuffPenalty);
  if (debuffPenalty > 0) breakdown['debuff_penalty'] = -debuffPenalty;

  const sleepEntries = entries.filter((e: any) => {
    const qd = tables.quest_definitions.find((q: any) => q.id === e.quest_def_id);
    return qd?.category === 'sleep' && e.value?.hours_slept >= 7;
  });
  const sleepBonus = sleepEntries.length >= 5;
  if (sleepBonus) {
    const bonus = Math.floor(totalDamage * 0.5);
    totalDamage = Math.floor(totalDamage * 1.5);
    breakdown['sleep_bonus'] = bonus;
  }

  const bossIdx = Math.abs(hashCode(weekStart + userId)) % BOSS_TEMPLATES.length;
  const boss = BOSS_TEMPLATES[bossIdx];
  const isDefeated = totalDamage >= boss.maxHp;

  // Upsert boss raid
  let raid = tables.boss_raids.find((b: any) => b.user_id === userId && b.week_start === weekStart);
  if (raid) {
    Object.assign(raid, {
      boss_name: boss.name, boss_max_hp: boss.maxHp, damage_dealt: totalDamage,
      is_defeated: isDefeated, sleep_bonus: sleepBonus, breakdown, evaluated_at: new Date().toISOString(),
    });
  } else {
    raid = {
      id: uid(), user_id: userId, week_start: weekStart,
      boss_name: boss.name, boss_max_hp: boss.maxHp, damage_dealt: totalDamage,
      is_defeated: isDefeated, sleep_bonus: sleepBonus, breakdown, evaluated_at: new Date().toISOString(),
    };
    tables.boss_raids.push(raid);
  }

  // Boss loot
  if (isDefeated) {
    const exists = tables.loot.find((l: any) => l.user_id === userId && l.source === `boss_${weekStart}`);
    if (!exists) {
      tables.loot.push({
        id: uid(), user_id: userId, item_name: `${boss.name} Trophy`, item_type: 'title',
        rarity: 'rare', earned_at: new Date().toISOString(), source: `boss_${weekStart}`, equipped: false,
      });
    }
  }

  return {
    data: {
      success: true, id: raid.id, weekStart, bossName: boss.name, bossMaxHp: boss.maxHp,
      damageDealt: totalDamage, isDefeated, sleepBonus, breakdown, evaluatedAt: raid.evaluated_at,
    },
    error: null,
  };
}

// ── query builder ────────────────────────────────────────────────────
function createQueryBuilder(tableName: string, operation: string, payload?: any) {
  let rows = [...(tables[tableName] ?? [])];
  const filters: Array<{ col: string; op: string; val: any }> = [];
  let orderCol: string | null = null;
  let orderAsc = true;
  let limitN: number | null = null;
  let selectColumns = '*';
  let isSingle = false;
  let isCount = false;
  let isHead = false;

  const builder: any = {
    select(cols?: string, opts?: { count?: string; head?: boolean }) {
      if (cols) selectColumns = cols;
      if (opts?.count) isCount = true;
      if (opts?.head) isHead = true;
      return builder;
    },
    eq(col: string, val: any) { filters.push({ col, op: 'eq', val }); return builder; },
    gte(col: string, val: any) { filters.push({ col, op: 'gte', val }); return builder; },
    lt(col: string, val: any) { filters.push({ col, op: 'lt', val }); return builder; },
    order(col: string, opts?: { ascending?: boolean }) {
      orderCol = col;
      orderAsc = opts?.ascending ?? true;
      return builder;
    },
    limit(n: number) { limitN = n; return builder; },
    single() { isSingle = true; return builder; },

    then(resolve: (val: any) => void, reject?: (err: any) => void) {
      Promise.resolve()
        .then(() => execute())
        .then(resolve, reject);
    },
  };

  function execute() {
    if (operation === 'insert') {
      const items = Array.isArray(payload) ? payload : [payload];
      for (const item of items) {
        const row = { id: item.id ?? uid(), ...item };
        tables[tableName].push(row);
      }
      // Return chain for .select().single()
      if (isSingle && items.length === 1) {
        return { data: tables[tableName][tables[tableName].length - 1], error: null };
      }
      return { data: items, error: null };
    }

    if (operation === 'upsert') {
      const items = Array.isArray(payload) ? payload : [payload];
      for (const item of items) {
        // Try to find existing by filters or unique columns
        const existing = tables[tableName].find((r: any) => {
          if (item.user_id && item.quest_def_id && item.date) {
            return r.user_id === item.user_id && r.quest_def_id === item.quest_def_id && r.date === item.date;
          }
          if (item.user_id && item.week_start) {
            return r.user_id === item.user_id && r.week_start === item.week_start;
          }
          return false;
        });
        if (existing) {
          Object.assign(existing, item);
        } else {
          tables[tableName].push({ id: uid(), ...item });
        }
      }
      // Support .select().single() after upsert
      if (isSingle) {
        const last = tables[tableName][tables[tableName].length - 1];
        return { data: last, error: null };
      }
      return { data: null, error: null };
    }

    if (operation === 'update') {
      let targets = [...tables[tableName]];
      for (const f of filters) {
        targets = targets.filter((r: any) => {
          if (f.op === 'eq') return r[f.col] === f.val;
          return true;
        });
      }
      for (const row of targets) {
        Object.assign(row, payload);
      }
      return { data: targets, error: null };
    }

    if (operation === 'delete') {
      for (const f of filters) {
        tables[tableName] = tables[tableName].filter((r: any) => {
          if (f.op === 'eq') return r[f.col] !== f.val;
          return false;
        });
      }
      return { data: null, error: null };
    }

    // SELECT
    let result = [...tables[tableName]];

    for (const f of filters) {
      result = result.filter((r: any) => {
        if (f.op === 'eq') return r[f.col] === f.val;
        if (f.op === 'gte') return r[f.col] >= f.val;
        if (f.op === 'lt') return r[f.col] < f.val;
        return true;
      });
    }

    if (orderCol) {
      const col = orderCol;
      result.sort((a: any, b: any) => {
        if (a[col] < b[col]) return orderAsc ? -1 : 1;
        if (a[col] > b[col]) return orderAsc ? 1 : -1;
        return 0;
      });
    }

    if (limitN) result = result.slice(0, limitN);

    // Join quest_definitions if select includes it
    if (selectColumns.includes('quest_definitions') && tableName === 'daily_journal') {
      result = result.map((r: any) => ({
        ...r,
        quest_definitions: tables.quest_definitions.find((q: any) => q.id === r.quest_def_id) ?? null,
      }));
    }

    if (isCount && isHead) {
      return { data: null, count: result.length, error: null };
    }

    if (isSingle) {
      return { data: result[0] ?? null, error: result[0] ? null : { message: 'Not found', code: 'PGRST116' } };
    }

    return { data: result, error: null };
  }

  return builder;
}

// ── mock supabase client ─────────────────────────────────────────────
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: mockSession }, error: null }),

    getUser: async () => ({ data: { user: mockUser }, error: null }),

    signUp: async ({ email }: { email: string; password: string }) => {
      mockUser = { id: uid(), email };
      mockSession = { user: mockUser, access_token: 'mock-token' };
      setTimeout(() => authListener?.('SIGNED_IN', mockSession), 0);
      return { data: { user: mockUser, session: mockSession }, error: null };
    },

    signInWithPassword: async ({ email }: { email: string; password: string }) => {
      // If a profile already exists for this email, restore that user
      const existingProfile = tables.profiles.find((p: any) =>
        mockUser?.email === email || p.username === email
      );
      if (existingProfile) {
        mockUser = { id: existingProfile.id, email };
      } else {
        mockUser = { id: uid(), email };
      }
      mockSession = { user: mockUser, access_token: 'mock-token' };
      setTimeout(() => authListener?.('SIGNED_IN', mockSession), 0);
      return { data: { user: mockUser, session: mockSession }, error: null };
    },

    signOut: async () => {
      mockUser = null;
      mockSession = null;
      setTimeout(() => authListener?.('SIGNED_OUT', null), 0);
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authListener = callback;
      return { data: { subscription: { unsubscribe: () => { authListener = null; } } } };
    },
  },

  from: (tableName: string) => ({
    select: (cols?: string, opts?: any) => {
      const b = createQueryBuilder(tableName, 'select');
      b.select(cols, opts);
      return b;
    },
    insert: (data: any) => createQueryBuilder(tableName, 'insert', data),
    upsert: (data: any, _opts?: any) => createQueryBuilder(tableName, 'upsert', data),
    update: (data: any) => createQueryBuilder(tableName, 'update', data),
    delete: () => createQueryBuilder(tableName, 'delete'),
  }),

  rpc: async (fnName: string, params?: any) => {
    if (fnName === 'get_leaderboard_neighbors') {
      const targetUserId = params?.target_user_id;
      const radius = params?.radius ?? 2;
      const sorted = [...tables.profiles].sort((a: any, b: any) => (b.total_xp ?? 0) - (a.total_xp ?? 0));
      const ranked = sorted.map((p: any, i: number) => ({
        rank: i + 1,
        user_id: p.id,
        username: p.username,
        level: p.level ?? 1,
        total_xp: p.total_xp ?? 0,
        class: p.class,
      }));
      const targetIdx = ranked.findIndex((r: any) => r.user_id === targetUserId);
      if (targetIdx === -1) return { data: ranked.slice(0, radius * 2 + 1), error: null };
      const start = Math.max(0, targetIdx - radius);
      const end = Math.min(ranked.length, targetIdx + radius + 1);
      return { data: ranked.slice(start, end), error: null };
    }
    return { data: null, error: { message: `Unknown rpc: ${fnName}` } };
  },

  functions: {
    invoke: async (fnName: string, opts?: { body?: any }) => {
      const body = opts?.body ?? {};
      if (fnName === 'complete-quest') return completeQuestFn(body);
      if (fnName === 'evaluate-boss') return evaluateBossFn(body);
      if (fnName === 'seed-daily-quests') {
        if (mockUser) seedQuestsForUser(mockUser.id);
        return { data: { success: true }, error: null };
      }
      if (fnName === 'apply-debuffs') {
        return { data: { success: true }, error: null };
      }
      return { data: null, error: { message: `Unknown function: ${fnName}` } };
    },
  },
};
