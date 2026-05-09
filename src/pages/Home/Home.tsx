import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Search, ArrowRight, ChevronRight, Star, TrendingUp, Users, Utensils, Crown, Sparkles, Flame, Heart, Eye, Play } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { categories } from '../../data/categories';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const partners = ['Weelicious', 'SELF', 'Food.co', 'FoodCity', 'Yummly', 'Tasty', 'BonAppétit', 'Epicurious'];

const stats = [
  { icon: <Utensils size={24} />, value: '50K+', label: 'Recipes' },
  { icon: <Users size={24} />, value: '12K+', label: 'Creators' },
  { icon: <Heart size={24} />, value: '2M+', label: 'Likes' },
  { icon: <Eye size={24} />, value: '15M+', label: 'Monthly Views' },
];

const Home = () => {
  const { getAllCreatorRecipes, getCreators } = useAuth();
  const recipes = getAllCreatorRecipes();
  const creators = getCreators();

  const featuredRecipe = recipes[0] || null;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const trendingRecipes = recipes.filter(r => r.isTrending).slice(0, 6);
  const sponsoredRecipes = recipes.filter(r => r.isSponsored).slice(0, 4);
  const topRecipes = [...recipes].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg-shapes">
          <div className="hero__blob hero__blob--1" />
          <div className="hero__blob hero__blob--2" />
          <div className="hero__blob hero__blob--3" />
        </div>

        <motion.div className="hero__content container" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="hero__left">
            <motion.span
              className="hero__tag"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles size={14} /> FOODS WITH RECIPES
            </motion.span>

            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              GOOD <span className="hero__emoji">😋</span> TASTE.
              <br />
              GOOD <span className="hero__emoji">🤗</span> SENSE.
            </motion.h1>

            <motion.p
              className="hero__desc"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Browse over 5 million recipes and foods that make your health better and
              healthier. Love for raw materials and service. Creativity and professionalism
              are the elements that characterize our platform.
            </motion.p>

            <motion.div
              className="hero__search"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <Search size={20} className="hero__search-icon" />
              <input type="text" placeholder="Search 5m+ recipes & foods" className="hero__search-input" />
              <motion.button
                className="hero__search-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SEARCH
              </motion.button>
            </motion.div>

            <motion.div
              className="hero__tags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="hero__tags-label">Popular:</span>
              {['Butter Chicken', 'Sushi', 'Pasta', 'Vegan Bowls'].map((tag) => (
                <Link key={tag} to="/recipes" className="hero__popular-tag">{tag}</Link>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hero__right"
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero__image-container">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&h=700&fit=crop"
                alt="Delicious food bowl"
                className="hero__image"
              />
              <div className="hero__image-ring" />
              
              <motion.div
                className="hero__float-card hero__float-card--1"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <Star size={16} fill="#FFD700" color="#FFD700" />
                <span><strong>4.9</strong> Rating</span>
              </motion.div>

              <motion.div
                className="hero__float-card hero__float-card--2"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              >
                <div className="hero__float-avatars">
                  {creators.slice(0, 3).map((c, i) => (
                    <img key={c.id} src={c.avatar} alt={c.name} style={{ zIndex: 3 - i }} />
                  ))}
                </div>
                <span><strong>12K+</strong> Creators</span>
              </motion.div>

              <motion.div
                className="hero__float-card hero__float-card--3"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <Flame size={16} color="#D95C78" />
                <span><strong>50K+</strong> Recipes</span>
              </motion.div>
            </div>

            <div className="hero__accent-foods">
              <motion.span className="hero__food-emoji hero__food-emoji--1" animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>🌿</motion.span>
              <motion.span className="hero__food-emoji hero__food-emoji--2" animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}>🍅</motion.span>
              <motion.span className="hero__food-emoji hero__food-emoji--3" animate={{ y: [0, -10, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>🥑</motion.span>
            </div>
          </motion.div>
        </motion.div>

        <div className="hero__curve">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,80 C400,120 800,20 1440,80 L1440,120 L0,120 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      {/* ===== PARTNERS MARQUEE ===== */}
      <section className="partners">
        <div className="container">
          <div className="partners__header">
            <h3 className="partners__title">Our Partners</h3>
            <div className="partners__arrows">
              <button className="partners__arrow">←</button>
              <button className="partners__arrow">→</button>
            </div>
          </div>
        </div>
        <div className="partners__marquee">
          <div className="partners__track">
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="partners__logo">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <CountUpStat key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="categories-section section-padding">
        <div className="container">
          <SectionHeader
            tag="Explore"
            title="Browse by Category"
            desc="Discover recipes across world cuisines and cooking styles"
            link="/categories"
          />
          <div className="categories-scroll">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                className="category-pill"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
              >
                <Link to={`/recipes?category=${cat.name}`} className="category-pill__inner">
                  <div className="category-pill__image" style={{ backgroundImage: `url(${cat.image})` }}>
                    <div className="category-pill__overlay" style={{ background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}88)` }} />
                    <span className="category-pill__icon">{cat.icon}</span>
                  </div>
                  <div className="category-pill__info">
                    <span className="category-pill__name">{cat.name}</span>
                    <span className="category-pill__count">{cat.recipeCount} recipes</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING RECIPES ===== */}
      <section className="trending-section section-padding">
        <div className="container">
          <SectionHeader
            tag="🔥 Hot Right Now"
            title="Trending Recipes"
            desc="The most popular recipes that everyone's cooking this week"
            link="/trending"
          />
          <div className="recipes-grid">
            {trendingRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP RECIPES SHOWCASE ===== */}
      <section className="top-section">
        <div className="container">
          <SectionHeader
            tag="👑 Hall of Fame"
            title="Top Recipes"
            desc="Recipes with the highest engagement — likes, saves, comments & views"
            link="/recipes"
            light
          />
          <div className="top-grid">
            {topRecipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                className={`top-card ${i === 0 ? 'top-card--first' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Link to={`/recipe/${recipe.id}`} className="top-card__inner">
                  <div className="top-card__rank">#{i + 1}</div>
                  <div className="top-card__image-wrap">
                    <img src={recipe.image} alt={recipe.title} className="top-card__image" />
                    <div className="top-card__gradient" />
                  </div>
                  <div className="top-card__content">
                    <span className="top-card__category">{recipe.category}</span>
                    <h3 className="top-card__title">{recipe.title}</h3>
                    <p className="top-card__desc">{recipe.description}</p>
                    <div className="top-card__creator">
                      <img src={recipe.creator.avatar} alt={recipe.creator.name} />
                      <span>{recipe.creator.name}</span>
                    </div>
                    <div className="top-card__stats">
                      <span><Heart size={14} /> {(recipe.likes / 1000).toFixed(1)}k</span>
                      <span><Eye size={14} /> {(recipe.views / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  {i === 0 && <div className="top-card__crown"><Crown size={24} /></div>}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CREATORS SPOTLIGHT ===== */}
      <section className="creators-section section-padding">
        <div className="container">
          <SectionHeader
            tag="⭐ Spotlight"
            title="Top Creators"
            desc="Meet the talented chefs and food creators behind our best recipes"
            link="/creators"
          />
          <div className="creators-grid">
            {creators.slice(0, 6).map((creator, i) => (
              <motion.div
                key={creator.id}
                className="creator-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link to={`/creator/${creator.id}`} className="creator-card__inner">
                  <div className="creator-card__avatar-wrap">
                    <img src={creator.avatar} alt={creator.name} className="creator-card__avatar" />
                    <div className="creator-card__ring" />
                    {creator.isVerified && <div className="creator-card__badge">✓</div>}
                  </div>
                  <h4 className="creator-card__name">{creator.name}</h4>
                  <p className="creator-card__specialty">{creator.specialty}</p>
                  <div className="creator-card__stats">
                    <div className="creator-card__stat">
                      <strong>{(creator.followers / 1000).toFixed(1)}k</strong>
                      <span>Followers</span>
                    </div>
                    <div className="creator-card__stat">
                      <strong>{(creator.recipes || 0)}</strong>
                      <span>Recipes</span>
                    </div>
                    <div className="creator-card__stat">
                      <strong>{(creator.likes || 0).toLocaleString()}</strong>
                      <span>Likes</span>
                    </div>
                  </div>
                  <motion.button className="creator-card__follow" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Follow +
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPONSORED ===== */}
      <section className="sponsored-section section-padding">
        <div className="container">
          <SectionHeader
            tag="✨ Featured"
            title="Sponsored Recipes"
            desc="Premium recipes from our verified sponsors and brand partners"
            link="/recipes"
          />
          <div className="sponsored-grid">
            {sponsoredRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} variant={i === 0 ? 'featured' : 'default'} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIDEO CTA ===== */}
      <section className="video-cta-section">
        <div className="container">
          <motion.div
            className="video-cta"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="video-cta__content">
              <span className="video-cta__tag">🎬 Watch & Cook</span>
              <h2 className="video-cta__title">
                See Recipes <br />Come to Life
              </h2>
              <p className="video-cta__desc">
                Video recipes from world-class creators. Watch step-by-step cooking tutorials
                and master new dishes every day.
              </p>
              <motion.button className="video-cta__btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Play size={18} /> Explore Video Recipes
              </motion.button>
            </div>
            <div className="video-cta__visual">
              <div className="video-cta__phone">
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop" alt="Video recipe" />
                <div className="video-cta__play-btn">
                  <Play size={32} fill="white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta section-padding">
        <div className="container">
          <motion.div
            className="final-cta__inner"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="final-cta__title">
              Ready to Share Your <br />
              <span className="final-cta__highlight">Recipes</span> with the World?
            </h2>
            <p className="final-cta__desc">
              Join thousands of creators, build your audience, and become the next trending chef on COOK.ME
            </p>
            <div className="final-cta__buttons">
              <Link to="/register">
                <motion.button className="final-cta__btn final-cta__btn--primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Become a Creator <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/recipes">
                <motion.button className="final-cta__btn final-cta__btn--secondary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Browse Recipes
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Sub-components
const SectionHeader = ({ tag, title, desc, link, light = false }: { tag: string; title: string; desc: string; link: string; light?: boolean }) => (
  <div className={`section-header ${light ? 'section-header--light' : ''}`}>
    <div className="section-header__left">
      <span className="section-header__tag">{tag}</span>
      <h2 className="section-header__title">{title}</h2>
      <p className="section-header__desc">{desc}</p>
    </div>
    <Link to={link} className="section-header__link">
      View All <ChevronRight size={16} />
    </Link>
  </div>
);

const CountUpStat = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="stat-card__icon">{stat.icon}</div>
      <div className="stat-card__value">{stat.value}</div>
      <div className="stat-card__label">{stat.label}</div>
    </motion.div>
  );
};

export default Home;
