-- Add push_token column to profiles for expo push notifications
ALTER TABLE profiles ADD COLUMN push_token TEXT;
