INSERT INTO recipe (id, name, url, deleted, tags, note) VALUES (1, 'Superfood', NULL, False, ARRAY['First Recipe'], 'Yummy Yummy Yummy i got love in my tummy');

SELECT setval('recipe_id_seq', (SELECT MAX(id) FROM recipe)+1);

INSERT INTO meal (date, recipe, type, notes) VALUES (CURRENT_DATE, 1, 'Dinner', NULL);
