import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFirebaseStorage } from '../useFirebaseStorage';
import * as firebaseStorage from 'firebase/storage';

// Mock Firebase functions - define them correctly for vitest
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  listAll: vi.fn(),
  getDownloadURL: vi.fn(),
  getMetadata: vi.fn(),
}));

vi.mock('../../firebase', () => ({
  storage: {},
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const mockVideoItems = [
  { name: 'video1.mp4' },
  { name: 'video2.mp4' },
  { name: 'not-a-video.txt' }, // Should be filtered out
];

const mockPhotoItems = [
  { name: 'photo1.jpg' },
  { name: 'photo2.png' },
];

const mockVideoMetadata = {
  customMetadata: {
    title: 'Test Video',
    tags: 'bitcoin, conference',
  },
};

const mockPhotoMetadata = {
  customMetadata: {
    title: 'Test Photo',
    tags: 'meme, classic',
  },
};

describe('useFirebaseStorage', () => {
  const mockListAll = vi.mocked(firebaseStorage.listAll);
  const mockGetDownloadURL = vi.mocked(firebaseStorage.getDownloadURL);
  const mockGetMetadata = vi.mocked(firebaseStorage.getMetadata);
  const mockRef = vi.mocked(firebaseStorage.ref);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useFirebaseStorage());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.videos).toEqual([]);
    expect(result.current.photos).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should return cached videos and photos if available', async () => {
    const cachedVideos = [
      {
        id: 'video1.mp4',
        title: 'Cached Video',
        thumbnailUrl: 'thumb1.png',
        videoUrl: '',
        fileName: 'video1.mp4',
        isPlaying: false,
        tags: ['bitcoin'],
      },
    ];
    
    const cachedPhotos = [
      {
        id: 'photo1.jpg',
        title: 'Cached Photo',
        url: 'photo1.jpg',
        tags: ['meme'],
      },
    ];

    mockSessionStorage.getItem
      .mockReturnValueOnce(JSON.stringify(cachedVideos))
      .mockReturnValueOnce(JSON.stringify(cachedPhotos));

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.videos).toEqual(cachedVideos);
    expect(result.current.photos).toEqual(cachedPhotos);
  });

  it('should fetch videos and photos from Firebase when no cache', async () => {
    mockRef.mockReturnValue({});
    mockListAll
      .mockResolvedValueOnce({ items: mockVideoItems })
      .mockResolvedValueOnce({ items: mockPhotoItems });
    
    mockGetDownloadURL
      .mockResolvedValueOnce('thumbnail1.png')
      .mockResolvedValueOnce('thumbnail2.png')
      .mockResolvedValueOnce('photo1.jpg')
      .mockResolvedValueOnce('photo2.png');

    mockGetMetadata
      .mockResolvedValueOnce(mockVideoMetadata)
      .mockResolvedValueOnce(mockVideoMetadata)
      .mockResolvedValueOnce(mockPhotoMetadata)
      .mockResolvedValueOnce(mockPhotoMetadata);

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.videos).toHaveLength(2);
    expect(result.current.photos).toHaveLength(2);
    expect(result.current.videos[0].title).toBe('Test Video');
    expect(result.current.videos[0].tags).toEqual(['bitcoin', 'conference']);
  });

  it('should handle errors when fetching from Firebase', async () => {
    mockRef.mockReturnValue({});
    mockListAll.mockRejectedValueOnce(new Error('Firebase error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load videos');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should load video URL and update state', async () => {
    const cachedVideos = [
      {
        id: 'video1.mp4',
        title: 'Test Video',
        thumbnailUrl: 'thumb1.png',
        videoUrl: '',
        fileName: 'video1.mp4',
        isPlaying: false,
        tags: ['bitcoin'],
      },
    ];

    mockSessionStorage.getItem
      .mockReturnValueOnce(JSON.stringify(cachedVideos))
      .mockReturnValueOnce('[]');

    mockGetDownloadURL.mockResolvedValueOnce('video1.mp4');

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const videoUrl = await result.current.loadVideoUrl('video1.mp4');

    expect(videoUrl).toBe('video1.mp4');
    expect(result.current.videos[0].videoUrl).toBe('video1.mp4');
  });

  it('should filter out non-MP4 files when fetching videos', async () => {
    mockRef.mockReturnValue({});
    mockListAll.mockResolvedValueOnce({ items: mockVideoItems });

    mockGetDownloadURL
      .mockResolvedValueOnce('thumbnail1.png')
      .mockResolvedValueOnce('thumbnail2.png');

    mockGetMetadata
      .mockResolvedValueOnce(mockVideoMetadata)
      .mockResolvedValueOnce(mockVideoMetadata);

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should only have 2 videos (filtered out not-a-video.txt)
    expect(result.current.videos).toHaveLength(2);
    expect(result.current.videos.every(v => v.fileName.endsWith('.mp4'))).toBe(true);
  });

  it('should handle missing metadata gracefully', async () => {
    const itemsWithoutMetadata = [{ name: 'video1.mp4' }];
    
    mockRef.mockReturnValue({});
    mockListAll
      .mockResolvedValueOnce({ items: itemsWithoutMetadata })
      .mockResolvedValueOnce({ items: [] });
    
    mockGetDownloadURL.mockResolvedValueOnce('thumbnail1.png');
    mockGetMetadata.mockResolvedValueOnce({}); // No customMetadata

    const { result } = renderHook(() => useFirebaseStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.videos).toHaveLength(1);
    expect(result.current.videos[0].title).toBe('video1'); // Fallback to filename
    expect(result.current.videos[0].tags).toEqual([]); // Empty tags array
  });
});