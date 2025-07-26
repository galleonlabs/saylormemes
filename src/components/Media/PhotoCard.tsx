import React, { useState } from 'react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onEnlarge: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onEnlarge }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="stagger-item card-modern group overflow-hidden"
      style={{ 
        animationDelay: `${index * 50}ms`,
        height: imageLoaded ? 'auto' : '300px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative cursor-pointer" onClick={() => onEnlarge(photo)}>
        <div className={`relative overflow-hidden ${!imageLoaded ? 'h-64 skeleton-dark' : ''}`}>
          <img
            src={photo.url}
            alt={photo.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-auto transition-all duration-700 ${
              imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
            }`}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className={`p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 ${
                    isHovered ? 'scale-110 shadow-glow' : ''
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <span className="font-medium">View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-white mb-3 line-clamp-2">{photo.title}</h3>
        
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {photo.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="tag-modern">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};