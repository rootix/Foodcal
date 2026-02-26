# AGENTS.md - Foodcal Project Guide

Foodcal is a weekly meal planning app where users assign dishes to Lunch/Dinner slots across a week.

**Stack:** Angular 21 (zoneless, standalone) · NGXS · ng-zorro-antd · Supabase (PostgreSQL) · date-fns · Ramda · Netlify

**Locale:** German (de-CH) — all UI strings are in German.

## Commands

```bash
npm start                        # Dev server at localhost:4200
npm run build                    # Production build
npm run lint                     # ESLint
npm run format                   # Prettier
npm run generate-supabase-types  # Regenerate database.types.ts from local Supabase
```

No test suite. Before committing: lint, format, verify build.

## Architecture

- `core/` — shell layout + login
- `schedule/` — lazy-loaded week view; `ScheduleState` is registered per-route (not globally)
- `dishes/` — lazy-loaded dish management
- `shared/` — `AuthState` + `DishState` registered globally in `main.ts`, shared services

## Non-Obvious Patterns

**Supabase calls** must be wrapped with `defer(() => from(...))` for RxJS compatibility. Always check `result.error` and throw.

**Dish queries** use the `dish_with_last_preparation` view, not the raw `dish` table.

**`updateMeal`** deletes all `meal_dish` join rows and re-inserts them — there is no partial update.

**`moveMeal`** swaps the two meals when the target slot is already occupied.

**Soft delete:** dishes use `deleted: boolean`; meals are hard-deleted.

**Date conversion:** API strings ↔ `Date` objects via `toDateFromApi()` / `toApiStringFromDate()` in `shared/utils/date-utils.ts`.

**Auth token** is persisted via `withNgxsStoragePlugin({ keys: ['auth.token'] })`.
