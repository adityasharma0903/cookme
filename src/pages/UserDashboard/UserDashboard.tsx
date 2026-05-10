import React, { useState } from 'react';
import './UserDashboard.css';
import { useAuth } from '../../context/AuthContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { LayoutDashboard, Bookmark, Heart, User as UserIcon, LogOut, PencilLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'saved' | 'liked' | 'profile';

const UserDashboard: React.FC = () => {
  const { user, logout, getAllCreatorRecipes } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const allRecipes = getAllCreatorRecipes();
  const savedIds = user?.savedRecipes || [];
  const likedIds = user?.likedRecipes || [];
  const savedRecipes = allRecipes.filter(r => savedIds.includes(r.id));
  const likedRecipes = allRecipes.filter(r => likedIds.includes(r.id));

  const handleLogout = () => { logout(); navigate('/'); };
  const handleEditProfile = () => { navigate('/profile/edit'); };

  const creators = (useAuth() as any).getCreators();
  const FollowingList = () => {
    const followingIds = user?.following || [];
    const followingCreators = creators.filter((c: any) => followingIds.some((id: any) => id.toString() === c.id || id === c.id));
    if (!followingCreators.length) return <p>You are not following anyone yet.</p>;
    return (
      <div className="following-list">
        {followingCreators.map((c: any) => (
          <a key={c.id} href={`/creator/${c.id}`} className="following-item">
            <img src={c.avatar} alt={c.name} style={{ width:40,height:40,borderRadius:999,objectFit:'cover',marginRight:8 }} />
            <span>{c.name}</span>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="creator-dash">
      <aside className="creator-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon"><LayoutDashboard size={22} /></div>
          <span>COOK<span className="text-accent">.</span>ME</span>
        </div>
        <div className="creator-sidebar__role">User Dashboard</div>
        <nav className="admin-sidebar__nav">
          <button className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={18} /> <span>Overview</span></button>
          <button className={`admin-nav-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}><Bookmark size={18} /> <span>Saved</span></button>
          <button className={`admin-nav-btn ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}><Heart size={18} /> <span>Liked</span></button>
          <button className={`admin-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><UserIcon size={18} /> <span>Profile</span></button>
        </nav>
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__user">
            {user?.avatar ? <img src={user.avatar} alt="" className="creator-sidebar__avatar" /> : <div className="admin-sidebar__avatar"><UserIcon size={18} /></div>}
            <div>
              <p className="admin-sidebar__name">{user?.name}</p>
              <p className="admin-sidebar__email">{user?.email}</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}><LogOut size={16} /> <span>Logout</span></button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">
              {activeTab === 'overview' && `Welcome, ${user?.name?.split(' ')[0]}!`}
              {activeTab === 'saved' && 'Saved Recipes'}
              {activeTab === 'liked' && 'Liked Recipes'}
              {activeTab === 'profile' && 'My Profile'}
            </h1>
            <p className="admin-header__sub">Your personal space</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="creator-profile-card">
              <div className="creator-profile-card__bg" />
              <div className="creator-profile-card__content">
                <img src={user?.avatar} alt={user?.name} className="creator-profile-card__avatar" />
                <div className="creator-profile-card__info">
                  <h2 className="creator-profile-card__name">{user?.name}</h2>
                  <p className="creator-profile-card__bio">{user?.email}</p>
                </div>
              </div>
              <div className="creator-profile-card__stats">
                <div className="creator-profile-card__stat"><strong>{savedRecipes.length}</strong><span>Saved</span></div>
                <div className="creator-profile-card__stat"><strong>{likedRecipes.length}</strong><span>Liked</span></div>
                <div className="creator-profile-card__stat"><strong>—</strong><span>Following</span></div>
              </div>
            </div>

            <div className="admin-stats-grid">
              <motion.div className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="admin-stat-card__icon" style={{ background: '#E97A8F18', color: '#E97A8F' }}><Bookmark size={22} /></div>
                <div className="admin-stat-card__value">{savedRecipes.length}</div>
                <div className="admin-stat-card__label">Saved Recipes</div>
              </motion.div>
              <motion.div className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="admin-stat-card__icon" style={{ background: '#D95C7818', color: '#D95C78' }}><Heart size={22} /></div>
                <div className="admin-stat-card__value">{likedRecipes.length}</div>
                <div className="admin-stat-card__label">Liked Recipes</div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="creator-recipes-grid">
            {savedRecipes.length ? savedRecipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />) : <div className="creator-empty"><h3>No saved recipes</h3><p>Save recipes to see them here.</p></div>}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="creator-recipes-grid">
            {likedRecipes.length ? likedRecipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />) : <div className="creator-empty"><h3>No liked recipes</h3><p>Like recipes to see them here.</p></div>}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="creator-profile-tab">
            <div className="creator-profile-tab__header">
              <img src={user?.avatar} alt="" className="creator-profile-tab__avatar" />
              <div className="creator-profile-tab__header-info">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <p>Account role: <strong>{user?.role}</strong></p>
            </div>

            <div style={{ marginTop: 16 }}>
              <motion.button
                className="admin-create-btn"
                onClick={handleEditProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PencilLine size={16} /> Edit Profile
              </motion.button>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>Following</h3>
              <FollowingList />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
