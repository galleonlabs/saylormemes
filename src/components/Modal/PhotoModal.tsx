import React, { useEffect } from 'react';
import { Photo } from '../../types';

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-dark-overlay backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 text-white/60 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
          aria-label="Close"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="glass rounded-2xl overflow-hidden">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
        
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{photo.title}</h3>
          
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {photo.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag-modern">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <a
            href={photo.url}
            download
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </div>
  );
};