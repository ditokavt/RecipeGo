RecipeGo — React-only portfolio version (no backend, no authentication).

Replace / add ONLY these files in the existing RecipeGo project:
  src/App.jsx
  src/recipego.css

Run: npm install && npm run dev

Features:
- New responsive React homepage, recipe category filters, text search, sorting and favorites.
- Anyone can open and use the recipe submission form without signing in.
- Added recipes and favorites persist in this browser via localStorage; they do not appear for other users or on other devices.
- Demo recipes load from the public TheMealDB API when internet is available; the app still shows locally added recipes if the API fails.

No Supabase, database, environment variables or server setup is required.
This frontend-only scope is suitable for showcasing React state, hooks, forms, routing, filtering and responsive design.
