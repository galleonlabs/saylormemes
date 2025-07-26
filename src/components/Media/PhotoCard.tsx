import React from 'react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onEnlarge: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onEnlarge }) => {
  return (
    <div className="media-item flex items-start">
      <span className="media-item-number">{String(index + 1).padStart(3, '0')}</span>
      
      <div className="media-item-content">
        <div className="flex items-start gap-4">
          <div className="w-32 h-20 flex-shrink-0">
            <div className="figure-content h-full">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onEnlarge(photo)}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="media-item-title">{photo.title}</h3>
            <div className="media-item-meta">
              {photo.tags && photo.tags.length > 0 && (
                <span>Tags: {photo.tags.join(', ')}</span>
              )}
            </div>
            
            <div className="mt-2">
              <button onClick={() => onEnlarge(photo)} className="btn-text">
                View larger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};