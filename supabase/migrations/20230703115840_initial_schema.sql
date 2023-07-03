create type "public"."meal_type" as enum ('Dinner', 'Lunch');

create table "public"."meal" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "date" date not null,
    "notes" text,
    "recipe" bigint,
    "type" meal_type not null
);


alter table "public"."meal" enable row level security;

create table "public"."recipe" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "note" text,
    "tags" text[],
    "url" text
);


alter table "public"."recipe" enable row level security;

CREATE UNIQUE INDEX "meal_pkey" ON public.meal USING btree (id);

CREATE UNIQUE INDEX "recipe_name_key" ON public.recipe USING btree (name);

CREATE UNIQUE INDEX "recipe_pkey" ON public.recipe USING btree (id);

alter table "public"."meal" add constraint "meal_pkey" PRIMARY KEY using index "meal_pkey";

alter table "public"."recipe" add constraint "recipe_pkey" PRIMARY KEY using index "recipe_pkey";

alter table "public"."meal" add constraint "meal_recipe_fkey" FOREIGN KEY (recipe) REFERENCES recipe(id) ON DELETE RESTRICT not valid;

alter table "public"."meal" validate constraint "meal_recipe_fkey";

alter table "public"."recipe" add constraint "recipe_name_key" UNIQUE using index "recipe_name_key";

CREATE POLICY "Authenticated users only" ON "public"."recipe"
AS PERMISSIVE FOR ALL
TO authenticated
WITH CHECK (true)

CREATE POLICY "Authenticated users only" ON "public"."meal"
AS PERMISSIVE FOR ALL
TO authenticated
WITH CHECK (true)

