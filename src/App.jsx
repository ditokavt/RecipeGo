import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './recipego.css';

// Frontend-only portfolio demo: submissions and favorites are stored in localStorage.
const LOCAL_KEY = 'recipego-community-recipes-v3';
const FAV_KEY = 'recipego-favorites-v3';
const API = 'https://www.themealdb.com/api/json/v1/1';
const defaultImage = `${import.meta.env.BASE_URL}recipego-hero.webp`;
const filters = ['All', 'Breakfast', 'Starter', 'Pasta', 'Seafood', 'Vegetarian', 'Vegan', 'Chicken', 'Beef', 'Dessert', 'Miscellaneous'];
const categories = filters.filter((x) => x !== 'All');
function localRead(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function validateImage(url) { if (!url) return true; try { const u = new URL(url); return ['https:', 'http:'].includes(u.protocol); } catch { return false; } }
function toRecipe(row) { return { ...row, idMeal: String(row.id), strMeal: row.title, strMealThumb: row.image_url || defaultImage, strCategory: row.category, strArea: row.cuisine || 'Community', strInstructions: row.instructions, ingredients: row.ingredients, duration: row.duration, author: row.author || 'Community cook', isCommunity: true }; }
async function getMeals(url) { const r = await fetch(`${API}/${url}`); if (!r.ok) throw new Error('Recipes are currently unavailable.'); return (await r.json()).meals || []; }
function useRecipes() {
  const [community, setCommunity] = useState(() => localRead(LOCAL_KEY, []));
  const [favorites, setFavorites] = useState(() => localRead(FAV_KEY, []));
  useEffect(() => { localStorage.setItem(LOCAL_KEY, JSON.stringify(community)); }, [community]);
  useEffect(() => { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); }, [favorites]);
  const submit = async (form) => {
    const recipe = { title: form.title.trim(), image_url: form.image_url.trim(), category: form.category, cuisine: form.cuisine.trim(), ingredients: form.ingredients.split('\n').map((x) => x.trim()).filter(Boolean), instructions: form.instructions.trim(), duration: Number(form.duration), author: form.author.trim() || 'Community cook' };
    const saved = toRecipe({ ...recipe, id: `local-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)}` }); setCommunity((old) => [saved, ...old]); return saved;
  };
  const toggleFav = (r) => setFavorites((old) => old.includes(r.idMeal) ? old.filter((id) => id !== r.idMeal) : [...old, r.idMeal]);
  return { community, favorites, toggleFav, submit };
}
function Header({ favoriteCount }) {
  const [open, setOpen] = useState(false);
  return <header className="rg-header"><div className="rg-shell rg-header-inner"><Link to="/" className="rg-brand" onClick={() => setOpen(false)}>Recipe<span className="rg-brand-dot">Go</span></Link><button className="rg-menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? '✕' : '☰'}</button><nav className={`rg-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation"><NavLink to="/" end onClick={() => setOpen(false)}>Discover</NavLink><NavLink to="/favorites" onClick={() => setOpen(false)}>Saved <span className="rg-count">{favoriteCount}</span></NavLink><NavLink to="/add-recipe" className="rg-nav-cta" onClick={() => setOpen(false)}>＋ Share a recipe</NavLink></nav></div></header>;
}
function HeartIcon({ filled }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 5.95l-1.05-1.05a5.5 5.5 0 0 0-7.8 7.8l1.05 1.05L12 21l7.8-7.25 1.05-1.05a5.5 5.5 0 0 0-.05-7.8Z" /></svg>;
}
function RecipeCard({ recipe, favorites, toggleFav }) {
  const liked = favorites.includes(recipe.idMeal);
  return <article className="rg-card"><Link to={`/recipe/${recipe.idMeal}`} className="rg-card-image"><img src={recipe.strMealThumb || defaultImage} loading="lazy" alt={recipe.strMeal} onError={(e) => { if (!e.currentTarget.src.endsWith("recipego-hero.webp")) e.currentTarget.src = defaultImage; }}/><span className="rg-chip">{recipe.strCategory || 'Recipe'}</span></Link><div className="rg-card-body"><div className="rg-card-eyebrow">{recipe.strArea || 'Home cooking'} {recipe.duration ? `· ${recipe.duration} min` : ''}</div><Link to={`/recipe/${recipe.idMeal}`} className="rg-card-title">{recipe.strMeal}</Link><div className="rg-card-bottom"><span>{recipe.isCommunity ? `By ${recipe.author}` : 'Recipe inspiration'}</span><button aria-label={liked ? 'Remove from saved recipes' : 'Save recipe'} className={`rg-heart ${liked ? 'active' : ''}`} onClick={() => toggleFav(recipe)}>{<HeartIcon filled={liked} />}</button></div></div></article>;
}
function Home({ data }) {
  const [category, setCategory] = useState('All'); const [search, setSearch] = useState(''); const [sort, setSort] = useState('latest'); const [apiMeals, setApiMeals] = useState([]); const [loading, setLoading] = useState(true); const [apiError, setApiError] = useState('');
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setApiError('');
      try {
        const query = search.trim();
        // TheMealDB filter.php omits strCategory/strArea. Fill the selected
        // category explicitly instead of filtering those results out.
        let meals;
        if (query) {
          meals = await getMeals(`search.php?s=${encodeURIComponent(query)}`);
        } else if (category !== 'All') {
          meals = (await getMeals(`filter.php?c=${encodeURIComponent(category)}`))
            .map((m) => ({ ...m, strCategory: category }));
        } else {
          meals = await getMeals('search.php?s=');
        }
        if (!cancelled) setApiMeals(meals);
      } catch {
        if (!cancelled) {
          setApiMeals([]);
          setApiError('Online recipes could not load. Your own saved recipes are still available.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, search.trim() ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [category, search]);
  const recipes = useMemo(() => {
    const seen = new Set();
    const query = search.trim().toLocaleLowerCase();
    const items = [...data.community, ...apiMeals].filter((r) => {
      const id = String(r.idMeal);
      if (seen.has(id)) return false;
      seen.add(id);
      const matchesCategory = category === 'All' ||
        (r.strCategory || '').toLocaleLowerCase() === category.toLocaleLowerCase();
      const ingredientText = (r.ingredients || []).join(' ');
      const searchable = `${r.strMeal || ''} ${r.strCategory || ''} ${r.strArea || ''} ${ingredientText}`.toLocaleLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
    if (sort === 'az') items.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    if (sort === 'quick') items.sort((a, b) => (Number(a.duration) || Infinity) - (Number(b.duration) || Infinity));
    return items;
  }, [data.community, apiMeals, search, category, sort]);
  return <><section className="rg-hero"><div className="rg-shell rg-hero-inner"><div><p className="rg-kicker">GOOD FOOD · GOOD PEOPLE</p><h1>Cook something <em>amazing.</em></h1><p className="rg-hero-desc">Discover new favorites, explore delicious ideas, and share what you love to cook.</p><div className="rg-hero-actions"><a href="#browse" className="rg-button rg-button-primary">Explore recipes <span>↗</span></a><Link to="/add-recipe" className="rg-button rg-button-outline">Share your recipe</Link></div><div className="rg-hero-foot"><span>✦ Community-powered inspiration</span><span>✦ Free for everyone</span></div></div><div className="rg-hero-photo"><img src={defaultImage} alt="Fresh pasta with basil and tomatoes" /></div></div></section><section className="rg-shell rg-content" id="browse"><div className="rg-section-heading"><div><p className="rg-kicker">THE RECIPE COLLECTION</p><h2>Find your next favorite.</h2></div><p>Something delicious for every day.</p></div><div className="rg-toolbar"><label className="rg-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes, cuisine, ingredients..." aria-label="Search recipes" /></label><label className="rg-sort">Sort <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="latest">Featured</option><option value="az">Name A–Z</option><option value="quick">Quickest first</option></select></label></div><div className="rg-categories">{filters.map((c) => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>{apiError && <p className="rg-notice">{apiError}</p>}<div className="rg-result-info"><strong>{recipes.length}</strong> recipes found {loading ? '· Loading more...' : ''}</div><div className="rg-grid">{recipes.map((recipe) => <RecipeCard key={recipe.idMeal} recipe={recipe} favorites={data.favorites} toggleFav={data.toggleFav}/>)}</div>{!loading && !recipes.length && <div className="rg-empty"><h3>No recipes yet</h3><p>Try another search or be the first to share one.</p><Link to="/add-recipe" className="rg-button rg-button-primary">Add recipe</Link></div>}</section></>;
}
function AddRecipe({ data }) {
  const [form, setForm] = useState({ title: '', image_url: '', category: 'Pasta', cuisine: '', ingredients: '', instructions: '', duration: 30, author: '' }); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const navigate = useNavigate();
  const change = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  const save = async (e) => { e.preventDefault(); if (!validateImage(form.image_url)) { setError('Please enter a valid HTTP or HTTPS image URL.'); return; } if (form.ingredients.split('\n').filter((v) => v.trim()).length < 2) { setError('Add at least two ingredients, each on a separate line.'); return; } setBusy(true); setError(''); try { const saved = await data.submit(form); navigate(`/recipe/${saved.idMeal}`); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  return <main className="rg-shell rg-form-page"><Link to="/" className="rg-back">← All recipes</Link><div className="rg-form-heading"><p className="rg-kicker">FROM YOUR KITCHEN TO OUR COMMUNITY</p><h1>Share your <em>recipe.</em></h1><p>Add a recipe instantly—no sign-in needed. Your recipes stay in this browser.</p></div><form className="rg-form" onSubmit={save}><div className="rg-form-section"><h2>01 / The basics</h2><div className="rg-field"><label htmlFor="recipe-name">Recipe name *</label><input id="recipe-name" name="title" required maxLength={100} value={form.title} onChange={change} placeholder="e.g. Creamy mushroom pasta"/></div><div className="rg-row"><div className="rg-field"><label htmlFor="recipe-cat">Category *</label><select id="recipe-cat" name="category" value={form.category} onChange={change}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div><div className="rg-field"><label htmlFor="recipe-time">Time (minutes) *</label><input id="recipe-time" type="number" name="duration" required min="1" max="1440" value={form.duration} onChange={change}/></div></div><div className="rg-row"><div className="rg-field"><label htmlFor="recipe-cuisine">Cuisine / country</label><input id="recipe-cuisine" name="cuisine" value={form.cuisine} onChange={change} maxLength={60} placeholder="e.g. Georgian"/></div><div className="rg-field"><label htmlFor="recipe-author">Your display name</label><input id="recipe-author" name="author" maxLength={50} value={form.author} onChange={change} placeholder="e.g. Dito"/></div></div><div className="rg-field"><label htmlFor="recipe-image">Image URL (optional)</label><input id="recipe-image" type="url" name="image_url" value={form.image_url} onChange={change} placeholder="https://example.com/your-dish.jpg"/>{form.image_url && validateImage(form.image_url) && <img className="rg-preview" src={form.image_url} alt="Recipe preview"/>}</div></div><div className="rg-form-section"><h2>02 / Let's cook</h2><div className="rg-field"><label htmlFor="recipe-ingredients">Ingredients * (one per line)</label><textarea id="recipe-ingredients" name="ingredients" required rows="6" value={form.ingredients} onChange={change} placeholder={'200 g pasta\n2 tbsp olive oil\n1 clove garlic'}/></div><div className="rg-field"><label htmlFor="recipe-instructions">Step-by-step instructions *</label><textarea id="recipe-instructions" name="instructions" required rows="8" minLength={20} value={form.instructions} onChange={change} placeholder="1. Bring water to a boil..."/></div></div>{error && <div className="rg-notice" role="alert">{error}</div>}<button className="rg-button rg-button-primary rg-submit" disabled={busy}>{busy ? 'Publishing...' : 'Publish recipe ↗'}</button><p className="rg-form-help">'Saved locally on this device. No account required. This is a React portfolio demo; recipes are not shared across devices.'</p></form></main>;
}
function RecipeDetails({ data }) {
  const { id } = useParams(); const [api, setApi] = useState(null); const [loading, setLoading] = useState(true);
  const community = data.community.find((r) => r.idMeal === id); const saved = data.favorites.includes(id);
  useEffect(() => { if (community) { setLoading(false); return; } let live = true; setLoading(true); getMeals(`lookup.php?i=${encodeURIComponent(id)}`).then((items) => { if (live) setApi(items[0] || null); }).catch(() => { if (live) setApi(null); }).finally(() => { if (live) setLoading(false); }); return () => { live = false; }; }, [id, community]);
  const recipe = community || api; const ingredients = recipe?.ingredients || (recipe ? Array.from({ length: 20 }, (_, i) => { const x = i + 1; const name = recipe[`strIngredient${x}`]; return name ? `${recipe[`strMeasure${x}`] || ''} ${name}`.trim() : null; }).filter(Boolean) : []);
  return <main className="rg-shell rg-details"><Link to="/" className="rg-back">← Back to recipes</Link>{loading ? <p>Loading recipe...</p> : !recipe ? <div className="rg-empty"><h2>Recipe not found</h2><Link to="/">Browse other recipes</Link></div> : <><div className="rg-details-head"><div><p className="rg-kicker">{recipe.strCategory || 'HOMEMADE'} · {recipe.strArea || 'Community'}</p><h1>{recipe.strMeal}</h1><p>Good food is worth sharing. Enjoy every bite.</p><button className="rg-button rg-button-outline" onClick={() => data.toggleFav(recipe)}><HeartIcon filled={saved}/>{saved ? 'Saved recipe' : 'Save for later'}</button></div><img src={recipe.strMealThumb || defaultImage} alt={recipe.strMeal}/></div><div className="rg-recipe-columns"><section><h2>Ingredients</h2><ul>{ingredients.map((item, i) => <li key={i}>{item}</li>)}</ul></section><section><h2>Instructions</h2><p className="rg-instructions">{recipe.strInstructions || 'Instructions unavailable.'}</p></section></div></>}</main>;
}
function Favorites({ data }) {
  const [external, setExternal] = useState([]); const [loading, setLoading] = useState(false);
  useEffect(() => { let alive = true; const missing = data.favorites.filter((id) => !data.community.some((r) => r.idMeal === id)); if (!missing.length) { setExternal([]); return; } setLoading(true); Promise.all(missing.map((id) => getMeals(`lookup.php?i=${encodeURIComponent(id)}`).then((r) => r[0]).catch(() => null))).then((items) => { if (alive) setExternal(items.filter(Boolean)); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, [data.community, data.favorites]);
  const recipes = [...data.community, ...external].filter((r) => data.favorites.includes(r.idMeal)); return <main className="rg-shell rg-content"><p className="rg-kicker">YOUR COLLECTION</p><h1>Saved recipes <span>♥</span></h1><p>Keep the dishes you love close.</p>{loading && <p>Loading saved recipes...</p>}<div className="rg-grid">{recipes.map((r) => <RecipeCard key={r.idMeal} recipe={r} favorites={data.favorites} toggleFav={data.toggleFav}/>)}</div>{!recipes.length && !loading && <div className="rg-empty"><h2>Nothing saved yet</h2><Link to="/" className="rg-button rg-button-primary">Explore recipes</Link></div>}</main>;
}
export default function App() { const data = useRecipes(); return <BrowserRouter><Header favoriteCount={data.favorites.length}/><Routes><Route path="/" element={<Home data={data}/>}/><Route path="/add-recipe" element={<AddRecipe data={data}/>}/><Route path="/recipe/:id" element={<RecipeDetails data={data}/>}/><Route path="/favorites" element={<Favorites data={data}/>}/><Route path="*" element={<Home data={data}/>}/></Routes><footer className="rg-footer"><div className="rg-shell">Made to share. Cook with joy. <strong>RecipeGo</strong></div></footer></BrowserRouter>; }
