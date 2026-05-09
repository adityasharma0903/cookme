import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { recipes } from '../../data/recipes';
import { categories } from '../../data/categories';
import './Recipes.css';

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const sortOptions = ['Trending', 'Most Liked', 'Newest', 'Fastest'];

const Recipes = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...recipes];
    if (search) result = result.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.includes(search.toLowerCase())));
    if (selectedCategory !== 'All') result = result.filter(r => r.category === selectedCategory);
    if (selectedDifficulty !== 'All') result = result.filter(r => r.difficulty === selectedDifficulty);
    switch (sortBy) {
      case 'Most Liked': result.sort((a, b) => b.likes - a.likes); break;
      case 'Newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'Fastest': result.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime)); break;
      default: result.sort((a, b) => b.views - a.views);
    }
    return result;
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  return (
    <div className="recipes-page">
      <section className="recipes-hero">
        <div className="container">
          <motion.h1 className="recipes-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Discover <span className="text-accent">Recipes</span>
          </motion.h1>
          <motion.p className="recipes-hero__desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            Explore thousands of recipes from world-class creators
          </motion.p>
          <motion.div className="recipes-hero__search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Search size={20} />
            <input type="text" placeholder="Search recipes, ingredients, cuisines..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')}><X size={18} /></button>}
          </motion.div>
        </div>
      </section>

      <section className="recipes-content container">
        <div className="recipes-toolbar">
          <div className="recipes-categories-scroll">
            <button className={`recipes-cat-btn ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => setSelectedCategory('All')}>All</button>
            {categories.map(c => (
              <button key={c.id} className={`recipes-cat-btn ${selectedCategory === c.name ? 'active' : ''}`} onClick={() => setSelectedCategory(c.name)}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          <div className="recipes-toolbar__right">
            <button className="recipes-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
            <div className="recipes-view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid3X3 size={16} /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
          </div>
        </div>

        {showFilters && (
          <motion.div className="recipes-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="filter-group">
              <label>Difficulty</label>
              <div className="filter-pills">
                {difficulties.map(d => (
                  <button key={d} className={`filter-pill ${selectedDifficulty === d ? 'active' : ''}`} onClick={() => setSelectedDifficulty(d)}>{d}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <div className="filter-pills">
                {sortOptions.map(s => (
                  <button key={s} className={`filter-pill ${sortBy === s ? 'active' : ''}`} onClick={() => setSortBy(s)}>{s}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="recipes-count">{filtered.length} recipes found</div>

        <div className={viewMode === 'grid' ? 'recipes-grid' : 'recipes-list'}>
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="recipes-empty">
            <span className="recipes-empty__emoji">🍳</span>
            <h3>No recipes found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Recipes;
