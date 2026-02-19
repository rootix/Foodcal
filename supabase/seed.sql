INSERT INTO dish (id, name, url, deleted) VALUES (1, 'Superfood', NULL, false);

SELECT setval('dish_id_seq', (SELECT MAX(id) FROM dish)+1);

INSERT INTO meal (date, type, notes) VALUES (CURRENT_DATE, 'Dinner', NULL) RETURNING id;

INSERT INTO meal_dish (meal_id, dish_id)
SELECT id, 1 FROM meal WHERE date = CURRENT_DATE AND type = 'Dinner';
