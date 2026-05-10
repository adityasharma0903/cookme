import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Heart, User, ChefHat, Flame, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/creators', label: 'Creators' },
    { path: '/trending', label: 'Trending', icon: <Flame size={14} /> },
    { path: '/contact', label: 'Contact Us' },
    { path: '/collaborate', label: 'Collaborate' },
  ];

  return (
    <>
      <motion.nav
        className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <motion.div
              className="navbar__logo-icon"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ChefHat size={28} />
            </motion.div>
            <span className="navbar__logo-text">
              Zaika<span className="navbar__logo-dot"> Recipes</span>
            </span>
          </Link>

          <div className="navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
              >
                {/* {link.icon && <span className="navbar__link-icon">{link.icon}</span>} */}
                {link.label}
                {location.pathname === link.path && (
                  <motion.div className="navbar__link-indicator" layoutId="nav-indicator" />
                )}
              </Link>
            ))}
          </div>

          <div className="navbar__actions">
            <motion.button
              className="navbar__action-btn navbar__action-btn--search"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </motion.button>
            <Link to="/saved">
              <motion.button
                className="navbar__action-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} />
              </motion.button>
            </Link>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <motion.button
                  className="navbar__cta navbar__cta--user"
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(197, 232, 48, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.avatar ? <img src={user.avatar} alt="" className="navbar__user-avatar" /> : <LayoutDashboard size={16} />}
                  Dashboard
                </motion.button>
              </Link>
            ) : (
              <Link to="/login">
                <motion.button
                  className="navbar__cta"
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(197, 232, 48, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={16} />
                  Sign In
                </motion.button>
              </Link>
            )}

            <button
              className="navbar__hamburger"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="navbar__search-bar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="navbar__search-inner">
                <Search size={20} className="navbar__search-icon" />
                <input
                  type="text"
                  placeholder="Search 5M+ recipes, creators, cuisines..."
                  className="navbar__search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button className="navbar__search-btn" onClick={handleSearch}>Search</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="navbar__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="navbar__mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="navbar__mobile-header">
                <span className="navbar__logo-text">
                  Zaika<span className="navbar__logo-dot"> Recipes</span>
                </span>
                <button onClick={() => setIsMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="navbar__mobile-links">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="navbar__mobile-footer">
                {user ? (
                  <>
                    <div className="navbar__mobile-user">
                      {user.avatar && <img src={user.avatar} alt="" className="navbar__mobile-avatar" />}
                      <div>
                        <div className="navbar__mobile-username">{user.name}</div>
                        <div className="navbar__mobile-role">{user.role}</div>
                      </div>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="navbar__mobile-cta"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link to="/login" className="navbar__mobile-cta">
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
