-- Quest Definitions: Daily quests across 5 categories
-- Each quest has a plain English name and an RPG-flavored name

-- EXERCISE quests (attribute: str)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category) VALUES
('Go for a 30-minute walk', 'Scout the Perimeter', 'Walk for at least 30 minutes', 'str', 15, 'normal', 'exercise'),
('Do a workout session', 'Train at the Arena', 'Complete a workout of any kind', 'str', 20, 'high', 'exercise'),
('Take the stairs', 'Climb the Tower', 'Use stairs instead of the elevator', 'str', 10, 'normal', 'exercise'),
('Stretch for 10 minutes', 'Limber Up for Battle', 'Do a stretching routine', 'str', 10, 'normal', 'exercise');

-- DIET quests (attribute: con)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category) VALUES
('Drink 2L of water', 'Consume Potion of Hydration', 'Stay hydrated throughout the day', 'con', 15, 'high', 'diet'),
('Eat a serving of vegetables', 'Forage for Herbs', 'Include vegetables in a meal', 'con', 10, 'normal', 'diet'),
('Avoid processed sugar', 'Resist the Sugar Fiend', 'Go without sweets or sugary drinks', 'con', 15, 'normal', 'diet'),
('Eat a balanced meal', 'Prepare a Feast', 'Have a meal with protein, carbs, and vegetables', 'con', 10, 'normal', 'diet');

-- SLEEP quests (attribute: sta)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category) VALUES
('Sleep 7+ hours', 'Rest at the Inn', 'Get at least 7 hours of sleep', 'sta', 20, 'high', 'sleep'),
('No screens 30min before bed', 'Ward Off the Blue Light Curse', 'Avoid screens before sleeping', 'sta', 15, 'normal', 'sleep'),
('Wake up at a consistent time', 'Honor the Dawn Ritual', 'Wake within 30 minutes of your target time', 'sta', 10, 'normal', 'sleep');

-- MENTAL HEALTH quests (attribute: wis)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category) VALUES
('Meditate for 10 minutes', 'Enter the Mindscape', 'Practice mindfulness or meditation', 'wis', 15, 'high', 'mental_health'),
('Write in a journal', 'Record Your Chronicles', 'Spend time journaling thoughts or feelings', 'wis', 15, 'normal', 'mental_health'),
('Read for 20 minutes', 'Study the Ancient Tomes', 'Read a book (not social media)', 'wis', 10, 'normal', 'mental_health'),
('Practice deep breathing', 'Channel Inner Energy', 'Do a breathing exercise', 'wis', 10, 'normal', 'mental_health');

-- RECREATION quests (attribute: cha)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category) VALUES
('Spend time with friends/family', 'Join the Fellowship', 'Socialise for at least 30 minutes', 'cha', 15, 'high', 'recreation'),
('Do a hobby for 30 minutes', 'Pursue Your Craft', 'Engage in a hobby you enjoy', 'cha', 15, 'normal', 'recreation'),
('Go outside for leisure', 'Explore the Overworld', 'Spend time outdoors for fun', 'cha', 10, 'normal', 'recreation'),
('Listen to music or a podcast', 'Attend the Bard''s Concert', 'Enjoy audio entertainment', 'cha', 10, 'normal', 'recreation');

-- CAMPAIGN: "The Sugar Swamp" (30-day no processed sugar challenge)
INSERT INTO quest_definitions (title_plain, title_rpg, description, attribute, base_xp, priority, category, is_campaign, campaign_day) VALUES
('No processed sugar - Day 1', 'Enter The Sugar Swamp - Day 1', 'Begin your journey through the Sugar Swamp', 'con', 20, 'high', 'diet', true, 1),
('No processed sugar - Day 7', 'Sugar Swamp - The First Trial', 'One week without processed sugar', 'con', 30, 'high', 'diet', true, 7),
('No processed sugar - Day 14', 'Sugar Swamp - Halfway Point', 'Two weeks without processed sugar', 'con', 40, 'high', 'diet', true, 14),
('No processed sugar - Day 21', 'Sugar Swamp - The Final Stretch', 'Three weeks without processed sugar', 'con', 50, 'high', 'diet', true, 21),
('No processed sugar - Day 30', 'Escape The Sugar Swamp!', 'Complete! 30 days without processed sugar', 'con', 100, 'critical', 'diet', true, 30);
