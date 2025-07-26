import { useMemo } from 'react';
import { Video, Photo, MediaType } from '../types';

export const useMediaFiltering = (
  videos: Video[],
  photos: Photo[],
  mediaType: MediaType,
  searchQuery: string,
  activeFilter: string
) => {
  const filteredContent = useMemo(() => {
    const content = mediaType === 'videos' ? videos : photos;
    
    return content.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || 
        item.tags.includes(activeFilter);
      
      return matchesSearch && matchesFilter;
    });
  }, [videos, photos, mediaType, searchQuery, activeFilter]);

  const availableTags = useMemo(() => {
    const content = mediaType === 'videos' ? videos : photos;
    const tagSet = new Set<string>();
    
    content.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }, [videos, photos, mediaType]);

  return {
    filteredContent,
    availableTags
  };
};