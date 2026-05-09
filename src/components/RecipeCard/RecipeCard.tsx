import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, Flame, Eye, MessageCircle, Bookmark, BadgeCheck } from 'lucide-react';
import { Recipe } from '../../types';
import './RecipeCard.css';

interface Props {
  recipe: Recipe;
  index?: number;
  variant?: 'default' | 'horizontal' | 'featured';
}

const RecipeCard = ({ recipe, index = 0, variant = 'default' }: Props) => {
  return (
    <motion.div
      className={`recipe-card recipe-card--${variant}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/recipe/${recipe.id}`} className="recipe-card__link">
        <div className="recipe-card__image-wrap">
          <img src={recipe.image} alt={recipe.title} className="recipe-card__image" loading="lazy" />
          <div className="recipe-card__image-overlay" />
          
          {recipe.isSponsored && (
            <span className="recipe-card__badge recipe-card__badge--sponsored">
              ✨ Sponsored
            </span>
          )}
          {recipe.isTrending && (
            <span className="recipe-card__badge recipe-card__badge--trending">
              <Flame size={12} /> Trending
            </span>
          )}

          <div className="recipe-card__quick-actions">
            <motion.button className="recipe-card__quick-btn" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={(e) => e.preventDefault()}>
              <Heart size={18} />
            </motion.button>
            <motion.button className="recipe-card__quick-btn" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={(e) => e.preventDefault()}>
              <Bookmark size={18} />
            </motion.button>
          </div>

          <div className="recipe-card__time">
            <Clock size={13} />
            {recipe.prepTime + recipe.cookTime} min
          </div>
        </div>

        <div className="recipe-card__content">
          <div className="recipe-card__meta-row">
            <span className="recipe-card__category">{recipe.category}</span>
            <span className={`recipe-card__difficulty recipe-card__difficulty--${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="recipe-card__title">{recipe.title}</h3>
          
          {variant !== 'default' && (
            <p className="recipe-card__desc">{recipe.description}</p>
          )}

          <div className="recipe-card__creator">
            <img src={recipe.creator.avatar} alt={recipe.creator.name} className="recipe-card__creator-avatar" />
            <div className="recipe-card__creator-info">
              <span className="recipe-card__creator-name">
                {recipe.creator.name}
                {recipe.creator.isVerified && <BadgeCheck size={14} className="recipe-card__verified" />}
              </span>
              <span className="recipe-card__creator-label">Recipe Creator</span>
            </div>
          </div>

          <div className="recipe-card__stats">
            <span className="recipe-card__stat"><Heart size={14} /> {(recipe.likes || 0).toLocaleString()}</span>
            <span className="recipe-card__stat"><Eye size={14} /> {(recipe.views || 0).toLocaleString()}</span>
            <span className="recipe-card__stat"><MessageCircle size={14} /> {recipe.comments}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
