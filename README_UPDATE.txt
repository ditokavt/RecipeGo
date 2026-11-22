RecipeGo — FIXED (React-only, no Supabase, no server)

Copy these paths into the SAME locations in your existing RecipeGo project:
 src/App.jsx
 src/recipego.css
 public/recipego-hero.webp

Fixes:
 - Category API returned recipes without strCategory; now selected category is applied.
 - Search now fetches results by query and can be combined with category filters.
 - Fresh generated hero photo is locally bundled in public/.
 - Removed decorative logo/star and hero badge.
 - Heart buttons use centered SVG, not misaligned text glyphs.
 - Consistent hover effects and responsive styling.
 - Recipes/favorites still use localStorage; no accounts/backend.

Test: npm install && npm run dev (then try Pasta, Dessert, Chicken, search, Favorites).
If deploying to GitHub Pages, ensure existing Vite base and SPA routing are configured correctly.
