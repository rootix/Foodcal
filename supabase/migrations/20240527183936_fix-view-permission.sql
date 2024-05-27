create or replace view "public"."recipe_with_last_preparation" with (security_invoker=on) as
SELECT recipe.id,
    recipe.name,
    recipe.note,
    recipe.tags,
    recipe.url,
    recipe.deleted,
    ( SELECT max(meal.date) AS last_preparation
           FROM meal
          WHERE ((meal.recipe = recipe.id) AND (meal.date <= now()))) AS last_preparation
   FROM recipe
  WHERE (recipe.deleted = false);
