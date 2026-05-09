import { motion } from 'framer-motion';
import { Bookmark, Heart } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { recipes } from '../../data/recipes';
import './Saved.css';

const Saved = () => {
  const savedRecipes = recipes.slice(0, 4); // Mock saved
  return (
    <div className="saved-page">
      <section className="saved-hero">
        <div className="container">
          <motion.h1 className="saved-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Bookmark size={32} /> Saved Recipes
          </motion.h1>
          <motion.p className="saved-hero__desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            Your personal collection of favorite recipes
          </motion.p>
        </div>
      </section>
      <section className="container section-padding">
        <div className="saved-tabs">
          <button className="saved-tab active"><Bookmark size={16} /> Saved ({savedRecipes.length})</button>
          <button className="saved-tab"><Heart size={16} /> Liked ({recipes.length})</button>
        </div>
        <div className="recipes-grid">
          {savedRecipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
        </div>
      </section>
    </div>
  );
};

export default Saved;
