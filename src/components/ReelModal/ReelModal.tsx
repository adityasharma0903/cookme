import React from 'react';
import './ReelModal.css';

const ReelModal = ({ reel, onClose }: any) => {
  if (!reel) return null;
  return (
    <div className="reel-modal-overlay" onClick={onClose}>
      <div className="reel-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reel-modal__close" onClick={onClose}>✕</button>
        <div className="reel-modal__content">
          <video src={reel.videoUrl} controls autoPlay playsInline className="reel-modal__video" />
          <div className="reel-modal__info">
            <h3>{reel.title}</h3>
            <p>{reel.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelModal;
