-- Evaluate weekly boss every Sunday at 23:00 UTC
SELECT cron.schedule(
  'evaluate-boss-weekly',
  '0 23 * * 0',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/evaluate-boss',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  )$$
);
