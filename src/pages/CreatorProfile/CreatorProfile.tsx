import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { creators } from '../../data/creators';
import { recipes } from '../../data/recipes';
import './CreatorProfile.css';

const CreatorProfile = () => {
  const { id } = useParams();
  const creator = creators.find(c => c.id === id);
  if (!creator) return <div className="container" style={{ paddingTop: 200, textAlign: 'center' }}><h2>Creator not found</h2></div>;
  const creatorRecipes = recipes.filter(r => r.creator.id === creator.id);

  return (
    <div className="creator-profile-ig">
      {/* Instagram-style Profile Header */}
      <section className="cp-ig-header">
        <div className="cp-ig-container">
          <div className="cp-ig-top-bar">
            <h2 className="cp-ig-username">{creator.name}</h2>
            <motion.button className="cp-ig-more-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <MoreHorizontal size={20} />
            </motion.button>
          </div>

          <div className="cp-ig-profile">
            {/* Profile Picture */}
            <div className="cp-ig-avatar-wrap">
              <img src={creator.avatar} alt={creator.name} className="cp-ig-avatar" />
              {creator.isVerified && <div className="cp-ig-verified-badge"><BadgeCheck size={24} /></div>}
            </div>

            {/* Profile Info */}
            <div className="cp-ig-info">
              <div className="cp-ig-stats">
                <div className="cp-ig-stat">
                  <strong>{creatorRecipes.length}</strong>
                  <span>Posts</span>
                </div>
                <div className="cp-ig-stat">
                  <strong>{(creator.followers / 1000).toFixed(1)}k</strong>
                  <span>Followers</span>
                </div>
                <div className="cp-ig-stat">
                  <strong>{(creator.likes / 1000).toFixed(0)}k</strong>
                  <span>Likes</span>
                </div>
              </div>

              <h1 className="cp-ig-display-name">{creator.name}</h1>
              <p className="cp-ig-specialty">{creator.specialty}</p>
              <p className="cp-ig-bio">{creator.bio}</p>

              {/* Action Buttons */}
              <div className="cp-ig-actions">
                <motion.button className="cp-ig-follow-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Follow
                </motion.button>
                <motion.button className="cp-ig-message-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Message
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="cp-ig-tabs">
            <button className="cp-ig-tab active">Posts</button>
            <button className="cp-ig-tab">Saved</button>
          </div>
        </div>
      </section>

      {/* Recipe Grid - Instagram style 3 columns */}
      <section className="cp-ig-feed">
        <div className="cp-ig-grid">
          {creatorRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              className="cp-ig-grid-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/recipe/${recipe.id}`} className="cp-ig-grid-link">
                <img src={recipe.image} alt={recipe.title} className="cp-ig-grid-img" />
                <div className="cp-ig-grid-overlay">
                  <div className="cp-ig-grid-stats">
                    <span><Heart size={18} /> {recipe.likes}</span>
                    <span><MessageCircle size={18} /> {recipe.comments}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {creatorRecipes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
            <p>No posts yet</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CreatorProfile;
