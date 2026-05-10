import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Globe, Video, MessageSquare, Mail, ArrowUpRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,40 1440,60 L1440,120 L0,120 Z" fill="var(--charcoal)" />
        </svg>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <p className="footer__desc">
                A sponsor-based recipe sharing platform where creators publish engaging recipes,
                grow their audience, and compete through trending content.
              </p>
              <div className="footer__socials">
                {[Globe, Video, MessageSquare, Mail].map((Icon, i) => (
                  <motion.a key={i} href="#" className="footer__social" whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}>
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
              <Link to="/contact" className="footer__cta">
                Contact Us
              </Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Explore</h4>
              {['Recipes', 'Trending', 'Top Creators', 'New Recipes'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className="footer__link">
                  {item} <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Company</h4>
              {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map((item) => (
                <Link key={item} to={`/${item.toLowerCase().replace(' ', '-')}`} className="footer__link">
                  {item} <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Join the Community</h4>
              <p className="footer__newsletter-text">Get weekly recipe inspiration and creator spotlights.</p>
              <div className="footer__newsletter">
                <input type="email" placeholder="your@email.com" className="footer__newsletter-input" />
                <motion.button className="footer__newsletter-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>© 2026 Zaika Recipes — All rights reserved.</p>
            <div className="footer__bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
