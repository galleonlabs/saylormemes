import { useState, useEffect, useCallback } from 'react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from '../firebase';
import { Video, Photo } from '../types';

export const useFirebaseStorage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const cachedVideos = sessionStorage.getItem('saylorVideos');
      if (cachedVideos) {
        const parsedVideos = JSON.parse(cachedVideos);
        setVideos(parsedVideos);
        return parsedVideos;
      }

      const videosRef = ref(storage, 'videos');
      const videoList = await listAll(videosRef);
      
      const videoPromises = videoList.items
        .filter(item => item.name.endsWith('.mp4'))
        .map(async (item) => {
          const thumbnailName = item.name.replace('.mp4', '.png');
          const thumbnailRef = ref(storage, `videos/${thumbnailName}`);
          
          try {
            const [thumbnailUrl, metadata] = await Promise.all([
              getDownloadURL(thumbnailRef),
              getMetadata(item)
            ]);

            const title = metadata.customMetadata?.title || item.name.replace('.mp4', '');
            const tags = metadata.customMetadata?.tags
              ? metadata.customMetadata.tags.split(',').map(tag => tag.trim())
              : [];

            return {
              id: item.name,
              thumbnailUrl,
              title,
              videoUrl: '',
              fileName: item.name,
              isPlaying: false,
              tags
            };
          } catch (err) {
            console.error(`Error fetching thumbnail for ${item.name}:`, err);
            return null;
          }
        });

      const fetchedVideos = (await Promise.all(videoPromises)).filter(Boolean) as Video[];
      sessionStorage.setItem('saylorVideos', JSON.stringify(fetchedVideos));
      setVideos(fetchedVideos);
      return fetchedVideos;
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
      return [];
    }
  };

  const fetchPhotos = async () => {
    try {
      const cachedPhotos = sessionStorage.getItem('saylorPhotos');
      if (cachedPhotos) {
        const parsedPhotos = JSON.parse(cachedPhotos);
        setPhotos(parsedPhotos);
        return parsedPhotos;
      }

      const photosRef = ref(storage, 'photos');
      const photoList = await listAll(photosRef);
      
      const photoPromises = photoList.items.map(async (item) => {
        try {
          const [url, metadata] = await Promise.all([
            getDownloadURL(item),
            getMetadata(item)
          ]);

          const title = metadata.customMetadata?.title || 
                       item.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
          const tags = metadata.customMetadata?.tags
            ? metadata.customMetadata.tags.split(',').map(tag => tag.trim())
            : [];

          return {
            id: item.name,
            url,
            title,
            tags
          };
        } catch (err) {
          console.error(`Error fetching photo ${item.name}:`, err);
          return null;
        }
      });

      const fetchedPhotos = (await Promise.all(photoPromises)).filter(Boolean) as Photo[];
      sessionStorage.setItem('saylorPhotos', JSON.stringify(fetchedPhotos));
      setPhotos(fetchedPhotos);
      return fetchedPhotos;
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos');
      return [];
    }
  };

  const loadVideoUrl = useCallback(async (fileName: string): Promise<string> => {
    const videoRef = ref(storage, `videos/${fileName}`);
    const url = await getDownloadURL(videoRef);
    
    setVideos(prevVideos => {
      const updatedVideos = prevVideos.map(v => 
        v.fileName === fileName ? { ...v, videoUrl: url } : v
      );
      sessionStorage.setItem('saylorVideos', JSON.stringify(updatedVideos));
      return updatedVideos;
    });
    
    return url;
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      await Promise.all([fetchVideos(), fetchPhotos()]);
      setIsLoading(false);
    };

    loadContent();
  }, []);

  return {
    videos,
    photos,
    isLoading,
    error,
    loadVideoUrl,
    setVideos
  };
};