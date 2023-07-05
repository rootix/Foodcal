# Foodcal

Weekly food planning tool for my own purpose. Currently in a MVP version (still, even after 4 (and counting) Angular upgrades and a switch from [FaunaDB](https://fauna.com) to [Supabase](https://supabase.com])).

## Installation

1. Setup [Supabase](https://supabase.com/) Project
2. Configure your Supabase url and anon key in `src/environments/environment.prod.ts` and for local development in `src/environments/environment.ts`. You can use the productive Supabase project, a specific test project or the recommendation: the container based [local development](https://supabase.com/docs/guides/getting-started/local-development) flow which this repo is configured for.
3. Start application with `npm start`

## Deployment

The application can run on any static file hosting provider. 

These are the steps for Netlify which this project runs on for me:

1. Create a new site with the repository (fork it to have a stable version and to change the environment files)
2. Configure Deploy
    - Base directory: `<empty>`
    - Build command: `ng build --prod`
    - Publish directory: `dist/Foodcal`
