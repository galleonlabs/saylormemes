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
      className="fixed inset-0 bg-paper/95 backdrop-blur-sm flex items-center justify-center z-50 p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-ink-lighter hover:text-ink"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="figure">
          <div className="figure-content">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
          <p className="figure-caption">{photo.title}</p>
          
          <div className="mt-4 text-center">
            <a
              href={photo.url}
              download
              className="btn-secondary"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};