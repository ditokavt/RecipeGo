import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import AddRecipe from './pages/AddRecipe';

import './styles/main.scss';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Navbar />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<Details />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
          </Routes>
        </main>
      </Router>
    </GlobalProvider>
  );
}

export default App;