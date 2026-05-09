import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Users, BookOpen, Heart, TrendingUp, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Creators.css';

const Creators = () => {
  const { getCreators, getAllCreatorRecipes } = useAuth();
  const creators = getCreators();
  const recipes = getAllCreatorRecipes();
  
  const sorted = [...creators].sort((a, b) => b.followers - a.followers);
  return (
    <div className="creators-page">
      <section className="creators-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="creators-hero__tag"><Crown size={14} /> Creator Spotlight</span>
            <h1 className="creators-hero__title">Meet Our <span className="text-accent">Top Creators</span></h1>
            <p className="creators-hero__desc">Talented chefs, food artists, and culinary brands sharing their best recipes with the world</p>
          </motion.div>
          {/* Top 3 */}
          <div className="creators-podium">
            {sorted.slice(0, 3).map((creator, i) => (
              <motion.div key={creator.id} className={`podium-card podium-card--${i + 1}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
                <Link to={`/creator/${creator.id}`}>
                  <div className="podium-card__rank">#{i + 1}</div>
                  <div className="podium-card__avatar-wrap">
                    <img src={creator.avatar} alt={creator.name} className="podium-card__avatar" />
                    {i === 0 && <div className="podium-card__crown"><Crown size={20} /></div>}
                  </div>
                  <h3 className="podium-card__name">{creator.name} {creator.isVerified && <BadgeCheck size={16} />}</h3>
                  <p className="podium-card__specialty">{creator.specialty}</p>
                  <div className="podium-card__stats">
                    <span><Users size={13} /> {(creator.followers / 1000).toFixed(1)}k</span>
                    <span><BookOpen size={13} /> {(creator.recipes || 0)}</span>
                    <span><Heart size={14} /> {(creator.likes || 0).toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="creators-all container section-padding">
        <h2 className="creators-all__title"><TrendingUp size={20} /> All Creators</h2>
        <div className="creators-all__grid">
          {sorted.map((creator, i) => {
            const creatorRecipes = recipes.filter(r => r.creator.id === creator.id).slice(0, 2);
            return (
              <motion.div key={creator.id} className="creator-card-small" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
                <Link to={`/creator/${creator.id}`} className="creator-card-small__link">
                  <div className="creator-card-small__header">
                    <img src={creator.avatar} alt={creator.name} className="creator-card-small__avatar" />
                    {creator.isVerified && <BadgeCheck size={12} className="creator-card-small__verified" />}
                  </div>
                  
                  <div className="creator-card-small__info">
                    <h4 className="creator-card-small__name">{creator.name}</h4>
                    <p className="creator-card-small__specialty">{creator.specialty}</p>
                  </div>

                  <div className="creator-card-small__stats">
                    <span><Heart size={12} /> {(creator.likes || 0).toLocaleString()}</span>
                    <span><BookOpen size={12} /> {(creator.recipes || 0)}</span>
                  </div>

                  {creatorRecipes.length > 0 && (
                    <div className="creator-card-small__recipes">
                      {creatorRecipes.map(r => (
                        <div key={r.id} className="creator-card-small__recipe-thumb">
                          <img src={r.image} alt={r.title} />
                        </div>
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
};

export default Creators;
