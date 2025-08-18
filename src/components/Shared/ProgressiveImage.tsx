import React, { useState, useRef, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderBlur?: number;
  onClick?: () => void;
  quality?: number;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  placeholderBlur = 4,
  onClick,
  quality = 10
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [placeholderDataUrl, setPlaceholderDataUrl] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a low-quality placeholder using canvas
  const generatePlaceholder = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set small dimensions for low quality
        const scale = quality / 100;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        if (ctx) {
          // Draw scaled down image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.1);
          resolve(dataUrl);
        } else {
          resolve('');
        }
      };
      
      img.onerror = () => resolve('');
      img.src = imageUrl;
    });
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate placeholder when component mounts or src changes
  useEffect(() => {
    if (src) {
      generatePlaceholder(src).then(setPlaceholderDataUrl);
    }
  }, [src, quality]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {/* Placeholder image with blur */}
      {placeholderDataUrl && !isLoaded && (
        <img
          src={placeholderDataUrl}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            filter: `blur(${placeholderBlur}px)`,
            transform: 'scale(1.1)' // Slightly scale up to hide blur edges
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton fallback */}
      {!placeholderDataUrl && !isLoaded && (
        <div 
          className={`absolute inset-0 bg-ink/5 animate-pulse transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      
      {/* High quality image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};