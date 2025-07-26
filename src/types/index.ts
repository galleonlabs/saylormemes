export interface Video {
  id: string;
  thumbnailUrl: string;
  title: string;
  videoUrl: string;
  fileName: string;
  isPlaying: boolean;
  tags: string[];
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  tags: string[];
}

export type MediaType = 'videos' | 'photos';

export interface Dimensions {
  width: number;
  height: number;
}