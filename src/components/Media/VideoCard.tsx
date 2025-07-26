import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

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
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shareUrl = window.location.href;
  const shareTitle = `Check out this Michael Saylor meme: ${video.title}`;

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

  const handleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
    logAnalyticsEvent('enlarge_video', {
      video_title: video.title,
    });
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <>
      <div
        className={`staggered-item bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 hover:border-btc/50 ${
          isEnlarged ? 'hidden' : ''
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="aspect-video relative bg-gray-900">
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
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity"
                aria-label={`Play ${video.title}`}
              >
                {isLoadingVideo ? (
                  <div className="spinner" />
                ) : error ? (
                  <div className="text-white text-center p-4">
                    <p className="mb-2">Failed to load video</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick();
                      }}
                      className="px-3 py-1 bg-btc text-white rounded hover:bg-btc-dark"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
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

        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {video.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-between flex-wrap">
            <div className="flex gap-2">
              {video.videoUrl && (
                <>
                  <button
                    onClick={handleEnlarge}
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
                  <button
                    onClick={handleFullscreen}
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
                    Fullscreen
                  </button>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.062 18 15.518 18 16c0 .482.114.938.316 1.342m0-2.684a3 3 0 100 2.684M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Share
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                  <FacebookShareButton url={shareUrl} title={shareTitle} className="w-full">
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
                      <FacebookIcon size={20} round />
                      <span className="text-sm">Facebook</span>
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={shareTitle} className="w-full">
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
                      <TwitterIcon size={20} round />
                      <span className="text-sm">Twitter</span>
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl} title={shareTitle} className="w-full">
                    <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
                      <WhatsappIcon size={20} round />
                      <span className="text-sm">WhatsApp</span>
                    </div>
                  </WhatsappShareButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEnlarged && video.videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleEnlarge}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close enlarged view"
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
            <video
              src={video.videoUrl}
              className="w-full rounded"
              controls
              autoPlay
              playsInline
            />
            <p className="text-white text-center mt-4 text-lg">{video.title}</p>
          </div>
        </div>
      )}
    </>
  );
};