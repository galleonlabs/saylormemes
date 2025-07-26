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
      className="staggered-item bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 hover:border-btc/50"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="aspect-video relative group rounded-t-xl overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-contain bg-gray-50 cursor-pointer"
          onClick={() => onEnlarge(photo)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{photo.title}</h3>
        
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {photo.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex">
          <button
            onClick={() => onEnlarge(photo)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            Enlarge
          </button>
        </div>
      </div>
    </div>
  );
};