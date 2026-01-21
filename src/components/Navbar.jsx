import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

const Navbar = () => {
  const { isDark, setIsDark, lang, setLang } = useContext(GlobalContext);
  const t = lang === 'GE' ? { home: 'მთავარი', favs: 'ფავორიტები' } : { home: 'Home', favs: 'Favorites' };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo">RecipeGO</NavLink>
        <div className="nav-right-side">
          <div className="nav-links">
            <NavLink to="/" end>{t.home}</NavLink>
            <NavLink to="/favorites">{t.favs}</NavLink>
            <NavLink to="/add-recipe">{lang === 'GE' ? 'დამატება' : 'Add'}</NavLink>
          </div>
          <div className="nav-controls">
            <button onClick={() => setIsDark(!isDark)}>{isDark ? '☀️' : '🌙'}</button>
            <button onClick={() => setLang(lang === 'GE' ? 'EN' : 'GE')}>{lang}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;