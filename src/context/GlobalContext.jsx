import { createContext, useState, useEffect } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'GE');
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favs')) || []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (meal) => {
    setFavorites(prev => 
      prev.find(m => m.idMeal === meal.idMeal) 
      ? prev.filter(m => m.idMeal !== meal.idMeal) 
      : [...prev, meal]
    );
  };

  return (
    <GlobalContext.Provider value={{ isDark, setIsDark, lang, setLang, favorites, toggleFav }}>
      {children}
    </GlobalContext.Provider>
  );
};