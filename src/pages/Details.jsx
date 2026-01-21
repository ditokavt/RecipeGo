import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchById } from '../api/mealApi';
import { motion } from 'framer-motion';

const Details = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    fetchById(id).then(res => setMeal(res.data.meals[0]));
  }, [id]);

  if (!meal) return <div className="loader">იტვირთება...</div>;

  // ინგრედიენტების ლოგიკა (API-ს სპეციფიკის გამო)
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }
  }

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="details-header">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="details-img" />
        <div className="details-info">
          <h1>{meal.strMeal}</h1>
          <p><strong>კატეგორია:</strong> {meal.strCategory}</p>
          <p><strong>წარმოშობა:</strong> {meal.strArea}</p>
        </div>
      </div>

      <div className="details-content">
        <div className="ingredients-section">
          <h3>ინგრედიენტები:</h3>
          <ul>
            {ingredients.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div className="instructions-section">
          <h3>მომზადების წესი:</h3>
          <p>{meal.strInstructions}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Details;