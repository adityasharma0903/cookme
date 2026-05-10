import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ChefHat, Utensils, User, LogIn, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './MobileNav.css';

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Creators', path: '/creators', icon: <ChefHat size={20} /> },
    { label: 'Search', onClick: () => setSearchOpen(true), icon: <Search size={20} />, active: searchOpen },
    { label: 'Recipes', path: '/recipes', icon: <Utensils size={20} /> },
    { 
      label: user ? 'Profile' : 'Login', 
      path: user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login', 
      icon: user ? <User size={20} /> : <LogIn size={20} /> 
    },
  ];

  return (
    <>
      <nav className="mobile-nav">
        {navItems.map((item, i) => (
          item.path ? (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav__item ${location.pathname === item.path ? 'mobile-nav__item--active' : ''}`}
            >
              <span className="mobile-nav__icon">{item.icon}</span>
              <span className="mobile-nav__label">{item.label}</span>
            </Link>
          ) : (
            <button
              key={i}
              onClick={item.onClick}
              className={`mobile-nav__item ${item.active ? 'mobile-nav__item--active' : ''}`}
            >
              <span className="mobile-nav__icon">{item.icon}</span>
              <span className="mobile-nav__label">{item.label}</span>
            </button>
          )
        ))}
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div 
              className="mobile-search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div 
              className="mobile-search-overlay"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
            >
              <div className="mobile-search-inner">
                <form onSubmit={handleSearch} className="mobile-search-form">
                  <Search size={20} className="mobile-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search recipes..." 
                    className="mobile-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="button" className="mobile-search-close" onClick={() => setSearchOpen(false)}>
                    <X size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;

