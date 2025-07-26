import React from 'react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onEnlarge: (photo: Photo) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index, onEnlarge }) => {

  return (
    <div
      className="staggered-item card hover-lift"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="aspect-video relative group rounded-t-2xl overflow-hidden bg-neutral-50">
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-contain cursor-pointer transition-transform duration-350 group-hover:scale-105"
          onClick={() => onEnlarge(photo)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-neutral-900 mb-3 line-clamp-2 text-balance">{photo.title}</h3>
        
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {photo.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="tag-pill"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex">
          <button
            onClick={() => onEnlarge(photo)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-lg transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            View
          </button>
        </div>
      </div>
    </div>
  );
};