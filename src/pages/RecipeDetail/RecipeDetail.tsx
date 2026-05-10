import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Share2, Clock, Users, Flame, BadgeCheck, MessageCircle, Eye, ArrowLeft, Printer, Send } from 'lucide-react';
import { useAuth, RecipeComment } from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal/AuthModal';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getAllCreatorRecipes, isRecipeLiked, isRecipeSaved, toggleLikeRecipe, toggleSaveRecipe, getComments, addComment } = useAuth();
  const recipes = getAllCreatorRecipes();
  
  const recipe = recipes.find(r => r.id === id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'ingredients' | 'directions'>('ingredients');
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recipe && id) {
      setLiked(isRecipeLiked(id));
      setSaved(isRecipeSaved(id));
      setLikeCount(recipe.likes || 0);
      setSaveCount(recipe.saves || 0);
      // Fetch comments
      getComments(id).then(setComments);
    }
  }, [recipe, id, user]);

  if (!recipe) return <div className="recipe-detail-404 container"><h2>Recipe not found</h2><Link to="/recipes">← Back to recipes</Link></div>;

  const related = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);

  const requireAuth = (action: string) => {
    if (!user) {
      setAuthMessage(`Please login to ${action} this recipe`);
      setShowAuthModal(true);
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    if (requireAuth('like')) return;
    const result = await toggleLikeRecipe(recipe.id);
    if (result) {
      setLiked(result.liked);
      setLikeCount(result.likes);
    }
  };

  const handleSave = async () => {
    if (requireAuth('save')) return;
    const result = await toggleSaveRecipe(recipe.id);
    if (result) {
      setSaved(result.saved);
      setSaveCount(result.saves);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text: recipe.description, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const creatorName = typeof recipe.creator === 'string' ? 'Chef' : recipe.creator.name;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.title} - COOK.ME</title>
        <style>
          body { font-family: 'Georgia', serif; color: #2c1810; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
          h1 { font-size: 2rem; margin-bottom: 4px; color: #2c1810; }
          .subtitle { color: #8b7355; margin-bottom: 20px; }
          .meta { display: flex; gap: 24px; margin-bottom: 24px; padding: 16px; background: #f9f5f0; border-radius: 8px; }
          .meta span { font-size: 0.9rem; color: #5a3e28; }
          h2 { font-size: 1.3rem; color: #c4846c; border-bottom: 2px solid #e8ddd0; padding-bottom: 8px; margin-top: 32px; }
          .ingredient { padding: 8px 0; border-bottom: 1px solid #f0e8e0; display: flex; justify-content: space-between; }
          .step { margin-bottom: 20px; padding-left: 20px; border-left: 3px solid #c4846c; }
          .step-num { font-weight: bold; color: #c4846c; font-size: 1.1rem; }
          .step-title { font-weight: bold; margin: 4px 0; }
          .footer { margin-top: 40px; text-align: center; color: #8b7355; font-size: 0.85rem; border-top: 1px solid #e8ddd0; padding-top: 16px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <p class="subtitle">${recipe.description}</p>
        <p class="subtitle">By ${creatorName}</p>
        <div class="meta">
          <span>⏱ ${recipe.prepTime + recipe.cookTime} min</span>
          <span>👥 ${recipe.servings} servings</span>
          <span>🔥 ${recipe.calories} cal</span>
          <span>📊 ${recipe.difficulty}</span>
        </div>
        <h2>🧂 Ingredients</h2>
        ${recipe.ingredients.map(ing => `<div class="ingredient"><span>${ing.name}</span><span>${ing.amount} ${ing.unit}</span></div>`).join('')}
        <h2>👨‍🍳 Cooking Steps</h2>
        ${recipe.steps.map(step => `<div class="step"><span class="step-num">Step ${step.number}</span><p class="step-title">${step.title}</p><p>${step.description}</p></div>`).join('')}
        <div class="footer">Printed from COOK.ME • ${new Date().toLocaleDateString()}</div>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireAuth('comment on')) return;
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    const comment = await addComment(recipe.id, newComment.trim());
    if (comment) {
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
    setIsSubmittingComment(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="recipe-detail">
      {/* Hero */}
      <section className="rd-hero">
        <div className="rd-hero__bg">
          <img src={recipe.image} alt={recipe.title} />
          <div className="rd-hero__overlay" />
        </div>
        <div className="rd-hero__content container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <button onClick={() => navigate(-1)} className="rd-back" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="rd-hero__badges">
              <span className="rd-badge rd-badge--cat">{recipe.category}</span>
              <span className={`rd-badge rd-badge--diff rd-badge--${recipe.difficulty.toLowerCase()}`}>{recipe.difficulty}</span>
              {recipe.isSponsored && <span className="rd-badge rd-badge--sponsored">✨ Sponsored</span>}
              {recipe.isTrending && <span className="rd-badge rd-badge--trending"><Flame size={12} /> Trending</span>}
            </div>
            <h1 className="rd-hero__title">{recipe.title}</h1>
            <p className="rd-hero__desc">{recipe.description}</p>
            <div className="rd-hero__creator">
              <img src={recipe.creator.avatar} alt={recipe.creator.name} />
              <div>
                <span className="rd-hero__creator-name">{recipe.creator.name} {recipe.creator.isVerified && <BadgeCheck size={14} />}</span>
                <span className="rd-hero__creator-label">Recipe Creator</span>
              </div>
            </div>
            <div className="rd-hero__actions">
              <motion.button className={`rd-action rd-action--like ${liked ? 'active' : ''}`} onClick={handleLike} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Liked' : 'Like'}
              </motion.button>
              <motion.button className={`rd-action rd-action--save ${saved ? 'active' : ''}`} onClick={handleSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
              </motion.button>
              <motion.button className="rd-action" onClick={handleShare} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Share2 size={18} /></motion.button>
              <motion.button className="rd-action" onClick={handlePrint} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Printer size={18} /></motion.button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Main Content */}
      <section className="rd-main container">
        {/* Mobile Tabs */}
        <div className="rd-mobile-tabs">
          <button 
            className={`rd-mobile-tab ${activeMobileTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveMobileTab('ingredients')}
          >
            Ingredients
          </button>
          <button 
            className={`rd-mobile-tab ${activeMobileTab === 'directions' ? 'active' : ''}`}
            onClick={() => setActiveMobileTab('directions')}
          >
            Directions
          </button>
        </div>

        <div className="rd-grid">
          {/* Ingredients */}
          <motion.div className={`rd-ingredients ${activeMobileTab !== 'ingredients' ? 'mobile-hidden' : ''}`} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="rd-section-title">🧂 Ingredients</h2>
            <p className="rd-section-sub">For {recipe.servings} servings</p>
            <ul className="rd-ingredients-list">
              {recipe.ingredients.map((ing, i) => (
                <motion.li key={i} className="rd-ingredient" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <span className="rd-ingredient__check" />
                  <span className="rd-ingredient__name">{ing.name}</span>
                  <span className="rd-ingredient__amount">{ing.amount} {ing.unit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Steps */}
          <div className={`rd-steps ${activeMobileTab !== 'directions' ? 'mobile-hidden' : ''}`}>
            <h2 className="rd-section-title">👨‍🍳 Cooking Steps</h2>
            <div className="rd-steps-list">
              {recipe.steps.map((step, i) => (
                <motion.div key={i} className="rd-step" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="rd-step__number">{step.number}</div>
                  <div className="rd-step__content">
                    <h4 className="rd-step__title">{step.title}</h4>
                    <p className="rd-step__desc">{step.description}</p>
                    {step.duration && <span className="rd-step__time"><Clock size={13} /> {step.duration} min</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="rd-tags container">
        <h3 className="rd-tags-title">Tags</h3>
        <div className="rd-tags-list">
          {recipe.tags.map(tag => <Link key={tag} to="/recipes" className="rd-tag">#{tag}</Link>)}
        </div>
      </section>

      {/* Comments Section */}
      <section className="rd-comments container">
        <h2 className="rd-section-title">💬 Comments ({comments.length})</h2>
        
        {/* Add comment form */}
        <form className="rd-comment-form" onSubmit={handleAddComment}>
          {user ? (
            <>
              <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop'} alt={user.name} className="rd-comment-form__avatar" />
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="rd-comment-form__input"
                disabled={isSubmittingComment}
              />
              <motion.button type="submit" className="rd-comment-form__submit" disabled={isSubmittingComment || !newComment.trim()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Send size={18} />
              </motion.button>
            </>
          ) : (
            <div className="rd-comment-form__login" onClick={() => { setAuthMessage('Please login to comment'); setShowAuthModal(true); }}>
              <MessageCircle size={18} />
              <span>Login to add a comment...</span>
            </div>
          )}
        </form>

        {/* Comments List */}
        <div className="rd-comments-list">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div key={comment.id} className="rd-comment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <img src={comment.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop'} alt={comment.user.name} className="rd-comment__avatar" />
                <div className="rd-comment__body">
                  <div className="rd-comment__header">
                    <strong className="rd-comment__name">{comment.user.name}</strong>
                    <span className="rd-comment__time">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="rd-comment__text">{comment.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {comments.length === 0 && (
            <div className="rd-comments-empty">
              <MessageCircle size={32} />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="rd-related section-padding">
          <div className="container">
            <h2 className="rd-section-title" style={{ marginBottom: 32 }}>You Might Also Like</h2>
            <div className="recipes-grid">
              {related.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message={authMessage} />
    </div>
  );
};

export default RecipeDetail;
