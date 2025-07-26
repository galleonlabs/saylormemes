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
    
    // Wait for video element to be ready
    setTimeout(() => {
      if (videoRef.current && videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }, 100);
  };

  return (
    <>
      <div
        className={`staggered-item card hover-lift ${
          isEnlarged ? 'hidden' : ''
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="aspect-video relative bg-neutral-900 rounded-t-2xl overflow-hidden group">
          {!video.videoUrl ? (
            <>
              <img
                src={video.thumbnailUrl}
                alt={`${video.title} thumbnail`}
                className="w-full h-full object-contain"
              />
              <button
                onClick={handlePlayClick}
                disabled={isLoadingVideo}
                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] transition-all duration-350 group-hover:bg-black/30 group-hover:backdrop-blur-sm"
                aria-label={`Play ${video.title}`}
              >
                {isLoadingVideo ? (
                  <div className="spinner" />
                ) : error ? (
                  <div className="text-white text-center p-4 animate-fade-in">
                    <p className="mb-3 text-sm font-medium">Failed to load video</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick();
                      }}
                      className="px-4 py-2 bg-btc text-white text-sm font-medium rounded-lg hover:bg-btc-dark transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-transform duration-250 group-hover:scale-110">
                    <svg className="w-8 h-8 text-neutral-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
              </button>
            </>
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              onError={() => setError(true)}
            />
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-3 line-clamp-2 text-balance">{video.title}</h3>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {video.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="tag-pill"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleEnlarge}
              disabled={isLoadingVideo}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-lg transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Enlarge
            </button>
            <button
              onClick={handleFullscreen}
              disabled={isLoadingVideo}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-lg transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fullscreen
            </button>
          </div>
        </div>
      </div>

      {isEnlarged && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleEnlarge}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close enlarged view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                className="w-full rounded-xl shadow-elevated"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="spinner" />
              </div>
            )}
            <p className="text-white text-center mt-4 text-lg font-medium animate-slide-up">{video.title}</p>
          </div>
        </div>
      )}
    </>
  );
};