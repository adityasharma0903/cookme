import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, LayoutDashboard, BookOpen, User, Settings, LogOut,
  Plus, Edit3, Trash2, Eye, Heart, MessageCircle, TrendingUp, Bookmark,
  X, Check, AlertCircle, Clock, Users, Flame, Lock, BarChart3
} from 'lucide-react';
import './CreatorDashboard.css';

type Tab = 'overview' | 'recipes' | 'profile' | 'settings';

const CreatorDashboard = () => {
  const { user, logout, getMyRecipes, addRecipe, updateRecipe, deleteRecipe, updateProfile, changePassword, getCreatorById } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any>(null);

  const myRecipes = getMyRecipes();
  const creatorData = user ? getCreatorById(user.id) : null;
  const creatorFollowers = Number(creatorData?.followers || 0);

  const totalLikes = myRecipes.reduce((s, r) => s + r.likes, 0);
  const totalViews = myRecipes.reduce((s, r) => s + r.views, 0);
  const totalSaves = myRecipes.reduce((s, r) => s + r.saves, 0);
  const totalComments = myRecipes.reduce((s, r) => s + r.comments, 0);

  const handleLogout = () => { logout(); navigate('/'); };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'recipes', label: 'My Recipes', icon: <BookOpen size={18} /> },
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="creator-dash">
      <aside className="creator-sidebar">
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon"><ChefHat size={22} /></div>
          <span>COOK<span className="text-accent">.</span>ME</span>
        </div>
        <div className="creator-sidebar__role">
          <Flame size={14} /> Creator Studio
        </div>
        <nav className="admin-sidebar__nav">
          {tabs.map(tab => (
            <button key={tab.key} className={`admin-nav-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__user">
            {user?.avatar ? <img src={user.avatar} alt="" className="creator-sidebar__avatar" /> : <div className="admin-sidebar__avatar"><User size={18} /></div>}
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
              {activeTab === 'overview' && `Welcome, ${user?.name?.split(' ')[0]}! 👋`}
              {activeTab === 'recipes' && 'My Recipes'}
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
            <p className="admin-header__sub">Creator Studio</p>
          </div>
          {activeTab === 'recipes' && (
            <motion.button className="admin-create-btn" onClick={() => { setEditingRecipe(null); setShowRecipeForm(true); }} whileHover={{ scale: 1.05 }}>
              <Plus size={18} /> Create Recipe
            </motion.button>
          )}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-overview">
            {/* Instagram-Style Profile Card */}
            <div className="creator-profile-card">
              <div className="creator-profile-card__bg" />
              <div className="creator-profile-card__content">
                <img src={user?.avatar} alt={user?.name} className="creator-profile-card__avatar" />
                <div className="creator-profile-card__info">
                  <h2 className="creator-profile-card__name">{user?.name}</h2>
                  <p className="creator-profile-card__specialty">{creatorData?.specialty}</p>
                  <p className="creator-profile-card__bio">{creatorData?.bio}</p>
                </div>
                {creatorData?.isVerified && (
                  <div className="creator-profile-card__badge">✓ Verified</div>
                )}
              </div>
              <div className="creator-profile-card__stats">
                <div className="creator-profile-card__stat">
                  <strong>{myRecipes.length}</strong>
                  <span>Posts</span>
                </div>
                <div className="creator-profile-card__stat">
                  <strong>{(creatorFollowers / 1000).toFixed(1)}k</strong>
                  <span>Followers</span>
                </div>
                <div className="creator-profile-card__stat">
                  <strong>{(totalLikes / 1000).toFixed(0)}k</strong>
                  <span>Likes</span>
                </div>
              </div>
            </div>

            {/* Analytics Stats Grid */}
            <div className="admin-stats-grid">
              {[
                { label: 'Total Recipes', value: myRecipes.length, icon: <BookOpen size={22} />, color: '#E97A8F' },
                { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: <Heart size={22} />, color: '#D95C78' },
                { label: 'Total Views', value: `${(totalViews / 1000).toFixed(1)}k`, icon: <Eye size={22} />, color: '#E57D97' },
                { label: 'Followers', value: creatorData?.followers?.toLocaleString() || '0', icon: <Users size={22} />, color: '#F19BAA' },
                { label: 'Total Saves', value: totalSaves.toLocaleString(), icon: <Bookmark size={22} />, color: '#C85A70' },
                { label: 'Comments', value: totalComments, icon: <MessageCircle size={22} />, color: '#B74863' },
              ].map((stat, i) => (
                <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="admin-stat-card__icon" style={{ background: `${stat.color}18`, color: stat.color }}>{stat.icon}</div>
                  <div className="admin-stat-card__value">{stat.value}</div>
                  <div className="admin-stat-card__label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="admin-recent">
              <h3 className="admin-section-title">📊 Top Performing Recipes</h3>
              <div className="creator-recipes-grid">
                {[...myRecipes].sort((a, b) => b.likes - a.likes).slice(0, 4).map((recipe, i) => (
                  <motion.div key={recipe.id} className="creator-recipe-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <img src={recipe.image} alt={recipe.title} className="creator-recipe-card__img" />
                    <div className="creator-recipe-card__info">
                      <h4>{recipe.title}</h4>
                      <div className="creator-recipe-card__stats">
                        <span><Heart size={12} /> {recipe.likes}</span>
                        <span><Eye size={12} /> {recipe.views}</span>
                        <span><MessageCircle size={12} /> {recipe.comments}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECIPES */}
        {activeTab === 'recipes' && (
          <div className="creator-recipes">
            {myRecipes.length === 0 ? (
              <div className="creator-empty"><span>🍳</span><h3>No recipes yet</h3><p>Create your first recipe!</p></div>
            ) : (
              <div className="creator-recipes-list">
                {myRecipes.map((recipe, i) => (
                  <motion.div key={recipe.id} className="creator-recipe-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="creator-recipe-row__info">
                      <h4>{recipe.title}</h4>
                      <p>{recipe.category} • {recipe.difficulty} • {recipe.prepTime + recipe.cookTime} min</p>
                    </div>
                    <div className="creator-recipe-row__stats">
                      <span><Heart size={13} /> {recipe.likes}</span>
                      <span><Eye size={13} /> {recipe.views}</span>
                      <span><Bookmark size={13} /> {recipe.saves}</span>
                    </div>
                    <span className={`admin-status admin-status--${recipe.isPublished ? 'active' : 'suspended'}`}>
                      {recipe.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <div className="creator-recipe-row__actions">
                      <button className="admin-action-btn admin-action-btn--edit" onClick={() => { setEditingRecipe(recipe); setShowRecipeForm(true); }}><Edit3 size={14} /></button>
                      <button className="admin-action-btn admin-action-btn--delete" onClick={() => { if (window.confirm('Delete?')) deleteRecipe(recipe.id); }}><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && creatorData && <ProfileTab creator={creatorData} onUpdate={updateProfile} />}

        {/* SETTINGS */}
        {activeTab === 'settings' && <SettingsTab onChangePassword={changePassword} />}
      </main>

      <AnimatePresence>
        {showRecipeForm && <RecipeFormModal editing={editingRecipe} creatorId={user!.id} onClose={() => { setShowRecipeForm(false); setEditingRecipe(null); }} onAdd={addRecipe} onUpdate={updateRecipe} />}

      </AnimatePresence>
    </div>
  );
};

// Profile Tab
const ProfileTab = ({ creator, onUpdate }: any) => {
  const [form, setForm] = useState({ name: creator.name, bio: creator.bio, specialty: creator.specialty, avatar: creator.avatar, socialLinks: creator.socialLinks || {} });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="creator-profile-tab">
      <div className="creator-profile-tab__header">
        <img src={form.avatar} alt="" className="creator-profile-tab__avatar" />
        <div className="creator-profile-tab__header-info">
          <h2>{creator.name}</h2>
          <p>{creator.email}</p>
          <div className="creator-profile-tab__badges">
            {creator.isVerified && <span className="admin-status admin-status--active">✓ Verified</span>}
            <span className="admin-status admin-status--active">{creator.status}</span>
          </div>
        </div>
      </div>
      <div className="creator-profile-form">
        <div className="modal__field"><label>Display Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div className="modal__field"><label>Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} /></div>
        <div className="modal__field"><label>Specialty</label>
          <select value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}>
            {['Indian Cuisine', 'Italian & Mediterranean', 'Japanese Cuisine', 'Mexican & Latin', 'Vegan & Plant-Based', 'Desserts & Baking', 'Seafood', 'BBQ & Grill', 'Other'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="modal__field"><label>Avatar URL</label><input value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} /></div>
        <div className="modal__field"><label>Instagram Handle</label><input value={form.socialLinks.instagram || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} placeholder="@username" /></div>
        <div className="modal__field"><label>YouTube Channel</label><input value={form.socialLinks.youtube || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })} placeholder="Channel name" /></div>
        <motion.button className="admin-create-btn" onClick={handleSave} whileHover={{ scale: 1.02 }} style={{ marginTop: 8 }}>
          {saved ? <><Check size={16} /> Saved!</> : <><Check size={16} /> Save Profile</>}
        </motion.button>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab = ({ onChangePassword }: any) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = () => {
    const result = onChangePassword(oldPass, newPass);
    if (result.success) { setMsg('Password changed!'); setIsError(false); setOldPass(''); setNewPass(''); }
    else { setMsg(result.error); setIsError(true); }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="creator-settings">
      <div className="creator-settings__section">
        <h3><Lock size={18} /> Change Password</h3>
        {msg && <div className={`auth-error ${!isError ? 'auth-success' : ''}`}>{isError ? <AlertCircle size={14} /> : <Check size={14} />} {msg}</div>}
        <div className="modal__field"><label>Current Password</label><input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} /></div>
        <div className="modal__field"><label>New Password</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 6 characters" /></div>
        <motion.button className="admin-create-btn" onClick={handleChange} whileHover={{ scale: 1.02 }} style={{ marginTop: 8 }}>
          <Lock size={16} /> Update Password
        </motion.button>
      </div>
    </div>
  );
};

// Recipe Form Modal
const RecipeFormModal = ({ editing, creatorId, onClose, onAdd, onUpdate }: any) => {
  const [form, setForm] = useState(editing || {
    creatorId, title: '', description: '', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    category: 'Indian', difficulty: 'Medium', prepTime: 15, cookTime: 30, servings: 4, calories: 400,
    ingredients: [{ name: '', amount: '', unit: '' }], steps: [{ number: 1, title: '', description: '' }],
    tags: [], isPublished: true
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const addIngredient = () => setForm({ ...form, ingredients: [...form.ingredients, { name: '', amount: '', unit: '' }] });
  const removeIngredient = (i: number) => setForm({ ...form, ingredients: form.ingredients.filter((_: any, idx: number) => idx !== i) });
  const updateIngredient = (i: number, field: string, value: string) => {
    const updated = [...form.ingredients];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, ingredients: updated });
  };

  const addStep = () => setForm({ ...form, steps: [...form.steps, { number: form.steps.length + 1, title: '', description: '' }] });
  const removeStep = (i: number) => setForm({ ...form, steps: form.steps.filter((_: any, idx: number) => idx !== i).map((s: any, idx: number) => ({ ...s, number: idx + 1 })) });
  const updateStep = (i: number, field: string, value: string) => {
    const updated = [...form.steps];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, steps: updated });
  };

  const addTag = () => { if (tagInput.trim()) { setForm({ ...form, tags: [...form.tags, tagInput.trim()] }); setTagInput(''); } };

  const handleSubmit = () => {
    if (!form.title) { setError('Title is required.'); return; }
    if (editing) { onUpdate(editing.id, form); }
    else { onAdd(form); }
    onClose();
  };

  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal modal--large" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{editing ? '✏️ Edit Recipe' : '🍳 Create New Recipe'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="auth-error" style={{ margin: '0 24px' }}><AlertCircle size={14} /> {error}</div>}
        <div className="modal__body modal__body--scroll">
          <div className="modal__row">
            <div className="modal__field"><label>Recipe Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Butter Chicken Masala" /></div>
            <div className="modal__field"><label>Image URL</label><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
          </div>
          <div className="modal__field"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe your recipe..." /></div>
          <div className="modal__row modal__row--4">
            <div className="modal__field"><label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Indian', 'Italian', 'Japanese', 'Mexican', 'Desserts', 'Vegan', 'Seafood', 'BBQ & Grill'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal__field"><label>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="modal__field"><label>Prep (min)</label><input type="number" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: +e.target.value })} /></div>
            <div className="modal__field"><label>Cook (min)</label><input type="number" value={form.cookTime} onChange={e => setForm({ ...form, cookTime: +e.target.value })} /></div>
          </div>
          <div className="modal__row modal__row--3">
            <div className="modal__field"><label>Servings</label><input type="number" value={form.servings} onChange={e => setForm({ ...form, servings: +e.target.value })} /></div>
            <div className="modal__field"><label>Calories</label><input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: +e.target.value })} /></div>
            <div className="modal__field modal__field--check"><label><input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label></div>
          </div>

          <div className="modal__section-title">🧂 Ingredients</div>
          {form.ingredients.map((ing: any, i: number) => (
            <div key={i} className="modal__row modal__row--ingredient">
              <input placeholder="Ingredient" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} />
              <input placeholder="Amount" value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)} style={{ maxWidth: 80 }} />
              <input placeholder="Unit" value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} style={{ maxWidth: 80 }} />
              <button className="modal__remove-btn" onClick={() => removeIngredient(i)}><X size={14} /></button>
            </div>
          ))}
          <button className="modal__add-btn" onClick={addIngredient}><Plus size={14} /> Add Ingredient</button>

          <div className="modal__section-title">👨‍🍳 Cooking Steps</div>
          {form.steps.map((step: any, i: number) => (
            <div key={i} className="modal__step">
              <div className="modal__step-number">{step.number}</div>
              <div className="modal__step-fields">
                <input placeholder="Step title" value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} />
                <textarea placeholder="Step description" value={step.description} onChange={e => updateStep(i, 'description', e.target.value)} rows={2} />
              </div>
              <button className="modal__remove-btn" onClick={() => removeStep(i)}><X size={14} /></button>
            </div>
          ))}
          <button className="modal__add-btn" onClick={addStep}><Plus size={14} /> Add Step</button>

          <div className="modal__section-title">🏷️ Tags</div>
          <div className="modal__tags-input">
            <input placeholder="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
            <button onClick={addTag}><Plus size={14} /></button>
          </div>
          <div className="modal__tags-list">
            {form.tags.map((tag: string, i: number) => (
              <span key={i} className="modal__tag">{tag} <button onClick={() => setForm({ ...form, tags: form.tags.filter((_: string, idx: number) => idx !== i) })}><X size={10} /></button></span>
            ))}
          </div>
        </div>
        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>Cancel</button>
          <motion.button className="modal__btn modal__btn--submit" onClick={handleSubmit} whileHover={{ scale: 1.02 }}>
            {editing ? <><Check size={16} /> Update Recipe</> : <><Plus size={16} /> Create Recipe</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatorDashboard;
