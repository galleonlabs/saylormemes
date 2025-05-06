# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaylorMemes is a React TypeScript web application built with Vite that showcases Michael Saylor memes (videos and photos). The application uses Firebase for hosting, storage, and analytics. It features a streamlined user interface with search and filtering capabilities, responsive design for mobile and desktop, and optimized asset loading with thumbnail-first approach.

## Commands

### Development
- **Run development server**: `npm run dev`
- **Build the project**: `npm run build`
- **Lint the code**: `npm run lint`
- **Preview production build**: `npm run preview`
- **Deploy to Firebase**: `npm run deploy`

### Firebase Commands
- **Deploy Firebase Functions**: `cd functions && npm run deploy`
- **Deploy only hosting**: `firebase deploy --only hosting`

## Architecture

### Frontend
- **React + TypeScript**: Built with React 18 and TypeScript
- **Vite**: Used as the build tool and development server
- **Tailwind CSS**: Used for styling the application with custom components and animations
- **React Router**: Handles routing (currently only a single route)
- **React Share**: Provides social media sharing buttons (Twitter, Facebook, WhatsApp)

### Backend Services (Firebase)
- **Firebase Storage**: Stores video and photo assets
  - Videos are stored with metadata (title, tags)
  - Thumbnails are stored alongside videos (video.mp4 has video.png as thumbnail)
- **Firebase Analytics**: Tracks user interactions like playing videos, viewing photos, and filtering
- **Firebase Hosting**: Deploys and serves the application

### App Structure
1. The main App component manages state for:
   - Videos and photos fetched from Firebase Storage
   - Loading states
   - Video player functionality
   - UI toggling between videos and photos
   - Search and filtering functionality
   - Enlarged/modal view states

2. Asset Caching:
   - Videos and photos are cached in sessionStorage for better performance
   - Video URLs are lazy-loaded on demand to reduce initial load time

3. Asset Management:
   - Utilities in `src/scripts/` handle metadata operations on Firebase Storage assets
   - `metadata.cjs`: Sets metadata on video files (title, tags)
   - `retrieveMetadata.cjs`: Retrieves metadata from video files

## Key Features

### Video Display
- Thumbnail-first approach for faster loading
- Lazy-loading of video content only when played
- Player controls with play/pause, fullscreen, and enlarge options
- Video metadata display (title, tags)
- Error handling for video playback

### Photo Display
- Consistent grid layout with equal-sized cards
- Automatic aspect ratio handling for portrait and landscape images
- Full-screen modal view for enlarged photos
- Download functionality
- Photo metadata display (title, tags)

### Search and Filtering
- Free text search in content titles
- Tag-based filtering
- Visual feedback for empty search results
- Tag chips for easy selection

### UI/UX
- Responsive design that works on mobile, tablet, and desktop
- Animated card layout with staggered reveal
- Consistent styling with Bitcoin-themed colors
- Smooth transitions and hover effects
- Loading spinners for async operations
- Modern card-based interface with consistent spacing

## Data Structure

### Video Object
```typescript
{
  thumbnailUrl: string,     // URL to the thumbnail image
  title: string,            // Video title from metadata
  videoUrl: string,         // Initially empty, populated when played
  fileName: string,         // Original filename in storage
  isPlaying: boolean,       // Play state
  tags: string[]            // Array of tags from metadata
}
```

### Photo Object
```typescript
{
  url: string,              // URL to the photo
  title: string,            // Photo title from metadata or filename
  tags: string[]            // Array of tags from metadata
}
```

## Development Notes

- Environment variables for Firebase are stored in `.env` files (not committed to the repo)
- Firebase Functions is set up but not currently implemented
- The project uses Firebase configuration from environment variables configured in Vite
- Videos are fetched lazily, with thumbnails loading first and video content only when played
- Search and filtering are performed client-side (no server-side search)
- Tag metadata should be added to Firebase Storage items using the `metadata.cjs` script
- All UI animations are handled with CSS classes and Tailwind configurations
- WSL users may encounter TypeScript/esbuild issues related to architecture differences - troubleshoot by reinstalling node modules in WSL environment

## Common Tasks

### Adding New Videos
1. Upload video file (mp4) to Firebase Storage in the videos/ folder
2. Create and upload a thumbnail image (png) with the same name
3. Set metadata on the video file using the `metadata.cjs` script (modify the file path in the script)
4. Set at minimum the title metadata, and optionally add tags as a comma-separated string

### Adding Tags to Content
1. Modify the `metadata.cjs` script to point to the correct file
2. Add tags as a comma-separated string in the metadata.tags field
3. Run the script to update metadata

### Styling Changes
- Most styling is done with Tailwind classes in the component JSX
- Global styles are in `src/App.css` and `src/index.css`
- Tailwind configuration is in `tailwind.config.cjs`
- Custom animations are defined in CSS files and configured in Tailwind