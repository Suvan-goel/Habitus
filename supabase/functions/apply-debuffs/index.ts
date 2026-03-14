// Supabase Edge Function: apply-debuffs
// Sliding window check over past 3 days. Applies or clears debuffs based on habit completion.
// Intended to be triggered daily via cron.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEBUFF_RULES: Record<string, { category: string; windowDays: number; cause: string }> = {
  exhausted: { category: 'sleep', windowDays: 3, cause: 'sleep_below_threshold_3_days' },
  malnourished: { category: 'diet', windowDays: 3, cause: 'no_diet_tasks_3_days' },
  stressed: { category: 'mental_health', windowDays: 3, cause: 'no_mental_health_3_days' },
  isolated: { category: 'recreation', windowDays: 3, cause: 'no_recreation_3_days' },
  stagnant: { category: 'exercise', windowDays: 3, cause: 'no_exercise_3_days' },
};

const DEBUFF_LABELS: Record<string, string> = {
  exhausted: 'Exhausted',
  malnourished: 'Malnourished',
  stressed: 'Stressed',
  isolated: 'Isolated',
  stagnant: 'Stagnant',
};

const DEBUFF_DESCRIPTIONS: Record<string, string> = {
  exhausted: 'Poor sleep halves your Exercise XP!',
  malnourished: 'Poor diet halves all XP gains!',
  stressed: 'Neglected mental health halves Recreation XP!',
  isolated: 'No recreation halves Mental Health XP!',
  stagnant: 'No exercise halves Diet XP!',
};

async function sendPushNotification(token: string, title: string, body: string) {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: token, title, body, sound: 'default' }),
    });
  } catch (e) {
    console.warn('Push notification failed:', e);
  }
}

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Get all users with push tokens
  const { data: profiles } = await supabase.from('profiles').select('id, push_token');

  if (!profiles) {
    return new Response(JSON.stringify({ message: 'No profiles found' }));
  }

  const today = new Date();
  const threeDaysAgo = new Date(today.getTime() - 3 * 86400000).toISOString().split('T')[0];

  for (const profile of profiles) {
    const userId = profile.id;

    // Fetch recent journal entries
    const { data: recentEntries } = await supabase
      .from('daily_journal')
      .select('*, quest_definitions(category)')
      .eq('user_id', userId)
      .gte('date', threeDaysAgo);

    // Check each debuff rule
    for (const [debuffType, rule] of Object.entries(DEBUFF_RULES)) {
      const categoryEntries = (recentEntries ?? []).filter(
        (e) => (e.quest_definitions as any)?.category === rule.category && e.completed
      );

      let shouldHaveDebuff: boolean;
      if (debuffType === 'exhausted') {
        // For sleep: check quality (hours_slept), not just completion
        // Debuff applies if no sleep entries OR all sleep entries show < 6 hours
        shouldHaveDebuff = categoryEntries.length === 0 || categoryEntries.every(
          (e) => ((e.value as any)?.hours_slept ?? 0) < 6
        );
      } else {
        shouldHaveDebuff = categoryEntries.length === 0;
      }

      // Check if debuff already exists
      const { data: existingDebuff } = await supabase
        .from('active_debuffs')
        .select('*')
        .eq('user_id', userId)
        .eq('debuff_type', debuffType)
        .eq('is_active', true)
        .single();

      if (shouldHaveDebuff && !existingDebuff) {
        // Apply debuff
        await supabase.from('active_debuffs').insert({
          user_id: userId,
          debuff_type: debuffType,
          cause: rule.cause,
          is_active: true,
        });

        // Send push notification
        if (profile.push_token) {
          await sendPushNotification(
            profile.push_token,
            `${DEBUFF_LABELS[debuffType]} debuff applied!`,
            DEBUFF_DESCRIPTIONS[debuffType],
          );
        }
      } else if (!shouldHaveDebuff && existingDebuff) {
        // Clear debuff
        await supabase
          .from('active_debuffs')
          .update({ is_active: false, expires_at: new Date().toISOString() })
          .eq('id', existingDebuff.id);
      }
    }
  }

  return new Response(JSON.stringify({ success: true, message: 'Debuffs processed' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
