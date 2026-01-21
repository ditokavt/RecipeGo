import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

const RecipeCard = ({ meal }) => {
  const { toggleFav, favorites } = useContext(GlobalContext);
  const isFav = favorites.find(m => m.idMeal === meal.idMeal);

  return (
    <motion.div className="card" whileHover={{ y: -5 }} initial={{opacity:0}} animate={{opacity:1}}>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div className="info">
        <h3>{meal.strMeal}</h3>
        <div className="card-actions">
        <Link to={`/recipe/${meal.idMeal}`} className="view-btn">ნახვა</Link>
        <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={() => toggleFav(meal)}>
          {isFav ? '❤️' : '🤍'}
        </button>
        </div>
      </div>
    </motion.div>
  );
};
export default RecipeCard;