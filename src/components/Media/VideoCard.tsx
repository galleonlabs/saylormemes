import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types';
import { ProgressiveImage } from '../Shared/ProgressiveImage';

interface VideoCardProps {
  video: Video;
  index: number;
  onLoadVideo: (fileName: string) => Promise<string>;
  onTogglePlay: (index: number) => void;
  logAnalyticsEvent: (eventName: string, parameters?: any) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  onLoadVideo,
  onTogglePlay,
  logAnalyticsEvent,
}) => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (video.isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [video.isPlaying]);

  const handlePlayClick = async () => {
    setError(false);
    
    if (!video.videoUrl) {
      setIsLoadingVideo(true);
      try {
        const videoUrl = await onLoadVideo(video.fileName);
        video.videoUrl = videoUrl;
      } catch (err) {
        console.error('Failed to load video:', err);
        setError(true);
        setIsLoadingVideo(false);
        return;
      }
      setIsLoadingVideo(false);
    }

    onTogglePlay(index);
    logAnalyticsEvent('play_video', {
      video_title: video.title,
      video_file: video.fileName,
    });
  };

  const handleEnlarge = async () => {
    if (!video.videoUrl && !isLoadingVideo) {
      setIsLoadingVideo(true);
      try {
        const videoUrl = await onLoadVideo(video.fileName);
        video.videoUrl = videoUrl;
      } catch (err) {
        console.error('Failed to load video:', err);
        setError(true);
        setIsLoadingVideo(false);
        return;
      }
      setIsLoadingVideo(false);
    }
    setIsEnlarged(!isEnlarged);
    logAnalyticsEvent('enlarge_video', {
      video_title: video.title,
    });
  };

  return (
    <>
      <div className="media-item flex items-start">
        <span className="media-item-number">{String(index + 1).padStart(3, '0')}</span>
        
        <div className="media-item-content">
          <div className="flex items-start gap-4">
            <div className="w-32 h-20 flex-shrink-0">
              <div className="figure-content h-full">
                {!video.videoUrl ? (
                  <ProgressiveImage
                    src={video.thumbnailUrl}
                    alt={`${video.title} thumbnail`}
                    className="w-full h-full cursor-pointer"
                    onClick={handlePlayClick}
                    quality={8}
                    placeholderBlur={3}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                  />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="media-item-title">{video.title}</h3>
              <div className="media-item-meta">
                {video.tags && video.tags.length > 0 && (
                  <span>Tags: {video.tags.join(', ')}</span>
                )}
              </div>
              
              <div className="mt-2 flex gap-2">
                {!video.videoUrl && (
                  <button onClick={handlePlayClick} className="btn-text" disabled={isLoadingVideo}>
                    {isLoadingVideo ? 'Loading...' : 'Play'}
                  </button>
                )}
                <button onClick={handleEnlarge} className="btn-text">
                  View larger
                </button>
              </div>
              
              {error && (
                <p className="text-footnote text-red-600 mt-2">
                  Failed to load video. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEnlarged && (
        <div className="fixed inset-0 bg-paper/95 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={handleEnlarge}
              className="absolute -top-10 right-0 text-ink-lighter hover:text-ink"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="figure">
              <div className="figure-content">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    className="w-full"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
              <p className="figure-caption">Figure {index + 1}: {video.title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};