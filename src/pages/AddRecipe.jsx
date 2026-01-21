import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalContext';

const AddRecipe = () => {
  const { setMyRecipes, myRecipes, lang } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(res => {
        setApiCategories(res.data.categories);
        setSelectedCat(res.data.categories[0].strCategory);
      });
  }, []);

  const t = lang === 'GE' 
    ? { title: 'ახალი რეცეპტის დამატება', name: 'კერძის სახელი', img: 'სურათის ლინკი (URL)', cat: 'აირჩიე კატეგორია', btn: 'დამატება' } 
    : { title: 'Add New Recipe', name: 'Meal Name', img: 'Image URL', cat: 'Select Category', btn: 'Add Recipe' };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeal = {
      strMeal: name,
      strMealThumb: image || 'https://via.placeholder.com/300',
      strCategory: selectedCat,
      idMeal: Date.now().toString(),
      isLocal: true 
    };

    setMyRecipes([newMeal, ...myRecipes]);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="add-recipe-wrapper"> {/* ეს კონტეინერი აცენტრებს ფორმას */}
        <div className="modal-content">
          <h2>{t.title}</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder={t.name} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            
            <input 
              type="text" 
              placeholder={t.img} 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
            />

            <div className="category-select">
              <label>{t.cat}:</label>
              <select 
                value={selectedCat} 
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                {apiCategories.map(cat => (
                  <option key={cat.idCategory} value={cat.strCategory}>
                    {cat.strCategory}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="view-btn submit-btn">
              {t.btn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;