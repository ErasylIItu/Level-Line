-- Level Line — optional seed data
-- Populates the same sample content used while designing the UI,
-- so the app looks right the moment you connect it. Safe to skip
-- or delete once you add your real content via the Admin Dashboard.

insert into reading_passages (id, title, body, order_index) values
  (
    gen_random_uuid(),
    'The Rise of Remote Work',
    E'Over the past decade, remote work has shifted from a rare perk to a mainstream way of working. Advances in communication technology, combined with changing employee expectations, have pushed many companies to rethink where and how work gets done.\n\nProponents argue that remote work increases flexibility and productivity, allowing people to design schedules around their most focused hours. Critics, however, point to challenges such as isolation, blurred work-life boundaries, and the difficulty of building strong team culture without in-person interaction.\n\nAs organizations continue to experiment with hybrid models, the debate over the ideal balance between remote and in-office work remains far from settled.',
    1
  );

-- Vocabulary
insert into questions (type, prompt, options, correct_option_id, order_index) values
  (
    'vocabulary',
    'Choose the word that best completes the sentence: "She was too ______ to speak in front of the class."',
    '[{"id":"a","label":"nervous"},{"id":"b","label":"generous"},{"id":"c","label":"curious"},{"id":"d","label":"obvious"}]',
    'a',
    1
  ),
  (
    'vocabulary',
    'Which word means the opposite of "abundant"?',
    '[{"id":"a","label":"Plentiful"},{"id":"b","label":"Scarce"},{"id":"c","label":"Massive"},{"id":"d","label":"Frequent"}]',
    'b',
    2
  );

-- Grammar
insert into questions (type, prompt, options, correct_option_id, order_index) values
  (
    'grammar',
    'Select the correct sentence.',
    '[{"id":"a","label":"She don''t like coffee in the morning."},{"id":"b","label":"She doesn''t likes coffee in the morning."},{"id":"c","label":"She doesn''t like coffee in the morning."},{"id":"d","label":"She not like coffee in the morning."}]',
    'c',
    1
  );

-- Reading (linked to the passage above)
insert into questions (type, prompt, options, correct_option_id, order_index, passage_id)
select
  'reading',
  'According to the passage, what is one criticism of remote work?',
  '[{"id":"a","label":"It reduces access to communication technology."},{"id":"b","label":"It can lead to isolation and weaker team culture."},{"id":"c","label":"It always decreases productivity."},{"id":"d","label":"It is no longer used by companies."}]',
  'b',
  1,
  id
from reading_passages where title = 'The Rise of Remote Work';
