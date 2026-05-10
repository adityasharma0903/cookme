import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useAuth } from '../../context/AuthContext';
import './Trending.css';

const Trending = () => {
  const { getAllCreatorRecipes } = useAuth();
  const recipes = getAllCreatorRecipes();
  
  const trending = [...recipes].sort((a, b) => b.views - a.views).slice(0, 8);
  return (
    <div className="trending-page">
      <section className="trending-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="trending-hero__tag"><Flame size={14} /> What's Hot</span>
            <h1 className="trending-hero__title">Trending <span className="text-accent">Now</span></h1>
            <p className="trending-hero__desc">The most popular recipes based on likes, saves, comments, and views</p>
          </motion.div>
        </div>
      </section>
      <section className="container section-padding">
        <div className="recipes-grid">
          {trending.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
        </div>
      </section>
    </div>
  );
};

export default Trending;
