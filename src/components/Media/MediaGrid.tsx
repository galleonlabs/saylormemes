import React from 'react';
import { Video, Photo, MediaType } from '../../types';
import { VideoCard } from './VideoCard';
import { PhotoCard } from './PhotoCard';

interface MediaGridProps {
  mediaType: MediaType;
  videos: Video[];
  photos: Photo[];
  onLoadVideo: (fileName: string) => Promise<string>;
  onTogglePlay: (index: number) => void;
  onEnlargePhoto: (photo: Photo) => void;
  logAnalyticsEvent: (eventName: string, parameters?: any) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  mediaType,
  videos,
  photos,
  onLoadVideo,
  onTogglePlay,
  onEnlargePhoto,
  logAnalyticsEvent,
}) => {
  return (
    <div className="space-y-0">
      {mediaType === 'videos' ? (
        videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onLoadVideo={onLoadVideo}
            onTogglePlay={onTogglePlay}
            logAnalyticsEvent={logAnalyticsEvent}
          />
        ))
      ) : (
        photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onEnlarge={onEnlargePhoto}
          />
        ))
      )}
    </div>
  );
};