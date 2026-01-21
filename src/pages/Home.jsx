import { useState, useEffect } from 'react';
import { fetchCategories, fetchByCategory } from '../api/mealApi';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [activeCat, setActiveCat] = useState('Pasta');

  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data.categories.slice(0, 8)));
  }, []);

  useEffect(() => {
    fetchByCategory(activeCat).then(res => setMeals(res.data.meals));
  }, [activeCat]);

  return (
    <div className="container">
      <div style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'20px'}}>
        {categories.map(cat => (
          <button 
            key={cat.idCategory} 
            onClick={() => setActiveCat(cat.strCategory)}
            style={{background: activeCat === cat.strCategory ? 'var(--accent)' : 'gray', color: 'white', border:'none', padding:'8px 15px', borderRadius:'20px', cursor:'pointer'}}
          >
            {cat.strCategory}
          </button>
        ))}
      </div>
      <div className="recipe-grid">
        {meals?.map(meal => <RecipeCard key={meal.idMeal} meal={meal} />)}
      </div>
    </div>
  );
};
export default Home;