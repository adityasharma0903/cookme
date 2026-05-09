import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, X, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ReelViewer.css';

interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  creator: any;
  likes: number;
  views: number;
  likedBy: string[];
  comments: any[];
}

const ReelViewer = ({ reels, initialIndex = 0, onClose }: { reels: Reel[]; initialIndex?: number; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localLikes, setLocalLikes] = useState<{ [key: string]: number }>({});

  const currentReel = reels[currentIndex];

  useEffect(() => {
    // Check if user already liked this reel
    if (user && currentReel?.likedBy?.includes(user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }

    // Pause all videos
    Object.values(videoRefs.current).forEach(v => v?.pause());
    // Play current video
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].play();
    }
  }, [currentIndex, user]);

  const handleLike = () => {
    if (!user) {
      alert('Please login to like');
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    
    // Update local likes count
    const reelId = currentReel.id;
    setLocalLikes(prev => ({
      ...prev,
      [reelId]: (prev[reelId] || currentReel.likes) + (newLiked ? 1 : -1)
    }));
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reel/${currentReel.id}`;
    navigator.clipboard.writeText(url);
    alert('Reel link copied to clipboard!');
  };

  const handleAddComment = () => {
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;
    
    // TODO: Add API call to save comment
    console.log('Comment added:', newComment);
    setNewComment('');
  };

  const goNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="reel-viewer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close button */}
        <button className="reel-viewer__close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Reels Container */}
        <div className="reel-viewer__container">
          <AnimatePresence mode="wait">
            {reels.map((reel, idx) => (
              idx === currentIndex && (
                <motion.div
                  key={reel.id}
                  className="reel-viewer__slide"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.3 }}
                >
<div className="reel-viewer__video-wrapper">
                <img 
                  src={reel.thumbnail || reel.videoUrl}
                  alt={reel.title}
                  className="reel-viewer__thumbnail"
                />
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[idx] = el;
                  }}
                  src={reel.videoUrl}
                  className="reel-viewer__video"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.paused) video.play();
                    else video.pause();
                  }}
                />
              </div>

                  {/* Left sidebar - creator info */}
                  <div className="reel-viewer__left">
                    <img src={reel.creator?.avatar} alt={reel.creator?.name} className="reel-viewer__avatar" />
                    <div className="reel-viewer__creator-info">
                      <h3>{reel.creator?.name}</h3>
                      <p>{reel.title}</p>
                    </div>
                  </div>

                  {/* Right sidebar - actions */}
                  <div className="reel-viewer__right">
                    <motion.button 
                      className="reel-viewer__action" 
                      onClick={handleLike}
                      whileTap={{ scale: 1.2 }}
                    >
                      <Heart 
                        size={24} 
                        fill={liked ? '#ff4458' : 'none'} 
                        color={liked ? '#ff4458' : '#fff'}
                        style={{ transition: 'all 0.2s' }}
                      />
                      <span>{localLikes[reel.id] !== undefined ? localLikes[reel.id] : reel.likes}</span>
                    </motion.button>
                    <motion.button 
                      className="reel-viewer__action"
                      onClick={() => setShowComments(!showComments)}
                      whileTap={{ scale: 1.2 }}
                    >
                      <MessageCircle size={24} />
                      <span>{reel.comments?.length || 0}</span>
                    </motion.button>
                    <motion.button 
                      className="reel-viewer__action"
                      onClick={handleShare}
                      whileTap={{ scale: 1.2 }}
                    >
                      <Share2 size={24} />
                      <span>Share</span>
                    </motion.button>
                  </div>

                  {/* Bottom info */}
                  <div className="reel-viewer__bottom">
                    <p className="reel-viewer__description">{reel.description}</p>
                    <div className="reel-viewer__meta">
                      <span>👁 {reel.views} views</span>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="reel-viewer__nav">
          {currentIndex > 0 && (
            <button className="reel-viewer__nav-btn reel-viewer__nav-btn--prev" onClick={goPrev}>
              <ChevronUp size={28} />
            </button>
          )}
          {currentIndex < reels.length - 1 && (
            <button className="reel-viewer__nav-btn reel-viewer__nav-btn--next" onClick={goNext}>
              <ChevronDown size={28} />
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="reel-viewer__counter">
          {currentIndex + 1} / {reels.length}
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <motion.div
            className="reel-viewer__comments"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div className="reel-viewer__comments-header">
              <h3>Comments</h3>
              <button onClick={() => setShowComments(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="reel-viewer__comments-list">
              {currentReel?.comments?.map((comment, i) => (
                <div key={i} className="reel-viewer__comment">
                  <img src={comment.user?.avatar} alt={comment.user?.name} />
                  <div>
                    <p className="reel-viewer__comment-name">{comment.user?.name}</p>
                    <p className="reel-viewer__comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="reel-viewer__comments-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button onClick={handleAddComment}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ReelViewer;
