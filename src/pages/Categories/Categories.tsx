import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../../data/categories';
import { recipes } from '../../data/recipes';
import './Categories.css';

const Categories = () => (
  <div className="categories-page">
    <section className="cat-hero">
      <div className="container">
        <motion.h1 className="cat-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          Explore <span className="text-accent">Categories</span>
        </motion.h1>
        <motion.p className="cat-hero__desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          Find your favorite cuisine and cooking style
        </motion.p>
      </div>
    </section>
    <section className="cat-grid-section container section-padding">
      <div className="cat-grid">
        {categories.map((cat, i) => {
          const catRecipes = recipes.filter(r => r.category === cat.name);
          return (
            <motion.div key={cat.id} className="cat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -8 }}>
              <Link to={`/recipes?category=${cat.name}`} className="cat-card__inner">
                <div className="cat-card__image" style={{ backgroundImage: `url(${cat.image})` }}>
                  <div className="cat-card__overlay" style={{ background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color}66)` }} />
                  <span className="cat-card__icon">{cat.icon}</span>
                  <div className="cat-card__info">
                    <h3 className="cat-card__name">{cat.name}</h3>
                    <span className="cat-card__count">{cat.recipeCount} recipes</span>
                  </div>
                </div>
                {catRecipes.length > 0 && (
                  <div className="cat-card__previews">
                    {catRecipes.slice(0, 3).map(r => (
                      <img key={r.id} src={r.image} alt={r.title} className="cat-card__preview" />
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  </div>
);

export default Categories;
