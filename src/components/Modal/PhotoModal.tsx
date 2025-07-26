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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={photo.url}
          alt={photo.title}
          className="max-w-full max-h-[90vh] object-contain rounded"
        />
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium">{photo.title}</p>
          <a
            href={photo.url}
            download
            className="inline-block mt-2 px-4 py-2 bg-btc text-white rounded-full hover:bg-btc-dark transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};