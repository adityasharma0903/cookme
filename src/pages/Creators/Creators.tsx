import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, BookOpen, Heart, TrendingUp, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal/AuthModal';
import './Creators.css';

const Creators = () => {
  const { user, getCreators, getAllCreatorRecipes, isFollowingUser, toggleFollowUser } = useAuth();
  const creators = getCreators();
  const recipes = getAllCreatorRecipes();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
        </div>
      </section>

      <section className="creators-all container section-padding">
        <h2 className="creators-all__title"><TrendingUp size={20} /> All Creators</h2>
        <div className="creators-all__grid">
          {sorted.map((creator, i) => {
            const isFollowing = user ? isFollowingUser(creator.id) : false;
            const isOwnProfile = user && user.id === creator.id;

            const handleFollow = (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              toggleFollowUser(creator.id);
            };

            return (
              <motion.div 
                key={creator.id} 
                className="creator-card-small" 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/creator/${creator.id}`} className="creator-card-small__link">
                  <div className="creator-card-small__header">
                    <img src={creator.avatar} alt={creator.name} className="creator-card-small__avatar" />
                    {creator.isVerified && <BadgeCheck size={20} className="creator-card-small__verified" />}
                  </div>

                  <div className="creator-card-small__info">
                    <h4 className="creator-card-small__name">{creator.name}</h4>
                    <p className="creator-card-small__specialty">{creator.specialty}</p>
                  </div>

                  <div className="creator-card-small__stats">
                    <span><Heart size={14} /> {(creator.likes || 0).toLocaleString()}</span>
                    <span><BookOpen size={14} /> {(creator.recipes || 0)}</span>
                  </div>

                  {!isOwnProfile && (
                    <div className="creator-card-small__actions">
                      <motion.button 
                        className={`creator-card-small__follow ${isFollowing ? 'following' : ''}`}
                        onClick={handleFollow}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isFollowing ? 'Following' : 'Follow +'}
                      </motion.button>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        message="Please login to follow creators" 
      />
    </div>
  );
};

export default Creators;
