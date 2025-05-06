import './App.css'
import saylor from './assets/saylor.jpg'
import btc from './assets/btc.png'
import { useEffect, useRef, useState } from 'react';
import { storage } from './main';
import { ref, listAll, getDownloadURL, getMetadata, StorageReference } from "firebase/storage";
import { logEvent } from 'firebase/analytics';
import { analytics } from './main';
import { TwitterShareButton, FacebookShareButton, TwitterIcon, FacebookIcon, WhatsappIcon, WhatsappShareButton } from 'react-share';

function App() {
  const [videos, setVideos] = useState<any[]>([]);
  const videoRefs = useRef<any[]>([]);
  const [enlarged, setEnlarged] = useState(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoDimensions, setVideoDimensions] = useState<{ [key: number]: { height: number, width: number } }>({});
  // We'll use direct DOM manipulation for photo dimensions
  const [currentSelection, setCurrentSelection] = useState('videos');
  const [photos, setPhotos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchVideoData = async (itemRef: StorageReference) => {
    try {
      const thumbnailName = itemRef.name.replace('.mp4', '.png');
      const thumbnailUrl = await getDownloadURL(ref(storage, `videos/${thumbnailName}`));
  
      const metadata = await getMetadata(itemRef);
      return {
        thumbnailUrl,
        title: metadata.customMetadata?.title || 'Untitled',
        videoUrl: '',
        fileName: itemRef.name,
        isPlaying: false,
        tags: metadata.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : ['uncategorized'],
      };
    } catch (error) {
      console.error(`Error fetching data for ${itemRef.name}:`, error);
      return null;
    }
  };

  const fetchPhotos = async () => {
    setIsLoading(true);
    const cachedPhotos = sessionStorage.getItem('photos');
    if (cachedPhotos) {
      setPhotos(JSON.parse(cachedPhotos));
      setIsLoading(false);
    } else {
      try {
        const listRef = ref(storage, 'photos/');
        const res = await listAll(listRef);
        
        // Get both URLs and metadata in parallel
        const fetchPromises = res.items.map(async (fileRef) => {
          const url = await getDownloadURL(fileRef);
          try {
            const metadata = await getMetadata(fileRef);
            return { 
              url, 
              title: metadata.customMetadata?.title || fileRef.name,
              tags: metadata.customMetadata?.tags ? metadata.customMetadata.tags.split(',') : ['uncategorized'],
            };
          } catch (error) {
            return { url, title: fileRef.name, tags: ['uncategorized'] };
          }
        });
        
        const photoList = await Promise.all(fetchPromises);
        setPhotos(photoList);
        sessionStorage.setItem('photos', JSON.stringify(photoList));
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    const cachedVideos = sessionStorage.getItem('videos');
    if (cachedVideos) {
      setVideos(JSON.parse(cachedVideos));
      setIsLoading(false);
    } else {
      try {
        const listRef = ref(storage, 'videos/');
        const res = await listAll(listRef);
        const fetchPromises = res.items
          .filter(x => x.name.includes('.mp4'))
          .map(fetchVideoData);
        
        const videoList = (await Promise.all(fetchPromises)).filter(Boolean);
        setVideos(videoList);
        sessionStorage.setItem('videos', JSON.stringify(videoList));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (currentSelection === 'photos' && photos.length === 0) {
      fetchPhotos();
    }
    if (currentSelection === 'videos') {
      fetchVideos();
    }
  }, [currentSelection]);

  const togglePlay = (index: number) => {
    const videoToUpdate = videos[index];
  
    if (!videoToUpdate.videoUrl || !videoRefs.current[index].src) {
      logAnalyticsEvent('load_video', { video: videoToUpdate.title });
      getDownloadURL(ref(storage, `videos/${videoToUpdate.fileName}`)).then(url => {
        const updatedVideo = { ...videoToUpdate, videoUrl: url, isPlaying: true };
        updateVideo(index, updatedVideo);
        playVideo(index, updatedVideo);
      }).catch(error => console.error('Error fetching video URL:', error));
    } else {
      const updatedVideo = { ...videoToUpdate, isPlaying: !videoToUpdate.isPlaying };
      updateVideo(index, updatedVideo);
      playOrPauseVideo(index, updatedVideo);
    }
  };

  const updateVideo = (index: number, updatedVideo: any) => {
    setVideos(prevVideos => prevVideos.map((video, idx) => idx === index ? updatedVideo : video));
    updateSessionStorageVideos(index, { ...updatedVideo, isPlaying: false });
  };

  const updateSessionStorageVideos = (index: number, updatedVideo: any) => {
    const cachedVideos = sessionStorage.getItem('videos');
    if (cachedVideos) {
      const videosArray = JSON.parse(cachedVideos);
      videosArray[index] = updatedVideo;
      sessionStorage.setItem('videos', JSON.stringify(videosArray));
    }
  };

  const playVideo = (index: number, video: any) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      videoElement.src = video.videoUrl;
      videoElement.load();
      videoElement.play().catch((error: Error) => {
        console.error('Error playing video:', error);
        logAnalyticsEvent('video_play_error', { video: video.title, error: error.message });
      });
      logAnalyticsEvent('play_video', { video: video.title });
    }
  };

  const playOrPauseVideo = (index: number, video: any) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      if (videoElement.paused || videoElement.ended) {
        videoElement.play().catch((error: Error) => {
          console.error('Error playing video:', error);
          logAnalyticsEvent('video_play_error', { video: video.title, error: error.message });
        });
        logAnalyticsEvent('play_video', { video: video.title });
      } else {
        videoElement.pause();
        logAnalyticsEvent('pause_video', { video: video.title });
      }
    }
  };

  const toggleSize = (index: number) => {
    setEnlarged(index === enlarged ? -1 : index);
    logAnalyticsEvent(enlarged === index ? 'shrink_content' : 'enlarge_content', { 
      content_type: currentSelection === 'videos' ? 'video' : 'photo',
      content: currentSelection === 'videos' 
        ? videos[index]?.title 
        : photos[index]?.title || `photo_${index}`
    });
  };

  const requestFullScreen = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      try {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { /* Firefox */
          video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { /* IE/Edge */
          video.msRequestFullscreen();
        }
        logAnalyticsEvent('fullscreen_video', { video: videos[index]?.title });
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    }
  };

  const logAnalyticsEvent = (eventName: any, eventParams: any) => {
    logEvent(analytics, eventName, eventParams);
  };

  const handleVideoLoad = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      setVideoDimensions(prevDimensions => ({
        ...prevDimensions,
        [index]: { height: video.videoHeight, width: video.videoWidth }
      }));
    }
  };

  const handlePhotoLoad = (_index: number, photoElement: HTMLImageElement) => {
    // Apply appropriate class based on image dimensions
    if (photoElement.naturalWidth > photoElement.naturalHeight) {
      photoElement.classList.add('landscape');
    } else {
      photoElement.classList.add('portrait');
    }
  };

  // Filter content based on search and tags
  const getFilteredContent = () => {
    if (currentSelection === 'videos') {
      return videos.filter(video => {
        const matchesSearch = !searchQuery || 
          video.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || 
          video.tags?.includes(activeFilter);
        return matchesSearch && matchesFilter;
      });
    } else {
      return photos.filter(photo => {
        const matchesSearch = !searchQuery || 
          photo.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || 
          photo.tags?.includes(activeFilter);
        return matchesSearch && matchesFilter;
      });
    }
  };

  // Get unique tags from content
  const getAllTags = () => {
    const allItems = currentSelection === 'videos' ? videos : photos;
    const tagSet = new Set<string>();
    tagSet.add('all');
    
    allItems.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    
    return Array.from(tagSet);
  };

  const filteredContent = getFilteredContent();
  const allTags = getAllTags();

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <div className="mx-auto max-w-7xl p-4 py-6 sm:py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-white border border-gray-300 shadow-xl px-6 pb-12 pt-10 text-center sm:rounded-xl">
          {/* Header */}
          <div className="mx-auto justify-center pb-4 isolate flex -space-x-3 overflow-hidden">
            <img
              loading="lazy"
              className="relative z-30 inline-block h-16 w-16 sm:h-24 sm:w-24 rounded-full ring-2 ring-white shadow-lg"
              src={saylor}
              alt="Michael Saylor"
            />
            <img
              loading="lazy"
              className="relative z-20 inline-block h-16 w-16 sm:h-24 sm:w-24 rounded-full ring-2 ring-white shadow-lg"
              src={btc}
              alt="Bitcoin logo"
            />
          </div>
          
          <h1 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl mb-2">
            saylor memes
          </h1>
          
          <p className="mx-auto max-w-3xl text-sm sm:text-base text-gray-600 mb-4">
            directory of the highest quality, hand-picked, organic saylor content
          </p>
          
          {/* Social Share */}
          <div className='mb-6 flex justify-center space-x-2'>
            <TwitterShareButton
              url={'https://saylormemes.com'}
              title={'High grade @saylor memes'}
              className="transition-transform hover:scale-110">
              <TwitterIcon size={28} round={true} />
            </TwitterShareButton>
            <FacebookShareButton
              url={'https://saylormemes.com'}
              title={'High grade saylor memes'}
              className="transition-transform hover:scale-110">
              <FacebookIcon size={28} round={true} />
            </FacebookShareButton>
            <WhatsappShareButton
              url={'https://saylormemes.com'}
              title={'High grade saylor memes'}
              className="transition-transform hover:scale-110">
              <WhatsappIcon size={28} round={true} />
            </WhatsappShareButton>
          </div>
          
          {/* Content Type Tabs */}
          <div className="flex justify-center space-x-1 sm:space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-full text-sm sm:text-base transition-colors ${
                currentSelection === 'videos' 
                  ? 'bg-btc text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => {
                setCurrentSelection('videos');
                setEnlarged(-1);
                logAnalyticsEvent('view_videos', {});
              }}
            >
              videos
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm sm:text-base transition-colors ${
                currentSelection === 'photos' 
                  ? 'bg-btc text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => {
                setCurrentSelection('photos');
                setEnlarged(-1);
                logAnalyticsEvent('view_photos', {});
              }}
            >
              photos
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-btc/50"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            
            {allTags.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === tag 
                        ? 'bg-btc text-white shadow-sm' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="relative min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="w-12 h-12 border-t-2 border-b-2 border-btc rounded-full animate-spin mb-4"></div>
                <p>Loading {currentSelection}...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg">No {currentSelection} found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : currentSelection === 'videos' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((video, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all card-lift hover:shadow-md hover:border-btc/50"
                    style={{ maxWidth: enlarged === index ? '100%' : '400px' }}
                  >
                    <div 
                      onClick={() => togglePlay(index)} 
                      className="relative overflow-hidden cursor-pointer aspect-video bg-gray-100"
                    >
                      {/* Thumbnail as placeholder */}
                      <img 
                        src={video.thumbnailUrl} 
                        className={`${video.isPlaying ? 'hidden' : 'block'} w-full h-full object-cover`} 
                        alt={video.title} 
                        loading="lazy"
                      />
                      
                      {/* Play button overlay */}
                      {!video.isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/70 rounded-full p-3 sm:p-4 text-white transition-transform group-hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Video element */}
                      <video
                        className={`${video.isPlaying ? 'block' : 'hidden'} w-full h-full object-contain bg-black`}
                        ref={el => videoRefs.current[index] = el}
                        onLoadedMetadata={() => handleVideoLoad(index)}
                        controls={video.isPlaying}
                        controlsList="nodownload"
                        playsInline
                      >
                        <source data-src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{video.title}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {video.tags?.map((tag: string, tagIndex: number) => (
                          <span 
                            key={tagIndex}
                            className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <button 
                          className="text-btc font-medium hover:underline flex items-center" 
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay(index);
                          }}
                        >
                          {video.isPlaying ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Pause
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              Play
                            </>
                          )}
                        </button>
                        
                        <div className="flex space-x-2">
                          {videoDimensions[index]?.height > videoDimensions[index]?.width && (
                            <button 
                              className="text-gray-600 hover:text-btc flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSize(index);
                              }}
                            >
                              {enlarged === index ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Shrink
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                  </svg>
                                  Enlarge
                                </>
                              )}
                            </button>
                          )}
                          
                          {(video.videoUrl !== '' && videoRefs.current[index]?.src) && (
                            <button 
                              disabled={!video.isPlaying} 
                              className={`flex items-center ${video.isPlaying ? 'text-gray-600 hover:text-btc' : 'text-gray-400 cursor-not-allowed'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (video.isPlaying) requestFullScreen(index);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                              </svg>
                              Fullscreen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((photo, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all card-lift hover:shadow-md hover:border-btc/50"
                    style={{ maxWidth: '400px', height: '100%' }}
                  >
                    <div 
                      onClick={() => toggleSize(index)} 
                      className="relative overflow-hidden cursor-pointer bg-gray-100"
                    >
                      {/* Fixed aspect ratio container */}
                      <div className="aspect-square w-full flex items-center justify-center photo-wrapper">
                        <img
                          loading="lazy"
                          className="img-thumbnail max-h-full max-w-full"
                          src={photo.url}
                          alt={photo.title || `Saylor Meme ${index}`}
                          onLoad={(e) => handlePhotoLoad(index, e.currentTarget)}
                        />
                      </div>
                      
                      {/* Zoom icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/20 transition-opacity group-hover:opacity-100">
                        <div className="bg-black/70 rounded-full p-3 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{photo.title || `Saylor Meme ${index}`}</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {photo.tags?.map((tag: string, tagIndex: number) => (
                          <span 
                            key={tagIndex}
                            className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap justify-between gap-2 text-sm">
                        <button 
                          className="text-btc font-medium hover:underline flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSize(index);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          </svg>
                          View Full Size
                        </button>
                        
                        <a 
                          href={photo.url} 
                          target="_blank" 
                          download 
                          className="text-gray-600 hover:text-btc flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            logAnalyticsEvent('download_photo', { photo: photo.title || `photo_${index}` });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Modal for viewing enlarged photos */}
          {currentSelection === 'photos' && enlarged !== -1 && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => toggleSize(enlarged)}>
              <div className="max-h-[90vh] max-w-[90vw] relative">
                <img 
                  src={filteredContent[enlarged]?.url} 
                  alt={filteredContent[enlarged]?.title || `Enlarged photo`}
                  className="max-h-[90vh] max-w-[90vw] object-contain" 
                />
                <button 
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  onClick={() => toggleSize(enlarged)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              created by <a className='text-btc hover:underline' href='https://twitter.com/galleonlabs' target='_blank' rel="noopener noreferrer">@galleonlabs</a> (send us saylor memes)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App