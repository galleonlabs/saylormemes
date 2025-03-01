import { useState, useEffect, useCallback } from 'react';
import { storage, analytics } from './main';
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { logEvent } from 'firebase/analytics';
import { TwitterShareButton, FacebookShareButton, WhatsappShareButton } from 'react-share';
import { TwitterIcon, FacebookIcon, WhatsappIcon } from 'react-share';
import saylor from './assets/saylor.jpg'
import btc from './assets/btc.png'

// Simple types for our data
type ContentType = 'videos' | 'photos';

interface VideoItem {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
}

function App() {
  // State
  const [contentType, setContentType] = useState<ContentType>('videos');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  // Fetch videos from Firebase
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    
    try {
      // Try to use cache first
      const cachedVideos = sessionStorage.getItem('saylor_videos');
      if (cachedVideos) {
        setVideos(JSON.parse(cachedVideos));
        setLoading(false);
        return;
      }
      
      // Fetch from Firebase
      const videoList: VideoItem[] = [];
      const videosRef = ref(storage, 'videos/');
      const result = await listAll(videosRef);
      
      // Get video files (mp4) and their thumbnails (png)
      const videoFiles = result.items.filter(item => item.name.endsWith('.mp4'));
      
      for (const videoRef of videoFiles) {
        try {
          // Get video metadata for title
          const metadata = await getMetadata(videoRef);
          const title = metadata.customMetadata?.title || videoRef.name.replace('.mp4', '');
          
          // Get thumbnail URL (replacing .mp4 with .png)
          const thumbnailName = videoRef.name.replace('.mp4', '.png');
          const thumbnailRef = ref(storage, `videos/${thumbnailName}`);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          
          // Add to video list (we'll lazy-load the actual video URL when needed)
          videoList.push({
            id: videoRef.name,
            thumbnailUrl,
            videoUrl: '', // Lazy-loaded on demand
            title
          });
        } catch (error) {
          console.error(`Error processing video ${videoRef.name}:`, error);
        }
      }
      
      // Save to state and cache
      setVideos(videoList);
      sessionStorage.setItem('saylor_videos', JSON.stringify(videoList));
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch photos from Firebase
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    
    try {
      // Try to use cache first
      const cachedPhotos = sessionStorage.getItem('saylor_photos');
      if (cachedPhotos) {
        setPhotos(JSON.parse(cachedPhotos));
        setLoading(false);
        return;
      }
      
      // Fetch from Firebase
      const photosRef = ref(storage, 'photos/');
      const result = await listAll(photosRef);
      
      // Get download URLs for all photos
      const photoUrls = await Promise.all(
        result.items.map(item => getDownloadURL(item))
      );
      
      // Save to state and cache
      setPhotos(photoUrls);
      sessionStorage.setItem('saylor_photos', JSON.stringify(photoUrls));
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load videos on initial render
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  
  // Handle tab switching
  useEffect(() => {
    // Reset active item when switching tabs
    setActiveItem(null);
    
    // Load photos if needed
    if (contentType === 'photos' && photos.length === 0) {
      fetchPhotos();
    }
  }, [contentType, photos.length, fetchPhotos]);
  
  // Handle playing a video
  const playVideo = async (videoId: string) => {
    try {
      // If already active, close it
      if (activeItem === videoId) {
        setActiveItem(null);
        return;
      }
      
      // Set as active
      setActiveItem(videoId);
      
      // Find the video in our list
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) return;
      
      // If video URL not yet loaded, get it now
      if (!videos[videoIndex].videoUrl) {
        const videoRef = ref(storage, `videos/${videoId}`);
        const url = await getDownloadURL(videoRef);
        
        // Update video in state with URL
        const updatedVideos = [...videos];
        updatedVideos[videoIndex] = {
          ...updatedVideos[videoIndex],
          videoUrl: url
        };
        setVideos(updatedVideos);
        
        // Update cache
        sessionStorage.setItem('saylor_videos', JSON.stringify(updatedVideos));
      }
      
      // Log analytics
      logEvent(analytics, 'play_video', { video: videos[videoIndex].title });
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };
  
  // Handle viewing a photo
  const viewPhoto = (photoUrl: string) => {
    // If already active, close it
    if (activeItem === photoUrl) {
      setActiveItem(null);
      return;
    }
    
    // Set as active
    setActiveItem(photoUrl);
    
    // Log analytics
    logEvent(analytics, 'view_photo', { photo: photoUrl });
  };
  
  // Handle download for photos
  const downloadPhoto = (photoUrl: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = photoUrl;
    link.target = '_blank';
    
    // Generate a filename from the URL
    const filename = photoUrl.split('/').pop() || 'saylor-meme.jpg';
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log analytics
    logEvent(analytics, 'download_photo', { photo: photoUrl });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex justify-center -space-x-4">
            <div className="relative z-10 overflow-hidden w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-btc shadow-lg bg-white p-1 transition-all duration-300 hover:scale-110 hover:rotate-6 animate-float" style={{ animationDelay: '0.5s' }}>
              <img 
                src={saylor} 
                alt="Michael Saylor" 
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            <div className="relative z-0 overflow-hidden w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-btc shadow-lg bg-white p-1 transition-all duration-300 hover:scale-110 hover:-rotate-6 animate-float">
              <img 
                src={btc} 
                alt="Bitcoin logo" 
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
          </div>
          
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight text-shadow-sm">
            <span className="text-btc animate-pulse-btc inline-block">saylor</span> memes
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            high-quality, hand-picked, organic saylor content
          </p>
          
          {/* Social Share Buttons */}
          <div className="mt-4 flex justify-center space-x-2">
            <TwitterShareButton
              url={'https://saylormemes.com'}
              title={'Top-tier @saylor memes'}
              className="transition-transform duration-300 hover:scale-110">
              <TwitterIcon size={36} round />
            </TwitterShareButton>
            <FacebookShareButton
              url={'https://saylormemes.com'}
              title={'Top-tier saylor memes'}
              className="transition-transform duration-300 hover:scale-110">
              <FacebookIcon size={36} round />
            </FacebookShareButton>
            <WhatsappShareButton
              url={'https://saylormemes.com'}
              title={'Top-tier saylor memes'}
              className="transition-transform duration-300 hover:scale-110">
              <WhatsappIcon size={36} round />
            </WhatsappShareButton>
          </div>
        </header>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg p-1 bg-gray-200 shadow-inner">
            <button
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                contentType === 'videos' 
                  ? 'bg-white shadow text-btc font-semibold'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
              onClick={() => setContentType('videos')}
            >
              videos
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                contentType === 'photos' 
                  ? 'bg-white shadow text-btc font-semibold'
                  : 'hover:bg-white/50 text-gray-600'
              }`}
              onClick={() => setContentType('photos')}
            >
              photos
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <main className="pb-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-btc/20 border-t-btc animate-spin"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-btc/60 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-4 text-lg text-btc/80">Loading {contentType}...</p>
            </div>
          ) : contentType === 'videos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-lg text-gray-500">No videos found</p>
                </div>
              ) : (
                videos.map(video => (
                  <div 
                    key={video.id}
                    className={`
                      rounded-lg overflow-hidden bg-white shadow card-hover
                      ${activeItem === video.id
                        ? 'border-2 border-btc/70 shadow-lg ring-2 ring-btc/30 transform scale-[1.02]'
                        : 'border border-gray-200'
                      }
                    `}
                  >
                    {/* Video Display */}
                    <div 
                      className="relative cursor-pointer overflow-hidden aspect-video bg-black"
                      onClick={() => playVideo(video.id)}
                    >
                      {activeItem === video.id && video.videoUrl ? (
                        <video
                          className="w-full h-full object-contain"
                          src={video.videoUrl}
                          autoPlay
                          controls
                          playsInline
                          controlsList="nodownload"
                          onEnded={() => setActiveItem(null)}
                        />
                      ) : (
                        <>
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-btc/70 rounded-full p-4 shadow-lg transform transition-transform duration-300 hover:scale-110">
                              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                                <path fill="currentColor" d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Video Title & Controls */}
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-center truncate mb-2">
                        {video.title}
                      </h3>
                      
                      <div className="flex justify-center">
                        <button
                          className={`
                            px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                            ${activeItem === video.id
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-btc text-white hover:bg-btc-600'
                            }
                          `}
                          onClick={() => playVideo(video.id)}
                        >
                          {activeItem === video.id ? 'stop' : 'play'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-lg text-gray-500">No photos found</p>
                </div>
              ) : (
                photos.map((photoUrl, index) => (
                  <div 
                    key={photoUrl}
                    className={`
                      rounded-lg overflow-hidden bg-white shadow card-hover
                      ${activeItem === photoUrl
                        ? 'border-2 border-btc/70 shadow-lg ring-2 ring-btc/30 transform scale-[1.02]'
                        : 'border border-gray-200'
                      }
                    `}
                  >
                    {/* Photo Display */}
                    <div 
                      className={`
                        relative cursor-pointer overflow-hidden 
                        ${activeItem === photoUrl ? 'max-h-none' : 'aspect-square'}
                      `}
                      onClick={() => viewPhoto(photoUrl)}
                    >
                      <img
                        src={photoUrl}
                        alt={`Saylor meme ${index}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      {!activeItem && (
                        <div className="absolute bottom-2 right-2 bg-btc/70 rounded-full p-1.5 shadow-sm opacity-70 hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 8V6a3 3 0 013-3h8a3 3 0 013 3v8a3 3 0 01-3 3H9a3 3 0 01-3-3h1a2 2 0 002 2h5a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2h1z" />
                            <path d="M5 10V8H1v8a3 3 0 003 3h8a3 3 0 01-3-3H6a1 1 0 01-1-1v-5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Photo Controls */}
                    <div className="p-3">
                      <div className="flex justify-center space-x-3">
                        <button
                          className={`
                            px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                            ${activeItem === photoUrl
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-btc/90 text-white hover:bg-btc'
                            }
                          `}
                          onClick={() => viewPhoto(photoUrl)}
                        >
                          {activeItem === photoUrl ? 'close' : 'view'}
                        </button>
                        
                        <button
                          className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                          onClick={() => downloadPhoto(photoUrl)}
                        >
                          download
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className=" bottom-4 inset-x-0 text-center">
          <p className="text-sm text-gray-500">
            created by <a href="https://twitter.com/davyjones0x" target="_blank" rel="noreferrer" className="text-btc/90 hover:text-btc font-medium">@davyjones0x</a> <span className="text-gray-400">(send me saylor memes)</span>
          </p>
        </footer>
        
        {/* Bitcoin watermark */}
        <div className="fixed bottom-0 right-0 opacity-[0.03] pointer-events-none z-[-1]">
          <svg className="w-64 h-64 text-btc animate-bitcoin-spin" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.5 11.5v-2.5c1.75 0 2.5.75 2.5 2.5h2.5c0-2.5-1.75-4.25-5-4.5v-2h-2v2c-1.5.25-2.5.75-3.25 1.5-.75.75-1 1.75-1 2.75 0 1.75.75 2.75 1.5 3.25.75.5 1.75 1 2.75 1.25v3c-1 0-2-.25-2.5-1-.5-.75-.5-1.5-.5-2h-2.5c0 1 0 2 .5 3s1.25 1.75 2.5 2.25v2h2v-2c3.5-.5 5.25-2.5 5.25-5.25 0-1.5-.5-2.75-1.5-3.5-1-.75-2-.75-3.25-1zm-1.5 2.75c-.5-.25-.75-.5-.75-1.25 0-.75.75-1.25 1.5-1.25v2.5h-.75zm3.75 4c0 1-.75 1.75-2.25 2v-3c.5.25 1 .25 1.5.5.5.25.75.75.75 1.5z"/>
          </svg>
        </div>
        
        {/* Bitcoin grain overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[-1]" 
             style={{ 
               backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11.5 11.5v-2.5c1.75 0 2.5.75 2.5 2.5h2.5c0-2.5-1.75-4.25-5-4.5v-2h-2v2c-1.5.25-2.5.75-3.25 1.5-.75.75-1 1.75-1 2.75 0 1.75.75 2.75 1.5 3.25.75.5 1.75 1 2.75 1.25v3c-1 0-2-.25-2.5-1-.5-.75-.5-1.5-.5-2h-2.5c0 1 0 2 .5 3s1.25 1.75 2.5 2.25v2h2v-2c3.5-.5 5.25-2.5 5.25-5.25 0-1.5-.5-2.75-1.5-3.5-1-.75-2-.75-3.25-1zm-1.5 2.75c-.5-.25-.75-.5-.75-1.25 0-.75.75-1.25 1.5-1.25v2.5h-.75zm3.75 4c0 1-.75 1.75-2.25 2v-3c.5.25 1 .25 1.5.5.5.25.75.75.75 1.5z\' fill=\'%23FF9900\' fill-opacity=\'0.3\' transform=\'rotate(30 50 50) scale(0.25)\' /%3E%3C/svg%3E")',
               backgroundSize: '150px 150px'
             }}
        ></div>
      </div>
    </div>
  );
}

export default App;