-- 1. Drop old view first (it depends on columns we're about to remove)
DROP VIEW IF EXISTS recipe_with_last_preparation;

-- 2. Rename recipe → dish
ALTER TABLE recipe RENAME TO dish;
ALTER TABLE dish RENAME CONSTRAINT recipe_pkey TO dish_pkey;
ALTER TABLE dish RENAME CONSTRAINT recipe_name_key TO dish_name_key;

-- 3. Drop removed columns from dish
ALTER TABLE dish DROP COLUMN IF EXISTS note;
ALTER TABLE dish DROP COLUMN IF EXISTS tags;

-- 4. Create n:n join table
CREATE TABLE meal_dish (
  meal_id BIGINT NOT NULL REFERENCES meal(id) ON DELETE CASCADE,
  dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE RESTRICT,
  PRIMARY KEY (meal_id, dish_id)
);
ALTER TABLE meal_dish ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users only" ON meal_dish
  AS PERMISSIVE FOR ALL TO authenticated USING (true);

-- 5. Migrate existing meal.recipe → meal_dish
INSERT INTO meal_dish (meal_id, dish_id)
SELECT id, recipe FROM meal WHERE recipe IS NOT NULL;

-- 6. Drop recipe FK column from meal
ALTER TABLE meal DROP COLUMN recipe;

-- 7. Create new view
CREATE OR REPLACE VIEW dish_with_last_preparation
WITH (security_invoker=on) AS
SELECT
  d.id,
  d.name,
  d.url,
  d.deleted,
  (SELECT MAX(m.date) FROM meal m
   JOIN meal_dish md ON md.meal_id = m.id
   WHERE md.dish_id = d.id AND m.date <= now()) AS last_preparation
FROM dish d
WHERE d.deleted = false;
