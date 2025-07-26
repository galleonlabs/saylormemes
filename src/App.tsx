import './App.css';
import saylor from './assets/saylor.jpg';
import btc from './assets/btc.png';
import { useState, useEffect } from 'react';
import { TwitterShareButton, FacebookShareButton, TwitterIcon, FacebookIcon, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { 
  Header, 
  Footer, 
  MediaGrid, 
  SearchBar, 
  TagFilter, 
  PhotoModal, 
  LoadingSpinner, 
  EmptyState 
} from './components';
import { useFirebaseStorage, useMediaFiltering, useAnalytics } from './hooks';
import { MediaType, Photo } from './types';

function App() {
  const [currentSelection, setCurrentSelection] = useState<MediaType>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [enlargedPhoto, setEnlargedPhoto] = useState<Photo | null>(null);
  
  const { videos, photos, isLoading, loadVideoUrl, setVideos } = useFirebaseStorage();
  const { filteredContent, availableTags } = useMediaFiltering(
    videos, 
    photos, 
    currentSelection, 
    searchQuery, 
    activeFilter
  );
  const { logAnalyticsEvent } = useAnalytics();

  useEffect(() => {
    if (currentSelection === 'videos') {
      logAnalyticsEvent('view_videos');
    } else {
      logAnalyticsEvent('view_photos');
    }
  }, [currentSelection, logAnalyticsEvent]);

  useEffect(() => {
    if (searchQuery) {
      logAnalyticsEvent('search', { search_term: searchQuery });
    }
  }, [searchQuery, logAnalyticsEvent]);

  useEffect(() => {
    if (activeFilter !== 'all') {
      logAnalyticsEvent('filter_by_tag', { tag: activeFilter });
    }
  }, [activeFilter, logAnalyticsEvent]);

  const handleTogglePlay = (index: number) => {
    setVideos(prevVideos => 
      prevVideos.map((video, i) => ({
        ...video,
        isPlaying: i === index ? !video.isPlaying : false
      }))
    );
  };

  const handleEnlargePhoto = (photo: Photo) => {
    setEnlargedPhoto(photo);
    logAnalyticsEvent('enlarge_photo', {
      photo_title: photo.title
    });
  };

  const shareUrl = 'https://saylormemes.com';
  const shareTitle = 'Check out the ultimate collection of Michael Saylor memes!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-elevated p-6 sm:p-10 animate-fade-in">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center -space-x-6 mb-8">
              <img
                className="relative z-20 h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white shadow-elevated transform transition-transform duration-500 hover:scale-105"
                src={saylor}
                alt="Michael Saylor"
                loading="eager"
              />
              <img
                className="relative z-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white shadow-elevated animate-bounce-slow"
                src={btc}
                alt="Bitcoin"
                loading="eager"
              />
            </div>
            
            <Header />
            
            {/* Social Sharing */}
            <div className="flex justify-center gap-3 mt-6">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 rounded-xl transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle hover:-translate-y-0.5 active:scale-95">
                  <TwitterIcon size={20} round />
                  <span className="text-sm font-medium text-neutral-700">Share</span>
                </div>
              </TwitterShareButton>
              <FacebookShareButton url={shareUrl} title={shareTitle}>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 rounded-xl transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle hover:-translate-y-0.5 active:scale-95">
                  <FacebookIcon size={20} round />
                  <span className="text-sm font-medium text-neutral-700">Share</span>
                </div>
              </FacebookShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 rounded-xl transition-all duration-250 hover:bg-neutral-200 hover:shadow-subtle hover:-translate-y-0.5 active:scale-95">
                  <WhatsappIcon size={20} round />
                  <span className="text-sm font-medium text-neutral-700">Share</span>
                </div>
              </WhatsappShareButton>
            </div>
          </div>

          {/* Media Type Selector */}
          <div className="flex justify-center mb-10 mt-10">
            <div className="inline-flex rounded-2xl bg-neutral-100 p-1.5">
              <button
                onClick={() => setCurrentSelection('videos')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-350 ${
                  currentSelection === 'videos'
                    ? 'bg-white text-neutral-900 shadow-subtle'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Videos ({videos.length})
              </button>
              <button
                onClick={() => setCurrentSelection('photos')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-350 ${
                  currentSelection === 'photos'
                    ? 'bg-white text-neutral-900 shadow-subtle'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Photos ({photos.length})
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <TagFilter 
              availableTags={availableTags} 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter} 
            />
          </div>

          {/* Content Area */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredContent.length === 0 ? (
            <EmptyState searchQuery={searchQuery} activeFilter={activeFilter} />
          ) : (
            <MediaGrid
              mediaType={currentSelection}
              videos={filteredContent as any}
              photos={filteredContent as any}
              onLoadVideo={loadVideoUrl}
              onTogglePlay={handleTogglePlay}
              onEnlargePhoto={handleEnlargePhoto}
              logAnalyticsEvent={logAnalyticsEvent}
            />
          )}

          <Footer />
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal photo={enlargedPhoto} onClose={() => setEnlargedPhoto(null)} />
    </div>
  );
}

export default App;