import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, Clock, Users, Flame, BadgeCheck, ChevronRight, MessageCircle, Eye, ArrowLeft, Printer } from 'lucide-react';
import { recipes } from '../../data/recipes';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return <div className="recipe-detail-404 container"><h2>Recipe not found</h2><Link to="/recipes">← Back to recipes</Link></div>;

  const related = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);

  return (
    <div className="recipe-detail">
      {/* Hero */}
      <section className="rd-hero">
        <div className="rd-hero__bg">
          <img src={recipe.image} alt={recipe.title} />
          <div className="rd-hero__overlay" />
        </div>
        <div className="rd-hero__content container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/recipes" className="rd-back"><ArrowLeft size={16} /> Back to Recipes</Link>
            <div className="rd-hero__badges">
              <span className="rd-badge rd-badge--cat">{recipe.category}</span>
              <span className={`rd-badge rd-badge--diff rd-badge--${recipe.difficulty.toLowerCase()}`}>{recipe.difficulty}</span>
              {recipe.isSponsored && <span className="rd-badge rd-badge--sponsored">✨ Sponsored</span>}
              {recipe.isTrending && <span className="rd-badge rd-badge--trending"><Flame size={12} /> Trending</span>}
            </div>
            <h1 className="rd-hero__title">{recipe.title}</h1>
            <p className="rd-hero__desc">{recipe.description}</p>
            <div className="rd-hero__creator">
              <img src={recipe.creator.avatar} alt={recipe.creator.name} />
              <div>
                <span className="rd-hero__creator-name">{recipe.creator.name} {recipe.creator.isVerified && <BadgeCheck size={14} />}</span>
                <span className="rd-hero__creator-label">Recipe Creator</span>
              </div>
            </div>
            <div className="rd-hero__actions">
              <motion.button className="rd-action rd-action--like" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Heart size={18} /> Like</motion.button>
              <motion.button className="rd-action rd-action--save" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Bookmark size={18} /> Save</motion.button>
              <motion.button className="rd-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Share2 size={18} /></motion.button>
              <motion.button className="rd-action" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Printer size={18} /></motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="rd-stats-bar">
        <div className="container">
          <div className="rd-stats">
            <div className="rd-stat"><Clock size={18} /><div><strong>{recipe.prepTime + recipe.cookTime} min</strong><span>Total Time</span></div></div>
            <div className="rd-stat"><Users size={18} /><div><strong>{recipe.servings}</strong><span>Servings</span></div></div>
            <div className="rd-stat"><Flame size={18} /><div><strong>{recipe.calories}</strong><span>Calories</span></div></div>
            <div className="rd-stat"><Heart size={18} /><div><strong>{(recipe.likes/1000).toFixed(1)}k</strong><span>Likes</span></div></div>
            <div className="rd-stat"><Eye size={18} /><div><strong>{(recipe.views/1000).toFixed(0)}k</strong><span>Views</span></div></div>
            <div className="rd-stat"><MessageCircle size={18} /><div><strong>{recipe.comments}</strong><span>Comments</span></div></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="rd-main container">
        <div className="rd-grid">
          {/* Ingredients */}
          <motion.div className="rd-ingredients" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="rd-section-title">🧂 Ingredients</h2>
            <p className="rd-section-sub">For {recipe.servings} servings</p>
            <ul className="rd-ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <motion.li key={i} className="rd-ingredient" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <span className="rd-ingredient__check" />
                  <span className="rd-ingredient__name">{ing.name}</span>
                  <span className="rd-ingredient__amount">{ing.amount} {ing.unit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Steps */}
          <div className="rd-steps">
            <h2 className="rd-section-title">👨‍🍳 Cooking Steps</h2>
            <div className="rd-steps-list">
              {recipe.steps.map((step, i) => (
                <motion.div key={i} className="rd-step" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="rd-step__number">{step.number}</div>
                  <div className="rd-step__content">
                    <h4 className="rd-step__title">{step.title}</h4>
                    <p className="rd-step__desc">{step.description}</p>
                    {step.duration && <span className="rd-step__time"><Clock size={13} /> {step.duration} min</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="rd-tags container">
        <h3 className="rd-tags-title">Tags</h3>
        <div className="rd-tags-list">
          {recipe.tags.map(tag => <Link key={tag} to="/recipes" className="rd-tag">#{tag}</Link>)}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="rd-related section-padding">
          <div className="container">
            <h2 className="rd-section-title" style={{ marginBottom: 32 }}>You Might Also Like</h2>
            <div className="recipes-grid">
              {related.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecipeDetail;
