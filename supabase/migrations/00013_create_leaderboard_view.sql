-- Function to get leaderboard neighbors (limited visibility for ethics)
-- Returns only ±radius positions around the target user
CREATE OR REPLACE FUNCTION get_leaderboard_neighbors(target_user_id UUID, radius INT DEFAULT 2)
RETURNS TABLE(rank BIGINT, user_id UUID, username TEXT, level INT, total_xp BIGINT, class TEXT)
LANGUAGE sql SECURITY DEFINER AS $$
  WITH ranked AS (
    SELECT
      ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.created_at ASC) as rank,
      p.id as user_id,
      p.username,
      p.level,
      p.total_xp,
      p.class
    FROM profiles p
  ),
  target_rank AS (
    SELECT r.rank FROM ranked r WHERE r.user_id = target_user_id
  )
  SELECT r.rank, r.user_id, r.username, r.level, r.total_xp, r.class
  FROM ranked r, target_rank t
  WHERE r.rank BETWEEN t.rank - radius AND t.rank + radius
  ORDER BY r.rank ASC;
$$;
