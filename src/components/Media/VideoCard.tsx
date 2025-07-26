import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types';

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
  const [isHovered, setIsHovered] = useState(false);
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

  const handleFullscreen = async () => {
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
    
    setTimeout(() => {
      if (videoRef.current && videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }, 100);
  };

  return (
    <>
      <div
        className={`stagger-item card-modern group ${isEnlarged ? 'hidden' : ''}`}
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-video relative bg-dark-100 rounded-t-xl overflow-hidden">
          {!video.videoUrl ? (
            <>
              <img
                src={video.thumbnailUrl}
                alt={`${video.title} thumbnail`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <button
                onClick={handlePlayClick}
                disabled={isLoadingVideo}
                className="absolute inset-0 flex items-center justify-center"
                aria-label={`Play ${video.title}`}
              >
                {isLoadingVideo ? (
                  <div className="spinner-modern w-12 h-12" />
                ) : error ? (
                  <div className="text-white text-center p-4 animate-fade-in">
                    <p className="mb-3 text-sm font-medium">Failed to load video</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick();
                      }}
                      className="btn-primary text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className={`relative ${isHovered ? 'animate-pulse' : ''}`}>
                    <div className="w-20 h-20 rounded-full bg-btc/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-lg">
                      <svg className="w-8 h-8 text-dark ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    {isHovered && (
                      <div className="absolute inset-0 rounded-full bg-btc/30 blur-xl animate-glow"></div>
                    )}
                  </div>
                )}
              </button>
            </>
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain bg-black"
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              onError={() => setError(true)}
            />
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-white mb-3 line-clamp-2">{video.title}</h3>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {video.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="tag-modern">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleEnlarge}
              disabled={isLoadingVideo}
              className="btn-ghost text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Enlarge
            </button>
            <button
              onClick={handleFullscreen}
              disabled={isLoadingVideo}
              className="btn-ghost text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isEnlarged && (
        <div className="fixed inset-0 bg-dark-overlay backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={handleEnlarge}
              className="absolute -top-14 right-0 text-white/60 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="glass rounded-2xl overflow-hidden">
              {video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  className="w-full rounded-2xl"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="spinner-modern w-16 h-16" />
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center animate-slide-in-up">
              <h3 className="text-2xl font-bold text-white mb-2">{video.title}</h3>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {video.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag-modern">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};