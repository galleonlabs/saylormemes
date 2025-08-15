import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMediaFiltering } from '../useMediaFiltering';
import { Video, Photo } from '../../types';

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Bitcoin Conference Speech',
    url: 'video1.mp4',
    tags: ['bitcoin', 'conference'],
    isPlaying: false,
  },
  {
    id: '2',
    title: 'MicroStrategy Quarterly Report',
    url: 'video2.mp4',
    tags: ['microstrategy', 'quarterly'],
    isPlaying: false,
  },
  {
    id: '3',
    title: 'Bitcoin Fundamentals',
    url: 'video3.mp4',
    tags: ['bitcoin', 'education'],
    isPlaying: false,
  },
];

const mockPhotos: Photo[] = [
  {
    id: '1',
    title: 'Saylor Meme Classic',
    url: 'photo1.jpg',
    tags: ['meme', 'classic'],
  },
  {
    id: '2',
    title: 'Bitcoin Chart Analysis',
    url: 'photo2.jpg',
    tags: ['bitcoin', 'chart'],
  },
  {
    id: '3',
    title: 'Conference Photo',
    url: 'photo3.jpg',
    tags: ['conference', 'professional'],
  },
];

describe('useMediaFiltering', () => {
  it('should return all videos when no filters applied', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', '', 'all')
    );

    expect(result.current.filteredContent).toEqual(mockVideos);
    expect(result.current.availableTags).toEqual(['bitcoin', 'conference', 'education', 'microstrategy', 'quarterly']);
  });

  it('should return all photos when media type is photos', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'photos', '', 'all')
    );

    expect(result.current.filteredContent).toEqual(mockPhotos);
    expect(result.current.availableTags).toEqual(['bitcoin', 'chart', 'classic', 'conference', 'meme', 'professional']);
  });

  it('should filter content by search query', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', 'bitcoin', 'all')
    );

    const expectedVideos = mockVideos.filter(video => 
      video.title.toLowerCase().includes('bitcoin')
    );
    
    expect(result.current.filteredContent).toEqual(expectedVideos);
    expect(result.current.filteredContent).toHaveLength(2);
  });

  it('should filter content by tag', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', '', 'bitcoin')
    );

    const expectedVideos = mockVideos.filter(video => 
      video.tags.includes('bitcoin')
    );
    
    expect(result.current.filteredContent).toEqual(expectedVideos);
    expect(result.current.filteredContent).toHaveLength(2);
  });

  it('should filter content by both search query and tag', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', 'conference', 'bitcoin')
    );

    const expectedVideos = mockVideos.filter(video => 
      video.title.toLowerCase().includes('conference') && video.tags.includes('bitcoin')
    );
    
    expect(result.current.filteredContent).toEqual(expectedVideos);
    expect(result.current.filteredContent).toHaveLength(1);
    expect(result.current.filteredContent[0].title).toBe('Bitcoin Conference Speech');
  });

  it('should return empty array when no content matches filters', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', 'nonexistent', 'all')
    );

    expect(result.current.filteredContent).toEqual([]);
    expect(result.current.filteredContent).toHaveLength(0);
  });

  it('should handle case-insensitive search', () => {
    const { result } = renderHook(() =>
      useMediaFiltering(mockVideos, mockPhotos, 'videos', 'BITCOIN', 'all')
    );

    expect(result.current.filteredContent).toHaveLength(2);
  });

  it('should return unique and sorted available tags', () => {
    const videosWithDuplicateTags: Video[] = [
      {
        id: '1',
        title: 'Video 1',
        url: 'video1.mp4',
        tags: ['bitcoin', 'conference', 'bitcoin'], // duplicate tag
        isPlaying: false,
      },
    ];

    const { result } = renderHook(() =>
      useMediaFiltering(videosWithDuplicateTags, [], 'videos', '', 'all')
    );

    expect(result.current.availableTags).toEqual(['bitcoin', 'conference']);
    expect(result.current.availableTags).toHaveLength(2);
  });
});