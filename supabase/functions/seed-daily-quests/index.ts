// Supabase Edge Function: seed-daily-quests
// Inserts today's quests into daily_journal for each user from quest_definitions.
// Intended to be triggered daily via cron.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const today = new Date().toISOString().split('T')[0];

  // Get all non-campaign quest definitions
  const { data: questDefs } = await supabase
    .from('quest_definitions')
    .select('id')
    .eq('is_campaign', false);

  if (!questDefs || questDefs.length === 0) {
    return new Response(JSON.stringify({ message: 'No quest definitions found' }));
  }

  // Get all users
  const { data: profiles } = await supabase.from('profiles').select('id');

  if (!profiles || profiles.length === 0) {
    return new Response(JSON.stringify({ message: 'No users found' }));
  }

  let insertedCount = 0;

  for (const profile of profiles) {
    // --- Daily quests ---
    const journalEntries = questDefs.map((qd) => ({
      user_id: profile.id,
      quest_def_id: qd.id,
      date: today,
      completed: false,
      xp_awarded: 0,
    }));

    const { error } = await supabase
      .from('daily_journal')
      .upsert(journalEntries, { onConflict: 'user_id,quest_def_id,date', ignoreDuplicates: true });

    if (!error) {
      insertedCount += journalEntries.length;
    }

    // --- Campaign quests ---
    // Find or create an active campaign for the user
    let { data: campaign } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_complete', false)
      .limit(1)
      .single();

    if (!campaign) {
      const { data: newCampaign } = await supabase
        .from('campaigns')
        .insert({
          user_id: profile.id,
          campaign_name: 'The Sugar Swamp',
          current_day: 1,
          is_complete: false,
          completed_days: 0,
        })
        .select()
        .single();
      campaign = newCampaign;
    }

    if (campaign) {
      // Find the campaign quest for today's milestone day (if any)
      const { data: campaignQuest } = await supabase
        .from('quest_definitions')
        .select('id')
        .eq('is_campaign', true)
        .eq('campaign_day', campaign.current_day)
        .limit(1)
        .single();

      if (campaignQuest) {
        const { error: cErr } = await supabase
          .from('daily_journal')
          .upsert({
            user_id: profile.id,
            quest_def_id: campaignQuest.id,
            date: today,
            completed: false,
            xp_awarded: 0,
          }, { onConflict: 'user_id,quest_def_id,date', ignoreDuplicates: true });

        if (!cErr) insertedCount++;
      }
    }
  }

  return new Response(JSON.stringify({
    success: true,
    message: `Seeded ${insertedCount} journal entries for ${profiles.length} users`,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
