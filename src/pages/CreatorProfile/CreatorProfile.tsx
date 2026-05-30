import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Heart, MessageCircle, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal/AuthModal';
import './CreatorProfile.css';

/**
 * Converts a stored social link value (which may be a bare username, a partial URL,
 * or a full URL) into a proper absolute URL for the given platform.
 * Examples:
 *   "_aditya01_"              → "https://instagram.com/_aditya01_"
 *   "instagram.com/xyz"       → "https://instagram.com/xyz"
 *   "https://instagram.com/x" → "https://instagram.com/x"  (unchanged)
 */
const resolveLink = (value: string, platform: 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'threads'): string => {
  if (!value) return '';
  // Already a full URL — return as-is
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  // Starts with the domain (no protocol) → add https://
  if (value.startsWith('instagram.com') || value.startsWith('www.instagram.com') ||
    value.startsWith('youtube.com') || value.startsWith('www.youtube.com') ||
    value.startsWith('twitter.com') || value.startsWith('x.com') ||
    value.startsWith('facebook.com') || value.startsWith('www.facebook.com') ||
    value.startsWith('threads.net') || value.startsWith('www.threads.net')) {
    return `https://${value}`;
  }
  // Bare username or handle → build full URL
  const username = value.replace(/^@/, ''); // strip leading @ if present
  const bases: Record<string, string> = {
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/@',
    twitter: 'https://x.com/',
    facebook: 'https://www.facebook.com/',
    threads: 'https://www.threads.net/@',
  };
  return `${bases[platform]}${username}`;
};



const CreatorProfile = () => {
  const { id, creatorName } = useParams();
  const { user, getCreators, getAllCreatorRecipes, isFollowingUser, toggleFollowUser } = useAuth();
  const creators = getCreators();
  const recipes = getAllCreatorRecipes();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const slugify = (text: string) => text.toLowerCase().replace(/[^\w]+/g, '');

  const creator = creators.find(c => {
    if (id) return c.id === id;
    if (creatorName) return slugify(c.name) === creatorName || c.id === creatorName;
    return false;
  });
  if (!creator) return <div className="container" style={{ paddingTop: 200, textAlign: 'center' }}><h2>Creator not found</h2></div>;

  const creatorRecipes = recipes
    .filter(r => {
      const cId = typeof r.creator === 'string' ? r.creator : r.creator?.id;
      return cId === creator.id;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const following = user ? isFollowingUser(creator.id) : false;
  const isOwnProfile = user && user.id === creator.id;

  const handleFollow = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsFollowLoading(true);
    await toggleFollowUser(creator.id);
    setIsFollowLoading(false);
  };


  return (
    <div className="creator-profile-ig">
      {/* Instagram-style Profile Header */}
      <section className="cp-ig-header">
        <div className="cp-ig-container">

          {/* Row 1: Avatar + Stats side by side */}
          <div className="cp-ig-profile">
            {/* Avatar */}
            <div className="cp-ig-avatar-wrap">
              <img src={creator.avatar} alt={creator.name} className="cp-ig-avatar" />
              {creator.isVerified && <div className="cp-ig-verified-badge"><BadgeCheck size={20} /></div>}
            </div>

            {/* Stats beside avatar */}
            <div className="cp-ig-stats-wrap">
              <div className="cp-ig-stats">
                <div className="cp-ig-stat">
                  <strong>{creatorRecipes.length}</strong>
                  <span>Posts</span>
                </div>
                <div className="cp-ig-stat">
                  <strong>{(creator.followers || 0).toLocaleString()}</strong>
                  <span>Followers</span>
                </div>
              </div>
              {/* Follow button on desktop beside stats */}
              {/* {!isOwnProfile && (
                <div className="cp-ig-actions cp-ig-actions--desktop">
                  <motion.button
                    className={`cp-ig-follow-btn ${following ? 'following' : ''}`}
                    onClick={handleFollow}
                    disabled={isFollowLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isFollowLoading ? '...' : following ? 'Following' : 'Follow'}
                  </motion.button>
                </div>
              )} */}
            </div>
          </div>

          {/* Row 2: Name, specialty, bio, socials, follow (mobile) */}
          <div className="cp-ig-info">
            <h1 className="cp-ig-display-name">{creator.name}</h1>
            <p className="cp-ig-specialty">{creator.specialty}</p>
            {creator.bio && <p className="cp-ig-bio">{creator.bio}</p>}

            {/* Social Links */}
            {(creator.socialLinks?.instagram || creator.socialLinks?.youtube || creator.socialLinks?.twitter || creator.socialLinks?.facebook || creator.socialLinks?.threads) && (
              <div className="cp-ig-socials">
                {creator.socialLinks?.youtube && (
                  <a
                    href={resolveLink(creator.socialLinks.youtube, 'youtube')}
                    target="_blank" rel="noreferrer noopener"
                    title="YouTube"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#FF0000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', flexShrink: 0,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(255,0,0,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                )}
                {creator.socialLinks?.instagram && (
                  <a
                    href={resolveLink(creator.socialLinks.instagram, 'instagram')}
                    target="_blank" rel="noreferrer noopener"
                    title="Instagram"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', flexShrink: 0,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(214,36,159,0.4)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                )}
                {creator.socialLinks?.facebook && (
                  <a
                    href={resolveLink(creator.socialLinks.facebook, 'facebook')}
                    target="_blank" rel="noreferrer noopener"
                    title="Facebook"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#1877F2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', flexShrink: 0,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(24,119,242,0.35)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.407.595 24 1.325 24H12.82v-9.294H9.692V11.09h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.098 2.795.142v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.314h3.587l-.467 3.617h-3.12V24h6.116C23.406 24 24 23.407 24 22.674V1.326C24 .593 23.406 0 22.675 0z" /></svg>
                  </a>
                )}
                {creator.socialLinks?.threads && (
                  <a
                    href={resolveLink(creator.socialLinks.threads, 'threads')}
                    target="_blank" rel="noreferrer noopener"
                    title="Threads"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#111111',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', flexShrink: 0,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
                    </svg>
                  </a>
                )}
                {creator.socialLinks?.twitter && (
                  <a
                    href={resolveLink(creator.socialLinks.twitter, 'twitter')}
                    target="_blank" rel="noreferrer noopener"
                    title="X / Twitter"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#000000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', flexShrink: 0,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px) scale(1.08)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                )}
              </div>
            )}

            {!isOwnProfile && (
              <div className="cp-ig-actions cp-ig-actions--mobile">
                <motion.button
                  className={`cp-ig-follow-btn ${following ? 'following' : ''}`}
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isFollowLoading ? '...' : following ? 'Following' : 'Follow'}
                </motion.button>
              </div>
            )}


          </div>

        </div>
      </section>

      {/* Tabs and Feed Section - Light Pink Background */}
      <section className="cp-ig-feed-section">
        <div className="cp-ig-container">
          {/* Tabs */}
          <div className="cp-ig-tabs">
            <button className={`cp-ig-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
          </div>

          {/* Content Grid */}
          <div className="cp-ig-feed">
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
                  <Link to={`/creator/${slugify(creator.name)}/${slugify(recipe.title)}`} className="cp-ig-grid-link">
                    <img src={recipe.image} alt={recipe.title} className="cp-ig-grid-img" />
                    <div className="cp-ig-grid-overlay">
                      <div className="cp-ig-grid-stats">
                        <span><Heart size={18} /> {recipe.likes || 0}</span>
                        <span><MessageCircle size={18} /> {recipe.comments || 0}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {creatorRecipes.length === 0 && (
              <div className="cp-ig-empty">
                <p>No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} message="Please login to follow this creator" />
    </div>
  );
};

export default CreatorProfile;