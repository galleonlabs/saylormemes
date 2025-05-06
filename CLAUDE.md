# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaylorMemes is a React TypeScript web application built with Vite that showcases Michael Saylor memes (videos and photos). The application uses Firebase for hosting, storage, and analytics.

## Commands

### Development
- **Run development server**: `npm run dev`
- **Build the project**: `npm run build`
- **Lint the code**: `npm run lint`
- **Preview production build**: `npm run preview`
- **Deploy to Firebase**: `npm run deploy`

## Architecture

### Frontend
- **React + TypeScript**: Built with React 18 and TypeScript
- **Vite**: Used as the build tool and development server
- **Tailwind CSS**: Used for styling the application
- **React Router**: Handles routing (currently only a single route)
- **React Share**: Provides social media sharing buttons

### Backend Services (Firebase)
- **Firebase Storage**: Stores video and photo assets
  - Videos are stored with metadata (title)
  - Thumbnails are stored alongside videos (video.mp4 has video.png as thumbnail)
- **Firebase Analytics**: Tracks user interactions like playing videos
- **Firebase Hosting**: Deploys and serves the application

### App Structure
1. The main App component manages state for:
   - Videos and photos fetched from Firebase Storage
   - Loading states
   - Video player functionality
   - UI toggling between videos and photos

2. Asset Caching:
   - Videos and photos are cached in sessionStorage for better performance

3. Asset Management:
   - Utilities in `src/scripts/` handle metadata operations on Firebase Storage assets
   - `metadata.cjs`: Sets metadata on video files
   - `retrieveMetadata.cjs`: Retrieves metadata from video files

## Development Notes

- Environment variables for Firebase are stored in `.env` files (not committed to the repo)
- Firebase Functions is set up but not currently implemented
- The project uses Firebase configuration from environment variables configured in Vite
- Videos are fetched lazily, with thumbnails loading first and video content only when played