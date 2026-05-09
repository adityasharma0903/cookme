import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, CreatorAccount } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, BookOpen, TrendingUp, Plus, Edit3, Trash2, Eye, EyeOff,
  LogOut, Search, ChefHat, BarChart3, UserPlus, X, Check, AlertCircle,
  Mail, Lock, User, Sparkles, Activity, Heart
} from 'lucide-react';
import './AdminDashboard.css';

type Tab = 'overview' | 'creators' | 'recipes' | 'analytics';

const AdminDashboard = () => {
  const { user, logout, getCreators, createCreator, updateCreator, deleteCreator, getAllCreatorRecipes } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState<CreatorAccount | null>(null);
  const [search, setSearch] = useState('');

  const creators = getCreators();
  const allRecipes = getAllCreatorRecipes();

  const totalFollowers = creators.reduce((s, c) => s + c.followers, 0);
  const totalLikes = creators.reduce((s, c) => s + c.totalLikes, 0);
  const totalViews = creators.reduce((s, c) => s + c.totalViews, 0);

  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { key: 'creators', label: 'Creators', icon: <Users size={18} /> },
    { key: 'recipes', label: 'Recipes', icon: <BookOpen size={18} /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="admin-dash">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon"><ChefHat size={22} /></div>
          <span>COOK<span className="text-accent">.</span>ME</span>
        </div>
        <div className="admin-sidebar__role">
          <Shield size={14} /> Main Admin
        </div>
        <nav className="admin-sidebar__nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`admin-nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar"><Shield size={18} /></div>
            <div>
              <p className="admin-sidebar__name">{user?.name}</p>
              <p className="admin-sidebar__email">{user?.email}</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'creators' && 'Manage Creators'}
              {activeTab === 'recipes' && 'All Recipes'}
              {activeTab === 'analytics' && 'Platform Analytics'}
            </h1>
            <p className="admin-header__sub">Welcome back, Admin</p>
          </div>
          {activeTab === 'creators' && (
            <motion.button className="admin-create-btn" onClick={() => setShowCreateModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UserPlus size={18} /> Create Creator
            </motion.button>
          )}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="admin-stats-grid">
              {[
                { label: 'Total Creators', value: creators.length, icon: <Users size={22} />, color: '#E97A8F' },
                { label: 'Total Recipes', value: allRecipes.length, icon: <BookOpen size={22} />, color: '#D95C78' },
                { label: 'Total Followers', value: `${(totalFollowers / 1000).toFixed(1)}k`, icon: <Heart size={22} />, color: '#E57D97' },
                { label: 'Total Views', value: `${(totalViews / 1000000).toFixed(1)}M`, icon: <Eye size={22} />, color: '#F19BAA' },
              ].map((stat, i) => (
                <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="admin-stat-card__icon" style={{ background: `${stat.color}18`, color: stat.color }}>{stat.icon}</div>
                  <div className="admin-stat-card__value">{stat.value}</div>
                  <div className="admin-stat-card__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="admin-recent">
              <h3 className="admin-section-title">Recent Creators</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Creator</th><th>Email</th><th>Specialty</th><th>Recipes</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {creators.slice(0, 5).map(c => (
                      <tr key={c.id}>
                        <td><div className="admin-table__user"><img src={c.avatar} alt={c.name} /><span>{c.name}</span></div></td>
                        <td>{c.email}</td>
                        <td>{c.specialty}</td>
                        <td>{allRecipes.filter(r => r.creatorId === c.id).length}</td>
                        <td><span className={`admin-status admin-status--${c.status}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATORS TAB */}
        {activeTab === 'creators' && (
          <div className="admin-creators">
            <div className="admin-search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search creators..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="admin-creators-grid">
              {filteredCreators.map((creator, i) => (
                <motion.div key={creator.id} className="admin-creator-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="admin-creator-card__header">
                    <img src={creator.avatar} alt={creator.name} className="admin-creator-card__avatar" />
                    <div>
                      <h4>{creator.name}</h4>
                      <p>{creator.email}</p>
                    </div>
                    <span className={`admin-status admin-status--${creator.status}`}>{creator.status}</span>
                  </div>
                  <div className="admin-creator-card__meta">
                    <span>{creator.specialty}</span>
                    <span>Password: {creator.password}</span>
                  </div>
                  <div className="admin-creator-card__stats">
                    <div><strong>{creator.followers}</strong><span>Followers</span></div>
                    <div><strong>{allRecipes.filter(r => r.creatorId === creator.id).length}</strong><span>Recipes</span></div>
                    <div><strong>{(creator.totalLikes / 1000).toFixed(1)}k</strong><span>Likes</span></div>
                  </div>
                  <div className="admin-creator-card__actions">
                    <button className="admin-action-btn admin-action-btn--edit" onClick={() => setEditingCreator(creator)}><Edit3 size={14} /> Edit</button>
                    <button className="admin-action-btn admin-action-btn--toggle" onClick={() => updateCreator(creator.id, { status: creator.status === 'active' ? 'suspended' : 'active' })}>
                      {creator.status === 'active' ? <><EyeOff size={14} /> Suspend</> : <><Eye size={14} /> Activate</>}
                    </button>
                    <button className="admin-action-btn admin-action-btn--delete" onClick={() => { if (window.confirm('Delete this creator?')) deleteCreator(creator.id); }}><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === 'recipes' && (
          <div className="admin-recipes-list">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Recipe</th><th>Creator</th><th>Category</th><th>Likes</th><th>Views</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {allRecipes.map(r => {
                    const creator = creators.find(c => c.id === r.creatorId);
                    return (
                      <tr key={r.id}>
                        <td><div className="admin-table__recipe"><img src={r.image} alt={r.title} /><span>{r.title}</span></div></td>
                        <td>{creator?.name || 'Unknown'}</td>
                        <td>{r.category}</td>
                        <td>{r.likes}</td>
                        <td>{r.views}</td>
                        <td><span className={`admin-status admin-status--${r.isPublished ? 'active' : 'suspended'}`}>{r.isPublished ? 'Published' : 'Draft'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="admin-analytics">
            <div className="admin-stats-grid">
              {[
                { label: 'Total Engagement', value: `${((totalLikes + totalViews) / 1000000).toFixed(1)}M`, icon: <Activity size={22} />, color: '#9C27B0' },
                { label: 'Avg Likes/Recipe', value: allRecipes.length ? Math.round(allRecipes.reduce((s, r) => s + r.likes, 0) / allRecipes.length) : 0, icon: <Heart size={22} />, color: '#E91E63' },
                { label: 'Avg Views/Recipe', value: allRecipes.length ? `${(allRecipes.reduce((s, r) => s + r.views, 0) / allRecipes.length / 1000).toFixed(0)}k` : 0, icon: <Eye size={22} />, color: '#2196F3' },
                { label: 'Published Recipes', value: allRecipes.filter(r => r.isPublished).length, icon: <Check size={22} />, color: '#4CAF50' },
              ].map((stat, i) => (
                <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="admin-stat-card__icon" style={{ background: `${stat.color}18`, color: stat.color }}>{stat.icon}</div>
                  <div className="admin-stat-card__value">{stat.value}</div>
                  <div className="admin-stat-card__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="admin-recent">
              <h3 className="admin-section-title">Top Performing Creators</h3>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Rank</th><th>Creator</th><th>Followers</th><th>Total Likes</th><th>Recipes</th></tr></thead>
                  <tbody>
                    {[...creators].sort((a, b) => b.totalLikes - a.totalLikes).map((c, i) => (
                      <tr key={c.id}>
                        <td><span className="admin-rank">#{i + 1}</span></td>
                        <td><div className="admin-table__user"><img src={c.avatar} alt={c.name} /><span>{c.name}</span></div></td>
                        <td>{c.followers.toLocaleString()}</td>
                        <td>{c.totalLikes.toLocaleString()}</td>
                        <td>{allRecipes.filter(r => r.creatorId === c.id).length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Creator Modal */}
      <AnimatePresence>
        {showCreateModal && <CreateCreatorModal onClose={() => setShowCreateModal(false)} onCreate={createCreator} />}
        {editingCreator && <EditCreatorModal creator={editingCreator} onClose={() => setEditingCreator(null)} onUpdate={updateCreator} />}
      </AnimatePresence>
    </div>
  );
};

const CreateCreatorModal = ({ onClose, onCreate }: { onClose: () => void; onCreate: any }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '', specialty: 'Indian Cuisine', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face' });
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) { setError('Name, email, and password are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    onCreate({ ...form, status: 'active' as const, isVerified: false, socialLinks: {} });
    onClose();
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2><UserPlus size={20} /> Create New Creator</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="auth-error"><AlertCircle size={14} /> {error}</div>}
        <div className="modal__body">
          <div className="modal__field"><label><User size={14} /> Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Chef Aditya" /></div>
          <div className="modal__field"><label><Mail size={14} /> Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="creator@cookme.com" /></div>
          <div className="modal__field"><label><Lock size={14} /> Password</label><input value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" /></div>
          <div className="modal__field"><label><Sparkles size={14} /> Specialty</label>
            <select value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})}>
              {['Indian Cuisine', 'Italian & Mediterranean', 'Japanese Cuisine', 'Mexican & Latin', 'Vegan & Plant-Based', 'Desserts & Baking', 'Seafood', 'BBQ & Grill', 'Chinese Cuisine', 'Thai Cuisine', 'French Cuisine', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="modal__field"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell about this creator..." rows={3} /></div>
          <div className="modal__field"><label>Avatar URL</label><input value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} /></div>
        </div>
        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
          <motion.button className="modal__btn modal__btn--submit" onClick={handleSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <UserPlus size={16} /> Create Creator
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EditCreatorModal = ({ creator, onClose, onUpdate }: { creator: CreatorAccount; onClose: () => void; onUpdate: any }) => {
  const [form, setForm] = useState({ name: creator.name, email: creator.email, password: creator.password, bio: creator.bio, specialty: creator.specialty, avatar: creator.avatar, isVerified: creator.isVerified });

  const handleSubmit = () => {
    onUpdate(creator.id, form);
    onClose();
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2><Edit3 size={20} /> Edit Creator</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal__body">
          <div className="modal__field"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="modal__field"><label>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="modal__field"><label>Password</label><input value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
          <div className="modal__field"><label>Specialty</label>
            <select value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})}>
              {['Indian Cuisine', 'Italian & Mediterranean', 'Japanese Cuisine', 'Mexican & Latin', 'Vegan & Plant-Based', 'Desserts & Baking', 'Seafood', 'BBQ & Grill', 'Chinese Cuisine', 'Thai Cuisine', 'French Cuisine', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="modal__field"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} /></div>
          <div className="modal__field modal__field--check"><label><input type="checkbox" checked={form.isVerified} onChange={e => setForm({...form, isVerified: e.target.checked})} /> Verified Creator</label></div>
        </div>
        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
          <motion.button className="modal__btn modal__btn--submit" onClick={handleSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Check size={16} /> Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
