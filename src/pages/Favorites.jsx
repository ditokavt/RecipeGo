import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import RecipeCard from '../components/RecipeCard';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { favorites } = useContext(GlobalContext);

  return (
    <div className="container">
      <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }}>ჩემი შენახული რეცეპტები</motion.h1>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>თქვენ ჯერ არ გაქვთ დამატებული ფავორიტი რეცეპტები.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {favorites.map(meal => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};


export default Favorites;